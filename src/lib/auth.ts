import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginUser } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await loginUser(credentials.email, credentials.password);
          if (result && result.user) {
            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name || result.user.firstName + ' ' + result.user.lastName,
              image: result.user.avatar || null,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔍 Sign-in attempt:', {
        provider: account?.provider,
        email: user.email,
        name: user.name
      });

      // Always allow sign-in - we'll handle user creation in JWT callback
      return true;
    },
    async jwt({ token, user, account }) {
      console.log('🔐 JWT Callback:', {
        hasUser: !!user,
        hasToken: !!token,
        provider: account?.provider,
        userEmail: user?.email || token?.email
      });

      if (user && account?.provider === 'google') {
        console.log('🔍 Processing Google user in JWT callback');

        try {
          // Create or get user from database
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/google-register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('✅ User processed successfully:', userData.user?.id);

            token.id = userData.user?.id || `google-${Date.now()}`;
            token.email = user.email;
            token.name = user.name;
            token.role = 'CUSTOMER';
            token.image = user.image;
          } else {
            console.log('⚠️ User creation failed, using temporary ID');
            token.id = `google-${Date.now()}`;
            token.email = user.email;
            token.name = user.name;
            token.role = 'CUSTOMER';
            token.image = user.image;
          }
        } catch (error) {
          console.log('⚠️ Error processing user, using temporary ID:', error);
          token.id = `google-${Date.now()}`;
          token.email = user.email;
          token.name = user.name;
          token.role = 'CUSTOMER';
          token.image = user.image;
        }
      } else if (user) {
        // Regular credentials login
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = 'CUSTOMER';
      }

      return token;
    },
    async session({ session, token }) {
      console.log('🔐 Session Callback:', {
        hasSession: !!session,
        hasToken: !!token,
        tokenId: token?.id,
        sessionEmail: session?.user?.email
      });

      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string || 'CUSTOMER';
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
