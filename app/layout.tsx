import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Web Light Novel",
  description: "A platform for reading and managing light novels",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray">
            <nav className="bg-white shadow-lg">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  {/* Bagian Kiri: Logo dan Menu */}
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold">Web Light Novel</h1>
                    <nav className="hidden sm:flex sm:space-x-8 ml-6">
                      <Link href="/" className="text-gray-900">
                        Home
                      </Link>
                      <Link href="/novels" className="text-gray-900">
                        Novels
                      </Link>
                      <Link href="/genres" className="text-gray-900">
                        Genres
                      </Link>
                    </nav>
                  </div>

                  {/* Bagian Kanan: Tombol Login */}
                  <div className="hidden sm:flex items-center ml-auto">
                    <Button className="inline-flex">
                      <Link href="#">Login</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
