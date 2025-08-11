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
      if (account?.provider === 'google') {
        try {
          console.log('🔍 Google sign-in attempt:', {
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId
          });

          // Check if user exists in our database
          const WEBSITE_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001';
          console.log('🌐 Using website base URL:', WEBSITE_BASE_URL);

          // Try to find existing user
          console.log('🔍 Checking if user exists...');
          const checkResponse = await fetch(`${WEBSITE_BASE_URL}/api/auth/check-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }),
          });

          console.log('📋 Check user response status:', checkResponse.status);

          if (checkResponse.ok) {
            const existingUser = await checkResponse.json();
            console.log('📋 Check user response:', existingUser);

            if (existingUser.exists) {
              // User exists, update their info
              console.log('✅ User exists, using existing account');
              user.id = existingUser.user.id;
              return true;
            }
          }

          // User doesn't exist, create new account
          console.log('🆕 Creating new Google user...');
          const registerResponse = await fetch(`${WEBSITE_BASE_URL}/api/auth/google-register`, {
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

          console.log('📋 Register response status:', registerResponse.status);

          if (registerResponse.ok) {
            const newUser = await registerResponse.json();
            console.log('✅ User created successfully:', newUser);
            user.id = newUser.user.id;
            return true;
          } else {
            const errorData = await registerResponse.text();
            console.error('❌ Failed to create Google user:', {
              status: registerResponse.status,
              statusText: registerResponse.statusText,
              error: errorData
            });
            return false;
          }
        } catch (error) {
          console.error('❌ Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
