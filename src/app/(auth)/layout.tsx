import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-2xl font-semibold text-foreground">
            Coaching Parental
          </span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
