'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

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
          to: 'info@ulisestours.com',
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-gray-600 text-lg">Estamos aquí para ayudarte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Teléfono</h3>
                    <p className="text-gray-600">+1 234 567 890</p>
                    <a
                      href="https://wa.me/1234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href="mailto:info@ulisestours.com"
                      className="text-primary-600 hover:underline"
                    >
                      info@ulisestours.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold">Dirección</h3>
                    <p className="text-gray-600">Ciudad, País</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Mapa (Google Maps API)</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  {...register('subject', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  {...register('message', { required: true })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
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

