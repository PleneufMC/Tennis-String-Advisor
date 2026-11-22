'use client';

import Link from 'next/link';
import { useCheckoutReturnLocale } from '@/lib/i18n/pricing';

// Même URL pour les achats FR et EN : la page suit la langue de la page d'achat, sinon celle du site (22/11/2026).
const TEXT = {
  fr: {
    title: 'Paiement annulé',
    cancelled: 'Vous avez annulé votre paiement.',
    notCharged: "Aucun montant n'a été débité.",
    pricingHref: '/pricing',
    pricing: 'Revoir les offres',
    configuratorHref: '/configurator',
    configurator: 'Continuer en version gratuite',
    later1: 'Vous pouvez passer Premium à tout moment',
    later2: 'sans perdre vos configurations existantes',
  },
  en: {
    title: 'Payment cancelled',
    cancelled: 'You cancelled your payment.',
    notCharged: 'No amount has been charged.',
    pricingHref: '/en/pricing',
    pricing: 'See the plans again',
    configuratorHref: '/en/configurator',
    configurator: 'Continue with the free version',
    later1: 'You can go Premium at any time',
    later2: 'without losing your existing setups',
  },
};

export default function PaymentCancelledPage() {
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
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem'
        }}>
          🤔
        </div>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: 'var(--text-strong)'
        }}>
          {tx.title}
        </h1>
        
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem'
        }}>
          {tx.cancelled}<br />
          {tx.notCharged}
        </p>
        
        {/* Encadré « Le saviez-vous ? — Avec Premium, vous économisez en moyenne 30€ par an en évitant les mauvais choix de
            cordage ! » retiré le 22/11/2026 : aucune mesure ne fonde ce chiffre (aucun abonné établi). Même motif que les
            affirmations retirées de /pricing le 21/11/2026 ; ne pas le traduire, ne pas le rétablir. */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            href={tx.pricingHref}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {tx.pricing}
          </Link>
          
          <Link
            href={tx.configuratorHref}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid var(--surface-border)',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            {tx.configurator}
          </Link>
        </div>
        
        <div style={{
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: 'var(--text-faint)'
        }}>
          {tx.later1}<br />
          {tx.later2}
        </div>
      </div>
    </div>
  );
}