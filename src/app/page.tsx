'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { racquetsDatabase } from '@/data/racquets-database';
import { stringsDatabase } from '@/data/strings-database';

export default function HomePage() {
  useEffect(() => {
    // Force styles to apply
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, []);

  return (
    <main 
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/images/tennis-court-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(30, 81, 40, 0.85) 0%, rgba(45, 122, 61, 0.8) 50%, rgba(74, 155, 95, 0.75) 100%)',
        zIndex: 1
      }} />
      
      <div style={{ 
        maxWidth: '1024px', 
        width: '100%',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
          }}>
            Tennis String Advisor
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
            color: '#ffffff',
            marginBottom: '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Système avancé avec journal de cordage professionnel
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Link
              href="/configurator"
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#2d7a3d',
                fontWeight: 'bold',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
            >
              🎾 Accéder au Configurateur Premium
            </Link>
            <Link
              href="/configurator"
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'rgba(74, 155, 95, 0.9)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(95, 175, 115, 0.95)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(74, 155, 95, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
            >
              📚 Version Gratuite
            </Link>
            <Link
              href="/statistics"
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'rgba(251, 191, 36, 0.9)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(251, 211, 66, 0.95)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.9)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
            >
              📊 Statistiques
            </Link>
            <Link
              href="/pricing"
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
              }}
            >
              ⭐ Passer Premium
              <span style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '-0.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '0.625rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontWeight: 'bold',
                animation: 'pulse 2s infinite'
              }}>
                -17%
              </span>
            </Link>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '4rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚙️</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Configuration Avancée
            </h3>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.95rem',
              opacity: 0.95
            }}>
              Paramètres détaillés pour optimiser votre cordage
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Analyse RCS
            </h3>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.95rem',
              opacity: 0.95
            }}>
              Système de recommandations basé sur le confort
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Journal Premium
            </h3>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.95rem',
              opacity: 0.95
            }}>
              Historique complet de vos configurations
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎯</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Base de données complète
            </h3>
            <p style={{ 
              color: '#ffffff', 
              fontSize: '0.95rem',
              opacity: 0.95
            }}>
              {racquetsDatabase.length} raquettes et {stringsDatabase.length} cordages disponibles
            </p>
          </div>
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            fontSize: '0.875rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            © 2025 Tennis String Advisor - Développé pour les passionnés de tennis
          </p>
        </div>
      </div>
    </main>
  );
}