import { Outfit } from 'next/font/google';
import '../UIPAGE/src/app/globals.css';
import { SidebarProvider } from '../UIPAGE/src/context/SidebarContext';
import { ThemeProvider } from '../UIPAGE/src/context/ThemeContext';
import AppSidebar from '../UIPAGE/src/layout/AppSidebar';

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
