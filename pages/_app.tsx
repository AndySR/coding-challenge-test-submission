import '@/styles/global.css';
import type { AppProps } from 'next/app';
import { Roboto } from '@next/font/google';

// If loading a variable font, you don't need to specify the font weight
const roboto = Roboto({
  weight: ['300', '400', '500', '700'], // Choose weights you need
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary', // Creates the CSS variable
});
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
