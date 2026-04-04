/**
 * VideoTestimonialSection — Video testimonials from real partners
 * 
 * Shows:
 * - Embedded video testimonials (or video placeholders)
 * - Partner name, title, firm
 * - Quote text
 * - Play button overlay
 * 
 * BRAND SYSTEM:
 * - Glass: 4% white bg, 8% white border, 12px radius
 * - Geist for body
 * - JetBrains Mono for labels
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    title: "Managing Partner",
    firm: "Westside Legal Group",
    location: "Los Angeles, CA",
    quote: "CasePort transformed our lead flow. We went from 8 cases per month to 28. The quality is unmatched.",
    videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Sarah Martinez",
    title: "Operations Director",
    firm: "Bay Area Advocates",
    location: "San Francisco, CA",
    quote: "The infrastructure is world-class. No more guessing on lead quality. Every lead is pre-qualified and ready to work.",
    videoThumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export default function VideoTestimonialSection() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-28" style={{ backgroundColor: "oklch(0.06 0.01 250)" }}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[12px] text-[#6B7280] mb-3 tracking-[0.15em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            PARTNER STORIES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
          >
            Hear From Active Partners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[16px] text-[#B0B8C4] max-w-2xl mx-auto"
          >
            Real firms, real results. See what's possible when you have access to CasePort infrastructure.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              {/* Video Container */}
              <div className="relative mb-6 rounded-[12px] overflow-hidden">
                {playingIndex === idx ? (
                  <iframe
                    width="100%"
                    height="300"
                    src={testimonial.videoUrl}
                    title={`${testimonial.name} Testimonial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-[12px]"
                  />
                ) : (
                  <div
                    className="relative w-full h-[300px] rounded-[12px] overflow-hidden cursor-pointer group"
                    onClick={() => setPlayingIndex(idx)}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      backgroundImage: `url(${testimonial.videoThumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

                    {/* Play Button */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Play size={24} className="text-white fill-white" />
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Testimonial Info */}
              <div>
                <blockquote className="mb-4">
                  <p className="text-[15px] text-[#B0B8C4] italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </blockquote>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-[14px] font-bold text-[#F1F3F5]">{testimonial.name}</p>
                  <p className="text-[12px] text-[#6B7280] mb-1">{testimonial.title}</p>
                  <p className="text-[12px] text-[#6B7280]">
                    {testimonial.firm} • {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
