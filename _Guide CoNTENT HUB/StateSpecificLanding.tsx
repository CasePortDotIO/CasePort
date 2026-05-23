import { useState } from 'react';
import { Phone, MapPin, Clock, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSchemaMarkup } from '@/hooks/useSchemaMarkup';
import {
  generateSettlementRangeSchema,
  generateStatuteOfLimitationsSchema,
  generateBreadcrumbSchema,
  generateAttorneyNetworkSchema,
} from '@/lib/schemaGenerator';

interface StateData {
  state: string;
  statutes: {
    personalInjury: number;
    medicalMalpractice: number;
    wrongfulDeath: number;
  };
  averageSettlements: {
    minor: number;
    moderate: number;
    severe: number;
    catastrophic: number;
  };
  populationServed: number;
  casesResolved: number;
  recoveryRate: string;
}

const stateData: Record<string, StateData> = {
  california: {
    state: 'California',
    statutes: {
      personalInjury: 2,
      medicalMalpractice: 1,
      wrongfulDeath: 2,
    },
    averageSettlements: {
      minor: 18000,
      moderate: 65000,
      severe: 285000,
      catastrophic: 1800000,
    },
    populationServed: 39500000,
    casesResolved: 45000,
    recoveryRate: '87%',
  },
  texas: {
    state: 'Texas',
    statutes: {
      personalInjury: 2,
      medicalMalpractice: 2,
      wrongfulDeath: 2,
    },
    averageSettlements: {
      minor: 16000,
      moderate: 58000,
      severe: 265000,
      catastrophic: 1600000,
    },
    populationServed: 30000000,
    casesResolved: 38000,
    recoveryRate: '84%',
  },
  florida: {
    state: 'Florida',
    statutes: {
      personalInjury: 4,
      medicalMalpractice: 2,
      wrongfulDeath: 2,
    },
    averageSettlements: {
      minor: 20000,
      moderate: 72000,
      severe: 310000,
      catastrophic: 2000000,
    },
    populationServed: 22000000,
    casesResolved: 32000,
    recoveryRate: '89%',
  },
  newyork: {
    state: 'New York',
    statutes: {
      personalInjury: 3,
      medicalMalpractice: 2,
      wrongfulDeath: 2,
    },
    averageSettlements: {
      minor: 22000,
      moderate: 78000,
      severe: 340000,
      catastrophic: 2200000,
    },
    populationServed: 19500000,
    casesResolved: 28000,
    recoveryRate: '91%',
  },
  illinois: {
    state: 'Illinois',
    statutes: {
      personalInjury: 2,
      medicalMalpractice: 2,
      wrongfulDeath: 2,
    },
    averageSettlements: {
      minor: 17000,
      moderate: 62000,
      severe: 280000,
      catastrophic: 1700000,
    },
    populationServed: 12600000,
    casesResolved: 18000,
    recoveryRate: '85%',
  },
};

interface StateSpecificLandingProps {
  state?: string;
}

const StateSpecificLanding = ({ state = 'california' }: StateSpecificLandingProps) => {
  const data = stateData[state.toLowerCase()] || stateData.california;
  const [selectedInjury, setSelectedInjury] = useState<'minor' | 'moderate' | 'severe' | 'catastrophic'>('moderate');

  // Inject geo-targeted AEO schemas
  useSchemaMarkup({
    settlementRange: generateSettlementRangeSchema('Personal Injury', data.state),
    statuteOfLimitations: generateStatuteOfLimitationsSchema(data.state.toLowerCase()),
    breadcrumb: generateBreadcrumbSchema(['home', 'injured', state.toLowerCase()]),
    attorneyNetwork: generateAttorneyNetworkSchema(),
  });

  const injuryTypes = [
    { key: 'minor' as const, label: 'Minor Injuries', description: 'Bruises, sprains' },
    { key: 'moderate' as const, label: 'Moderate Injuries', description: 'Fractures, significant pain' },
    { key: 'severe' as const, label: 'Severe Injuries', description: 'Permanent disability' },
    { key: 'catastrophic' as const, label: 'Catastrophic Injuries', description: 'Life-threatening' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40 opacity-0 pointer-events-none transition-all duration-300" id="sticky-header">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1F4D5C] rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CP</span>
            </div>
            <span className="font-bold text-[#1F4D5C]">CasePort</span>
          </div>
          <a href="/case-review" className="bg-[#C4714A] text-white px-4 py-2 rounded-lg hover:bg-[#b85d38] transition">
            Free Case Review
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1F4D5C] to-[#2a5f6f] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-200">
            <MapPin className="w-4 h-4" />
            <span>Personal Injury Guides for {data.state}</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Get Fair Compensation in {data.state}
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Attorney-reviewed guides for accident victims in {data.state}. Know your rights, understand your settlement value, and get the compensation you deserve.
          </p>
          <a href="/case-review" className="inline-block bg-[#C4714A] text-white px-8 py-3 rounded-lg hover:bg-[#b85d38] transition font-semibold">
            Get Free Case Review
          </a>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#C4714A] mb-2">
              ${(data.averageSettlements.moderate / 1000).toFixed(0)}K
            </div>
            <p className="text-gray-600 text-sm">Average Settlement</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#1F4D5C] mb-2">
              {data.recoveryRate}
            </div>
            <p className="text-gray-600 text-sm">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#4A9BA8] mb-2">
              {data.casesResolved.toLocaleString()}+
            </div>
            <p className="text-gray-600 text-sm">Cases Resolved</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#1F4D5C] mb-2">
              24/7
            </div>
            <p className="text-gray-600 text-sm">Available Support</p>
          </div>
        </div>
      </section>

      {/* Statute of Limitations */}
      <section className="py-16 px-4 bg-blue-50 border-l-4 border-blue-500">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-[#1F4D5C] mb-4">
                Know Your Deadline in {data.state}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Personal Injury</p>
                  <p className="text-3xl font-bold text-[#C4714A]">
                    {data.statutes.personalInjury} Years
                  </p>
                  <p className="text-xs text-gray-500 mt-2">From date of injury</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Medical Malpractice</p>
                  <p className="text-3xl font-bold text-[#C4714A]">
                    {data.statutes.medicalMalpractice} Years
                  </p>
                  <p className="text-xs text-gray-500 mt-2">From date of discovery</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Wrongful Death</p>
                  <p className="text-3xl font-bold text-[#C4714A]">
                    {data.statutes.wrongfulDeath} Years
                  </p>
                  <p className="text-xs text-gray-500 mt-2">From date of death</p>
                </div>
              </div>
              <p className="text-sm text-blue-900 mt-6 bg-white p-4 rounded-lg">
                <strong>Don't wait.</strong> Statute of limitations deadlines are strict. Contact an attorney immediately to preserve your rights and evidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settlement Calculator */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F4D5C] mb-2 text-center">
            What's Your Case Worth in {data.state}?
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Settlement amounts vary based on injury severity, liability, and insurance coverage.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Injury Type Selector */}
            <div>
              <h3 className="font-semibold text-[#1F4D5C] mb-4">Select Your Injury Type</h3>
              <div className="space-y-3">
                {injuryTypes.map(injury => (
                  <button
                    key={injury.key}
                    onClick={() => setSelectedInjury(injury.key)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedInjury === injury.key
                        ? 'border-[#C4714A] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{injury.label}</div>
                    <div className="text-sm text-gray-600">{injury.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settlement Display */}
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="font-semibold text-[#1F4D5C] mb-6">
                Typical Settlement Range in {data.state}
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Average Settlement</p>
                  <p className="text-4xl font-bold text-[#C4714A]">
                    ${(data.averageSettlements[selectedInjury] / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">With Attorney</p>
                  <p className="text-2xl font-bold text-[#1F4D5C]">
                    ${(data.averageSettlements[selectedInjury] * 0.75 / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500 mt-1">After 33% attorney fee</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <strong>Note:</strong> These are averages. Your settlement depends on liability clarity, insurance limits, and case specifics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why {data.state} Cases Matter */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F4D5C] mb-12 text-center">
            Why {data.state} Personal Injury Cases Matter
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-[#C4714A] mb-4" />
              <h3 className="font-semibold text-[#1F4D5C] mb-2">High Settlement Potential</h3>
              <p className="text-gray-600 text-sm">
                {data.state} has strong personal injury laws and juries that award fair compensation for accident victims.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-[#C4714A] mb-4" />
              <h3 className="font-semibold text-[#1F4D5C] mb-2">Comparative Negligence</h3>
              <p className="text-gray-600 text-sm">
                {data.state} allows recovery even if you're partially at fault. Your settlement is reduced by your percentage of fault.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-[#C4714A] mb-4" />
              <h3 className="font-semibold text-[#1F4D5C] mb-2">Contingency Representation</h3>
              <p className="text-gray-600 text-sm">
                Attorneys in {data.state} work on contingency. You pay nothing upfront—only if you win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#1F4D5C] to-[#2a5f6f] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Fair Compensation?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Get a free case review from an experienced attorney. No upfront cost. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/case-review" className="bg-[#C4714A] text-white px-8 py-3 rounded-lg hover:bg-[#b85d38] transition font-semibold">
              Start Free Case Review
            </a>
            <a href="tel:1-800-227-3669" className="bg-white text-[#1F4D5C] px-8 py-3 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Now: 1-800-227-3669
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F4D5C] mb-12 text-center">
            Common Questions About {data.state} Personal Injury Cases
          </h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-lg border border-gray-200 group">
              <summary className="font-semibold text-[#1F4D5C] cursor-pointer flex justify-between items-center">
                What is the statute of limitations in {data.state}?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                In {data.state}, the statute of limitations for personal injury cases is {data.statutes.personalInjury} years from the date of injury. This is a strict deadline—if you miss it, you lose your right to sue.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg border border-gray-200 group">
              <summary className="font-semibold text-[#1F4D5C] cursor-pointer flex justify-between items-center">
                How much do personal injury cases settle for in {data.state}?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                Settlements vary widely based on injury severity and liability. In {data.state}, moderate injury cases average around ${(data.averageSettlements.moderate / 1000).toFixed(0)}K, while severe cases can exceed ${(data.averageSettlements.severe / 1000).toFixed(0)}K.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg border border-gray-200 group">
              <summary className="font-semibold text-[#1F4D5C] cursor-pointer flex justify-between items-center">
                Do I need an attorney for my {data.state} personal injury case?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-gray-600 mt-4">
                For serious injuries, we recommend hiring an attorney. Attorneys in {data.state} increase settlements by 25-40% on average and work on contingency (no upfront cost).
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F4D5C] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-300">
          <p className="mb-4">
            CasePort provides attorney-reviewed guides for personal injury victims in {data.state} and across the United States.
          </p>
          <p>
            This is not legal advice. Consult with a licensed attorney in {data.state} for advice specific to your case.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default StateSpecificLanding;
