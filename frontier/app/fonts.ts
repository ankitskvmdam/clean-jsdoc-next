import { Inter, PT_Mono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const ptMono = PT_Mono({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-pt-mono',
});
