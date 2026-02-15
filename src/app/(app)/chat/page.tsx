'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Bonjour ! Je suis votre assistant de coaching parental. Comment puis-je vous aider aujourd'hui ? N'hésitez pas à me poser toutes vos questions sur le sommeil, la nutrition ou le comportement de votre enfant.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setError(null)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const assistantMessageId = (Date.now() + 1).toString()

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ])
    setInput('')
    setIsLoading(true)

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          throw new Error(
            `Trop de messages envoyés. Réessayez dans ${retryAfter || '60'} secondes.`
          )
        }
        throw new Error('Impossible d\'envoyer le message')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              continue
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                accumulatedContent += parsed.text
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                )
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, isStreaming: false } : m
        )
      )
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, do nothing
        return
      }

      console.error('Chat error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMsg)

      // Remove the empty assistant message or update with error
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: 'Désolée, une erreur est survenue. Pouvez-vous réessayer ?',
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold">Chat avec l'IA</h1>
        <p className="text-sm text-muted-foreground">
          Disponible 24h/24 pour vous accompagner
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-xs underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-lg border bg-card p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2',
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-secondary'
                )}
              >
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                  {message.isStreaming && (
                    <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current" />
                  )}
                </p>
                {!message.isStreaming && (
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      message.role === 'user'
                        ? 'text-white/60'
                        : 'text-muted-foreground'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
            className="resize-none"
          />
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-full w-12"
              onClick={handleStop}
            >
              <span className="sr-only">Arrêter</span>
              <div className="h-4 w-4 rounded-sm bg-white" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="h-full w-12"
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Entrée pour envoyer • Shift+Entrée pour nouvelle ligne
        </p>
      </form>
    </div>
  )
}
