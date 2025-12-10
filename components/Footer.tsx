'use client'

import Link from 'next/link'
import { Facebook, MapPin, MessageCircle } from 'lucide-react'
import PhonePopup from './PhonePopup'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Tours Creel Chih.</h3>
            <p className="text-gray-400 mb-4">
              Experiencias únicas e inolvidables con nuestros guías expertos en la Sierra Tarahumara.
            </p>
            <Link
              href="/cotizar"
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
            >
              Solicitar Cotización
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Tours</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/tours" className="hover:text-white transition-colors">Ver Tours</Link></li>
              <li><Link href="/galeria" className="hover:text-white transition-colors">Galería</Link></li>
              <li><Link href="/cotizar" className="hover:text-white transition-colors">Cotizar</Link></li>
              <li><Link href="/disponibilidad" className="hover:text-white transition-colors">Disponibilidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/cotizar" className="hover:text-white transition-colors">Cotizar</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
              <li><Link href="/vehiculos" className="hover:text-white transition-colors">Vehículos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <PhonePopup phoneNumber="+526351200217" displayNumber="+52 635 120 0217" />
              </li>
              <li>
                <a 
                  href="https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Creel, Chihuahua</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://wa.me/526351200217"
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-500 p-2 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tours Creel Chih. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

