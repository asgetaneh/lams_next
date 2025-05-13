'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import {
  FaTachometerAlt,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 w-64 bg-white shadow-md h-full transition-transform transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:shadow-md`}
      >
        <div className="p-6 font-bold text-2xl border-b border-gray-200">
          📁 My App
        </div>
        <nav className="p-4 space-y-2 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTachometerAlt /> Dashboard
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <FaSignInAlt /> Login
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserPlus /> Signup
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center border-b sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl text-gray-600"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <h1 className="text-xl font-semibold">Welcome</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">User</span>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </header>

        <main className="p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  )
}
