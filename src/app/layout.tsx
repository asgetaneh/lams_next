import './globals.css'
import { ReactNode } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import SidebarMenu from '@/components/SidebarMenu'

export const metadata = {
  title: 'Smart Layout',
  description: 'Responsive Sidebar + Top Bar',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden bg-gray-100 text-gray-900 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md flex flex-col fixed h-full z-10">
          <div className="p-6 font-bold text-2xl flex items-center gap-2 border-b border-gray-200">
            📁 My App
          </div>
          <SidebarMenu />
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 ml-64">
          {/* Top Bar */}
          <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">User</span>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                <FaSignInAlt /> Logout
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 overflow-auto h-full">{children}</main>
        </div>
      </body>
    </html>
  )
}
