import Link from 'next/link';

// Icons as components
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function CompareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

function FeatureCard({ icon, title, description, href, badge }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group card-tennis relative overflow-hidden hover:scale-[1.02] transition-all duration-300"
    >
      {badge && (
        <span className="absolute top-4 right-4 badge-amber text-xs font-bold">{badge}</span>
      )}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
        Découvrir
        <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Stat component
interface StatProps {
  value: string;
  label: string;
}

function Stat({ value, label }: StatProps) {
  return (
    <div className="text-center glass rounded-xl p-4">
      <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{value}</div>
      <div className="text-sm text-white/90 font-medium mt-1">{label}</div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="hero-tennis min-h-[90vh] flex items-center relative">
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="container-tennis relative z-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                <SparklesIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-semibold">Configurateur Expert 2025</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Trouvez le Setup
                  <span className="block text-yellow-300 mt-2">Parfait</span>
                  <span className="block text-white/90 text-3xl md:text-4xl lg:text-5xl mt-2">
                    Raquette & Cordage
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                  Configurez votre équipement idéal grâce à notre base de données de{' '}
                  <strong>80+ raquettes</strong> et <strong>50+ cordages</strong>. 
                  Recommandations IA personnalisées selon votre style de jeu.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/configurator" className="btn-tennis text-lg px-8 py-4">
                  <SettingsIcon className="w-5 h-5 mr-2" />
                  Configurer Mon Setup
                </Link>
                <Link href="/racquets" className="btn-tennis-outline bg-white/10 text-white border-white/30 hover:bg-white/20 text-lg px-8 py-4">
                  <SearchIcon className="w-5 h-5 mr-2" />
                  Explorer le Catalogue
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <Stat value="80+" label="Raquettes" />
                <Stat value="50+" label="Cordages" />
                <Stat value="∞" label="Configurations" />
              </div>
            </div>

            {/* Right column - Feature cards (on larger screens) */}
            <div className="hidden lg:block">
              <div className="glass-white rounded-3xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <CheckCircleIcon className="w-7 h-7 text-green-600" />
                  Fonctionnalités Clés
                </h2>
                
                <ul className="space-y-4">
                  {[
                    'Base de données complète avec indices RA',
                    'Top 50 cordages 2025 avec analyses',
                    'Configuration hybride avancée',
                    'Recommandations IA personnalisées',
                    'Analyse de compatibilité raquette/cordage',
                    'Comparateur multi-critères',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/configurator"
                  className="block w-full btn-tennis text-center text-lg py-4 mt-6"
                >
                  Commencer Maintenant
                  <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-gray-50">
        <div className="container-tennis">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Tout pour Votre Équipement Tennis
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Des outils professionnels pour trouver et configurer l&apos;équipement parfait
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<SettingsIcon className="w-6 h-6" />}
              title="Configurateur Expert"
              description="Créez votre setup idéal en combinant raquette, cordage et tension. Analyse de compatibilité en temps réel."
              href="/configurator"
              badge="Populaire"
            />
            <FeatureCard
              icon={<SearchIcon className="w-6 h-6" />}
              title="Catalogue Raquettes"
              description="80+ raquettes des meilleures marques avec spécifications complètes : poids, RA, équilibre, tamis."
              href="/racquets"
            />
            <FeatureCard
              icon={<SearchIcon className="w-6 h-6" />}
              title="Catalogue Cordages"
              description="Top 50 cordages 2025 : polyester, multifilament, boyau naturel. Notes et comparatifs détaillés."
              href="/tennis-strings"
            />
            <FeatureCard
              icon={<CompareIcon className="w-6 h-6" />}
              title="Comparateur"
              description="Comparez jusqu'à 4 raquettes ou cordages côte à côte. Visualisez les différences en un coup d'œil."
              href="/compare"
            />
            <FeatureCard
              icon={<SparklesIcon className="w-6 h-6" />}
              title="Recommandations IA"
              description="Recevez des suggestions personnalisées basées sur votre niveau, style de jeu et préférences."
              href="/recommendations"
              badge="Nouveau"
            />
            <FeatureCard
              icon={<CheckCircleIcon className="w-6 h-6" />}
              title="Guides & Conseils"
              description="Articles experts sur le choix du cordage, la tension idéale, et l'entretien de votre équipement."
              href="/guides"
            />
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="section-sm bg-white">
        <div className="container-tennis">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Marques Disponibles</h2>
            <p className="mt-2 text-gray-600">Les meilleures marques de tennis mondial</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {['Babolat', 'Wilson', 'Head', 'Yonex', 'Tecnifibre', 'Luxilon', 'Solinco'].map((brand) => (
              <div
                key={brand}
                className="text-xl md:text-2xl font-bold text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-green-600 to-green-700">
        <div className="container-tennis text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à Optimiser Votre Jeu ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de joueurs qui ont trouvé leur setup parfait grâce à Tennis String Advisor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/configurator"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-green-700 bg-white rounded-xl hover:bg-gray-100 transform hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Configurer Mon Setup
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/premium"
              className="btn-premium text-lg px-8 py-4"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Découvrir Premium
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
