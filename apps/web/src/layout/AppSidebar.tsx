'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "../context/SidebarContext"
import { useTheme } from "../context/ThemeContext"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "home" },
  { name: "Leads", href: "/leads", icon: "user-plus" },
  { name: "Clients", href: "/clients", icon: "users" },
  { name: "Projects", href: "/projects", icon: "folder" },
  { name: "Quotes", href: "/quotes", icon: "file-text" },
  { name: "Vendors", href: "/vendors", icon: "truck" },
  { name: "BOMs", href: "/boms", icon: "list" },
  { name: "Purchase Orders", href: "/pos", icon: "shopping-cart" },
  { name: "Admin", href: "/admin", icon: "settings" },
  { name: "Agent Assistant", href: "/agent", icon: "message-square" },
  { name: "UI Overview", href: "/ui", icon: "layout" },
];

export default function AppSidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className={`fixed left-0 top-0 h-screen bg-gray-200 dark:bg-gray-700 shadow-lg flex flex-col z-40 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center h-20 px-6 border-b border-gray-300 dark:border-gray-600 justify-between">
        <Link href="/dashboard" className={`${isSidebarOpen ? "block" : "hidden"}`}>
          <img className="w-[130px]" src="/assets/images/logo-white.svg" alt="Nexus ERP" />
        </Link>
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
          <i className={`feather ${isSidebarOpen ? "feather-chevron-left" : "feather-chevron-right"} text-lg text-gray-800 dark:text-white`}></i>
        </button>
      </div>
      <ul className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} legacyBehavior>
              <a
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${pathname === item.href
                    ? "bg-red-500 text-white shadow-xl"
                    : "text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"}
                `}
                style={{ boxShadow: pathname === item.href ? "0 4px 16px rgba(0,0,0,0.25)" : undefined }}
              >
                <i className={`feather feather-${item.icon} text-lg`} aria-hidden="true"></i>
                {isSidebarOpen && item.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-4 py-4 border-t border-gray-300 dark:border-gray-600">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
          <i className={`feather ${theme === 'light' ? 'feather-moon' : 'feather-sun'} text-lg`} aria-hidden="true"></i>
          {isSidebarOpen && (theme === 'light' ? 'Dark Mode' : 'Light Mode')}
        </button>
      </div>
    </nav>
  );
}