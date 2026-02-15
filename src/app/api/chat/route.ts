// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

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

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages' },
        { status: 400 }
      )
    }

    // Get family context
    const { data: family } = await supabase
      .from('families')
      .select('*, children(*)')
      .eq('parent_id', user.id)
      .single()

    // Build context about the family
    let familyContext = ''
    if (family) {
      familyContext = `\n\nContexte famille:\n`
      if (family.children && family.children.length > 0) {
        familyContext += `Enfants: ${family.children.map((child: { first_name: string; birth_date: string }) => {
          const age = calculateAge(child.birth_date)
          return `${child.first_name} (${age})`
        }).join(', ')}`
      }
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + familyContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    // Extract text content from response
    const textContent = response.content.find((block) => block.type === 'text')
    const content = textContent ? textContent.text : ''

    // Store conversation in database
    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('family_id', family?.id)
      .eq('channel', 'web')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let conversationId = conversation?.id

    if (!conversationId) {
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({
          family_id: family?.id,
          channel: 'web',
        })
        .select()
        .single()
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
          content,
        },
      ])
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate)
  const today = new Date()
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())

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
