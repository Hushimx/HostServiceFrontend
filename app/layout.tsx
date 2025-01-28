
import { Toaster } from "@/components/ui/sonner";
import { Alexandria } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const lato = Alexandria({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});
export const metadata = {
  title: "Host Service",
  description: "Host Service",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.className}`} suppressHydrationWarning={true}>
      <body className="">
        <LanguageProvider>
          <Toaster position="top-right" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}



















// import { auth } from '@/auth';
// import Providers from '@/components/layout/providers';
// import { Toaster } from '@/components/ui/sonner';
// import type { Metadata } from 'next';
// import { Lato } from 'next/font/google';
// import NextTopLoader from 'nextjs-toploader';
// import './globals.css';
// import { LanguageProvider } from '@/contexts/LanguageContext';

// export const metadata: Metadata = {
//   title: 'Next Shadcn',
//   description: 'Basic dashboard with Next.js and Shadcn'
// };

// const lato = Lato({
//   subsets: ['latin'],
//   weight: ['400', '700', '900'],
//   display: 'swap'
// });

// export default async function RootLayout({
//   children
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html
//       lang="en"
//       className={`${lato.className}`}
//       suppressHydrationWarning={true}
//     >
//       <body >
//           <Toaster position='top-right'  />
//           <LanguageProvider>
//           {children}
//           </LanguageProvider>

//       </body>
//     </html>
//   );
// }
