import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import SessionProvider from '@/components/SessionProvider';
import Analytics from '@/components/Analytics';
import ConsoleCleaner from '@/components/ConsoleCleaner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bakery Shop - Premium Bakery Products',
  description: 'Premium bakery products made with love',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CSZRCCX7M2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CSZRCCX7M2', {
                'anonymize_ip': true,
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false
              });
            `,
          }}
        />

        {/* Facebook Pixel - Privacy Compliant */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1077453346222580', {
                'external_id_source': 'first_party'
              });
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-dark-800 text-primary-100`}>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ConsoleCleaner />
                <Analytics />
                <div className="flex flex-col min-h-screen bg-dark-800">
                  <Header />
                  <main className="flex-grow bg-white">{children}</main>
                  <Footer />
                </div>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
