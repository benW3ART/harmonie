export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Politique de confidentialité
          </h1>

          <div className="prose prose-lg mt-8">
            <p className="lead">
              La protection de vos données personnelles est une priorité pour Coaching Parental.
              Cette politique explique comment nous collectons, utilisons et protégeons vos données.
            </p>

            <h2>Responsable du traitement</h2>
            <p>
              <strong>Coaching Parental</strong><br />
              Email : contact@coaching-parental.fr
            </p>

            <h2>Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul>
              <li><strong>Données d'identification</strong> : nom, prénom, email</li>
              <li><strong>Données de connexion</strong> : logs, adresse IP</li>
              <li><strong>Données d'accompagnement</strong> : informations sur votre famille,
                  vos enfants, les problématiques rencontrées</li>
              <li><strong>Données de conversation</strong> : échanges avec l'IA et la coach</li>
            </ul>

            <h2>Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Fournir nos services d'accompagnement parental</li>
              <li>Personnaliser votre expérience avec l'IA</li>
              <li>Communiquer avec vous (emails, notifications)</li>
              <li>Améliorer nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2>Base légale</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>L'exécution du contrat</strong> : pour fournir nos services</li>
              <li><strong>Votre consentement</strong> : pour les communications marketing</li>
              <li><strong>L'intérêt légitime</strong> : pour améliorer nos services</li>
            </ul>

            <h2>Destinataires des données</h2>
            <p>Vos données peuvent être partagées avec :</p>
            <ul>
              <li><strong>Supabase</strong> : hébergement de la base de données</li>
              <li><strong>Anthropic (Claude)</strong> : traitement IA pour les conversations</li>
              <li><strong>Vercel</strong> : hébergement du site</li>
              <li><strong>Resend</strong> : envoi d'emails transactionnels</li>
              <li><strong>Plausible</strong> : analytics respectueux de la vie privée</li>
            </ul>
            <p>
              Ces sous-traitants sont soumis au RGPD ou à des garanties équivalentes.
            </p>

            <h2>Transferts hors UE</h2>
            <p>
              Certaines données peuvent être transférées vers les États-Unis
              (Supabase, Anthropic, Vercel). Ces transferts sont encadrés par
              des clauses contractuelles types ou des certifications équivalentes.
            </p>

            <h2>Durée de conservation</h2>
            <ul>
              <li><strong>Données de compte</strong> : durée de la relation + 3 ans</li>
              <li><strong>Données d'accompagnement</strong> : durée de l'accompagnement + 1 an</li>
              <li><strong>Logs de connexion</strong> : 1 an</li>
              <li><strong>Données de facturation</strong> : 10 ans (obligation légale)</li>
            </ul>

            <h2>Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger vos données</li>
              <li><strong>Droit à l'effacement</strong> : supprimer vos données</li>
              <li><strong>Droit à la limitation</strong> : limiter le traitement</li>
              <li><strong>Droit à la portabilité</strong> : récupérer vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement</li>
            </ul>
            <p>
              Pour exercer vos droits : contact@coaching-parental.fr
            </p>

            <h2>Cookies</h2>
            <p>
              Nous utilisons uniquement des cookies essentiels au fonctionnement du site
              et Plausible Analytics qui ne dépose pas de cookies.
            </p>

            <h2>Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées :
            </p>
            <ul>
              <li>Chiffrement des données en transit (HTTPS)</li>
              <li>Chiffrement des mots de passe</li>
              <li>Contrôles d'accès stricts</li>
              <li>Audits de sécurité réguliers</li>
            </ul>

            <h2>Réclamation</h2>
            <p>
              Vous pouvez introduire une réclamation auprès de la CNIL :<br />
              <a href="https://www.cnil.fr" className="text-primary hover:underline">
                www.cnil.fr
              </a>
            </p>

            <h2>Modifications</h2>
            <p>
              Cette politique peut être mise à jour. La date de dernière mise à jour
              est indiquée en bas de page.
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
