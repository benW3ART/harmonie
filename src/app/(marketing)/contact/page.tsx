'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, Instagram, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@coaching-parental.fr',
    href: 'mailto:contact@coaching-parental.fr',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '06 XX XX XX XX',
    href: 'tel:+33600000000',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@coaching.parental',
    href: 'https://instagram.com/coaching.parental',
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // TODO: Implement actual contact form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSent(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Contact
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Une question ? N'hésitez pas à me contacter, je vous réponds sous 24h.
            </p>
          </div>
        </div>
      </section>

      {/* Contact form & info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            {/* Contact form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Envoyez-moi un message</CardTitle>
                <CardDescription>
                  Je vous répondrai dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sent ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold">
                      Message envoyé !
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Merci pour votre message. Je vous répondrai sous 24h.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Votre nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.fr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Le sujet de votre message"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Votre message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={loading}
                        rows={5}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le message'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Autres moyens de contact
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Vous pouvez également me joindre directement.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <p className="font-medium">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="rounded-lg bg-secondary/50 p-6">
                <h3 className="font-heading text-lg font-semibold">
                  Préférez un entretien ?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Réservez un créneau gratuit de 30 minutes pour échanger de vive voix.
                </p>
                <Link href="/rdv" className="mt-4 block">
                  <Button variant="outline" className="w-full">
                    Réserver un créneau
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
