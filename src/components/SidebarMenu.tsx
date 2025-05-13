'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  FaTachometerAlt, FaFolderOpen, FaArchive, FaUsers,
  FaSignInAlt, FaUserPlus, FaChevronDown, FaChevronRight, FaFileAlt
} from 'react-icons/fa'

const menuItems = [
  {
    title: 'Dashboard',
    icon: <FaTachometerAlt />,
    href: '/dashboard',
  },
  {
    title: 'Settings',
    icon: <FaFolderOpen />,
    subMenu: [
      { title: 'Office', href: '/office', icon: <FaFileAlt /> },
      { title: 'Letter Types', href: '/letter-types', icon: <FaFileAlt /> },
      { title: 'Letter Template', href: '/templates', icon: <FaFileAlt /> },
      { title: 'Office2', href: '/office/list', icon: <FaFileAlt /> },
    ],
  },
  {
    title: 'Letter',
    icon: <FaFolderOpen />,
    subMenu: [
      { title: 'Inbox', href: '/letters/inbox', icon: <FaFileAlt /> },
      { title: 'Outbox', href: '/letters/outbox', icon: <FaFileAlt /> },
    ],
  },
  {
    title: 'Archive',
    icon: <FaArchive />,
    subMenu: [
      { title: 'Documents', href: '/archive/documents', icon: <FaFileAlt /> },
      { title: 'Retention', href: '/archive/retention', icon: <FaFileAlt /> },
    ],
  },
  {
    title: 'User Management',
    icon: <FaUsers />,
    subMenu: [
      { title: 'Login', href: '/login', icon: <FaSignInAlt /> },
      { title: 'Signup', href: '/signup', icon: <FaUserPlus /> },
    ],
  },
]

export default function SidebarMenu() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (title: string) => {
    setOpenMenu(prev => (prev === title ? null : title))
  }

  return (
    <nav className="flex-1 px-4 py-6 space-y-4 text-[15px] font-medium text-gray-800">
      {menuItems.map(item => (
        <div key={item.title}>
          {item.href ? (
            <Link
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-md transition-all hover:bg-blue-50 ${
                pathname === item.href ? 'bg-blue-100 border-l-4 border-blue-600' : ''
              }`}
            >
              {item.icon}
              <span className="text-base">{item.title}</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => toggleMenu(item.title)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <span className="flex items-center gap-3 text-[15px] font-semibold">
                  {item.icon} {item.title}
                </span>
                {openMenu === item.title ? <FaChevronDown /> : <FaChevronRight />}
              </button>

              <div
                className={`overflow-hidden transition-all ${
                  openMenu === item.title ? 'max-h-96' : 'max-h-0'
                } pl-6 pr-2 mt-2 space-y-2`}
              >
                {item.subMenu?.map(sub => (
                  <Link
                    key={sub.title}
                    href={sub.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-gray-100 transition-all ${
                      pathname === sub.href ? 'text-blue-700 bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    {sub.icon}
                    <span className="text-[14px]">{sub.title}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </nav>
  )
}
