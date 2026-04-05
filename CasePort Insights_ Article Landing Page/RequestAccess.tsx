import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Check, Lock, Zap, Shield, TrendingUp, MapPin, Users, Clock, ArrowRight } from "lucide-react";

const BG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/caseport-request-access-bg-LMYH29s9ThjSu8pami2xB8.webp";

export default function RequestAccess() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firmName: "",
    contactName: "",
    email: "",
    phone: "",
    firmSize: "",
    practiceAreas: [] as string[],
    markets: [] as string[],
    responseTime: false,
    preFundedWallet: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [qualificationScore, setQualificationScore] = useState(0);

  // Calculate qualification score silently
  useEffect(() => {
    let score = 0;
    if (formData.responseTime) score += 25;
    if (formData.preFundedWallet) score += 25;
    if (formData.practiceAreas.length > 0) score += 20;
    if (formData.markets.length > 0) score += 20;
    if (formData.firmSize) score += 10;
    setQualificationScore(score);
  }, [formData]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const practiceAreaOptions = [
    "Auto Accident",
    "Slip & Fall",
    "Premises Liability",
    "Product Liability",
    "Wrongful Death",
    "Medical Malpractice",
  ];

  const marketOptions = [
    "Los Angeles",
    "Houston",
    "Miami",
    "New York",
    "Chicago",
    "Phoenix",
    "Atlanta",
    "Philadelphia",
    "Dallas",
    "Las Vegas",
  ];

  if (submitted) {
    return <SubmissionConfirmation qualificationScore={qualificationScore} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030608] text-white">
      {/* Background with glassmorphism */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={BG_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030608]/80 via-[#030608]/60 to-[#030608]/80" />
        <div className="absolute left-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-cyan-500/5 blur-[150px]" />
        <div className="absolute right-[-5%] top-[40%] h-[35rem] w-[35rem] rounded-full bg-violet-500/5 blur-[140px]" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-2 mb-6">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-medium text-[#9CA3AF] tracking-widest">EXCLUSIVE PARTNER NETWORK</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Join the
              <br />
              <span className="text-gradient-cyan">Controlled Case Flow</span>
              <br />
              Network
            </h1>

            <p className="text-lg text-[#B8C0CC] max-w-xl mx-auto leading-relaxed">
              We've capped this network to 3 qualified firms per market. This isn't lead generation. This is case flow architecture.
            </p>
          </motion.div>

          {/* Credibility Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-12"
          >
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">3</div>
              <div className="text-xs text-[#9CA3AF]">Firms Per Metro</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">12</div>
              <div className="text-xs text-[#9CA3AF]">Active Markets</div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">15m</div>
              <div className="text-xs text-[#9CA3AF]">Response Req.</div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 sm:p-10 shadow-2xl"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#9CA3AF]">Step {step + 1} of 5</span>
                <span className="text-sm font-medium text-cyan-400">{Math.round(((step + 1) / 5) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / 5) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 0 && <Step0 formData={formData} setFormData={setFormData} />}
              {step === 1 && <Step1 formData={formData} setFormData={setFormData} />}
              {step === 2 && (
                <Step2
                  formData={formData}
                  setFormData={setFormData}
                  options={practiceAreaOptions}
                />
              )}
              {step === 3 && (
                <Step3
                  formData={formData}
                  setFormData={setFormData}
                  options={marketOptions}
                />
              )}
              {step === 4 && <Step4 formData={formData} setFormData={setFormData} />}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className="px-6 py-2.5 rounded-lg border border-white/10 text-sm font-medium text-[#9CA3AF] transition hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {step < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
                >
                  Submit Application
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Legally Compliant</div>
                <div className="text-xs text-[#9CA3AF]">ABA-compliant intake process</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">15-Min Response</div>
                <div className="text-xs text-[#9CA3AF]">Structured intake protocol</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Case Recovery</div>
                <div className="text-xs text-[#9CA3AF]">Lead recycling system</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FORM STEPS
   ═══════════════════════════════════════════════════════════════ */

function Step0({ formData, setFormData }: any) {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-3">Firm Name</label>
        <input
          type="text"
          value={formData.firmName}
          onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
          placeholder="Your law firm"
          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.04] text-white placeholder-[#6B7280] focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-3">Contact Name</label>
        <input
          type="text"
          value={formData.contactName}
          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.04] text-white placeholder-[#6B7280] focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition"
        />
      </div>

      <div className="text-center text-sm text-[#9CA3AF]">
        <p>Step 1 of 5: Basic Information</p>
      </div>
    </motion.div>
  );
}

function Step1({ formData, setFormData }: any) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-3">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your@firm.com"
          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.04] text-white placeholder-[#6B7280] focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-3">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
          className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/[0.04] text-white placeholder-[#6B7280] focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 transition"
        />
      </div>

      <div className="text-center text-sm text-[#9CA3AF]">
        <p>Step 2 of 5: Contact Information</p>
      </div>
    </motion.div>
  );
}

function Step2({ formData, setFormData, options }: any) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-4">Practice Areas (Select All That Apply)</label>
        <div className="space-y-3">
          {options.map((area: string) => (
            <label key={area} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.practiceAreas.includes(area)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      practiceAreas: [...formData.practiceAreas, area],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      practiceAreas: formData.practiceAreas.filter((a: string) => a !== area),
                    });
                  }
                }}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-400 cursor-pointer"
              />
              <span className="text-sm text-[#B8C0CC] group-hover:text-white transition">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-[#9CA3AF]">
        <p>Step 3 of 5: Practice Areas</p>
      </div>
    </motion.div>
  );
}

function Step3({ formData, setFormData, options }: any) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-4">Markets (Select All That Apply)</label>
        <div className="grid grid-cols-2 gap-3">
          {options.map((market: string) => (
            <label key={market} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.markets.includes(market)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      markets: [...formData.markets, market],
                    });
                  } else {
                    setFormData({
                      ...formData,
                      markets: formData.markets.filter((m: string) => m !== market),
                    });
                  }
                }}
                className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-400 cursor-pointer"
              />
              <span className="text-sm text-[#B8C0CC] group-hover:text-white transition">{market}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-[#9CA3AF]">
        <p>Step 4 of 5: Markets</p>
      </div>
    </motion.div>
  );
}

function Step4({ formData, setFormData }: any) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4 mb-8">
        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border border-white/10 hover:bg-white/[0.03] transition">
          <input
            type="checkbox"
            checked={formData.responseTime}
            onChange={(e) => setFormData({ ...formData, responseTime: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-400 cursor-pointer mt-1"
          />
          <div>
            <div className="text-sm font-medium text-white">15-Minute Response Commitment</div>
            <div className="text-xs text-[#9CA3AF]">Can your team respond to qualified leads within 15 minutes?</div>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border border-white/10 hover:bg-white/[0.03] transition">
          <input
            type="checkbox"
            checked={formData.preFundedWallet}
            onChange={(e) => setFormData({ ...formData, preFundedWallet: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/5 accent-cyan-400 cursor-pointer mt-1"
          />
          <div>
            <div className="text-sm font-medium text-white">Pre-Funded Wallet Model</div>
            <div className="text-xs text-[#9CA3AF]">Are you prepared to use a pre-funded wallet for case acquisition?</div>
          </div>
        </label>
      </div>

      <div className="text-center text-sm text-[#9CA3AF]">
        <p>Step 5 of 5: Operational Readiness</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBMISSION CONFIRMATION (SILENT QUALIFICATION)
   ═══════════════════════════════════════════════════════════════ */

function SubmissionConfirmation({ qualificationScore }: any) {
  const isHighQuality = qualificationScore >= 80;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030608] text-white flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030608]/80 via-[#030608]/60 to-[#030608]/80" />
        <div className="absolute left-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full bg-cyan-500/5 blur-[150px]" />
        <div className="absolute right-[-5%] top-[40%] h-[35rem] w-[35rem] rounded-full bg-violet-500/5 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-xl"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 mb-6">
              <Check className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Application Received</h1>

          <p className="text-lg text-[#B8C0CC] mb-8 leading-relaxed">
            {isHighQuality
              ? "Your application has been submitted. Our partnership team is reviewing your profile against our network standards."
              : "Your application has been submitted. We're analyzing your fit for our exclusive network."}
          </p>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 mb-8">
            <div className="text-sm text-[#9CA3AF] mb-2">Next Steps</div>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-400">1</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Qualification Review</div>
                  <div className="text-xs text-[#9CA3AF]">We're assessing your operational readiness</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-400">2</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Market Availability Check</div>
                  <div className="text-xs text-[#9CA3AF]">We'll confirm capacity in your selected markets</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cyan-400">3</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Partnership Activation</div>
                  <div className="text-xs text-[#9CA3AF]">Access credentials and onboarding materials</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#9CA3AF] mb-8">
            You'll receive updates via email. Expected timeline: 2-3 business days.
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Return to Home
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
