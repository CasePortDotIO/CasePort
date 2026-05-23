import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ChevronRight, MessageCircle, Calendar } from 'lucide-react';
import { GuideCategory } from '@/data/guideData';
import { MobileStickyCTA } from '@/components/MobileStickyCTA';
import '@/styles/animations.css';

interface CategoryGuideTemplateProps {
  category: GuideCategory;
}

export default function CategoryGuideTemplate({ category }: CategoryGuideTemplateProps) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [openFAQs, setOpenFAQs] = useState<Set<number>>(new Set([0, 1, 2, 3, 4])); // All FAQs open by default
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => new Set(prev).add(entry.target.id));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (idx: number) => {
    setOpenFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const getHeroImage = (slug: string): string => {
    const heroImages: Record<string, string> = {
      'truck-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/truck-accident-hero-cinematic-BuaBVcavTY6uCvLnKDG3NW.webp',
      'slip-and-fall': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/slip-fall-hero-cinematic-EhGT9QEfjB7Q7hisW7bL7U.webp',
      'medical-malpractice': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/medical-malpractice-hero-cinematic-3A3GTJRVmT2hGZooye3LHr.webp',
      'workplace-injury': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/workplace-injury-hero-cinematic-JP3hFtfn295MMbWXYoQS8F.webp',
      'pedestrian-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/pedestrian-accident-hero-cinematic-GjC5fqyYhn5RbSKGwXaMqY.webp',
      'dog-bite': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/dog-bite-hero-cinematic-QBByqPayzL3T3HfvZKxmDH.webp',
      'wrongful-death': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/wrongful-death-hero-cinematic-9YVsp64mfN5BFDsq9hHRKH.webp',
      'rideshare-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/rideshare-accident-hero-cinematic-P7zRxKycUvstyVeH8qx3Qg.webp',
      'insurance-claims': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/insurance-claims-hero-cinematic-M48wXi39TR9DspEkJH5KKR.webp',
      'car-accident': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/e3RpsceZhQ6a47LQwdBgwe/car-accident-hero-cinematic-5XuBYED4tqcgRTzqoFncRS.webp'
    };
    return heroImages[slug] || heroImages['truck-accident'];
  };

  const categoryData = {
    'truck-accident': {
      heroTitle: "You're Hurt. You're Scared. And You Deserve to Get Paid.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't cause this. An 80,000-pound truck did. And right now, the insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$250K',
        successRate: '92%',
        timeline: '12-18 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates truck accidents from everything else. When a regular car hits you, it's bad. When an 18-wheeler hits you at highway speed, your body doesn't just get injured—it gets erased. Spinal damage. Crushed limbs. Internal bleeding. Months of recovery. Lost wages. Lost time with your family. Lost normalcy. And the worst part? The trucking company's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They have a playbook. They know your weaknesses. They're betting you won't fight back. But here's what they don't know: you have leverage. Massive leverage. Federal regulations. Black box data. Maintenance records. Multiple defendants with deep insurance. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$2.3B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '92%',
      successRateContext: 'of cases result in settlement',
      casesWon: '5,000+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$250K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Marcus T.',
          location: 'Texas',
          settlement: '$285K',
          settlementValue: 285000,
          injuryType: 'Multiple injuries',
          caseType: 'Truck Accident',
          quote: "I was hit by an 18-wheeler on I-35. Couldn't work for 6 months. Thought my life was over. Then I got $285K. My family is taken care of. I can breathe again.",
          rating: 5,
          date: '2024-01-15',
          caseResolutionTime: 'P18M'
        },
        {
          name: 'David M.',
          location: 'California',
          settlement: '$420K',
          settlementValue: 420000,
          injuryType: 'Spinal injury',
          caseType: 'Truck Accident',
          quote: "Spinal injury. The insurance company lowballed me at $80K. I almost took it. Then I got $420K. That's the difference between surviving and thriving.",
          rating: 5,
          date: '2024-02-20',
          caseResolutionTime: 'P14M'
        },
        {
          name: 'James R.',
          location: 'Florida',
          settlement: '$195K',
          settlementValue: 195000,
          injuryType: 'Broken leg & back injury',
          caseType: 'Truck Accident',
          quote: "Broken leg. Couldn't walk for months. Lost my job. Got $195K. Now I'm back on my feet—literally and financially.",
          rating: 5,
          date: '2024-03-10',
          caseResolutionTime: 'P12M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Spinal Cord Injury',
          settlementAmount: '450000',
          settlementRange: { min: '300000', max: '750000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Traumatic Brain Injury',
          settlementAmount: '350000',
          settlementRange: { min: '200000', max: '600000' },
          recoveryTime: '18+ months'
        },
        {
          injuryType: 'Multiple Fractures',
          settlementAmount: '225000',
          settlementRange: { min: '150000', max: '400000' },
          recoveryTime: '6-9 months'
        },
        {
          injuryType: 'Crushed Leg & Fractures',
          settlementAmount: '275000',
          settlementRange: { min: '150000', max: '400000' },
          recoveryTime: '6 months'
        },
        {
          injuryType: 'Broken Ribs & Injuries',
          settlementAmount: '125000',
          settlementRange: { min: '75000', max: '200000' },
          recoveryTime: '3 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a truck accident?",
          answer: "The average truck accident settlement is $250K, but it depends on your injuries, lost wages, and liability. Some cases settle for $50K, others for $1M+. We've recovered over $2.3B for clients. The key is having an attorney who knows how to value your case correctly."
        },
        {
          question: "How long does a truck accident case take?",
          answer: "Most truck accident cases settle within 12-18 months. Some take longer if they go to trial. The timeline depends on injury severity, investigation complexity, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a truck accident?",
          answer: "Yes. Insurance companies have teams of lawyers whose job is to pay you as little as possible. You need someone on your side who knows federal trucking regulations, can access black box data, and understands the true value of your case. The difference between going it alone and having an attorney is often 5x your settlement."
        },
        {
          question: "What if I was partially at fault?",
          answer: "Most states allow you to recover even if you're 50-99% at fault (depending on your state's comparative negligence laws). We've won cases where our clients were partially at fault. The key is proving the truck driver or trucking company was MORE at fault."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    },
    'slip-and-fall': {
      heroTitle: "You Slipped. You Fell. And Someone Else Should Pay.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't lose your balance. A wet floor did. A broken step did. Negligence did. And right now, the property owner's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$75K',
        successRate: '88%',
        timeline: '8-14 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates slip and fall cases from everything else. When you slip on a wet floor, it's not an accident—it's negligence. Property owners have a legal duty to maintain safe premises. They have a duty to warn you of hazards. They have a duty to fix dangerous conditions. When they fail, you have a case. And the worst part? The property owner's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim you were careless. They'll say the floor was obviously wet. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Premises liability laws. Security footage. Witness statements. Prior complaints about the same hazard. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$1.2B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '88%',
      successRateContext: 'of cases result in settlement',
      casesWon: '3,500+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$75K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Sarah L.',
          location: 'California',
          settlement: '$125K',
          settlementValue: 125000,
          injuryType: 'Broken hip',
          caseType: 'Slip & Fall',
          quote: "Slipped on a wet floor at a grocery store. Broke my hip. Needed surgery. The store claimed I was careless. I got $125K. Justice served.",
          rating: 5,
          date: '2024-01-20',
          caseResolutionTime: 'P10M'
        },
        {
          name: 'Robert K.',
          location: 'Texas',
          settlement: '$95K',
          settlementValue: 95000,
          injuryType: 'Knee injury',
          caseType: 'Slip & Fall',
          quote: "Fell at a shopping mall. Injured my knee. Couldn't work for months. Got $95K. The property owner should have fixed that hazard.",
          rating: 5,
          date: '2024-02-15',
          caseResolutionTime: 'P9M'
        },
        {
          name: 'Jennifer M.',
          location: 'Florida',
          settlement: '$65K',
          settlementValue: 65000,
          injuryType: 'Wrist fracture',
          caseType: 'Slip & Fall',
          quote: "Slipped at a restaurant. Broke my wrist. Couldn't use my hand for months. Got $65K. Worth every penny.",
          rating: 5,
          date: '2024-03-05',
          caseResolutionTime: 'P8M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Broken Hip',
          settlementAmount: '150000',
          settlementRange: { min: '100000', max: '250000' },
          recoveryTime: '6-12 months'
        },
        {
          injuryType: 'Spinal Injury',
          settlementAmount: '120000',
          settlementRange: { min: '80000', max: '200000' },
          recoveryTime: '6-9 months'
        },
        {
          injuryType: 'Knee Injury',
          settlementAmount: '80000',
          settlementRange: { min: '50000', max: '150000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Wrist Fracture',
          settlementAmount: '60000',
          settlementRange: { min: '40000', max: '100000' },
          recoveryTime: '2-3 months'
        },
        {
          injuryType: 'Minor Injuries',
          settlementAmount: '35000',
          settlementRange: { min: '20000', max: '60000' },
          recoveryTime: '1-2 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a slip and fall?",
          answer: "The average slip and fall settlement is $75K, but it depends on your injuries, medical costs, and lost wages. Some cases settle for $20K, others for $250K+. We've recovered over $1.2B for clients. The key is proving the property owner was negligent."
        },
        {
          question: "How long does a slip and fall case take?",
          answer: "Most slip and fall cases settle within 8-14 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a slip and fall?",
          answer: "Yes. Property owners have insurance companies that will deny your claim or lowball you. You need someone on your side who knows premises liability law, can gather evidence, and understands the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "What if I was partially at fault?",
          answer: "Most states allow you to recover even if you were partially at fault. We've won cases where our clients were partially responsible. The key is proving the property owner failed to maintain safe premises or warn of hazards."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    },
    'medical-malpractice': {
      heroTitle: "Your Doctor Failed You. Now It's Time to Get Paid.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you trusted your doctor. You followed their advice. And they made a mistake. A serious one. And right now, the hospital's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$350K',
        successRate: '85%',
        timeline: '18-24 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates medical malpractice cases from everything else. When a doctor makes a mistake, it's not just an error—it's a violation of the standard of care. They had a duty to treat you properly. They failed. And now you're suffering the consequences. Surgery complications. Misdiagnosis. Medication errors. Surgical errors. The worst part? The hospital's insurance company has already assigned a team of lawyers whose entire job is to defend the doctor and pay you as little as possible. They'll claim the outcome was unavoidable. They'll say you were a difficult case. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Expert medical testimony. Hospital records. Deviation from standard of care. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$2.8B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '85%',
      successRateContext: 'of cases result in settlement',
      casesWon: '2,200+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$350K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Patricia H.',
          location: 'New York',
          settlement: '$520K',
          settlementValue: 520000,
          injuryType: 'Surgical error',
          caseType: 'Medical Malpractice',
          quote: "Surgeon nicked my artery during surgery. Caused permanent nerve damage. I got $520K. The hospital should have been more careful.",
          rating: 5,
          date: '2024-01-10',
          caseResolutionTime: 'P20M'
        },
        {
          name: 'Michael T.',
          location: 'California',
          settlement: '$380K',
          settlementValue: 380000,
          injuryType: 'Misdiagnosis',
          caseType: 'Medical Malpractice',
          quote: "Doctor misdiagnosed my cancer. By the time it was caught, it had spread. I got $380K. Early diagnosis could have saved my life.",
          rating: 5,
          date: '2024-02-05',
          caseResolutionTime: 'P18M'
        },
        {
          name: 'Linda G.',
          location: 'Texas',
          settlement: '$285K',
          settlementValue: 285000,
          injuryType: 'Medication error',
          caseType: 'Medical Malpractice',
          quote: "Nurse gave me the wrong medication. Caused severe allergic reaction. I got $285K. This should never have happened.",
          rating: 5,
          date: '2024-03-01',
          caseResolutionTime: 'P16M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Surgical Error',
          settlementAmount: '500000',
          settlementRange: { min: '300000', max: '1000000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Misdiagnosis',
          settlementAmount: '400000',
          settlementRange: { min: '200000', max: '800000' },
          recoveryTime: '18+ months'
        },
        {
          injuryType: 'Medication Error',
          settlementAmount: '250000',
          settlementRange: { min: '150000', max: '500000' },
          recoveryTime: '6-12 months'
        },
        {
          injuryType: 'Birth Injury',
          settlementAmount: '600000',
          settlementRange: { min: '400000', max: '1200000' },
          recoveryTime: 'Lifetime'
        },
        {
          injuryType: 'Anesthesia Error',
          settlementAmount: '350000',
          settlementRange: { min: '200000', max: '700000' },
          recoveryTime: '12+ months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for medical malpractice?",
          answer: "The average medical malpractice settlement is $350K, but it depends on the severity of the error, your injuries, and lost wages. Some cases settle for $100K, others for $1M+. We've recovered over $2.8B for clients. The key is proving deviation from the standard of care."
        },
        {
          question: "How long does a medical malpractice case take?",
          answer: "Most medical malpractice cases take 18-24 months to settle. Some take longer if they go to trial. The timeline depends on the complexity of the medical issues, expert testimony, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for medical malpractice?",
          answer: "Yes. Medical malpractice cases are complex and require expert testimony. You need someone on your side who understands medical law, can hire the right experts, and knows how to prove deviation from the standard of care. The difference between going it alone and having an attorney is often 5-10x your settlement."
        },
        {
          question: "What is the statute of limitations for medical malpractice?",
          answer: "The statute of limitations for medical malpractice varies by state, but is typically 2-3 years from the date of the error (or when you discovered it). Some states have longer deadlines for minors. Don't wait—contact us immediately to protect your rights."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '1' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '2' },
        { state: 'New York', years: '2.5' }
      ]
    },
    'workplace-injury': {
      heroTitle: "You Got Hurt at Work. Now Get What You're Owed.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you were just doing your job. And your employer failed to keep you safe. And right now, the workers' compensation insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$85K',
        successRate: '90%',
        timeline: '6-12 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates workplace injury cases from everything else. When you get hurt at work, you deserve compensation. Your employer has a legal duty to maintain a safe workplace. They have a duty to provide proper equipment. They have a duty to train you properly. When they fail, you have a case. And the worst part? The workers' compensation insurance company has already assigned a team of adjusters whose entire job is to pay you as little as possible. They'll claim your injury isn't work-related. They'll say you were careless. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. OSHA violations. Safety records. Witness statements. Prior injuries at the same location. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$950M+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '90%',
      successRateContext: 'of cases result in settlement',
      casesWon: '4,100+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$85K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'John D.',
          location: 'Texas',
          settlement: '$145K',
          settlementValue: 145000,
          injuryType: 'Back injury',
          caseType: 'Workplace Injury',
          quote: "Injured my back lifting heavy equipment. Employer didn't provide proper training. Got $145K. Now I can afford physical therapy.",
          rating: 5,
          date: '2024-01-25',
          caseResolutionTime: 'P8M'
        },
        {
          name: 'Angela R.',
          location: 'California',
          settlement: '$120K',
          settlementValue: 120000,
          injuryType: 'Chemical burn',
          caseType: 'Workplace Injury',
          quote: "Chemical spill at work. Employer didn't provide proper protective equipment. Got $120K. Safety should come first.",
          rating: 5,
          date: '2024-02-10',
          caseResolutionTime: 'P9M'
        },
        {
          name: 'Thomas C.',
          location: 'Florida',
          settlement: '$95K',
          settlementValue: 95000,
          injuryType: 'Broken arm',
          caseType: 'Workplace Injury',
          quote: "Broken arm from faulty equipment. Employer knew it was broken. Got $95K. They should have fixed it.",
          rating: 5,
          date: '2024-03-08',
          caseResolutionTime: 'P7M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Spinal Injury',
          settlementAmount: '180000',
          settlementRange: { min: '120000', max: '300000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Amputation',
          settlementAmount: '250000',
          settlementRange: { min: '150000', max: '500000' },
          recoveryTime: 'Lifetime'
        },
        {
          injuryType: 'Broken Bones',
          settlementAmount: '75000',
          settlementRange: { min: '50000', max: '150000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Burn Injury',
          settlementAmount: '100000',
          settlementRange: { min: '60000', max: '200000' },
          recoveryTime: '6-12 months'
        },
        {
          injuryType: 'Repetitive Strain',
          settlementAmount: '50000',
          settlementRange: { min: '30000', max: '100000' },
          recoveryTime: '3-6 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a workplace injury?",
          answer: "The average workplace injury settlement is $85K, but it depends on your injury type, lost wages, and medical costs. Some cases settle for $30K, others for $250K+. We've recovered over $950M for clients. The key is proving your employer was negligent."
        },
        {
          question: "How long does a workplace injury case take?",
          answer: "Most workplace injury cases settle within 6-12 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a workplace injury?",
          answer: "Yes. Workers' compensation insurance companies will deny your claim or lowball you. You need someone on your side who knows employment law, can gather evidence, and understands the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "Can I sue my employer for a workplace injury?",
          answer: "In most cases, you can't sue your employer directly (workers' comp is the exclusive remedy). However, you may be able to sue third parties like equipment manufacturers or contractors. We can help you explore all options."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '1' },
        { state: 'Texas', years: '1' },
        { state: 'Florida', years: '2' },
        { state: 'New York', years: '2' }
      ]
    },
    'pedestrian-accident': {
      heroTitle: "You Were Hit. You Didn't Deserve It. Now Get Paid.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you were just crossing the street. A driver wasn't paying attention. And right now, the driver's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$150K',
        successRate: '89%',
        timeline: '10-16 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates pedestrian accident cases from everything else. When a driver hits you, it's not an accident—it's negligence. Drivers have a legal duty to pay attention. They have a duty to obey traffic laws. They have a duty to avoid hitting pedestrians. When they fail, you have a case. And the worst part? The driver's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim you stepped into traffic. They'll say you weren't paying attention. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Traffic camera footage. Witness statements. Police reports. Medical records. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$1.5B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '89%',
      successRateContext: 'of cases result in settlement',
      casesWon: '3,800+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$150K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Emily S.',
          location: 'New York',
          settlement: '$225K',
          settlementValue: 225000,
          injuryType: 'Multiple fractures',
          caseType: 'Pedestrian Accident',
          quote: "Hit by a car while crossing the street. Multiple fractures. The driver was texting. I got $225K. Distracted driving is dangerous.",
          rating: 5,
          date: '2024-01-15',
          caseResolutionTime: 'P12M'
        },
        {
          name: 'Christopher M.',
          location: 'California',
          settlement: '$180K',
          settlementValue: 180000,
          injuryType: 'Spinal injury',
          caseType: 'Pedestrian Accident',
          quote: "Hit by a car at an intersection. Spinal injury. Couldn't work for a year. Got $180K. The driver ran a red light.",
          rating: 5,
          date: '2024-02-20',
          caseResolutionTime: 'P11M'
        },
        {
          name: 'Nicole B.',
          location: 'Texas',
          settlement: '$140K',
          settlementValue: 140000,
          injuryType: 'Broken leg',
          caseType: 'Pedestrian Accident',
          quote: "Hit by a car while crossing at a crosswalk. Broken leg. Got $140K. I was in the right place.",
          rating: 5,
          date: '2024-03-12',
          caseResolutionTime: 'P10M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Spinal Cord Injury',
          settlementAmount: '300000',
          settlementRange: { min: '200000', max: '500000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Traumatic Brain Injury',
          settlementAmount: '250000',
          settlementRange: { min: '150000', max: '400000' },
          recoveryTime: '18+ months'
        },
        {
          injuryType: 'Multiple Fractures',
          settlementAmount: '150000',
          settlementRange: { min: '100000', max: '250000' },
          recoveryTime: '6-9 months'
        },
        {
          injuryType: 'Broken Leg',
          settlementAmount: '100000',
          settlementRange: { min: '60000', max: '180000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Minor Injuries',
          settlementAmount: '50000',
          settlementRange: { min: '30000', max: '100000' },
          recoveryTime: '1-3 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a pedestrian accident?",
          answer: "The average pedestrian accident settlement is $150K, but it depends on your injuries, lost wages, and liability. Some cases settle for $50K, others for $400K+. We've recovered over $1.5B for clients. The key is proving the driver was negligent."
        },
        {
          question: "How long does a pedestrian accident case take?",
          answer: "Most pedestrian accident cases settle within 10-16 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a pedestrian accident?",
          answer: "Yes. Insurance companies will deny your claim or lowball you. You need someone on your side who knows traffic law, can gather evidence, and understands the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "What if I was partially at fault?",
          answer: "Most states allow you to recover even if you were partially at fault. We've won cases where our clients were partially responsible. The key is proving the driver was MORE at fault."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    },
    'dog-bite': {
      heroTitle: "You Got Bit. The Dog Owner Should Pay.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't provoke the dog. The owner failed to control it. And right now, the dog owner's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$45K',
        successRate: '92%',
        timeline: '6-10 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates dog bite cases from everything else. When a dog bites you, it's not an accident—it's negligence. Dog owners have a legal duty to control their dogs. They have a duty to warn others of dangerous dogs. They have a duty to prevent attacks. When they fail, you have a case. And the worst part? The dog owner's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim you provoked the dog. They'll say the dog is friendly. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Medical records. Witness statements. Prior complaints about the dog. Local ordinances. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$580M+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '92%',
      successRateContext: 'of cases result in settlement',
      casesWon: '2,900+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$45K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Kevin J.',
          location: 'California',
          settlement: '$85K',
          settlementValue: 85000,
          injuryType: 'Severe bite wounds',
          caseType: 'Dog Bite',
          quote: "Attacked by a neighbor's dog. Severe bite wounds on my arm. Required surgery. Got $85K. The owner knew the dog was aggressive.",
          rating: 5,
          date: '2024-01-30',
          caseResolutionTime: 'P7M'
        },
        {
          name: 'Rachel T.',
          location: 'Texas',
          settlement: '$62K',
          settlementValue: 62000,
          injuryType: 'Face and neck bites',
          caseType: 'Dog Bite',
          quote: "Dog bit my face and neck while I was jogging. Left scars. Got $62K. The owner should have kept the dog contained.",
          rating: 5,
          date: '2024-02-18',
          caseResolutionTime: 'P6M'
        },
        {
          name: 'Daniel W.',
          location: 'Florida',
          settlement: '$48K',
          settlementValue: 48000,
          injuryType: 'Hand and arm bites',
          caseType: 'Dog Bite',
          quote: "Dog bit my hand and arm at a park. Required stitches. Got $48K. The dog wasn't on a leash.",
          rating: 5,
          date: '2024-03-10',
          caseResolutionTime: 'P5M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Severe Bite Wounds',
          settlementAmount: '100000',
          settlementRange: { min: '60000', max: '200000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Face/Neck Bites',
          settlementAmount: '80000',
          settlementRange: { min: '50000', max: '150000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Hand/Arm Bites',
          settlementAmount: '50000',
          settlementRange: { min: '30000', max: '100000' },
          recoveryTime: '2-4 months'
        },
        {
          injuryType: 'Leg Bites',
          settlementAmount: '45000',
          settlementRange: { min: '25000', max: '80000' },
          recoveryTime: '2-3 months'
        },
        {
          injuryType: 'Minor Bites',
          settlementAmount: '25000',
          settlementRange: { min: '15000', max: '50000' },
          recoveryTime: '1-2 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a dog bite?",
          answer: "The average dog bite settlement is $45K, but it depends on the severity of the bite, scarring, and medical costs. Some cases settle for $15K, others for $150K+. We've recovered over $580M for clients. The key is proving the owner was negligent."
        },
        {
          question: "How long does a dog bite case take?",
          answer: "Most dog bite cases settle within 6-10 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a dog bite?",
          answer: "Yes. Insurance companies will deny your claim or lowball you. You need someone on your side who knows dog bite law, can gather evidence, and understands the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "What if I was on the dog owner's property?",
          answer: "Even if you were on the dog owner's property, they still have a duty to control their dog. We've won cases where our clients were trespassing. The key is proving the owner was negligent."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    },
    'wrongful-death': {
      heroTitle: "Your Loved One Didn't Deserve This. Now Get Justice.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: your loved one is gone. And someone else's negligence caused it. And right now, the at-fault party's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$500K',
        successRate: '87%',
        timeline: '18-24 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates wrongful death cases from everything else. When someone dies due to negligence, it's not just a tragedy—it's a legal wrong. The at-fault party had a duty to prevent harm. They failed. And now your family is suffering. Lost income. Lost companionship. Lost future. The worst part? The at-fault party's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim the death was unavoidable. They'll say your loved one was at fault. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Medical records. Expert testimony. Loss of income calculations. Punitive damages. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$3.2B+',
      recoveredAmountContext: 'Total Recovered for Families',
      successRate: '87%',
      successRateContext: 'of cases result in settlement',
      casesWon: '1,800+',
      casesWonContext: 'families compensated',
      avgSettlement: '$500K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Margaret L.',
          location: 'California',
          settlement: '$750K',
          settlementValue: 750000,
          injuryType: 'Fatal car accident',
          caseType: 'Wrongful Death',
          quote: "My husband was killed by a drunk driver. Left me with two kids and no income. Got $750K. It doesn't bring him back, but it helps us survive.",
          rating: 5,
          date: '2024-01-12',
          caseResolutionTime: 'P20M'
        },
        {
          name: 'Robert P.',
          location: 'Texas',
          settlement: '$520K',
          settlementValue: 520000,
          injuryType: 'Medical malpractice death',
          caseType: 'Wrongful Death',
          quote: "My mother died due to a surgical error. The doctor was negligent. Got $520K. Justice for my mother.",
          rating: 5,
          date: '2024-02-08',
          caseResolutionTime: 'P18M'
        },
        {
          name: 'Susan M.',
          location: 'Florida',
          settlement: '$420K',
          settlementValue: 420000,
          injuryType: 'Workplace accident death',
          caseType: 'Wrongful Death',
          quote: "My son died in a workplace accident. Employer failed to provide safety equipment. Got $420K. He deserved better.",
          rating: 5,
          date: '2024-03-05',
          caseResolutionTime: 'P16M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Fatal Car Accident',
          settlementAmount: '600000',
          settlementRange: { min: '400000', max: '1000000' },
          recoveryTime: 'N/A'
        },
        {
          injuryType: 'Fatal Medical Error',
          settlementAmount: '550000',
          settlementRange: { min: '300000', max: '900000' },
          recoveryTime: 'N/A'
        },
        {
          injuryType: 'Fatal Workplace Accident',
          settlementAmount: '450000',
          settlementRange: { min: '250000', max: '750000' },
          recoveryTime: 'N/A'
        },
        {
          injuryType: 'Fatal Truck Accident',
          settlementAmount: '700000',
          settlementRange: { min: '500000', max: '1200000' },
          recoveryTime: 'N/A'
        },
        {
          injuryType: 'Fatal Pedestrian Accident',
          settlementAmount: '500000',
          settlementRange: { min: '300000', max: '800000' },
          recoveryTime: 'N/A'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a wrongful death?",
          answer: "The average wrongful death settlement is $500K, but it depends on the deceased's age, income, and the circumstances of death. Some cases settle for $200K, others for $2M+. We've recovered over $3.2B for families. The key is proving the defendant was negligent."
        },
        {
          question: "How long does a wrongful death case take?",
          answer: "Most wrongful death cases take 18-24 months to settle. Some take longer if they go to trial. The timeline depends on the complexity of the case, expert testimony, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a wrongful death?",
          answer: "Yes. Wrongful death cases are complex and require expert testimony. You need someone on your side who understands wrongful death law, can calculate damages, and knows how to prove negligence. The difference between going it alone and having an attorney is often 5-10x your settlement."
        },
        {
          question: "Who can file a wrongful death lawsuit?",
          answer: "Typically, the deceased's spouse, children, or parents can file. In some states, other family members or dependents can also file. We can help you determine who has standing to sue."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '2' },
        { state: 'New York', years: '3' }
      ]
    },
    'rideshare-accident': {
      heroTitle: "You Got Hurt in a Rideshare. Now Get Paid.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you trusted the rideshare company. You got in the car. And the driver caused an accident. And right now, the rideshare company's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$120K',
        successRate: '88%',
        timeline: '10-14 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates rideshare accident cases from everything else. When a rideshare driver causes an accident, it's not just a mistake—it's negligence. The rideshare company has a duty to vet drivers. They have a duty to maintain vehicles. They have a duty to ensure passenger safety. When they fail, you have a case. And the worst part? The rideshare company's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim the driver is an independent contractor. They'll say you assumed the risk. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Rideshare company policies. Driver records. Vehicle maintenance records. Accident reports. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$1.1B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '88%',
      successRateContext: 'of cases result in settlement',
      casesWon: '3,200+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$120K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Jessica H.',
          location: 'New York',
          settlement: '$185K',
          settlementValue: 185000,
          injuryType: 'Multiple injuries',
          caseType: 'Rideshare Accident',
          quote: "Rideshare driver ran a red light. I was injured. The company claimed the driver was independent. I got $185K. They're responsible for safety.",
          rating: 5,
          date: '2024-01-22',
          caseResolutionTime: 'P11M'
        },
        {
          name: 'Mark V.',
          location: 'California',
          settlement: '$155K',
          settlementValue: 155000,
          injuryType: 'Spinal injury',
          caseType: 'Rideshare Accident',
          quote: "Rideshare driver was speeding. Caused a crash. Spinal injury. Got $155K. The company should screen drivers better.",
          rating: 5,
          date: '2024-02-14',
          caseResolutionTime: 'P10M'
        },
        {
          name: 'Lisa K.',
          location: 'Texas',
          settlement: '$110K',
          settlementValue: 110000,
          injuryType: 'Broken ribs',
          caseType: 'Rideshare Accident',
          quote: "Rideshare driver was distracted. Hit another car. I got broken ribs. Got $110K. Safety should be the priority.",
          rating: 5,
          date: '2024-03-03',
          caseResolutionTime: 'P9M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Spinal Injury',
          settlementAmount: '200000',
          settlementRange: { min: '120000', max: '350000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Traumatic Brain Injury',
          settlementAmount: '180000',
          settlementRange: { min: '100000', max: '300000' },
          recoveryTime: '18+ months'
        },
        {
          injuryType: 'Multiple Fractures',
          settlementAmount: '120000',
          settlementRange: { min: '80000', max: '200000' },
          recoveryTime: '6-9 months'
        },
        {
          injuryType: 'Broken Ribs',
          settlementAmount: '80000',
          settlementRange: { min: '50000', max: '150000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Minor Injuries',
          settlementAmount: '50000',
          settlementRange: { min: '30000', max: '100000' },
          recoveryTime: '1-3 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a rideshare accident?",
          answer: "The average rideshare accident settlement is $120K, but it depends on your injuries, lost wages, and liability. Some cases settle for $40K, others for $300K+. We've recovered over $1.1B for clients. The key is proving the driver or company was negligent."
        },
        {
          question: "How long does a rideshare accident case take?",
          answer: "Most rideshare accident cases settle within 10-14 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a rideshare accident?",
          answer: "Yes. Rideshare companies have complex insurance policies and will deny your claim or lowball you. You need someone on your side who understands rideshare law, can navigate the insurance, and knows the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "Is the rideshare company liable?",
          answer: "Yes. Rideshare companies have a duty to vet drivers, maintain vehicles, and ensure passenger safety. They can be held liable for driver negligence. We've won many cases against rideshare companies."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    },
    'insurance-claims': {
      heroTitle: "Your Insurance Claim Was Denied. Fight Back.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you paid your premiums. You filed a claim. And the insurance company denied it. And right now, the insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$65K',
        successRate: '85%',
        timeline: '8-12 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates insurance claim denial cases from everything else. When an insurance company denies your claim, it's often not legitimate—it's a business decision. Insurance companies have a legal duty to act in good faith. They have a duty to investigate claims fairly. They have a duty to pay valid claims. When they fail, you have a case. And the worst part? The insurance company has already assigned a team of adjusters whose entire job is to deny your claim and keep your money. They'll claim the damage isn't covered. They'll say you didn't disclose everything. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Your policy language. Expert testimony. Bad faith evidence. Regulatory violations. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$850M+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '85%',
      successRateContext: 'of claims successfully appealed',
      casesWon: '2,600+',
      casesWonContext: 'claims overturned',
      avgSettlement: '$65K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Thomas D.',
          location: 'California',
          settlement: '$120K',
          settlementValue: 120000,
          injuryType: 'Homeowners claim denial',
          caseType: 'Insurance Claims',
          quote: "Insurance company denied my homeowners claim for water damage. Said it wasn't covered. Got $120K. They were wrong.",
          rating: 5,
          date: '2024-01-28',
          caseResolutionTime: 'P9M'
        },
        {
          name: 'Victoria R.',
          location: 'Texas',
          settlement: '$95K',
          settlementValue: 95000,
          injuryType: 'Auto insurance claim denial',
          caseType: 'Insurance Claims',
          quote: "Insurance company denied my auto claim. Said I didn't disclose everything. Got $95K. I was honest.",
          rating: 5,
          date: '2024-02-16',
          caseResolutionTime: 'P8M'
        },
        {
          name: 'George N.',
          location: 'Florida',
          settlement: '$75K',
          settlementValue: 75000,
          injuryType: 'Business insurance claim denial',
          caseType: 'Insurance Claims',
          quote: "Insurance company denied my business claim. Said it was an exclusion. Got $75K. They should have paid.",
          rating: 5,
          date: '2024-03-07',
          caseResolutionTime: 'P7M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Homeowners Claim Denial',
          settlementAmount: '150000',
          settlementRange: { min: '80000', max: '300000' },
          recoveryTime: '8-12 months'
        },
        {
          injuryType: 'Auto Insurance Claim Denial',
          settlementAmount: '100000',
          settlementRange: { min: '50000', max: '200000' },
          recoveryTime: '6-10 months'
        },
        {
          injuryType: 'Business Insurance Claim Denial',
          settlementAmount: '$80000',
          settlementRange: { min: '40000', max: '150000' },
          recoveryTime: '6-10 months'
        },
        {
          injuryType: 'Health Insurance Claim Denial',
          settlementAmount: '60000',
          settlementRange: { min: '30000', max: '120000' },
          recoveryTime: '4-8 months'
        },
        {
          injuryType: 'Life Insurance Claim Denial',
          settlementAmount: '200000',
          settlementRange: { min: '100000', max: '500000' },
          recoveryTime: '8-12 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for an insurance claim denial?",
          answer: "The average insurance claim denial settlement is $65K, but it depends on the policy limits and the nature of the claim. Some cases settle for $20K, others for $300K+. We've recovered over $850M for clients. The key is proving bad faith."
        },
        {
          question: "How long does an insurance claim denial case take?",
          answer: "Most insurance claim denial cases settle within 8-12 months. Some take longer if they go to trial. The timeline depends on the complexity of the policy, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for an insurance claim denial?",
          answer: "Yes. Insurance companies have teams of lawyers and adjusters. You need someone on your side who understands insurance law, can interpret your policy, and knows how to prove bad faith. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "What is bad faith in insurance?",
          answer: "Bad faith occurs when an insurance company denies a valid claim, fails to investigate fairly, or acts dishonestly. Examples include denying a claim without investigation, misinterpreting policy language, or delaying payment unreasonably. We can help you prove bad faith."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '4' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '5' },
        { state: 'New York', years: '6' }
      ]
    },
    'car-accident': {
      heroTitle: "You Got Hit. The Other Driver Should Pay.",
      heroSubtitle: "That headline hit different, didn't it? Because somewhere deep down, you know the truth: you didn't cause this accident. The other driver did. And right now, the other driver's insurance company is counting on you not knowing what to do next. But you're reading this. Which means you're already ahead of 90% of people in your situation. Keep reading.",
      quickAnswer: {
        average: '$95K',
        successRate: '90%',
        timeline: '8-12 months',
        upfront: '$0'
      },
      whyImportant: "Here's what separates car accident cases from everything else. When another driver hits you, it's not an accident—it's negligence. Drivers have a legal duty to pay attention. They have a duty to obey traffic laws. They have a duty to avoid hitting other cars. When they fail, you have a case. And the worst part? The other driver's insurance company has already assigned a team of lawyers whose entire job is to pay you as little as possible. They'll claim you were partially at fault. They'll say your injuries aren't that bad. They'll do anything to avoid paying. But here's what they don't know: you have leverage. Massive leverage. Police reports. Witness statements. Medical records. Expert testimony. The law is on your side. You just need someone who knows how to use it.",
      recoveredAmount: '$1.8B+',
      recoveredAmountContext: 'Total Recovered for Clients',
      successRate: '90%',
      successRateContext: 'of cases result in settlement',
      casesWon: '4,500+',
      casesWonContext: 'people paid in full',
      avgSettlement: '$95K',
      avgSettlementContext: 'Your potential recovery',
      testimonials: [
        {
          name: 'Andrew F.',
          location: 'California',
          settlement: '$165K',
          settlementValue: 165000,
          injuryType: 'Whiplash & back injury',
          caseType: 'Car Accident',
          quote: "Hit by another car at a red light. Whiplash and back injury. Couldn't work for months. Got $165K. The other driver was at fault.",
          rating: 5,
          date: '2024-01-18',
          caseResolutionTime: 'P10M'
        },
        {
          name: 'Stephanie N.',
          location: 'Texas',
          settlement: '$125K',
          settlementValue: 125000,
          injuryType: 'Broken arm',
          caseType: 'Car Accident',
          quote: "Hit by a car while stopped at a light. Broken arm. Got $125K. The insurance company tried to lowball me.",
          rating: 5,
          date: '2024-02-12',
          caseResolutionTime: 'P9M'
        },
        {
          name: 'Charles B.',
          location: 'Florida',
          settlement: '$85K',
          settlementValue: 85000,
          injuryType: 'Neck injury',
          caseType: 'Car Accident',
          quote: "Hit by another car. Neck injury. Needed physical therapy. Got $85K. Justice served.",
          rating: 5,
          date: '2024-03-02',
          caseResolutionTime: 'P8M'
        }
      ],
      settlementBreakdown: [
        {
          injuryType: 'Spinal Injury',
          settlementAmount: '180000',
          settlementRange: { min: '100000', max: '300000' },
          recoveryTime: '12+ months'
        },
        {
          injuryType: 'Traumatic Brain Injury',
          settlementAmount: '150000',
          settlementRange: { min: '80000', max: '250000' },
          recoveryTime: '18+ months'
        },
        {
          injuryType: 'Multiple Fractures',
          settlementAmount: '100000',
          settlementRange: { min: '60000', max: '180000' },
          recoveryTime: '6-9 months'
        },
        {
          injuryType: 'Whiplash & Back Injury',
          settlementAmount: '70000',
          settlementRange: { min: '40000', max: '120000' },
          recoveryTime: '3-6 months'
        },
        {
          injuryType: 'Minor Injuries',
          settlementAmount: '40000',
          settlementRange: { min: '20000', max: '80000' },
          recoveryTime: '1-3 months'
        }
      ],
      faqs: [
        {
          question: "How much can I get for a car accident?",
          answer: "The average car accident settlement is $95K, but it depends on your injuries, lost wages, and liability. Some cases settle for $30K, others for $300K+. We've recovered over $1.8B for clients. The key is proving the other driver was negligent."
        },
        {
          question: "How long does a car accident case take?",
          answer: "Most car accident cases settle within 8-12 months. Some take longer if they go to trial. The timeline depends on injury severity, evidence availability, and insurance company cooperation. We prioritize speed without sacrificing your settlement value."
        },
        {
          question: "Do I need an attorney for a car accident?",
          answer: "Yes. Insurance companies will deny your claim or lowball you. You need someone on your side who knows traffic law, can gather evidence, and understands the true value of your case. The difference between going it alone and having an attorney is often 3-5x your settlement."
        },
        {
          question: "What if I was partially at fault?",
          answer: "Most states allow you to recover even if you were partially at fault. We've won cases where our clients were partially responsible. The key is proving the other driver was MORE at fault."
        },
        {
          question: "How much does it cost to hire you?",
          answer: "We work on contingency. You pay nothing upfront. We only get paid if you win. Our fee is typically 33% of your settlement (or 40% if the case goes to trial). This means we're motivated to maximize your recovery."
        }
      ],
      statutes: [
        { state: 'California', years: '2' },
        { state: 'Texas', years: '2' },
        { state: 'Florida', years: '4' },
        { state: 'New York', years: '3' }
      ]
    }
  };

  const data = categoryData[category.slug as keyof typeof categoryData] || categoryData['truck-accident'];

  const generateSchemaMarkup = () => {
    const schemas = [];

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
    schemas.push(faqSchema);

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.heroTitle,
      description: data.heroSubtitle,
      author: {
        '@type': 'Organization',
        name: 'CasePort'
      },
      publisher: {
        '@type': 'Organization',
        name: 'CasePort',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.caseport.io/logo.png'
        }
      }
    };
    schemas.push(articleSchema);

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CasePort',
      url: 'https://www.caseport.io',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Legal Services',
        telephone: '+1-800-227-3669',
        areaServed: ['US']
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '5000'
      }
    };
    schemas.push(organizationSchema);

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.caseport.io'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: 'https://www.caseport.io/guides'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.title,
          item: `https://www.caseport.io/guide/${category.slug}`
        }
      ]
    };
    schemas.push(breadcrumbSchema);

    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: data.testimonials.length.toString(),
      bestRating: '5',
      worstRating: '1'
    };
    schemas.push(reviewSchema);

    const legalServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      name: `${category.title} Attorney - CasePort`,
      description: data.heroSubtitle,
      areaServed: ['US'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Legal Services',
        telephone: '+1-800-227-3669'
      }
    };
    schemas.push(legalServiceSchema);

    const tableSchema = {
      '@context': 'https://schema.org',
      '@type': 'Table',
      about: 'Settlement Breakdown by Injury Type',
      rows: data.settlementBreakdown.map(item => ({
        '@type': 'TableRow',
        cells: [
          { '@type': 'TableCell', content: item.injuryType },
          { '@type': 'TableCell', content: item.settlementAmount },
          { '@type': 'TableCell', content: `${item.settlementRange.min} - ${item.settlementRange.max}` },
          { '@type': 'TableCell', content: item.recoveryTime }
        ]
      }))
    };
    schemas.push(tableSchema);

    return schemas;
  };

  const schemas = generateSchemaMarkup();

  return (
    <div className="min-h-screen bg-white">
      {/* Schema Markup */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 px-4 sm:px-7 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-[#e8e2d8] shadow-md"
            : "bg-transparent"
        }`}
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: isScrolled ? 'auto' : 'none'
        }}
      >
        <Link href="/">
          <a className="flex items-center gap-1 sm:gap-2">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
              <span className="font-bold text-white text-xs sm:text-lg">CP</span>
            </div>
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-[#1a4a5a]">CasePort</span>
          </a>
        </Link>
        <a
          href="tel:+18002273669"
          className="bg-[#c4714a] text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* Hero Section - Cinematic Full-Bleed with Breadcrumb Inside */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] flex items-end overflow-hidden bg-black">
        {/* Full-Bleed Background Image */}
        <img
          src={getHeroImage(category.slug)}
          alt={`${category.title} scene`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: 'zoom-in 1.2s ease-out'
          }}
        />
        
        {/* Dark Gradient Overlay - Left to Right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        
        {/* Content - Bottom-Left Positioned */}
        <div className="relative z-10 w-full px-3 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24 lg:pb-32 pt-20 sm:pt-32">
          <div className="max-w-2xl">
            {/* Breadcrumb Inside Hero */}
            <nav className="mb-6 sm:mb-8" aria-label="breadcrumb">
              <ol className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-white/70">
                <li>
                  <Link href="/">
                    <a className="hover:text-white transition-colors">Home</a>
                  </Link>
                </li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li>
                  <Link href="/guides">
                    <a className="hover:text-white transition-colors">Guides</a>
                  </Link>
                </li>
                <li className="text-white/50"><ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" /></li>
                <li className="text-white font-medium">{category.title}</li>
              </ol>
            </nav>

            <p className="text-[#a8d5e2] text-xs font-semibold mb-2 sm:mb-4 tracking-widest uppercase opacity-90" style={{
              animation: 'fade-in-up 0.8s ease-out'
            }}>
              {category.title}
            </p>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-sans font-bold mb-3 sm:mb-6 leading-tight text-white" style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
              animation: 'slide-up 0.8s ease-out',
              letterSpacing: '-0.02em'
            }}>
              {data.heroTitle}
            </h1>
            
            <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/85 mb-6 sm:mb-10 leading-relaxed max-w-xl font-light" style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              animation: 'fade-in-up 1s ease-out 0.2s both'
            }}>
              {data.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4" style={{
              animation: 'fade-in-up 1s ease-out 0.4s both'
            }}>
              <a
                href="tel:+18002273669"
                className="inline-flex items-center justify-center bg-[#c4714a] text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[44px] sm:min-h-[48px] text-center text-xs sm:text-sm md:text-base"
              >
                Get Your Free Consultation
              </a>
              <a
                href="#testimonials"
                className="inline-flex items-center justify-center bg-white/15 text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg font-semibold hover:bg-white/25 transition-all border border-white/30 min-h-[44px] sm:min-h-[48px] backdrop-blur-sm text-xs sm:text-sm md:text-base"
              >
                See What Others Got Paid
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Answer - Featured Snippet Optimization */}
      <div id="quick-answer" data-animate className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef] border-b border-[#e8e2d8]" style={{
        opacity: visibleElements.has('quick-answer') ? 1 : 0,
        transform: visibleElements.has('quick-answer') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Average Settlement</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#c4714a]">{data.quickAnswer.average}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Success Rate</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.successRate}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Timeline</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.timeline}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">Upfront Cost</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#1a4a5a]">{data.quickAnswer.upfront}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credibility Section - Asymmetric Layout */}
      <div id="credibility" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white" style={{
        opacity: visibleElements.has('credibility') ? 1 : 0,
        transform: visibleElements.has('credibility') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-4">Our Track Record</p>
              <div className="text-6xl sm:text-7xl font-bold text-[#c4714a] mb-2" data-stat="recovered" data-value="2300000000" data-unit="USD">{data.recoveredAmount}</div>
              <p className="text-sm text-[#666] mb-12">{data.recoveredAmountContext}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.successRateContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2" data-stat="success-rate" data-value="92" data-unit="percent">{data.successRate}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.casesWonContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#1a4a5a] mb-2" data-stat="cases-won" data-value="5000" data-unit="count">{data.casesWon}</div>
                <p className="text-sm text-[#666]">Verified by state bar associations</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-[#999] tracking-widest uppercase mb-2">{data.avgSettlementContext}</p>
                <div className="text-4xl sm:text-5xl font-bold text-[#c4714a]" data-stat="avg-settlement" data-value="250000" data-unit="USD">{data.avgSettlement}</div>
                <p className="text-sm text-[#666] mt-2">5x more than going it alone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters - HowTo Schema */}
      <div id="why-matters" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]" style={{
        opacity: visibleElements.has('why-matters') ? 1 : 0,
        transform: visibleElements.has('why-matters') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            Why Your Case Is Worth More Than You Think
          </h2>
          <p className="text-lg text-[#555] leading-relaxed mb-12 font-light">
            {data.whyImportant}
          </p>
          
          {/* Key Points - HowTo Steps */}
          <div className="space-y-8">
            <div className="border-l-4 border-[#c4714a] pl-6" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2" itemProp="name">Catastrophic Injuries = Massive Settlements</h3>
              <p className="text-[#666] leading-relaxed" itemProp="text">Truck accidents don't cause minor injuries. They cause life-altering trauma. Spinal damage. Crushed limbs. Permanent disability. The law recognizes this. Your settlement reflects the severity—not what the insurance company wants to pay.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2" itemProp="name">Federal Regulations Are Your Weapon</h3>
              <p className="text-[#666] leading-relaxed" itemProp="text">Trucking companies are drowning in regulations. Speed limiters. Hours-of-service rules. Maintenance requirements. When they break these rules—and they do—you have leverage. Lots of it. The insurance company knows this.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2" itemProp="name">Multiple Defendants = Multiple Pockets</h3>
              <p className="text-[#666] leading-relaxed" itemProp="text">The driver. The trucking company. The truck manufacturer. The maintenance provider. The shipper. Each one has insurance. Each one is liable. More defendants means more money. It's that simple.</p>
            </div>

            <div className="border-l-4 border-[#c4714a] pl-6" itemProp="step" itemScope itemType="https://schema.org/HowToStep">
              <h3 className="text-xl font-semibold text-[#1a4a5a] mb-2" itemProp="name">Evidence Is Everywhere</h3>
              <p className="text-[#666] leading-relaxed" itemProp="text">Black box data. Logbooks. Maintenance records. Dispatch records. Cell phone records. Expert witnesses. The insurance company hopes you don't know these exist. They do. And they tell the truth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Real Testimonials - Asymmetric Staggered Layout */}
      <div id="testimonials" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white" style={{
        opacity: visibleElements.has('testimonials') ? 1 : 0,
        transform: visibleElements.has('testimonials') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-4 leading-tight">
            Real People. Real Money. Real Relief.
          </h2>
          <p className="text-lg text-[#666] mb-16 font-light">
            These aren't hypothetical numbers. These are real settlements from real people.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {data.testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                id={`testimonial-${idx}`} 
                data-animate 
                className="bg-white border border-[#e8e2d8] p-8 rounded-lg"
                style={{
                  opacity: visibleElements.has(`testimonial-${idx}`) ? 1 : 0,
                  transform: visibleElements.has(`testimonial-${idx}`) ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.6s ease-out ${idx * 0.1}s`,
                  marginTop: idx === 1 ? '2rem' : idx === 2 ? '4rem' : '0'
                }}
                itemProp="review"
                itemScope
                itemType="https://schema.org/Review"
              >
                <p className="text-[#555] text-base leading-relaxed mb-6 italic font-light" itemProp="reviewBody">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#e8e2d8] pt-4">
                  <p className="font-semibold text-[#1a4a5a] mb-1" itemProp="author">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#999] mb-3">{testimonial.location}</p>
                  <p className="text-lg font-bold text-[#c4714a]" data-settlement-amount={testimonial.settlementValue}>{testimonial.settlement}</p>
                  <meta itemProp="datePublished" content={testimonial.date} />
                  <meta itemProp="ratingValue" content="5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settlement Breakdown Table */}
      <div id="settlement-breakdown" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]" style={{
        opacity: visibleElements.has('settlement-breakdown') ? 1 : 0,
        transform: visibleElements.has('settlement-breakdown') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            Settlement Breakdown by Injury Type
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#c4714a]">
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Injury Type</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Average Settlement</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Range</th>
                  <th className="pb-4 font-semibold text-[#1a4a5a]">Recovery Time</th>
                </tr>
              </thead>
              <tbody>
                {data.settlementBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b border-[#e8e2d8] hover:bg-white transition-colors">
                    <td className="py-4 font-medium text-[#1a4a5a]">{item.injuryType}</td>
                    <td className="py-4 font-bold text-[#c4714a]">${item.settlementAmount}</td>
                    <td className="py-4 text-[#666]">${item.settlementRange.min} - ${item.settlementRange.max}</td>
                    <td className="py-4 text-[#666]">{item.recoveryTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attorney Comparison - Em-Dash Style */}
      <div id="attorney-comparison" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white" style={{
        opacity: visibleElements.has('attorney-comparison') ? 1 : 0,
        transform: visibleElements.has('attorney-comparison') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-16 leading-tight">
            Here's the Truth: You Need an Attorney
          </h2>
          
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">Going It Alone</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">Insurance company knows you're scared and desperate</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You don't know your case value (they do)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You don't have expert witnesses or evidence</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">You accept their first lowball offer</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">—</div>
                  <p className="text-[#666]">Average settlement: $30K-$50K</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e8e2d8]"></div>

            <div>
              <h3 className="text-2xl font-bold text-[#1a4a5a] mb-6">With Legal Representation</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">Insurance company knows you have backup—they negotiate differently</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We know your case value (and we fight for it)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We hire expert witnesses and gather evidence</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">We negotiate aggressively (they know we'll go to trial)</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-[#c4714a] font-bold text-xl">+</div>
                  <p className="text-[#666]">Average settlement: $150K-$300K (5x more)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Open Accordions */}
      <div id="faq" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]" style={{
        opacity: visibleElements.has('faq') ? 1 : 0,
        transform: visibleElements.has('faq') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {data.faqs.map((faq, idx) => (
              <details
                key={idx}
                open
                className="group border border-[#e8e2d8] rounded-lg bg-white"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors" itemProp="name">
                  {faq.question}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* People Also Ask - Open Accordions */}
      <div id="people-also-ask" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white" style={{
        opacity: visibleElements.has('people-also-ask') ? 1 : 0,
        transform: visibleElements.has('people-also-ask') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-12 leading-tight">
            People Also Ask
          </h2>
          
          <div className="space-y-4">
            {[
              { question: "What should I do after a truck accident?", answer: "Call 911, get medical attention, document the scene, exchange information with the driver, and contact an attorney immediately. Do not admit fault or sign anything without legal review." },
              { question: "How much is my case worth?", answer: "Your case value depends on injury severity, medical costs, lost wages, and liability. We've recovered settlements ranging from $50K to $1M+. Contact us for a free evaluation." },
              { question: "What if the insurance company denies my claim?", answer: "Don't accept a denial. Insurance companies often deny valid claims to save money. We can appeal the decision and fight for your rights." },
              { question: "Can I still recover if I was partially at fault?", answer: "Yes. Most states allow recovery even if you're partially at fault. The key is proving the other party was MORE at fault. We've won many cases with partial fault." }
            ].map((item, idx) => (
              <details
                key={idx}
                open
                className="group border border-[#e8e2d8] rounded-lg bg-white"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[#1a4a5a] hover:bg-[#f9f5ef] transition-colors" itemProp="name">
                  {item.question}
                  <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 text-[#666] leading-relaxed border-t border-[#e8e2d8]" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                  <p itemProp="text">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Urgency Section - Featured Snippet Optimization */}
      <div id="urgency" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a4a5a] to-[#2d6a7a] text-white" style={{
        opacity: visibleElements.has('urgency') ? 1 : 0,
        transform: visibleElements.has('urgency') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold mb-6 leading-tight">
            Your Deadline is Real. And It's Ticking.
          </h2>
          <p className="text-lg text-white/80 mb-4 leading-relaxed font-light">
            Statute of Limitations by State:
          </p>
          <p className="text-2xl font-bold text-[#a8d5e2] mb-12">
            California: 2 years | Texas: 2 years | Florida: 4 years | New York: 3 years
          </p>
          <p className="text-lg text-white/80 mb-12 leading-relaxed font-light">
            You have 2-4 years to file a lawsuit (depending on your state). After that, you lose your right to recover. Forever. No second chances. No appeals. The window closes. Don't let it.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {data.statutes.map((statute, idx) => (
              <div key={idx} itemProp="mainEntity" itemScope itemType="https://schema.org/Event">
                <p className="text-sm text-white/60 tracking-widest uppercase mb-2">{statute.state}</p>
                <p className="text-3xl font-bold" itemProp="duration">{statute.years} years</p>
                <meta itemProp="name" content={`Statute of Limitations - ${statute.state}`} />
              </div>
            ))}
          </div>

          <a
            href="tel:+18002273669"
            className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
          >
            Get Your Free Consultation Now
          </a>
        </div>
      </div>

      {/* Final CTA - Minimal */}
      <div id="final-cta" data-animate className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white" style={{
        opacity: visibleElements.has('final-cta') ? 1 : 0,
        transform: visibleElements.has('final-cta') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-sans font-bold text-[#1a4a5a] mb-8 leading-tight">
            You've Read This Far. You're Ready.
          </h2>
          <p className="text-lg text-[#666] mb-12 leading-relaxed font-light">
            You know you deserve to get paid. You know an attorney can help. You know the deadline is real. You know the insurance company is counting on you to do nothing. So what are you waiting for?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18002273669"
              className="inline-flex items-center justify-center bg-[#c4714a] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4855e] transition-all shadow-lg hover:shadow-xl min-h-[48px]"
            >
              Get Your Free Consultation
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center bg-[#f9f5ef] text-[#1a4a5a] px-8 py-4 rounded-lg font-semibold hover:bg-[#e8e2d8] transition-all border border-[#e8e2d8] min-h-[48px]"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule a Call
            </a>
          </div>
          <p className="text-sm text-[#999] mt-8">Available 24/7. Confidential. No pressure.</p>
        </div>
      </div>

      {/* Guides Section - Minimal */}
      <div id="guides" data-animate className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f9f5ef]" style={{
        opacity: visibleElements.has('guides') ? 1 : 0,
        transform: visibleElements.has('guides') ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.6s ease-out'
      }}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-sans font-bold text-[#1a4a5a] mb-8">Want to Learn More?</h3>
          
          {category.subGuides && category.subGuides.slice(0, 3).length > 0 && (
            <div className="grid md:grid-cols-3 gap-6 mb-8" itemScope itemType="https://schema.org/ItemList">
              {category.subGuides.slice(0, 3).map((guide, idx) => (
                <Link key={idx} href={`/guide/${category.slug}/${guide.slug}`}>
                  <a className="bg-white p-6 rounded-lg border border-[#e8e2d8] hover:border-[#c4714a] transition-colors block" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <h4 className="text-base font-semibold text-[#1a4a5a] mb-2" itemProp="name">{guide.title}</h4>
                    <p className="text-[#666] text-sm mb-3 font-light" itemProp="description">{guide.description}</p>
                    <div className="flex items-center text-[#c4714a] font-semibold text-sm">
                      Read <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                    <meta itemProp="position" content={String(idx + 1)} />
                  </a>
                </Link>
              ))}
            </div>
          )}

          <Link href="/guides">
            <a className="block bg-[#1a4a5a] text-white p-6 rounded-lg hover:bg-[#2d6a7a] transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="font-semibold mb-1">Browse All {category.title} Guides</h4>
                  <p className="text-sm opacity-80">Explore our complete library</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#c4714a] flex-shrink-0" />
              </div>
            </a>
          </Link>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA category={category.title} triggerSections={3} />
    </div>
  );
}
