import React, { useState } from "react";
import { X, AlertCircle, CheckCircle2, Lock, Shield, Upload, ArrowRight, ChevronRight } from "lucide-react";

interface CaseMeritModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseMeritModal({ isOpen, onClose }: CaseMeritModalProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [formData, setFormData] = useState({
    incidentDate: "",
    state: "",
    county: "",
    atFault: "",
    medicalTreatment: [] as string[],
    insurance: "",
    hasAttorney: "",
    willProvideDocumentation: "",
    documents: [] as File[],
    name: "",
    email: "",
    phone: "",
  });

  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedicalTreatmentChange = (treatment: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalTreatment: prev.medicalTreatment.includes(treatment)
        ? prev.medicalTreatment.filter((t) => t !== treatment)
        : [...prev.medicalTreatment, treatment],
    }));
  };

  const handleNext = () => {
    // Validation and filtering logic
    if (currentScreen === 0) {
      // Screen 1: Check statute of limitations
      const incidentDate = new Date(formData.incidentDate);
      const today = new Date();
      const yearsAgo = (today.getTime() - incidentDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsAgo > 3) {
        setDeclineReason("statute-of-limitations");
        setShowDecline(true);
        return;
      }
    }

    if (currentScreen === 2) {
      // Screen 3: Check liability
      if (formData.atFault === "yes") {
        setDeclineReason("liability");
        setShowDecline(true);
        return;
      }
    }

    if (currentScreen === 3) {
      // Screen 4: Check medical treatment
      if (formData.medicalTreatment.length === 0 || formData.medicalTreatment.includes("no-treatment")) {
        setDeclineReason("medical-treatment");
        setShowDecline(true);
        return;
      }
    }

    if (currentScreen === 5) {
      // Screen 6: Check legal representation
      if (formData.hasAttorney === "yes") {
        setDeclineReason("already-represented");
        setShowDecline(true);
        return;
      }
    }

    if (currentScreen < 8) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // TODO: Send to backend
    alert("Case Merit File Secured! We'll review your case and contact you shortly.");
    onClose();
  };

  const screens = [
    // Screen 1: Incident Date
    {
      headline: "The Aftermath of an Accident Demands Precision.",
      body: "Insurance companies thrive on chaos. Our system brings order to your claim, ensuring your case receives the meticulous evaluation it deserves. Begin your confidential Case Merit Evaluation now.",
      question: "What is the date of the incident?",
      input: (
        <input
          type="date"
          value={formData.incidentDate}
          onChange={(e) => handleInputChange("incidentDate", e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />
      ),
    },
    // Screen 2: Jurisdiction
    {
      headline: "Jurisdictional Eligibility: Ensuring Localized Expertise.",
      body: "To connect you with firms best equipped for your specific jurisdiction, we require your incident location. This ensures your case is handled by attorneys with deep local insight.",
      question: "In which State and County did the incident occur?",
      input: (
        <div className="space-y-3">
          <select
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
          >
            <option value="">Select State...</option>
            <option value="CA">California</option>
            <option value="TX">Texas</option>
            <option value="FL">Florida</option>
            <option value="NY">New York</option>
            <option value="IL">Illinois</option>
          </select>
          <input
            type="text"
            placeholder="County name..."
            value={formData.county}
            onChange={(e) => handleInputChange("county", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
      ),
    },
    // Screen 3: Liability
    {
      headline: "Liability Assessment: A Critical Data Point for System Routing.",
      body: "Understanding the circumstances of the incident is vital for accurate case categorization. Your candid response allows our system to route your evaluation appropriately.",
      question: "Were you at fault for the accident?",
      disclaimer: "This is a preliminary data point for system routing and does not constitute a legal opinion on liability.",
      input: (
        <div className="space-y-3">
          {["No", "Yes", "Unsure/Partial Fault"].map((option) => (
            <label key={option} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-cyan-50">
              <input
                type="radio"
                name="atFault"
                value={option === "No" ? "no" : option === "Yes" ? "yes" : "unsure"}
                checked={formData.atFault === (option === "No" ? "no" : option === "Yes" ? "yes" : "unsure")}
                onChange={(e) => handleInputChange("atFault", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-slate-900 font-medium">{option}</span>
            </label>
          ))}
        </div>
      ),
    },
    // Screen 4: Medical Treatment
    {
      headline: "Medical Treatment Categories: Quantifying Impact.",
      body: "The nature and extent of your medical treatment are key indicators of your case's potential. Please select the option that best describes your experience.",
      question: "Which of the following best describes your medical treatment related to this incident?",
      disclaimer: "Treatment status is used for administrative categorization only and does not imply case value.",
      input: (
        <div className="space-y-3">
          {[
            { id: "hospitalized", label: "Hospitalized (overnight stay)" },
            { id: "surgery", label: "Surgery required" },
            { id: "therapy", label: "Ongoing Physical Therapy/Rehabilitation" },
            { id: "er", label: "Emergency Room Visit Only" },
            { id: "no-treatment", label: "No Medical Treatment Sought" },
          ].map((option) => (
            <label key={option.id} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-cyan-50">
              <input
                type="checkbox"
                checked={formData.medicalTreatment.includes(option.id)}
                onChange={() => handleMedicalTreatmentChange(option.id)}
                className="w-4 h-4"
              />
              <span className="text-slate-900 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      ),
    },
    // Screen 5: Insurance
    {
      headline: "Recovery Source Identification: Understanding the Pathways.",
      body: "Identifying the responsible parties' insurance status is a fundamental step in any personal injury claim. This information helps us understand potential recovery pathways.",
      question: "Did the other party involved in the incident have insurance?",
      input: (
        <div className="space-y-3">
          {["Yes", "No", "Unsure"].map((option) => (
            <label key={option} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-cyan-50">
              <input
                type="radio"
                name="insurance"
                value={option.toLowerCase()}
                checked={formData.insurance === option.toLowerCase()}
                onChange={(e) => handleInputChange("insurance", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-slate-900 font-medium">{option}</span>
            </label>
          ))}
        </div>
      ),
    },
    // Screen 6: Legal Representation
    {
      headline: "Current Representation Status: A Critical Ethical Inquiry.",
      body: "To ensure strict adherence to legal ethics and professional conduct, we must confirm your current legal representation status.",
      question: "Are you currently represented by an attorney for this incident?",
      input: (
        <div className="space-y-3">
          {["No", "Yes"].map((option) => (
            <label key={option} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-cyan-50">
              <input
                type="radio"
                name="hasAttorney"
                value={option.toLowerCase()}
                checked={formData.hasAttorney === option.toLowerCase()}
                onChange={(e) => handleInputChange("hasAttorney", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-slate-900 font-medium">{option}</span>
            </label>
          ))}
        </div>
      ),
    },
    // Screen 7: Documentation Commitment
    {
      headline: "Expediting Your Evaluation: Your Commitment to Clarity.",
      body: "A comprehensive case evaluation requires complete and accurate documentation. Your readiness to provide necessary records significantly expedites the process and enhances your case's visibility to elite counsel.",
      question: "Are you prepared to provide all necessary documentation to expedite your Case Merit Evaluation?",
      input: (
        <div className="space-y-3">
          {["Yes, I understand and am ready", "No, I prefer not to at this time"].map((option) => (
            <label key={option} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-cyan-50">
              <input
                type="radio"
                name="willProvideDocumentation"
                value={option === "Yes, I understand and am ready" ? "yes" : "no"}
                checked={formData.willProvideDocumentation === (option === "Yes, I understand and am ready" ? "yes" : "no")}
                onChange={(e) => handleInputChange("willProvideDocumentation", e.target.value)}
                className="w-4 h-4"
              />
              <span className="text-slate-900 font-medium">{option}</span>
            </label>
          ))}
        </div>
      ),
    },
    // Screen 8: Document Upload
    {
      headline: "Secure Document Integration: Building Your Case Merit File.",
      body: "This is where your Case Merit File truly takes shape. Securely upload your medical records, police reports, and other relevant documents. Our system utilizes bank-level encryption to protect your sensitive information.",
      question: "Upload your medical records and supporting documents.",
      input: (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-cyan-300 rounded-lg p-6 text-center bg-cyan-50/50">
            <Upload className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-900 mb-2">Drag & drop files here or click to upload</p>
            <p className="text-xs text-slate-600">PDF, JPG, PNG supported</p>
            <input type="file" multiple className="hidden" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Lock size={14} className="text-cyan-600" />
            <span>HIPAA Compliant • Bank-Level Encryption</span>
          </div>
          <p className="text-xs text-slate-500">
            By uploading, you authorize www.CasePort.io and its partner firms to access and review these documents for case merit evaluation purposes.
          </p>
        </div>
      ),
    },
    // Screen 9: Contact Information
    {
      headline: "Finalizing Your Case Merit Evaluation.",
      body: "To complete your evaluation and receive updates on your case's status, please provide your contact details. Our system will notify you once your merit file has been reviewed.",
      question: "Please provide your contact information.",
      input: (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="First & Last Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
      ),
    },
  ];

  const screen = screens[currentScreen];

  if (!isOpen) return null;

  if (showDecline) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {declineReason === "statute-of-limitations" && "Statute of Limitations Expired"}
            {declineReason === "liability" && "Liability Concern"}
            {declineReason === "medical-treatment" && "Insufficient Medical Treatment"}
            {declineReason === "already-represented" && "Already Represented"}
          </h2>
          <p className="text-slate-600 mb-6">
            {declineReason === "statute-of-limitations" && "Unfortunately, your case may fall outside the statute of limitations. Please consult with a local attorney for guidance."}
            {declineReason === "liability" && "Cases where you were primarily at fault may not be suitable for our network. Please consult with an attorney."}
            {declineReason === "medical-treatment" && "Cases without significant medical treatment may not meet our firm partners' criteria at this time."}
            {declineReason === "already-represented" && "Thank you for your submission. Our system indicates you are currently represented. We wish you the best with your claim."}
          </p>
          <button
            onClick={() => {
              setShowDecline(false);
              onClose();
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-cyan-600 uppercase tracking-widest">Screen {currentScreen + 1} of 9</h2>
            <div className="w-full bg-slate-200 rounded-full h-1 mt-2">
              <div
                className="bg-cyan-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentScreen + 1) / 9) * 100}%` }}
              />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{screen.headline}</h3>
          <p className="text-slate-600 mb-8">{screen.body}</p>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-slate-900 mb-4">{screen.question}</label>
            {screen.input}
            {screen.disclaimer && (
              <p className="text-xs text-slate-500 mt-3 italic">{screen.disclaimer}</p>
            )}
          </div>

          {/* ABA Compliance Disclaimer - Footer */}
          <div className="border-t border-slate-200 pt-4 mb-6 text-xs text-slate-500 space-y-2">
            <p>
              <strong>Lead Generator Disclosure:</strong> www.CasePort.io is a case acquisition system. We are not a law firm or a referral service. We do not recommend or endorse any specific attorney.
            </p>
            <p>
              <strong>No Attorney-Client Relationship:</strong> Submission of this evaluation does not create an attorney-client relationship.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentScreen > 0 && (
              <button
                onClick={() => setCurrentScreen(currentScreen - 1)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {currentScreen === 8 ? "Secure My Case Merit File" : "Next"}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
