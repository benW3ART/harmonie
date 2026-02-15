import Link from 'next/link'
import {
  Moon,
  Apple,
  Brain,
  MessageCircle,
  Clock,
  Heart,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  {
    icon: Moon,
    title: 'Sommeil',
    description: 'Retrouvez des nuits paisibles pour toute la famille grâce à des méthodes douces et personnalisées.',
  },
  {
    icon: Apple,
    title: 'Nutrition',
    description: "Accompagnement pour les repas difficiles, diversification alimentaire et habitudes saines.",
  },
  {
    icon: Brain,
    title: 'Comportement',
    description: 'Comprendre et accompagner les émotions de votre enfant avec bienveillance.',
  },
]

const features = [
  {
    icon: MessageCircle,
    title: 'IA disponible 24h/24',
    description: "À 3h du matin quand bébé pleure, l'IA est là pour vous guider et vous rassurer.",
  },
  {
    icon: Heart,
    title: 'Coach humaine',
    description: 'Bilans hebdomadaires avec une coach certifiée pour les moments clés.',
  },
  {
    icon: Clock,
    title: 'Suivi personnalisé',
    description: "Un mois complet d'accompagnement adapté à votre situation unique.",
  },
]

const testimonials = [
  {
    name: 'Marie L.',
    childAge: '8 mois',
    quote: "En 2 semaines, Léa faisait enfin ses nuits. Je revis ! L'IA m'a vraiment aidée dans les moments difficiles à 3h du matin.",
    result: 'Nuits complètes en 2 semaines',
  },
  {
    name: 'Sophie D.',
    childAge: '2 ans',
    quote: "L'approche bienveillante m'a aidée à comprendre les crises de mon fils. On a retrouvé une harmonie familiale.",
    result: 'Crises réduites de 80%',
  },
  {
    name: 'Claire M.',
    childAge: '6 mois',
    quote: "Le journal auto-rempli par l'IA, c'est génial ! Zéro charge mentale en plus et un suivi parfait.",
    result: 'Siestes régulières établies',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Alléger la{' '}
              <span className="text-primary">charge mentale</span>{' '}
              des mamans
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Accompagnement personnalisé en sommeil, nutrition et comportement
              pour les enfants de 4 mois à 8 ans. Une coach certifiée + une IA
              bienveillante disponible 24h/24.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/rdv">
                <Button size="lg" className="w-full sm:w-auto">
                  Prendre RDV gratuit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Découvrir les services
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Entretien découverte gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Sans engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Un accompagnement complet
            </h2>
            <p className="mt-4 text-muted-foreground">
              Je vous accompagne sur les trois piliers essentiels du bien-être
              de votre enfant.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Le meilleur des deux mondes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une approche unique combinant expertise humaine et accompagnement
              IA 24h/24.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Elles ont retrouvé leurs nuits
            </h2>
            <p className="mt-4 text-muted-foreground">
              Découvrez les histoires de familles qui ont transformé leur
              quotidien.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Enfant de {testimonial.childAge}
                      </p>
                    </div>
                    <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success-foreground">
                      {testimonial.result}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/temoignages">
              <Button variant="outline">
                Voir tous les témoignages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              Prête à retrouver des nuits paisibles ?
            </h2>
            <p className="mt-4 text-white/80">
              Réservez votre entretien découverte gratuit et parlons de votre
              situation ensemble.
            </p>
            <div className="mt-8">
              <Link href="/rdv">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Prendre RDV gratuit
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
