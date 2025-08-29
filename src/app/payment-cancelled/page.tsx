'use client';

import Link from 'next/link';

export default function PaymentCancelledPage() {
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
        backgroundColor: 'white',
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
          color: '#1f2937'
        }}>
          Paiement annulé
        </h1>
        
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Vous avez annulé votre paiement.<br />
          Aucun montant n'a été débité.
        </p>
        
        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: '#92400e',
            marginBottom: '0.5rem'
          }}>
            💡 Le saviez-vous ?
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#92400e'
          }}>
            Avec Premium, vous économisez en moyenne 30€ par an en évitant les mauvais choix de cordage !
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link
            href="/pricing"
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
            Revoir les offres
          </Link>
          
          <Link
            href="/configurator"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              borderRadius: '8px',
              textDecoration: 'none',
              border: '1px solid #e5e7eb',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            Continuer en version gratuite
          </Link>
        </div>
        
        <div style={{
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: '#9ca3af'
        }}>
          Vous pouvez passer Premium à tout moment<br />
          sans perdre vos configurations existantes
        </div>
      </div>
    </div>
  );
}