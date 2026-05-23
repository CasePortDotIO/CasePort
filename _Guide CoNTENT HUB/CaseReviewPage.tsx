import { useState } from 'react';
import { ChevronRight, Check, AlertCircle, Phone } from 'lucide-react';

const CaseReviewPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1-3: Injury Details
    injuryType: '',
    injurySeverity: '',
    dateOfInjury: '',
    
    // Step 4-6: Liability
    liabilityClarity: '',
    otherPartyInsured: '',
    policeReport: '',
    
    // Step 7-9: Medical
    medicalTreatment: '',
    ongoingTreatment: '',
    medicalBills: '',
    
    // Step 10-12: Financial
    lostWages: '',
    permanentDisability: '',
    estimatedDamages: '',
    
    // Step 13-16: Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [leadScore, setLeadScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    calculateLeadScore({ ...formData, [field]: value });
  };

  const calculateLeadScore = (data: typeof formData) => {
    let score = 0;
    let maxScore = 100;

    // INJURY SEVERITY (0-30 points) - Highest weight
    // Catastrophic cases are most valuable
    if (data.injurySeverity === 'catastrophic') score += 30;
    else if (data.injurySeverity === 'severe') score += 25;
    else if (data.injurySeverity === 'moderate') score += 15;
    else if (data.injurySeverity === 'minor') score += 5;

    // LIABILITY CLARITY (0-25 points) - Critical for case viability
    // Clear liability = easier settlement
    if (data.liabilityClarity === 'clear') score += 25;
    else if (data.liabilityClarity === 'likely') score += 15;
    else if (data.liabilityClarity === 'unclear') score += 5;

    // INSURANCE COVERAGE (0-20 points) - Determines recovery potential
    // No insurance = harder to collect
    if (data.otherPartyInsured === 'yes') score += 20;
    else if (data.otherPartyInsured === 'maybe') score += 10;
    // No insurance = 0 points

    // POLICE REPORT (0-10 points) - Evidence preservation
    if (data.policeReport === 'yes') score += 10;
    else if (data.policeReport === 'unsure') score += 3;

    // MEDICAL TREATMENT (0-15 points) - Proof of injury
    // Immediate treatment = stronger case
    if (data.medicalTreatment === 'yes') score += 15;

    // ONGOING TREATMENT (0-10 points) - Damages multiplier
    // Ongoing treatment = higher damages
    if (data.ongoingTreatment === 'yes') score += 10;

    // MEDICAL EXPENSES (0-10 points) - Damages baseline
    // Higher expenses = higher settlement potential
    const medicalBills = parseInt(data.medicalBills) || 0;
    if (medicalBills > 50000) score += 10;
    else if (medicalBills > 25000) score += 8;
    else if (medicalBills > 10000) score += 5;
    else if (medicalBills > 0) score += 2;

    // LOST WAGES (0-10 points) - Economic damages
    const lostWages = parseInt(data.lostWages) || 0;
    if (lostWages > 50000) score += 10;
    else if (lostWages > 25000) score += 8;
    else if (lostWages > 10000) score += 5;
    else if (lostWages > 0) score += 2;

    // PERMANENT DISABILITY (0-15 points) - Lifetime damages
    // Permanent disability = highest multiplier
    if (data.permanentDisability === 'yes') score += 15;
    else if (data.permanentDisability === 'maybe') score += 8;

    // CONTACT INFORMATION COMPLETENESS (0-5 points) - Lead quality signal
    // Complete contact info = more serious lead
    let contactScore = 0;
    if (data.firstName) contactScore += 1;
    if (data.lastName) contactScore += 1;
    if (data.email) contactScore += 1.5;
    if (data.phone) contactScore += 1.5;
    score += Math.min(contactScore, 5);

    // ESTIMATED DAMAGES (0-5 points) - Claim value signal
    const estimatedDamages = parseInt(data.estimatedDamages) || 0;
    if (estimatedDamages > 500000) score += 5;
    else if (estimatedDamages > 250000) score += 4;
    else if (estimatedDamages > 100000) score += 3;
    else if (estimatedDamages > 50000) score += 2;
    else if (estimatedDamages > 0) score += 1;

    // Cap at 100 and ensure minimum 0
    setLeadScore(Math.min(Math.max(score, 0), 100));
  };

  const getLeadQuality = () => {
    if (leadScore >= 85) return { label: 'Tier 1: Premium Lead', color: 'text-green-700', bg: 'bg-green-50', priority: 'URGENT' };
    if (leadScore >= 70) return { label: 'Tier 2: High Priority', color: 'text-blue-600', bg: 'bg-blue-50', priority: 'HIGH' };
    if (leadScore >= 50) return { label: 'Tier 3: Standard Lead', color: 'text-yellow-600', bg: 'bg-yellow-50', priority: 'MEDIUM' };
    if (leadScore >= 30) return { label: 'Tier 4: Follow-up Lead', color: 'text-orange-600', bg: 'bg-orange-50', priority: 'LOW' };
    return { label: 'Tier 5: Low Priority', color: 'text-red-600', bg: 'bg-red-50', priority: 'ARCHIVE' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, send to backend
    console.log('Form submitted:', { ...formData, leadScore });
  };

  const steps = [
    {
      number: 1,
      title: 'Type of Injury',
      description: 'What type of accident caused your injury?',
      fields: (
        <div className="space-y-3">
          {['Car Accident', 'Slip & Fall', 'Truck Accident', 'Medical Malpractice', 'Workplace Injury', 'Other'].map(type => (
            <label key={type} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="injuryType"
                value={type.toLowerCase()}
                checked={formData.injuryType === type.toLowerCase()}
                onChange={(e) => handleInputChange('injuryType', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 2,
      title: 'Injury Severity',
      description: 'How severe is your injury?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'minor', label: 'Minor (bruises, sprains)' },
            { value: 'moderate', label: 'Moderate (fractures, significant pain)' },
            { value: 'severe', label: 'Severe (permanent disability)' },
            { value: 'catastrophic', label: 'Catastrophic (life-threatening)' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="injurySeverity"
                value={option.value}
                checked={formData.injurySeverity === option.value}
                onChange={(e) => handleInputChange('injurySeverity', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 3,
      title: 'Date of Injury',
      description: 'When did the accident occur?',
      fields: (
        <input
          type="date"
          value={formData.dateOfInjury}
          onChange={(e) => handleInputChange('dateOfInjury', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 4,
      title: 'Liability Clarity',
      description: 'How clear is the other party\'s fault?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'clear', label: 'Clear (100% their fault)' },
            { value: 'likely', label: 'Likely (mostly their fault)' },
            { value: 'unclear', label: 'Unclear (shared fault)' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="liabilityClarity"
                value={option.value}
                checked={formData.liabilityClarity === option.value}
                onChange={(e) => handleInputChange('liabilityClarity', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 5,
      title: 'Insurance Coverage',
      description: 'Does the other party have insurance?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'yes', label: 'Yes, they have insurance' },
            { value: 'maybe', label: 'Unsure' },
            { value: 'no', label: 'No, they don\'t have insurance' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="otherPartyInsured"
                value={option.value}
                checked={formData.otherPartyInsured === option.value}
                onChange={(e) => handleInputChange('otherPartyInsured', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 6,
      title: 'Police Report',
      description: 'Was a police report filed?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'yes', label: 'Yes, I have a police report' },
            { value: 'no', label: 'No police report' },
            { value: 'unsure', label: 'Not sure' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="policeReport"
                value={option.value}
                checked={formData.policeReport === option.value}
                onChange={(e) => handleInputChange('policeReport', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 7,
      title: 'Medical Treatment',
      description: 'Have you received medical treatment?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'yes', label: 'Yes, I\'ve been treated' },
            { value: 'no', label: 'No treatment yet' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="medicalTreatment"
                value={option.value}
                checked={formData.medicalTreatment === option.value}
                onChange={(e) => handleInputChange('medicalTreatment', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 8,
      title: 'Ongoing Treatment',
      description: 'Are you still receiving treatment?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'yes', label: 'Yes, ongoing treatment' },
            { value: 'no', label: 'Treatment completed' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="ongoingTreatment"
                value={option.value}
                checked={formData.ongoingTreatment === option.value}
                onChange={(e) => handleInputChange('ongoingTreatment', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 9,
      title: 'Medical Bills',
      description: 'Approximate medical expenses so far',
      fields: (
        <input
          type="number"
          placeholder="$0"
          value={formData.medicalBills}
          onChange={(e) => handleInputChange('medicalBills', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 10,
      title: 'Lost Wages',
      description: 'Income lost due to injury',
      fields: (
        <input
          type="number"
          placeholder="$0"
          value={formData.lostWages}
          onChange={(e) => handleInputChange('lostWages', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 11,
      title: 'Permanent Disability',
      description: 'Will this cause permanent disability?',
      fields: (
        <div className="space-y-3">
          {[
            { value: 'yes', label: 'Yes, permanent disability' },
            { value: 'maybe', label: 'Possibly' },
            { value: 'no', label: 'No, should fully recover' }
          ].map(option => (
            <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="permanentDisability"
                value={option.value}
                checked={formData.permanentDisability === option.value}
                onChange={(e) => handleInputChange('permanentDisability', e.target.value)}
                className="w-4 h-4"
              />
              <span className="ml-3 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      number: 12,
      title: 'Estimated Damages',
      description: 'Total estimated damages (medical + lost wages + pain & suffering)',
      fields: (
        <input
          type="number"
          placeholder="$0"
          value={formData.estimatedDamages}
          onChange={(e) => handleInputChange('estimatedDamages', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 13,
      title: 'First Name',
      description: 'Your first name',
      fields: (
        <input
          type="text"
          placeholder="First name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 14,
      title: 'Last Name',
      description: 'Your last name',
      fields: (
        <input
          type="text"
          placeholder="Last name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 15,
      title: 'Email',
      description: 'Your email address',
      fields: (
        <input
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    },
    {
      number: 16,
      title: 'Phone Number',
      description: 'Best phone number to reach you',
      fields: (
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4714A] focus:border-transparent"
        />
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const quality = getLeadQuality();

  return (
    <>
      <div className="min-h-screen bg-[#F5F1ED]">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-[#1F4D5C] to-[#2a5f6f] text-white py-16">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Free Case Review</h1>
            <p className="text-lg text-gray-200">
              Answer a few quick questions. We'll evaluate your case and tell you what it might be worth.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          {submitted ? (
            // Success Screen
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F4D5C] mb-2">Thank You!</h2>
              <p className="text-gray-600 mb-6">
                We've received your case review. An attorney will contact you within 24 hours.
              </p>
                  <div className={`p-4 rounded-lg mb-6 ${quality.bg}`}>
                    <p className={`text-sm font-semibold ${quality.color}`}>
                      {quality.label}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Score: {leadScore}/100 • Priority: {quality.priority}
                    </p>
                  </div>
              <a
                href="/"
                className="inline-block bg-[#C4714A] text-white px-6 py-2 rounded-lg hover:bg-[#b85d38] transition"
              >
                Back to Home
              </a>
            </div>
          ) : (
            <div>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}</p>
                    <h2 className="text-2xl font-bold text-[#1F4D5C]">{currentStepData.title}</h2>
                  </div>
                  <div className={`text-right p-3 rounded-lg ${quality.bg}`}>
                    <p className={`text-xs font-semibold ${quality.color}`}>
                      {quality.label}
                    </p>
                    <p className="text-sm text-gray-600 font-semibold">{leadScore}/100</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#C4714A] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                  <p className="text-gray-600 mb-6">{currentStepData.description}</p>
                  {currentStepData.fields}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Back
                  </button>

                  {currentStep === steps.length ? (
                    <button
                      type="submit"
                      className="px-8 py-2 bg-[#C4714A] text-white rounded-lg hover:bg-[#b85d38] transition flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Submit Case Review
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="px-8 py-2 bg-[#C4714A] text-white rounded-lg hover:bg-[#b85d38] transition flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Reassurance */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <strong>100% Confidential.</strong> Your information is protected by attorney-client privilege. We never share your data.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CaseReviewPage;
