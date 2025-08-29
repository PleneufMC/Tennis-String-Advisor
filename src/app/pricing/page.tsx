'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (vous devrez remplacer avec votre clé publique)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: { monthly: 0, yearly: 0 },
      features: [
        '✅ Configurateur de base',
        '✅ 3 configurations sauvegardées',
        '✅ Calcul RCS simple',
        '✅ Base de données complète',
        '❌ Configurations illimitées',
        '❌ Journal de cordage premium',
        '❌ Historique détaillé',
        '❌ Export PDF',
        '❌ Statistiques avancées',
        '❌ Support prioritaire'
      ],
      buttonText: 'Version actuelle',
      buttonStyle: 'secondary',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 4.99, yearly: 49.90 },
      savings: '2 mois gratuits',
      features: [
        '✅ Tout du plan gratuit',
        '✅ Configurations illimitées',
        '✅ Journal de cordage complet',
        '✅ Historique permanent',
        '✅ Analyse RCS avancée',
        '✅ Recommandations personnalisées',
        '✅ Export PDF professionnel',
        '✅ Statistiques détaillées',
        '✅ Rappels de recondage',
        '✅ Support email prioritaire'
      ],
      buttonText: 'Essai gratuit 7 jours',
      buttonStyle: 'primary',
      popular: true,
      stripePriceId: {
        monthly: 'price_monthly_placeholder',
        yearly: 'price_yearly_placeholder'
      }
    }
  ];

  const handleCheckout = async (plan: any) => {
    if (!plan.stripePriceId) return;
    
    setLoading(plan.id);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId[billingPeriod],
          planName: plan.name,
        }),
      });

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe error:', error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/images/tennis-court-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      position: 'relative',
      fontFamily: 'Inter, system-ui, sans-serif'
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
      
      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '2rem 1rem',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
        }}>
          Choisissez votre plan
        </h1>
        <p style={{ 
          color: '#ffffff', 
          fontSize: '1.1rem', 
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          marginBottom: '2rem'
        }}>
          Débloquez toutes les fonctionnalités premium pour optimiser votre jeu
        </p>
        
        {/* Billing Toggle */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: billingPeriod === 'monthly' ? 'white' : 'transparent',
              color: billingPeriod === 'monthly' ? '#2d7a3d' : 'white',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: billingPeriod === 'yearly' ? 'white' : 'transparent',
              color: billingPeriod === 'yearly' ? '#2d7a3d' : 'white',
              borderRadius: '9999px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              position: 'relative'
            }}
          >
            Annuel
            <span style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '-1rem',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '0.625rem',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>
              2 MOIS GRATUITS
            </span>
          </button>
        </div>
        
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: '1rem',
          marginLeft: '1rem',
          padding: '0.5rem 1.5rem',
          backgroundColor: 'rgba(74, 155, 95, 0.9)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500',
          textDecoration: 'none'
        }}>
          ← Retour
        </Link>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1rem 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
              boxShadow: plan.popular ? '0 25px 50px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              border: plan.popular ? '3px solid #10b981' : 'none'
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-0.75rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                PLUS POPULAIRE
              </div>
            )}
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#1f2937'
            }}>
              {plan.name}
            </h3>
            
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <span style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: plan.popular ? '#10b981' : '#1f2937'
              }}>
                €{plan.price[billingPeriod]}
              </span>
              <span style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginLeft: '0.5rem'
              }}>
                /{billingPeriod === 'monthly' ? 'mois' : 'an'}
              </span>
              {billingPeriod === 'yearly' && plan.savings && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#10b981',
                  fontWeight: '500'
                }}>
                  💰 Économisez €{((plan.price.monthly * 12) - plan.price.yearly).toFixed(2)} ({plan.savings})
                </div>
              )}
            </div>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '2rem'
            }}>
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: '0.5rem 0',
                    fontSize: '0.875rem',
                    color: feature.startsWith('✅') ? '#059669' : '#9ca3af',
                    borderBottom: idx < plan.features.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => plan.id !== 'free' && handleCheckout(plan)}
              disabled={loading === plan.id || plan.id === 'free'}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 
                  plan.id === 'free' ? '#e5e7eb' :
                  plan.popular ? '#10b981' :
                  plan.buttonStyle === 'enterprise' ? '#3b82f6' : '#6b7280',
                color: plan.id === 'free' ? '#9ca3af' : 'white',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: plan.id === 'free' ? 'default' : 'pointer',
                transition: 'all 0.3s',
                opacity: loading === plan.id ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (plan.id !== 'free' && loading !== plan.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading === plan.id ? 'Chargement...' : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
      
      {/* Comparison Table */}
      <div style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '0 1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#1f2937'
          }}>
            Pourquoi passer Premium ?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>♾️</div>
              <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Illimité</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Sauvegardez toutes vos configurations
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
              <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Statistiques</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Analysez vos performances
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📄</div>
              <div style={{ fontWeight: 'bold', color: '#1f2937' }}>Export PDF</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Imprimez vos configurations
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
              <div style={{ fontWeight: 'bold', color: '#1f2937' }}>RCS Avancé</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Recommandations personnalisées
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px'
        }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
            <div style={{ fontWeight: 'bold' }}>Paiement Sécurisé</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Stripe & SSL</div>
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <div style={{ fontWeight: 'bold' }}>Annulation Facile</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>À tout moment</div>
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontWeight: 'bold' }}>Garantie 30 jours</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Satisfait ou remboursé</div>
          </div>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
            <div style={{ fontWeight: 'bold' }}>Support Premium</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Réponse en 24h</div>
          </div>
        </div>
      </div>
    </div>
  );
}