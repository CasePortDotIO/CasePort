import { useParams } from "wouter";
import { ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface GuideContent {
  id: string;
  title: string;
  description: string;
  readTime: string;
  author: string;
  publishDate: string;
  updateDate: string;
  sections: {
    title: string;
    content: string;
    subsections?: {
      title: string;
      content: string;
    }[];
  }[];
  keyTakeaways: string[];
  faq: {
    question: string;
    answer: string;
  }[];
  cta: {
    heading: string;
    description: string;
    buttonText: string;
  };
}

const guideContent: Record<string, GuideContent> = {
  "statute-of-limitations-by-state": {
    id: "statute-of-limitations",
    title: "Personal Injury Statute of Limitations by State (2026)",
    description: "Complete state-by-state breakdown of filing deadlines, exceptions, and tolling rules. Know your deadline.",
    readTime: "12 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-01-15",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "What is the Statute of Limitations?",
        content: "The statute of limitations is the legal deadline to file a lawsuit. Miss this deadline and you lose your right to sue forever, regardless of how strong your case is. Each state sets its own statute of limitations for personal injury cases. Most states allow 2-3 years, but some allow only 1 year, while others allow 4-6 years.",
        subsections: [
          {
            title: "Why Does It Matter?",
            content: "The statute of limitations is one of the most critical deadlines in personal injury law. Once it expires, you cannot file a lawsuit, and you cannot recover any compensation. Insurance companies know this and often delay settlement negotiations hoping you'll miss your deadline."
          }
        ]
      },
      {
        title: "State-by-State Statute of Limitations",
        content: "Here is a comprehensive breakdown of statute of limitations by state for personal injury cases:\n\nAlabama: 2 years\nAlaska: 2 years\nArizona: 2 years\nArkansas: 3 years\nCalifornia: 2 years\nColorado: 2 years\nConnecticut: 3 years\nDelaware: 2 years\nFlorida: 4 years\nGeorgia: 2 years\nHawaii: 2 years\nIdaho: 2 years\nIllinois: 2 years\nIndiana: 2 years\nIowa: 2 years\nKansas: 2 years\nKentucky: 1 year\nLouisiana: 1 year\nMaine: 6 years\nMaryland: 3 years\nMassachusetts: 3 years\nMichigan: 3 years\nMinnesota: 2 years\nMississippi: 3 years\nMissouri: 5 years\nMontana: 3 years\nNebraska: 4 years\nNevada: 2 years\nNew Hampshire: 3 years\nNew Jersey: 2 years\nNew Mexico: 3 years\nNew York: 3 years\nNorth Carolina: 3 years\nNorth Dakota: 2 years\nOhio: 2 years\nOklahoma: 2 years\nOregon: 2 years\nPennsylvania: 2 years\nRhode Island: 3 years\nSouth Carolina: 3 years\nSouth Dakota: 2 years\nTennessee: 1 year\nTexas: 2 years\nUtah: 4 years\nVermont: 3 years\nVirginia: 2 years\nWashington: 3 years\nWest Virginia: 2 years\nWisconsin: 3 years\nWyoming: 4 years",
        subsections: [
          {
            title: "Note on Variations",
            content: "Some states have different statutes of limitations for different types of personal injury cases. For example, medical malpractice may have a different deadline than car accidents. Always check your specific state and injury type."
          }
        ]
      },
      {
        title: "Tolling: Exceptions to the Statute of Limitations",
        content: "Tolling is a legal doctrine that pauses or extends the statute of limitations in certain circumstances. Common tolling exceptions include:\n\n1. Minority: If the injured person is under 18, the statute of limitations may not begin until they turn 18.\n2. Mental Incapacity: If the injured person is mentally incapacitated, the statute may be extended.\n3. Absence from State: If the defendant is not in the state, the statute may be tolled.\n4. Discovery Rule: In some cases (like medical malpractice), the statute begins when the injury is discovered, not when it occurred.",
        subsections: [
          {
            title: "Why Tolling Matters",
            content: "Tolling can significantly extend your filing deadline. However, tolling rules are complex and vary by state. If you believe tolling applies to your case, consult with an attorney immediately."
          }
        ]
      },
      {
        title: "What Happens If You Miss the Deadline?",
        content: "If you miss the statute of limitations deadline, your case is barred. This means:\n\n1. You cannot file a lawsuit\n2. The defendant can file a motion to dismiss based on the statute of limitations\n3. You lose your right to recover any compensation\n4. You have no legal recourse\n\nMissing this deadline is permanent and irreversible. This is why acting quickly is critical.",
        subsections: [
          {
            title: "The Insurance Company Strategy",
            content: "Insurance companies know that many accident victims miss their statute of limitations deadline. They often delay settlement negotiations, hoping you'll give up or miss your deadline. Don't fall for this strategy. Consult with an attorney early to protect your rights."
          }
        ]
      },
      {
        title: "How to Protect Yourself",
        content: "To protect your legal rights:\n\n1. Know your state's statute of limitations immediately\n2. Mark your deadline on a calendar\n3. Consult with a personal injury attorney as soon as possible\n4. Do not rely on insurance companies to remind you of your deadline\n5. Document everything related to your injury\n6. Preserve all evidence\n\nThe sooner you act, the better protected you are."
      }
    ],
    keyTakeaways: [
      "Most states allow 2-3 years to file a personal injury lawsuit",
      "Some states allow only 1 year (Kentucky, Louisiana, Tennessee)",
      "A few states allow 4-6 years (Maine, Missouri, Nebraska, Utah, Wyoming)",
      "Missing your deadline means you lose your right to sue forever",
      "Tolling exceptions may extend your deadline in certain circumstances",
      "Consult with an attorney immediately to protect your rights"
    ],
    faq: [
      {
        question: "What is the statute of limitations in my state?",
        answer: "The statute of limitations varies by state. Most states allow 2-3 years, but some allow 1 year and others allow 4-6 years. Check the state-by-state breakdown in this guide or consult with an attorney."
      },
      {
        question: "Does the statute of limitations start when the accident happens or when I discover the injury?",
        answer: "Generally, the statute of limitations starts when the accident happens. However, in some cases (like medical malpractice), it may start when the injury is discovered. This is called the 'discovery rule.' Consult with an attorney to understand how this applies to your case."
      },
      {
        question: "Can the statute of limitations be extended?",
        answer: "Yes, in certain circumstances called 'tolling.' Tolling can pause or extend the statute of limitations if the injured person is a minor, mentally incapacitated, or if the defendant is absent from the state. Tolling rules are complex and vary by state."
      },
      {
        question: "What happens if I miss the statute of limitations deadline?",
        answer: "If you miss the deadline, your case is barred. You cannot file a lawsuit, and you lose your right to recover any compensation. This is permanent and irreversible."
      }
    ],
    cta: {
      heading: "Don't Miss Your Deadline",
      description: "The statute of limitations is one of the most critical deadlines in personal injury law. If you've been injured, consult with a qualified attorney immediately to protect your rights.",
      buttonText: "Get Free Case Review"
    }
  },

  "what-not-to-say-to-insurance": {
    id: "what-not-to-say",
    title: "What Not to Say to Insurance After an Accident",
    description: "Avoid these 7 critical mistakes that insurance companies use to deny or reduce your claim.",
    readTime: "8 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-02-10",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "Why Your Words Matter",
        content: "After an accident, everything you say to the insurance company can be used against you. Insurance adjusters are trained to identify statements that reduce your claim value. A single poorly-worded sentence can cost you thousands of dollars in compensation.",
        subsections: [
          {
            title: "The Insurance Company's Goal",
            content: "Insurance companies profit by paying out less money. They are not your friend. Every word you say is recorded, documented, and analyzed to find reasons to deny or reduce your claim."
          }
        ]
      },
      {
        title: "The 7 Mistakes to Avoid",
        content: "Here are the 7 most critical mistakes to avoid when talking to insurance companies:",
        subsections: [
          {
            title: "Mistake #1: Admitting Fault",
            content: "Never say 'I'm sorry,' 'It was my fault,' or 'I should have been more careful.' Even if you think you were partially at fault, admitting fault can destroy your claim. Let the insurance company and courts determine fault based on evidence."
          },
          {
            title: "Mistake #2: Downplaying Your Injuries",
            content: "Never say 'I'm fine,' 'It's not that bad,' or 'I don't think I need medical attention.' Injuries often develop over days or weeks. What seems minor at first can become serious. Always seek medical attention and never minimize your injuries."
          },
          {
            title: "Mistake #3: Giving a Recorded Statement Without an Attorney",
            content: "Never agree to a recorded statement without consulting an attorney first. Insurance adjusters use recorded statements to lock you into a story. Once recorded, you cannot change your statement later. Politely decline and say 'I'll have my attorney contact you.'"
          },
          {
            title: "Mistake #4: Posting on Social Media",
            content: "Never post about your accident, injuries, or settlement on social media. Insurance companies monitor social media. A photo of you at a restaurant can be used to argue your injuries aren't as severe as claimed. Keep your case private."
          },
          {
            title: "Mistake #5: Accepting the First Offer",
            content: "Never accept the insurance company's first settlement offer. First offers are typically 30-50% below what your case is actually worth. Always consult with an attorney before accepting any offer."
          },
          {
            title: "Mistake #6: Discussing Your Case with Others",
            content: "Never discuss your case details with friends, family, or coworkers. What you say can get back to the insurance company. Keep your case confidential and only discuss it with your attorney."
          },
          {
            title: "Mistake #7: Signing Documents Without Reading Them",
            content: "Never sign any document from the insurance company without reading it carefully or having an attorney review it. Some documents contain language that limits your rights or releases the insurance company from liability."
          }
        ]
      },
      {
        title: "What You Should Do Instead",
        content: "Here's the right approach:\n\n1. Seek immediate medical attention\n2. Document the scene with photos and videos\n3. Get witness contact information\n4. Report the accident to police\n5. Contact a personal injury attorney\n6. Let your attorney handle all communication with insurance\n7. Do not discuss your case publicly\n8. Do not post on social media\n9. Keep all medical records and documentation\n10. Do not accept any settlement without attorney review"
      }
    ],
    keyTakeaways: [
      "Never admit fault, even if you think you were partially responsible",
      "Never downplay your injuries or say you're fine",
      "Never give a recorded statement without an attorney present",
      "Never post about your accident or injuries on social media",
      "Never accept the first settlement offer",
      "Never discuss your case with anyone except your attorney",
      "Never sign documents without reading them or having them reviewed"
    ],
    faq: [
      {
        question: "What should I do immediately after an accident?",
        answer: "Seek medical attention, document the scene, get witness information, report to police, and contact a personal injury attorney. Do not communicate with the insurance company until you've consulted with an attorney."
      },
      {
        question: "Can I talk to the insurance company without an attorney?",
        answer: "You can, but you shouldn't. Insurance adjusters are trained to identify statements that reduce your claim value. Every word you say can be used against you. Let your attorney handle all communication with insurance."
      },
      {
        question: "What if I already made a mistake and admitted fault?",
        answer: "Consult with an attorney immediately. Depending on what you said and when you said it, an attorney may be able to mitigate the damage or challenge the insurance company's interpretation of your statement."
      },
      {
        question: "Is the insurance company's first offer usually fair?",
        answer: "No. First offers are typically 30-50% below what your case is actually worth. Always consult with an attorney before accepting any settlement offer."
      }
    ],
    cta: {
      heading: "Protect Your Rights",
      description: "Don't let the insurance company take advantage of you. Consult with a qualified personal injury attorney to ensure you receive fair compensation.",
      buttonText: "Get Free Case Review"
    }
  },

  "what-to-do-after-a-car-accident": {
    id: "what-to-do-car-accident",
    title: "What to Do After a Car Accident",
    description: "Protect your health, evidence, and legal rights in the first 72 hours. What to photograph, document, and say.",
    readTime: "10 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-03-05",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "The First 72 Hours Are Critical",
        content: "The first 72 hours after a car accident are the most important. During this time, evidence is fresh, witnesses are available, and your memory is clear. What you do (or don't do) in these 72 hours can determine the outcome of your case.",
        subsections: [
          {
            title: "Why 72 Hours?",
            content: "Traffic camera footage is typically deleted after 72 hours. Witnesses may leave town or forget details. Medical symptoms may develop. Acting quickly protects your evidence, your health, and your legal rights."
          }
        ]
      },
      {
        title: "Immediate Actions (First Hour)",
        content: "If you're safe and able to move:\n\n1. Move to a safe location if possible\n2. Turn on hazard lights\n3. Call 911 if anyone is injured\n4. Report the accident to police (required in most states)\n5. Exchange information with the other driver (name, phone, address, insurance)\n6. Get the other driver's license plate number and vehicle description\n7. Do not admit fault or apologize\n8. Do not discuss the accident in detail\n9. Take photos of the accident scene, vehicle damage, and injuries\n10. Get witness contact information",
        subsections: [
          {
            title: "What Information to Collect",
            content: "Collect the following from the other driver: Full name, phone number, home address, driver's license number, vehicle make/model/year, license plate number, insurance company name, insurance policy number."
          }
        ]
      },
      {
        title: "Documentation (First 24 Hours)",
        content: "Document everything while details are fresh:\n\n1. Take photos of vehicle damage from multiple angles\n2. Take photos of the accident scene (road conditions, traffic signs, skid marks)\n3. Take photos of any visible injuries\n4. Write down what happened (date, time, location, weather, road conditions)\n5. Write down the other driver's statements (if any)\n6. Write down witness statements\n7. Keep all receipts for medical treatment, repairs, rental cars\n8. Keep a journal of your pain, symptoms, and recovery\n9. Do not post anything on social media\n10. Do not discuss the accident publicly",
        subsections: [
          {
            title: "Why Documentation Matters",
            content: "Documentation is evidence. The more detailed your documentation, the stronger your case. Photos, written statements, and witness information are critical to proving liability and damages."
          }
        ]
      },
      {
        title: "Medical Attention (First 72 Hours)",
        content: "Seek medical attention immediately, even if you feel fine:\n\n1. Go to the emergency room or urgent care\n2. Tell the doctor about all symptoms (pain, dizziness, numbness)\n3. Get a full medical evaluation\n4. Keep all medical records and receipts\n5. Follow all medical treatment recommendations\n6. Do not skip follow-up appointments\n7. Keep a journal of your symptoms and recovery\n8. Some injuries (like whiplash) develop over days or weeks\n9. Medical records are critical evidence of your injuries\n10. Do not delay medical treatment",
        subsections: [
          {
            title: "Why Immediate Medical Attention Is Critical",
            content: "Insurance companies often argue that if you didn't seek immediate medical attention, your injuries weren't serious. Immediate medical documentation strengthens your claim."
          }
        ]
      },
      {
        title: "Legal Protection (First Week)",
        content: "Protect your legal rights:\n\n1. Consult with a personal injury attorney\n2. Do not give a recorded statement to insurance without attorney present\n3. Do not accept any settlement offer without attorney review\n4. Do not sign any documents without attorney review\n5. Let your attorney handle all communication with insurance\n6. Do not post about the accident on social media\n7. Do not discuss the accident with anyone except your attorney\n8. Keep all medical records, receipts, and documentation\n9. Do not delete any text messages, emails, or photos\n10. Do not communicate with the other driver or their attorney",
        subsections: [
          {
            title: "Why Attorney Consultation Matters",
            content: "An attorney can protect your rights, negotiate with insurance, and maximize your settlement. Most personal injury attorneys work on contingency, meaning you only pay if you win."
          }
        ]
      }
    ],
    keyTakeaways: [
      "The first 72 hours are critical for evidence preservation",
      "Seek medical attention immediately, even if you feel fine",
      "Document everything: photos, witness information, medical records",
      "Do not admit fault or apologize",
      "Do not give a recorded statement without an attorney",
      "Do not post about the accident on social media",
      "Consult with a personal injury attorney as soon as possible"
    ],
    faq: [
      {
        question: "Do I need to call the police after a car accident?",
        answer: "In most states, yes. If there are injuries or significant property damage, you're required to report the accident to police. Even if not required, a police report creates an official record that can help your case."
      },
      {
        question: "What if the other driver doesn't have insurance?",
        answer: "You may be able to recover through your own uninsured motorist coverage. Consult with an attorney to understand your options."
      },
      {
        question: "Should I accept the insurance company's first offer?",
        answer: "No. First offers are typically 30-50% below what your case is actually worth. Always consult with an attorney before accepting any settlement."
      },
      {
        question: "What if I don't remember all the details?",
        answer: "That's normal. Write down what you do remember while it's fresh. Your attorney can help reconstruct the accident using police reports, witness statements, and physical evidence."
      }
    ],
    cta: {
      heading: "Get Help Today",
      description: "If you've been in a car accident, consult with a qualified personal injury attorney to protect your rights and maximize your compensation.",
      buttonText: "Get Free Case Review"
    }
  },

  "medical-records-personal-injury-claim": {
    id: "medical-records",
    title: "Medical Records and Your Personal Injury Claim",
    description: "How to obtain, organize, and use medical evidence to maximize your settlement.",
    readTime: "12 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-04-12",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "Why Medical Records Are Critical",
        content: "Medical records are the foundation of your personal injury claim. They document your injuries, treatment, and recovery. Insurance companies use medical records to determine settlement value. The more detailed and comprehensive your medical records, the higher your settlement.",
        subsections: [
          {
            title: "What Insurance Companies Look For",
            content: "Insurance companies analyze medical records to determine: (1) Severity of injury, (2) Type of treatment received, (3) Duration of treatment, (4) Prognosis for recovery, (5) Permanent disability or scarring."
          }
        ]
      },
      {
        title: "How to Obtain Your Medical Records",
        content: "To obtain your medical records:\n\n1. Contact each healthcare provider (hospital, doctor, physical therapist)\n2. Request records in writing (email or certified mail)\n3. Provide your name, date of birth, and date of service\n4. Specify which records you need (all records or specific dates)\n5. Ask about fees (usually $0.50-$1.00 per page)\n6. Request expedited delivery if needed\n7. Keep copies of all requests and responses\n8. Organize records chronologically\n9. Create a summary of treatment dates and providers\n10. Share with your attorney",
        subsections: [
          {
            title: "Timeline for Obtaining Records",
            content: "Most healthcare providers must provide records within 30 days. Some may take longer. Start requesting records immediately after your accident."
          }
        ]
      },
      {
        title: "Organizing Your Medical Records",
        content: "Organize your records chronologically:\n\n1. Emergency room visit (date, diagnosis, treatment)\n2. Follow-up doctor visits (dates, diagnoses, treatment recommendations)\n3. Physical therapy (dates, sessions, progress)\n4. Imaging studies (X-rays, MRIs, CT scans)\n5. Lab results (blood work, drug tests)\n6. Prescriptions and medications\n7. Medical bills and receipts\n8. Insurance explanations of benefits (EOBs)\n9. Disability documentation (if applicable)\n10. Correspondence with healthcare providers",
        subsections: [
          {
            title: "Why Organization Matters",
            content: "Organized medical records make it easy for your attorney to understand your case and present it to insurance companies or courts."
          }
        ]
      },
      {
        title: "Using Medical Records in Your Claim",
        content: "Your medical records are used to:\n\n1. Prove you were injured\n2. Prove the injury was caused by the accident\n3. Establish the severity of your injury\n4. Justify the cost of treatment\n5. Support a claim for pain and suffering\n6. Support a claim for lost wages\n7. Support a claim for permanent disability\n8. Negotiate with insurance companies\n9. Present your case to a jury (if needed)\n10. Maximize your settlement",
        subsections: [
          {
            title: "What Medical Records Show Insurance Companies",
            content: "Medical records show: (1) You sought treatment promptly, (2) Your injuries were serious enough to require professional treatment, (3) You followed medical recommendations, (4) Your recovery took time and resources."
          }
        ]
      }
    ],
    keyTakeaways: [
      "Medical records are the foundation of your personal injury claim",
      "Obtain records from all healthcare providers immediately",
      "Organize records chronologically for easy reference",
      "Medical records prove injury severity and justify treatment costs",
      "Follow all medical recommendations and attend all appointments",
      "Keep copies of all medical bills and insurance documentation"
    ],
    faq: [
      {
        question: "How do I get my medical records?",
        answer: "Contact each healthcare provider and request records in writing. Provide your name, date of birth, and dates of service. Most providers must provide records within 30 days."
      },
      {
        question: "How much do medical records cost?",
        answer: "Usually $0.50-$1.00 per page. Some providers may charge more. Ask about fees when you request records."
      },
      {
        question: "What if I don't have medical records?",
        answer: "If you didn't seek medical treatment, your claim is significantly weakened. Insurance companies often argue that if you didn't seek treatment, your injuries weren't serious. Always seek medical attention after an accident."
      },
      {
        question: "Can I use medical records from before my accident?",
        answer: "Yes, but carefully. Pre-existing conditions can reduce your settlement. Your attorney can help explain how pre-existing conditions are treated in your case."
      }
    ],
    cta: {
      heading: "Build a Strong Case",
      description: "Medical records are critical evidence. Consult with an attorney to ensure your medical records are properly documented and used to maximize your settlement.",
      buttonText: "Get Free Case Review"
    }
  },

  "comparative-negligence-explained": {
    id: "comparative-negligence",
    title: "Comparative Negligence Explained in Plain Language",
    description: "Understand how fault is calculated and how it affects your settlement in your state.",
    readTime: "9 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-05-08",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "What Is Comparative Negligence?",
        content: "Comparative negligence is a legal rule that determines how fault is divided between parties in an accident. If both parties are partially at fault, the law divides liability based on each party's percentage of fault. Your settlement is reduced by your percentage of fault.",
        subsections: [
          {
            title: "Example",
            content: "If you're 20% at fault and the other driver is 80% at fault, and your damages are $100,000, your settlement would be $80,000 (reduced by your 20% fault)."
          }
        ]
      },
      {
        title: "Pure Comparative Negligence vs. Modified Comparative Negligence",
        content: "States use different comparative negligence rules:\n\nPure Comparative Negligence: You can recover even if you're 99% at fault. Your settlement is reduced by your percentage of fault.\n\nModified Comparative Negligence (50% Bar Rule): You can only recover if you're 50% or less at fault. If you're more than 50% at fault, you cannot recover anything.\n\nModified Comparative Negligence (51% Bar Rule): You can only recover if you're 50% or less at fault. If you're 51% or more at fault, you cannot recover anything.",
        subsections: [
          {
            title: "Which Rule Applies in Your State?",
            content: "Different states use different rules. Some use pure comparative negligence, others use the 50% bar rule, and others use the 51% bar rule. Your attorney can tell you which rule applies in your state."
          }
        ]
      },
      {
        title: "How Fault Is Determined",
        content: "Fault is determined by analyzing:\n\n1. Police report\n2. Witness statements\n3. Physical evidence (skid marks, vehicle damage)\n4. Traffic laws and regulations\n5. Expert testimony (accident reconstruction)\n6. Driver statements\n7. Video footage (traffic cameras, dashcams)\n8. Medical records (showing injury causation)\n9. Prior accidents or violations\n10. Insurance company investigation",
        subsections: [
          {
            title: "Why Fault Matters",
            content: "Fault determines your settlement amount. The lower your percentage of fault, the higher your settlement."
          }
        ]
      },
      {
        title: "How to Minimize Your Fault",
        content: "To minimize your percentage of fault:\n\n1. Do not admit fault at the accident scene\n2. Gather witness statements\n3. Take photos of the accident scene\n4. Preserve all evidence\n5. Consult with an attorney immediately\n6. Let your attorney handle negotiations\n7. Challenge the insurance company's fault determination\n8. Hire an accident reconstruction expert if needed\n9. Gather expert testimony\n10. Present a strong case to insurance or court"
      }
    ],
    keyTakeaways: [
      "Comparative negligence divides fault between parties",
      "Your settlement is reduced by your percentage of fault",
      "Pure comparative negligence allows recovery even if you're mostly at fault",
      "Modified comparative negligence (50% or 51% bar) limits recovery",
      "Different states use different comparative negligence rules",
      "Fault is determined by police reports, evidence, and expert testimony"
    ],
    faq: [
      {
        question: "What is my state's comparative negligence rule?",
        answer: "Different states use different rules. Some use pure comparative negligence, others use the 50% bar rule, and others use the 51% bar rule. Consult with an attorney to learn your state's rule."
      },
      {
        question: "Can I still recover if I'm partially at fault?",
        answer: "It depends on your state's rule. Under pure comparative negligence, yes. Under modified comparative negligence, only if you're 50% or less at fault (or 51% or less, depending on your state)."
      },
      {
        question: "How is my percentage of fault determined?",
        answer: "Fault is determined by analyzing police reports, witness statements, physical evidence, traffic laws, expert testimony, and video footage. Insurance companies make an initial determination, but you can challenge it."
      },
      {
        question: "What if I disagree with the insurance company's fault determination?",
        answer: "You can challenge it. Consult with an attorney who can gather evidence, hire experts, and present a counter-argument to the insurance company."
      }
    ],
    cta: {
      heading: "Understand Your Case",
      description: "Comparative negligence can significantly affect your settlement. Consult with an attorney to understand how fault is determined in your case and how to minimize your liability.",
      buttonText: "Get Free Case Review"
    }
  },

  "average-car-accident-settlement-amounts": {
    id: "settlement-amounts",
    title: "Average Car Accident Settlement Amounts",
    description: "What cases typically settle for by injury type and state. Data-backed ranges you can trust.",
    readTime: "11 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-06-14",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "What Determines Settlement Amount?",
        content: "Settlement amounts are determined by:\n\n1. Medical expenses (past and future)\n2. Lost wages\n3. Pain and suffering\n4. Permanent disability or scarring\n5. Loss of enjoyment of life\n6. Liability (percentage of fault)\n7. Insurance policy limits\n8. Attorney representation\n9. Strength of evidence\n10. Negotiation skills",
        subsections: [
          {
            title: "Why Ranges Vary",
            content: "Settlement amounts vary widely because each case is unique. Two similar accidents may settle for very different amounts depending on the factors above."
          }
        ]
      },
      {
        title: "Average Settlement Amounts by Injury Type",
        content: "Here are typical settlement ranges by injury type:\n\nMinor Injuries (soft tissue, minor cuts/bruises):\n- Average: $5,000-$25,000\n- Range: $1,000-$50,000\n\nModerate Injuries (fractures, significant soft tissue):\n- Average: $25,000-$100,000\n- Range: $10,000-$250,000\n\nSevere Injuries (permanent disability, scarring, multiple fractures):\n- Average: $100,000-$500,000\n- Range: $50,000-$1,000,000+\n\nCatastrophic Injuries (spinal cord injury, brain injury, amputation):\n- Average: $500,000-$2,000,000+\n- Range: $250,000-$5,000,000+",
        subsections: [
          {
            title: "Important Note",
            content: "These are averages. Your specific settlement depends on your unique circumstances. Some cases settle for much more, others for much less."
          }
        ]
      },
      {
        title: "Factors That Increase Settlement Amount",
        content: "Settlements are higher when:\n\n1. Liability is clear (other driver was obviously at fault)\n2. Medical expenses are high\n3. Lost wages are significant\n4. Injuries are permanent\n5. Pain and suffering is severe\n6. Multiple defendants are involved\n7. Insurance policy limits are high\n8. Evidence is strong\n9. Attorney representation is strong\n10. Case is ready for trial (insurance wants to avoid jury trial)",
        subsections: [
          {
            title: "Why Attorney Representation Matters",
            content: "Cases with attorney representation settle for significantly more than cases without representation. Attorneys know how to value cases and negotiate effectively."
          }
        ]
      },
      {
        title: "Factors That Decrease Settlement Amount",
        content: "Settlements are lower when:\n\n1. Liability is unclear (shared fault)\n2. Medical expenses are low\n3. Lost wages are minimal\n4. Injuries are temporary\n5. Pain and suffering is minimal\n6. Insurance policy limits are low\n7. Evidence is weak\n8. Case is not ready for trial\n9. Injured person has pre-existing conditions\n10. Injured person delayed medical treatment"
      }
    ],
    keyTakeaways: [
      "Minor injuries typically settle for $5,000-$25,000",
      "Moderate injuries typically settle for $25,000-$100,000",
      "Severe injuries typically settle for $100,000-$500,000+",
      "Settlement amounts depend on medical expenses, lost wages, and pain/suffering",
      "Attorney representation significantly increases settlement amounts",
      "Clear liability and strong evidence increase settlements"
    ],
    faq: [
      {
        question: "What is a typical settlement for a car accident?",
        answer: "It depends on injury severity. Minor injuries settle for $5,000-$25,000. Moderate injuries settle for $25,000-$100,000. Severe injuries settle for $100,000+."
      },
      {
        question: "How do insurance companies calculate settlement amounts?",
        answer: "Insurance companies use formulas based on medical expenses, lost wages, and pain/suffering multipliers. They typically offer 30-50% below what cases are actually worth."
      },
      {
        question: "Should I accept the first settlement offer?",
        answer: "No. First offers are typically 30-50% below what your case is actually worth. Always consult with an attorney before accepting any offer."
      },
      {
        question: "Does having an attorney increase my settlement?",
        answer: "Yes. Cases with attorney representation settle for significantly more than cases without representation. Attorneys know how to value cases and negotiate effectively."
      }
    ],
    cta: {
      heading: "Get Maximum Compensation",
      description: "Don't settle for less than your case is worth. Consult with a qualified personal injury attorney to understand your case value and maximize your settlement.",
      buttonText: "Get Free Case Review"
    }
  },

  "how-personal-injury-cases-work": {
    id: "how-cases-work",
    title: "How Personal Injury Cases Work",
    description: "From investigation to settlement: the complete timeline and what to expect at each stage.",
    readTime: "15 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-07-20",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "The Personal Injury Case Timeline",
        content: "Personal injury cases typically follow this timeline:\n\nMonths 1-3: Investigation and evidence gathering\nMonths 3-6: Demand letter and initial negotiations\nMonths 6-12: Settlement negotiations\nMonths 12-24: Pre-trial discovery and motions\nMonths 24+: Trial (if settlement not reached)",
        subsections: [
          {
            title: "Why Timeline Varies",
            content: "Timelines vary based on case complexity, insurance company responsiveness, and court schedules. Some cases settle in 3 months, others take 2+ years."
          }
        ]
      },
      {
        title: "Phase 1: Investigation (Months 1-3)",
        content: "During investigation, your attorney:\n\n1. Reviews police reports\n2. Gathers medical records\n3. Interviews witnesses\n4. Photographs accident scene\n5. Analyzes evidence\n6. Consults with experts (if needed)\n7. Determines liability\n8. Calculates damages\n9. Researches comparable cases\n10. Prepares demand letter",
        subsections: [
          {
            title: "Your Role",
            content: "During investigation, you should: Provide all medical records, Provide all documentation, Answer attorney questions, Attend medical appointments, Keep a symptom journal, Do not post on social media, Do not communicate with insurance."
          }
        ]
      },
      {
        title: "Phase 2: Demand Letter (Months 3-6)",
        content: "Your attorney sends a demand letter to insurance that includes:\n\n1. Description of accident\n2. Liability analysis\n3. Medical records summary\n4. Damages calculation\n5. Demand for settlement amount\n6. Deadline for response\n7. Threat of lawsuit (if not settled)\n\nInsurance typically responds with a counter-offer within 30 days.",
        subsections: [
          {
            title: "What to Expect",
            content: "Insurance will likely offer 30-50% below your demand. This is normal. Negotiations typically take 2-3 rounds before settlement is reached."
          }
        ]
      },
      {
        title: "Phase 3: Settlement Negotiations (Months 6-12)",
        content: "During negotiations, your attorney and insurance exchange offers and counter-offers. This process typically involves:\n\n1. Initial demand letter\n2. Insurance counter-offer\n3. Your attorney's counter-counter-offer\n4. Multiple rounds of negotiation\n5. Settlement reached or lawsuit filed\n\nMost cases settle during this phase.",
        subsections: [
          {
            title: "Settlement Agreement",
            content: "When settlement is reached, you sign a settlement agreement that releases the other party from liability in exchange for payment."
          }
        ]
      },
      {
        title: "Phase 4: Pre-Trial (Months 12-24)",
        content: "If settlement is not reached, the case enters pre-trial phase:\n\n1. Lawsuit is filed\n2. Discovery begins (exchanging documents and evidence)\n3. Depositions are taken (sworn statements)\n4. Motions are filed\n5. Expert reports are exchanged\n6. Settlement conferences are held\n7. Trial date is set\n\nMost cases settle during pre-trial phase.",
        subsections: [
          {
            title: "What Is Discovery?",
            content: "Discovery is the process of exchanging documents, medical records, and evidence with the other party. Both sides must disclose all relevant information."
          }
        ]
      },
      {
        title: "Phase 5: Trial (Months 24+)",
        content: "If settlement is not reached, the case goes to trial:\n\n1. Jury selection\n2. Opening statements\n3. Plaintiff's case (your side)\n4. Defendant's case (other side)\n5. Closing arguments\n6. Jury deliberation\n7. Verdict\n8. Possible appeal\n\nTrials are rare. Most cases settle before trial.",
        subsections: [
          {
            title: "Why Trials Are Rare",
            content: "Trials are expensive, time-consuming, and unpredictable. Both sides prefer settlement to avoid trial risk."
          }
        ]
      }
    ],
    keyTakeaways: [
      "Personal injury cases typically take 6-18 months to settle",
      "Investigation phase (months 1-3): Gather evidence and determine liability",
      "Demand letter phase (months 3-6): Make settlement demand",
      "Negotiation phase (months 6-12): Exchange offers until settlement",
      "Pre-trial phase (months 12-24): Discovery, depositions, motions",
      "Trial phase (months 24+): Rare; most cases settle before trial"
    ],
    faq: [
      {
        question: "How long does a personal injury case take?",
        answer: "Most cases settle within 6-18 months. Some settle faster, others take 2+ years. Timeline depends on case complexity and insurance company responsiveness."
      },
      {
        question: "What happens if I don't settle?",
        answer: "If settlement is not reached, the case goes to trial. A jury hears both sides and decides the outcome. Trials are rare because both sides prefer settlement."
      },
      {
        question: "What is discovery?",
        answer: "Discovery is the process of exchanging documents, medical records, and evidence with the other party. Both sides must disclose all relevant information."
      },
      {
        question: "Will my case go to trial?",
        answer: "Probably not. Most personal injury cases settle before trial. Trials are expensive, time-consuming, and unpredictable, so both sides prefer settlement."
      }
    ],
    cta: {
      heading: "Understand Your Case",
      description: "Personal injury cases are complex. Consult with an attorney to understand the process and what to expect at each stage.",
      buttonText: "Get Free Case Review"
    }
  },

  "do-i-need-a-lawyer-after-a-car-accident": {
    id: "do-i-need-lawyer",
    title: "Do I Need a Lawyer After a Car Accident?",
    description: "When hiring an attorney makes financial sense. The math that insurance companies don't want you to see.",
    readTime: "7 min",
    author: "Personal Injury Attorneys at www.CasePort.io",
    publishDate: "2024-08-03",
    updateDate: "2026-04-23",
    sections: [
      {
        title: "The Short Answer: Probably Yes",
        content: "If you've been injured in a car accident, hiring an attorney almost always increases your settlement. Studies show that cases with attorney representation settle for 3-5x more than cases without representation. Even after paying attorney fees, you come out ahead.",
        subsections: [
          {
            title: "The Math",
            content: "Without attorney: $20,000 settlement\nWith attorney: $80,000 settlement (minus 33% contingency fee = $53,600)\nDifference: $33,600 more with attorney"
          }
        ]
      },
      {
        title: "When You Definitely Need an Attorney",
        content: "You definitely need an attorney if:\n\n1. You have significant injuries\n2. Medical expenses exceed $5,000\n3. Lost wages are significant\n4. Liability is unclear\n5. Multiple parties are involved\n6. Insurance company is difficult\n7. You're offered a low settlement\n8. You're not sure about your rights\n9. The other party has an attorney\n10. You want maximum compensation",
        subsections: [
          {
            title: "Most Cases Fit These Criteria",
            content: "If any of these apply to your case, hire an attorney. The increased settlement will more than pay for attorney fees."
          }
        ]
      },
      {
        title: "When You Might Not Need an Attorney",
        content: "You might not need an attorney if:\n\n1. Injuries are very minor (minor cuts, bruises)\n2. Medical expenses are under $1,000\n3. No lost wages\n4. Liability is crystal clear\n5. Insurance company is cooperative\n6. Settlement offer is fair\n7. You're confident negotiating with insurance\n8. You have time to handle it yourself\n\nEven in these cases, a free consultation with an attorney is worthwhile.",
        subsections: [
          {
            title: "The Risk",
            content: "Even in minor cases, you risk accepting a lowball offer. A quick attorney consultation can tell you if the offer is fair."
          }
        ]
      },
      {
        title: "How Attorneys Are Paid",
        content: "Most personal injury attorneys work on contingency:\n\n1. No upfront cost\n2. No hourly fees\n3. Attorney takes a percentage of settlement (typically 33%)\n4. If you don't win, attorney doesn't get paid\n5. You only pay if you receive compensation\n\nThis aligns the attorney's interests with yours.",
        subsections: [
          {
            title: "Why Contingency Is Good for You",
            content: "Contingency means your attorney is motivated to maximize your settlement. They only make money if you win."
          }
        ]
      },
      {
        title: "What an Attorney Can Do for You",
        content: "An attorney can:\n\n1. Evaluate your case\n2. Determine case value\n3. Gather evidence\n4. Negotiate with insurance\n5. Handle all communication\n6. Protect your rights\n7. Challenge lowball offers\n8. Prepare for trial (if needed)\n9. Maximize your settlement\n10. Handle all paperwork",
        subsections: [
          {
            title: "Why This Matters",
            content: "Insurance companies know that cases with attorney representation settle for more. They take unrepresented claimants less seriously."
          }
        ]
      }
    ],
    keyTakeaways: [
      "Cases with attorney representation settle for 3-5x more than without",
      "Even after paying attorney fees, you typically come out ahead",
      "Most personal injury cases benefit from attorney representation",
      "Attorneys work on contingency (no upfront cost)",
      "You only pay if you win",
      "A free consultation can tell you if hiring an attorney makes sense"
    ],
    faq: [
      {
        question: "How much does a personal injury attorney cost?",
        answer: "Most work on contingency, meaning no upfront cost. They take a percentage of your settlement (typically 33%). If you don't win, you don't pay."
      },
      {
        question: "Will hiring an attorney increase my settlement?",
        answer: "Yes. Cases with attorney representation settle for 3-5x more than without. Even after paying attorney fees, you typically come out ahead."
      },
      {
        question: "Should I hire an attorney for a minor injury?",
        answer: "Even for minor injuries, a free consultation is worthwhile. An attorney can tell you if the insurance offer is fair and if representation makes sense."
      },
      {
        question: "What if I can't afford an attorney?",
        answer: "Most personal injury attorneys work on contingency, meaning no upfront cost. You only pay if you win. This makes representation affordable for everyone."
      }
    ],
    cta: {
      heading: "Get Expert Guidance",
      description: "A free consultation with a personal injury attorney can tell you if hiring representation makes sense for your case. Most consultations are free with no obligation.",
      buttonText: "Get Free Case Review"
    }
  }
};

const GuidePage = () => {
  const { id } = useParams();
  const guide = guideContent[id || ""];

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#f9f5ef] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-medium text-[#1c2b32] mb-4">Guide Not Found</h1>
          <p className="text-[#2e4350] mb-6">The guide you're looking for doesn't exist.</p>
          <a href="/guides" className="text-[#1a4a5a] font-bold border-b-2 border-[#1a4a5a]">
            Back to Guides
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f5ef]">
      {/* ════════════════════════════
          NAV
      ════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-7 flex items-center justify-between bg-[rgba(249,245,239,.93)] border-b border-[#e8e2d8] shadow-sm">
        <a href="/guides" className="flex items-center gap-2 text-[#1a4a5a] hover:text-[#4a8c7e]">
          <ChevronLeft size={20} />
          <span className="font-bold text-xs tracking-widest">Back to Guides</span>
        </a>

        <a href="tel:+18002273669" className="bg-[#c4714a] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#d4855e] transition-all">
          Free Case Review
        </a>
      </nav>

      {/* ════════════════════════════
          HERO
      ════════════════════════════ */}
      <section className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl lg:text-6xl font-medium leading-tight text-[#1c2b32] mb-6">
          {guide.title}
        </h1>
        <p className="text-xl text-[#2e4350] mb-6">{guide.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-[#7a9299]">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{guide.readTime} read</span>
          </div>
          <div>✓ Attorney-Reviewed</div>
          <div>Updated: {new Date(guide.updateDate).toLocaleDateString()}</div>
        </div>
      </section>

      {/* ════════════════════════════
          CONTENT
      ════════════════════════════ */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          {guide.sections.map((section, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="font-serif text-3xl font-medium text-[#1c2b32] mb-4">{section.title}</h2>
              <p className="text-[#2e4350] mb-6 whitespace-pre-wrap">{section.content}</p>
              
              {section.subsections && section.subsections.map((sub, subIdx) => (
                <div key={subIdx} className="ml-6 mb-6">
                  <h3 className="font-bold text-[#1c2b32] mb-2">{sub.title}</h3>
                  <p className="text-[#2e4350] whitespace-pre-wrap">{sub.content}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════
          KEY TAKEAWAYS
      ════════════════════════════ */}
      <section className="py-12 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-medium text-[#1c2b32] mb-6">Key Takeaways</h2>
          <div className="space-y-3">
            {guide.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#4a8c7e] flex-shrink-0 mt-0.5" />
                <p className="text-[#2e4350]">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          FAQ
      ════════════════════════════ */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-medium text-[#1c2b32] mb-6">Common Questions</h2>
          <div className="space-y-4">
            {guide.faq.map((item, idx) => (
              <div key={idx} className="border border-[#e8e2d8] rounded-lg p-6">
                <h3 className="font-bold text-[#1c2b32] mb-2">{item.question}</h3>
                <p className="text-[#2e4350]">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          CTA
      ════════════════════════════ */}
      <section className="py-16 px-6 bg-[#f9f5ef]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-medium text-[#1c2b32] mb-4">{guide.cta.heading}</h2>
          <p className="text-lg text-[#2e4350] mb-8 max-w-2xl mx-auto">{guide.cta.description}</p>
          
          <a
            href="tel:+18002273669"
            className="inline-flex items-center gap-2 bg-[#c4714a] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d4855e] transition-all hover:shadow-lg"
          >
            {guide.cta.buttonText}
            <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {/* ════════════════════════════
          FOOTER
      ════════════════════════════ */}
      <footer className="bg-[#1a4a5a] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <a href="/guides" className="text-[#a8c5cc] hover:text-white font-bold">
              ← Back to All Guides
            </a>
          </div>

          <div className="border-t border-[#2e5f6f] pt-8">
            <p className="text-xs text-[#a8c5cc] mb-3">
              This is not legal advice. Guides are for informational purposes only. Always consult with a qualified attorney about your specific situation.
            </p>
            <p className="text-xs text-[#7a9299]">© 2026 www.CasePort.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuidePage;
