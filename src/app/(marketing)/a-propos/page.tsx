import Link from 'next/link'
import { ArrowRight, Heart, Award, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const values = [
  {
    icon: Heart,
    title: 'Bienveillance',
    description: "Aucun jugement, que de l'empathie. Chaque parent fait de son mieux avec les ressources qu'il a.",
  },
  {
    icon: Award,
    title: 'Expertise',
    description: 'Formations certifiées et expérience terrain pour vous offrir un accompagnement de qualité.',
  },
  {
    icon: Users,
    title: 'Personnalisation',
    description: "Chaque famille est unique. Mes conseils s'adaptent à votre situation, vos valeurs, votre enfant.",
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: "L'IA comme alliée, pas comme substitut. Le meilleur de la technologie au service de l'humain.",
  },
]

const certifications = [
  'Certification en accompagnement parental',
  'Formation en sommeil du nourrisson et de l\'enfant',
  'Spécialisation en nutrition pédiatrique',
  'Formation en gestion des émotions',
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              À propos de moi
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Coach parentale certifiée, maman et passionnée par l'accompagnement des familles.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg">
              <h2 className="font-heading text-3xl font-bold text-foreground">Mon histoire</h2>
              <p className="text-muted-foreground">
                Comme beaucoup de mamans, j'ai vécu ces nuits sans sommeil, ces moments de doute
                face aux pleurs de mon enfant, cette charge mentale qui pèse au quotidien.
              </p>
              <p className="text-muted-foreground">
                C'est cette expérience personnelle, combinée à mes formations professionnelles,
                qui m'a poussée à créer un accompagnement différent. Un accompagnement qui
                comprend vraiment ce que vous vivez, parce que je l'ai vécu aussi.
              </p>
              <p className="text-muted-foreground">
                Aujourd'hui, j'aide les familles à retrouver sérénité et équilibre grâce à une
                approche unique : l'alliance de mon expertise humaine et d'une IA bienveillante
                disponible 24h/24.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Mes valeurs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Les principes qui guident chaque accompagnement.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-foreground text-center">
              Formations et certifications
            </h2>
            <ul className="mt-8 space-y-4">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4"
                >
                  <Award className="h-5 w-5 text-primary" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white">
              Envie d'échanger ?
            </h2>
            <p className="mt-4 text-white/80">
              Réservez un entretien découverte gratuit pour faire connaissance.
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
