import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `Tu es une assistante de coaching parental bienveillante et empathique. Tu travailles pour "Coaching Parental", un service d'accompagnement des familles sur le sommeil, la nutrition et le comportement des enfants de 4 mois à 8 ans.

Ton rôle:
- Écouter avec empathie les préoccupations des parents
- Donner des conseils pratiques et personnalisés
- Rassurer sans minimiser les difficultés
- Proposer des solutions douces et respectueuses de l'enfant
- Encourager et valoriser les efforts des parents

Ton style:
- Chaleureux et bienveillant
- Professionnel mais accessible
- Utilise le "tu" et un ton maternel/amical
- Réponds en français
- Sois concise mais complète

Important:
- Ne jamais donner de conseils médicaux
- Recommander de consulter un professionnel de santé si nécessaire
- Ne jamais juger les choix parentaux
- Toujours rappeler que chaque enfant est unique

Si le parent semble en grande détresse ou mentionne des pensées sombres, encourage-le à contacter un professionnel de santé ou le 3114 (numéro national de prévention du suicide).`

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user (for rate limiting key)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rate limiting
    const rateLimitKey = user?.id || request.headers.get('x-forwarded-for') || 'anonymous'
    const config = user ? RATE_LIMITS.AUTHENTICATED : RATE_LIMITS.UNAUTHENTICATED
    const result = rateLimit(rateLimitKey, config.limit, config.windowMs)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'Retry-After': Math.ceil((result.reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    // Get family context
    const { data: familyData } = await supabase
      .from('families')
      .select('*, children(*)')
      .eq('parent_id', user.id)
      .single()

    interface FamilyWithChildren {
      id: string
      children?: Array<{ first_name: string; birth_date: string }>
    }
    const family = familyData as FamilyWithChildren | null

    // Build context about the family
    let familyContext = ''
    if (family) {
      familyContext = `\n\nContexte famille:\n`
      if (family.children && family.children.length > 0) {
        familyContext += `Enfants: ${family.children
          .map((child) => {
            const age = calculateAge(child.birth_date)
            return `${child.first_name} (${age})`
          })
          .join(', ')}`
      }
    }

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + familyContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    // Create a TransformStream to convert Anthropic events to SSE
    const encoder = new TextEncoder()
    let fullContent = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const text = event.delta.text
              fullContent += text
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              )
            }
          }

          // Send done event
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()

          // Store conversation in database (async, don't wait)
          storeConversation(supabase, family?.id, messages, fullContent).catch(
            console.error
          )
        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.reset.toString(),
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function storeConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  familyId: string | undefined,
  messages: { role: string; content: string }[],
  assistantContent: string
) {
  if (!familyId) return

  try {
    // Get or create conversation
    const { data: conversationData } = await supabase
      .from('conversations')
      .select('id')
      .eq('family_id', familyId)
      .eq('channel', 'web')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const conversation = conversationData as { id: string } | null
    let conversationId = conversation?.id

    if (!conversationId) {
      const { data: newConversationData } = await supabase
        .from('conversations')
        .insert({
          family_id: familyId,
          channel: 'web',
        } as never)
        .select()
        .single()
      const newConversation = newConversationData as { id: string } | null
      conversationId = newConversation?.id
    }

    // Store messages
    if (conversationId) {
      const lastUserMessage = messages[messages.length - 1]
      await supabase.from('messages').insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: lastUserMessage.content,
        },
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantContent,
        },
      ] as never)
    }
  } catch (error) {
    console.error('Error storing conversation:', error)
  }
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const today = new Date()
  const months =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    (today.getMonth() - birth.getMonth())

  if (months < 12) {
    return `${months} mois`
  } else {
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    if (remainingMonths === 0) {
      return `${years} an${years > 1 ? 's' : ''}`
    }
    return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`
  }
}
