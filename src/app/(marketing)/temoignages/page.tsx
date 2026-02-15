import Link from 'next/link'
import { ArrowRight, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Marie L.',
    childAge: '8 mois',
    situation: 'Problèmes de sommeil',
    quote: "En 2 semaines, Léa faisait enfin ses nuits. Je revis ! L'IA m'a vraiment aidée dans les moments difficiles à 3h du matin.",
    result: 'Nuits complètes en 2 semaines',
    featured: true,
  },
  {
    name: 'Sophie D.',
    childAge: '2 ans',
    situation: 'Crises de colère',
    quote: "L'approche bienveillante m'a aidée à comprendre les crises de mon fils. On a retrouvé une harmonie familiale.",
    result: 'Crises réduites de 80%',
    featured: true,
  },
  {
    name: 'Claire M.',
    childAge: '6 mois',
    situation: 'Organisation des siestes',
    quote: "Le journal auto-rempli par l'IA, c'est génial ! Zéro charge mentale en plus et un suivi parfait.",
    result: 'Siestes régulières établies',
    featured: true,
  },
  {
    name: 'Émilie R.',
    childAge: '18 mois',
    situation: 'Diversification difficile',
    quote: "Mon fils refusait tout nouvel aliment. Grâce aux conseils personnalisés, il découvre maintenant les légumes avec plaisir.",
    result: 'Alimentation variée en 1 mois',
    featured: false,
  },
  {
    name: 'Julie P.',
    childAge: '3 ans',
    situation: 'Anxiété de séparation',
    quote: "Les astuces quotidiennes via l'app ont transformé nos matins. Plus de pleurs à la crèche !",
    result: 'Séparations sereines',
    featured: false,
  },
  {
    name: 'Laura B.',
    childAge: '10 mois',
    situation: 'Endormissement autonome',
    quote: "Je ne pensais pas que c'était possible sans laisser pleurer. Merci pour cette méthode douce qui a marché !",
    result: 'Endormissement autonome acquis',
    featured: false,
  },
  {
    name: 'Camille T.',
    childAge: '4 ans',
    situation: 'Gestion des écrans',
    quote: "Réduire les écrans semblait impossible. Avec les alternatives proposées, mon fils demande maintenant à jouer dehors.",
    result: 'Temps d\'écran divisé par 3',
    featured: false,
  },
  {
    name: 'Pauline G.',
    childAge: '14 mois',
    situation: 'Réveils nocturnes multiples',
    quote: "5 à 6 réveils par nuit, j'étais épuisée. En 3 semaines, on est passé à 1 seul réveil maximum.",
    result: 'Nuits quasi-complètes',
    featured: false,
  },
]

export default function TestimonialsPage() {
  const featuredTestimonials = testimonials.filter((t) => t.featured)
  const otherTestimonials = testimonials.filter((t) => !t.featured)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Témoignages
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Découvrez les histoires de familles qui ont retrouvé sérénité et équilibre.
            </p>
          </div>
        </div>
      </section>

      {/* Featured testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {featuredTestimonials.map((testimonial) => (
              <Card key={testimonial.name} className="relative">
                <CardContent className="pt-8">
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-primary/20" />
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
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Enfant de {testimonial.childAge} • {testimonial.situation}
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success-foreground">
                      {testimonial.result}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More testimonials */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-heading text-3xl font-bold">
            Plus de témoignages
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {otherTestimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="flex-1">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.childAge} • {testimonial.situation}
                        </p>
                      </div>
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success-foreground">
                        {testimonial.result}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-primary">95%</div>
              <p className="mt-2 text-muted-foreground">de familles satisfaites</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">2 semaines</div>
              <p className="mt-2 text-muted-foreground">pour voir des résultats</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">24/7</div>
              <p className="mt-2 text-muted-foreground">accompagnement disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white">
              Prête à écrire votre propre succès ?
            </h2>
            <p className="mt-4 text-white/80">
              Rejoignez les familles qui ont retrouvé sérénité et équilibre.
            </p>
            <div className="mt-8">
              <Link href="/rdv">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-white/90"
                >
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
