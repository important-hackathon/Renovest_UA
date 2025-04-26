import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Renovest UA",
  description: "Invest in Ukraine's future transparently and efficiently.",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className={`${poppins.className}`}>
        <Header />
        <main>
           <AuthProvider>
              {children}
           </AuthProvider>
        </main>
      </body>
      </html>
  );
}