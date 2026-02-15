export default function LegalPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Mentions légales
          </h1>

          <div className="prose prose-lg mt-8">
            <h2>Éditeur du site</h2>
            <p>
              <strong>Coaching Parental</strong><br />
              [Nom complet]<br />
              [Adresse]<br />
              [Code postal] [Ville]<br />
              France
            </p>
            <p>
              Email : contact@coaching-parental.fr<br />
              Téléphone : 06 XX XX XX XX
            </p>
            <p>
              SIRET : [Numéro SIRET]<br />
              Forme juridique : [Forme juridique]
            </p>

            <h2>Hébergeur</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.)
              est la propriété exclusive de Coaching Parental, sauf mention contraire.
              Toute reproduction, distribution, modification, ou utilisation sans
              autorisation préalable est interdite.
            </p>

            <h2>Données personnelles</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification,
              de suppression et de portabilité de vos données personnelles.
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                politique de confidentialité
              </a>.
            </p>

            <h2>Cookies</h2>
            <p>
              Ce site utilise des cookies pour améliorer l'expérience utilisateur.
              En naviguant sur ce site, vous acceptez l'utilisation de cookies
              conformément à notre politique de confidentialité.
            </p>

            <h2>Responsabilité</h2>
            <p>
              Les informations fournies sur ce site sont à titre informatif.
              Coaching Parental ne saurait être tenu responsable des décisions
              prises sur la base de ces informations.
            </p>
            <p>
              Les conseils prodigués lors des accompagnements ne se substituent
              pas à un avis médical. En cas de doute sur la santé de votre enfant,
              consultez un professionnel de santé.
            </p>

            <h2>Liens hypertextes</h2>
            <p>
              Ce site peut contenir des liens vers d'autres sites web.
              Coaching Parental n'est pas responsable du contenu de ces sites externes.
            </p>

            <h2>Droit applicable</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
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
