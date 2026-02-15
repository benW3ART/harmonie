'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/helpers'

export default function ParametresPage() {
  const [profile, setProfile] = useState<Pick<Profile, 'first_name' | 'email'> | null>(null)
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('first_name, email')
        .eq('id', user.id)
        .single()

      const profileData = data as Pick<Profile, 'first_name' | 'email'> | null
      if (profileData) {
        setProfile(profileData)
        setFirstName(profileData.first_name || '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ first_name: firstName } as never)
        .eq('id', user.id)

      setProfile((prev) => prev ? { ...prev, first_name: firstName } : null)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    try {
      // Note: Account deletion should be handled via an API route with proper security
      const { error } = await supabase.rpc('delete_user_account')
      if (error) throw error

      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      setDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez votre compte et vos préférences.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil
          </CardTitle>
          <CardDescription>
            Vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Votre prénom"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              L'email ne peut pas être modifié.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les paramètres de notifications seront bientôt disponibles.
          </p>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Abonnement
          </CardTitle>
          <CardDescription>
            Gérez votre abonnement et vos paiements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Accompagnement mensuel</p>
                <p className="text-sm text-muted-foreground">
                  500€ / mois
                </p>
              </div>
              <Button variant="outline" size="sm">
                Gérer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Confidentialité
          </CardTitle>
          <CardDescription>
            Vos données et votre vie privée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            Télécharger mes données
          </Button>
          <p className="text-sm text-muted-foreground">
            Téléchargez une copie de toutes vos données.
          </p>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>

          <div className="border-t pt-4">
            <p className="mb-2 text-sm text-muted-foreground">
              {deleteConfirm
                ? 'Êtes-vous sûre ? Cette action est irréversible.'
                : 'Supprimer définitivement votre compte et toutes vos données.'}
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteConfirm ? 'Confirmer la suppression' : 'Supprimer mon compte'}
            </Button>
            {deleteConfirm && (
              <Button
                variant="ghost"
                className="ml-2"
                onClick={() => setDeleteConfirm(false)}
              >
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
