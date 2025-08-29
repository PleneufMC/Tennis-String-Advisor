'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
        background: 'linear-gradient(135deg, #1e5128 0%, #2d7a3d 50%, #4a9b5f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <div style={{ maxWidth: '1024px', width: '100%' }}>
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            Tennis String Advisor
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', 
            color: '#c8e6c9',
            marginBottom: '2rem' 
          }}>
            Système avancé avec journal de cordage professionnel
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            '@media (min-width: 640px)': {
              flexDirection: 'row',
              justifyContent: 'center'
            }
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
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f9ff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
            >
              🎾 Accéder au Configurateur Premium
            </Link>
            <Link
              href="/configurator"
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#4a9b5f',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '1.125rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#5faf73';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4a9b5f';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
            >
              📚 Version Gratuite
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
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚙️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Configuration Avancée
            </h3>
            <p style={{ color: '#c8e6c9', fontSize: '0.95rem' }}>
              Paramètres détaillés pour optimiser votre cordage
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Analyse RCS
            </h3>
            <p style={{ color: '#c8e6c9', fontSize: '0.95rem' }}>
              Système de recommandations basé sur le confort
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Journal Premium
            </h3>
            <p style={{ color: '#c8e6c9', fontSize: '0.95rem' }}>
              Historique complet de vos configurations
            </p>
          </div>
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem' }}>
            © 2025 Tennis String Advisor - Développé pour les passionnés de tennis
          </p>
        </div>
      </div>
    </main>
  );
}