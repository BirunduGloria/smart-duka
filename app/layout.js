import './globals.css';
import { Inter } from 'next/font/google';
import { ContextProvider } from './context/ContextProvider'; {/*Guys i have added this line */} 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smart POS System',
  description: 'A POS app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
      <body className={inter.className}>
        <ContextProvider>
          {children}
        </ContextProvider>
      </body>
  );
}
