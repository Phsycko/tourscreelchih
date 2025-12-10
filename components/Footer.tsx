import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ulises Tours</h3>
            <p className="text-gray-400">
              Experiencias únicas e inolvidables con nuestros guías expertos.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/tours" className="hover:text-white">Tours</Link></li>
              <li><Link href="/vehiculos" className="hover:text-white">Vehículos</Link></li>
              <li><Link href="/precios" className="hover:text-white">Precios</Link></li>
              <li><Link href="/galeria" className="hover:text-white">Galería</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/disponibilidad" className="hover:text-white">Disponibilidad</Link></li>
              <li><Link href="/reservar" className="hover:text-white">Reservar</Link></li>
              <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@ulisestours.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Ciudad, País</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ulises Tours. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

