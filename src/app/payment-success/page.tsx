'use client';

import Link from 'next/link';
import { useCheckoutReturnLocale } from '@/lib/i18n/pricing';

// Page de confirmation post-paiement Stripe.
// Le webhook (src/app/api/stripe/webhook) active le compte dès que Stripe
// confirme l'encaissement (21/11/2026 : l'ancien texte annonçait une activation
// manuelle sous 24 h et un e-mail de confirmation que le site n'envoie pas).
// Cette page ne peut pas savoir si l'activation a eu lieu : elle n'affirme
// donc jamais que les avantages sont « actifs », et donne un contact réel.
// Rien n'est promis sur les e-mails de Stripe (réglages du compte non vérifiés).
// L'URL de retour est fixée dans Stripe, commune aux achats FR et EN : la page suit la langue de la page d'achat
// (notée au clic sur /pricing ou /en/pricing), sinon celle du site (22/11/2026).
const TEXT = {
  fr: {
    title: 'Merci pour votre paiement !',
    received: 'Votre paiement a bien été reçu par Stripe.',
    activationTitle: '⏳ Activation de votre compte Premium',
    activationBefore: "Votre accès Premium s'active ",
    activationStrong: 'automatiquement',
    activationAfter:
      " dès que Stripe nous confirme l'encaissement du paiement. Rechargez ensuite le configurateur : vous disposerez des configurations illimitées, de l'export PDF et de l'analyse RCS avancée.",
    billing:
      "🧾 Pour toute question de facturation, gardez l'adresse e-mail utilisée lors du paiement : c'est elle qui permet de retrouver la transaction.",
    configuratorHref: '/configurator',
    configurator: '🎾 Retour au configurateur',
    contact:
      "Un problème, une question, ou un accès Premium qui ne s'active pas ? Écrivez-nous en précisant l'adresse email utilisée lors du paiement :",
  },
  en: {
    title: 'Thank you for your payment!',
    received: 'Stripe has received your payment.',
    activationTitle: '⏳ Activating your Premium account',
    activationBefore: 'Your Premium access is activated ',
    activationStrong: 'automatically',
    activationAfter:
      ' as soon as Stripe confirms that the payment has been collected. Then reload the configurator: you will have unlimited setups, the PDF export (in French) and the advanced RCS analysis.',
    billing:
      '🧾 For any billing question, keep the email address used for the payment: it is what lets us find the transaction.',
    configuratorHref: '/en/configurator',
    configurator: '🎾 Back to the configurator',
    contact:
      'A problem, a question, or Premium access that does not activate? Write to us with the email address used for the payment:',
  },
};

export default function PaymentSuccessPage() {
  const tx = TEXT[useCheckoutReturnLocale()];
  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/images/tennis-court-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(30, 81, 40, 0.9) 0%, rgba(45, 122, 61, 0.85) 50%, rgba(74, 155, 95, 0.8) 100%)',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'var(--surface-card)',
        color: 'var(--text-strong)', // fix: eviter l'heritage du texte clair en mode sombre
        borderRadius: '16px',
        padding: '3rem',
        maxWidth: '600px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          fontSize: '5rem',
          marginBottom: '1rem'
        }}>
          🎾
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#10b981'
        }}>
          {tx.title}
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-strong)',
          marginBottom: '2rem'
        }}>
          {tx.received}
        </p>

        <div style={{
          backgroundColor: 'var(--tint-amber-bg)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid #f59e0b',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: 'var(--tint-amber-fg)',
            marginBottom: '0.75rem'
          }}>
            {tx.activationTitle}
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--tint-amber-fg)',
            margin: 0
          }}>
            {tx.activationBefore}<strong>{tx.activationStrong}</strong>{tx.activationAfter}
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--tint-green-bg)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: 'var(--tint-green-fg)'
        }}>
          {tx.billing}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            href={tx.configuratorHref}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              display: 'inline-block',
              transition: 'all 0.3s',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {tx.configurator}
          </Link>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--surface-border)'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}>
            {tx.contact}
          </p>
          <a
            href="mailto:pleneuftrading@gmail.com"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            pleneuftrading@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
