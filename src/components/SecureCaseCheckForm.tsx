'use client'

import { CheckCircle, ChevronLeft, ChevronRight, Lock, Shield, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import CustomDatePicker from './CustomDatePicker'

/**
 * SecureCaseCheckForm — Premium Dark Shell, Gold Progress, Countdown Confirmation
 *
 * Design: Premium dark shell (#0F1419) with gold (#C9A96E) accents
 * Feel: Guided check-in, not a long application
 * Rules:
 *   - One main question per screen
 *   - Mostly tap-based answers
 *   - Large tap cards
 *   - Minimal typing
 *   - Elegant progress bar
 *   - Back button always visible
 *   - First half extremely low-friction
 */

interface FormData {
  accidentDate: string
  state: string
  county: string
  accidentType: string
  role: string
  medicalCare: string
  fault: string
  otherPartyInsurance: string
  hasLawyer: string
  preferredContact: string
  canTalkNow: string
  hasDocuments: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SecureCaseCheckForm({ isOpen, onClose }: Props) {
  const [currentScreen, setCurrentScreen] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const totalScreens = 13

  const [formData, setFormData] = useState<FormData>({
    accidentDate: '',
    state: '',
    county: '',
    accidentType: '',
    role: '',
    medicalCare: '',
    fault: '',
    otherPartyInsurance: '',
    hasLawyer: '',
    preferredContact: '',
    canTalkNow: '',
    hasDocuments: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  })

  // Countdown timer after submission
  useEffect(() => {
    if (!submitted) return
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [submitted])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const getProgress = () => Math.round((currentScreen / totalScreens) * 100)

  const getPhase = () => {
    if (currentScreen <= 4) return 0
    if (currentScreen <= 7) return 1
    if (currentScreen <= 10) return 2
    if (currentScreen <= 12) return 3
    return 4
  }

  const phases = ['Accident', 'Treatment', 'Fit', 'Documents', 'Contact']

  const handleNext = (overrides?: Partial<typeof formData>) => {
    const currentData = { ...formData, ...overrides }

    // Step validations before proceeding
    if (currentScreen === 1 && !currentData.accidentDate) {
      toast.error('Please select an accident date.')
      return
    }
    if (currentScreen === 2 && !currentData.state) {
      toast.error('Please select your state.')
      return
    }
    if (currentScreen === 3 && !currentData.accidentType) {
      toast.error('Please select the type of accident.')
      return
    }
    if (currentScreen === 4 && !currentData.role) {
      toast.error('Please select your role in the accident.')
      return
    }
    if (currentScreen === 5 && !currentData.medicalCare) {
      toast.error('Please indicate if you received medical care.')
      return
    }
    if (currentScreen === 6 && !currentData.fault) {
      toast.error('Please select who was at fault.')
      return
    }
    if (currentScreen === 7 && !currentData.otherPartyInsurance) {
      toast.error('Please select the insurance status of the other party.')
      return
    }
    if (currentScreen === 8 && !currentData.hasLawyer) {
      toast.error('Please indicate if you already have a lawyer.')
      return
    }
    if (currentScreen === 9 && !currentData.preferredContact) {
      toast.error('Please select how you prefer to be contacted.')
      return
    }
    if (currentScreen === 10 && !currentData.canTalkNow) {
      toast.error('Please indicate if you can talk safely now.')
      return
    }
    if (currentScreen === 11 && !currentData.hasDocuments) {
      toast.error('Please indicate if you have documents to share.')
      return
    }

    if (currentScreen === 8 && currentData.hasLawyer === 'yes') {
      setCurrentScreen(14) // Hard stop
      return
    }
    if (currentScreen === 11 && currentData.hasDocuments !== 'Upload documents now') {
      setCurrentScreen(13) // Skip upload
      return
    }
    if (currentScreen === totalScreens) {
      if (!currentData.firstName?.trim()) {
        toast.error('Please enter your first name.')
        return
      }
      if (!currentData.lastName?.trim()) {
        toast.error('Please enter your last name.')
        return
      }
      if (!currentData.phone?.trim()) {
        toast.error('Please enter your phone number.')
        return
      }
      if (currentData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentData.email.trim())) {
        toast.error('Please enter a valid email address.')
        return
      }

      const payloadData = new FormData()

      // Append standard text fields
      Object.entries(currentData).forEach(([key, value]) => {
        if (value) payloadData.append(key, value)
      })

      // Append binary files
      selectedFiles.forEach((file) => {
        payloadData.append('documents', file)
      })

      fetch('/api/submit-lead', {
        method: 'POST',
        // Omit Content-Type to allow browser to generate boundary for multipart payload
        body: payloadData,
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || 'Submission response was not OK.')
          }
          setSubmitted(true)
        })
        .catch((error) => {
          console.error('Submission error:', error)
          toast.error(error.message || 'An error occurred during submission.')
        })
        .finally(() => setIsSubmitting(false))
      return
    }
    setCurrentScreen((prev) => Math.min(prev + 1, totalScreens))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePrev = () => {
    if (currentScreen === 13 && formData.hasDocuments !== 'Upload documents now') {
      setCurrentScreen(11)
      return
    }
    setCurrentScreen((prev) => Math.max(prev - 1, 1))
  }

  if (!isOpen) return null

  // ============================================================================
  // HARD STOP — Already has a lawyer
  // ============================================================================
  if (currentScreen === 14) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0F1419] border border-white/[0.06] rounded-2xl max-w-md w-full p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
            <Shield size={24} className="text-[#C9A96E]" />
          </div>
          <h2
            className="text-white text-xl font-semibold mb-3"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            We may not be able to continue this request.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-3">
            Because you already have legal representation for this accident, this path may not be
            available.
          </p>
          <p className="text-white/30 text-sm mb-8">We wish you the best with your matter.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium rounded-xl hover:bg-white/[0.1] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // ============================================================================
  // CONFIRMATION — Premium dark success with countdown
  // ============================================================================
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0F1419] flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-lg w-full py-12">
          {/* Success indicator */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/25 flex items-center justify-center mx-auto mb-6 animate-subtleGlow">
              <CheckCircle size={28} className="text-[#C9A96E]" />
            </div>
            <h2
              className="text-white text-2xl font-semibold mb-3"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Your Secure Case Check was received.
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-sm mx-auto">
              Thank you. We are reviewing your information now. If your request fits this path and a
              participating firm is available, the next step may happen quickly.
            </p>
          </div>

          {/* Countdown */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <p className="text-[#C9A96E] text-xs font-medium tracking-widest uppercase mb-3">
                Keep your phone nearby
              </p>
              <div
                className="text-white text-5xl font-bold tracking-wider animate-countdownPulse"
                style={{ fontFamily: 'Inter, sans-serif', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatTime(countdown)}
              </div>
              <p className="text-white/30 text-xs mt-2">Possible next step window</p>
            </div>
            <p className="text-white/40 text-sm text-center leading-relaxed">
              Please stay close to your phone and avoid silencing unknown numbers for the next few
              minutes.
            </p>
          </div>

          {/* Checklist */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 mb-8">
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">
              While you wait
            </p>
            <div className="space-y-3">
              {[
                'Keep your phone nearby',
                'Save any photos, reports, or insurance messages',
                'Hold onto accident-related paperwork',
                'Write down what you remember while it is still fresh',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={15} className="text-[#C9A96E]/60 mt-0.5 shrink-0" />
                  <span className="text-white/50 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-xs text-center leading-relaxed mb-6">
            Availability can depend on location, case type, and other factors.
          </p>

          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium rounded-xl hover:bg-white/[0.1] transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // MAIN FORM — Premium dark shell with gold progress
  // ============================================================================
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center">
      <div className="bg-[#0F1419] w-full max-w-xl md:rounded-2xl md:border md:border-white/[0.06] max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white text-sm font-semibold">Secure Case Check</p>
              <p className="text-white/30 text-xs mt-0.5">Takes about 2 minutes</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all duration-300"
            >
              <X size={14} className="text-white/50" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#C9A96E] to-[#D4B896] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Phase indicators */}
          <div className="flex justify-between">
            {phases.map((phase, i) => (
              <div key={phase} className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    i < getPhase()
                      ? 'bg-[#C9A96E]'
                      : i === getPhase()
                        ? 'bg-[#C9A96E]'
                        : 'bg-white/10'
                  }`}
                />
                <span
                  className={`text-xs transition-colors duration-300 ${
                    i <= getPhase() ? 'text-[#C9A96E] font-medium' : 'text-white/25'
                  }`}
                >
                  {phase}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
          {/* PHASE 1: ACCIDENT */}

          {/* Screen 1: Accident Date */}
          {currentScreen === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Let's start with the accident date.
                </h2>
                <p className="text-white/40 text-sm">
                  This helps us understand timing and next-step options.
                </p>
              </div>
              <CustomDatePicker
                value={formData.accidentDate}
                onChange={(date) => handleInputChange('accidentDate', date)}
              />
              <p className="text-white/25 text-xs">Choose the closest date you know.</p>
            </div>
          )}

          {/* Screen 2: Location */}
          {currentScreen === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Where did the accident happen?
                </h2>
                <p className="text-white/40 text-sm">
                  We use location to check availability in your area.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300 [color-scheme:dark]"
                  >
                    <option value="" className="bg-[#0F1419] text-white">
                      Select state
                    </option>
                    {[
                      'Alabama',
                      'Alaska',
                      'Arizona',
                      'Arkansas',
                      'California',
                      'Colorado',
                      'Connecticut',
                      'Delaware',
                      'Florida',
                      'Georgia',
                      'Hawaii',
                      'Idaho',
                      'Illinois',
                      'Indiana',
                      'Iowa',
                      'Kansas',
                      'Kentucky',
                      'Louisiana',
                      'Maine',
                      'Maryland',
                      'Massachusetts',
                      'Michigan',
                      'Minnesota',
                      'Mississippi',
                      'Missouri',
                      'Montana',
                      'Nebraska',
                      'Nevada',
                      'New Hampshire',
                      'New Jersey',
                      'New Mexico',
                      'New York',
                      'North Carolina',
                      'North Dakota',
                      'Ohio',
                      'Oklahoma',
                      'Oregon',
                      'Pennsylvania',
                      'Rhode Island',
                      'South Carolina',
                      'South Dakota',
                      'Tennessee',
                      'Texas',
                      'Utah',
                      'Vermont',
                      'Virginia',
                      'Washington',
                      'West Virginia',
                      'Wisconsin',
                      'Wyoming',
                    ].map((s) => (
                      <option key={s} value={s} className="bg-[#0F1419] text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">
                    County or City (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                    placeholder="e.g., Los Angeles County"
                    className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300"
                  />
                </div>
              </div>
              <p className="text-white/25 text-xs">
                Enter where the accident happened, not where you live now.
              </p>
            </div>
          )}

          {/* Screen 3: Accident Type */}
          {currentScreen === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  What kind of accident was it?
                </h2>
                <p className="text-white/40 text-sm">Choose the option that is closest.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Car accident',
                  'Truck accident',
                  'Motorcycle accident',
                  'Pedestrian accident',
                  'Rideshare accident',
                  'Other',
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      handleInputChange('accidentType', type)
                      setTimeout(() => handleNext({ accidentType: type }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.accidentType === type
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 4: Role */}
          {currentScreen === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  What was your role?
                </h2>
                <p className="text-white/40 text-sm">
                  This helps us understand the situation more clearly.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Driver',
                  'Passenger',
                  'Pedestrian',
                  'Cyclist',
                  'Motorcyclist',
                  'Family member helping someone else',
                  'Other',
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      handleInputChange('role', role)
                      setTimeout(() => handleNext({ role: role }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.role === role
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{role}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 2: TREATMENT */}

          {/* Screen 5: Medical Care */}
          {currentScreen === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Did you receive medical care related to the accident?
                </h2>
                <p className="text-white/40 text-sm">Choose the option that best fits so far.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Stayed overnight in the hospital',
                  'Had surgery',
                  'Ongoing treatment or physical therapy',
                  'ER or urgent care visit',
                  'Saw a doctor',
                  'No medical treatment',
                ].map((care) => (
                  <button
                    key={care}
                    onClick={() => {
                      handleInputChange('medicalCare', care)
                      setTimeout(() => handleNext({ medicalCare: care }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.medicalCare === care
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{care}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 6: Fault */}
          {currentScreen === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  What do you know about fault?
                </h2>
                <p className="text-white/40 text-sm">
                  This is for routing only, not a legal opinion.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  'The other party was mostly at fault',
                  'Fault may be shared or unclear',
                  'I am not sure yet',
                  'I believe I was mostly at fault',
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('fault', option)
                      setTimeout(() => handleNext({ fault: option }), 300)
                    }}
                    className={`w-full p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.fault === option
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 7: Insurance */}
          {currentScreen === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Do you know whether the other party had insurance?
                </h2>
                <p className="text-white/40 text-sm">If you do not know, that is okay.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Yes', 'No', 'Not sure'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('otherPartyInsurance', option)
                      setTimeout(() => handleNext({ otherPartyInsurance: option }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.otherPartyInsurance === option
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 3: FIT */}

          {/* Screen 8: Has Lawyer */}
          {currentScreen === 8 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Do you already have a lawyer for this accident?
                </h2>
                <p className="text-white/40 text-sm">
                  Please answer based on your current situation today.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Yes', 'No'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('hasLawyer', option.toLowerCase())
                      setTimeout(() => handleNext({ hasLawyer: option.toLowerCase() }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.hasLawyer === option.toLowerCase()
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 9: Preferred Contact */}
          {currentScreen === 9 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  How would you prefer to be contacted if your request moves forward?
                </h2>
                <p className="text-white/40 text-sm">
                  Choose the option you are most likely to respond to.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Phone call', 'Text message', 'Email'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('preferredContact', option)
                      setTimeout(() => handleNext({ preferredContact: option }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.preferredContact === option
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 10: Can Talk Now */}
          {currentScreen === 10 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Can you talk safely right now?
                </h2>
                <p className="text-white/40 text-sm">This helps us follow up the right way.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {['Yes', 'Not right now', 'Text is better'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('canTalkNow', option)
                      setTimeout(() => handleNext({ canTalkNow: option }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.canTalkNow === option
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PHASE 4: DOCUMENTS */}

          {/* Screen 11: Documents */}
          {currentScreen === 11 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Do you have documents you can share?
                </h2>
                <p className="text-white/40 text-sm">
                  Documents can help us understand your situation more clearly and may help your
                  request move forward faster.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Upload documents now',
                  'Send me a secure upload link',
                  'I do not have documents yet',
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleInputChange('hasDocuments', option)
                      setTimeout(() => handleNext({ hasDocuments: option }), 300)
                    }}
                    className={`p-4 text-left rounded-xl transition-all duration-300 ${
                      formData.hasDocuments === option
                        ? 'bg-[#C9A96E]/15 border-2 border-[#C9A96E]/40 text-[#C9A96E]'
                        : 'bg-white/[0.03] border border-white/[0.08] text-white/70 hover:border-white/[0.15] hover:bg-white/[0.05]'
                    }`}
                  >
                    <p className="font-medium text-sm">{option}</p>
                  </button>
                ))}
              </div>
              <p className="text-white/25 text-xs">
                Examples include photos, crash reports, medical paperwork, or insurance letters.
              </p>
            </div>
          )}

          {/* Screen 12: Upload Documents */}
          {currentScreen === 12 && formData.hasDocuments === 'Upload documents now' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Upload your documents securely.
                </h2>
                <p className="text-white/40 text-sm">Add anything you already have available.</p>
              </div>
              <div className="relative border-2 border-dashed border-white/[0.1] rounded-xl p-10 text-center hover:border-[#C9A96E]/30 transition-colors duration-300">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title=""
                />
                <Upload size={28} className="mx-auto text-white/25 mb-3" />
                <p className="text-white/60 font-medium text-sm mb-1">
                  Drag and drop or click to upload
                </p>
                <p className="text-white/25 text-xs">PDF, JPG, PNG</p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-[#C9A96E] text-sm font-medium">Selected files:</p>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
                      >
                        <span className="text-white/80 text-sm truncate max-w-[80%]">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="text-white/40 hover:text-white/80"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-2.5">
                {['Secure upload', 'Private file handling', 'Multiple files accepted'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-[#C9A96E]/60" />
                      <span className="text-white/50 text-sm">{item}</span>
                    </div>
                  ),
                )}
              </div>
              <p className="text-white/20 text-xs leading-relaxed">
                By uploading files, you authorize CasePort to review them for routing and
                administrative purposes. This does not create an attorney-client relationship and
                does not constitute legal advice.
              </p>
            </div>
          )}

          {/* Screen 12 fallback (skipped upload) */}
          {currentScreen === 12 && formData.hasDocuments !== 'Upload documents now' && (
            <div className="space-y-6">
              <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/20 rounded-xl p-6 text-center">
                <CheckCircle size={28} className="mx-auto text-[#C9A96E] mb-3" />
                <p className="text-white font-medium text-sm">
                  Files received. Your case file is now more complete.
                </p>
              </div>
              <p className="text-white/40 text-sm">
                You can continue to the next step, or upload documents later if you find them.
              </p>
            </div>
          )}

          {/* PHASE 5: CONTACT */}

          {/* Screen 13: Contact Info */}
          {currentScreen === 13 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2
                  className="text-white text-xl font-semibold mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Where should we send updates?
                </h2>
                <p className="text-white/40 text-sm">
                  To complete your Secure Case Check, please share the best way to reach you if your
                  request may be a fit for the next step.
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A96E]/50 focus:ring-1 focus:ring-[#C9A96E]/30 transition-all duration-300"
                  />
                </div>
              </div>
              <p className="text-white/25 text-xs">
                Use the phone number you are most likely to answer.
              </p>
              <p className="text-white/20 text-xs leading-relaxed">
                By continuing, you agree to the Privacy Policy and Terms. Submitting information
                does not create an attorney-client relationship.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <div className="border-t border-white/[0.06] px-6 md:px-8 py-5 flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentScreen === 1}
            className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm font-medium rounded-xl hover:bg-white/[0.08] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => handleNext()}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A96E] hover:bg-[#B8985D] text-[#0F1419] text-sm font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {isSubmitting
                ? 'Submitting...'
                : currentScreen === totalScreens
                  ? 'Complete Secure Case Check'
                  : 'Continue'}
            </span>
            {currentScreen < totalScreens && !isSubmitting && <ChevronRight size={16} />}
          </button>
        </div>

        {/* Persistent microcopy */}
        <div className="px-6 md:px-8 pb-4 flex items-center justify-center gap-3">
          <Lock size={11} className="text-white/20" />
          <span className="text-white/20 text-xs">Secure and private. No obligation.</span>
        </div>
      </div>
    </div>
  )
}
