import { Star } from 'lucide-react'

export default function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
      <div className="border-t pt-4">
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.tour}</p>
      </div>
    </div>
  )
}

