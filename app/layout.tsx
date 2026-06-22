import type {Metadata} from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Impostor // Crimson Protocol',
  description: 'Dramatična društvena igra pogađanja i otkrivanja uljeza za 3 do 12 igrača u crveno-crnom stilu.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="hr" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#0a0000]" suppressHydrationWarning>{children}</body>
    </html>
  );
}
