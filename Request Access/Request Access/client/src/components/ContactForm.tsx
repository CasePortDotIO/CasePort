/**
 * CasePort Contact Form
 * 
 * READABILITY: Labels 11px mono, inputs 15-16px, hints 12px, placeholders white/25
 * Better icon contrast and focus states
 */

import { motion } from 'framer-motion';
import type { ContactInfo } from '@/hooks/useFormState';
import { Globe, Building2, User, Briefcase, Mail, Phone, Linkedin } from 'lucide-react';

interface ContactFormProps {
  contactInfo: ContactInfo;
  onUpdate: (field: keyof ContactInfo, value: string) => void;
}

const fields: {
  key: keyof ContactInfo;
  label: string;
  placeholder: string;
  type: string;
  icon: React.ElementType;
  required: boolean;
  hint?: string;
}[] = [
  { key: 'website', label: 'Website', placeholder: 'yourfirm.com', type: 'url', icon: Globe, required: true, hint: 'We may use this to verify your firm' },
  { key: 'firmName', label: 'Firm Name', placeholder: 'Enter your firm name', type: 'text', icon: Building2, required: true },
  { key: 'fullName', label: 'Full Name', placeholder: 'First and last name', type: 'text', icon: User, required: true },
  { key: 'title', label: 'Title', placeholder: 'e.g. Managing Partner', type: 'text', icon: Briefcase, required: true },
  { key: 'workEmail', label: 'Work Email', placeholder: 'name@yourfirm.com', type: 'email', icon: Mail, required: true },
  { key: 'phone', label: 'Direct Phone', placeholder: '(555) 000-0000', type: 'tel', icon: Phone, required: true },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname', type: 'url', icon: Linkedin, required: false },
];

export function ContactForm({ contactInfo, onUpdate }: ContactFormProps) {
  return (
    <div className="space-y-5">
      {fields.map((field, i) => {
        const Icon = field.icon;
        const value = contactInfo[field.key];
        return (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 + i * 0.04, ease: [0.4, 0, 0.2, 1] }}
          >
            <label className="block mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-white/40"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  {field.label}
                </span>
                {field.required && (
                  <span className="text-[#22D3EE]/40 text-[11px]" style={{ fontFamily: 'var(--font-geist)' }}>
                    Required
                  </span>
                )}
                {!field.required && (
                  <span className="text-white/20 text-[11px]" style={{ fontFamily: 'var(--font-geist)' }}>
                    Optional
                  </span>
                )}
              </div>
            </label>
            <div className="relative">
              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type={field.type}
                value={value}
                onChange={e => onUpdate(field.key, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl 
                           bg-white/[0.04] border border-white/[0.07]
                           text-[#E2E8F0] text-[15px] sm:text-[16px] placeholder:text-white/20
                           focus:outline-none focus:border-[#22D3EE]/25 focus:bg-white/[0.06]
                           focus:shadow-[0_0_0_3px_rgba(34,211,238,0.06)]
                           transition-all duration-200"
                style={{ fontFamily: 'var(--font-geist)' }}
              />
            </div>
            {field.hint && value === '' && (
              <p className="mt-1.5 text-[12px] text-white/20 leading-relaxed" style={{ fontFamily: 'var(--font-geist)' }}>
                {field.hint}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
