import { useState } from "react";
import { Play } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  firm: string;
  title: string;
  youtubeId: string;
  quote: string;
  results: string;
  practiceArea: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Michael Chen",
    firm: "Chen & Associates",
    title: "Managing Partner",
    youtubeId: "jNQXAC9IVRw",
    quote: "CasePort transformed how we acquire cases. We went from 8 cases/month to 23 in just 90 days. The precision is unmatched.",
    results: "23 cases signed | $1.8M case value",
    practiceArea: "Auto Accidents",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/GAWSny35pzpMcddsL4jJPz/EbzKOAxTdsIp_edc05b5e.jpg",
  },
  {
    id: "2",
    name: "Sarah Martinez",
    firm: "Martinez Personal Injury Law",
    title: "Senior Attorney",
    youtubeId: "jNQXAC9IVRw",
    quote: "The zero lead decay protocol alone saved us $40K last quarter. This is a game-changer for how we manage our pipeline.",
    results: "40% spend reduction | 125% case volume increase",
    practiceArea: "Slip & Fall",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/GAWSny35pzpMcddsL4jJPz/Nj6Hynd1Naar_9051d89d.jpg",
  },
  {
    id: "3",
    name: "James Wilson",
    firm: "Wilson & Partners",
    title: "Founder",
    youtubeId: "jNQXAC9IVRw",
    quote: "Finally, a lead source we can actually trust. The qualification accuracy is incredible—94% of leads convert to cases.",
    results: "94% qualification accuracy | 18-25%+ conversion rate",
    practiceArea: "Medical Malpractice",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/GAWSny35pzpMcddsL4jJPz/X3VO2gC23qbg_1780661b.jpg",
  },
];

export function VideoTestimonials() {
  const [selectedId, setSelectedId] = useState(testimonials[0].id);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const selected = testimonials.find((t) => t.id === selectedId) || testimonials[0];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="space-y-8">
        {/* Main Video */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-cyan-500/30">
          <div className="aspect-video relative bg-slate-800">
            {playingId === selected.id ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                title={`${selected.name} - ${selected.firm}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={`https://img.youtube.com/vi/${selected.youtubeId}/maxresdefault.jpg`}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPlayingId(selected.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all group"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6 border-t border-cyan-500/20 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Author Photo */}
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-12 h-12 rounded-full object-cover border border-cyan-500/50"
                />
                <div>
                  <h4 className="text-xl font-bold text-white">{selected.name}</h4>
                  <p className="text-sm text-cyan-400">{selected.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{selected.firm}</p>
                  <div className="mt-2 inline-block px-2 py-1 rounded bg-cyan-500/20 border border-cyan-500/50">
                    <span className="text-xs font-semibold text-cyan-400">{selected.practiceArea}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>

            <blockquote className="text-gray-300 italic mb-4 text-lg">
              "{selected.quote}"
            </blockquote>

            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" />
              {selected.results}
            </div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <button
              key={testimonial.id}
              onClick={() => {
                setSelectedId(testimonial.id);
                setPlayingId(null);
              }}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                selectedId === testimonial.id
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/50"
                  : "border-slate-700 hover:border-cyan-500/50"
              }`}
            >
              <div className="aspect-video relative bg-slate-800">
                <img
                  src={`https://img.youtube.com/vi/${testimonial.youtubeId}/mqdefault.jpg`}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>

              <div className="p-3 bg-slate-800 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{testimonial.name}</p>
                    <p className="text-xs text-gray-400 truncate">{testimonial.firm}</p>
                  </div>
                </div>
                <p className="text-xs text-cyan-400 font-medium">{testimonial.practiceArea}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
