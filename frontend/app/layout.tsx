import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/lib/auth-context'; 
import './globals.css';

const geist = Geist({ subsets: ["latin"], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Chalk | School Payments',
  description: 'Modern school fee management and payment system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        
        <Script
          src={
            process.env.NEXT_PUBLIC_ISW_CHECKOUT_SCRIPT ||
            'https://newwebpay.qa.interswitchng.com/inline-checkout.js'
          }
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}