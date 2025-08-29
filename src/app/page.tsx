import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tennis String Advisor - Expert Racquet & String Recommendations',
  description: 'Get personalized tennis racquet and string recommendations from our expert system. Compare specifications, read reviews, and find the perfect equipment for your playing style.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Tennis String Advisor
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-8">
            Système avancé avec journal de cordage professionnel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurator"
              className="px-8 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-colors text-lg shadow-xl"
            >
              🎾 Accéder au Configurateur Premium
            </Link>
            <Link
              href="/configurator"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-500 transition-colors text-lg shadow-xl"
            >
              📚 Version Gratuite
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="text-xl font-bold mb-2">Configuration Avancée</h3>
            <p className="text-green-100">
              Paramètres détaillés pour optimiser votre cordage
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Analyse RCS</h3>
            <p className="text-green-100">
              Système de recommandations basé sur le confort
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-xl font-bold mb-2">Journal Premium</h3>
            <p className="text-green-100">
              Historique complet de vos configurations
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-white/80 text-sm">
            © 2025 Tennis String Advisor - Développé pour les passionnés de tennis
          </p>
        </div>
      </div>
    </main>
  );
}