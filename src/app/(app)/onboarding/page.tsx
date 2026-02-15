// @ts-nocheck
// TODO: Remove ts-nocheck after running `npx supabase gen types typescript` with actual database
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Loader2, Heart, Moon, Apple, Brain, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'

const steps = [
  { id: 1, name: 'Bienvenue', description: 'Présentation' },
  { id: 2, name: 'Famille', description: 'Votre famille' },
  { id: 3, name: 'Enfants', description: 'Vos enfants' },
  { id: 4, name: 'Besoins', description: 'Vos besoins' },
  { id: 5, name: 'Terminé', description: 'C\'est parti !' },
]

const concerns = [
  { id: 'sleep', label: 'Sommeil', icon: Moon },
  { id: 'nutrition', label: 'Nutrition', icon: Apple },
  { id: 'behavior', label: 'Comportement', icon: Brain },
]

interface Child {
  firstName: string
  birthDate: string
  gender: 'M' | 'F' | ''
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [familyName, setFamilyName] = useState('')
  const [children, setChildren] = useState<Child[]>([{ firstName: '', birthDate: '', gender: '' }])
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [mainChallenge, setMainChallenge] = useState('')
  const [goals, setGoals] = useState('')

  const addChild = () => {
    setChildren([...children, { firstName: '', birthDate: '', gender: '' }])
  }

  const updateChild = (index: number, field: keyof Child, value: string) => {
    const updated = [...children]
    updated[index] = { ...updated[index], [field]: value }
    setChildren(updated)
  }

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index))
    }
  }

  const toggleConcern = (concernId: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concernId)
        ? prev.filter((id) => id !== concernId)
        : [...prev, concernId]
    )
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          parent_id: user.id,
          name: familyName || 'Ma famille',
          onboarding_completed: true,
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Create children
      for (const child of children) {
        if (child.firstName && child.birthDate) {
          await supabase.from('children').insert({
            family_id: family.id,
            first_name: child.firstName,
            birth_date: child.birthDate,
            gender: child.gender || null,
          })
        }
      }

      // Create questionnaire
      await supabase.from('questionnaires').insert({
        family_id: family.id,
        type: 'onboarding',
        responses: {
          concerns: selectedConcerns,
          main_challenge: mainChallenge,
          goals,
        },
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Onboarding error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/50 to-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-12 md:w-24 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-heading text-2xl">
                    Bienvenue dans votre espace
                  </CardTitle>
                  <CardDescription className="text-base">
                    Prenons quelques minutes pour personnaliser votre accompagnement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-center text-muted-foreground">
                    Je vais vous poser quelques questions pour mieux comprendre votre situation
                    et personnaliser mes conseils.
                  </p>
                  <Button className="w-full" onClick={nextStep}>
                    C'est parti !
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Family */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">
                    Votre famille
                  </CardTitle>
                  <CardDescription>
                    Comment souhaitez-vous nommer votre espace famille ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Nom de la famille (optionnel)</Label>
                    <Input
                      id="familyName"
                      placeholder="ex: Famille Dupont"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour
                    </Button>
                    <Button className="flex-1" onClick={nextStep}>
                      Continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Children */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">
                    Vos enfants
                  </CardTitle>
                  <CardDescription>
                    Parlez-nous de vos enfants pour personnaliser les conseils.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {children.map((child, index) => (
                    <div key={index} className="space-y-4 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Enfant {index + 1}</span>
                        {children.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChild(index)}
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Prénom</Label>
                          <Input
                            placeholder="Prénom de l'enfant"
                            value={child.firstName}
                            onChange={(e) =>
                              updateChild(index, 'firstName', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de naissance</Label>
                          <Input
                            type="date"
                            value={child.birthDate}
                            onChange={(e) =>
                              updateChild(index, 'birthDate', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Genre (optionnel)</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`gender-${index}`}
                              value="M"
                              checked={child.gender === 'M'}
                              onChange={() => updateChild(index, 'gender', 'M')}
                              className="h-4 w-4"
                            />
                            Garçon
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`gender-${index}`}
                              value="F"
                              checked={child.gender === 'F'}
                              onChange={() => updateChild(index, 'gender', 'F')}
                              className="h-4 w-4"
                            />
                            Fille
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addChild} className="w-full">
                    + Ajouter un enfant
                  </Button>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour
                    </Button>
                    <Button className="flex-1" onClick={nextStep}>
                      Continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Needs */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">
                    Vos besoins
                  </CardTitle>
                  <CardDescription>
                    Sur quels sujets souhaitez-vous être accompagnée ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    {concerns.map((concern) => (
                      <div
                        key={concern.id}
                        onClick={() => toggleConcern(concern.id)}
                        className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border p-4 transition-colors ${
                          selectedConcerns.includes(concern.id)
                            ? 'border-primary bg-primary/10'
                            : 'hover:border-primary/50'
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            selectedConcerns.includes(concern.id)
                              ? 'bg-primary text-white'
                              : 'bg-secondary'
                          }`}
                        >
                          <concern.icon className="h-6 w-6" />
                        </div>
                        <span className="font-medium">{concern.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Quel est votre principal défi actuellement ?</Label>
                    <Textarea
                      placeholder="ex: Mon fils de 2 ans ne veut plus faire la sieste..."
                      value={mainChallenge}
                      onChange={(e) => setMainChallenge(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Qu'aimeriez-vous accomplir avec cet accompagnement ?</Label>
                    <Textarea
                      placeholder="ex: Des nuits complètes, moins de crises..."
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour
                    </Button>
                    <Button className="flex-1" onClick={nextStep}>
                      Continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle className="font-heading text-2xl">
                    Tout est prêt !
                  </CardTitle>
                  <CardDescription className="text-base">
                    Votre espace est configuré. Commençons l'accompagnement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <h3 className="font-semibold">Ce qui vous attend :</h3>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Chat avec l'IA disponible 24h/24
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Journal de bord auto-rempli
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Objectifs personnalisés
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Réflexes quotidiens à ancrer
                      </li>
                    </ul>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création...
                        </>
                      ) : (
                        <>
                          Accéder à mon espace
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
