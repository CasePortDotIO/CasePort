/**
 * CasePort Private Access Application — Form Configuration
 * 
 * Design: "The Command Layer" — Institutional Command Interface
 * Each screen is one focused question. 80-90% tap-based.
 * Hard stops and soft fails are handled per-screen.
 */

export type ScreenType = 'single-choice' | 'multi-select-states' | 'multi-select-metros' | 'contact-form';

export interface OptionConfig {
  id: string;
  label: string;
  /** 'hard-stop' = disqualify, 'soft-fail' = warning but continue, 'pass' = clean pass */
  outcome: 'pass' | 'soft-fail' | 'hard-stop';
}

export interface ScreenConfig {
  id: number;
  phase: string;
  headline: string;
  body: string;
  question?: string;
  microcopy: string;
  type: ScreenType;
  options?: OptionConfig[];
  buttonText: string;
  autoAdvance?: boolean;
  hardStopMessage?: string;
  hardStopSupport?: string;
  softFailMessage?: string;
}

export const PHASES = ['Firm', 'Markets', 'Intake', 'Funding', 'Contact'] as const;

export const PHASE_MAP: Record<number, number> = {
  1: 0,  // Firm
  2: 0,  // Firm
  3: 1,  // Markets
  4: 1,  // Markets
  5: 2,  // Intake
  6: 2,  // Intake
  7: 2,  // Intake
  8: 2,  // Intake
  9: 2,  // Intake
  10: 3, // Funding
  11: 3, // Funding
  12: 3, // Funding
  13: 4, // Contact
  14: 4, // Contact
};

export const SIDEBAR_CONTEXT: Record<number, { title: string; bullets: string[] }> = {
  1: {
    title: 'Evaluating Practice Focus',
    bullets: ['Plaintiff-side PI alignment', 'Core practice verification', 'Case type compatibility'],
  },
  2: {
    title: 'Evaluating Case Flow Fit',
    bullets: ['Auto-accident case focus', 'Current intake reality', 'Case type alignment'],
  },
  3: {
    title: 'Evaluating Market Coverage',
    bullets: ['Licensed state verification', 'Active practice geography', 'Routing fit assessment'],
  },
  4: {
    title: 'Evaluating Market Readiness',
    bullets: ['Metro-level staffing', 'Intake team coverage', 'Operational geography'],
  },
  5: {
    title: 'Evaluating Response Speed',
    bullets: ['First-contact capability', 'Speed-to-lead standard', 'Intake velocity'],
  },
  6: {
    title: 'Evaluating Response Performance',
    bullets: ['Average contact time', 'Operating reality check', 'Performance consistency'],
  },
  7: {
    title: 'Evaluating Intake Structure',
    bullets: ['Coverage model', 'Team structure', 'Live availability'],
  },
  8: {
    title: 'Evaluating Intake Consistency',
    bullets: ['10-minute contact rate', 'Execution consistency', 'Performance benchmarking'],
  },
  9: {
    title: 'Evaluating After-Hours Coverage',
    bullets: ['Weekend availability', 'After-hours response', 'Coverage continuity'],
  },
  10: {
    title: 'Evaluating Operating Model Fit',
    bullets: ['Pre-funded wallet readiness', 'Operating model alignment', 'Financial structure fit'],
  },
  11: {
    title: 'Evaluating Activation Speed',
    bullets: ['Funding timeline', 'Internal approval speed', 'Operational readiness'],
  },
  12: {
    title: 'Evaluating Capacity',
    bullets: ['Monthly intake bandwidth', 'Attorney availability', 'Growth readiness'],
  },
  13: {
    title: 'Evaluating Decision Authority',
    bullets: ['Approval authority', 'Decision-maker access', 'Activation speed potential'],
  },
  14: {
    title: 'Final Contact Details',
    bullets: ['Primary operator contact', 'Firm verification', 'Communication channel'],
  },
};

export const SCREENS: ScreenConfig[] = [
  {
    id: 1,
    phase: 'Firm',
    headline: 'First, confirm your practice focus.',
    body: 'This access path is built for plaintiff-side personal injury firms. We are not screening for general practice.',
    question: 'Does your firm primarily represent plaintiffs in personal injury matters?',
    microcopy: 'Choose the option that best reflects how your firm operates today.',
    type: 'single-choice',
    options: [
      { id: '1a', label: 'Yes, plaintiff-side personal injury is a core focus', outcome: 'pass' },
      { id: '1b', label: 'We handle personal injury, but it is not a primary focus', outcome: 'soft-fail' },
      { id: '1c', label: 'No, that is not our focus', outcome: 'hard-stop' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
    hardStopMessage: 'Thank you for your interest. At this stage, CasePort is built for firms with a clear plaintiff-side personal injury focus.',
    hardStopSupport: 'This helps keep the system aligned with the case types we support.',
  },
  {
    id: 2,
    phase: 'Firm',
    headline: 'Now confirm fit with our current case flow.',
    body: 'CasePort is currently focused on auto-accident-driven personal injury opportunities.',
    question: 'Which best describes your current case mix?',
    microcopy: 'Answer based on your current intake reality, not future plans.',
    type: 'single-choice',
    options: [
      { id: '2a', label: 'Car and truck accident cases are a core part of our practice', outcome: 'pass' },
      { id: '2b', label: 'We handle car and truck accident matters, but they are not a major focus', outcome: 'soft-fail' },
      { id: '2c', label: 'We do not actively handle these case types', outcome: 'hard-stop' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
    hardStopMessage: 'Thank you for your interest. At this stage, private access is limited to firms actively handling car and truck accident matters.',
  },
  {
    id: 3,
    phase: 'Markets',
    headline: 'Where are your attorneys currently active?',
    body: 'We use licensed markets to determine routing fit and current availability by geography.',
    question: 'In which U.S. states are your attorneys currently licensed and actively handling plaintiff-side personal injury matters?',
    microcopy: 'Only select states where your firm can accept qualified opportunities now.',
    type: 'multi-select-states',
    buttonText: 'Continue',
  },
  {
    id: 4,
    phase: 'Markets',
    headline: 'Which metros are you actively staffed to serve right now?',
    body: 'State coverage is not enough by itself. We need to know where your firm is actually ready to move.',
    question: 'List the primary metros or regions where your intake team is actively prepared to handle new qualified opportunities now.',
    microcopy: 'Enter current operating markets, not long-term expansion plans.',
    type: 'multi-select-metros',
    buttonText: 'Continue',
  },
  {
    id: 5,
    phase: 'Intake',
    headline: 'Speed matters here.',
    body: 'Good opportunities are often won or lost in the first minutes after inquiry.',
    question: 'Can your firm consistently make first contact within 10 minutes during staffed hours?',
    microcopy: 'Answer based on real intake performance, not best-case performance.',
    type: 'single-choice',
    options: [
      { id: '5a', label: 'Yes, consistently', outcome: 'pass' },
      { id: '5b', label: 'We move quickly, but 10 minutes is not always realistic', outcome: 'soft-fail' },
      { id: '5c', label: 'No, that is not our current operating standard', outcome: 'hard-stop' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
    softFailMessage: 'Your application may still be reviewed, but firms built for faster response are prioritized.',
    hardStopMessage: 'Thank you for your interest. At this stage, CasePort is designed for firms that can move faster after a qualified opportunity appears.',
  },
  {
    id: 6,
    phase: 'Intake',
    headline: 'What is your current average first-contact time?',
    body: 'We ask this separately because intention and operating reality are not always the same.',
    question: 'For new inbound personal injury opportunities, what is your current average first-contact time during staffed hours?',
    microcopy: 'Choose the answer that best reflects current performance.',
    type: 'single-choice',
    options: [
      { id: '6a', label: 'Under 5 minutes', outcome: 'pass' },
      { id: '6b', label: '5 to 10 minutes', outcome: 'pass' },
      { id: '6c', label: '11 to 30 minutes', outcome: 'soft-fail' },
      { id: '6d', label: 'Over 30 minutes', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 7,
    phase: 'Intake',
    headline: 'How is new case intake actually handled?',
    body: 'We are looking for real intake coverage, not theoretical availability.',
    question: 'Which best describes your current intake setup?',
    microcopy: 'This helps us understand whether your firm can operate effectively inside a speed-sensitive system.',
    type: 'single-choice',
    options: [
      { id: '7a', label: 'Dedicated in-house intake team with live coverage during business hours', outcome: 'pass' },
      { id: '7b', label: 'Shared intake coverage across attorneys and staff', outcome: 'pass' },
      { id: '7c', label: 'Outsourced or call-center-supported intake', outcome: 'pass' },
      { id: '7d', label: 'Callback-based workflow or voicemail-first process', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 8,
    phase: 'Intake',
    headline: 'What percentage of new PI inquiries are contacted within 10 minutes?',
    body: 'This helps separate stated standards from consistent execution.',
    question: 'Choose the range that best reflects your current intake performance.',
    microcopy: 'Use your actual operating estimate, not your target.',
    type: 'single-choice',
    options: [
      { id: '8a', label: '80 to 100%', outcome: 'pass' },
      { id: '8b', label: '60 to 79%', outcome: 'pass' },
      { id: '8c', label: '40 to 59%', outcome: 'soft-fail' },
      { id: '8d', label: 'Under 40%', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 9,
    phase: 'Intake',
    headline: 'What happens after hours or on weekends?',
    body: 'Qualified opportunities do not always arrive on your schedule.',
    question: 'Which best describes your current after-hours coverage?',
    microcopy: 'Choose the option that best reflects your current operation.',
    type: 'single-choice',
    options: [
      { id: '9a', label: 'Live coverage after hours and weekends', outcome: 'pass' },
      { id: '9b', label: 'Limited live coverage with some delay', outcome: 'pass' },
      { id: '9c', label: 'Next-business-day follow-up is typical', outcome: 'soft-fail' },
      { id: '9d', label: 'We do not currently support after-hours intake', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 10,
    phase: 'Funding',
    headline: 'Now confirm operating fit.',
    body: 'CasePort runs on a pre-funded model. No manual invoicing. No chasing. No ambiguity.',
    question: 'Is your firm prepared to operate through a pre-funded wallet to access qualified opportunities?',
    microcopy: 'Commercial details are handled during approval and onboarding.',
    type: 'single-choice',
    options: [
      { id: '10a', label: 'Yes, we are ready to operate on a pre-funded model', outcome: 'pass' },
      { id: '10b', label: 'We are open to it, but would need more detail', outcome: 'soft-fail' },
      { id: '10c', label: 'No, that model does not work for us', outcome: 'hard-stop' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
    softFailMessage: 'Your application can still be reviewed, but firms already aligned with the operating model move faster through qualification.',
    hardStopMessage: 'Thank you for your interest. CasePort is built around a pre-funded access model, so firms that cannot operate within that structure are not a fit for private access at this stage.',
  },
  {
    id: 11,
    phase: 'Funding',
    headline: 'How quickly could your firm activate funding if approved?',
    body: 'We are screening for real operating readiness, not passive interest.',
    question: 'If your application is approved, how quickly could your firm activate an initial wallet balance?',
    microcopy: 'Choose the answer that best reflects your internal approval reality.',
    type: 'single-choice',
    options: [
      { id: '11a', label: 'Immediately', outcome: 'pass' },
      { id: '11b', label: 'Within 3 business days', outcome: 'pass' },
      { id: '11c', label: 'Within 7 business days', outcome: 'pass' },
      { id: '11d', label: 'Longer than 7 business days', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 12,
    phase: 'Funding',
    headline: 'What is your realistic monthly capacity?',
    body: 'We use this to align opportunity flow with actual intake and attorney bandwidth.',
    question: 'What is your realistic monthly capacity for new qualified auto-accident-driven personal injury opportunities in your approved markets?',
    microcopy: 'Answer based on actual intake and attorney capacity, not aspirational growth.',
    type: 'single-choice',
    options: [
      { id: '12a', label: '1 to 5', outcome: 'pass' },
      { id: '12b', label: '6 to 15', outcome: 'pass' },
      { id: '12c', label: '16 to 30', outcome: 'pass' },
      { id: '12d', label: '30+', outcome: 'pass' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
  },
  {
    id: 13,
    phase: 'Contact',
    headline: 'Who can approve activation if your application moves forward?',
    body: 'We need the right operator or decision-maker in the flow from the start.',
    question: 'Which best describes your role in approving funding and activation?',
    microcopy: 'We are looking for a contact who can move quickly if the application is selected.',
    type: 'single-choice',
    options: [
      { id: '13a', label: 'I can approve directly', outcome: 'pass' },
      { id: '13b', label: 'Another partner or executive approves, but I manage the process', outcome: 'pass' },
      { id: '13c', label: 'I am not the decision-maker', outcome: 'soft-fail' },
    ],
    buttonText: 'Continue',
    autoAdvance: true,
    softFailMessage: 'Applications tied to direct operators or decision-makers usually move faster through review.',
  },
  {
    id: 14,
    phase: 'Contact',
    headline: 'Who should we contact if your application moves forward?',
    body: 'Please share the primary decision-maker or operator responsible for new case acquisition.',
    microcopy: 'Use the contact most likely to respond quickly if your application is selected for review.',
    type: 'contact-form',
    buttonText: 'Submit for Review',
  },
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia',
];

export const US_METROS = [
  'New York City, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'Austin, TX',
  'Jacksonville, FL', 'Fort Worth, TX', 'San Jose, CA', 'Columbus, OH', 'Charlotte, NC',
  'Indianapolis, IN', 'San Francisco, CA', 'Seattle, WA', 'Denver, CO', 'Nashville, TN',
  'Oklahoma City, OK', 'Washington, DC', 'El Paso, TX', 'Las Vegas, NV', 'Boston, MA',
  'Portland, OR', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI',
  'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ', 'Sacramento, CA',
  'Atlanta, GA', 'Kansas City, MO', 'Omaha, NE', 'Colorado Springs, CO', 'Raleigh, NC',
  'Long Beach, CA', 'Virginia Beach, VA', 'Miami, FL', 'Oakland, CA', 'Minneapolis, MN',
  'Tampa, FL', 'Tulsa, OK', 'Arlington, TX', 'New Orleans, LA', 'Wichita, KS',
  'Cleveland, OH', 'Bakersfield, CA', 'Aurora, CO', 'Anaheim, CA', 'Honolulu, HI',
  'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY', 'Pittsburgh, PA',
  'Stockton, CA', 'St. Paul, MN', 'Cincinnati, OH', 'Anchorage, AK', 'Henderson, NV',
  'Greensboro, NC', 'Plano, TX', 'Newark, NJ', 'Lincoln, NE', 'Orlando, FL',
  'Irvine, CA', 'Toledo, OH', 'Jersey City, NJ', 'Chula Vista, CA', 'Durham, NC',
  'Laredo, TX', 'Madison, WI', 'Lubbock, TX', 'Gilbert, AZ', 'St. Petersburg, FL',
  'Birmingham, AL', 'Detroit, MI', 'Salt Lake City, UT', 'Baton Rouge, LA', 'Richmond, VA',
  'Des Moines, IA', 'Spokane, WA', 'Boise, ID', 'Tacoma, WA', 'Little Rock, AR',
  'Chattanooga, TN', 'Knoxville, TN', 'Savannah, GA', 'Charleston, SC', 'Fort Lauderdale, FL',
  'West Palm Beach, FL', 'Daytona Beach, FL', 'Pensacola, FL', 'Tallahassee, FL',
  'Mobile, AL', 'Huntsville, AL', 'Jackson, MS', 'Shreveport, LA', 'McAllen, TX',
];
