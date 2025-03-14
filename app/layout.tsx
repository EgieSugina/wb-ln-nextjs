import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Button } from "@/components/ui/button";
import {LoginDialog} from "@/components/LoginDialog"
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
          <div className="min-h-screen dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm">
              <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Bagian Kiri: Logo & Link */}
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Web Light Novel
                    </h1>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      <Link
                        href="/"
                        className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        Home
                      </Link>
                      <Link
                        href="/novels"
                        className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        Novels
                      </Link>
                      <Link
                        href="/genres"
                        className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        Genres
                      </Link>
                      <Link
                        href="#"
                        className="text-gray-900 dark:text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        Bookmark
                      </Link>
                    </div>
                  </div>

                  {/* Bagian Kanan: Theme Switcher & Login */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <ThemeSwitcher />

                      <LoginDialog />

                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content yang Selalu di Tengah */}
            <main className="w-full dark:bg-black">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
