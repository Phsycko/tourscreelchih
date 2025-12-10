import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-6 rounded-2xl shadow-xl border border-slate-600 h-full flex flex-col relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300">
      {/* Decorative quote icon */}
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote size={48} className="text-primary-400" />
      </div>
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} 
          />
        ))}
      </div>
      
      {/* Comment */}
      <p className="text-slate-300 mb-6 italic leading-relaxed flex-grow">
        "{testimonial.comment}"
      </p>
      
      {/* Author info */}
      <div className="border-t border-slate-600 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-white">{testimonial.name}</p>
            <p className="text-sm text-primary-400">{testimonial.tour}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

