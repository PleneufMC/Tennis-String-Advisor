export function FeaturedProducts() {
  const products = [
    {
      category: 'Racquet',
      brand: 'Wilson',
      name: 'Pro Staff RF97',
      price: '$249',
      rating: 4.8,
      reviews: 234,
      features: ['340g', '97 sq in', '16x19 pattern'],
      badge: 'Best Control',
      color: 'red'
    },
    {
      category: 'String',
      brand: 'Luxilon',
      name: 'ALU Power 125',
      price: '$18/set',
      rating: 4.7,
      reviews: 567,
      features: ['Polyester', '1.25mm gauge', 'Max spin'],
      badge: 'Most Popular',
      color: 'blue'
    },
    {
      category: 'Racquet',
      brand: 'Babolat',
      name: 'Pure Drive 2024',
      price: '$229',
      rating: 4.9,
      reviews: 892,
      features: ['300g', '100 sq in', 'Power focused'],
      badge: 'Best Power',
      color: 'green'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>Most Popular</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Equipment</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most recommended racquets and strings by professional players
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              {/* Product Badge */}
              <div className={`bg-${product.color}-500 text-white px-4 py-2 text-sm font-semibold`}>
                {product.badge}
              </div>
              
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🎾</span>
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-6">
                <div className="text-sm text-gray-500 font-medium mb-1">{product.brand} • {product.category}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}