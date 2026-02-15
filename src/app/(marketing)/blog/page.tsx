import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

// Demo blog posts (will be replaced with database content)
const demoPosts = [
  {
    id: '1',
    slug: 'comment-aider-bebe-faire-ses-nuits',
    title: 'Comment aider bébé à faire ses nuits ?',
    excerpt: 'Découvrez les méthodes douces et respectueuses pour accompagner votre enfant vers des nuits complètes.',
    category: 'Sommeil',
    read_time: 8,
    published_at: '2024-01-15',
    image_url: null,
  },
  {
    id: '2',
    slug: 'gerer-les-crises-de-colere-2-ans',
    title: 'Gérer les crises de colère à 2 ans',
    excerpt: 'Le "terrible two" n\'est pas une fatalité. Voici comment accompagner les émotions de votre enfant.',
    category: 'Comportement',
    read_time: 6,
    published_at: '2024-01-10',
    image_url: null,
  },
  {
    id: '3',
    slug: 'diversification-alimentaire-guide-complet',
    title: 'Diversification alimentaire : le guide complet',
    excerpt: 'Quand commencer ? Par quels aliments ? Toutes les réponses à vos questions sur la diversification.',
    category: 'Nutrition',
    read_time: 12,
    published_at: '2024-01-05',
    image_url: null,
  },
  {
    id: '4',
    slug: 'routine-du-soir-enfant-serein',
    title: 'Créer une routine du soir pour un enfant serein',
    excerpt: 'Une routine bien pensée facilite l\'endormissement et renforce le lien parent-enfant.',
    category: 'Sommeil',
    read_time: 5,
    published_at: '2024-01-01',
    image_url: null,
  },
]

const categories = [
  { name: 'Tous', slug: '' },
  { name: 'Sommeil', slug: 'sommeil' },
  { name: 'Nutrition', slug: 'nutrition' },
  { name: 'Comportement', slug: 'comportement' },
]

export default async function BlogPage() {
  const supabase = await createClient()

  // Try to fetch from database, fallback to demo posts
  let posts = demoPosts

  try {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (data && data.length > 0) {
      posts = data
    }
  } catch {
    // Use demo posts on error
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              Blog
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Conseils, astuces et ressources pour accompagner votre enfant au quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.slug ? `/blog?category=${category.slug}` : '/blog'}
              >
                <Badge
                  variant={category.slug === '' ? 'default' : 'secondary'}
                  className="cursor-pointer px-4 py-2"
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  {post.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.read_time} min
                      </span>
                    </div>
                    <CardTitle className="font-heading line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="flex items-center text-sm font-medium text-primary">
                      Lire l'article
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
