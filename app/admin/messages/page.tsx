'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Mail, Phone, Facebook, Instagram, Send, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  channel: string
  from: string
  to: string
  subject: string | null
  content: string
  client: { name: string; email: string } | null
  isRead: boolean
  createdAt: string
}

const channelIcons: Record<string, any> = {
  WHATSAPP: MessageCircle,
  EMAIL: Mail,
  PHONE: Phone,
  FACEBOOK: Facebook,
  INSTAGRAM: Instagram,
  TELEGRAM: Send,
  FORM: Mail,
}

const channelColors: Record<string, string> = {
  WHATSAPP: 'bg-green-500',
  EMAIL: 'bg-blue-500',
  PHONE: 'bg-blue-600',
  FACEBOOK: 'bg-blue-700',
  INSTAGRAM: 'bg-pink-500',
  TELEGRAM: 'bg-blue-400',
  FORM: 'bg-gray-600',
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchMessages()
  }, [filter])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = filter !== 'all' ? `/api/messages?channel=${filter}` : '/api/messages'
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isRead: true }),
      })

      if (res.ok) {
        fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: true })
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-gray-600 mt-2">Todos los mensajes de todos los canales</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex space-x-2 flex-wrap">
                {['all', 'WHATSAPP', 'EMAIL', 'FORM', 'PHONE'].map((channel) => (
                  <button
                    key={channel}
                    onClick={() => setFilter(channel)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      filter === channel
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {channel === 'all' ? 'Todos' : channel}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {messages.map((message) => {
                  const Icon = channelIcons[message.channel] || MessageCircle
                  const color = channelColors[message.channel] || 'bg-gray-500'
                  return (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message)
                        if (!message.isRead) {
                          markAsRead(message.id)
                        }
                      }}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        !message.isRead ? 'bg-blue-50' : ''
                      } ${selectedMessage?.id === message.id ? 'bg-primary-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`${color} p-2 rounded-full`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {message.from}
                            </p>
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {message.subject || message.content.substring(0, 50)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const Icon = channelIcons[selectedMessage.channel] || MessageCircle
                      const color = channelColors[selectedMessage.channel] || 'bg-gray-500'
                      return (
                        <div className={`${color} p-2 rounded-full`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      )
                    })()}
                    <div>
                      <h3 className="text-lg font-bold">{selectedMessage.channel}</h3>
                      <p className="text-sm text-gray-600">{selectedMessage.from}</p>
                    </div>
                  </div>
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                    >
                      <Check size={18} />
                      <span>Marcar como leído</span>
                    </button>
                  )}
                </div>

                {selectedMessage.subject && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Asunto</h4>
                    <p className="text-lg font-semibold">{selectedMessage.subject}</p>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Mensaje</h4>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>
                </div>

                {selectedMessage.client && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Cliente</h4>
                    <p className="font-semibold">{selectedMessage.client.name}</p>
                    <p className="text-sm text-gray-600">{selectedMessage.client.email}</p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  Recibido: {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecciona un mensaje para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

