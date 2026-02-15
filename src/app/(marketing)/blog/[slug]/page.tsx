import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

// Demo blog posts (will be replaced with database content)
const demoPosts = [
  {
    id: '1',
    slug: 'comment-aider-bebe-faire-ses-nuits',
    title: 'Comment aider bébé à faire ses nuits ?',
    excerpt: 'Découvrez les méthodes douces et respectueuses pour accompagner votre enfant vers des nuits complètes.',
    content: `
## Le sommeil de bébé : un sujet qui préoccupe tous les parents

Tous les parents rêvent de nuits complètes. Pourtant, les réveils nocturnes font partie du développement normal de l'enfant. Voici comment les accompagner en douceur.

## Comprendre les cycles de sommeil de bébé

Les bébés n'ont pas les mêmes cycles de sommeil que les adultes. Leurs cycles sont plus courts (environ 50-60 minutes contre 90-120 pour un adulte) et ils passent plus de temps en sommeil léger.

C'est pourquoi ils se réveillent plus facilement et plus souvent.

## Les conditions optimales pour un bon sommeil

### La chambre
- Température idéale : 18-20°C
- Obscurité suffisante
- Bruit blanc si nécessaire

### La routine du soir
- Horaires réguliers
- Activités calmes 30 minutes avant
- Rituel du coucher (histoire, câlin, chanson)

## Quand consulter ?

Si malgré vos efforts, votre enfant :
- Se réveille plus de 3-4 fois par nuit après 6 mois
- Met plus d'une heure à s'endormir
- Semble fatigué en permanence

N'hésitez pas à demander de l'aide. Un accompagnement personnalisé peut faire toute la différence.
    `,
    category: 'Sommeil',
    read_time: 8,
    published_at: '2024-01-15',
    image_url: null,
    author: 'Coach Parentale',
  },
]

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = demoPosts.find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Article non trouvé' }
  }

  return {
    title: `${post.title} | Coaching Parental`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Try to fetch from database, fallback to demo posts
  let post = demoPosts.find((p) => p.slug === slug)

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (data) {
      post = data
    }
  } catch {
    // Use demo post on error
  }

  if (!post) {
    notFound()
  }

  return (
    <article>
      {/* Header */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au blog
            </Link>
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.published_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time} min de lecture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="prose prose-lg mx-auto max-w-3xl">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />').replace(/## /g, '<h2>').replace(/### /g, '<h3>') }} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold">
              Besoin d'un accompagnement personnalisé ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Chaque famille est unique. Réservez un entretien découverte gratuit pour en discuter.
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
    </article>
  )
}
