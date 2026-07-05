'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import EvidenceCoach from './EvidenceCoach'

// City data - all 50 states
const CITIES: Record<string, string[]> = {
  Alabama: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'],
  Alaska: ['Anchorage', 'Fairbanks', 'Juneau'],
  Arizona: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Gilbert', 'Glendale', 'Tempe', 'Peoria', 'Surprise', 'Yuma', 'Flagstaff', 'Goodyear'],
  Arkansas: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
  California: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista', 'Fremont', 'San Bernardino', 'Modesto', 'Fontana', 'Glendale', 'Huntington Beach', 'Santa Clarita', 'Oceanside', 'Rancho Cucamonga', 'Santa Rosa', 'Elk Grove', 'Hayward', 'Salinas', 'Pomona', 'Sunnyvale', 'Escondido', 'Torrance', 'Pasadena', 'Orange', 'Fullerton', 'Thousand Oaks', 'Visalia', 'Simi Valley', 'Concord', 'Roseville', 'Victorville', 'Santa Clara', 'Vallejo'],
  Colorado: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial', 'Boulder', 'Greeley'],
  Connecticut: ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury', 'Norwalk'],
  Delaware: ['Wilmington', 'Dover', 'Newark'],
  Florida: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Port St. Lucie', 'Cape Coral', 'Fort Lauderdale', 'Pembroke Pines', 'Hollywood', 'Miramar', 'Gainesville', 'Coral Springs', 'Clearwater', 'Palm Bay', 'Lakeland', 'Pompano Beach', 'West Palm Beach', 'Davie', 'Miami Gardens', 'Sunrise', 'Boca Raton', 'Fort Myers', 'Daytona Beach', 'Kissimmee'],
  Georgia: ['Atlanta', 'Columbus', 'Augusta', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Macon', 'Johns Creek', 'Albany', 'Marietta', 'Alpharetta'],
  Hawaii: ['Honolulu', 'Pearl City', 'Hilo'],
  Idaho: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls'],
  Illinois: ['Chicago', 'Aurora', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Naperville'],
  Indiana: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers'],
  Iowa: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City'],
  Kansas: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka'],
  Kentucky: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro'],
  Louisiana: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'],
  Maine: ['Portland', 'Lewiston', 'Bangor'],
  Maryland: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Annapolis'],
  Massachusetts: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy'],
  Michigan: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy'],
  Minnesota: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'],
  Mississippi: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'],
  Missouri: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
  Montana: ['Billings', 'Missoula', 'Great Falls', 'Bozeman'],
  Nebraska: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island'],
  Nevada: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Derry'],
  'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Toms River', 'Trenton'],
  'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Asheville'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks'],
  Ohio: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma'],
  Oklahoma: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'],
  Oregon: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend'],
  Pennsylvania: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg'],
  'Rhode Island': ['Providence', 'Cranston', 'Warwick', 'Pawtucket'],
  'South Carolina': ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Greenville'],
  'South Dakota': ['Sioux Falls', 'Rapid City'],
  Tennessee: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro'],
  Texas: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie', 'Brownsville', 'McKinney', 'Frisco', 'Pasadena', 'Killeen', 'McAllen', 'Mesquite', 'Denton', 'Waco', 'Carrollton', 'Round Rock', 'Abilene', 'Pearland', 'Richardson', 'Beaumont', 'Lewisville', 'Odessa', 'Midland', 'Tyler', 'Allen', 'College Station', 'Sugar Land'],
  Utah: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George'],
  Vermont: ['Burlington', 'South Burlington', 'Rutland'],
  Virginia: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News', 'Alexandria', 'Hampton', 'Roanoke', 'Portsmouth'],
  Washington: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Kirkland', 'Bellingham'],
  'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Morgantown'],
  Wisconsin: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton'],
  Wyoming: ['Cheyenne', 'Casper', 'Laramie'],
}

const STATE_SOL: Record<string, number> = {
  Alabama: 2, Alaska: 2, Arizona: 2, Arkansas: 3, California: 2,
  Colorado: 3, Connecticut: 2, Delaware: 2, Florida: 4, Georgia: 2,
  Hawaii: 2, Idaho: 2, Illinois: 2, Indiana: 2, Iowa: 2, Kansas: 2,
  Kentucky: 1, Louisiana: 1, Maine: 6, Maryland: 3, Massachusetts: 3,
  Michigan: 3, Minnesota: 2, Mississippi: 3, Missouri: 5, Montana: 3,
  Nebraska: 4, Nevada: 2, 'New Hampshire': 3, 'New Jersey': 2,
  'New Mexico': 3, 'New York': 3, 'North Carolina': 3, 'North Dakota': 6,
  Ohio: 2, Oklahoma: 2, Oregon: 2, Pennsylvania: 2, 'Rhode Island': 3,
  'South Carolina': 3, 'South Dakota': 3, Tennessee: 1, Texas: 2,
  Utah: 4, Vermont: 3, Virginia: 2, Washington: 3, 'West Virginia': 2,
  Wisconsin: 3, Wyoming: 4,
}

const SA: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX',
  Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY',
}

const ACTIVE = ['TX', 'FL', 'CA', 'GA', 'NY', 'IL', 'PA', 'AZ', 'NV', 'OH', 'MI', 'NC', 'VA', 'CO']

const TYPE_ICONS: Record<string, string> = {
  hospital: '🏥', 'urgent-care': '🩺', chiro: '🦴', therapy: '💪', specialist: '🧠', clinic: '👨‍⚕️'
}

const NATIONWIDE = [
  { n: 'Concentra Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'AFC Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'NextCare Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'GoHealth Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'CareNow Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'MedExpress Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'Patient First', t: 'urgent-care', c: 'Nationwide' },
  { n: 'FastMed Urgent Care', t: 'urgent-care', c: 'Nationwide' },
  { n: 'Carbon Health', t: 'urgent-care', c: 'Nationwide' },
  { n: 'MinuteClinic (CVS)', t: 'urgent-care', c: 'Nationwide' },
]

type Provider = { n: string; t: string; c: string }

const PROVIDERS: Record<string, Provider[]> = {
  TX: [
    { n: 'Memorial Hermann Hospital', t: 'hospital', c: 'Houston' },
    { n: 'Houston Methodist Hospital', t: 'hospital', c: 'Houston' },
    { n: 'Ben Taub Hospital', t: 'hospital', c: 'Houston' },
    { n: 'United Memorial Medical Center', t: 'hospital', c: 'Houston' },
    { n: 'HCA Houston Healthcare', t: 'hospital', c: 'Houston' },
    { n: 'Parkland Memorial Hospital', t: 'hospital', c: 'Dallas' },
    { n: 'Baylor Scott & White Medical Center', t: 'hospital', c: 'Dallas' },
    { n: 'Medical City Dallas Hospital', t: 'hospital', c: 'Dallas' },
    { n: 'Methodist Dallas Medical Center', t: 'hospital', c: 'Dallas' },
    { n: 'UT Southwestern Medical Center', t: 'hospital', c: 'Dallas' },
    { n: 'University Hospital San Antonio', t: 'hospital', c: 'San Antonio' },
    { n: 'Baptist Medical Center', t: 'hospital', c: 'San Antonio' },
    { n: 'Christus Santa Rosa Hospital', t: 'hospital', c: 'San Antonio' },
    { n: 'Methodist Hospital San Antonio', t: 'hospital', c: 'San Antonio' },
    { n: "St. David's Medical Center", t: 'hospital', c: 'Austin' },
    { n: 'Dell Seton Medical Center', t: 'hospital', c: 'Austin' },
    { n: 'Ascension Seton Medical Center', t: 'hospital', c: 'Austin' },
    { n: 'JPS Health Network', t: 'hospital', c: 'Fort Worth' },
    { n: 'Texas Health Harris Methodist Fort Worth', t: 'hospital', c: 'Fort Worth' },
    ...NATIONWIDE,
  ],
  FL: [
    { n: 'Jackson Memorial Hospital', t: 'hospital', c: 'Miami' },
    { n: 'Mount Sinai Medical Center', t: 'hospital', c: 'Miami' },
    { n: 'Baptist Hospital of Miami', t: 'hospital', c: 'Miami' },
    { n: 'Tampa General Hospital', t: 'hospital', c: 'Tampa' },
    { n: "St. Joseph's Hospital", t: 'hospital', c: 'Tampa' },
    { n: 'AdventHealth Tampa', t: 'hospital', c: 'Tampa' },
    { n: 'Orlando Regional Medical Center', t: 'hospital', c: 'Orlando' },
    { n: 'AdventHealth Orlando', t: 'hospital', c: 'Orlando' },
    { n: 'UF Health Jacksonville', t: 'hospital', c: 'Jacksonville' },
    { n: 'Baptist Medical Center Jacksonville', t: 'hospital', c: 'Jacksonville' },
    { n: 'Broward Health Medical Center', t: 'hospital', c: 'Fort Lauderdale' },
    { n: 'Memorial Regional Hospital', t: 'hospital', c: 'Fort Lauderdale' },
    ...NATIONWIDE,
  ],
  CA: [
    { n: 'Cedars-Sinai Medical Center', t: 'hospital', c: 'Los Angeles' },
    { n: 'Ronald Reagan UCLA Medical Center', t: 'hospital', c: 'Los Angeles' },
    { n: 'LAC+USC Medical Center', t: 'hospital', c: 'Los Angeles' },
    { n: "Providence Saint John's Health Center", t: 'hospital', c: 'Los Angeles' },
    { n: 'Keck Hospital of USC', t: 'hospital', c: 'Los Angeles' },
    { n: 'UC San Diego Medical Center', t: 'hospital', c: 'San Diego' },
    { n: 'Sharp Memorial Hospital', t: 'hospital', c: 'San Diego' },
    { n: 'Scripps Mercy Hospital San Diego', t: 'hospital', c: 'San Diego' },
    { n: 'UCSF Medical Center', t: 'hospital', c: 'San Francisco' },
    { n: 'Zuckerberg San Francisco General', t: 'hospital', c: 'San Francisco' },
    { n: 'California Pacific Medical Center', t: 'hospital', c: 'San Francisco' },
    { n: 'Santa Clara Valley Medical Center', t: 'hospital', c: 'San Jose' },
    { n: 'Regional Medical Center of San Jose', t: 'hospital', c: 'San Jose' },
    { n: 'Good Samaritan Hospital', t: 'hospital', c: 'San Jose' },
    ...NATIONWIDE,
  ],
  GA: [
    { n: 'Grady Memorial Hospital', t: 'hospital', c: 'Atlanta' },
    { n: 'Emory University Hospital Midtown', t: 'hospital', c: 'Atlanta' },
    { n: 'Piedmont Atlanta Hospital', t: 'hospital', c: 'Atlanta' },
    { n: 'Northside Hospital Atlanta', t: 'hospital', c: 'Atlanta' },
    { n: "WellStar Atlanta Medical Center", t: 'hospital', c: 'Atlanta' },
    { n: "Emory Saint Joseph's Hospital", t: 'hospital', c: 'Atlanta' },
    ...NATIONWIDE,
  ],
  NY: [
    { n: 'Bellevue Hospital Center', t: 'hospital', c: 'New York City' },
    { n: 'NewYork-Presbyterian Hospital', t: 'hospital', c: 'New York City' },
    { n: 'Lenox Hill Hospital', t: 'hospital', c: 'New York City' },
    { n: 'Mount Sinai Hospital', t: 'hospital', c: 'New York City' },
    { n: 'NYU Langone Health', t: 'hospital', c: 'New York City' },
    { n: 'Montefiore Medical Center', t: 'hospital', c: 'New York City' },
    { n: 'Erie County Medical Center', t: 'hospital', c: 'Buffalo' },
    { n: 'Strong Memorial Hospital', t: 'hospital', c: 'Rochester' },
    { n: 'Upstate University Hospital', t: 'hospital', c: 'Syracuse' },
    ...NATIONWIDE,
  ],
  IL: [
    { n: 'Stroger Hospital of Cook County', t: 'hospital', c: 'Chicago' },
    { n: 'Northwestern Memorial Hospital', t: 'hospital', c: 'Chicago' },
    { n: 'Rush University Medical Center', t: 'hospital', c: 'Chicago' },
    { n: 'University of Illinois Hospital', t: 'hospital', c: 'Chicago' },
    { n: 'Advocate Illinois Masonic Medical Center', t: 'hospital', c: 'Chicago' },
    ...NATIONWIDE,
  ],
  PA: [
    { n: 'Jefferson Health', t: 'hospital', c: 'Philadelphia' },
    { n: 'Temple University Hospital', t: 'hospital', c: 'Philadelphia' },
    { n: 'Penn Presbyterian Medical Center', t: 'hospital', c: 'Philadelphia' },
    { n: 'UPMC Presbyterian', t: 'hospital', c: 'Pittsburgh' },
    { n: 'Allegheny General Hospital', t: 'hospital', c: 'Pittsburgh' },
    { n: 'UPMC Mercy', t: 'hospital', c: 'Pittsburgh' },
    ...NATIONWIDE,
  ],
  AZ: [
    { n: 'Banner University Medical Center Phoenix', t: 'hospital', c: 'Phoenix' },
    { n: "Dignity Health St. Joseph's Hospital", t: 'hospital', c: 'Phoenix' },
    { n: 'Valleywise Health Medical Center', t: 'hospital', c: 'Phoenix' },
    { n: 'Mayo Clinic Hospital Phoenix', t: 'hospital', c: 'Phoenix' },
    { n: 'Banner University Medical Center Tucson', t: 'hospital', c: 'Tucson' },
    { n: 'Tucson Medical Center', t: 'hospital', c: 'Tucson' },
    ...NATIONWIDE,
  ],
  NV: [
    { n: 'University Medical Center of Southern Nevada', t: 'hospital', c: 'Las Vegas' },
    { n: 'Sunrise Hospital and Medical Center', t: 'hospital', c: 'Las Vegas' },
    { n: 'Desert Springs Hospital', t: 'hospital', c: 'Las Vegas' },
    { n: 'Valley Hospital Medical Center', t: 'hospital', c: 'Las Vegas' },
    { n: 'Renown Regional Medical Center', t: 'hospital', c: 'Reno' },
    ...NATIONWIDE,
  ],
  OH: [
    { n: 'OhioHealth Riverside Methodist Hospital', t: 'hospital', c: 'Columbus' },
    { n: 'Ohio State University Wexner Medical Center', t: 'hospital', c: 'Columbus' },
    { n: 'MetroHealth Medical Center', t: 'hospital', c: 'Cleveland' },
    { n: 'Cleveland Clinic Main Campus', t: 'hospital', c: 'Cleveland' },
    { n: 'University of Cincinnati Medical Center', t: 'hospital', c: 'Cincinnati' },
    ...NATIONWIDE,
  ],
  MI: [
    { n: 'Detroit Receiving Hospital', t: 'hospital', c: 'Detroit' },
    { n: 'Henry Ford Hospital', t: 'hospital', c: 'Detroit' },
    { n: 'Ascension St. John Hospital', t: 'hospital', c: 'Detroit' },
    { n: 'Beaumont Hospital Royal Oak', t: 'hospital', c: 'Royal Oak' },
    { n: 'Spectrum Health Butterworth Hospital', t: 'hospital', c: 'Grand Rapids' },
    ...NATIONWIDE,
  ],
  NC: [
    { n: 'Atrium Health Carolinas Medical Center', t: 'hospital', c: 'Charlotte' },
    { n: 'Novant Health Presbyterian Medical Center', t: 'hospital', c: 'Charlotte' },
    { n: 'WakeMed Raleigh Campus', t: 'hospital', c: 'Raleigh' },
    { n: 'Duke University Hospital', t: 'hospital', c: 'Durham' },
    ...NATIONWIDE,
  ],
  VA: [
    { n: 'Sentara Norfolk General Hospital', t: 'hospital', c: 'Norfolk' },
    { n: 'Sentara Virginia Beach General Hospital', t: 'hospital', c: 'Virginia Beach' },
    { n: 'VCU Health Medical Center', t: 'hospital', c: 'Richmond' },
    { n: 'Inova Fairfax Medical Campus', t: 'hospital', c: 'Falls Church' },
    ...NATIONWIDE,
  ],
  CO: [
    { n: 'Denver Health Medical Center', t: 'hospital', c: 'Denver' },
    { n: 'UCHealth University of Colorado Hospital', t: 'hospital', c: 'Denver' },
    { n: "Presbyterian / St. Luke's Medical Center", t: 'hospital', c: 'Denver' },
    { n: 'UCHealth Memorial Hospital', t: 'hospital', c: 'Colorado Springs' },
    ...NATIONWIDE,
  ],
}

interface FormData {
  incidentType: string | null
  incidentDate: string | null
  incidentDaysSince: number | null
  solFlag: boolean
  solExpired: boolean
  incidentState: string | null
  incidentCity: string | null
  inMarket: boolean | null
  outOfMarket: boolean
  liabilityStatus: string | null
  liabilityFlag: string | null
  compNegFlag: boolean
  medicalTreatment: string | null
  treatmentLevel: string | null
  treatmentTypes: string[]
  treatmentSeveritySignal: string | null
  providerName: string | null
  providerType: string | null
  providerCity: string | null
  providerUnknown: boolean
  treatmentOngoing: boolean | null
  awaitingTreatment: boolean
  treatmentRecency: string | null
  injuryTypes: string[]
  injurySeverityIndex: number
  lifeImpact: string | null
  impactLevel: string | null
  atFaultInsurance: string | null
  ownUMCoverage: string | null
  reportFiled: boolean | null
  priorAttorney: boolean
  priorSettlement: boolean
  urgencyLevel: string | null
  firstName: string | null
  phone: string | null
  email: string | null
  phoneVerified: boolean
  preferredContactTime: string[]
  consentGiven: boolean
  consentTimestamp: string | null
  hipaaSignature: string | null
  hipaaSignatureMode: string | null
  hipaaSignedAt: string | null
  submittedAt: string | null
  submissionId: string | null
  uploadedFiles: File[]
}

const initialFormData: FormData = {
  incidentType: null, incidentDate: null, incidentDaysSince: null, solFlag: false, solExpired: false,
  incidentState: null, incidentCity: null, inMarket: null, outOfMarket: false,
  liabilityStatus: null, liabilityFlag: null, compNegFlag: false,
  medicalTreatment: null, treatmentLevel: null,
  treatmentTypes: [], treatmentSeveritySignal: null,
  providerName: null, providerType: null, providerCity: null, providerUnknown: false, treatmentOngoing: null,
  awaitingTreatment: false, treatmentRecency: null,
  injuryTypes: [], injurySeverityIndex: 0,
  lifeImpact: null, impactLevel: null,
  atFaultInsurance: null, ownUMCoverage: null, reportFiled: null, priorAttorney: false, priorSettlement: false,
  urgencyLevel: null,
  firstName: null, phone: null, email: null, phoneVerified: false,
  preferredContactTime: [], consentGiven: false, consentTimestamp: null,
  hipaaSignature: null, hipaaSignatureMode: null, hipaaSignedAt: null,
  submittedAt: null, submissionId: null,
  uploadedFiles: [],
}

type ScreenId = 's1' | 's2' | 's3' | 's4' | 's5' | 's5b' | 's5c' | 's6' | 's7' | 's8' | 's9' | 's10' | 's11' | 's12' | 's-urgency' | 's13' | 's14' | 's-otp' | 's14b' | 's15' | 's16' | 's-confirm' | 's-off' | 's-off-atty' | 's-off-settled' | 's-await-thanks' | 's-med-soft' | 's-else' | 's-comp-neg' | 's-await'

const PHASE_MAP: Record<string, [number, number]> = {
  s1: [1, 1], 's-else': [1, 1], s2: [1, 2], s3: [1, 3], s4: [1, 4], 's-comp-neg': [1, 4],
  s5: [2, 1], 's-med-soft': [2, 1], 's-await': [2, 1], s5b: [2, 2], s5c: [2, 2],
  s6: [2, 3], s7: [2, 3], s8: [2, 4],
  s9: [3, 1], s10: [3, 2], s11: [3, 3], s12: [3, 4], 's-urgency': [3, 4],
  s13: [4, 1], s14: [4, 2], 's-otp': [4, 2], s14b: [4, 2], s15: [4, 3], s16: [4, 4],
}

export default function CheckMyCaseClient() {
  const [curScreen, setCurScreen] = useState<ScreenId>('s1')
  const [history, setHistory] = useState<ScreenId[]>(['s1'])
  const [goingBack, setGoingBack] = useState(false)
  const [fd, setFd] = useState<FormData>(initialFormData)
  const [cityList, setCityList] = useState<string[]>([])
  const [cityInput, setCityInput] = useState('')
  const [showCitySugg, setShowCitySugg] = useState(false)
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', ''])
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw')
  const [hasSig, setHasSig] = useState(false)
  const [sigTyped, setSigTyped] = useState('')
  const [consent, setConsent] = useState(false)
  const [showMomentum, setShowMomentum] = useState(false)
  const [momentumMsg, setMomentumMsg] = useState('')
  const [solCallout, setSolCallout] = useState<{ type: 'warning' | 'danger'; title: string; body: string } | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [nameErr, setNameErr] = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [stateErr, setStateErr] = useState('')
  const [showResumeBanner, setShowResumeBanner] = useState(false)
  const [countdownSecs, setCountdownSecs] = useState(0)
  const [countdownDisplay, setCountdownDisplay] = useState('30:00')
  const [providerList, setProviderList] = useState<Provider[]>([])
  const [providerInput, setProviderInput] = useState('')
  const [showProviderSugg, setShowProviderSugg] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showDontRemember, setShowDontRemember] = useState(false)
  const [facilityType, setFacilityType] = useState<string | null>(null)
  const [treatmentOngoing, setTreatmentOngoing] = useState<boolean | null>(null)
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null)
  const [dateErr, setDateErr] = useState('')

  const sigCanvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)

  // Answer to Wallet moat. First touch attribution is captured once and
  // persisted, so a refresh does not reset it, and read at submit. Behavioral
  // timings are first party data no competitor can reconstruct after the fact.
  // Marketing and geographic signals only, never a case evaluation.
  const attributionRef = useRef<Record<string, unknown> | null>(null)
  const behaviorRef = useRef<{ screen: string; at: number }[]>([])

  useEffect(() => {
    const KEY = 'cp_attribution'
    try {
      const existing = localStorage.getItem(KEY)
      if (existing) { attributionRef.current = JSON.parse(existing); return }
      const p = new URLSearchParams(window.location.search)
      const attr: Record<string, unknown> = {
        utmSource: p.get('utm_source'), utmMedium: p.get('utm_medium'),
        utmCampaign: p.get('utm_campaign'), utmContent: p.get('utm_content'),
        keyword: p.get('utm_term') || p.get('keyword'),
        gclid: p.get('gclid'), fbclid: p.get('fbclid'),
        referrerSource: document.referrer || null,
        landingPath: window.location.pathname + window.location.search,
        firstTouchAt: new Date().toISOString(),
      }
      attributionRef.current = attr
      localStorage.setItem(KEY, JSON.stringify(attr))
    } catch {
      attributionRef.current = { firstTouchAt: new Date().toISOString() }
    }
  }, [])

  useEffect(() => {
    if (curScreen) behaviorRef.current.push({ screen: curScreen, at: Date.now() })
  }, [curScreen])

  const TOAST_SKIP = ['s1', 's-confirm', 's-off', 's-off-atty', 's-off-settled', 's-off-recovery', 's-await-thanks', 's-med-soft', 's-await', 's-comp-neg', 's-else']
  const TOAST_MSGS: Record<string, string> = {
    s2: 'Incident noted.', s3: 'Date recorded.', s4: 'Location confirmed.', s5: 'Liability noted.',
    s5b: 'Almost there.', s5c: 'Treatment recorded.', s6: 'Treatment types noted.', s7: 'Recency noted.',
    s8: 'Injuries noted.', s9: 'Impact logged.', s10: 'Coverage noted.',
    s11: 'Report status saved.', s12: 'Attorney status confirmed.', 's-urgency': 'Urgency noted.',
    s13: 'Situation noted.', s14: 'Name saved.', s14b: 'Number verified.', s15: 'Contact time saved.', s16: 'Almost done.'
  }

  const showToast = (targetId: string) => {
    if (goingBack || TOAST_SKIP.includes(targetId)) return
    const msg = TOAST_MSGS[targetId] || 'Got it.'
    setMomentumMsg(msg)
    setShowMomentum(true)
    setTimeout(() => setShowMomentum(false), 1800)
  }

  // Draft save/restore system
  const DRAFT_KEY = 'cp_intake_draft'
  const DRAFT_TTL = 72 * 60 * 60 * 1000 // 72 hours

  const saveDraft = () => {
    if (typeof window === 'undefined') return
    try {
      const draft = {
        fd,
        curScreen,
        history: [...history],
        savedAt: Date.now()
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      setDraftSavedAt(Date.now())
    } catch (e) { }
  }

  const loadDraft = () => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return null
      const draft = JSON.parse(raw)
      if (Date.now() - draft.savedAt > DRAFT_TTL) { localStorage.removeItem(DRAFT_KEY); return null }
      return draft
    } catch (e) { return null }
  }

  const clearDraft = () => {
    if (typeof window === 'undefined') return
    try { localStorage.removeItem(DRAFT_KEY) } catch (e) { }
    setShowResumeBanner(false)
    setDraftSavedAt(null)
  }

  const resumeDraft = () => {
    const draft = loadDraft()
    console.log('[CheckMyCase] resumeDraft called, draft:', draft)
    if (!draft) return
    console.log('[CheckMyCase] Resuming to curScreen:', draft.curScreen, 'history:', draft.history)
    setFd(draft.fd)
    setHistory(draft.history || ['s1'])
    setCurScreen(draft.curScreen)
    setShowResumeBanner(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Check for existing draft on mount
  useEffect(() => {
    const draft = loadDraft()
    // Show banner if draft exists and form is not complete
    if (draft && draft.curScreen !== 's-confirm') {
      setShowResumeBanner(true)
    }
  }, [])

  const goTo = useCallback((id: ScreenId) => {
    // Save draft BEFORE updating state (to capture current screen)
    const noSave = ['s-confirm', 's-off', 's-off-atty', 's-off-settled', 's-off-recovery', 's-await-thanks']
    if (!noSave.includes(id)) saveDraft()

    setGoingBack(false)
    setCurScreen(id)
    setHistory(prev => [...prev, id])
    showToast(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [goingBack, curScreen, history])

  const goBack = useCallback(() => {
    if (history.length <= 1) return
    const newHist = [...history]
    newHist.pop()
    const prev = newHist[newHist.length - 1]
    setGoingBack(true)
    setHistory(newHist)
    setCurScreen(prev)
    showToast(prev)
  }, [history])

  const updateForm = (updates: Partial<FormData>) => {
    setFd(prev => ({ ...prev, ...updates }))
  }

  const initProviderScreen = useCallback(() => {
    const stateAbbr = SA[fd.incidentState || ''] || ''
    const providers = PROVIDERS[stateAbbr] || []
    setProviderList(providers)
    setProviderInput('')
    setSelectedProvider(null)
    setShowDontRemember(false)
    setFacilityType(null)
    setTreatmentOngoing(null)
  }, [fd.incidentState])

  // Initialize provider screen when s5c becomes active
  useEffect(() => {
    if (curScreen === 's5c') {
      initProviderScreen()
    }
  }, [curScreen, initProviderScreen])

  // Countdown timer for confirmation screen
  useEffect(() => {
    if (curScreen !== 's-confirm') return

    const hour = new Date().getHours()
    const isBusinessHours = hour >= 8 && hour < 20
    let secs = 86400
    let display = '24 hrs'
    let fontSize = '22px'

    if (fd.urgencyLevel === 'urgent' && isBusinessHours) {
      secs = 900
      display = fmtSecs(secs)
      fontSize = '32px'
    } else if (fd.urgencyLevel === 'urgent' && !isBusinessHours) {
      display = 'Tonight'
    } else if (fd.urgencyLevel === 'soon') {
      secs = 14400
      display = fmtSecs(secs)
      fontSize = '32px'
    }

    setCountdownDisplay(display)
    setCountdownSecs(secs)

    if (secs > 0 && (fd.urgencyLevel === 'urgent' || fd.urgencyLevel === 'soon')) {
      const timer = setInterval(() => {
        setCountdownSecs(prev => {
          const next = prev - 1
          if (next <= 0) {
            clearInterval(timer)
            setCountdownDisplay('00:00')
            return 0
          }
          setCountdownDisplay(fmtSecs(next))
          return next
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [curScreen, fd.urgencyLevel])

  // Compliance wall, W1 and W2. No case scoring happens on the claimant surface.
  // SCPS and every evaluative signal are computed server side, firm facing, and
  // only after geographic routing. The claimant never sees a score, a tier, or a
  // case assessment. The confirmation shows a protection plan instead.

  const onProviderInputChange = (value: string) => {
    setProviderInput(value)
    setShowProviderSugg(value.length > 0)
  }

  const selectProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setShowProviderSugg(false)
    updateForm({
      providerName: provider.n,
      providerType: provider.t,
      providerCity: provider.c !== 'Nationwide' ? provider.c : (fd.incidentCity || fd.incidentState),
      providerUnknown: false,
    })
  }

  const changeProvider = () => {
    setSelectedProvider(null)
    updateForm({ providerName: null, providerType: null, providerCity: null, providerUnknown: false })
  }

  const useFreeText = (value: string) => {
    const fakeProvider: Provider = { n: value, t: 'unknown', c: fd.incidentCity || fd.incidentState || 'As entered' }
    setSelectedProvider(fakeProvider)
    setShowProviderSugg(false)
    updateForm({
      providerName: value,
      providerType: 'unknown',
      providerCity: fd.incidentCity || fd.incidentState,
      providerUnknown: false,
    })
  }

  const pickFacilityType = (type: string) => {
    setFacilityType(type)
    updateForm({ providerUnknown: true, providerType: type, providerName: null, providerCity: fd.incidentCity || fd.incidentState })
  }

  const proceedFromProvider = () => {
    if (treatmentOngoing !== null) {
      updateForm({ treatmentOngoing })
    }
    goTo('s6')
  }

  const skipProvider = () => {
    updateForm({ providerUnknown: true, providerName: null, providerType: null, providerCity: null })
    goTo('s6')
  }

  const initSigPad = useCallback(() => {
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = 140 * dpr
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = '#1c2b32'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    setHasSig(false)
  }, [])

  const handleSigStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawingRef.current = true
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const handleSigMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
    if (!hasSig) setHasSig(true)
  }

  const handleSigEnd = () => {
    isDrawingRef.current = false
  }

  const clearSig = () => {
    const canvas = sigCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
    setSigTyped('')
  }

  const validateDate = () => {
    const m = (document.getElementById('incMonth') as HTMLSelectElement)?.value
    const d = (document.getElementById('incDay') as HTMLSelectElement)?.value
    const y = (document.getElementById('incYear') as HTMLSelectElement)?.value

    if (!m || !y) {
      setDateErr('Please select at least a month and year.')
      return
    }

    setDateErr('')
    const incDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d) || 1)
    const days = Math.floor((new Date().getTime() - incDate.getTime()) / 86400000)

    updateForm({
      incidentDate: `${y}-${String(m).padStart(2, '0')}-${String(d || 1).padStart(2, '0')}`,
      incidentDaysSince: days
    })

    const solYears = STATE_SOL[fd.incidentState || ''] || 2
    const solDays = solYears * 365
    const solFlag = days > solDays * 0.75
    const solExpired = days > solDays

    const deadlineDate = new Date(incDate)
    deadlineDate.setFullYear(deadlineDate.getFullYear() + solYears)
    const daysLeft = Math.floor((deadlineDate.getTime() - new Date().getTime()) / 86400000)

    if (solFlag || solExpired) {
      setSolCallout({
        type: solExpired ? 'danger' : 'warning',
        title: solExpired ? 'Your filing window may have closed.' : `Approximately ${Math.max(0, daysLeft)} days remaining to file.`,
        body: solExpired ? `In most states the limit is ${solYears} year${solYears > 1 ? 's' : ''}. However, exceptions exist — your attorney will confirm whether options remain.` : `Your deadline is approximately ${deadlineDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Acting now gives your case the strongest position.`
      })
    } else {
      setSolCallout(null)
    }

    goTo('s3')
  }

  const updateProgress = () => {
    const info = PHASE_MAP[curScreen]
    const terminal = ['s-confirm', 's-off', 's-off-atty', 's-off-settled', 's-await-thanks']
    const done = terminal.includes(curScreen)

    for (let i = 1; i <= 4; i++) {
      const fill = document.getElementById(`sf${i}`)
      if (!fill) continue
      if (done) {
        fill.style.width = '100%'
      } else if (!info) {
        fill.style.width = '0%'
      } else if (i < info[0]) {
        fill.style.width = '100%'
      } else if (i === info[0]) {
        fill.style.width = `${(info[1] / 4) * 100}%`
      } else {
        fill.style.width = '0%'
      }
    }
  }

  useEffect(() => {
    updateProgress()
  }, [curScreen])

  useEffect(() => {
    if (curScreen === 's16') {
      setTimeout(() => initSigPad(), 100)
    }
  }, [curScreen, initSigPad])

  const onStateChange = (state: string) => {
    const cities = CITIES[state] || []
    setCityList(cities)
    setCityInput('')
    setStateErr('')
    updateForm({ incidentState: state, incidentCity: null })
  }

  const onCityInput = (value: string) => {
    setCityInput(value)
    setShowCitySugg(value.length > 0)
  }

  const selCity = (city: string) => {
    setCityInput(city)
    setShowCitySugg(false)
    updateForm({ incidentCity: city })
  }

  const onCityKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const items = cityList.slice(0, 6)
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
    }
  }

  const validateLocation = () => {
    const state = (document.getElementById('incState') as HTMLSelectElement)?.value
    if (!state) {
      setStateErr('Please select a state.')
      return
    }
    setStateErr('')
    const abbr = SA[state] || ''
    const inMarket = ACTIVE.includes(abbr)
    updateForm({ incidentState: state, incidentCity: cityInput, inMarket, outOfMarket: !inMarket })
    goTo('s4')
  }

  const fmtPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    }
    return digits
  }

  const validatePhone = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setPhoneErr('Please enter a valid 10-digit US phone number.')
      return
    }
    setPhoneErr('')
    updateForm({ phone: fmtPhone(digits), phoneVerified: true })
    goTo('s-otp')
    setTimeout(() => {
      const firstBox = document.querySelector('.otp-box') as HTMLInputElement
      firstBox?.focus()
    }, 400)
  }

  const otpInput = (idx: number, value: string) => {
    const newOtp = [...otpCode]
    newOtp[idx] = value.replace(/\D/g, '').slice(-1)
    setOtpCode(newOtp)
    if (value && idx < 5) {
      const boxes = document.querySelectorAll('.otp-box')
      ;(boxes[idx + 1] as HTMLInputElement)?.focus()
    }
    const code = newOtp.join('')
    if (code.length === 6) {
      setTimeout(() => {
        updateForm({ phoneVerified: true })
        goTo('s14b')
      }, 600)
    }
  }

  const continueFromEmail = () => {
    const emailEl = document.getElementById('emailAddr') as HTMLInputElement
    updateForm({ email: emailEl?.value?.trim() || null })
    goTo('s15')
  }

  const validateName = () => {
    const nameEl = document.getElementById('firstName') as HTMLInputElement
    if (!nameEl?.value || nameEl.value.length < 2) {
      setNameErr('Please enter your first name.')
      return
    }
    setNameErr('')
    updateForm({ firstName: nameEl.value })
    goTo('s14')
  }

  // No calculateScore on the claimant surface. Routing is geographic only (W1)
  // and case scoring is firm facing, computed server side after routing (W2).
  // The intake fields collected here (liability, treatment, insurance, injury)
  // are raw case facts sent to the backend, never scored or shown to the claimant.

  const fmtSecs = (s: number) => {
    if (s >= 3600) return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  const submitForm = async () => {
    const sigErrEl = document.getElementById('sigErr')
    if (!hasSig && sigMode === 'draw') {
      if (sigErrEl) sigErrEl.textContent = 'Please sign above to continue.'
      return
    }
    if (sigMode === 'type' && sigTyped.length < 2) {
      if (sigErrEl) sigErrEl.textContent = 'Please sign above to continue.'
      return
    }
    if (sigErrEl) sigErrEl.textContent = ''

    const btn = document.getElementById('submitBtn') as HTMLButtonElement
    if (btn) {
      btn.classList.add('loading')
      btn.disabled = true
    }

    const timestamp = new Date().toISOString()
    const submissionId = `CP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    updateForm({
      consentTimestamp: timestamp,
      submittedAt: timestamp,
      submissionId,
      hipaaSignatureMode: sigMode,
      hipaaSignedAt: timestamp,
      hipaaSignature: sigMode === 'draw' ? 'captured' : sigTyped,
    })

    // Map the intake to the compliant submission contract. No score, no routing
    // status. Routing is geographic (server side, W1); scoring is firm facing,
    // server side, after routing (W2). Raw case facts flow to the backend as data.
    const caseTypeSlug = (t: string | null): string => {
      const s = (t || '').toLowerCase()
      if (s.includes('truck') || s.includes('commercial')) return 'commercial-trucking-accident'
      if (s.includes('slip') || s.includes('fall') || s.includes('premises') || s.includes('workplace')) return 'premises-liability'
      if (s.includes('dog') || s.includes('bite') || s.includes('animal')) return 'dog-bite'
      if (s.includes('malpractice') || s.includes('medical negligence')) return 'medical-malpractice'
      if (s.includes('wrongful death') || s.includes('fatal')) return 'wrongful-death'
      return 'motor-vehicle-accident'
    }
    const trustedFormCertUrl =
      (document.querySelector('input[name="xxTrustedFormCertUrl"]') as HTMLInputElement | null)?.value || null

    const submission = {
      contact: { firstName: fd.firstName || '', phone: fd.phone || undefined, email: fd.email || undefined },
      location: { state: fd.incidentState || undefined, city: fd.incidentCity || undefined },
      caseType: caseTypeSlug(fd.incidentType),
      incidentDate: fd.incidentDate,
      statuteOfLimitationsDate: null,
      consent: { given: fd.consentGiven, timestamp, trustedFormCertUrl, consentLanguageVersion: 'v1' },
      hipaa: { signatureMode: sigMode, signedAt: timestamp, templateVersion: 'hipaa-v1' },
      attribution: {
        ...(attributionRef.current || {}),
        sessionBehavior: {
          steps: behaviorRef.current,
          totalSteps: behaviorRef.current.length,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        },
      },
      meta: { submissionId, phoneVerified: fd.phoneVerified, uploadedFileCount: uploadedFiles.length },
      caseFacts: {
        incidentType: fd.incidentType,
        incidentDaysSince: fd.incidentDaysSince,
        solFlag: fd.solFlag, solExpired: fd.solExpired,
        liabilityStatus: fd.liabilityStatus, compNegFlag: fd.compNegFlag,
        medicalTreatment: fd.medicalTreatment,
        treatmentTypes: fd.treatmentTypes, providerName: fd.providerName,
        providerType: fd.providerType, providerCity: fd.providerCity,
        treatmentRecency: fd.treatmentRecency, treatmentOngoing: fd.treatmentOngoing,
        injuryTypes: fd.injuryTypes, lifeImpact: fd.lifeImpact,
        atFaultInsurance: fd.atFaultInsurance, ownUMCoverage: fd.ownUMCoverage,
        reportFiled: fd.reportFiled, urgencyLevel: fd.urgencyLevel,
        incidentState: fd.incidentState, incidentCity: fd.incidentCity,
      },
    }

    // Best effort submit. The claimant is never blocked on a network error; the
    // confirmation is shown regardless and the failure is logged for retry.
    try {
      await fetch('/api/checkmycase/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
    } catch (err) {
      console.error('[CP] intake submit failed', err)
    }

    const secs = fd.urgencyLevel === 'urgent' ? 900 : fd.urgencyLevel === 'soon' ? 14400 : 86400
    const countdownEl = document.getElementById('countdownTimer')
    if (countdownEl) {
      countdownEl.textContent = fmtSecs(secs)
    }

    goTo('s-confirm')
    clearDraft()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  const isOffScreen = (screen: string) => ['s-off', 's-off-atty', 's-off-settled', 's-await-thanks', 's-else', 's-comp-neg', 's-off-recovery'].includes(screen)
  const isTerminal = (screen: string) => ['s-confirm', 's-await-thanks'].includes(screen)

  return (
    <>
      <style>{`
        :root {
          --cream: #f9f5ef; --cream-alt: #f2ebe0; --cream-deep: #ebe3d5;
          --teal: #1a3d40; --teal-mid: #255e72; --teal-soft: #e4f0f3;
          --terra: #c4663a; --terra-hover: #b85a31; --terra-pale: #fdf0ea;
          --terra-shadow: rgba(158,70,28,0.35);
          --sage: #4a8c7e; --gold: #c9a84c; --gold-pale: #fdf6e3;
          --ink: #1c2b32; --body-text: #3c5260; --muted: #7a9299;
          --border: #ddd5c8; --border-soft: #e8e2d8; --white: #ffffff; --green: #4caf7d;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Figtree', system-ui, sans-serif;
          --ease: cubic-bezier(0.16,1,0.3,1);
          --spring: cubic-bezier(0.34,1.56,0.64,1);
          --r: 14px; --r-sm: 10px; --r-lg: 20px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0 }
        html { scroll-behavior: smooth; -webkit-tap-highlight-color: transparent; -webkit-font-smoothing: antialiased }
        body { font-family: var(--font-body); background: var(--cream); color: var(--ink); min-height: 100svh; overflow-x: hidden }
        .progress-rail { position: fixed; top: 0; left: 0; right: 0; z-index: 200; height: 3px; background: var(--border-soft); display: flex; gap: 3px; padding: 0 3px }
        .seg { flex: 1; height: 100%; background: var(--border-soft); border-radius: 100px; overflow: hidden }
        .seg-fill { height: 100%; width: 0%; background: var(--terra); border-radius: 100px; transition: width .5s var(--ease); box-shadow: 0 0 6px rgba(196,102,58,.4) }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 58px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; background: rgba(249,245,239,.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border-soft) }
        .nav-brand { text-decoration: none; display: flex; flex-direction: column; gap: 1px }
        .nav-mark { font-family: var(--font-body); font-weight: 700; font-size: 14px; letter-spacing: .16em; color: var(--teal) }
        .nav-tag { font-size: 9px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--sage) }
        .nav-secure { font-size: 12px; font-weight: 500; color: var(--muted); display: flex; align-items: center; gap: 5px }
        .back-btn { position: fixed; top: 68px; left: 20px; z-index: 99; width: 36px; height: 36px; border-radius: 50%; background: var(--white); border: 1px solid var(--border-soft); display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 16px; cursor: pointer; transition: all .22s var(--ease); opacity: 0; pointer-events: none }
        .back-btn.visible { opacity: 1; pointer-events: all }
        .back-btn:hover { border-color: var(--teal); color: var(--teal); transform: translateX(-2px) }
        .shell { min-height: 100svh; display: flex; flex-direction: column; align-items: center; padding: 96px 20px 100px }
        .form-wrap { width: 100%; max-width: 520px }
        .screen { display: none; width: 100%; flex-direction: column; gap: 24px }
        .screen.active { display: flex; animation: sIn .32s var(--ease) both }
        .screen.active.back { animation: sBack .32s var(--ease) both }
        @keyframes sIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        @keyframes sBack { from { transform: translateX(-40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .phase-label { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px }
        .phase-name { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--terra); position: relative; display: inline-block }
        .phase-name::after { content: ''; position: absolute; bottom: -3px; left: 50%; width: 0; height: 1.5px; background: var(--terra); transform: translateX(-50%); transition: width .5s var(--ease) }
        .screen.active .phase-name::after { width: 100% }
        .phase-dots { display: flex; gap: 5px; align-items: center; justify-content: center; margin-top: 2px }
        .phase-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border); transition: background .3s }
        .phase-dot.active { background: var(--terra); animation: dotBreath 2.2s ease-out infinite }
        .phase-dot.done { background: var(--sage) }
        @keyframes dotBreath { 0% { box-shadow: 0 0 0 0 rgba(196,102,58,.4) } 65% { box-shadow: 0 0 0 6px rgba(196,102,58,0) } 100% { box-shadow: 0 0 0 0 rgba(196,102,58,0) } }
        .q-headline { font-family: var(--font-display); font-size: clamp(26px,7vw,36px); font-weight: 500; line-height: 1.15; color: var(--ink); letter-spacing: -.02em; text-align: center; font-variation-settings: "opsz" 36,"WONK" 1 }
        .q-headline em { font-style: italic; color: var(--teal) }
        .q-sub { font-size: 15px; color: var(--muted); font-weight: 300; line-height: 1.7; margin-top: -12px; text-align: center }
        .options { display: flex; flex-direction: column; gap: 10px }
        .opt { display: flex; align-items: center; gap: 14px; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); padding: 16px 18px; cursor: pointer; transition: all .22s var(--ease); min-height: 56px; user-select: none; box-shadow: 0 1px 4px rgba(26,61,64,.05) }
        .opt:hover { border-color: var(--teal); background: var(--teal-soft); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,61,64,.10) }
        .opt.selected { border-color: var(--teal); background: var(--teal-soft); transform: translateY(-1px) }
        .opt.pulse { animation: optP .38s var(--spring) }
        @keyframes optP { 0%,100% { transform: translateY(-1px) } 50% { transform: translateY(-4px) } }
        .opt-icon { font-size: 20px; flex-shrink: 0 }
        .opt:hover .opt-icon { transform: scale(1.15) }
        .opt.selected .opt-icon { transform: scale(1.1) }
        .opt-label { font-size: 15px; font-weight: 500; color: var(--ink); line-height: 1.3; flex: 1 }
        .opt-sub { font-size: 12px; color: var(--muted); font-weight: 300; margin-top: 2px }
        .opt-check { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .25s var(--spring); position: relative; overflow: hidden }
        .opt.selected .opt-check { background: var(--teal); border-color: var(--teal); transform: scale(1.05) }
        .opt.selected .opt-check::before { content: ''; position: absolute; width: 10px; height: 6px; border-left: 2px solid var(--white); border-bottom: 2px solid var(--white); transform: rotate(-45deg) translate(1px,-1px); animation: checkDraw .2s var(--ease) both }
        @keyframes checkDraw { from { opacity: 0; transform: rotate(-45deg) translate(1px,-1px) scale(.5) } to { opacity: 1; transform: rotate(-45deg) translate(1px,-1px) scale(1) } }
        .opt.multi { border-radius: var(--r-sm) }
        .opt.multi .opt-check { border-radius: 5px }
        .opt.multi.selected .opt-check::before { width: 9px; height: 5px }
        .pills-wrap { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center }
        .pill-opt { padding: 12px 22px; border-radius: 100px; border: 1.5px solid var(--border-soft); background: var(--white); font-size: 14px; font-weight: 500; color: var(--body-text); cursor: pointer; transition: all .22s var(--ease); user-select: none }
        .pill-opt:hover { border-color: var(--teal); color: var(--teal); transform: translateY(-2px) }
        .pill-opt.selected { border-color: var(--teal); background: var(--teal); color: var(--white) }
        .input-wrap { display: flex; flex-direction: column; gap: 7px }
        .input-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .12em; text-transform: uppercase }
        .form-input, .form-select { width: 100%; padding: 15px 16px; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); color: var(--ink); font-family: var(--font-body); font-size: 16px; font-weight: 400; outline: none; transition: border-color .2s, box-shadow .25s var(--ease); -webkit-appearance: none; appearance: none; min-height: 52px }
        .form-input::placeholder { color: var(--muted); font-weight: 300 }
        .form-input:focus, .form-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,61,64,.07), -3px 0 0 var(--terra) }
        .form-select { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg%3E%3Cpath d='M6 9l6 6 6-6' stroke='%237a9299' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 18px; padding-right: 40px; cursor: pointer }
        .date-row { display: grid; grid-template-columns: 1.3fr 1fr 1.2fr; gap: 8px }
        .form-textarea { width: 100%; min-height: 110px; padding: 15px 16px; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); color: var(--ink); font-family: var(--font-body); font-size: 16px; font-weight: 300; outline: none; resize: vertical; line-height: 1.65; transition: border-color .2s }
        .form-textarea::placeholder { color: var(--muted) }
        .form-textarea:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,61,64,.07) }
        .field-error { font-size: 12px; color: var(--terra); margin-top: -2px; font-weight: 500; min-height: 16px }
        .state-lock { display: none; align-items: center; gap: 7px; padding: 7px 14px; background: var(--teal-soft); border: 1px solid rgba(26,61,64,.12); border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--teal); width: fit-content }
        .state-lock.visible { display: inline-flex }
        .state-lock-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sage); flex-shrink: 0 }
        .city-wrap { position: relative }
        .city-input-row { display: flex; align-items: center; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); overflow: hidden; transition: border-color .2s, box-shadow .2s }
        .city-input-row:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,61,64,.07) }
        .city-input-row .form-input { border: none; box-shadow: none; border-radius: 0; background: transparent; flex: 1; min-height: 52px; padding: 15px 14px }
        .city-clear { width: 40px; height: 52px; background: transparent; border: none; color: var(--muted); font-size: 14px; cursor: pointer; display: none; align-items: center; justify-content: center; flex-shrink: 0 }
        .city-clear.visible { display: flex }
        .city-suggestions { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); overflow: hidden; box-shadow: 0 8px 32px rgba(26,61,64,.12); z-index: 50; display: none; max-height: 220px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border-soft) transparent }
        .city-suggestions.open { display: block }
        .city-suggestions::-webkit-scrollbar { width: 6px }
        .city-suggestions::-webkit-scrollbar-track { background: transparent }
        .city-suggestions::-webkit-scrollbar-thumb { background-color: var(--border-soft); border-radius: 10px }
        .city-sugg-item { padding: 13px 16px; font-size: 14px; font-weight: 500; color: var(--ink); cursor: pointer; transition: background .15s; border-bottom: 1px solid var(--border-soft); display: flex; align-items: center; gap: 10px }
        .city-sugg-item:last-child { border-bottom: none }
        .city-sugg-item:hover { background: var(--teal-soft) }
        .city-sugg-empty { padding: 16px; font-size: 13px; color: var(--muted); text-align: center; font-weight: 300 }
        .btn-continue { width: 100%; padding: 18px 24px; background: var(--terra); color: var(--white); border: none; border-radius: 100px; font-family: var(--font-body); font-size: 16px; font-weight: 700; cursor: pointer; transition: all .22s var(--ease); letter-spacing: .02em; min-height: 56px; box-shadow: 0 4px 0 rgba(134,55,22,.6), 0 8px 24px rgba(196,102,58,.22); transform: translateY(0) }
        .btn-continue:hover:not(:disabled) { background: var(--terra-hover); transform: translateY(-3px); box-shadow: 0 7px 0 rgba(134,55,22,.55), 0 16px 32px rgba(196,102,58,.28) }
        .btn-continue:active:not(:disabled) { transform: translateY(3px); box-shadow: 0 1px 0 rgba(134,55,22,.6), 0 3px 8px rgba(196,102,58,.15) }
        .btn-continue:disabled { opacity: .38; cursor: not-allowed }
        .btn-continue.loading { background: linear-gradient(90deg, var(--terra) 25%, var(--terra-hover) 50%, var(--terra) 75%); background-size: 200% 100%; animation: shimmer 1.2s linear infinite; pointer-events: none }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .info-card { background: var(--white); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 24px 22px; box-shadow: 0 2px 12px rgba(26,61,64,.05) }
        .info-card-kicker { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--sage); margin-bottom: 10px }
        .info-card-headline { font-family: var(--font-display); font-size: clamp(18px,4vw,23px); font-weight: 500; line-height: 1.25; color: var(--ink); margin-bottom: 10px; font-variation-settings: "opsz" 22,"WONK" 1 }
        .info-card-body { font-size: 14px; color: var(--body-text); line-height: 1.8; font-weight: 300 }
        .info-card-body strong { color: var(--ink); font-weight: 600 }
        .comp-neg-card { background: var(--gold-pale); border: 1px solid rgba(201,168,76,.25); border-radius: var(--r-lg); padding: 24px 22px; border-left: 4px solid var(--gold) }
        .screen.active .info-card, .screen.active .comp-neg-card { animation: cardIn .42s var(--ease) .12s both }
        @keyframes cardIn { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .screen-icon { font-size: 44px; text-align: center; display: block; animation: iconSpring .5s var(--spring) .08s both }
        @keyframes iconSpring { 0% { transform: scale(.6); opacity: 0 } 60% { transform: scale(1.12) } 80% { transform: scale(.96) } 100% { transform: scale(1); opacity: 1 } }
        .otp-boxes { display: flex; gap: 10px; justify-content: center }
        .otp-box { width: 48px; height: 60px; border: 2px solid var(--border-soft); border-radius: var(--r-sm); background: var(--white); font-family: var(--font-display); font-size: 28px; font-weight: 500; color: var(--ink); text-align: center; outline: none; transition: all .18s var(--spring); caret-color: var(--terra) }
        .otp-box:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,61,64,.07) }
        .otp-box.filled { border-color: var(--sage); background: var(--teal-soft); transform: scale(1.06) }
        .otp-resend { text-align: center; font-size: 13px; color: var(--muted); font-weight: 300 }
        .otp-resend a { color: var(--teal); text-decoration: underline; cursor: pointer; font-weight: 500 }
        .otp-hint { text-align: center; font-size: 12px; color: var(--muted); font-style: italic; font-weight: 300 }
        .sol-callout { border-radius: var(--r); padding: 14px 16px; margin-bottom: 4px; animation: solEntrance .4s var(--ease) both }
        @keyframes solEntrance { from { transform: translateY(8px) scale(.98); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
        .sol-callout.warning { background: #fdf6e3; border: 1px solid rgba(201,168,76,.3); border-left: 4px solid var(--gold) }
        .sol-callout.danger { background: var(--terra-pale); border: 1px solid rgba(196,102,58,.3); border-left: 4px solid var(--terra) }
        .sol-callout-kicker { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px }
        .sol-callout.warning .sol-callout-kicker { color: var(--gold) }
        .sol-callout.danger .sol-callout-kicker { color: var(--terra) }
        .sol-callout-title { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px }
        .sol-callout-body { font-size: 13px; color: var(--body-text); font-weight: 300; line-height: 1.6 }
        .sig-section { display: flex; flex-direction: column; gap: 10px }
        .sig-header { display: flex; align-items: center; justify-content: space-between }
        .sig-toggle { background: none; border: 1px solid var(--border-soft); border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--teal); padding: 5px 14px; cursor: pointer }
        .sig-draw-wrap { position: relative; border: 1.5px solid var(--border-soft); border-radius: var(--r); overflow: hidden; background: var(--white); transition: border-color .2s }
        .sig-draw-wrap.has-sig { border-color: var(--sage) }
        .sig-canvas { width: 100%; height: 140px; display: block; cursor: crosshair; touch-action: none }
        .sig-canvas-hint { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 13px; color: var(--muted); font-weight: 300; pointer-events: none; transition: opacity .3s; white-space: nowrap }
        .sig-canvas-hint.hidden { opacity: 0 }
        .sig-clear-btn { position: absolute; top: 10px; right: 12px; background: var(--white); border: 1px solid var(--border-soft); border-radius: 100px; font-size: 11px; font-weight: 600; color: var(--muted); padding: 4px 12px; cursor: pointer; display: none }
        .sig-clear-btn.visible { display: block }
        .sig-type-wrap { display: none; flex-direction: column; gap: 10px }
        .sig-typed-preview { font-family: var(--font-display); font-size: 30px; font-style: italic; color: var(--ink); padding: 14px 18px; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); min-height: 68px; display: flex; align-items: center; transition: border-color .2s }
        .sig-typed-preview.has-content { border-color: var(--sage) }
        .sig-placeholder { font-size: 14px; color: var(--muted); font-style: normal; font-weight: 300; font-family: var(--font-body) }
        .sig-status { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: var(--sage); padding: 8px 14px; background: rgba(74,140,126,.08); border: 1px solid rgba(74,140,126,.2); border-radius: 100px; width: fit-content; opacity: 0; transition: opacity .3s }
        .sig-status.visible { opacity: 1 }
        .consent-block { background: var(--white); border: 1px solid var(--border-soft); border-radius: var(--r); padding: 20px }
        .consent-text { font-size: 13px; color: var(--muted); line-height: 1.75; font-weight: 300; margin-bottom: 16px }
        .consent-row { display: flex; align-items: flex-start; gap: 12px; cursor: pointer }
        .consent-row input[type=checkbox] { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; accent-color: var(--teal); cursor: pointer }
        .consent-row label { font-size: 14px; color: var(--ink); font-weight: 500; line-height: 1.45; cursor: pointer }
        .hipaa-card { background: rgba(26,61,64,.04); border: 1px solid rgba(26,61,64,.15); border-left: 4px solid var(--teal); border-radius: var(--r); padding: 20px }
        .hipaa-card-kicker { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--teal); margin-bottom: 8px }
        .hipaa-body { font-size: 13px; color: var(--body-text); line-height: 1.8; font-weight: 300 }
        .confirm-screen { display: none; flex-direction: column; gap: 0; width: 100%; animation: sIn .5s var(--ease) both }
        .confirm-screen.active { display: flex }
        .confirm-hero { background: var(--teal); border-radius: var(--r-lg); padding: 40px 28px; text-align: center; position: relative; overflow: hidden }
        .confirm-hero::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle,rgba(201,168,76,.15),transparent 70%); pointer-events: none }
        .radar-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center }
        .radar-core { width: 56px; height: 56px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; font-size: 24px; position: relative; z-index: 2; box-shadow: 0 4px 20px rgba(201,168,76,.4); animation: coreGlow 3s ease-in-out infinite }
        @keyframes coreGlow { 0%,100% { box-shadow: 0 4px 20px rgba(201,168,76,.4) } 50% { box-shadow: 0 4px 32px rgba(201,168,76,.75),0 0 60px rgba(201,168,76,.18) } }
        .radar-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(201,168,76,.4); animation: radarPulse 2s ease-out infinite }
        .radar-ring:nth-child(1) { width: 70px; height: 70px; animation-delay: 0s }
        .radar-ring:nth-child(2) { width: 90px; height: 90px; animation-delay: .4s; opacity: .7 }
        .radar-ring:nth-child(3) { width: 110px; height: 110px; animation-delay: .8s; opacity: .4 }
        @keyframes radarPulse { 0% { transform: scale(.8); opacity: .8 } 100% { transform: scale(1.3); opacity: 0 } }
        .confirm-headline { font-family: var(--font-display); font-size: clamp(24px,5.5vw,34px); font-weight: 500; line-height: 1.15; color: var(--white); margin-bottom: 8px }
        .confirm-sub { font-size: 15px; color: rgba(255,255,255,.6); font-weight: 300; line-height: 1.65; margin-bottom: 28px }
        .confirm-sub strong { color: rgba(255,255,255,.9); font-weight: 600 }
        .countdown-wrap { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1); border-radius: var(--r); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px }
        .countdown-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .08em }
        .countdown-timer { font-family: var(--font-display); font-size: 32px; font-weight: 500; color: var(--gold); font-variant-numeric: tabular-nums; letter-spacing: .02em; line-height: 1; flex-shrink: 0 }
        .countdown-live { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #4caf7d; text-transform: uppercase; letter-spacing: .08em }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf7d; animation: livePulse 1.5s ease-in-out infinite }
        @keyframes livePulse { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
        .timeline { display: flex; flex-direction: column; gap: 0; margin-top: 24px }
        .tl-step { display: grid; grid-template-columns: 36px 1fr; gap: 14px; align-items: flex-start; padding-bottom: 20px; position: relative }
        .tl-step:not(:last-child)::after { content: ''; position: absolute; left: 17px; top: 36px; bottom: 0; width: 2px; background: linear-gradient(to bottom,var(--border-soft),transparent) }
        .tl-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; border: 2px solid var(--border-soft); background: var(--white) }
        .tl-icon.done { background: rgba(76,175,125,.12); border-color: #4caf7d }
        .tl-icon.active { background: var(--terra-pale); border-color: var(--terra) }
        .tl-icon.pending { background: var(--cream-alt) }
        .tl-body { padding-top: 6px }
        .tl-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 2px }
        .tl-desc { font-size: 13px; color: var(--muted); font-weight: 300; line-height: 1.5 }
        .tl-badge { display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 11px; font-weight: 700; color: var(--terra); background: var(--terra-pale); border: 1px solid rgba(196,102,58,.2); padding: 3px 10px; border-radius: 100px }
        .ref-block { background: var(--cream-alt); border: 1px solid var(--border-soft); border-radius: var(--r-sm); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center }
        .ref-left { display: flex; flex-direction: column; gap: 2px }
        .ref-label { font-size: 10px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; font-weight: 700 }
        .ref-num { font-size: 15px; font-weight: 700; color: var(--teal); font-family: monospace; letter-spacing: .06em }
        .ref-copy { background: var(--white); border: 1px solid var(--border-soft); cursor: pointer; font-size: 12px; font-weight: 600; color: var(--sage); padding: 6px 12px; border-radius: 100px; transition: all .2s; font-family: var(--font-body) }
        .ref-copy:hover { border-color: var(--sage) }
        .upload-section { background: var(--cream-alt); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 22px; border-left: 4px solid var(--gold) }
        .upload-boost { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #4caf7d; background: rgba(76,175,125,.1); border: 1px solid rgba(76,175,125,.2); padding: 4px 10px; border-radius: 100px; margin-bottom: 8px }
        .upload-kicker { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px }
        .upload-headline { font-family: var(--font-display); font-size: 18px; font-weight: 500; color: var(--ink); margin-bottom: 6px }
        .upload-body { font-size: 13px; color: var(--body-text); line-height: 1.65; font-weight: 300; margin-bottom: 16px }
        .upload-zone { border: 2px dashed var(--border); border-radius: var(--r); padding: 24px 20px; text-align: center; cursor: pointer; transition: all .2s; background: var(--white) }
        .upload-zone:hover, .upload-zone.drag-over { border-color: var(--gold); background: var(--gold-pale) }
        .upload-zone-icon { font-size: 28px; margin-bottom: 8px; display: block }
        .upload-zone-text { font-size: 13px; color: var(--muted) }
        .upload-zone-text strong { color: var(--teal); font-weight: 600 }
        .upload-input { display: none }
        .upload-files { display: flex; flex-direction: column; gap: 6px; margin-top: 12px }
        .upload-file-item { display: flex; align-items: center; justify-content: space-between; background: var(--white); border: 1px solid var(--border-soft); border-radius: var(--r-sm); padding: 10px 14px; font-size: 13px }
        .upload-file-name { color: var(--ink); font-weight: 500; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
        .upload-file-remove { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 16px; padding: 0 4px }
        .upload-skip { background: none; border: none; cursor: pointer; font-size: 13px; color: var(--muted); font-weight: 500; display: block; width: 100%; text-align: center; padding: 8px }
        .protect-card { background: var(--white); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 22px; margin: 0 0 16px; box-shadow: 0 2px 16px rgba(26,61,64,.06); animation: cardIn 0.5s var(--ease) 0.3s both }
        .protect-kicker { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--sage); margin-bottom: 10px }
        .protect-title { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--ink); line-height: 1.25; margin-bottom: 6px; font-variation-settings: 'opsz' 22, 'WONK' 1 }
        .protect-sub { font-size: 13px; color: var(--muted); font-weight: 300; line-height: 1.65; margin-bottom: 14px }
        .protect-item { display: flex; align-items: flex-start; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border-soft); animation: cardIn .35s var(--ease) both }
        .protect-item:last-child { border-bottom: none; padding-bottom: 0 }
        .protect-icon { width: 30px; height: 30px; border-radius: 9px; background: var(--teal-soft); display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0 }
        .protect-text { font-size: 13px; color: var(--body-text); line-height: 1.6; font-weight: 300 }
        .protect-text strong { color: var(--ink); font-weight: 600 }
        .wait-section { background: var(--white); border: 1px solid var(--border-soft); border-radius: var(--r-lg); padding: 22px }
        .wait-kicker { font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--sage); margin-bottom: 14px }
        .wait-items { display: flex; flex-direction: column; gap: 12px }
        .wait-item { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: var(--body-text); line-height: 1.55; font-weight: 300 }
        .wait-item strong { color: var(--ink); font-weight: 600 }
        .wait-num { width: 22px; height: 22px; border-radius: 50%; background: var(--teal); color: var(--gold); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-family: var(--font-display) }
        .momentum-toast { position: fixed; top: 70px; left: 50%; transform: translateX(-50%) translateY(-12px) scale(.93); z-index: 300; background: var(--teal); color: var(--white); font-size: 12px; font-weight: 700; letter-spacing: .07em; padding: 8px 20px; border-radius: 100px; display: flex; align-items: center; gap: 7px; box-shadow: 0 6px 24px rgba(26,61,64,.28); opacity: 0; pointer-events: none; transition: opacity .2s var(--ease), transform .3s var(--spring); white-space: nowrap }
        .momentum-toast.show { opacity: 1; transform: translateX(-50%) translateY(0) scale(1) }
        .momentum-toast-check { width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,.2); display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0 }
        .resume-banner { background: var(--teal-soft); border: 1px solid rgba(26,61,64,.15); border-radius: var(--r); padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px }
        .resume-banner-title { font-size: 13px; font-weight: 600; color: var(--teal) }
        .resume-banner-sub { font-size: 12px; color: var(--body-text); font-weight: 300 }
        .resume-banner-btns { display: flex; gap: 8px; flex-wrap: wrap }
        .resume-btn-primary { flex: 1; padding: 10px; background: var(--teal); color: var(--white); border: none; border-radius: 100px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: var(--font-body) }
        .resume-btn-secondary { flex: 1; padding: 10px; background: transparent; border: 1px solid var(--border-soft); border-radius: 100px; font-size: 13px; color: var(--muted); cursor: pointer; font-family: var(--font-body) }
        .micro { font-size: 12px; color: var(--muted); text-align: center; line-height: 1.65; font-weight: 300 }
        .skip-link { text-align: center; font-size: 13px; color: var(--muted); cursor: pointer; padding: 6px; transition: color .2s; font-weight: 500; border: none; background: none; display: block; width: 100%; font-family: var(--font-body) }
        .skip-link:hover { color: var(--body-text) }
        .provider-search-wrap { position: relative }
        .provider-input-row { display: flex; align-items: center; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); overflow: hidden; transition: border-color .2s, box-shadow .2s }
        .provider-input-row:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(26,61,64,.07) }
        .provider-input-row .form-input { border: none; box-shadow: none; border-radius: 0; background: transparent; flex: 1; padding: 15px 14px; min-height: 52px }
        .provider-input-row .form-input:focus { box-shadow: none }
        .provider-search-icon { width: 46px; height: 52px; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 16px; flex-shrink: 0; border-right: 1px solid var(--border-soft) }
        .provider-clear { width: 40px; height: 52px; background: transparent; border: none; color: var(--muted); font-size: 14px; cursor: pointer; display: none; align-items: center; justify-content: center; flex-shrink: 0; transition: color .2s }
        .provider-clear.visible { display: flex }
        .provider-clear:hover { color: var(--ink) }
        .provider-suggestions { position: absolute; top: calc(100% + 4px); left: 0; right: 0; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r); overflow: hidden; box-shadow: 0 8px 32px rgba(26,61,64,.12); z-index: 50; display: none; max-height: 260px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border-soft) transparent }
        .provider-suggestions.open { display: block }
        .provider-suggestions::-webkit-scrollbar { width: 6px }
        .provider-suggestions::-webkit-scrollbar-track { background: transparent }
        .provider-suggestions::-webkit-scrollbar-thumb { background-color: var(--border-soft); border-radius: 10px }
        .provider-sugg-item { padding: 12px 16px; cursor: pointer; transition: background .15s; border-bottom: 1px solid var(--border-soft); display: flex; align-items: center; gap: 12px }
        .provider-sugg-item:last-child { border-bottom: none }
        .provider-sugg-item:hover { background: var(--teal-soft) }
        .provider-sugg-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center }
        .provider-sugg-info { flex: 1; min-width: 0 }
        .provider-sugg-name { font-size: 14px; font-weight: 500; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
        .provider-sugg-meta { font-size: 12px; color: var(--muted); font-weight: 300 }
        .quickpick-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 8px }
        .quickpicks { display: flex; flex-direction: column; gap: 8px }
        .quickpick-item { display: flex; align-items: center; gap: 12px; background: var(--white); border: 1.5px solid var(--border-soft); border-radius: var(--r-sm); padding: 12px 14px; cursor: pointer; transition: all .2s var(--ease); user-select: none }
        .quickpick-item:hover { border-color: var(--teal); background: var(--teal-soft) }
        .quickpick-icon { font-size: 16px; flex-shrink: 0 }
        .quickpick-info { flex: 1; min-width: 0 }
        .quickpick-name { font-size: 14px; font-weight: 500; color: var(--ink) }
        .quickpick-meta { font-size: 12px; color: var(--muted); font-weight: 300 }
        .quickpick-check { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--border); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: transparent; transition: all .2s }
        .quickpick-item.selected .quickpick-check { background: var(--teal); border-color: var(--teal); color: var(--white) }
        .quickpick-item.selected .quickpick-check::after { content: '✓' }
        .provider-selected-card { background: var(--teal-soft); border: 1.5px solid rgba(26,61,64,.2); border-radius: var(--r); padding: 14px 16px; display: flex; align-items: center; gap: 12px }
        .provider-selected-icon { font-size: 20px; flex-shrink: 0 }
        .provider-selected-info { flex: 1 }
        .provider-selected-check { width: 22px; height: 22px; border-radius: 50%; background: var(--teal); border: 1.5px solid var(--teal); flex-shrink: 0; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden }
        .provider-selected-check::before { content: ''; position: absolute; width: 10px; height: 6px; border-left: 2px solid var(--white); border-bottom: 2px solid var(--white); transform: rotate(-45deg) translate(1px,-1px); animation: checkDraw .2s var(--ease) both }
        .provider-selected-name { font-size: 14px; font-weight: 700; color: var(--teal) }
        .provider-selected-type { font-size: 12px; color: var(--muted); font-weight: 300 }
        .provider-change-btn { padding: 6px 14px; background: transparent; border: 1.5px solid var(--border-soft); border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all .2s }
        .provider-change-btn:hover { border-color: var(--teal); color: var(--teal) }
        .dont-remember-link { text-align: center; font-size: 13px; color: var(--muted); cursor: pointer; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 3px; transition: color .2s }
        .dont-remember-link:hover { color: var(--teal) }
        .dont-remember-panel { background: var(--cream-alt); border: 1px solid var(--border-soft); border-radius: var(--r); padding: 18px; display: none; flex-direction: column; gap: 14px }
        .dont-remember-panel.visible { display: flex }
        .dont-remember-q { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 4px }
        .facility-types { display: flex; flex-wrap: wrap; gap: 8px }
        .facility-type-pill { padding: 9px 16px; border-radius: 100px; border: 1.5px solid var(--border-soft); background: var(--white); font-size: 13px; font-weight: 500; color: var(--body-text); cursor: pointer; transition: all .2s; user-select: none; display: flex; align-items: center; gap: 6px }
        .facility-type-pill:hover { border-color: var(--teal); color: var(--teal) }
        .facility-type-pill.selected { border-color: var(--teal); background: var(--teal); color: var(--white) }
        .ongoing-wrap { display: flex; flex-direction: column; gap: 8px }
        .ongoing-pills { display: flex; gap: 8px; flex-wrap: wrap }
        .ongoing-pill { padding: 10px 18px; border-radius: 100px; border: 1.5px solid var(--border-soft); background: var(--white); font-size: 13px; font-weight: 500; color: var(--body-text); cursor: pointer; transition: all .2s var(--ease); user-select: none; min-height: 40px; display: flex; align-items: center }
        .ongoing-pill:hover { border-color: var(--teal); color: var(--teal) }
        .ongoing-pill.selected { border-color: var(--teal); background: var(--teal); color: var(--white) }
        .otp-phone-display { text-align: center; font-size: 16px; font-weight: 600; color: var(--ink); background: var(--teal-soft); border: 1px solid rgba(26,61,64,.12); border-radius: var(--r); padding: 14px 20px }
        @media(max-width: 520px) { .shell { padding: 88px 16px 80px } .nav { padding: 0 16px } .otp-box { width: 42px; height: 56px; font-size: 24px } .otp-boxes { gap: 7px } .sticky-phone { flex-direction: column; gap: 6px; text-align: center } .sticky-trust { justify-content: center } }
        .sticky-phone { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(249,245,239,.96); backdrop-filter: blur(16px); border-top: 1px solid var(--border-soft); padding: 10px 20px env(safe-area-inset-bottom,10px); z-index: 99; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap }
        .sticky-trust { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; flex-wrap: wrap }
        .sticky-trust span { display: flex; align-items: center; gap: 3px }
        .sticky-phone-link a { font-size: 13px; font-weight: 600; color: var(--teal); text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap }
        .gold-badge { width: 72px; height: 72px; border-radius: 50%; background: var(--gold-pale); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto }
      `}</style>

      <div className="momentum-toast show" style={{ opacity: showMomentum ? 1 : 0, transform: showMomentum ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(-12px) scale(.93)', pointerEvents: showMomentum ? 'auto' : 'none' }}>
        <span className="momentum-toast-check">✓</span>
        <span>{momentumMsg}</span>
      </div>

      <div className="progress-rail">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="seg"><div className="seg-fill" id={`sf${i}`}></div></div>
        ))}
      </div>

      <nav className="nav">
        <a href="/" className="nav-brand">
          <div className="nav-mark">CASEPORT</div>
          <div className="nav-tag">Check My Case</div>
        </a>
        <div className="nav-secure">🔒 Encrypted &amp; private</div>
      </nav>

      <button className={`back-btn ${!['s1', 's-confirm', 's-off', 's-off-atty', 's-off-settled', 's-await-thanks', 's-else'].includes(curScreen) ? 'visible' : ''}`} onClick={goBack} aria-label="Go back">←</button>

      <div className="shell">
        <div className="form-wrap" id="formWrap">

          {/* s1 */}
          <div className={`screen ${curScreen === 's1' ? 'active' : ''}`} id="s1">
            {showResumeBanner && (
              <div className="resume-banner">
                <div className="resume-banner-title">Welcome back — you were mid-way through your case review.</div>
                <div className="resume-banner-sub">Pick up where you left off, or start fresh.</div>
                <div className="resume-banner-btns">
                  <button className="resume-btn-primary" onClick={resumeDraft}>Resume →</button>
                  <button className="resume-btn-secondary" onClick={() => { clearDraft(); setFd(initialFormData); setHistory(['s1']); setCurScreen('s1') }}>Start fresh</button>
                </div>
              </div>
            )}
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">What happened to you?</h1>
            <p className="q-sub">Select the option that most closely describes your situation.</p>
            <div className="options">
              {[
                { icon: '🚗', label: 'Car accident', value: 'Car accident' },
                { icon: '🚛', label: 'Truck or commercial vehicle accident', value: 'Truck or commercial vehicle accident' },
                { icon: '🏍️', label: 'Motorcycle accident', value: 'Motorcycle accident' },
                { icon: '🚖', label: 'Rideshare accident (Uber or Lyft)', value: 'Rideshare accident (Uber or Lyft)' },
                { icon: '🚶', label: 'Pedestrian accident', value: 'Pedestrian accident' },
                { icon: '⚠️', label: 'Slip, trip, or fall', value: 'Slip, trip, or fall' },
                { icon: '🏗️', label: 'Workplace injury', value: 'Workplace injury' },
                { icon: '💔', label: 'Wrongful death or fatal accident', value: 'Wrongful death or fatal accident', sub: 'For surviving family members' },
              ].map(opt => (
                <div key={opt.value} className={`opt ${fd.incidentType === opt.value ? 'selected' : ''}`} onClick={() => { updateForm({ incidentType: opt.value }); goTo('s2') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}{opt.sub && <><br /><span style={{ fontSize: '12px', fontWeight: 300, color: 'var(--muted)' }}>{opt.sub}</span></>}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
              <div className={`opt ${fd.incidentType?.startsWith('Other:') ? 'selected' : ''}`} onClick={() => goTo('s-else')}>
                <span className="opt-icon">🤔</span>
                <span className="opt-label">Something else</span>
                <span className="opt-check"></span>
              </div>
            </div>
          </div>

          {/* s-else */}
          <div className={`screen ${curScreen === 's-else' ? 'active' : ''}`} id="s-else">
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">We may still be able to help.</h1>
            <p className="q-sub">Tell us a little more about what happened — we'll let the facts determine whether a case exists.</p>
            <div className="input-wrap">
              <label className="input-label">Describe your situation</label>
              <textarea className="form-textarea" id="elseText" placeholder="Briefly describe what happened…" rows={4}></textarea>
            </div>
            <button className="btn-continue" onClick={() => { const t = (document.getElementById('elseText') as HTMLTextAreaElement)?.value?.trim(); if (t) { updateForm({ incidentType: 'Other: ' + t }); goTo('s2') } }}>Continue →</button>
          </div>

          {/* s2 */}
          <div className={`screen ${curScreen === 's2' ? 'active' : ''}`} id="s2">
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">When did this happen?</h1>
            <p className="q-sub">Approximate date is fine if you're not sure of the exact day.</p>
            <div className="input-wrap">
              <label className="input-label">Date of incident</label>
              <div className="date-row">
                <select className="form-select" id="incMonth">
                  <option value="">Month</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                    <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select className="form-select" id="incDay">
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select className="form-select" id="incYear">
                  <option value="">Year</option>
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="field-error" style={{ color: 'var(--terra)' }}>{dateErr}</div>
            </div>
            {solCallout && (
              <div className={`sol-callout ${solCallout.type}`}>
                <div className="sol-callout-kicker">{solCallout.type === 'danger' ? '⚠️ Filing deadline concern' : '⏱ Filing window'}</div>
                <div className="sol-callout-title">{solCallout.title}</div>
                <div className="sol-callout-body">{solCallout.body}</div>
              </div>
            )}
            <button className="btn-continue" onClick={validateDate}>Continue →</button>
          </div>

          {/* s3 */}
          <div className={`screen ${curScreen === 's3' ? 'active' : ''}`} id="s3">
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Where did it happen?</h1>
            <p className="q-sub">We need to connect you with an attorney licensed in the right state.</p>
            <div className="input-wrap">
              <label className="input-label">State</label>
              <select className="form-select" id="incState" onChange={(e) => onStateChange(e.target.value)}>
                <option value="">Select your state…</option>
                {Object.keys(CITIES).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="field-error" style={{ color: 'var(--terra)' }}>{stateErr}</div>
            </div>
            <div className="input-wrap">
              <label className="input-label">City <span style={{ color: 'var(--muted)', fontWeight: 300, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(optional)</span></label>
              <div className={`state-lock ${cityList.length > 0 ? 'visible' : ''}`}>
                <span className="state-lock-dot"></span>
                <span>Cities in {fd.incidentState || 'selected state'}</span>
              </div>
              <div className="city-wrap">
                <div className="city-input-row">
                  <input
                    className="form-input"
                    type="text"
                    id="incCity"
                    placeholder={cityList.length > 0 ? 'Start typing…' : 'Select a state first…'}
                    autoComplete="off"
                    disabled={cityList.length === 0}
                    value={cityInput}
                    onChange={(e) => onCityInput(e.target.value)}
                    onFocus={() => cityList.length > 0 && setShowCitySugg(true)}
                    onBlur={() => setTimeout(() => setShowCitySugg(false), 160)}
                    onKeyDown={(e) => onCityKey(e)}
                  />
                  <button className={`city-clear ${cityInput.length > 0 ? 'visible' : ''}`} type="button" onClick={() => { setCityInput(''); setShowCitySugg(false) }}>✕</button>
                </div>
                <div className={`city-suggestions ${showCitySugg ? 'open' : ''}`}>
                  {cityList.length > 0 ? (
                    cityList.slice(0, 6).map(city => (
                      <div key={city} className="city-sugg-item" onClick={() => selCity(city)}>📍{city}</div>
                    ))
                  ) : (
                    <div className="city-sugg-empty">No cities found</div>
                  )}
                </div>
              </div>
            </div>
            <button className="btn-continue" onClick={validateLocation}>Continue →</button>
          </div>

          {/* s4 */}
          <div className={`screen ${curScreen === 's4' ? 'active' : ''}`} id="s4">
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">Was someone else responsible for what happened?</h1>
            <p className="q-sub">Even if you're not 100% sure, answer based on what you believe.</p>
            <div className="options">
              {[
                { icon: '👤', label: 'Yes, someone else was at fault', flag: 'confirmed' },
                { icon: '🤔', label: "I'm not sure", flag: 'unsure' },
                { icon: '🚫', label: 'No, it was my fault or an accident', flag: 'no' },
              ].map(opt => (
                <div key={opt.flag} className={`opt ${fd.liabilityFlag === opt.flag ? 'selected' : ''}`} onClick={() => { updateForm({ liabilityStatus: opt.label, liabilityFlag: opt.flag }); opt.flag === 'no' ? goTo('s-comp-neg') : goTo('s5') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* s-comp-neg */}
          <div className={`screen ${curScreen === 's-comp-neg' ? 'active' : ''}`} id="s-comp-neg">
            <div className="phase-label">
              <div className="phase-name">Your Incident</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">Before we close this out — one more thing.</h1>
            <p className="q-sub">This is important. Many people don't know this rule exists.</p>
            <div className="comp-neg-card">
              <div className="info-card-kicker">The comparative negligence rule</div>
              <h2 className="info-card-headline">Even if you were partly at fault, you may still have a case.</h2>
              <p className="info-card-body">In most U.S. states, fault is shared — not all-or-nothing. If the other party was even <strong>partially responsible</strong>, you may be entitled to compensation proportional to their share of fault.</p>
            </div>
            <p className="q-sub" style={{ marginTop: 0 }}>With that in mind — was anyone else even partially involved?</p>
            <div className="options">
              <div className="opt" onClick={() => { updateForm({ compNegFlag: true, liabilityFlag: 'confirmed' }); goTo('s5') }}>
                <span className="opt-icon">👥</span>
                <span className="opt-label">Yes — the other party played some role</span>
                <span className="opt-check"></span>
              </div>
              <div className="opt" onClick={() => { updateForm({ compNegFlag: true, liabilityFlag: 'unsure' }); goTo('s5') }}>
                <span className="opt-icon">🤔</span>
                <span className="opt-label">I think so, but I'm not certain</span>
                <span className="opt-check"></span>
              </div>
              <div className="opt" onClick={() => goTo('s-off')}>
                <span className="opt-icon">🚫</span>
                <span className="opt-label">No — it was entirely my fault</span>
                <span className="opt-check"></span>
              </div>
            </div>
          </div>

          {/* PHASE 2 */}
          <div className={`screen ${curScreen === 's5' ? 'active' : ''}`} id="s5">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Have you seen a doctor or received medical treatment?</h1>
            <p className="q-sub">This includes ER visits, urgent care, your primary care doctor, or any specialist.</p>
            <div className="options">
              {[
                { icon: '🏥', label: 'Yes — I went to the ER or hospital', value: 'Yes — ER or hospital', level: 'er' },
                { icon: '🩺', label: 'Yes — I visited urgent care or a doctor', value: 'Yes — urgent care or doctor', level: 'urgentCare' },
                { icon: '❓', label: "No — I haven't seen anyone yet", value: 'No — haven\'t seen anyone yet', level: 'none' },
              ].map(opt => (
                <div key={opt.value} className={`opt ${fd.medicalTreatment === opt.value ? 'selected' : ''}`} onClick={() => { updateForm({ medicalTreatment: opt.value, treatmentLevel: opt.level }); opt.level === 'none' ? goTo('s-med-soft') : goTo('s5b') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* s5b */}
          <div className={`screen ${curScreen === 's5b' ? 'active' : ''}`} id="s5b">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">What types of treatment have you received?</h1>
            <p className="q-sub">Select all that apply — this helps a firm in your area review your case.</p>
            <div className="options">
              {[
                { icon: '🏥', label: 'Emergency Room or Hospital' },
                { icon: '🩺', label: 'Urgent Care Center' },
                { icon: '👨‍⚕️', label: 'Primary Care or Family Doctor' },
                { icon: '🦴', label: 'Chiropractor' },
                { icon: '🦵', label: 'Orthopedic Specialist' },
                { icon: '💪', label: 'Physical Therapy' },
                { icon: '🧠', label: 'Neurologist or Spine Specialist' },
                { icon: '🏨', label: 'Surgery' },
                { icon: '📷', label: 'Imaging — X-ray, MRI, or CT scan' },
              ].map(opt => (
                <div key={opt.label} className={`opt multi ${fd.treatmentTypes.includes(opt.label) ? 'selected' : ''}`} onClick={() => {
                  const types = [...fd.treatmentTypes]
                  if (types.includes(opt.label)) {
                    updateForm({ treatmentTypes: types.filter(t => t !== opt.label) })
                  } else {
                    updateForm({ treatmentTypes: [...types, opt.label] })
                  }
                }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
            <button className="btn-continue" disabled={fd.treatmentTypes.length === 0} onClick={() => goTo('s5c')}>Continue →</button>
          </div>

          {/* s5c */}
          <div className={`screen ${curScreen === 's5c' ? 'active' : ''}`} id="s5c">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Where did you receive treatment?</h1>
            <p className="q-sub">This lets your attorney request records immediately — no extra steps for you. Skip if you're not sure.</p>

            {fd.incidentState && (
              <div className="state-lock visible" style={{ margin: '0 auto' }}>
                <span className="state-lock-dot"></span>
                <span>{fd.incidentCity ? `Showing providers near ${fd.incidentCity}` : `Showing providers in ${fd.incidentState}`}</span>
              </div>
            )}

            {selectedProvider ? (
              <div className="provider-selected-card">
                <span className="provider-selected-icon">{TYPE_ICONS[selectedProvider.t] || '🏥'}</span>
                <div className="provider-selected-info">
                  <div className="provider-selected-name">{selectedProvider.n}</div>
                  <div className="provider-selected-type">{selectedProvider.c !== 'Nationwide' ? selectedProvider.c + ' · ' : ''}{selectedProvider.t}</div>
                </div>
                <span className="provider-selected-check"></span>
                <button className="provider-change-btn" onClick={changeProvider}>Change</button>
              </div>
            ) : (
              <div>
                <div className="provider-search-wrap">
                  <div className="provider-input-row">
                    <span className="provider-search-icon">🔍</span>
                    <input
                      className="form-input"
                      type="text"
                      id="providerInput"
                      placeholder="Search hospital, clinic, urgent care…"
                      autoComplete="off"
                      value={providerInput}
                      onChange={(e) => onProviderInputChange(e.target.value)}
                      onFocus={() => providerInput.length > 0 && setShowProviderSugg(true)}
                      onBlur={() => setTimeout(() => setShowProviderSugg(false), 160)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && providerInput.trim()) {
                          e.preventDefault()
                          const filtered = providerList.filter(p => p.n.toLowerCase().includes(providerInput.toLowerCase()))
                          if (filtered.length > 0) {
                            selectProvider(filtered[0])
                          } else {
                            useFreeText(providerInput.trim())
                          }
                        }
                      }}
                    />
                    <button className={`provider-clear ${providerInput.length > 0 ? 'visible' : ''}`} onClick={() => { setProviderInput(''); setShowProviderSugg(false) }}>✕</button>
                  </div>
                  <div className={`provider-suggestions ${showProviderSugg ? 'open' : ''}`}>
                    {providerList.filter(p => p.n.toLowerCase().includes(providerInput.toLowerCase())).length > 0 ? (
                      providerList.filter(p => p.n.toLowerCase().includes(providerInput.toLowerCase())).slice(0, 8).map((p, i) => (
                        <div key={i} className="provider-sugg-item" onClick={() => selectProvider(p)}>
                          <span className="provider-sugg-icon">{TYPE_ICONS[p.t] || '🏥'}</span>
                          <div className="provider-sugg-info">
                            <div className="provider-sugg-name">{p.n}</div>
                            <div className="provider-sugg-meta">{p.c !== 'Nationwide' ? p.c + ' · ' : ''}{p.t}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="city-sugg-empty">No providers found</div>
                    )}
                  </div>
                </div>

                <p className="quickpick-label" style={{ marginTop: 16 }}>Common in your area</p>
                <div className="quickpicks">
                  {providerList.slice(0, 5).map((p, i) => {
                    const item = p as Provider
                    return (
                    <div key={i} className="quickpick-item" onClick={() => selectProvider(item)}>
                      <span className="quickpick-icon">{TYPE_ICONS[item.t] || '🏥'}</span>
                      <div className="quickpick-info">
                        <div className="quickpick-name">{item.n}</div>
                        <div className="quickpick-meta">{item.c !== 'Nationwide' ? item.c + ' · ' : ''}{item.t}</div>
                      </div>
                      <span className="quickpick-check"></span>
                    </div>
                  )})}
                </div>

                <button className="dont-remember-link" onClick={() => setShowDontRemember(!showDontRemember)}>I don't remember the exact name</button>
                <div className={`dont-remember-panel ${showDontRemember ? 'visible' : ''}`}>
                  <div>
                    <p className="dont-remember-q">What type of facility was it?</p>
                    <div className="facility-types">
                      {['Hospital / ER', 'Urgent Care', 'Chiropractor', "Doctor's Office", 'Physical Therapy', 'Other'].map(type => (
                        <div key={type} className={`facility-type-pill ${facilityType === type ? 'selected' : ''}`} onClick={() => pickFacilityType(type)}>
                          {type === 'Hospital / ER' && '🏥'}
                          {type === 'Urgent Care' && '🩺'}
                          {type === 'Chiropractor' && '🦴'}
                          {type === "Doctor's Office" && '👨‍⚕️'}
                          {type === 'Physical Therapy' && '💪'}
                          {type === 'Other' && '📋'}
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6 }}>No problem — your attorney will locate your records with just the facility type and city. That's enough to get started.</p>
                </div>
              </div>
            )}

            {(selectedProvider || facilityType) && (
              <div style={{ marginTop: 16 }}>
                <label className="input-label">Is treatment still ongoing?</label>
                <div className="ongoing-pills" style={{ marginTop: 8 }}>
                  <div className={`ongoing-pill ${treatmentOngoing === true ? 'selected' : ''}`} onClick={() => setTreatmentOngoing(true)}>🏥 Yes, still being treated</div>
                  <div className={`ongoing-pill ${treatmentOngoing === false ? 'selected' : ''}`} onClick={() => setTreatmentOngoing(false)}>👍 No, treatment ended</div>
                  <div className={`ongoing-pill ${treatmentOngoing === null ? 'selected' : ''}`} onClick={() => setTreatmentOngoing(null)}>🤔 Not sure</div>
                </div>
              </div>
            )}

            <button className="btn-continue" onClick={proceedFromProvider}>Continue →</button>
            <button className="skip-link" onClick={skipProvider}>Skip for now — my attorney can locate records</button>
          </div>

          {/* s-med-soft */}
          <div className={`screen ${curScreen === 's-med-soft' ? 'active' : ''}`} id="s-med-soft">
            <div className="phase-label"><div className="phase-name">Your Treatment</div></div>
            <span className="screen-icon">⚕️</span>
            <div className="info-card">
              <div className="info-card-kicker">This matters for your case</div>
              <h2 className="info-card-headline">Getting seen by a doctor is the most important thing you can do right now.</h2>
              <p className="info-card-body">Medical documentation is the foundation of every personal injury case. Symptoms can take 24–72 hours to appear after an accident. If you're in pain — or even if you think you're okay — please see a doctor today.</p>
            </div>
            <div className="options">
              <div className="opt" onClick={() => goTo('s-await')}>
                <span className="opt-icon">🏥</span>
                <span className="opt-label">I'll seek treatment and come back</span>
                <span className="opt-check"></span>
              </div>
              <div className="opt" onClick={() => { updateForm({ treatmentOngoing: false }); goTo('s9') }}>
                <span className="opt-icon">👍</span>
                <span className="opt-label">I'm not currently in pain</span>
                <span className="opt-check"></span>
              </div>
            </div>
          </div>

          {/* s-await */}
          <div className={`screen ${curScreen === 's-await' ? 'active' : ''}`} id="s-await">
            <div className="phase-label"><div className="phase-name">Your Treatment</div></div>
            <span className="screen-icon">📋</span>
            <h1 className="q-headline">Let's hold your spot.</h1>
            <p className="q-sub">Share your contact info and we'll send you a reminder once you've been seen.</p>
            <div className="input-wrap">
              <label className="input-label">Your name</label>
              <input className="form-input" type="text" id="awaitName" placeholder="First name" autoComplete="given-name" />
            </div>
            <div className="input-wrap">
              <label className="input-label">Phone or email</label>
              <input className="form-input" type="text" id="awaitContact" placeholder="How can we reach you?" />
            </div>
            <button className="btn-continue" onClick={() => goTo('s-await-thanks')}>Save my spot →</button>
          </div>

          {/* s-await-thanks */}
          <div className={`screen ${curScreen === 's-await-thanks' ? 'active' : ''}`} id="s-await-thanks">
            <div className="gold-badge">📋</div>
            <h1 className="q-headline">We've saved your spot.</h1>
            <div className="info-card">
              <p className="info-card-body">We'll send you a reminder in 48 hours. When you've been seen by a doctor, reply to that message or return to <strong>caseport.io/start</strong> — your answers will be waiting.</p>
            </div>
            <p className="micro">Don't wait too long — statutes of limitations are date-specific. The sooner you act, the stronger your position.</p>
          </div>

          {/* s6 */}
          <div className={`screen ${curScreen === 's6' ? 'active' : ''}`} id="s6">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">When did you last receive medical treatment?</h1>
            <p className="q-sub">Approximate is fine.</p>
            <div className="options">
              {[
                { icon: '📅', label: 'Within the last 30 days' },
                { icon: '🗓️', label: '1 to 3 months ago' },
                { icon: '⏳', label: 'More than 3 months ago' },
              ].map(opt => (
                <div key={opt.label} className={`opt ${fd.treatmentRecency === opt.label ? 'selected' : ''}`} onClick={() => { updateForm({ treatmentRecency: opt.label }); goTo('s7') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* s7 */}
          <div className={`screen ${curScreen === 's7' ? 'active' : ''}`} id="s7">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">What injuries did you sustain?</h1>
            <p className="q-sub">Select everything that applies.</p>
            <div className="options">
              {[
                { icon: '🦴', label: 'Neck or back pain' },
                { icon: '🧠', label: 'Head injury, headaches, or concussion' },
                { icon: '🩻', label: 'Broken bones or fractures' },
                { icon: '🤕', label: 'Muscle pain, soreness, or stiffness' },
                { icon: '🦵', label: 'Shoulder, knee, hip, or joint pain' },
                { icon: '💭', label: 'Anxiety, stress, or emotional distress' },
                { icon: '⚠️', label: 'Scarring or visible injury to skin' },
                { icon: '➕', label: 'Something else not listed here' },
              ].map(opt => (
                <div key={opt.label} className={`opt multi ${fd.injuryTypes.includes(opt.label) ? 'selected' : ''}`} onClick={() => {
                  const injuries = [...fd.injuryTypes]
                  if (injuries.includes(opt.label)) {
                    updateForm({ injuryTypes: injuries.filter(i => i !== opt.label) })
                  } else {
                    updateForm({ injuryTypes: [...injuries, opt.label] })
                  }
                }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
            <button className="btn-continue" disabled={fd.injuryTypes.length === 0} onClick={() => goTo('s8')}>Continue →</button>
          </div>

          {/* s8 */}
          <div className={`screen ${curScreen === 's8' ? 'active' : ''}`} id="s8">
            <div className="phase-label">
              <div className="phase-name">Your Treatment</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">How has this affected your daily life?</h1>
            <p className="q-sub">Select the option that most closely describes your situation.</p>
            <div className="options">
              {[
                { icon: '💼', label: 'I missed work or lost income', level: 'serious' },
                { icon: '🚫', label: 'I can no longer do things I used to do', level: 'serious' },
                { icon: '😔', label: "I've been in pain and discomfort", level: 'moderate' },
                { icon: '👍', label: 'It was minor — I recovered quickly', level: 'minor' },
              ].map(opt => (
                <div key={opt.label} className={`opt ${fd.impactLevel === opt.level ? 'selected' : ''}`} onClick={() => { updateForm({ lifeImpact: opt.label, impactLevel: opt.level }); goTo('s9') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* PHASE 3 */}
          <div className={`screen ${curScreen === 's9' ? 'active' : ''}`} id="s9">
            <div className="phase-label">
              <div className="phase-name">Your Situation</div>
              <div className="phase-dots">
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Do you know if the other party had insurance?</h1>
            <p className="q-sub">This is about the person or company responsible — not your own insurance.</p>
            <div className="options">
              {[
                { icon: '✅', label: 'Yes, they had insurance' },
                { icon: '❌', label: "No, I don't think they were insured" },
                { icon: '🤔', label: "I'm not sure" },
              ].map(opt => (
                <div key={opt.label} className={`opt ${fd.atFaultInsurance === opt.label ? 'selected' : ''}`} onClick={() => { updateForm({ atFaultInsurance: opt.label }); goTo('s10') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* s10 */}
          <div className={`screen ${curScreen === 's10' ? 'active' : ''}`} id="s10">
            <div className="phase-label">
              <div className="phase-name">Your Situation</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Was a police report or official report filed?</h1>
            <p className="q-sub">This could be a police report, an accident report, or an employer incident report.</p>
            <div className="options">
              {[
                { icon: '📋', label: 'Yes — a report was filed', value: true },
                { icon: '📝', label: 'No — no report was filed', value: false },
                { icon: '🤔', label: "I'm not sure", value: null },
              ].map(opt => (
                <div key={String(opt.value)} className={`opt ${fd.reportFiled === opt.value ? 'selected' : ''}`} onClick={() => { updateForm({ reportFiled: opt.value }); goTo('s11') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <span className="opt-label">{opt.label}</span>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* s11 */}
          <div className={`screen ${curScreen === 's11' ? 'active' : ''}`} id="s11">
            <div className="phase-label">
              <div className="phase-name">Your Situation</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Have you already spoken with or hired an attorney?</h1>
            <p className="q-sub">This helps us make sure we can actually help you.</p>
            <div className="options">
              <div className={`opt ${fd.priorAttorney ? 'selected' : ''}`} onClick={() => { updateForm({ priorAttorney: false }); goTo('s12') }}>
                <span className="opt-icon">🙋</span>
                <span className="opt-label">No — I don't have an attorney yet</span>
                <span className="opt-check"></span>
              </div>
              <div className="opt" onClick={() => goTo('s-off-atty')}>
                <span className="opt-icon">⚖️</span>
                <span className="opt-label">Yes — I already have an attorney</span>
                <span className="opt-check"></span>
              </div>
            </div>
          </div>

          {/* s12 */}
          <div className={`screen ${curScreen === 's12' ? 'active' : ''}`} id="s12">
            <div className="phase-label">
              <div className="phase-name">Your Situation</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">Have you signed any documents related to this incident?</h1>
            <p className="q-sub">This includes anything from an insurance company — like a release, settlement, or payment agreement.</p>
            <div className="options">
              <div className={`opt ${!fd.priorSettlement ? 'selected' : ''}`} onClick={() => { updateForm({ priorSettlement: false }); goTo('s-urgency') }}>
                <span className="opt-icon">🙋</span>
                <span className="opt-label">No — I haven't signed anything</span>
                <span className="opt-check"></span>
              </div>
              <div className="opt" onClick={() => goTo('s-off-settled')}>
                <span className="opt-icon">📝</span>
                <span className="opt-label">Yes — I signed something</span>
                <span className="opt-check"></span>
              </div>
            </div>
          </div>

          {/* s-urgency */}
          <div className={`screen ${curScreen === 's-urgency' ? 'active' : ''}`} id="s-urgency">
            <div className="phase-label">
              <div className="phase-name">Your Situation</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">How soon do you need help?</h1>
            <p className="q-sub">This helps us route your case to the attorney most available to respond quickly.</p>
            <div className="options">
              {[
                { icon: '⚡', label: 'Urgently — today if possible', sub: "We'll notify a matching attorney immediately", level: 'urgent' },
                { icon: '📅', label: 'Soon — within the next few days', sub: 'Standard routing, 4-hour response window', level: 'soon' },
                { icon: '🔍', label: 'Still researching — no rush yet', sub: "We'll review and follow up within 24 hours", level: 'researching' },
              ].map(opt => (
                <div key={opt.level} className={`opt ${fd.urgencyLevel === opt.level ? 'selected' : ''}`} onClick={() => { updateForm({ urgencyLevel: opt.level }); goTo('s13') }}>
                  <span className="opt-icon">{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span className="opt-label">{opt.label}</span>
                    <div className="opt-sub">{opt.sub}</div>
                  </div>
                  <span className="opt-check"></span>
                </div>
              ))}
            </div>
          </div>

          {/* PHASE 4 */}
          <div className={`screen ${curScreen === 's13' ? 'active' : ''}`} id="s13">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">What's your name?</h1>
            <p className="q-sub">First name is fine — this is just so we know how to address you.</p>
            <div className="input-wrap">
              <label className="input-label">First name</label>
              <input className="form-input" type="text" id="firstName" placeholder="First name" autoComplete="given-name" />
              <div className="field-error" style={{ color: 'var(--terra)' }}>{nameErr}</div>
            </div>
            <button className="btn-continue" onClick={validateName}>Continue →</button>
          </div>

          {/* s14 */}
          <div className={`screen ${curScreen === 's14' ? 'active' : ''}`} id="s14">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">What's the best number to reach you, <em>{fd.firstName || 'there'}</em>?</h1>
            <p className="q-sub">A vetted attorney will call or text. Your number is never shared or sold.</p>
            <div className="input-wrap">
              <label className="input-label">Mobile number</label>
              <input className="form-input" type="tel" id="phoneNum" placeholder="(555) 555-5555" autoComplete="tel" value={phone} onChange={(e) => setPhone(fmtPhone(e.target.value))} maxLength={14} />
              <div className="field-error" style={{ color: 'var(--terra)' }}>{phoneErr}</div>
            </div>
            <button className="btn-continue" onClick={validatePhone}>Send My Code →</button>
          </div>

          {/* s-otp */}
          <div className={`screen ${curScreen === 's-otp' ? 'active' : ''}`} id="s-otp">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">We just sent you a code.</h1>
            <p className="q-sub">So the attorney has a confirmed number to reach you on.</p>
            <div className="otp-phone-display">{fd.phone || 'Sending to…'}</div>
            <div className="input-wrap">
              <label className="input-label" style={{ textAlign: 'center', width: '100%' }}>Enter your 6-digit code</label>
              <div className="otp-boxes">
                {otpCode.map((_, idx) => (
                  <input
                    key={idx}
                    className={`otp-box ${otpCode[idx] ? 'filled' : ''}`}
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    value={otpCode[idx]}
                    onChange={(e) => otpInput(idx, e.target.value)}
                  />
                ))}
              </div>
            </div>
            <p className="otp-hint">For this demo, any 6-digit code will work.</p>
            <div className="otp-resend">Didn't get it? <a onClick={() => { }}>Resend code</a></div>
          </div>

          {/* s14b */}
          <div className={`screen ${curScreen === 's14b' ? 'active' : ''}`} id="s14b">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">Where should we send your <em>case summary</em>?</h1>
            <p className="q-sub">Optional. We'll email your reference number, what happens next, and the attorney's name — so you have everything in writing.</p>
            <div className="input-wrap">
              <label className="input-label">Email address <span style={{ color: 'var(--muted)', fontWeight: 300, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(optional)</span></label>
              <input className="form-input" type="email" id="emailAddr" placeholder="your@email.com" autoComplete="email" />
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 300, marginTop: 2, lineHeight: 1.5 }}>We never sell or share your email. You can opt out any time.</div>
            </div>
            <div style={{ background: 'var(--teal-soft)', border: '1px solid rgba(26,61,64,.12)', borderRadius: 'var(--r)', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📋</span>
              <div style={{ fontSize: 13, color: 'var(--teal-mid)', fontWeight: 500, lineHeight: 1.55 }}>Your case summary includes your reference number, the timeline of what happens next, and instructions for the attorney call — everything you need in one place.</div>
            </div>
            <button className="btn-continue" onClick={continueFromEmail}>Continue →</button>
            <button className="skip-link" onClick={continueFromEmail}>Skip — I'll track my case online</button>
          </div>

          {/* s15 */}
          <div className={`screen ${curScreen === 's15' ? 'active' : ''}`} id="s15">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
                <div className="phase-dot"></div>
              </div>
            </div>
            <h1 className="q-headline">One last thing, <em>{fd.firstName || 'almost there'}</em>.</h1>
            <p className="q-sub">When is the best time for the attorney to call you?</p>
            <div className="pills-wrap">
              {['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–8pm)', 'Any time — just call'].map(opt => (
                <div
                  key={opt}
                  className={`pill-opt ${fd.preferredContactTime.includes(opt) ? 'selected' : ''}`}
                  onClick={() => {
                    if (opt === 'Any time — just call') {
                      updateForm({ preferredContactTime: ['Any time'] })
                    } else {
                      const times = fd.preferredContactTime.includes(opt)
                        ? fd.preferredContactTime.filter(t => t !== opt)
                        : [...fd.preferredContactTime, opt]
                      updateForm({ preferredContactTime: times })
                    }
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
            <button className="btn-continue" disabled={fd.preferredContactTime.length === 0} onClick={() => goTo('s16')}>Continue →</button>
          </div>

          {/* s16 */}
          <div className={`screen ${curScreen === 's16' ? 'active' : ''}`} id="s16">
            <div className="phase-label">
              <div className="phase-name">Just You</div>
              <div className="phase-dots">
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot done"></div>
                <div className="phase-dot active"></div>
              </div>
            </div>
            <h1 className="q-headline">Almost done, <em>{fd.firstName || 'one last step'}</em>.</h1>
            <p className="q-sub">Your signature authorizes your attorney to request your medical records immediately — saving weeks of back-and-forth.</p>
            <div className="hipaa-card">
              <div className="hipaa-card-kicker">Medical Records Authorization (HIPAA)</div>
              <p className="hipaa-body">By signing below, you authorize CasePort and any assigned attorney from our network to obtain your medical records related to this injury for the sole purpose of evaluating your personal injury case. This authorization expires 90 days from today or upon case assignment, whichever comes first. You may revoke this in writing at any time.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(26,61,64,.07)', border: '1px solid rgba(26,61,64,.18)', borderRadius: 'var(--r)' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔐</span>
              <p style={{ fontSize: 13, color: 'var(--teal-mid)', fontWeight: 500, lineHeight: 1.5 }}>Every CasePort case file includes this authorization — it's how your attorney can start immediately, without any extra steps from you.</p>
            </div>
            <div className="sig-section">
              <div className="sig-header">
                <label className="input-label">Your signature</label>
                <button className="sig-toggle" onClick={() => setSigMode(sigMode === 'draw' ? 'type' : 'draw')}>
                  {sigMode === 'draw' ? 'Type instead' : 'Draw instead'}
                </button>
              </div>
              {sigMode === 'draw' ? (
                <div className="sig-draw-wrap" style={{ position: 'relative' }}>
                  <canvas
                    ref={sigCanvasRef}
                    className="sig-canvas"
                    style={{ width: '100%', height: 140 }}
                    onMouseDown={handleSigStart}
                    onMouseMove={handleSigMove}
                    onMouseUp={handleSigEnd}
                    onMouseLeave={handleSigEnd}
                    onTouchStart={(e) => { e.preventDefault(); handleSigStart(e) }}
                    onTouchMove={(e) => { e.preventDefault(); handleSigMove(e) }}
                    onTouchEnd={handleSigEnd}
                  />
                  <span className={`sig-canvas-hint ${hasSig ? 'hidden' : ''}`} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 13, color: 'var(--muted)', pointerEvents: 'none' }}>Sign here with your finger or mouse</span>
                  <button className={`sig-clear-btn ${hasSig ? 'visible' : ''}`} onClick={clearSig}>Clear</button>
                </div>
              ) : (
                <div className="sig-type-wrap">
                  <input
                    className="form-input"
                    type="text"
                    id="sigTypeInput"
                    placeholder="Type your full legal name"
                    value={sigTyped}
                    onChange={(e) => {
                      setSigTyped(e.target.value)
                      setHasSig(e.target.value.trim().length >= 2)
                    }}
                    autoComplete="name"
                  />
                  <div className={`sig-typed-preview ${sigTyped ? 'has-content' : ''}`}>
                    {sigTyped || <span className="sig-placeholder">Your signature will appear here</span>}
                  </div>
                </div>
              )}
              <div className={`sig-status ${hasSig ? 'visible' : ''}`}>✓ Signature captured</div>
              <div className="field-error" id="sigErr" style={{ color: 'var(--terra)' }}></div>
            </div>
            <div className="consent-block">
              <p className="consent-text">By submitting this form, you understand that CasePort is not a law firm and cannot give you legal advice. You are agreeing to be contacted by a licensed personal injury attorney in our network regarding your case. You consent to receive automated calls, pre-recorded messages, and text messages from CasePort and its network partners at the number provided. Consent is not required as a condition of any service.</p>
              <div className="consent-row">
                <input type="checkbox" id="consentChk" onChange={(e) => setConsent(e.target.checked)} />
                <label htmlFor="consentChk">I understand and agree to the terms above</label>
              </div>
            </div>
            <button className="btn-continue" id="submitBtn" disabled={!hasSig || !consent} onClick={submitForm}>Complete My Case Review →</button>
            <p className="micro">🔒 Your signature and all data are encrypted. We will never sell your information.</p>
          </div>

          {/* CONFIRMATION */}
          <div className={`confirm-screen ${curScreen === 's-confirm' ? 'active' : ''}`} id="s-confirm">
            <div className="confirm-hero">
              <div className="radar-wrap">
                <div className="radar-ring"></div>
                <div className="radar-ring"></div>
                <div className="radar-ring"></div>
                <div className="radar-core">⚡</div>
              </div>
              <h1 className="confirm-headline">Your case is in motion.</h1>
              <p className="confirm-sub">{fd.firstName ? <><strong>{fd.firstName}</strong>, your</> : 'Your'} case file has been received and a firm in your area is reviewing it now.</p>
              <div className="countdown-wrap">
                <div>
                  <div className="countdown-label">Attorney contact within</div>
                  <div className="countdown-live"><span className="live-dot"></span> Live</div>
                </div>
                <div className="countdown-timer" style={{ fontSize: countdownSecs === 0 ? 22 : 32 }}>{countdownDisplay}</div>
              </div>
            </div>

            <div className="protect-card">
              <div className="protect-kicker">Your protection plan</div>
              <div className="protect-title">A few things that protect you, starting today</div>
              <div className="protect-sub">You walked in with questions. Here is what to do while your file is reviewed. These are practical steps, not a case assessment.</div>
              {[
                { icon: '🗓️', text: <><strong>Keep every medical appointment.</strong> Gaps in care are the most common reason an injury is undervalued later.</> },
                { icon: '🤐', text: <><strong>Do not post about the accident.</strong> Not the crash, not your injuries, not how you feel. Assume anything public can be seen later.</> },
                { icon: '📷', text: <><strong>Photograph any bruising again in two days.</strong> Injuries often develop and look worse over time. Dated photos help.</> },
                { icon: '📞', text: <><strong>If an insurance adjuster calls, you can say:</strong> "I am not ready to give a statement. Please contact my attorney." You do not have to say more.</> },
              ].map((item, i) => (
                <div key={i} className="protect-item" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
                  <div className="protect-icon">{item.icon}</div>
                  <div className="protect-text">{item.text}</div>
                </div>
              ))}
            </div>

            <div className="info-card">
              <div className="info-card-kicker">What happens next</div>
              <div className="timeline">
                <div className="tl-step">
                  <div className="tl-icon done">✓</div>
                  <div className="tl-body">
                    <div className="tl-title">Case review submitted</div>
                    <div className="tl-desc">Your information is encrypted and your file is open.</div>
                  </div>
                </div>
                <div className="tl-step">
                  <div className="tl-icon done">✓</div>
                  <div className="tl-body">
                    <div className="tl-title">Medical authorization secured</div>
                    <div className="tl-desc">Your attorney can request records immediately — no extra steps from you.</div>
                  </div>
                </div>
                <div className="tl-step">
                  <div className="tl-icon active">🔍</div>
                  <div className="tl-body">
                    <div className="tl-title">Reviewing your case now</div>
                    <div className="tl-desc">The firm that serves your area is being notified about your case.</div>
                    <div className="tl-badge">⚡ <span>Within 30 minutes</span></div>
                  </div>
                </div>
                <div className="tl-step">
                  <div className="tl-icon pending">📞</div>
                  <div className="tl-body">
                    <div className="tl-title">Attorney contacts you directly</div>
                    <div className="tl-desc">They'll call from a local number — their name will appear in a text message so you know who's calling. Keep your phone nearby. Free, no obligation.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ref-block">
              <div className="ref-left">
                <div className="ref-label">Your reference number</div>
                <div className="ref-num" id="refNum">{fd.submissionId || '—'}</div>
              </div>
              <button className="ref-copy" onClick={() => navigator.clipboard.writeText(fd.submissionId || '')}>Copy</button>
            </div>

            <div className="upload-section">
              <div className="upload-boost">⬆ Helps your attorney move faster</div>
              <div className="upload-kicker">Optional — but it helps</div>
              <h3 className="upload-headline">Strengthen your file while you wait.</h3>
              <p className="upload-body">Cases with documentation move faster. Upload photos, police reports, medical receipts, or insurance letters.</p>

              {/* Guided, shot by shot documentation (AGENTS.md Section 4.1). Every
                 direction is guarded server side: procedural photographic
                 direction only, never a case assessment. */}
              <EvidenceCoach onFiles={(files) => setUploadedFiles(prev => [...prev, ...files])} />

              <div
                className="upload-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <span className="upload-zone-icon">📁</span>
                <p className="upload-zone-text"><strong>Tap to upload</strong> or drag files here</p>
                <p className="upload-zone-text" style={{ fontSize: 12, marginTop: 4 }}>Photos, PDFs, documents — any format</p>
              </div>
              <input type="file" id="fileInput" className="upload-input" multiple accept="image/*,.pdf,.doc,.docx" onChange={(e) => {
                const files = Array.from(e.target.files || [])
                setUploadedFiles(prev => [...prev, ...files])
              }} />
              {uploadedFiles.length > 0 && (
                <div className="upload-files">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="upload-file-item">
                      <span className="upload-file-name">📄 {f.name}</span>
                      <button className="upload-file-remove" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <button className="upload-skip">Skip for now — I'll add documents later</button>
            </div>

            <div className="wait-section">
              <div className="wait-kicker">While you wait</div>
              <div className="wait-items">
                <div className="wait-item">
                  <div className="wait-num">1</div>
                  <div><strong>Keep attending all medical appointments.</strong> Every visit creates documentation that strengthens your case.</div>
                </div>
                <div className="wait-item">
                  <div className="wait-num">2</div>
                  <div><strong>Do not speak to the other party's insurance without legal advice.</strong> Adjusters are trained to minimize your payout. Wait until you've spoken to your attorney.</div>
                </div>
                <div className="wait-item">
                  <div className="wait-num">3</div>
                  <div><strong>Save everything.</strong> Bills, photos, insurance letters, texts. Anything related to the accident.</div>
                </div>
              </div>
            </div>
            <p className="micro">Symptoms often appear 24–72 hours after an accident. If things change, you can always return and update your file.</p>
          </div>

          {/* Off-ramp screens */}
          <div className={`screen ${curScreen === 's-off' ? 'active' : ''}`} id="s-off">
            <span className="screen-icon">🤝</span>
            <h1 className="q-headline">Based on what you've shared, we may not be the right fit right now.</h1>
            <p className="q-sub">That doesn't mean you don't have options. These CasePort resources may help.</p>
            <div className="info-card">
              <p className="info-card-body">Symptoms often appear 24–72 hours after an accident. If your situation changes, enter your email and we'll send you information on next steps.</p>
            </div>
          </div>

          <div className={`screen ${curScreen === 's-off-atty' ? 'active' : ''}`} id="s-off-atty">
            <span className="screen-icon">⚖️</span>
            <div className="info-card">
              <div className="info-card-kicker">Already represented</div>
              <h2 className="info-card-headline">It sounds like you're already in good hands.</h2>
              <p className="info-card-body">Since you have legal representation, we're not able to assist at this stage. Your attorney is the right person to speak with.</p>
            </div>
          </div>

          <div className={`screen ${curScreen === 's-off-settled' ? 'active' : ''}`} id="s-off-settled">
            <span className="screen-icon">📝</span>
            <div className="info-card">
              <div className="info-card-kicker">We want to make sure you get the right guidance</div>
              <h2 className="info-card-headline">We recommend speaking with an attorney directly.</h2>
              <p className="info-card-body">If you've signed a settlement or release, your claim may have already been resolved. An attorney can confirm whether any options remain — at no cost to you in a free consultation.</p>
            </div>
          </div>

        </div>
      </div>

      <div className="sticky-phone" id="stickyPhone" style={{ display: isTerminal(curScreen) ? 'none' : 'flex' }}>
        <div className="sticky-trust">
          <span>🔒 Private</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>No cost to you</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span>ABA compliant</span>
        </div>
        <div className="sticky-phone-link">
          <a href="tel:+18002273669">📞 1-800-CASE-NOW</a>
        </div>
      </div>
    </>
  )
}