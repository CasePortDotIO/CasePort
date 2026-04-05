import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle2, Lock, Zap, TrendingUp, ArrowRight, Shield, FileText, ArrowLeft, Clock, BarChart3 } from 'lucide-react';

export default function RequestAccess() {
  const [screen, setScreen] = useState(1);
  const [formData, setFormData] = useState({
    firmName: '',
    firmSize: '',
    practiceAreas: [] as string[],
    caseVolume: '',
    avgCaseValue: '',
    responseTime: '',
    walletCommitment: '',
    markets: [] as string[],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(72 * 60 * 60);

  useEffect(() => {
    if (!submitted) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handlePracticeAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      practiceAreas: prev.practiceAreas.includes(area)
        ? prev.practiceAreas.filter(a => a !== area)
        : [...prev.practiceAreas, area]
    }));
  };

  const handleMarketToggle = (market: string) => {
    setFormData(prev => ({
      ...prev,
      markets: prev.markets.includes(market)
        ? prev.markets.filter(m => m !== market)
        : [...prev.markets, market]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const canProceed = () => {
    switch (screen) {
      case 1: return formData.firmName.trim().length > 0;
      case 2: return formData.firmSize;
      case 3: return formData.practiceAreas.length > 0;
      case 4: return formData.caseVolume;
      case 5: return formData.avgCaseValue;
      case 6: return formData.responseTime;
      case 7: return formData.walletCommitment;
      case 8: return formData.markets.length > 0;
      case 9: return formData.contactName.trim().length > 0;
      case 10: return formData.contactEmail.includes('@');
      case 11: return formData.contactPhone.trim().length > 0;
      default: return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-2xl w-full space-y-10">
          {/* Success Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-cyan-600" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">
                You're In
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
                Welcome to the network. Your partnership is approved. Your market slot is reserved.
              </p>
            </div>
          </div>

          {/* 72-Hour Countdown */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900 text-base sm:text-lg">Your 72-Hour Window</p>
                  <p className="text-sm text-slate-600">Complete wallet setup to secure your market</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl sm:text-4xl font-bold text-cyan-600">{formatTime(timeRemaining)}</p>
                <p className="text-xs text-slate-600 mt-1">Remaining</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What You're Getting</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: BarChart3, label: 'Real-Time Case Flow', value: '12 cases', color: 'cyan' },
                { icon: TrendingUp, label: 'Lead Quality Score', value: '94/100', color: 'purple' },
                { icon: CheckCircle2, label: 'Conversion Rate', value: '38%', color: 'emerald' }
              ].map((item, i) => {
                const Icon = item.icon;
                const colorClasses = {
                  cyan: 'bg-cyan-50 border-cyan-200',
                  purple: 'bg-purple-50 border-purple-200',
                  emerald: 'bg-emerald-50 border-emerald-200'
                };
                return (
                  <div key={i} className={`${colorClasses[item.color as keyof typeof colorClasses]} rounded-xl p-4 sm:p-6 border`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 mb-3" />
                    <p className="text-sm text-slate-600 mb-2">{item.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wallet Security */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex gap-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Your Wallet is Secure</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Pre-funded wallet held in escrow. We only deduct when case opportunities match your contract terms. Unused balance remains yours. Full transparency in your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Step Activation */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your 4-Step Activation</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: 'E-Sign Agreement (Now)', desc: 'Review partnership terms. Takes 2 minutes.' },
                { step: 2, title: 'Fund Wallet (24 hours)', desc: 'Secure funding instructions sent to your email.' },
                { step: 3, title: 'Markets Live (48 hours)', desc: 'Case opportunities begin flowing immediately.' },
                { step: 4, title: 'Dashboard Access (Instant)', desc: 'Monitor case flow, lead quality, and metrics in real-time.' }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-700 font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{item.title}</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-cyan-50 rounded-2xl p-6 sm:p-8 border border-cyan-200 text-center space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Check Your Email</h3>
            <p className="text-slate-700 text-sm sm:text-base">
              Partnership agreement, wallet setup, and dashboard access sent to <span className="font-semibold text-cyan-700">{formData.contactEmail}</span>
            </p>
            <p className="text-xs text-slate-600">Check spam if you don't see it in 5 minutes</p>
          </div>

          {/* Support */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-slate-700 text-sm sm:text-base">Questions? Reply to your welcome email or contact <a href="mailto:access@caseport.io" className="text-cyan-600 hover:text-cyan-700 font-semibold">access@caseport.io</a></p>
            <p className="text-xs text-slate-500">This partnership is confidential. Your information is encrypted and protected.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-cyan-50 border border-cyan-200 text-xs sm:text-sm font-semibold text-cyan-700">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            EXCLUSIVE NETWORK — 3 FIRMS PER MARKET
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Stop Leaving Money on the Table
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed px-2">
            Only firms that can execute with precision are invited. Controlled case flow. Market-capped access. ABA compliant.
          </p>

          {/* Credibility Stats */}
          <div className="flex justify-center gap-3 sm:gap-6 pt-4 flex-wrap">
            {[
              { value: '12', label: 'Markets' },
              { value: '36', label: 'Firms' },
              { value: '$2.4M+', label: 'Cases' }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-slate-200">
                <p className="text-lg sm:text-2xl font-bold text-cyan-600">{stat.value}</p>
                <p className="text-xs text-slate-600 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-10 sm:mb-14">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${(screen / 11) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Screen 1 */}
          {screen === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What's your firm name?</h2>
                <p className="text-slate-600 text-sm sm:text-base">We'll use this to set up your partnership account.</p>
              </div>
              <input
                type="text"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                placeholder="Your firm name"
                autoFocus
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all text-base"
              />
            </div>
          )}

          {/* Screen 2 */}
          {screen === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How many attorneys?</h2>
                <p className="text-slate-600 text-sm sm:text-base">This helps us understand your firm's capacity.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'solo', label: '1-5' },
                  { value: 'mid', label: '6-20' },
                  { value: 'large', label: '20+' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, firmSize: option.value })}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                      formData.firmSize === option.value
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 3 */}
          {screen === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What practice areas?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Select all that apply.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {['Personal Injury', 'Auto Accidents', 'Slip & Fall', 'Workers Comp', 'Medical Malpractice', 'Product Liability'].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handlePracticeAreaToggle(area)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all font-medium text-xs sm:text-sm text-left ${
                      formData.practiceAreas.includes(area)
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {formData.practiceAreas.includes(area) ? '✓ ' : ''}{area}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 4 */}
          {screen === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Monthly case volume?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Approximate number of cases per month.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: '1-10' },
                  { value: 'medium', label: '11-50' },
                  { value: 'high', label: '50+' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, caseVolume: option.value })}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                      formData.caseVolume === option.value
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 5 */}
          {screen === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Average case value?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Typical settlement or judgment range.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: '<$25K' },
                  { value: 'medium', label: '$25-100K' },
                  { value: 'high', label: '>$100K' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, avgCaseValue: option.value })}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                      formData.avgCaseValue === option.value
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 6 */}
          {screen === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">15-minute response guarantee?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Can your team respond to qualified leads within 15 minutes?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'yes', label: '✓ Yes' },
                  { value: 'no', label: '✗ No' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, responseTime: option.value })}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                      formData.responseTime === option.value
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 7 */}
          {screen === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Pre-funded wallet?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Will you maintain a pre-funded wallet for case opportunities?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'yes', label: '✓ Yes' },
                  { value: 'no', label: '✗ No' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, walletCommitment: option.value })}
                    className={`p-4 sm:p-5 rounded-xl border-2 transition-all font-semibold text-sm sm:text-base ${
                      formData.walletCommitment === option.value
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 8 */}
          {screen === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Which markets?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Select all markets you're interested in.</p>
              </div>
              <div className="space-y-2">
                {['California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania'].map((market) => (
                  <button
                    key={market}
                    type="button"
                    onClick={() => handleMarketToggle(market)}
                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all font-semibold text-left flex items-center justify-between text-sm sm:text-base ${
                      formData.markets.includes(market)
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-900'
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span>{market}</span>
                    {formData.markets.includes(market) && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screen 9 */}
          {screen === 9 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your name?</h2>
                <p className="text-slate-600 text-sm sm:text-base">Primary contact for your partnership.</p>
              </div>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="Full name"
                autoFocus
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all text-base"
              />
            </div>
          )}

          {/* Screen 10 */}
          {screen === 10 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your email?</h2>
                <p className="text-slate-600 text-sm sm:text-base">We'll send your partnership details here.</p>
              </div>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="your@email.com"
                autoFocus
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all text-base"
              />
            </div>
          )}

          {/* Screen 11 */}
          {screen === 11 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Your phone?</h2>
                <p className="text-slate-600 text-sm sm:text-base">For immediate partnership setup.</p>
              </div>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="(555) 123-4567"
                autoFocus
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all text-base"
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 sm:gap-4 pt-4">
            {screen > 1 && (
              <button
                type="button"
                onClick={() => setScreen(screen - 1)}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {screen < 11 ? (
              <button
                type="button"
                onClick={() => setScreen(screen + 1)}
                disabled={!canProceed()}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                  canProceed()
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canProceed()}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                  canProceed()
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
