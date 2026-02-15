export default function CGVPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-lg mt-8">
            <p className="lead">
              Les présentes conditions générales de vente régissent les relations
              entre Coaching Parental et ses clients.
            </p>

            <h2>Article 1 - Objet</h2>
            <p>
              Les présentes CGV ont pour objet de définir les conditions dans lesquelles
              Coaching Parental fournit ses services d'accompagnement parental, comprenant :
            </p>
            <ul>
              <li>L'accès à l'application web avec assistant IA</li>
              <li>Les séances d'accompagnement avec la coach</li>
              <li>Le suivi personnalisé</li>
            </ul>

            <h2>Article 2 - Services proposés</h2>
            <h3>2.1 Entretien découverte</h3>
            <p>
              Entretien gratuit de 30 minutes en visioconférence pour évaluer les besoins
              et présenter l'accompagnement.
            </p>

            <h3>2.2 Accompagnement mensuel</h3>
            <p>
              Formule d'accompagnement comprenant :
            </p>
            <ul>
              <li>Questionnaire de diagnostic complet</li>
              <li>Bilans hebdomadaires avec la coach</li>
              <li>Accès illimité à l'application avec IA 24h/24</li>
              <li>Journal de bord auto-rempli</li>
              <li>Objectifs et réflexes personnalisés</li>
              <li>Support par messagerie</li>
            </ul>

            <h3>2.3 Séance ponctuelle</h3>
            <p>
              Consultation unique de 45 minutes pour un conseil ciblé.
            </p>

            <h2>Article 3 - Tarifs</h2>
            <ul>
              <li>Entretien découverte : gratuit</li>
              <li>Accompagnement mensuel : 500€ TTC / mois</li>
              <li>Séance ponctuelle : 50€ TTC</li>
            </ul>
            <p>
              Les tarifs sont indiqués TTC. Coaching Parental n'est pas assujetti à la TVA
              (article 293B du CGI).
            </p>

            <h2>Article 4 - Modalités de paiement</h2>
            <p>
              Le paiement s'effectue par carte bancaire via notre plateforme sécurisée (Stripe).
            </p>
            <p>
              Pour l'accompagnement mensuel, le paiement est prélevé automatiquement
              chaque mois à la date d'anniversaire de la souscription.
            </p>

            <h2>Article 5 - Droit de rétractation</h2>
            <p>
              Conformément à l'article L221-18 du Code de la consommation, vous disposez
              d'un délai de 14 jours à compter de la souscription pour exercer votre
              droit de rétractation, sans avoir à justifier de motif.
            </p>
            <p>
              Pour exercer ce droit, contactez-nous à contact@coaching-parental.fr.
            </p>

            <h2>Article 6 - Résiliation</h2>
            <p>
              L'accompagnement mensuel peut être résilié à tout moment avec un préavis
              de 7 jours avant la prochaine date de renouvellement.
            </p>
            <p>
              La résiliation s'effectue depuis l'espace client ou par email.
            </p>

            <h2>Article 7 - Responsabilité</h2>
            <p>
              Les conseils fournis par Coaching Parental sont basés sur des méthodes
              reconnues mais ne constituent en aucun cas un avis médical.
            </p>
            <p>
              En cas de doute sur la santé de votre enfant, consultez un professionnel
              de santé (médecin, pédiatre).
            </p>
            <p>
              Coaching Parental ne saurait être tenu responsable des résultats obtenus,
              chaque situation familiale étant unique.
            </p>

            <h2>Article 8 - Confidentialité</h2>
            <p>
              Toutes les informations partagées lors de l'accompagnement sont strictement
              confidentielles, sauf obligation légale contraire.
            </p>
            <p>
              Pour plus d'informations sur la gestion de vos données, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                politique de confidentialité
              </a>.
            </p>

            <h2>Article 9 - Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus fournis (documents, exercices, recommandations)
              reste la propriété de Coaching Parental et ne peut être diffusé sans
              autorisation.
            </p>

            <h2>Article 10 - Réclamations</h2>
            <p>
              Pour toute réclamation, contactez-nous à contact@coaching-parental.fr.
              Nous nous engageons à vous répondre sous 48h ouvrées.
            </p>

            <h2>Article 11 - Médiation</h2>
            <p>
              En cas de litige non résolu, vous pouvez recourir gratuitement au service
              de médiation de la consommation.
            </p>

            <h2>Article 12 - Droit applicable</h2>
            <p>
              Les présentes CGV sont soumises au droit français.
              En cas de litige, les tribunaux français seront compétents.
            </p>

            <p className="text-sm text-muted-foreground">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
