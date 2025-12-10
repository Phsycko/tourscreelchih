'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, Calendar, MessageSquare, MapPin, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AdminNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/reservations', label: 'Reservas', icon: Calendar },
    { href: '/admin/tours', label: 'Tours', icon: MapPin },
    { href: '/admin/messages', label: 'Mensajes', icon: MessageSquare },
  ]

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-2xl font-bold text-primary-600">
              Panel del Guía
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                handleLogout()
                setIsOpen(false)
              }}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
