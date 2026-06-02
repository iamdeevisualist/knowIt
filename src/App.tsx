/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  Clock, 
  Heart, 
  Sparkles, 
  AlertCircle,
  RefreshCw, 
  Info, 
  Cake, 
  Hourglass, 
  Activity, 
  Gift, 
  Compass,
  Smile,
  ShieldAlert,
  CalendarDays,
  Flame,
  Moon,
  Sun,
  Coffee,
  CheckCircle,
  TrendingUp,
  Award,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Western Zodiac signs utility
interface Zodiac {
  name: string;
  icon: string;
  description: string;
}

const getZodiacSign = (date: Date): Zodiac => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: "Aries", icon: "♈", description: "Bold, energetic, and a highly ambitious trailblazer." };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: "Taurus", icon: "♉", description: "Grounded, reliable, resilient, and an appreciator of fine details." };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: "Gemini", icon: "♊", description: "Expressive, witty, deeply inquisitive, and highly adaptive." };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: "Cancer", icon: "♋", description: "Compassionate, highly intuitive, protective, and sentimental." };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: "Leo", icon: "♌", description: "Vibrant, generous, proud, passionate, and a natural leader." };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: "Virgo", icon: "♍", description: "Practical, analytical, deeply meticulous, and helpful." };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: "Libra", icon: "♎", description: "Harmonious, diplomatic, artistic, and a social mediator." };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: "Scorpio", icon: "♏", description: "Intense, powerful, highly magnetic, and transformative." };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: "Sagittarius", icon: "♐", description: "Philosophical, highly optimistic, adventurous, and free-spirited." };
  }
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: "Capricorn", icon: "♑", description: "Disciplined, strategic, reliable, and exceptionally ambitious." };
  }
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: "Aquarius", icon: "♒", description: "Visionary, eccentric, independent, and deeply humanitarian." };
  }
  return { name: "Pisces", icon: "♓", description: "Dreamy, artistic, deeply empathetic, and spiritually intuitive." };
};

// Chinese Zodiac sign utility
const getChineseZodiac = (year: number): Zodiac => {
  const animals = [
    { name: "Rat", icon: "🐀", description: "Quick-witted, resourceful, versatile, and highly intuitive." },
    { name: "Ox", icon: "🐂", description: "Diligent, dependable, strong, and deeply determined." },
    { name: "Tiger", icon: "🐅", description: "Brave, competitive, unpredictable, and highly self-confident." },
    { name: "Rabbit", icon: "🐇", description: "Gentle, elegant, highly responsible, and empathetic." },
    { name: "Dragon", icon: "🐉", description: "Powerful, free-spirited, exceptionally energetic, and charismatic." },
    { name: "Snake", icon: "🐍", description: "Wise, enigmatic, thoughtful, and deeply insightful." },
    { name: "Horse", icon: "🐎", description: "Energetic, active, free-spirited, and enthusiastic." },
    { name: "Goat", icon: "🐑", description: "Calm, gentle, highly sympathetic, and deeply creative." },
    { name: "Monkey", icon: "🐒", description: "Sharp, smart, curious, highly innovative, and playful." },
    { name: "Rooster", icon: "🐓", description: "Observant, hardworking, courageous, and deeply loyal." },
    { name: "Dog", icon: "🐕", description: "Loyal, honest, highly trustworthy, and fiercely protective." },
    { name: "Pig", icon: "🐖", description: "Compassionate, generous, exceptionally diligent, and positive." }
  ];
  let index = (year - 4) % 12;
  if (index < 0) index += 12;
  return animals[index];
};

// Moon phase calculator at date of birth
interface MoonPhase {
  name: string;
  icon: string;
  description: string;
}

const getMoonPhase = (date: Date): MoonPhase => {
  const knownNewMoon = new Date(1970, 0, 7, 20, 35, 0).getTime();
  const msPerDay = 24 * 60 * 60 * 1000;
  const synodicPeriod = 29.530588853;
  
  const diffMs = date.getTime() - knownNewMoon;
  const diffDays = diffMs / msPerDay;
  const phaseCycle = (diffDays / synodicPeriod) % 1;
  const cycleVal = phaseCycle < 0 ? phaseCycle + 1 : phaseCycle;
  
  if (cycleVal < 0.03 || cycleVal > 0.97) {
    return { name: "New Moon", icon: "🌑", description: "Born under a dark sky, denoting mystery, intuition, and fresh horizons." };
  }
  if (cycleVal >= 0.03 && cycleVal < 0.22) {
    return { name: "Waxing Crescent", icon: "🌒", description: "Born under a sliver of light, signifying growth, resilience, and ambition." };
  }
  if (cycleVal >= 0.22 && cycleVal < 0.28) {
    return { name: "First Quarter", icon: "🌓", description: "Born under a split light, indicating decision, action, and powerful willpower." };
  }
  if (cycleVal >= 0.28 && cycleVal < 0.47) {
    return { name: "Waxing Gibbous", icon: "🌔", description: "Born under swelling light, bringing focus, refinement, and a quest for mastery." };
  }
  if (cycleVal >= 0.47 && cycleVal < 0.53) {
    return { name: "Full Moon", icon: "🌕", description: "Born under radiant illumination, highlighting passion, fullness of expression, and visual clarity." };
  }
  if (cycleVal >= 0.53 && cycleVal < 0.72) {
    return { name: "Waning Gibbous", icon: "🌖", description: "Born under receding shadows, expressing wisdom, processing, and a teaching nature." };
  }
  if (cycleVal >= 0.72 && cycleVal < 0.78) {
    return { name: "Last Quarter", icon: "🌗", description: "Born under split darkening sky, reflecting transition, release, and deep independence." };
  }
  return { name: "Waning Crescent", icon: "🌘", description: "Born under a fading crest, symbolizing contemplation, restoration, and spiritual depth." };
};

// Global standard WHO-compliant pediatric & adult preventative screeners parameters
interface HealthGuideline {
  category: string;
  ageRange: string;
  focusTitle: string;
  whoGuideline: string;
  primaryRisks: string[];
  recommendations: string[];
  screenings: { test: string; interval: string; desc: string }[];
  lifeExpectancyFact: string;
}

const getAgeGroupHealthInfo = (years: number): HealthGuideline => {
  if (years < 1) {
    return {
      category: "Neonatal & Infancy (0-1 yrs)",
      ageRange: "0 - 12 months",
      focusTitle: "Early Structural Development & Immunological Milestones",
      whoGuideline: "At least 30 minutes of prone position (tummy time) spread throughout the day while awake.",
      primaryRisks: ["Immunological vulnerability", "Dehydration risk", "Developmental asymmetry", "Nutritional deficiencies"],
      recommendations: [
        "Exclusive breastfeeding or appropriate formula nutrition for sound mucosal protection.",
        "Ensure standard pediatric growth metric tracing (height, weight, and head circumference parameters).",
        "Monitor sleep patterns (recommend 14–17 hours of cumulative daily sleep).",
        "Establish critical sensory stimulation routines through voice, contact, and visual tracking exercises."
      ],
      screenings: [
        { test: "Pediatric Wellness Exams", interval: "At 1, 2, 4, 6, 9, first year milestones", desc: "Monitors overall neuro-development, motor reflex triggers, and physical height-weight curves." },
        { test: "Standard Immunization Schedule", interval: "Continuous WHO protocols", desc: "Critical vaccine formulations including HepB, Rotavirus, DTaP, Hib, PCV13, IPV." },
        { test: "Hearing & Auditory Response Check", interval: "Early infancy", desc: "Confirms proper auditory nerve feedback and response to surrounding acoustic environments." }
      ],
      lifeExpectancyFact: "The global infant mortality rate has decreased by over 50% since 1990 due to universal immunization and access to clean neonatal sanitation. Keeping immunizations up-to-date is a key global standard."
    };
  } else if (years <= 5) {
    return {
      category: "Toddler & Early Childhood (1-5 yrs)",
      ageRange: "1 - 5 years",
      focusTitle: "Rapid Motor Skill Acquisition & Critical Immunity Fortification",
      whoGuideline: "At least 180 minutes of physical activities, with at least 60 minutes of moderate-to-vigorous intensity physical play.",
      primaryRisks: ["Accidental injury", "Nutritional selectiveness", "Respiratory contagions", "Dental caries"],
      recommendations: [
        "Introduce a highly varied whole-foods palette rich in calcium, iron, and primary essential vitamins.",
        "Limit comprehensive electronic screen exposure strictly following standard WHO suggestions (maximum 1 hour per day).",
        "Perform structured cognitive exercises including reading aloud, sorting, and speech amplification activities.",
        "Emphasize positive sleep practices to sustain 11–14 hours of mandatory rest (including naps)."
      ],
      screenings: [
        { test: "Vision & Strabismus screening", interval: "Every 1–2 years", desc: "Early detection of lazy eye (amblyopia) or refractive alignment anomalies." },
        { test: "Developmental & Speech Tracking", interval: "At 18, 24, 30, and 36 months", desc: "Assesses complex social milestones, language generation, and gross/fine motor control limits." },
        { test: "Dental Care Inspection", interval: "Every 6 months", desc: "Monitors initial primary tooth eruption charts and monitors for early decay." }
      ],
      lifeExpectancyFact: "Early childhood intervention (ages 1-5) in nutrition and active physical play increases cognitive reserves and lowers the lifelong likelihood of adolescent obesity by up to 28%."
    };
  } else if (years <= 12) {
    return {
      category: "Middle Childhood / Pre-Adolescent (6-12 yrs)",
      ageRange: "6 - 12 years",
      focusTitle: "Somatic Growth, Neurological Synaptic Pruning & Postural Health",
      whoGuideline: "At least 60 minutes of moderate-to-vigorous intensity physical activity daily, mostly aerobic.",
      primaryRisks: ["Sedentary lifestyle habits", "Postural misalignment", "Vision degradation (myopia)", "High sugar dietary intake"],
      recommendations: [
        "Encourage daily participation in structured athletics to improve skeletal density and cardiovascular vigor.",
        "Ensure proper ergonomic study seating posture and regular breaks from tablets and PCs during homework sessions.",
        "Establish standard oral self-care standards with fluoride-based brushing and flossing routines.",
        "Support robust social interaction and peer engagement to lay down strong emotional resilience pathways."
      ],
      screenings: [
        { test: "Standard Visual Acuity Exam", interval: "Annually or biannually", desc: "Catches early-onset myopia or astigmatism which often accelerates rapidly during school years." },
        { test: "Scoliosis & Spinal Alignment Audit", interval: "During rapid growth spurts", desc: "Checks for lateral spinal curvature variations during structural expansion stages." },
        { test: "Dental Sealants Check", interval: "Every 6 months", desc: "Protects permanent molar fissures against dental plaque accumulation." }
      ],
      lifeExpectancyFact: "Acquiring daily active sport or play habits in this stage reduces adult-onset metabolic syndrome risks by 35%, ensuring high vascular integrity across multiple decades."
    };
  } else if (years <= 19) {
    return {
      category: "Adolescence & Teen Development (13-19 yrs)",
      ageRange: "13 - 19 years",
      focusTitle: "Hormonal Balance, Emotional Resiliency & Circadian Rhythm Shifts",
      whoGuideline: "At least 60 minutes of moderate-to-vigorous physical activity daily, incorporating bone & muscle strengthening 3 days a week.",
      primaryRisks: ["Circadian phase delay (sleep deprivation)", "Mental wellness strains", "Dermatological challenges (cystic acne)", "Nutritional imbalances"],
      recommendations: [
        "Aim for 8–10 hours of quality sleep; understand that adolescent biological clocks naturally favor later sleep/wake times.",
        "Provide rich sources of calcium and iron to support intense bone growth and muscular vascular expansion phases.",
        "Cultivate open mental wellness dialogue, mindfulness practices, and positive body-image behaviors.",
        "Encourage deep hydration and clean skin hygiene protocols to control active oil gland secretions."
      ],
      screenings: [
        { test: "Mental Well-being Assessment", interval: "Annually at youth checkups", desc: "Proactive screening for anxiety, depressive indices, and stress management challenges." },
        { test: "Blood Pressure Monitoring", interval: "Annually", desc: "Detects genetic pre-dispositions toward developmental cardiovascular variations." },
        { test: "Lipid Baseline Profile", interval: "Once during teenage span", desc: "Assesses baseline vascular health trends, especially if there exists a family history of heart concerns." }
      ],
      lifeExpectancyFact: "Securing healthy psychological habits and supportive routines in adolescence cuts adult mental health challenges in half, representing a massive contributor to overall longevity."
    };
  } else if (years <= 39) {
    return {
      category: "Young Adulthood (20-39 yrs)",
      ageRange: "20 - 39 years",
      focusTitle: "Metabolic Peak Optimization, Postural Integrity & Preventative Baseline Setup",
      whoGuideline: "At least 150–300 minutes of moderate-intensity, or 75–150 minutes of vigorous-intensity aerobic physical activity weekly.",
      primaryRisks: ["Chronic screen-related strain", "Early high blood pressure", "Elevated LDL cholesterol", "Workplace burnout & chronic stress"],
      recommendations: [
        "Include twice-weekly strength training, targeting all primary muscle configurations, to sustain functional lean mass.",
        "Practice standard workspace ergonomics: align the monitor at eye level, keep standard lumbar support, and stand periodically.",
        "Engage in meal planning focused on complex fibers, quality proteins, and healthy fatty acids to prevent vascular plaque.",
        "Incorporate deliberate rest protocols to reduce cortisol spikes and strengthen biological immune defenses."
      ],
      screenings: [
        { test: "Blood Pressure Verification", interval: "Every 1–2 years", desc: "Guards against silent hypertension, preventing downstream stress on renal and cardiac systems." },
        { test: "Comprehensive Lipid Check", interval: "Every 4–5 years", desc: "Establishes baseline levels of HDL, LDL, and triglycerides to trace vascular plaque progression risks." },
        { test: "Blood Glucose & HbA1c Lab", interval: "Every 3 years (starting at 35)", desc: "Analyzes metabolic insulin sensitivity to catch pre-diabetic indicators early for complete reversal." }
      ],
      lifeExpectancyFact: "Optimizing your physical habits and maintaining steady blood pressure in your 20s and 30s can add up to 8 years of active, healthy lifespans by reducing early stress on the arterial walls."
    };
  } else if (years <= 59) {
    return {
      category: "Middle-Aged Adulthood (40-59 yrs)",
      ageRange: "40 - 59 years",
      focusTitle: "Cardiovascular Preservation, Glycemic Control & Structural Bone Maintenance",
      whoGuideline: "At least 150–300 minutes of moderate-intensity, or 75–150 minutes of vigorous weekly physical activity; muscle strengthening is essential.",
      primaryRisks: ["Arterial stiffness & cardiac strain", "Insulin resistance/Type II Diabetes", "Joint cartilage deterioration", "Metabolic deceleration"],
      recommendations: [
        "Incorporate low-impact aerobic activities (swimming, rowing, cycling) alongside standard weight bearing load routines.",
        "Actively track calorie balances and decrease processed sugar intake to adapt to lower default resting metabolic rates.",
        "Support joint flexibilities through regular dynamic stretching, active yoga, or systematic mobility work.",
        "Increase intake of antioxidants, omega-3s, and leafy greens to counteract long-term cellular oxidative damage."
      ],
      screenings: [
        { test: "Cardiovascular Vigor Assessments (ECG / Stress Tests)", interval: "Every 2–3 years", desc: "Checks mechanical heart outputs, electrical rhythm patterns, and coronary circulation capacities." },
        { test: "Colorectal Diagnostics (Colonoscopy)", interval: "Every 5–10 years (starting at 45)", desc: "Key diagnostic checkups (colonoscopy or high-sensitivity fit tests) for complete preventative care." },
        { test: "Cellular Health Screening (Mammography / Prostate Exams)", interval: "Annually or biannually", desc: "Decisive screenings for hormone-dependent tissues to diagnose cellular deviations very early." }
      ],
      lifeExpectancyFact: "Beginning systematic colonoscopy screenings starting at age 45 reduces the risk of colon malignancies by up to 90%, representing a foundational global preventative healthcare standard."
    };
  } else {
    return {
      category: "Senior Adulthood (60+ yrs)",
      ageRange: "60+ years",
      focusTitle: "Cellular Longevity, Joint Mobility, Bone Density & Sensorimotor Coordination",
      whoGuideline: "At least 150–300 minutes of moderate-intensity physical activity; prioritize physical balance and strength training on 3 or more days.",
      primaryRisks: ["Bone mineral density depletion", "Cognitive slowdown and memory decline", "Acoustic and visual resolution drops", "Decreased vascular compliance"],
      recommendations: [
        "Incorporate daily coordination and balance routines (Tai Chi, single-leg stands) to decrease the risk of falls.",
        "Maintain high dietary protein and calcium combined with Vitamin D to counteract age-related sarcopenia.",
        "Complete mentally stimulating activities like puzzle solving, continuous reading, or active language learning.",
        "Establish regular social engagements to sustain optimal neurological wellness and fight emotional isolation."
      ],
      screenings: [
        { test: "Bone Mineral Density Evaluation (DEXA Scan)", interval: "Every 2–4 years", desc: "Measures structural bone thickness to prevent fractures from unseen bone loss." },
        { test: "Ophthalmic & Auditory Evaluations", interval: "Annually", desc: "Sustains sensory inputs to keep the brain engaged and decrease accidental injury risks." },
        { test: "Geriatric Vaccination Panels", interval: "As suggested by physician", desc: "Critical protection boosters including Shingles (Shingrix), Pneumococcal complex, and annual Influenza/COVID updates." }
      ],
      lifeExpectancyFact: "Maintaining physical muscle strength and practicing coordination and balance controls after age 60 can reduce severe fall-related health incidents by over 40%, directly enabling steady high-quality longevity."
    };
  }
};

// Motion variants for smooth stagger animation on screening lists
const screeningListContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const screeningListItemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 180, 
      damping: 14 
    } 
  }
};

interface AgeResults {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  bornDayOfWeek: string;
  nextBirthdayCountdown: number;
  nextBirthdayDate: string;
  isBirthdayToday: boolean;
  zodiacWestern: Zodiac;
  zodiacChinese: Zodiac;
  moonPhase: MoonPhase;
  heartbeats: string;
  breaths: string;
  sleepHours: string;
  moonCyclePercent: number;
}

export default function App() {
  // Theme preference state with localStorage persistence
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Input fields
  const [dob, setDob] = useState(() => {
    // Elegant standard default: turn of the millennium
    return "2000-01-01";
  });
  const [birthTime, setBirthTime] = useState("08:00");
  const [hasTime, setHasTime] = useState(false);
  const [targetDate, setTargetDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [results, setResults] = useState<AgeResults | null>(null);

  // International Standard configuration
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem("dateFormat") || "ISO";
  });

  useEffect(() => {
    localStorage.setItem("dateFormat", dateFormat);
  }, [dateFormat]);

  // Track checked wellness status cards
  const [checkedScreenings, setCheckedScreenings] = useState<Record<string, boolean>>({});

  // Helper to format dates under dynamic formats select standard rules
  const formatInternationalStyle = (dateVal: Date | string | null | undefined): string => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    
    if (dateFormat === "ISO") {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else if (dateFormat === "EU") {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      // US style MM/DD/YYYY
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    }
  };

  // Maximum date constraint (cannot set DOB to future)
  const maxDateConstraint = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Main calculation orchestrator
  const performCalculation = () => {
    setError("");

    if (!dob) {
      setError("Please choose a valid Date of Birth.");
      return;
    }

    const todayDateStr = new Date().toISOString().split("T")[0];
    const bDayOnly = new Date(dob);
    const tDayOnly = new Date(targetDate);

    if (isNaN(bDayOnly.getTime())) {
      setError("The Date of Birth specified is not valid.");
      return;
    }

    if (isNaN(tDayOnly.getTime())) {
      setError("The target comparison date is not valid.");
      return;
    }

    // Combine Date and Time
    let birthDateTime: Date;
    if (hasTime && birthTime) {
      birthDateTime = new Date(`${dob}T${birthTime}`);
    } else {
      birthDateTime = new Date(`${dob}T00:00:00`);
    }

    // Capture standard or live target moment
    let targetDateTime: Date;
    if (targetDate === todayDateStr) {
      targetDateTime = new Date();
    } else {
      targetDateTime = new Date(`${targetDate}T23:59:59`);
    }

    if (birthDateTime > targetDateTime) {
      setError("The birth date & time cannot be in the future relative to the comparison date!");
      setResults(null);
      return;
    }

    // Core accurate age calculation logic
    let years = targetDateTime.getFullYear() - birthDateTime.getFullYear();
    let months = targetDateTime.getMonth() - birthDateTime.getMonth();
    let days = targetDateTime.getDate() - birthDateTime.getDate();

    if (days < 0) {
      const prevMonth = new Date(targetDateTime.getFullYear(), targetDateTime.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    // Difference conversions
    const diffMs = targetDateTime.getTime() - birthDateTime.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const totalMinutes = Math.max(0, Math.floor(totalSeconds / 60));
    const totalHours = Math.max(0, Math.floor(totalMinutes / 60));
    const totalDays = Math.max(0, Math.floor(totalHours / 24));
    const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
    const totalMonthsExact = years * 12 + months;

    // Day born on
    const bornDayOfWeek = birthDateTime.toLocaleDateString("en-US", { weekday: "long" });

    // Next Birthday countdown details
    const currentToday = new Date();
    const currentTodayZero = new Date(currentToday.getFullYear(), currentToday.getMonth(), currentToday.getDate());
    
    // Set up birthday target for this year
    let nextBday = new Date(currentToday.getFullYear(), birthDateTime.getMonth(), birthDateTime.getDate());
    
    if (nextBday < currentTodayZero) {
      nextBday.setFullYear(currentToday.getFullYear() + 1);
    }

    const isBirthdayToday = 
      currentToday.getMonth() === birthDateTime.getMonth() && 
      currentToday.getDate() === birthDateTime.getDate();

    const diffTime = nextBday.getTime() - currentTodayZero.getTime();
    const nextBirthdayCountdown = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nextBirthdayFormatted = nextBday.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    const zodiacWestern = getZodiacSign(birthDateTime);
    const zodiacChinese = getChineseZodiac(birthDateTime.getFullYear());
    const moonPhase = getMoonPhase(birthDateTime);

    // Dynamic estimate statistics
    const heartbeats = (totalMinutes * 80).toLocaleString();
    const breaths = (totalMinutes * 16).toLocaleString();
    const sleepHours = Math.floor(totalHours * 0.33).toLocaleString();

    // Secondary moon percentage representation
    const knownNewMoon = new Date(1970, 0, 7, 20, 35, 0).getTime();
    const synodicPeriod = 29.530588853;
    const diffMsMoon = birthDateTime.getTime() - knownNewMoon;
    const diffDaysMoon = diffMsMoon / (24 * 60 * 60 * 1000);
    const phaseCycle = (diffDaysMoon / synodicPeriod) % 1;
    const moonCyclePercent = Math.round((phaseCycle < 0 ? phaseCycle + 1 : phaseCycle) * 100);

    setResults({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths: totalMonthsExact,
      totalHours,
      totalMinutes,
      totalSeconds,
      bornDayOfWeek,
      nextBirthdayCountdown: isBirthdayToday ? 0 : nextBirthdayCountdown,
      nextBirthdayDate: nextBirthdayFormatted,
      isBirthdayToday,
      zodiacWestern,
      zodiacChinese,
      moonPhase,
      heartbeats,
      breaths,
      sleepHours,
      moonCyclePercent
    });
  };

  // Perform automatic initial calculation on mount
  useEffect(() => {
    performCalculation();
  }, []);

  // Set up active ticker for total seconds if viewing current "Today" age
  useEffect(() => {
    if (!results) return;

    const todayStr = new Date().toISOString().split("T")[0];
    if (targetDate !== todayStr) return;

    const interval = setInterval(() => {
      setResults((prev) => {
        if (!prev) return null;
        const nextSec = prev.totalSeconds + 1;
        const nextMin = Math.floor(nextSec / 60);
        const nextHrs = Math.floor(nextMin / 60);
        const nextHeart = (nextMin * 80).toLocaleString();
        const nextBreath = (nextMin * 16).toLocaleString();

        return {
          ...prev,
          totalSeconds: nextSec,
          totalMinutes: nextMin,
          totalHours: nextHrs,
          heartbeats: nextHeart,
          breaths: nextBreath
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [results?.bornDayOfWeek, targetDate]);

  // Copy to clipboard formatting utility
  const handleCopySummary = () => {
    if (!results) return;
    
    const summaryText = `🎉 My Age Calc Summary!\n` +
      `📅 Born on: ${results.bornDayOfWeek}, ${formatInternationalStyle(dob)}\n` +
      `🎂 Current Age: ${results.years} Years, ${results.months} Months, ${results.days} Days\n` +
      `⏱️ Total Elapsed Life: ${results.totalDays.toLocaleString()} Days | ${results.totalHours.toLocaleString()} Hours\n` +
      `💓 Heart beats (approx): ${results.heartbeats}\n` +
      `🌙 Moon Phase at Birth: ${results.moonPhase.icon} ${results.moonPhase.name}\n` +
      `⭐ Zodiac: ${results.zodiacWestern.icon} ${results.zodiacWestern.name} | 🐉 Chinese: ${results.zodiacChinese.icon} ${results.zodiacChinese.name}\n` +
      `⏳ Next Birthday Countdown: ${results.isBirthdayToday ? "Celebrating Today! 🎂🎉" : `${results.nextBirthdayCountdown} Days left`}\n` +
      `✨ Calculated with AgeCalc (Global Standard: ${dateFormat})`;

    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {});
  };

  return (
    <div id="app_container" className="min-h-screen bg-[#F8F9FA] dark:bg-neutral-950 text-[#1A1A1A] dark:text-neutral-50 font-sans flex flex-col selection:bg-red-100 dark:selection:bg-red-900 selection:text-red-950 dark:selection:text-red-100 transition-colors duration-200">
      
      {/* Premium Bento Header */}
      <header id="app_header" className="sticky top-0 z-40 bg-white dark:bg-neutral-900 shadow-sm border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#D32F2F] flex items-center justify-center text-white font-black text-lg transition-transform hover:scale-[1.05] shadow-sm">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#1A1A1A] dark:text-white">Age<span className="text-[#D32F2F]">Calc</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold text-[#D32F2F] bg-[#FFF5F5] dark:bg-red-950/40 rounded border border-red-150 dark:border-red-900/40">Bento Theme</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-4 sm:gap-6 text-sm font-semibold text-[#666666] dark:text-neutral-400">
              <a href="#calculator" className="hover:text-[#D32F2F] transition-colors py-1">Home</a>
              <a href="#milestones" className="hover:text-[#D32F2F] transition-colors py-1">Features</a>
              <a href="#astrology" className="hover:text-[#D32F2F] transition-colors py-1">About</a>
            </nav>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-[#D32F2F] hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-all cursor-pointer flex items-center justify-center active:scale-95"
              aria-label="Toggle Theme"
              id="theme_toggle_btn"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? "dark" : "light"}
                  initial={{ scale: 0.8, rotate: -30, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.8, rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Intro Banner */}
        <section id="banner" className="text-center max-w-3xl mx-auto mt-2">
          <span className="text-xs font-bold tracking-wider uppercase text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-full inline-block mb-3 border border-red-100/60 dark:border-red-900/40">
            Highly Accurate Metrics
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white sm:leading-tight">
            Calculate Your <span className="text-red-600">Exact Age</span> down to the very second.
          </h1>
          <p className="mt-3 text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            A minimalist diagnostic report revealing birthday countdowns, planetary placements, and lifelong astronomical parameters.
          </p>
        </section>

        {/* Form and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative mb-4">
          
          {/* Controls Input Box */}
          <section id="calculator" className="lg:col-span-4 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.08),0_8px_10px_-6px_rgba(211,47,47,0.08)] dark:shadow-none flex flex-col gap-6 sticky lg:top-24 transition-colors duration-200">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-850">
              <CalendarDays className="w-5 h-5 text-[#D32F2F]" />
              <h2 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white">Configure Birth</h2>
            </div>
 
            {/* In-app warning validation banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-red-50 dark:bg-red-950/30 border border-red-250 dark:border-red-900/40 text-red-900 dark:text-red-200 p-3.5 rounded-2xl flex items-start gap-2 text-sm leading-relaxed"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 text-[#D32F2F] mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Calculation Error</span>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
 
            <div className="flex flex-col gap-4">
              {/* International standard select */}
              <div className="flex flex-col gap-1.5 pb-1">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-wider flex items-center justify-between">
                  <span>Date Standard Template</span>
                  <span className="text-[10px] font-bold text-[#D32F2F] tracking-wide bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">ISO Compliant</span>
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[#FFF5F5]/30 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setDateFormat("ISO")}
                    className={`text-[10px] sm:text-[11px] font-bold py-1.5 px-1 rounded-lg cursor-pointer transition-all ${
                      dateFormat === "ISO" 
                        ? "bg-[#D32F2F] text-white shadow-sm" 
                        : "text-[#666666] dark:text-neutral-400 hover:text-[#D32F2F]"
                    }`}
                  >
                    ISO 8601
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFormat("EU")}
                    className={`text-[10px] sm:text-[11px] font-bold py-1.5 px-1 rounded-lg cursor-pointer transition-all ${
                      dateFormat === "EU" 
                        ? "bg-[#D32F2F] text-white shadow-sm" 
                        : "text-[#666666] dark:text-neutral-400 hover:text-[#D32F2F]"
                    }`}
                  >
                    Intl/EU
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFormat("US")}
                    className={`text-[10px] sm:text-[11px] font-bold py-1.5 px-1 rounded-lg cursor-pointer transition-all ${
                      dateFormat === "US" 
                        ? "bg-[#D32F2F] text-white shadow-sm" 
                        : "text-[#666666] dark:text-neutral-400 hover:text-[#D32F2F]"
                    }`}
                  >
                    US Standard
                  </button>
                </div>
              </div>

              {/* DOB Picker */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="dob_input" className="text-xs font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-wider">Date of Birth</label>
                <div className="relative">
                  <input
                    id="dob_input"
                    type="date"
                    value={dob}
                    max={maxDateConstraint}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#FFF5F5]/30 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[15px] font-medium text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100/50 dark:focus:ring-red-900/20 transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:hover:opacity-80 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>
 
              {/* Time of Birth Toggle */}
              <div className="pt-1 flex flex-col gap-3">
                <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={hasTime}
                    onChange={(e) => setHasTime(e.target.checked)}
                    className="w-4 h-4 rounded-md border-neutral-300 dark:border-neutral-700 text-[#D32F2F] focus:ring-[#D32F2F] focus:ring-offset-0 accent-[#D32F2F]"
                  />
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-[#D32F2F] transition-colors font-sans">Include Birth Time For Sec Accuracy</span>
                </label>
 
                <AnimatePresence>
                  {hasTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden flex flex-col gap-1"
                    >
                      <label htmlFor="birth_time_input" className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1">Birth Time (Local)</label>
                      <input
                        id="birth_time_input"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full bg-[#FFF5F5]/30 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100/50 dark:focus:ring-red-900/20 transition-all dark:[&::-webkit-calendar-picker-indicator]:invert"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Target Comparison Date */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex flex-col gap-1.5">
                <label htmlFor="target_date_input" className="text-xs font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-wider flex items-center justify-between">
                  <span>Calculate Age As Of</span>
                  {targetDate !== maxDateConstraint && (
                    <button 
                      onClick={() => setTargetDate(maxDateConstraint)}
                      className="text-[10px] normal-case font-bold text-[#D32F2F] hover:text-[#B71C1C] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset to Today
                    </button>
                  )}
                </label>
                <input
                  id="target_date_input"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-[#FFF5F5]/30 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-[15px] font-medium text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100/50 dark:focus:ring-red-900/20 transition-all cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
 
              {/* Main Calculate Trigger */}
              <button
                type="button"
                onClick={performCalculation}
                className="w-full mt-2 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white font-extrabold rounded-xl py-3.5 px-4 font-sans text-[15px] hover:shadow-red-200 dark:hover:shadow-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D32F2F]/15 active:scale-[0.985]"
              >
                <Activity className="w-4 h-4" /> Calculate Age
              </button>
            </div>
 
            <div className="bg-[#FFF5F5]/50 dark:bg-neutral-950/30 p-4 rounded-xl border border-red-100/30 dark:border-red-950/20">
              <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-1">Privacy Safe</span>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                All estimations occur purely on your modern browser engine. Absolutely no dates are transmitted across servers.
              </p>
            </div>
          </section>
 
          {/* Results Overview Block */}
          <section id="results" className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  key={`${dob}-${targetDate}-${hasTime}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8"
                >
                  
                  {/* Premium Bento Grid Results Panel */}
                  <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.08),0_8px_10px_-6px_rgba(211,47,47,0.08)] dark:shadow-none relative overflow-hidden flex flex-col gap-6 transition-colors duration-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/20 rounded-full blur-3xl -z-10 -mr-20 -mt-20"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#D32F2F]">Diagnostic Report</span>
                        <h3 className="text-xl font-extrabold text-[#1A1A1A] dark:text-white mt-0.5">Your Life Bento Grid</h3>
                      </div>
                      
                      {/* Copy summary card */}
                      <button
                        onClick={handleCopySummary}
                        className="px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-950 hover:bg-neutral-200/80 dark:hover:bg-neutral-850 rounded-xl transition-all cursor-pointer flex items-center self-start sm:self-auto gap-1.5 active:scale-[0.97]"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">Copied Age Calc!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#D32F2F]" />
                            <span>Copy Age Card</span>
                          </>
                        )}
                      </button>
                    </div>
 
                    {/* Highly Visual 3-Column Bento Grid matching exact specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      
                      {/* Years Bento Item */}
                      <div className="bg-[#FFF5F5] dark:bg-neutral-950/40 border border-red-100/40 dark:border-neutral-800/40 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm">
                        <div>
                          <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-1">Years</span>
                          <div className="font-mono text-4xl sm:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
                            {results.years}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#666666] dark:text-neutral-400 mt-3 block">Circuits around the sun</span>
                      </div>
 
                      {/* Months Bento Item */}
                      <div className="bg-[#FFF5F5] dark:bg-neutral-950/40 border border-red-100/40 dark:border-neutral-800/40 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm">
                        <div>
                          <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-1">Months</span>
                          <div className="font-mono text-4xl sm:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
                            {results.months}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#666666] dark:text-neutral-400 mt-3 block">Full lunar cycles</span>
                      </div>
 
                      {/* Days Bento Item */}
                      <div className="bg-[#FFF5F5] dark:bg-neutral-950/40 border border-red-100/40 dark:border-neutral-800/40 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm">
                        <div>
                          <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-1">Days</span>
                          <div className="font-mono text-4xl sm:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
                            {results.days}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#666666] dark:text-neutral-400 mt-3 block">Sunrises witnessed</span>
                      </div>
 
                      {/* Celebration Countdown (Large Item: Spans 2 grid columns) */}
                      <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] text-white rounded-2xl p-6 flex flex-col justify-between shadow-md shadow-red-200/40 dark:shadow-none transition-all duration-200 hover:scale-[1.005]">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-red-100/80 uppercase tracking-wider block mb-1">Countdown</span>
                            {results.isBirthdayToday ? (
                              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight animate-bounce">
                                Celebrating Today! 🎂✨
                              </div>
                            ) : (
                              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono">
                                {results.nextBirthdayCountdown} Days
                              </div>
                            )}
                          </div>
                          <Gift className="w-5 h-5 text-white/50" />
                        </div>
                        <span className="text-sm font-medium text-white/90 mt-4 block">
                          {results.isBirthdayToday 
                            ? "Happy Birthday! Today marks your exact birth anniversary." 
                            : `Until your next celebration (${formatInternationalStyle(results.nextBirthdayDate)})`
                          }
                        </span>
                      </div>

                      {/* Milestone Item */}
                      <div className="bg-[#FFF5F5] dark:bg-neutral-950/40 border border-red-100/40 dark:border-neutral-800/40 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.01] hover:shadow-sm">
                        <div>
                          <span className="text-[11px] font-bold text-[#D32F2F] uppercase tracking-wider block mb-1">Milestone</span>
                          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight">
                            {results.totalDays.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#666666] dark:text-neutral-400 mt-3 block">Total days lived</span>
                      </div>

                    </div>

                    {/* Elegant textual overview sentence inside the main Bento */}
                    <div className="bg-[#FFF5F5] dark:bg-neutral-950/40 border border-red-100/30 dark:border-red-950/20 py-4 px-5 rounded-2xl flex items-center gap-3">
                      <div className="p-2 bg-[#D32F2F] rounded-xl text-white">
                        <Cake className="w-4.5 h-4.5" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 leading-relaxed">
                        You are exactly <span className="text-[#D32F2F] font-extrabold">{results.years} years, {results.months} months, and {results.days} days</span> old.
                      </p>
                    </div>
                  </div>

                  {/* Real-time Ticker Metrics */}
                  <div id="milestones" className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#D32F2F]" />
                      <h3 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white font-sans">Lifelong Relational Breakdown</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Months */}
                      <div className="bg-white dark:bg-neutral-900 hover:border-red-100 dark:hover:border-red-900/40 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none transition-colors flex flex-col justify-between group">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-[#D32F2F] transition-colors">Total Months</span>
                          <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        </div>
                        <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
                          {results.totalMonths.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold tracking-tight mt-1.5 inline-block">completed life months</span>
                      </div>

                      {/* Weeks */}
                      <div className="bg-white dark:bg-neutral-900 hover:border-red-100 dark:hover:border-red-900/40 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none transition-colors flex flex-col justify-between group">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-[#D32F2F] transition-colors">Total Weeks</span>
                          <Compass className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        </div>
                        <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
                          {results.totalWeeks.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold tracking-tight mt-1.5 inline-block">completed life weeks</span>
                      </div>

                      {/* Days */}
                      <div className="bg-white dark:bg-neutral-900 hover:border-red-100 dark:hover:border-red-900/40 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none transition-colors flex flex-col justify-between group">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-[#D32F2F] transition-colors">Total Days</span>
                          <Hourglass className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        </div>
                        <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
                          {results.totalDays.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold tracking-tight mt-1.5 inline-block">overall solar days</span>
                      </div>

                      {/* Hours */}
                      <div className="bg-white dark:bg-neutral-900 hover:border-red-100 dark:hover:border-red-900/40 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none transition-colors flex flex-col justify-between group">
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#999999] dark:text-[#999999] group-hover:text-[#D32F2F] transition-colors font-sans">Total Hours</span>
                          <Coffee className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        </div>
                        <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
                          {results.totalHours.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold tracking-tight mt-1.5 inline-block">hours of dynamic existence</span>
                      </div>
                    </div>

                    {/* Highly responsive real-time absolute ticker seconds lived */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.06)] dark:shadow-none flex flex-col md:flex-row md:items-center justify-between gap-4 border border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-xl bg-[#FFF5F5] dark:bg-neutral-950 border border-red-100 dark:border-red-950/20 text-[#D32F2F] flex items-center justify-center">
                          <Clock className="w-4 h-4 animate-spin-slow text-[#D32F2F]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-[#D32F2F]">Living Elapsed Second Counter</span>
                          <h4 className="text-base font-extrabold text-[#1A1A1A] dark:text-white">Continuous Precision Duration</h4>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2.5 bg-[#FFF5F5] dark:bg-neutral-950 px-5 py-3 rounded-2xl border border-red-100/50 dark:border-red-950/20 font-mono">
                        <span className="text-2xl sm:text-3xl font-black tracking-wider text-[#D32F2F]">
                          {results.totalSeconds.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-widest">Seconds Lived</span>
                      </div>
                    </div>
                  </div>

                  {/* Longevity milestones & physiological estimation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Heart beats */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none flex flex-col gap-3 group transition-colors duration-200">
                      <div className="flex items-center gap-2 text-[#D32F2F]">
                        <div className="p-1.5 bg-[#FFF5F5] dark:bg-neutral-950 rounded-lg group-hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4 text-[#D32F2F] animate-pulse" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Beating Heart</span>
                      </div>
                      <div>
                        <div className="font-mono text-xl font-bold text-[#1A1A1A] dark:text-white">{results.heartbeats}</div>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">Approximate total heart beats based on rest-rate of 80 bpm.</span>
                      </div>
                    </div>

                    {/* Breaths estimation */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none flex flex-col gap-3 group transition-colors duration-200">
                      <div className="flex items-center gap-2 text-sky-600">
                        <div className="p-1.5 bg-sky-50 dark:bg-sky-950/30 rounded-lg group-hover:scale-110 transition-transform">
                          <Activity className="w-4 h-4 text-sky-600" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Breaths Taken</span>
                      </div>
                      <div>
                        <div className="font-mono text-xl font-bold text-[#1A1A1A] dark:text-white">{results.breaths}</div>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">Estimated continuous breaths taken based on avg of 16 breaths per min.</span>
                      </div>
                    </div>

                    {/* Sleeping duration */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.02)] dark:shadow-none flex flex-col gap-3 group transition-colors duration-200">
                      <div className="flex items-center gap-2 text-violet-600">
                        <div className="p-1.5 bg-violet-50 dark:bg-violet-950/30 rounded-lg group-hover:scale-110 transition-transform">
                          <Moon className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sleeping Duration</span>
                      </div>
                      <div>
                        <div className="font-mono text-xl font-bold text-[#1A1A1A] dark:text-white">{results.sleepHours} hrs</div>
                        <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 block">Estimated cumulative hours spent dreaming and resting (1/3 of life).</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic WHO-Compliant Age Health Index Section */}
                  {(() => {
                    const healthData = getAgeGroupHealthInfo(results.years);
                    const screenings = healthData.screenings;
                    const checkedCount = screenings.filter(s => checkedScreenings[s.test]).length;
                    const compliancePercent = Math.round((checkedCount / screenings.length) * 100);

                    return (
                      <div id="health_indices" className="flex flex-col gap-5 mt-2">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-red-600" />
                          <div>
                            <h3 className="font-extrabold text-lg text-[#1A1A1A] dark:text-white font-sans flex items-center gap-2">
                              <span>Global Standard Health Index</span>
                              <span className="text-[10px] px-2 py-0.5 font-bold uppercase bg-red-1050 bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-900/40 rounded text-[#D32F2F]">WHO & CDC Guidelines</span>
                            </h3>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(211,47,47,0.04)] dark:shadow-none flex flex-col gap-6 transition-colors duration-200">
                          
                          {/* Banner Info */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#D32F2F] bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900/40">
                                  {healthData.category}
                                </span>
                                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                                  Lifespan Range: {healthData.ageRange}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mt-2 font-sans">
                                {healthData.focusTitle}
                              </h4>
                            </div>

                            {/* Compliance Tracker Meter */}
                            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 p-4 rounded-2xl md:w-64 shrink-0 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Standard Compliance</span>
                                <span className="text-[#D32F2F]">{compliancePercent}%</span>
                              </div>
                              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gradient-to-r from-[#D32F2F] to-red-500 h-full rounded-full transition-all duration-300" 
                                  style={{ width: `${compliancePercent}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 block leading-tight font-sans">
                                Complete your age checkups below to verify index alignment.
                              </span>
                            </div>
                          </div>

                          {/* Body details layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            
                            {/* Focus health advice & parameters */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                              <div className="bg-red-50/20 dark:bg-neutral-950/40 border border-red-100/30 dark:border-red-950/20 p-5 rounded-2xl flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-[#D32F2F]">
                                  <Activity className="w-4 h-4" />
                                  <h5 className="text-xs font-bold uppercase tracking-wider font-sans">WHO Physical Activity Norm</h5>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic font-sans pl-1 border-l-2 border-red-300">
                                  "{healthData.whoGuideline}"
                                </p>
                              </div>

                              <div className="bg-[#FFF5F5]/30 dark:bg-neutral-950/40 border border-red-100/30 dark:border-neutral-850 p-5 rounded-2xl flex flex-col gap-2 flex-grow justify-between">
                                <div>
                                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 mb-1">
                                    <ShieldAlert className="w-4 h-4" />
                                    <h5 className="text-xs font-bold uppercase tracking-wider font-sans">Primary Age Risk Focus</h5>
                                  </div>
                                  <ul className="flex flex-col gap-1.5 pl-1">
                                    {healthData.primaryRisks.map((risk, index) => (
                                      <li key={index} className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                                        <span>{risk}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="text-[10px] mt-4 pt-3 border-t border-red-100/40 dark:border-red-950/20 text-neutral-400 dark:text-neutral-500 leading-relaxed font-sans">
                                  Standard actuarial wellness projections show that managing early risk signals mitigates systemic chronic threats.
                                </div>
                              </div>
                            </div>

                            {/* Recommendations list */}
                            <div className="lg:col-span-4 bg-neutral-50/30 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col gap-4">
                              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
                                <CheckCircle className="w-4 h-4 text-[#D32F2F]" />
                                <h5 className="text-xs font-bold uppercase tracking-wider font-sans">Healthy Habits Advice</h5>
                              </div>
                              <div className="flex flex-col gap-4">
                                {healthData.recommendations.map((rec, index) => (
                                  <div key={index} className="flex gap-2 text-xs">
                                    <span className="font-mono text-[#D32F2F] font-bold">0{index + 1}.</span>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                      {rec}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Interactive Screening Status Checkoffs */}
                            <div className="lg:col-span-4 bg-neutral-50/40 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl flex flex-col gap-4">
                              <div className="flex items-center justify-between text-neutral-700 dark:text-neutral-250">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-[#D32F2F]" />
                                  <h5 className="text-xs font-bold uppercase tracking-wider font-sans">Interval Screenings</h5>
                                </div>
                                <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">Dynamic checklist</span>
                              </div>
                              <motion.div 
                                key={results.years}
                                variants={screeningListContainerVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col gap-3"
                              >
                                {screenings.map((screen, idx) => {
                                  const isChecked = !!checkedScreenings[screen.test];
                                  return (
                                    <motion.button
                                      variants={screeningListItemVariants}
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setCheckedScreenings((prev) => ({
                                          ...prev,
                                          [screen.test]: !prev[screen.test]
                                        }));
                                      }}
                                      className="text-left select-none p-3 rounded-xl border border-neutral-100 dark:border-neutral-850 hover:bg-white dark:hover:bg-neutral-950 transition-all flex items-start gap-2.5 cursor-pointer hover:shadow-sm"
                                    >
                                      <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                        isChecked 
                                          ? "bg-[#D32F2F] border-[#D32F2F] text-white shadow-sm" 
                                          : "border-neutral-300 dark:border-neutral-700 text-transparent"
                                      }`}>
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </div>
                                      <div>
                                        <span className={`text-[11px] font-bold block leading-relaxed ${
                                          isChecked ? "text-neutral-400 dark:text-neutral-500 line-through" : "text-neutral-800 dark:text-neutral-200"
                                        }`}>
                                          {screen.test}
                                        </span>
                                        <span className="text-[9px] font-bold text-[#D32F2F] block mt-0.5 uppercase tracking-wide">
                                          Interval: {screen.interval}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block leading-normal mt-0.5">
                                          {screen.desc}
                                        </span>
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            </div>

                          </div>

                          {/* Fact banner */}
                          <div className="bg-red-50/20 dark:bg-neutral-950/40 p-4 sm:p-5 rounded-2xl border border-neutral-100/80 dark:border-neutral-850 text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed font-sans">
                            <span className="font-extrabold uppercase tracking-wide text-[#D32F2F] block mb-1">Global Standard Health Insight</span>
                            {healthData.lifeExpectancyFact}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Astrology & Celestial Placements at Birth */}
                  <div id="astrology" className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D32F2F]" />
                      <h3 className="font-extrabold text-lg text-[#1A1A1A]">Celestial & Natural Alignments</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Day born on details */}
                      <div className="bg-[#FFF5F5]/30 dark:bg-neutral-900/40 border border-red-100/40 dark:border-neutral-800/40 p-6 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#D32F2F]">
                          <Award className="w-4 h-4 text-[#D32F2F] shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#D32F2F] dark:text-red-400">Birth Day Origin</span>
                        </div>
                        <div>
                          <h5 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">Born on a</h5>
                          <h4 className="text-xl font-extrabold text-[#1A1A1A] dark:text-white mt-0.5">{results.bornDayOfWeek}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1.5">
                            You entered our solar cycle on a brilliant {results.bornDayOfWeek}, giving unique characteristics to your timeline start!
                          </p>
                        </div>
                      </div>

                      {/* Western Zodiac & Chinese Zodiac */}
                      <div className="bg-[#FFF5F5]/30 dark:bg-neutral-900/40 border border-red-100/40 dark:border-neutral-800/40 p-6 rounded-2xl flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-850 dark:text-amber-500">
                            <Compass className="w-4 h-4 text-amber-700 dark:text-amber-500 shrink-0" />
                            <span className="text-xs font-bold uppercase tracking-wider font-sans">Sun & Animal Sign</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                          <div className="text-3xl bg-white dark:bg-neutral-950 border border-amber-200/50 dark:border-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            {results.zodiacWestern.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/30 font-sans">Zodiac: {results.zodiacWestern.name}</span>
                            <span className="text-[10px] font-bold text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/40 block mt-1 w-max font-sans">Year: {results.zodiacChinese.icon} {results.zodiacChinese.name}</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                          Your western sign represents as <span className="font-semibold">{results.zodiacWestern.name}</span> ({results.zodiacWestern.description}). Your Chinese lunar year symbol represents the <span className="font-semibold">{results.zodiacChinese.name}</span>.
                        </p>
                      </div>

                      {/* Lunar placement moon phase */}
                      <div className="bg-[#FFF5F5]/30 dark:bg-neutral-900/40 border border-red-100/40 dark:border-neutral-800/40 p-6 rounded-2xl flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-2 text-violet-800 dark:text-violet-400">
                          <Moon className="w-4 h-4 text-violet-700 dark:text-violet-440 shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-wider font-sans">Luminance Phase</span>
                        </div>

                        <div className="flex items-center gap-4 py-1">
                          <div className="text-3xl bg-white dark:bg-neutral-950 border border-violet-200/50 dark:border-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            {results.moonPhase.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-violet-800 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/40 px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-900/40 font-sans">{results.moonPhase.name}</span>
                            <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 block mt-1 pl-0.5 font-sans">{results.moonCyclePercent}% lunar cycle complete</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                          {results.moonPhase.description}
                        </p>
                      </div>

                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-12 text-center text-neutral-400 dark:text-neutral-500 shadow-sm dark:shadow-none flex flex-col items-center gap-3 transition-colors duration-200">
                  <div className="w-14 h-14 bg-neutral-50 dark:bg-neutral-950 rounded-2xl flex items-center justify-center text-neutral-300 dark:text-neutral-700">
                    <Info className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-lg">No Birth Data Formulated</h4>
                  <p className="text-sm max-w-sm mx-auto text-neutral-400 dark:text-neutral-500 leading-relaxed">
                    Select your exact solar birth date in the config panel to view comprehensive life metrics and cosmological placings.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </section>

        </div>

      </main>

      {/* Styled Footer */}
      <footer id="app_footer" className="bg-neutral-900 border-t border-neutral-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-650 flex items-center justify-center text-white text-sm font-bold bg-zinc-800 border border-neutral-850">
              ⚔️
            </div>
            <div>
              <span className="font-black tracking-tight text-white">AgeCalc</span>
              <span className="text-[10px] text-zinc-500 block">Modern Solar Age Assessor</span>
            </div>
          </div>

          <div className="text-center sm:text-left text-xs text-zinc-500 flex flex-col gap-1.5 sm:max-w-md">
            <span>&copy; {new Date().getFullYear()} AgeCalc. All rights reserved globally.</span>
            <span className="text-zinc-400">Created by <span className="text-zinc-200 font-semibold hover:text-[#D32F2F] transition-colors">deeVisualist</span></span>
            <span className="text-[11px] text-zinc-650 text-zinc-600">Est. planetary cycles computed strictly compliant to standard synchronized Gregorian formats.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
            <a href="#calculator" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <span className="text-zinc-700">|</span>
            <a href="#calculator" className="hover:text-red-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}
