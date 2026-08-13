'use client';

import Link from 'next/link';

// Page de confirmation post-paiement Stripe.
// IMPORTANT (audit 13/08/2026) : aucun webhook Stripe n'existe — rien n'écrit
// isPremium automatiquement (activation manuelle, cf. AUTH-SETUP.md). Cette
// page ne doit donc JAMAIS affirmer que les avantages sont « actifs » :
// elle annonce une activation sous 24 h et donne un contact réel.
// À réécrire quand le webhook existera (roadmap Phase 5).
export default function PaymentSuccessPage() {
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
          Merci pour votre paiement !
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-strong)',
          marginBottom: '2rem'
        }}>
          Votre paiement a bien été reçu par Stripe.
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
            ⏳ Activation de votre compte Premium
          </h3>
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--tint-amber-fg)',
            margin: 0
          }}>
            Votre accès Premium est activé <strong>manuellement sous 24 h ouvrées</strong>.
            Vous recevrez un email de confirmation dès que c&apos;est fait. Une fois le
            compte activé, vous disposerez des configurations illimitées, de
            l&apos;export PDF et de l&apos;analyse RCS avancée.
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
          🧾 Conservez le reçu émis par Stripe : il fait foi pour toute question de facturation.
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            href="/configurator"
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
            🎾 Retour au configurateur
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
            Un problème, une question, ou pas de confirmation sous 24 h ?
            Écrivez-nous en précisant l&apos;adresse email utilisée lors du paiement :
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
