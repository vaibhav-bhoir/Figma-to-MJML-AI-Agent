/**
 * Next.js App Component
 * This component wraps all pages and handles global styles
 */

import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered Figma to MJML email template converter" />
        <title>Figma to MJML AI Agent</title>
        
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Figma to MJML AI Agent" />
        <meta property="og:description" content="Convert Figma designs and images to responsive MJML email templates using AI" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Figma to MJML AI Agent" />
        <meta name="twitter:description" content="Convert Figma designs and images to responsive MJML email templates using AI" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}