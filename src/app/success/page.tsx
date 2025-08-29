'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Vérifier le statut du paiement
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          setSuccess(data.success);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

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
        {loading ? (
          <>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'spin 2s linear infinite'
            }}>
              ⏳
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              Vérification du paiement...
            </h1>
          </>
        ) : success ? (
          <>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              color: '#10b981'
            }}>
              ✅
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              Paiement réussi !
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              Bienvenue dans Tennis String Advisor Premium !<br />
              Vous avez maintenant accès à toutes les fonctionnalités avancées.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <Link
                href="/configurator"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#10b981',
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
                🎾 Accéder au configurateur Premium
              </Link>
              <Link
                href="/account"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: 'transparent',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  border: '2px solid #3b82f6',
                  display: 'inline-block',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#3b82f6';
                }}
              >
                👤 Gérer mon compte
              </Link>
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              color: '#ef4444'
            }}>
              ❌
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1f2937'
            }}>
              Erreur de paiement
            </h1>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
              fontSize: '1rem'
            }}>
              Le paiement n'a pas pu être vérifié.<br />
              Veuillez réessayer ou contacter le support.
            </p>
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
                  display: 'inline-block'
                }}
              >
                Réessayer
              </Link>
              <Link
                href="/"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Retour à l'accueil
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}