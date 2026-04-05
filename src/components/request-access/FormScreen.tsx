"use client";

/*
 * CasePort Form Screen
 * 
 * LAYOUT STRATEGY:
 * - The motion.div is h-full flex flex-col so it fills the panel
 * - For single-choice screens, the option cards section uses flex-1 to fill space
 * - Cards use flex-1 so they stretch to fill the available height
 * 
 * READABILITY RULES:
 * - Headline: 24-28px, bold, #F1F3F5
 * - Body text: 15-16px, #94A3B8
 * - Question label: 14-15px, #C1C8D4
 * - Microcopy: 12-13px, white/35
 * - Back button: 13px, white/35
 * - Legal text: 12px, white/25
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { ScreenConfig } from '@/lib/formData';
import { US_STATES, US_METROS } from '@/lib/formData';
import { OptionCard } from './OptionCard';
import { ChipSelect } from './ChipSelect';
import { ContactForm } from './ContactForm';
import type { ContactInfo } from '@/hooks/useFormState';
import { ArrowLeft, ArrowRight, Lock, Loader2 } from 'lucide-react';

import { toast } from 'sonner';

interface FormScreenProps {
  screen: ScreenConfig;
  selectedOption: string | undefined;
  multiSelectValues: string[];
  contactInfo: ContactInfo;
  onSelectOption: (screenId: number, optionId: string) => void;
  onMultiSelect: (screenId: number, values: string[]) => void;
  onUpdateContact: (field: keyof ContactInfo, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  canGoBack: boolean;
  direction: 'forward' | 'backward';
  isSubmitting?: boolean;
  submitError?: string | null;
}

const variants = {
  enter: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? 24 : -24,
    filter: 'blur(2px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
  },
  exit: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? -24 : 24,
    filter: 'blur(2px)',
  }),
};

export function FormScreen({
  screen,
  selectedOption,
  multiSelectValues,
  contactInfo,
  onSelectOption,
  onMultiSelect,
  onUpdateContact,
  onNext,
  onBack,
  onSubmit,
  canGoBack,
  direction,
  isSubmitting = false,
  submitError = null,
}: FormScreenProps) {
  const isContactScreen = screen.type === 'contact-form';
  const isMultiSelect = screen.type === 'multi-select-states' || screen.type === 'multi-select-metros';
  const isSingleChoice = screen.type === 'single-choice';
  const needsManualAdvance = isMultiSelect || isContactScreen;

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.replace(/\D/g, '').length >= 10;
  const isValidUrl = (url: string) => /.\../.test(url);

  const isContactValid = isContactScreen && 
    contactInfo.website.trim() !== '' && isValidUrl(contactInfo.website) &&
    contactInfo.firmName.trim() !== '' &&
    contactInfo.fullName.trim() !== '' &&
    contactInfo.title.trim() !== '' &&
    contactInfo.workEmail.trim() !== '' && isValidEmail(contactInfo.workEmail) &&
    contactInfo.phone.trim() !== '' && isValidPhone(contactInfo.phone);

  const canProceed = isContactScreen ? isContactValid : (isMultiSelect ? multiSelectValues.length > 0 : false);

  const handleManualAdvance = () => {
    if (isSubmitting) return;

    if (!canProceed) {
      if (isContactScreen) {
        const errors = [];
        
        if (!contactInfo.firmName.trim()) errors.push('Firm Name missing');
        if (!contactInfo.fullName.trim()) errors.push('Full Name missing');
        if (!contactInfo.title.trim()) errors.push('Title missing');

        if (!contactInfo.website.trim()) {
           errors.push('Website missing');
        } else if (!isValidUrl(contactInfo.website)) {
           errors.push('Website invalid');
        }
        
        if (!contactInfo.workEmail.trim()) {
           errors.push('Work Email missing');
        } else if (!isValidEmail(contactInfo.workEmail)) {
           errors.push('Work Email invalid');
        }
        
        if (!contactInfo.phone.trim()) {
           errors.push('Phone missing');
        } else if (!isValidPhone(contactInfo.phone)) {
           errors.push('Phone invalid (needs 10+ digits)');
        }
        
        toast.error('Please correct the following:', { 
          description: errors.join(' • ') 
        });
      } else if (isMultiSelect) {
        toast.error('Selection required', {
          description: 'Please select at least one option before continuing.'
        });
      }
      return;
    }

    if (isContactScreen) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={screen.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="w-full flex flex-col"
      >
        {/* Back button */}
        {canGoBack && !isSubmitting && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] text-white/35 
                       hover:text-white/60 transition-colors duration-200 mb-5 group w-fit"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back
          </motion.button>
        )}

        {/* Screen headline */}
        <h2
          className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-[#F1F3F5] mb-3.5 leading-[1.2]"
          style={{ fontFamily: 'var(--font-geist)', fontWeight: 700 }}
        >
          {screen.headline}
        </h2>

        {/* Screen body */}
        <p
          className="text-[15px] sm:text-[16px] text-[#A0AEC0] leading-relaxed mb-6 sm:mb-7"
          style={{ fontFamily: 'var(--font-geist)' }}
        >
          {screen.body}
        </p>

        {/* Question label */}
        {screen.question && (
          <p
            className="text-[14px] sm:text-[15px] text-[#C1C8D4] mb-4 leading-relaxed"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            {screen.question}
          </p>
        )}

        {/* Screen content — multi-select sizes to content, ChipSelect handles its own scrolling */}
        <div className={isMultiSelect ? 'mb-5' : 'mb-5'}>
          {screen.type === 'single-choice' && screen.options && (
            <div className="flex flex-col gap-2.5">
              {screen.options.map((option, i) => (
                <OptionCard
                  key={option.id}
                  label={option.label}
                  selected={selectedOption === option.id}
                  onClick={() => onSelectOption(screen.id, option.id)}
                  index={i}
                  stretch={false}
                />
              ))}
            </div>
          )}

          {screen.type === 'multi-select-states' && (
            <ChipSelect
              items={US_STATES}
              selected={multiSelectValues}
              onChange={(values) => onMultiSelect(screen.id, values)}
              placeholder="Search states..."
            />
          )}

          {screen.type === 'multi-select-metros' && (
            <ChipSelect
              items={US_METROS}
              selected={multiSelectValues}
              onChange={(values) => onMultiSelect(screen.id, values)}
              placeholder="Search metros or regions..."
            />
          )}

          {screen.type === 'contact-form' && (
            <ContactForm
              contactInfo={contactInfo}
              onUpdate={onUpdateContact}
            />
          )}
        </div>

        {/* Microcopy — only render if non-empty */}
        {screen.microcopy && (
          <p
            className="text-[12px] sm:text-[13px] text-white/30 mb-4 leading-relaxed"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            {screen.microcopy}
          </p>
        )}

        {/* Submit error */}
        {submitError && isContactScreen && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-[13px] text-red-400/80 leading-relaxed"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            {submitError}
          </motion.p>
        )}

        {/* Continue / Submit button — always at bottom, never covered by content */}
        {needsManualAdvance && (
          <div className="flex items-center justify-end mt-4 flex-shrink-0">
            <motion.button
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              onClick={handleManualAdvance}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-[14px] font-semibold transition-all duration-250 cursor-pointer"
              style={{
                fontFamily: 'var(--font-geist)',
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                color: '#FFFFFF',
                boxShadow: '0 4px 24px rgba(34,211,238,0.2), 0 1px 3px rgba(0,0,0,0.3)',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : isContactScreen ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  {screen.buttonText}
                </>
              ) : (
                <>
                  {screen.buttonText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Legal microcopy for contact screen */}
        {isContactScreen && (
          <p
            className="mt-5 text-[12px] text-white/25 leading-relaxed"
            style={{ fontFamily: 'var(--font-geist)' }}
          >
            By continuing, you agree to the{' '}
            <a href="https://caseport.io/privacy" className="underline decoration-white/15 underline-offset-2 hover:text-white/40 transition-colors">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://caseport.io/terms" className="underline decoration-white/15 underline-offset-2 hover:text-white/40 transition-colors">
              Terms
            </a>
            . Submission does not guarantee approval, market access, or case volume.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
