export function Testimonials() {
  const testimonials = [
    {
      name: 'Jean-Pierre Martin',
      role: 'Joueur Classé 15',
      avatar: '👨',
      rating: 5,
      comment: "Grâce au système de rating, j'ai pu trouver la configuration parfaite pour mon jeu. La différence est incroyable !",
      setup: 'Babolat Pure Drive + RPM Blast'
    },
    {
      name: 'Sophie Dubois',
      role: 'Joueuse Compétition',
      avatar: '👩',
      rating: 5,
      comment: "Le configurateur m'a permis de sauvegarder et comparer toutes mes configurations. C'est un outil indispensable !",
      setup: 'Wilson Clash 100 + NXT'
    },
    {
      name: 'Marc Laurent',
      role: 'Entraîneur Tennis Club',
      avatar: '👨‍🏫',
      rating: 5,
      comment: "Je recommande cet outil à tous mes élèves. Le système de notation aide vraiment à choisir le bon matériel.",
      setup: 'Head Speed MP + Hawk Touch'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ce Que Disent Nos Utilisateurs</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des milliers de joueurs font confiance à notre système de configuration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 relative">
              {/* Quote Mark */}
              <div className="absolute top-4 right-4 text-6xl text-green-200 opacity-50">"</div>
              
              {/* Avatar */}
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex text-yellow-400 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              
              {/* Comment */}
              <p className="text-gray-700 mb-3 italic">"{testimonial.comment}"</p>
              
              {/* Setup */}
              <div className="bg-white rounded-lg px-3 py-2 text-sm text-gray-600">
                <strong>Configuration:</strong> {testimonial.setup}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-sm">Utilisateurs Actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-sm">Configurations Sauvegardées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-sm">Note Moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm">Support Disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}