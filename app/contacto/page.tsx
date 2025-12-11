'use client'

import { useState } from 'react'
import { Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function ContactPage() {
  const { t } = useTranslation()
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

      // Verificar si la respuesta es JSON
      const contentType = res.headers.get('content-type')
      let result
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        // Si recibimos HTML, probablemente es un error del servidor
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error('Error del servidor. Por favor, contáctanos directamente por WhatsApp: +52 635 120 0217')
        }
        throw new Error('Error al procesar la respuesta del servidor')
      }

      try {
        result = await res.json()
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError)
        throw new Error('Error al procesar la respuesta. Por favor, intenta de nuevo.')
      }

      if (!res.ok) {
        throw new Error(result.error || 'Error al enviar el mensaje')
      }

      toast.success(t('contact.success'))
      reset()
    } catch (error: any) {
      console.error('Error sending message:', error)
      if (error.message?.includes('JSON') || error.message?.includes('DOCTYPE')) {
        toast.error('Error de conexión. Por favor, contáctanos directamente por WhatsApp: +52 635 120 0217')
      } else {
        toast.error(error.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo o contáctanos directamente por WhatsApp.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-slate-800 px-2">{t('contact.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg px-2">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">{t('contact.info.title')}</h2>
              <div className="space-y-3 sm:space-y-4">
                <a
                  href="tel:+526351200217"
                  className="flex items-start p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation active:bg-slate-200"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-800">{t('contact.info.phone')}</h3>
                    <p className="text-primary-600 font-medium text-sm sm:text-base">+52 635 120 0217</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t('contact.info.call')}</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/526351200217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors touch-manipulation active:bg-green-200"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-800">{t('contact.info.whatsapp')}</h3>
                    <p className="text-green-600 font-medium text-sm sm:text-base">+52 635 120 0217</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t('contact.info.chat')}</p>
                  </div>
                </a>
                <a
                  href="https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start p-3 sm:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation active:bg-blue-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-800">{t('contact.info.facebook')}</h3>
                    <p className="text-blue-600 font-medium text-sm sm:text-base">Tours Creel Chih.</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t('contact.info.follow')}</p>
                  </div>
                </a>
                <div className="flex items-start p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mr-3 sm:mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-800">{t('contact.info.location')}</h3>
                    <p className="text-sm sm:text-base text-slate-600">{t('contact.info.address')}</p>
                    <p className="text-xs sm:text-sm text-slate-500">{t('contact.info.region')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-slate-800">{t('contact.actions.title')}</h2>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/cotizar"
                  className="flex items-center justify-center w-full bg-primary-600 text-white px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-primary-700 transition-colors touch-manipulation active:bg-primary-800"
                >
                  {t('contact.actions.quote')}
                </Link>
                <Link
                  href="/tours"
                  className="flex items-center justify-center w-full bg-slate-700 text-white px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-slate-800 transition-colors touch-manipulation active:bg-slate-900"
                >
                  {t('contact.actions.tours')}
                </Link>
                <a
                  href="https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-green-500 text-white px-6 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors touch-manipulation active:bg-green-700"
                >
                  <MessageCircle className="mr-2" size={18} />
                  {t('contact.actions.whatsapp')}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">{t('contact.form.title')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('contact.form.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: true })}
                  placeholder={t('contact.form.namePlaceholder')}
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors touch-manipulation"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{t('contact.form.required')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('contact.form.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors touch-manipulation"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{t('contact.form.required')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder={t('contact.form.phonePlaceholder')}
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors touch-manipulation"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('contact.form.subject')} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('subject', { required: true })}
                  placeholder={t('contact.form.subjectPlaceholder')}
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors touch-manipulation"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{t('contact.form.required')}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message', { required: true })}
                  rows={5}
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors resize-none touch-manipulation"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{t('contact.form.required')}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white px-6 py-3 sm:py-4 rounded-lg text-base sm:text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center shadow-lg transition-all hover:shadow-xl touch-manipulation active:bg-primary-800"
              >
                <Send size={18} className="sm:w-5 sm:h-5 mr-2" />
                {loading ? t('contact.form.sending') : t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

