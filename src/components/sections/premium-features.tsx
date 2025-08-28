export function PremiumFeatures() {
  const features = [
    {
      title: 'AI-Powered Recommendations',
      description: 'Advanced machine learning algorithms analyze your playing style to suggest the perfect equipment',
      icon: '🤖'
    },
    {
      title: 'Professional Reviews',
      description: 'Access detailed reviews from professional stringers and tennis coaches',
      icon: '👨‍🏫'
    },
    {
      title: 'Price Tracking',
      description: 'Get notified when your favorite equipment goes on sale',
      icon: '📊'
    },
    {
      title: 'Setup History',
      description: 'Track all your previous configurations and their performance ratings',
      icon: '📚'
    },
    {
      title: 'Community Insights',
      description: 'Learn from setups used by players with similar playing styles',
      icon: '👥'
    },
    {
      title: 'Video Tutorials',
      description: 'Access exclusive stringing and maintenance video guides',
      icon: '🎥'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
            </svg>
            <span>Premium Features</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Unlock Advanced Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take your game to the next level with our premium tools and insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Upgrade to Premium</h3>
            <p className="text-lg mb-6">Get unlimited access to all features and exclusive content</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">$9.99</div>
                <div className="text-sm">per month</div>
              </div>
              <div className="text-2xl">or</div>
              <div className="text-center">
                <div className="text-3xl font-bold">$99</div>
                <div className="text-sm">per year</div>
              </div>
            </div>
            <button className="mt-6 bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}