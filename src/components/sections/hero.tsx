'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Zap, Trophy, Users } from 'lucide-react';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const stats = [
    { icon: Trophy, label: 'Expert Reviews', value: '10K+' },
    { icon: Zap, label: 'Products Analyzed', value: '5K+' },
    { icon: Users, label: 'Happy Players', value: '50K+' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tennis-green-50 via-white to-tennis-court-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tennis-green-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tennis-court-200/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      <div className="relative container-padding section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-flex items-center space-x-2 bg-tennis-green-100 text-tennis-green-800 px-4 py-2 rounded-full text-sm font-medium"
              >
                <Zap className="w-4 h-4" />
                <span>AI-Powered Recommendations</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 text-balance">
                  Find Your Perfect{' '}
                  <span className="text-gradient">Tennis Equipment</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl text-balance">
                  Get expert recommendations for racquets and strings tailored to your playing style. 
                  Compare specs, read reviews, and make confident decisions.
                </p>
              </div>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search racquets, strings, or brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-tennis-green-500 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-tennis text-lg px-8 py-4 whitespace-nowrap"
                >
                  Find Equipment
                </button>
              </motion.form>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <Link
                  href="/racquets"
                  className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:border-tennis-green-300 transition-all shadow-sm"
                >
                  Browse Racquets
                </Link>
                <Link
                  href="/strings"
                  className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:border-tennis-green-300 transition-all shadow-sm"
                >
                  Browse Strings
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-white hover:border-tennis-green-300 transition-all shadow-sm"
                >
                  Compare Equipment
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
              >
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-tennis-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              <div className="relative aspect-square">
                {/* Tennis Equipment Showcase */}
                <div className="absolute inset-0 bg-gradient-to-br from-tennis-green-400 to-tennis-green-600 rounded-3xl shadow-tennis-lg">
                  <div className="absolute inset-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white space-y-4">
                        <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Trophy className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold">Expert Recommendations</h3>
                        <p className="text-white/90 max-w-xs">
                          Get personalized advice from tennis professionals and data analysis
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 w-20 h-20 bg-tennis-court-400 rounded-full shadow-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">🎾</span>
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -right-4 w-16 h-16 bg-white shadow-lg rounded-full flex items-center justify-center"
                >
                  <span className="text-tennis-green-600 font-bold">🏆</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}