/**
 * Configuration NextAuth.js pour le système d'authentification
 * Support OAuth, credentials et premium membership
 */

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../database/prisma";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // OAuth Providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    // Credentials Provider for email/password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { 
            subscription: {
              where: {
                status: 'active',
                expiresAt: {
                  gt: new Date()
                }
              }
            }
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isPremium: user.subscription.length > 0
        };
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user data in JWT
      if (user) {
        token.role = user.role;
        token.isPremium = user.isPremium;
        
        // Check for premium subscription
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: 'active',
            expiresAt: {
              gt: new Date()
            }
          }
        });
        
        token.isPremium = !!subscription;
        token.subscriptionId = subscription?.id;
      }
      
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.isPremium = token.isPremium;
        session.user.subscriptionId = token.subscriptionId;
      }
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect logic after sign in
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email}`);
      
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'login', {
          method: account.provider
        });
      }
    },

    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || token?.email}`);
    },

    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
      
      // Send welcome email
      // await sendWelcomeEmail(user.email, user.name);
    }
  },

  debug: process.env.NODE_ENV === 'development',
};

/**
 * Middleware pour vérifier l'authentification
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    req.user = session.user;
    return handler(req, res);
  };
}

/**
 * Middleware pour vérifier le membership premium
 */
export function requirePremium(handler) {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!session.user.isPremium) {
      return res.status(403).json({ 
        error: 'Premium membership required',
        upgradeUrl: '/premium/upgrade'
      });
    }
    
    req.user = session.user;
    return handler(req, res);
  };
}

/**
 * Middleware pour vérifier les rôles admin
 */
export function requireRole(roles) {
  return function(handler) {
    return async (req, res) => {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      if (!roles.includes(session.user.role)) {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          requiredRole: roles
        });
      }
      
      req.user = session.user;
      return handler(req, res);
    };
  };
}

/**
 * Utilitaire pour vérifier le statut premium côté client
 */
export async function checkPremiumStatus(userId) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        plan: true
      }
    });

    return {
      isPremium: !!subscription,
      subscription: subscription || null,
      plan: subscription?.plan || null
    };
  } catch (error) {
    console.error('Error checking premium status:', error);
    return {
      isPremium: false,
      subscription: null,
      plan: null
    };
  }
}