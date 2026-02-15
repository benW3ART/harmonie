'use client'

import { useEffect } from 'react'
import { ArrowRight, Clock, Video, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const benefits = [
  'Échange sur votre situation personnelle',
  'Comprendre vos besoins et défis',
  'Présentation de mon approche',
  'Réponses à toutes vos questions',
  'Sans engagement',
]

export default function RdvPage() {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script')
    script.src = 'https://cal.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openCalendar = () => {
    // @ts-expect-error Cal is loaded via script
    if (typeof window !== 'undefined' && window.Cal) {
      // @ts-expect-error Cal is loaded via script
      window.Cal('openModal', {
        calLink: 'coaching-parental/decouverte',
        config: {
          layout: 'month_view',
        },
      })
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Réservez votre entretien découverte
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              30 minutes gratuites pour faire connaissance et voir comment je peux vous aider.
            </p>
          </div>
        </div>
      </section>

      {/* Booking section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Entretien découverte gratuit
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Un premier échange pour comprendre votre situation et voir comment je peux vous accompagner.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">30 minutes</p>
                  <p className="text-sm text-muted-foreground">Durée de l'entretien</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Visioconférence</p>
                  <p className="text-sm text-muted-foreground">Via Google Meet ou Zoom</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold">Ce que nous aborderons :</p>
                <ul className="space-y-2">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Calendar */}
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="font-heading text-xl font-semibold">
                    Choisissez votre créneau
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Sélectionnez une date et une heure qui vous conviennent.
                  </p>
                  <Button
                    onClick={openCalendar}
                    size="lg"
                    className="mt-6"
                  >
                    Voir les disponibilités
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center font-heading text-2xl font-bold">
              Questions fréquentes
            </h2>
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold">L'entretien est-il vraiment gratuit ?</h3>
                <p className="mt-1 text-muted-foreground">
                  Oui, l'entretien découverte de 30 minutes est 100% gratuit et sans engagement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Comment se déroule l'entretien ?</h3>
                <p className="mt-1 text-muted-foreground">
                  Nous nous retrouvons en visio (Google Meet ou Zoom). Je vous enverrai le lien par email après votre réservation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Que dois-je préparer ?</h3>
                <p className="mt-1 text-muted-foreground">
                  Rien de particulier ! Venez simplement avec vos questions et votre situation en tête.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Puis-je annuler ou reporter ?</h3>
                <p className="mt-1 text-muted-foreground">
                  Bien sûr ! Vous pouvez modifier votre réservation jusqu'à 24h avant l'entretien via le lien dans l'email de confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
