import Link from 'next/link'
import { Check, ArrowRight, Clock, MessageCircle, Target, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

const offers = [
  {
    name: 'Entretien découverte',
    price: 'Gratuit',
    description: 'Un premier échange pour comprendre votre situation et voir comment je peux vous aider.',
    duration: '30 minutes',
    features: [
      'Échange sur votre situation',
      'Comprendre vos besoins',
      'Présentation de mon approche',
      'Questions/réponses',
    ],
    cta: 'Réserver mon créneau',
    href: '/rdv',
    popular: false,
  },
  {
    name: 'Accompagnement mensuel',
    price: '500€',
    unit: '/mois',
    description: "L'accompagnement complet avec coach + IA pour transformer durablement votre quotidien.",
    duration: '1 mois',
    features: [
      'Questionnaire de diagnostic complet',
      'Bilans hebdomadaires avec moi',
      'Accès app avec IA 24h/24',
      'Journal de bord auto-rempli',
      'Objectifs et réflexes personnalisés',
      'Chat WhatsApp ou Instagram',
      'Escalade vers moi si crise',
    ],
    cta: "Commencer l'accompagnement",
    href: '/rdv',
    popular: true,
  },
  {
    name: 'Séance ponctuelle',
    price: '50€',
    description: 'Une consultation unique pour un conseil ciblé ou un suivi ponctuel.',
    duration: '45 minutes',
    features: [
      'Échange approfondi',
      'Conseils personnalisés',
      'Plan d\'action concret',
      'Support par email après',
    ],
    cta: 'Réserver une séance',
    href: '/rdv',
    popular: false,
  },
]

const included = [
  {
    icon: MessageCircle,
    title: 'IA bienveillante 24h/24',
    description: "À 3h du matin quand vous êtes épuisée, l'IA est là pour vous guider avec mes méthodes.",
  },
  {
    icon: BookOpen,
    title: 'Journal auto-rempli',
    description: "L'IA résume vos conversations et remplit votre journal. Zéro charge mentale en plus.",
  },
  {
    icon: Target,
    title: 'Objectifs personnalisés',
    description: 'Je définis des objectifs adaptés à votre situation, vous les suivez dans l\'app.',
  },
  {
    icon: Clock,
    title: 'Réflexes quotidiens',
    description: 'Des habitudes simples à ancrer chaque jour pour des résultats durables.',
  },
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Services et tarifs
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Un accompagnement sur-mesure pour retrouver sérénité et équilibre familial.
            </p>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {offers.map((offer) => (
              <Card
                key={offer.name}
                className={offer.popular ? 'border-2 border-primary relative' : ''}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                      Le plus populaire
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-heading">{offer.name}</CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{offer.price}</span>
                    {offer.unit && (
                      <span className="text-muted-foreground">{offer.unit}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.duration}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {offer.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={offer.href} className="w-full">
                    <Button
                      className="w-full"
                      variant={offer.popular ? 'default' : 'outline'}
                    >
                      {offer.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Ce qui est inclus dans l'app
            </h2>
            <p className="mt-4 text-muted-foreground">
              L'accompagnement mensuel inclut l'accès complet à l'application web.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {included.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Prête à commencer ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Réservez un entretien découverte gratuit pour en discuter ensemble.
            </p>
            <div className="mt-8">
              <Link href="/rdv">
                <Button size="lg">
                  Réserver mon entretien gratuit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
