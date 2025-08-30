import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '../src/context/SidebarContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import AppSidebar from '../src/layout/AppSidebar';

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="ml-64 pt-10 px-8">
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
