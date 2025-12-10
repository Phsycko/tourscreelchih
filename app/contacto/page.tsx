'use client'

import { useState } from 'react'
import { Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'FORM',
          from: data.email,
          to: 'toursCreelChih@gmail.com',
          subject: data.subject,
          content: `Nombre: ${data.name}\nEmail: ${data.email}\nTeléfono: ${data.phone}\n\nMensaje:\n${data.message}`,
        }),
      })

      if (!res.ok) {
        throw new Error('Error al enviar el mensaje')
      }

      toast.success('Mensaje enviado exitosamente')
      reset()
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el mensaje')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">Contacto</h1>
          <p className="text-slate-600 text-lg">Estamos aquí para ayudarte a planear tu aventura</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Información de Contacto</h2>
              <div className="space-y-5">
                <a
                  href="tel:+526351200217"
                  className="flex items-start p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Teléfono</h3>
                    <p className="text-primary-600 font-medium">+52 635 120 0217</p>
                    <p className="text-sm text-slate-500">Haz clic para llamar</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/526351200217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">WhatsApp</h3>
                    <p className="text-green-600 font-medium">+52 635 120 0217</p>
                    <p className="text-sm text-slate-500">Chatea con nosotros</p>
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600 mr-4 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-slate-800">Facebook</h3>
                    <p className="text-blue-600 font-medium">Tours Creel Chih.</p>
                    <p className="text-sm text-slate-500">Síguenos en redes</p>
                  </div>
                </a>
                <div className="flex items-start p-4 bg-slate-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-800">Ubicación</h3>
                    <p className="text-slate-600">Creel, Chihuahua, México</p>
                    <p className="text-sm text-slate-500">Sierra Tarahumara</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Acciones Rápidas</h2>
              <div className="space-y-3">
                <Link
                  href="/cotizar"
                  className="flex items-center justify-center w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Solicitar Cotización
                </Link>
                <Link
                  href="/tours"
                  className="flex items-center justify-center w-full bg-slate-700 text-white px-6 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                  Ver Todos los Tours
                </Link>
                <a
                  href="https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Preguntar por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: true })}
                  placeholder="Tu nombre completo"
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="tu@email.com"
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+52 123 456 7890"
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('subject', { required: true })}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message', { required: true })}
                  rows={5}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center shadow-lg transition-all hover:shadow-xl"
              >
                <Send size={20} className="mr-2" />
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

