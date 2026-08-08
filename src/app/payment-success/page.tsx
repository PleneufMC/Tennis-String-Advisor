'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/configurator';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          marginBottom: '1rem',
          animation: 'bounce 1s ease-in-out'
        }}>
          🎉
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#10b981'
        }}>
          Bienvenue Premium !
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-strong)',
          marginBottom: '2rem'
        }}>
          Votre paiement a été confirmé avec succès
        </p>
        
        <div style={{
          backgroundColor: 'var(--tint-green-bg)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '2px solid #10b981'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            color: 'var(--tint-green-fg)',
            marginBottom: '1rem'
          }}>
            ✨ Vos avantages Premium sont maintenant actifs :
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            textAlign: 'left',
            fontSize: '0.95rem',
            color: 'var(--tint-green-fg)'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ Configurations illimitées</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Journal de cordage complet</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Analyse RCS avancée</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Export PDF professionnel</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Statistiques détaillées</li>
            <li>✅ Support prioritaire par email</li>
          </ul>
        </div>
        
        <div style={{
          backgroundColor: 'var(--tint-amber-bg)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: 'var(--tint-amber-fg)'
        }}>
          📧 Un email de confirmation a été envoyé avec votre facture
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            🎾 Accéder au Configurateur Premium
          </Link>
          
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}>
            Redirection automatique dans {countdown} secondes...
          </div>
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
            Besoin d'aide ?
          </p>
          <a 
            href="mailto:support@tennisadvisor.com"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            support@tennisadvisor.com
          </a>
        </div>
      </div>
    </div>
  );
}