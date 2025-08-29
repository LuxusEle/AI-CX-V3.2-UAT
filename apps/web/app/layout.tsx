
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-white border-r p-6">
            <nav>
              <ul className="space-y-4">
                <li><a href="/dashboard" className="font-semibold hover:text-blue-600">Dashboard</a></li>
                <li><a href="/clients" className="font-semibold hover:text-blue-600">Clients</a></li>
                <li><a href="/leads" className="font-semibold hover:text-blue-600">Leads</a></li>
                <li><a href="/quotes" className="font-semibold hover:text-blue-600">Quotes</a></li>
                {/* Add more links as needed */}
              </ul>
            </nav>
          </aside>
          <main className="flex-1 p-8">
            <header className="mb-6">
              <h1 className="text-2xl font-bold">Nexus ERP</h1>
            </header>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
