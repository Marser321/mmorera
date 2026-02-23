import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import GlobalChatbot from '@/components/GlobalChatbot';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Agencia IA | Automatización del Futuro',
  description: 'Plataforma modular para agencia de automatización con IA.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="bg-[#0B0B0F] text-white font-sans antialiased selection:bg-violet-500/30" suppressHydrationWarning>
        {children}
        <GlobalChatbot />
      </body>
    </html>
  );
}
