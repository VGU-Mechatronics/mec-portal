/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Sun, 
  Moon, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Calendar, 
  Cpu, 
  Bot,
  ShieldAlert, 
  ClipboardList, 
  Briefcase, 
  Award, 
  GraduationCap, 
  CheckCircle, 
  Globe, 
  HelpCircle, 
  Mail, 
  Search, 
  ExternalLink, 
  MapPin, 
  AlertCircle, 
  Inbox, 
  UserCheck, 
  ChevronDown, 
  Building, 
  CalendarDays,
  FileBadge,
  ArrowUpRight,
  Info,
  Check,
  Building2,
  Users,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PortalCardComponent from './components/PortalCardComponent';
import { 
  DUMMY_DRIVE_URL, 
  DUMMY_FORM_URL, 
  PortalTabId, 
  PORTAL_TABS,
  EXAM_CARDS,
  SCHEDULE_CARDS,
  CURRICULUM_CARDS,
  REGULATION_CARDS,
  FORM_CARDS,
  INTERNSHIP_CARDS,
  SCHOLARSHIP_CARDS,
  THESIS_CARDS,
  GRADUATION_CARDS,
  EXCHANGE_CARDS,
  FAQ_ITEMS,
  STAFF_MEMBERS
} from './data/mecPortalData';

export interface SearchItem {
  title: string;
  description: string;
  type: 'PDF' | 'LINK' | 'DRIVE' | 'FORM' | 'EXCEL' | 'DOCX' | 'FAQ';
  category: string;
  url?: string;
}

const SEARCH_POOL: SearchItem[] = [
  ...FORM_CARDS.map(c => ({ ...c, category: 'Forms & Petitions' as string })),
  ...EXAM_CARDS.map(c => ({ ...c, category: 'Exam Administrative Forms' as string })),
  ...SCHEDULE_CARDS.map(c => ({ ...c, category: 'Schedules' as string })),
  ...CURRICULUM_CARDS.map(c => ({ ...c, category: 'Curriculum & Handbooks' as string })),
  ...REGULATION_CARDS.map(c => ({ ...c, category: 'Academic Regulations' as string })),
  ...INTERNSHIP_CARDS.map(c => ({ ...c, category: 'Internship Documents' as string })),
  ...THESIS_CARDS.map(c => ({ ...c, category: 'Bachelor Thesis Milestones' as string })),
  ...GRADUATION_CARDS.map(c => ({ ...c, category: 'Graduation Checklists' as string })),
  ...SCHOLARSHIP_CARDS.map(c => ({ ...c, category: 'Scholarships & Grants' as string })),
  ...EXCHANGE_CARDS.map(c => ({ ...c, category: 'HAW Hamburg Exchange' as string })),
  ...FAQ_ITEMS.map(f => ({
    title: f.question,
    description: f.answer,
    type: 'FAQ' as const,
    category: 'Frequently Asked Questions' as string
  }))
];

export default function App() {
  const [activeTab, setActiveTab] = useState<PortalTabId>('guidelines');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mec_portal_theme');
    // Default to dark mode immediately upon first load
    return saved ? saved === 'dark' : true;
  });
  const [timeStr, setTimeStr] = useState<string>('');
  const [faqOpenState, setFaqOpenState] = useState<{ [key: number]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedCurriculumYear, setSelectedCurriculumYear] = useState<string>('all');
  const [selectedMajor, setSelectedMajor] = useState<string>('robotics');
  
  // Interactive Merit Scholarship Checklist states
  const [chkPassedAll, setChkPassedAll] = useState<boolean>(false);
  const [chkNoFail, setChkNoFail] = useState<boolean>(false);
  const [chkNoRetake, setChkNoRetake] = useState<boolean>(false);
  const [chkGPAVal, setChkGPAVal] = useState<string>('');
  const [chkGPAScale, setChkGPAScale] = useState<'german' | 'vietnamese'>('german');
  const [chkIELTS, setChkIELTS] = useState<boolean>(false);
  const [chkNoDisciplinary, setChkNoDisciplinary] = useState<boolean>(false);
  const [chkTuitionPaid, setChkTuitionPaid] = useState<boolean>(false);

  // 4-Year Full Merit Scholarship states
  const [chkFullIELTS, setChkFullIELTS] = useState<boolean>(false);
  const [chkFullCatA, setChkFullCatA] = useState<boolean>(false);
  const [chkFullCumulativeGPA, setChkFullCumulativeGPA] = useState<string>('');
  const [chkFullGPAScale, setChkFullGPAScale] = useState<'german' | 'vietnamese'>('german');
  const [scholarshipSubTab, setScholarshipSubTab] = useState<'rules' | 'full' | 'checker'>('rules');
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Google Analytics (GA4) Tab Navigation Tracking
  useEffect(() => {
    const tabObj = PORTAL_TABS.find(t => t.id === activeTab);
    const activeTabName = tabObj ? tabObj.label : 'Dashboard';
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'tab_navigation', { 'tab_name': activeTabName });
    }
  }, [activeTab]);

  const handleItemClick = (item: SearchItem) => {
    let targetTab: PortalTabId = 'guidelines';
    if (item.category === 'Forms & Petitions') targetTab = 'forms';
    else if (item.category === 'Exam Administrative Forms') targetTab = 'schedules-exams';
    else if (item.category === 'Schedules') targetTab = 'schedules-exams';
    else if (item.category === 'Curriculum & Handbooks') targetTab = 'curriculum-regulations';
    else if (item.category === 'Academic Regulations') targetTab = 'curriculum-regulations';
    else if (item.category === 'Internship Documents') targetTab = 'internship-thesis';
    else if (item.category === 'Bachelor Thesis Milestones') targetTab = 'internship-thesis';
    else if (item.category === 'Graduation Checklists') targetTab = 'internship-thesis';
    else if (item.category === 'Scholarships & Grants') targetTab = 'scholarship-exchange';
    else if (item.category === 'HAW Hamburg Exchange') targetTab = 'scholarship-exchange';
    else if (item.category === 'Frequently Asked Questions') targetTab = 'faq';

    setActiveTab(targetTab);

    if (item.type === 'FAQ') {
      const faqIdx = FAQ_ITEMS.findIndex(f => f.question === item.title);
      if (faqIdx !== -1) {
        setFaqOpenState(prev => ({ ...prev, [faqIdx]: true }));
        setTimeout(() => {
          const el = document.getElementById(`faq-btn-${faqIdx}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    } else {
      setTimeout(() => {
        const el = document.getElementById('portal-content-stage');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }

    if (item.url) {
      if (item.url.includes('drive.google.com') || item.url.includes('docs.google.com')) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'document_download', {
            'document_title': item.title,
            'document_url': item.url
          });
        }
      }
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }

    setShowDropdown(false);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      if (isMobileMenuOpen) {
        setShowHeader(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }
      
      const scrollDiff = currentScrollY - lastScrollY;
      
      // Threshold check: scroll more than 8px in either direction to trigger header toggle
      if (Math.abs(scrollDiff) > 8) {
        if (scrollDiff > 0 && currentScrollY > 80) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        lastScrollY = currentScrollY;
      }
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    localStorage.setItem('mec_portal_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Keep a dynamic simulated clock running
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const INFO_CHANNELS = [
    {
      id: 'email',
      title: 'Official Email',
      description: 'All administrative updates, registration circulars, and official letters are sent directly to your student mailbox. Check daily.',
      icon: 'mail'
    },
    {
      id: 'calendar',
      title: 'Academic Calendar',
      description: 'Used for tracking class times, makeup lectures, laboratory rotations, public holidays, and final exam timetables.',
      icon: 'calendar-days'
    },
    {
      id: 'moodle',
      title: 'Moodle Platform',
      description: 'Access learning handouts, lecture slides, upload engineering assignments, lab work files, and track course participation.',
      icon: 'cpu'
    },
    {
      id: 'sis',
      title: 'SIS Grade Portal',
      description: 'VGU Student Information System to self-verify semester grade sheets, transfer credits, and official GPA records.',
      icon: 'file-text'
    }
  ];

  const filteredInfoChannels = query
    ? INFO_CHANNELS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : INFO_CHANNELS;

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'mail':
        return <Mail className="w-5 h-5 text-orange-500" />;
      case 'calendar-days':
        return <CalendarDays className="w-5 h-5 text-orange-500" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-orange-500" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <Info className="w-5 h-5 text-orange-500" />;
    }
  };

  const filteredScheduleCards = query 
    ? SCHEDULE_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : SCHEDULE_CARDS;

  const filteredExamCards = query 
    ? EXAM_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : EXAM_CARDS;

  const filteredCurriculumCards = query 
    ? CURRICULUM_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : CURRICULUM_CARDS;

  const filteredRegulationCards = query 
    ? REGULATION_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : REGULATION_CARDS;

  const filteredFormCards = query 
    ? FORM_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : FORM_CARDS;

  const filteredThesisCards = query 
    ? THESIS_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : THESIS_CARDS;

  const filteredInternshipCards = query 
    ? INTERNSHIP_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : INTERNSHIP_CARDS;

  const filteredGraduationCards = query 
    ? GRADUATION_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : GRADUATION_CARDS;

  const filteredScholarshipCards = query 
    ? SCHOLARSHIP_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : SCHOLARSHIP_CARDS;

  const filteredExchangeCards = query 
    ? EXCHANGE_CARDS.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query))
    : EXCHANGE_CARDS;

  const filteredFaqItems = query 
    ? FAQ_ITEMS.filter(item => item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query))
    : FAQ_ITEMS;

  const attendanceBlockMatches = !query || 
    "Attendance requirements and punctuality policies".toLowerCase().includes(query) ||
    "Punctuality is crucial. Students are expected to arrive at least 5 minutes prior to the scheduled lecture or lab start time. Attendance is recorded at the start of each session. Unjustified absences exceeding 20% in any subject will lead to immediate disqualification from the end-of-semester examinations. Late arrivals of more than 15 minutes are treated as an unexcused absence.".toLowerCase().includes(query);

  const examPrereqMatches = !query ||
    "Prerequisites for taking final exams".toLowerCase().includes(query) ||
    "In order to qualify for the final examinations under the joint MEC regulatory code: Students must satisfy the mandatory lecture attendance rate of at least 80%. Laboratory attendance is strictly mandatory at 100%—all practical blocks must be fully passed. Satisfactory grades must be obtained on all homework, midterms, or project reports.".toLowerCase().includes(query);

  const curriculumOverviewMatches = !query ||
    "Core Engineering Curriculum Overview".toLowerCase().includes(query) ||
    "The Mechatronics program is meticulously aligned with HAW Hamburg accreditation standards. It spans over 4 academic years (7-8 semesters), covering fundamental sciences, electrical systems, control loops, and robotics, culminating in a dual-degree Bachelor of Science award.".toLowerCase().includes(query) ||
    "Year 1 Foundations Maths, Physics, Electronics, CAD Drafting Year 2 Core Engineering Signals, Sensors, Fluidics, Manufacturing Labs Year 3 Advanced Systems Embedded Controllers, Robotics, PLC, DSP Year 4 Specialization Thesis, Elective Modules, Professional Internship".toLowerCase().includes(query);

  const foundationTransitionMatches = !query ||
    "quy định để từ Foundation lên ngành (Semester 1)".toLowerCase().includes(query) ||
    "quy định chuyển tiếp từ Foundation lên chuyên ngành (Semester 1)".toLowerCase().includes(query) ||
    "IELTS 6.0 (nộp về VGU ASA trước 15.08)".toLowerCase().includes(query) ||
    "passed >= 80% ECTS in the Foundation Semester".toLowerCase().includes(query) ||
    "to progress to semester 4, students must fully complete the Basic Internship".toLowerCase().includes(query) ||
    "Basic Internship".toLowerCase().includes(query) ||
    "semester 4 progression".toLowerCase().includes(query) ||
    "VGU ASA by 15.08".toLowerCase().includes(query);

  const thesisOverviewMatches = !query ||
    "Bachelor Thesis Guidelines".toLowerCase().includes(query) ||
    "Bachelor Thesis Milestones & Deliverables".toLowerCase().includes(query) ||
    "The final Bachelor Thesis (12 ECTS) is the capstone engineering achievement. It represents independent research addressing complex mechanical, hardware controller, and embedded software intersections.".toLowerCase().includes(query) ||
    "Stage 1 Proposal Month 1 Stage 2 Literature Month 2 Stage 3 Prototyping Months 3-4 Stage 4 Draft Writing Month 5 Stage 5 Defense Month 6".toLowerCase().includes(query);

  const internshipOverviewMatches = !query ||
    "Basic & Professional Internship".toLowerCase().includes(query) ||
    "Basic Internship (Minimum 8 Weeks)".toLowerCase().includes(query) ||
    "Focused on fundamental mechanical operations, metal machining (turning, milling, drilling), basic electrical wiring, PCB fabrication, and technical draftings. Must be completed in registered industrial training workshops or approved mechatronic production lines before entering year 3.".toLowerCase().includes(query) ||
    "Professional Internship (Minimum 12 Weeks)".toLowerCase().includes(query) ||
    "An advanced placement centering on systems engineering, factory automation (PLC/SCADA loops), software controls, or mechanical hardware design. Undertaken in reputable multi-national engineering firms or research facilities. Requires a dual sign-off from both VGU coordinator and corporate advisor.".toLowerCase().includes(query);

  const graduationOverviewMatches = !query ||
    "Final Graduation Academic Audits".toLowerCase().includes(query) ||
    "Students are advised to initiate the academic clearance audit during Year 4 Semester 2. All credits including basic studies, professional internship, and the Bachelor Thesis must be fully computed on SIS grade sheets.".toLowerCase().includes(query) ||
    "Satisfy 210 ECTS Credit Target IELTS 6.0 English Proficiency level Complete both Internship stages".toLowerCase().includes(query);

  const exchangeOverviewMatches = !query ||
    "Student Mobility Partnership with HAW Hamburg".toLowerCase().includes(query) ||
    "VGU MEC students have the exclusive opportunity to spend their 7th semester at the Hamburg University of Applied Sciences (HAW Hamburg) in Germany. During this exchange block, students complete elective coursework and their Bachelor Thesis in collaboration with state-of-the-art German laboratory teams or partner industrial corporations.".toLowerCase().includes(query);

  const scholarshipOverviewMatches = !query ||
    "VGU Merit Scholarship & 4-Year Full Scholarship Guidelines".toLowerCase().includes(query) ||
    "eligibility conditions".toLowerCase().includes(query) ||
    "German scale".toLowerCase().includes(query) ||
    "Vietnamese scale".toLowerCase().includes(query) ||
    "4-Year Scholarship".toLowerCase().includes(query) ||
    "Top 5% Category A".toLowerCase().includes(query);

  const totalMatchesCount = query 
    ? (filteredInfoChannels.length + filteredScheduleCards.length + filteredExamCards.length + filteredCurriculumCards.length + 
       filteredRegulationCards.length + filteredFormCards.length + filteredThesisCards.length + 
       filteredInternshipCards.length + filteredGraduationCards.length + filteredScholarshipCards.length + 
       filteredExchangeCards.length + filteredFaqItems.length + (scholarshipOverviewMatches ? 1 : 0))
    : 0;

  const getTabMatchesCount = (tabId: string) => {
    if (!query) return 0;
    switch (tabId) {
      case 'guidelines':
        return filteredInfoChannels.length;
      case 'schedules-exams':
        return filteredScheduleCards.length + filteredExamCards.length;
      case 'curriculum-regulations':
        return filteredCurriculumCards.length + filteredRegulationCards.length;
      case 'forms':
        return filteredFormCards.length;
      case 'internship-thesis':
        return filteredThesisCards.length + filteredInternshipCards.length + filteredGraduationCards.length;
      case 'scholarship-exchange':
        return filteredScholarshipCards.length + filteredExchangeCards.length + (scholarshipOverviewMatches ? 1 : 0);
      case 'faq':
        return filteredFaqItems.length;
      default:
        return 0;
    }
  };

  const toggleFaq = (index: number) => {
    setFaqOpenState(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const getBreadcrumbTitle = () => {
    const found = PORTAL_TABS.find(t => t.id === activeTab);
    return found ? found.label : 'Dashboard';
  };

  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'FileText': return <FileText className="w-4 h-4" />;
      case 'Calendar': return <Calendar className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4" />;
      case 'ClipboardList': return <ClipboardList className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Award': return <Award className="w-4 h-4" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
      case 'Globe': return <Globe className="w-4 h-4" />;
      case 'HelpCircle': return <HelpCircle className="w-4 h-4" />;
      case 'Mail': return <Mail className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 font-sans ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`} id="application-root">
      
      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0" id="main-content-wrapper">
               {/* Top Sticky Header & Horizontal Navigation Hub */}
        <div className={`sticky top-0 z-50 w-full flex flex-col transition-all duration-300 ${
          isScrolled 
            ? darkMode 
              ? 'bg-slate-950/85 shadow-md border-b border-slate-900/85 backdrop-blur-xl' 
              : 'bg-white/85 shadow-md border-b border-slate-200/80 backdrop-blur-xl'
            : 'bg-transparent'
        }`} id="top-sticky-header-container">
          
          {/* Row 1: Brand & Logos & Controls with smooth slide transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showHeader 
              ? 'max-h-[90px] opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}>
            <header className={`relative overflow-hidden px-4 py-1.5 sm:px-6 lg:px-8 border-b transition-all duration-300 flex flex-row items-center justify-between gap-3 sm:gap-4 backdrop-blur-xl ${
              isScrolled 
                ? 'bg-transparent border-transparent' 
                : darkMode 
                  ? 'border-slate-800/80 bg-slate-950/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' 
                  : 'border-slate-200/90 bg-white/85 shadow-[0_4px_30px_rgba(249,115,22,0.05)]'
            }`} id="top-navbar">
              
              {/* Mechatronics-themed Interactive & Dynamic Backdrop */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" id="header-mechatronics-background">
                {/* Technical Grid Pattern - more defined with subtle glow */}
                <div className={`absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_80%,transparent_100%)] ${
                  darkMode ? 'opacity-40' : 'opacity-30'
                }`} />
                
                {/* Vibrant glowing circuit nodes & tech vectors */}
                <div className="absolute top-1/2 left-[25%] -translate-y-1/2 w-64 h-64 bg-orange-500/15 dark:bg-orange-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute -top-10 right-[35%] w-48 h-48 bg-blue-500/15 dark:bg-blue-600/25 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 right-[15%] w-40 h-40 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-2xl" />
                
                {/* SVG Circuit Trace Line with genuine Electrical/Electronic symbols (Resistor, Capacitor, Ground) */}
                <svg className="absolute right-[5%] top-0 h-full w-[450px] transition-all duration-300 animate-pulse" style={{ animationDuration: '6s' }} fill="none" viewBox="0 0 450 64">
                  <defs>
                    <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#f97316" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Circuit path featuring a real Resistor (zigzag) and Capacitor schematic symbols */}
                  <path 
                    d="M 0 32 L 90 32 L 110 12 L 140 12 L 144 12 L 147 6 L 152 18 L 157 6 L 162 18 L 167 6 L 172 18 L 175 12 L 210 12 L 230 48 L 270 48 M 270 38 L 270 58 M 274 38 L 274 58 M 274 48 L 330 48 L 350 24 L 450 24" 
                    stroke="url(#circuit-gradient)" 
                    strokeWidth="1.5" 
                    className="transition-all duration-300"
                  />
                  
                  {/* Glowing Connection Nodes & Ground symbols representing Electrical Engineering */}
                  <circle cx="110" cy="12" r="4" fill="#f97316" className="animate-ping origin-center" style={{ animationDuration: '2s' }} />
                  <circle cx="110" cy="12" r="2.5" fill="#f97316" />
                  <circle cx="230" cy="48" r="2.5" fill="#3b82f6" />
                  <circle cx="350" cy="24" r="2.5" fill="#14b8a6" />

                  {/* Ground symbol branching from node 230,48 */}
                  <path 
                    d="M 230 48 L 230 58 M 224 58 L 236 58 M 227 61 L 233 61 M 229 64 L 231 64" 
                    stroke={darkMode ? '#475569' : '#cbd5e1'} 
                    strokeWidth="1.2" 
                  />
                </svg>

                {/* Robot & AI Interactive Symbols */}
                <div className={`absolute right-[38%] sm:right-[260px] md:right-[320px] lg:right-[430px] top-1/2 -translate-y-1/2 flex items-center space-x-3.5 transition-all duration-300 ${
                  darkMode ? 'text-blue-400/25' : 'text-blue-500/35'
                }`}>
                  {/* Robot Head / Cybernetic Chassis (Robot symbol) */}
                  <svg className="w-8 h-8 animate-[bounce_4s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M12 3v3m-6 3h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                    <rect x="7.5" y="11" width="2" height="1.5" rx="0.5" fill="currentColor" />
                    <rect x="14.5" y="11" width="2" height="1.5" rx="0.5" fill="currentColor" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6" />
                    <circle cx="3" cy="12" r="1.2" fill="currentColor" />
                    <circle cx="21" cy="12" r="1.2" fill="currentColor" />
                  </svg>

                  {/* AI Neural Synapse Core (AI symbol) */}
                  <svg className="w-8 h-8 animate-[pulse_3s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <rect x="8.5" y="8.5" width="7" height="7" rx="1.5" strokeWidth="1.5" />
                    <path d="M12 8.5V6M12 18v-2.5M8.5 12H6M18 12h-2.5" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="4.5" r="1.2" fill="currentColor" />
                    <circle cx="12" cy="19.5" r="1.2" fill="currentColor" />
                    <circle cx="4.5" cy="12" r="1.2" fill="currentColor" />
                    <circle cx="19.5" cy="12" r="1.2" fill="currentColor" />
                    <path d="M9.5 9.5 L6.5 6.5 M14.5 9.5 L17.5 6.5 M9.5 14.5 L6.5 17.5 M14.5 14.5 L17.5 17.5" strokeDasharray="1.5,1.5" />
                  </svg>
                </div>

                {/* Micro Animated Mechanical Gears - more clear, with distinctive colors, positioned to the right and lower to avoid overlapping the circuit trace lines */}
                <div className={`absolute right-[20%] sm:right-[180px] md:right-[240px] lg:right-[320px] top-[72%] -translate-y-1/2 flex items-center space-x-1 transition-all duration-300 ${
                  darkMode ? 'text-orange-500/25' : 'text-orange-500/35'
                }`}>
                  {/* Gear 1 (Primary Orange Gear) */}
                  <svg className="w-10 h-10 animate-spin" style={{ animationDuration: '15s' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  {/* Gear 2 (Interlocking Blue/Teal Gear) */}
                  <svg 
                    className={`w-6 h-6 animate-spin -mt-2 -ml-3 ${darkMode ? 'text-blue-500/25' : 'text-blue-500/35'}`} 
                    style={{ animationDuration: '8s', animationDirection: 'reverse' }} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Two Official Logos side-by-side with a clean separator */}
              <div className="relative z-10 flex items-center space-x-3 sm:space-x-4" id="navbar-left-container">
                {/* HAW Hamburg Official Logo Slot - Hidden on small displays, visible on md and larger */}
                <a 
                  href="https://www.haw-hamburg.de/en/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hidden md:flex items-center cursor-pointer" 
                  id="haw-logo-wrapper"
                >
                  <img 
                    src="https://i.postimg.cc/Y9YKTnDp/haw-hamburg-seeklogo.png" 
                    alt="HAW Hamburg University" 
                    className="h-[38.4px] md:h-[44.8px] w-auto object-contain bg-transparent transition-all duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                    id="haw-official-logo"
                  />
                </a>

                {/* Clean separator - Hidden on small displays, visible on md and larger */}
                <div className={`hidden md:block h-8 md:h-[38.4px] w-[1px] transition-colors duration-300 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} id="logos-separator" />

                {/* VGU Official Logo Slot - Hidden on small displays, visible on md and larger */}
                <a 
                  href="https://vgu.edu.vn/en/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hidden md:flex items-center cursor-pointer" 
                  id="vgu-logo-wrapper"
                >
                  <img 
                    src="https://i.postimg.cc/vHQFSvWh/VGU-Logo-(1).png" 
                    alt="Vietnamese-German University (VGU)" 
                    className="h-[38.4px] md:h-[44.8px] w-auto object-contain px-1 bg-transparent transition-all duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                    id="vgu-official-logo"
                  />
                </a>

                {/* Small subtle academic portal title next to logos - Visible on all screens, bordered on md+ */}
                <div className={`flex flex-col md:border-l pl-0 md:pl-5 py-1 justify-center transition-all duration-300 ${
                  darkMode ? 'md:border-slate-800/80' : 'md:border-slate-200/80'
                }`} id="portal-title-block">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <div className={`p-1 sm:p-1.5 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      darkMode 
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                        : 'bg-orange-50 text-orange-500 border border-orange-100 shadow-[0_2px_8px_rgba(249,115,22,0.1)]'
                    }`}>
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                    </div>
                    <motion.h1 
                      whileHover={{ scale: 1.02, letterSpacing: "0.14em" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`font-sans font-black text-[11px] xs:text-xs sm:text-sm md:text-lg lg:text-xl tracking-[0.12em] leading-none transition-all duration-500 uppercase cursor-default select-none bg-[length:200%_auto] animate-text-shimmer ${
                        darkMode 
                          ? 'bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-orange-400 to-slate-100 hover:via-orange-300 drop-shadow-[0_2px_12px_rgba(249,115,22,0.25)]' 
                          : 'bg-clip-text text-transparent bg-gradient-to-r from-slate-950 via-orange-600 to-slate-950 hover:via-orange-500 drop-shadow-[0_2px_8px_rgba(249,115,22,0.1)]'
                      }`}
                    >
                      Mechatronics Engineering
                    </motion.h1>
                    <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500" title="System active"></span>
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-md shadow-xs inline-flex items-center justify-center leading-none transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
                      PORTAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Header Controls: Dark Mode and Mobile Hamburger Menu */}
              <div className="relative z-10 flex items-center justify-end space-x-2.5 sm:space-x-3" id="navbar-controls">
                {/* Dark Mode Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl ${
                    darkMode 
                      ? 'bg-gradient-to-b from-slate-800/90 via-slate-850/80 to-slate-900/90 border-t border-t-white/15 border-x border-x-white/5 border-b border-b-black/40 text-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.35)] hover:from-slate-700/90 hover:to-slate-850/90 hover:border-t-white/25' 
                      : 'bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 border-t border-t-white border-x border-x-white/80 border-b border-b-slate-300/60 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_12px_rgba(15,23,42,0.08)] hover:from-sky-50 hover:to-sky-100/60 hover:text-blue-600 hover:border-b-blue-300 hover:shadow-blue-100/40'
                  }`}
                  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  id="theme-toggle-btn"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* Mobile Hamburger Menu button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-xl backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer lg:hidden border ${
                    darkMode 
                      ? isMobileMenuOpen 
                        ? 'bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 text-orange-400 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(249,115,22,0.2)]' 
                        : 'bg-gradient-to-b from-slate-800/90 via-slate-850/80 to-slate-900/90 border-t-white/15 border-x-white/5 border-b-black/40 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.35)] hover:from-slate-700/90 hover:to-slate-850/90'
                      : isMobileMenuOpen 
                        ? 'bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 text-orange-600 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(249,115,22,0.1)]' 
                        : 'bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 border-t-white border-x-white/80 border-b-slate-300/60 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_12px_rgba(15,23,42,0.08)] hover:from-sky-50 hover:to-sky-100/60 hover:text-blue-600 hover:border-b-blue-300 hover:shadow-blue-100/40'
                  }`}
                  title="Toggle Menu"
                  id="hamburger-menu-btn"
                >
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </header>
          </div>

          {/* Row 2: Desktop Horizontal Navigation Hub (hidden on mobile, visible on lg) */}
          <nav className={`hidden lg:block transition-all duration-300 ${
            isScrolled
              ? 'bg-transparent border-b border-transparent'
              : darkMode 
                ? 'border-b border-slate-800/50 bg-slate-900/70' 
                : 'border-b border-slate-200/50 bg-white/70'
          } px-4 py-1.5 sm:px-6 lg:px-8`} id="horizontal-navigation-hub">
            <div className="max-w-full mx-auto w-full">
              <div 
                className="flex flex-wrap justify-center gap-y-1.5 gap-x-2.5 py-1 w-full" 
                id="horizontal-tab-list"
              >
                {PORTAL_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const tabMatches = getTabMatchesCount(tab.id);
                  
                  return (
                    <button
                      key={tab.id}
                      id={`nav-btn-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 active:scale-95 cursor-pointer flex-shrink-0 border ${
                        isActive
                          ? darkMode
                            ? 'bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 text-orange-400 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(249,115,22,0.25)] font-bold backdrop-blur-md'
                            : 'bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 text-orange-600 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(249,115,22,0.12)] font-bold backdrop-blur-md'
                          : darkMode
                            ? 'text-slate-400 border-t-white/10 border-x-white/5 border-b-black/30 bg-gradient-to-b from-slate-850/60 via-slate-900/40 to-slate-950/50 hover:text-slate-100 hover:from-slate-800/80 hover:to-slate-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)]'
                            : 'text-slate-600 border-t-white border-x-white/80 border-b-slate-200/40 bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.02)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:shadow-md hover:border-b-blue-300 hover:shadow-blue-100/30'
                      }`}
                    >
                      <span className={`transition-colors duration-300 ${
                        isActive 
                          ? darkMode ? 'text-orange-400' : 'text-orange-600' 
                          : darkMode 
                            ? 'text-slate-500 group-hover:text-slate-100' 
                            : 'text-slate-400 group-hover:text-blue-600'
                      }`}>
                        {getTabIcon(tab.icon)}
                      </span>
                      <span>{tab.label}</span>
                      {query && tabMatches > 0 && (
                        <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full transition-all duration-200 ${
                          isActive 
                            ? 'bg-white text-orange-600 font-bold' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {tabMatches}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
 
          {/* Mobile responsive Dropdown Menu (only visible below desktop size) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`lg:hidden border-b overflow-hidden transition-colors duration-300 ${
                  darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
                }`}
                id="mobile-navigation-dropdown"
              >
                <div className="px-4 py-3 flex flex-col space-y-1.5">
                  {PORTAL_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const tabMatches = getTabMatchesCount(tab.id);
                    return (
                      <button
                        key={tab.id}
                        id={`mobile-nav-btn-${tab.id}`}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] active:scale-95 cursor-pointer border w-full text-left ${
                          isActive
                            ? darkMode
                              ? 'bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 text-orange-400 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(249,115,22,0.25)] font-bold backdrop-blur-md'
                              : 'bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 text-orange-600 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(249,115,22,0.12)] font-bold backdrop-blur-md'
                            : darkMode
                              ? 'text-slate-400 border-t-white/10 border-x-white/5 border-b-black/30 bg-gradient-to-b from-slate-850/60 via-slate-900/40 to-slate-950/50 hover:text-slate-100 hover:from-slate-800/80 hover:to-slate-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)]'
                              : 'text-slate-600 border-t-white border-x-white/80 border-b-slate-200/40 bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.02)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:shadow-md hover:border-b-blue-300 hover:shadow-blue-100/30'
                        }`}
                      >
                        <span className={`transition-colors duration-300 ${
                          isActive 
                            ? darkMode ? 'text-orange-400' : 'text-orange-600' 
                            : darkMode 
                              ? 'text-slate-500 group-hover:text-slate-100' 
                              : 'text-slate-400 group-hover:text-blue-600'
                        }`}>
                          {getTabIcon(tab.icon)}
                        </span>
                        <span className="flex-1">{tab.label}</span>
                        {query && tabMatches > 0 && (
                          <span className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full transition-all duration-200 ${
                            isActive 
                              ? 'bg-white text-orange-600 font-bold' 
                              : 'bg-orange-500 text-white'
                          }`}>
                            {tabMatches}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Global Search Bar row - nested inside the sticky container so it remains sticky too! */}
          <div className={`w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled
              ? 'py-1 bg-transparent border-b border-transparent'
              : 'py-1.5 bg-transparent'
          }`} id="global-search-bar-row">
            <div className="max-w-3xl mx-auto w-full relative" id="global-search-container" ref={searchContainerRef}>
              <div                className={`relative flex items-center w-full rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
                  darkMode 
                    ? 'border-slate-800/50 bg-slate-900/60 text-white shadow-slate-950/25 hover:bg-white/10 hover:backdrop-blur-lg hover:border-white/20 hover:shadow-[0_4px_15px_-3px_rgba(255,255,255,0.15)] focus-within:bg-slate-900/85 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20' 
                    : 'border-slate-200 bg-white/60 text-slate-800 shadow-slate-200/40 hover:bg-sky-100/50 hover:backdrop-blur-lg hover:border-sky-200/60 hover:shadow-md focus-within:bg-white/90 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                }`}
                id="global-search-pill"
              >
                <div className="absolute left-3.5 flex items-center pointer-events-none" id="search-icon-wrapper">
                  <Search className={`w-3.5 h-3.5 transition-colors duration-200 ${
                    darkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (searchQuery) setShowDropdown(true);
                  }}
                  placeholder="Search keywords, documents, schedules, or FAQs across all categories..."
                  className={`w-full py-1.5 pl-9 pr-9 rounded-full text-xs md:text-sm bg-transparent border-0 outline-none focus:outline-none focus:ring-0 placeholder:transition-colors duration-200 ${
                    darkMode 
                      ? 'text-white placeholder:text-slate-500' 
                      : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                  id="global-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className={`absolute right-3 p-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-90 cursor-pointer shadow-xs hover:shadow-sm ${
                      darkMode 
                        ? 'text-slate-400 hover:text-slate-200 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' 
                        : 'text-slate-400 hover:text-blue-600 bg-gradient-to-b from-white/95 to-slate-100/95 hover:from-sky-50 hover:to-blue-100/40 border border-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                    }`}
                    title="Clear Search"
                    id="clear-search-btn"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Real-time Frosted Glass Search Dropdown */}
              <AnimatePresence>
                {showDropdown && searchQuery.trim() && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className={`absolute left-0 right-0 mt-3 z-50 rounded-2xl border backdrop-blur-xl overflow-hidden max-h-[460px] flex flex-col ${
                      darkMode 
                        ? 'bg-slate-900/85 border-t-white/10 border-x-white/5 border-b-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_50px_rgba(0,0,0,0.5)]' 
                        : 'bg-white/80 border-t-white border-x-white/80 border-b-slate-200/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_50px_rgba(15,23,42,0.12)]'
                    }`}
                    id="realtime-search-dropdown"
                  >
                    {/* Dropdown Header */}
                    <div className={`px-4 py-2.5 text-[10px] uppercase tracking-widest font-extrabold flex justify-between items-center border-b ${
                      darkMode ? 'text-slate-400 border-b-slate-800/60' : 'text-slate-500 border-b-slate-100'
                    }`}>
                      <span>Instant Search Results ({
                        SEARCH_POOL.filter(item => 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
                        ).length
                      })</span>
                      <button 
                        onClick={() => setShowDropdown(false)} 
                        className="hover:text-orange-500 transition-colors"
                        title="Close results"
                      >
                        Close [Esc]
                      </button>
                    </div>

                    {/* Dropdown Scroll List */}
                    <div className="overflow-y-auto flex-1 divide-y divide-slate-100/10 dark:divide-slate-800/40 custom-scrollbar">
                      {(() => {
                        const results = SEARCH_POOL.filter(item => 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
                        );

                        if (results.length > 0) {
                          return results.map((item, idx) => {
                            return (
                              <div
                                key={idx}
                                onClick={() => handleItemClick(item)}
                                className={`p-4 transition-all duration-200 ease-out cursor-pointer text-left flex justify-between items-start gap-3 group relative ${
                                  darkMode
                                    ? 'hover:bg-white/5 hover:text-white'
                                    : 'hover:bg-sky-50/60 hover:text-blue-600'
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                                      darkMode 
                                        ? 'bg-slate-800 text-slate-300' 
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {item.category}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      item.type === 'FORM' 
                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                        : item.type === 'PDF'
                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        : item.type === 'FAQ'
                                        ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    }`}>
                                      {item.type}
                                    </span>
                                  </div>
                                  <h4 className={`text-xs md:text-sm font-bold truncate ${
                                    darkMode ? 'text-slate-100 group-hover:text-orange-400' : 'text-slate-800 group-hover:text-blue-600'
                                  }`}>
                                    {item.title}
                                  </h4>
                                  <p className={`text-[11px] leading-relaxed mt-0.5 line-clamp-2 ${
                                    darkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-600'
                                  }`}>
                                    {item.description}
                                  </p>
                                </div>
                                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <ArrowUpRight className={`w-4 h-4 ${
                                    darkMode ? 'text-orange-400' : 'text-blue-500'
                                  }`} />
                                </div>
                              </div>
                            );
                          });
                        } else {
                          return (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                              <div className={`p-3 rounded-full mb-3 ${
                                darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'
                              }`}>
                                <Search className="w-5 h-5" />
                              </div>
                              <p className={`text-xs font-bold ${
                                darkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                No instant matches found
                              </p>
                              <p className={`text-[11px] mt-1 max-w-xs ${
                                darkMode ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                Try searching for keywords like "Form", "Schedule", "Thesis", "Syllabus", or "Registration".
                              </p>
                              
                              <div className="flex flex-wrap gap-1.5 justify-center mt-4 max-w-sm">
                                {['Form', 'Schedule', 'Thesis', 'Syllabus', 'Regulations', 'Exams'].map(tag => (
                                  <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all ${
                                      darkMode 
                                        ? 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/50' 
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/50'
                                    }`}
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Dropdown Footer */}
                    <div className={`px-4 py-2 text-[10px] font-semibold text-center border-t ${
                      darkMode ? 'bg-slate-950/40 border-t-slate-800/60 text-slate-500' : 'bg-slate-50/50 border-t-slate-100 text-slate-400'
                    }`}>
                      💡 Pro tip: Clicking a result automatically navigates you to its relevant tab section!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dynamic content rendering stage with transition padding to prevent scroll jitter */}
        <main className={`flex-1 relative transition-all duration-300 ${
          showHeader 
            ? 'pt-5 md:pt-8' 
            : 'pt-[76px] md:pt-[96px]'
        } pb-5 px-5 md:pb-8 md:px-8 ${
          darkMode 
            ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] bg-slate-950' 
            : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] bg-slate-50'
        }`} id="portal-content-stage">
          
          {/* Search Status / Notification Banner */}
          {query && (
            <div className="max-w-4xl mx-auto mb-6 px-1" id="search-results-banner">
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                totalMatchesCount > 0
                  ? darkMode 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-200' 
                    : 'bg-orange-50 border-orange-200 text-orange-800 shadow-xs'
                  : darkMode
                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                    : 'bg-rose-50 border-rose-200 text-rose-800 shadow-xs'
              }`}>
                <div className="flex items-center space-x-2.5">
                  <Search className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-semibold">
                    {totalMatchesCount > 0 
                      ? `Found ${totalMatchesCount} matches across the MEC portal for "${searchQuery}". Click on the tabs to see results under each category.`
                      : `No documents, FAQs, or schedules matched "${searchQuery}". Try using a different keyword.`
                    }
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-center shadow-xs hover:shadow-sm ${
                    totalMatchesCount > 0
                      ? darkMode 
                        ? 'text-orange-300 bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-orange-400/30 hover:to-orange-500/30 hover:text-white' 
                        : 'text-orange-700 bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:border-b-blue-300 hover:shadow-blue-100/30'
                      : darkMode 
                        ? 'text-rose-300 bg-gradient-to-b from-rose-500/25 via-rose-500/15 to-rose-600/30 border-t-rose-400/40 border-x-rose-500/20 border-b-rose-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-rose-400/30 hover:to-rose-500/30 hover:text-white' 
                        : 'text-rose-700 bg-gradient-to-b from-rose-500/15 via-rose-500/5 to-rose-500/10 border-t-rose-400/40 border-x-rose-400/20 border-b-rose-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:border-b-blue-300 hover:shadow-blue-100/30'
                  }`}
                  id="search-banner-reset-btn"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Content Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              id="animated-tab-container"
            >
              {/* RENDERING ACTIVE TABS */}

              {/* 1. GUIDELINES */}
              {activeTab === 'guidelines' && (
                <div className="space-y-6" id="section-guidelines">
                  {/* Tab Banner */}
                  <div className={`p-6 md:p-8 rounded-2xl border transition-colors ${
                    darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <h1 className={`text-xl md:text-2xl font-extrabold tracking-tight mb-2 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Welcome to the official page of the MEC program
                    </h1>
                    <p className={`text-sm leading-relaxed max-w-4xl ${
                      darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      This is the official hub of the Mechatronics program at VGU. Here you can find all the essential documents and resources that MEC students need throughout their studies at VGU.
                    </p>
                  </div>

                  {/* Info Channels Section */}
                  {filteredInfoChannels.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Info className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Important information channels that students must follow:
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="info-channels-grid">
                        {filteredInfoChannels.map((channel) => (
                          <div 
                            key={channel.id}
                            className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                              darkMode 
                                ? 'bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950/50 border-t-white/10 border-x-white/5 border-b-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-slate-800/80 hover:to-slate-900/80 hover:border-orange-500/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_12px_40px_rgba(0,0,0,0.3)]' 
                                : 'bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 border-t-white border-x-white/80 border-b-slate-200/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.02)] hover:from-sky-50 hover:to-blue-100/70 hover:border-orange-500/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_40px_rgba(249,115,22,0.08)]'
                            }`}
                            id={`info-channel-${channel.id}`}
                          >
                            <div className="p-2 bg-orange-500/10 rounded-lg w-fit mb-4">
                              {getChannelIcon(channel.icon)}
                            </div>
                            <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {channel.title}
                            </h3>
                            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {channel.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. SCHEDULES & EXAMS */}
              {activeTab === 'schedules-exams' && (
                <div className="space-y-8" id="section-schedules-exams">
                  {/* Part A: Attendance & Schedules */}
                  {(attendanceBlockMatches || filteredScheduleCards.length > 0) && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Attendance & Academic Schedules
                        </h2>
                      </div>

                      {attendanceBlockMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-rose-500/5 border-rose-500/15 text-slate-300' : 'bg-rose-50/50 border-rose-200 text-slate-700'
                        }`}>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
                            <div>
                              <h3 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Attendance requirements and punctuality policies
                              </h3>
                              <p className="text-xs leading-relaxed">
                                Punctuality is crucial. Students are expected to arrive at least 5 minutes prior to the scheduled lecture or lab start time. Attendance is recorded at the start of each session. Unjustified absences exceeding 20% in any subject will lead to immediate disqualification from the end-of-semester examinations. Late arrivals of more than 15 minutes are treated as an unexcused absence.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredScheduleCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="schedule-cards-grid">
                          {filteredScheduleCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part B: Exams & Registrations */}
                  {(examPrereqMatches || filteredExamCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Examinations & Registration Portals
                        </h2>
                      </div>

                      {examPrereqMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-amber-500/5 border-amber-500/15 text-slate-300' : 'bg-amber-50/50 border-amber-200 text-slate-700'
                        }`}>
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <h3 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Prerequisites for taking final exams
                              </h3>
                              <p className="text-xs leading-relaxed space-y-1.5">
                                In order to qualify for the final examinations under the joint MEC regulatory code:
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                                <li>Students must satisfy the mandatory lecture attendance rate of at least 80%.</li>
                                <li>Laboratory attendance is strictly mandatory at 100%—all practical blocks must be fully passed.</li>
                                <li>Satisfactory grades must be obtained on all homework, midterms, or project reports.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredExamCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="exam-cards-grid">
                          {filteredExamCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. CURRICULUM & REGULATIONS */}
              {activeTab === 'curriculum-regulations' && (
                <div className="space-y-8" id="section-curriculum-regulations">
                  {/* Part A: Curriculum */}
                  {(curriculumOverviewMatches || filteredCurriculumCards.length > 0) && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          MEC Academic Framework & Modules
                        </h2>
                      </div>

                      {curriculumOverviewMatches && (
                        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                          darkMode 
                            ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-xl' 
                            : 'bg-white border-slate-200 shadow-md'
                        }`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200/50 dark:border-slate-800/40">
                            <div>
                              <h3 className={`font-extrabold text-base tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Mechatronics Curriculum Matrix
                              </h3>
                              <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Program Structure: 7 Semesters of study + 1 Foundation Semester · Total Credit Points: 210 CP · German Degree (HAW Hamburg)
                              </p>
                            </div>
                            
                            {/* Summary Badges */}
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 text-[11px] font-semibold font-mono rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                7 Semesters
                              </span>
                              <span className="px-3 py-1 text-[11px] font-semibold font-mono rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25">
                                210 CP Total
                              </span>
                              <span className="px-3 py-1 text-[11px] font-semibold font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                                Dual Degree
                              </span>
                            </div>
                          </div>

                          {/* Year Selector Tabs */}
                          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950/20 dark:bg-slate-950/40 border border-slate-800/20 mb-6">
                            {[
                              { id: 'all', label: 'All Semesters' },
                              { id: 'foundation', label: 'Foundation' },
                              { id: '1', label: 'Year 1' },
                              { id: '2', label: 'Year 2' },
                              { id: '3', label: 'Year 3' },
                              { id: '4', label: 'Year 4' }
                            ].map(year => (
                              <button
                                key={year.id}
                                onClick={() => setSelectedCurriculumYear(year.id)}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                  selectedCurriculumYear === year.id
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : darkMode
                                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                {year.label}
                              </button>
                            ))}
                          </div>

                          {/* Dynamic Grid / Flow Layout of Semesters */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Foundation Semester Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === 'foundation') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode 
                                  ? 'bg-gradient-to-b from-emerald-950/20 to-slate-900/30 border-emerald-900/40' 
                                  : 'bg-gradient-to-b from-emerald-50/40 to-white border-emerald-100 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                      <h4 className={`font-bold text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                        Foundation Semester
                                      </h4>
                                    </div>
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      Prep Year
                                    </span>
                                  </div>
                                  <p className={`text-xs mb-4 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Pre-requisite semester covering essential language proficiencies, cultural integration, and core science modules.
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                      "Physics",
                                      "German",
                                      "Engineering English",
                                      "IELTS Academic English",
                                      "Academic English",
                                      "Introduction to German Culture",
                                      "Behavioural Foundations in Germany"
                                    ].map((subj, sIdx) => (
                                      <div 
                                        key={sIdx} 
                                        className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center space-x-2 ${
                                          darkMode 
                                            ? 'bg-slate-900/60 border-slate-800/80 text-slate-300' 
                                            : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                                        }`}
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70" />
                                        <span>{subj}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 1 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '1') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 1 (Year 1)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      22 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Mathematics 1", cp: 6 },
                                      { name: "Programming techniques 1", cp: 5 },
                                      { name: "Mathematics 2", cp: 6 },
                                      { name: "Programming techniques 2", cp: 5 },
                                      { name: "Basic Internship (Design Section)", cp: 0 },
                                      { name: "Basic Internship (Electrical Section)", cp: 0 },
                                      { name: "Basic Internship (Mechanical Section)", cp: 0 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        darkMode ? 'bg-slate-950/40 border-slate-900/60' : 'bg-slate-50/60 border-slate-100'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mod.name}</span>
                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                          mod.cp > 0 
                                            ? 'bg-slate-500/10 text-slate-400' 
                                            : 'bg-red-500/10 text-red-450'
                                        }`}>
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 2 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '2') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 2 (Year 2)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      37 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Fundamental principles in electrical engineering 1", cp: 5 },
                                      { name: "Fundamental principles in electrical engineering 2", cp: 5 },
                                      { name: "Technical design 1", cp: 5 },
                                      { name: "Technical design 2", cp: 6 },
                                      { name: "Engineering mechanics A", cp: 6 },
                                      { name: "Engineering mechanics B", cp: 5 },
                                      { name: "Automation 1", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        darkMode ? 'bg-slate-950/40 border-slate-900/60' : 'bg-slate-50/60 border-slate-100'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 3 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '2') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 3 (Year 2)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      31 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Digital technology", cp: 5 },
                                      { name: "Mechatronic system 1", cp: 5 },
                                      { name: "Technical design 3", cp: 6 },
                                      { name: "Electronics", cp: 5 },
                                      { name: "Material science", cp: 5 },
                                      { name: "Systems and software engineering", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        darkMode ? 'bg-slate-950/40 border-slate-900/60' : 'bg-slate-50/60 border-slate-100'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 4 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '3') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 4 (Year 3)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      30 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Production engineering", cp: 5 },
                                      { name: "Mechatronic systems 2", cp: 5 },
                                      { name: "Methodical design", cp: 5 },
                                      { name: "Microprocessor technology", cp: 5 },
                                      { name: "Sensors and electromagnetic compliance", cp: 5 },
                                      { name: "Thermodynamics and fluid dynamics", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        darkMode ? 'bg-slate-950/40 border-slate-900/60' : 'bg-slate-50/60 border-slate-100'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 5 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '3') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 5 (Year 3)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      35 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Automation 2", cp: 5 },
                                      { name: "Bachelor project", cp: 6 },
                                      { name: "Bus Systems", cp: 5 },
                                      { name: "Interdisciplinary courses", cp: 6 },
                                      { name: "Mechatronic design", cp: 5 },
                                      { name: "Report", cp: 8 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                        darkMode ? 'bg-slate-950/40 border-slate-900/60' : 'bg-slate-50/60 border-slate-100'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 6 Card - Interactive Pathways */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '4') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                selectedMajor === 'drives'
                                  ? darkMode ? 'bg-gradient-to-b from-amber-950/25 to-slate-900/30 border-amber-900/40' : 'bg-amber-50/40 border-amber-100'
                                  : selectedMajor === 'vehicle'
                                    ? darkMode ? 'bg-gradient-to-b from-emerald-950/20 to-slate-900/30 border-emerald-900/40' : 'bg-emerald-50/40 border-emerald-100'
                                    : darkMode ? 'bg-gradient-to-b from-cyan-950/20 to-slate-900/30 border-cyan-900/40' : 'bg-cyan-50/40 border-cyan-100'
                              }`}>
                                <div>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <div>
                                      <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Semester 6 (Year 4)
                                      </h4>
                                      <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Select your Major Pathway:
                                      </span>
                                    </div>
                                    <span className="self-start sm:self-center px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      25 CP
                                    </span>
                                  </div>

                                  {/* Major Selection Buttons */}
                                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-950/25 border border-slate-800/45 mb-4">
                                    <button
                                      onClick={() => setSelectedMajor('drives')}
                                      className={`px-1 py-1.5 text-[9.5px] font-bold rounded transition-all ${
                                        selectedMajor === 'drives'
                                          ? 'bg-amber-600 text-white shadow-sm'
                                          : darkMode ? 'text-amber-400/60 hover:text-amber-400 hover:bg-slate-900/40' : 'text-amber-700/70 hover:bg-slate-100'
                                      }`}
                                    >
                                      Dynamics of Drives
                                    </button>
                                    <button
                                      onClick={() => setSelectedMajor('vehicle')}
                                      className={`px-1 py-1.5 text-[9.5px] font-bold rounded transition-all ${
                                        selectedMajor === 'vehicle'
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : darkMode ? 'text-emerald-400/60 hover:text-emerald-400 hover:bg-slate-900/40' : 'text-emerald-700/70 hover:bg-slate-100'
                                      }`}
                                    >
                                      Vehicle & Aircraft
                                    </button>
                                    <button
                                      onClick={() => setSelectedMajor('robotics')}
                                      className={`px-1 py-1.5 text-[9.5px] font-bold rounded transition-all ${
                                        selectedMajor === 'robotics'
                                          ? 'bg-cyan-600 text-white shadow-sm'
                                          : darkMode ? 'text-cyan-400/60 hover:text-cyan-400 hover:bg-slate-900/40' : 'text-cyan-700/70 hover:bg-slate-100'
                                      }`}
                                    >
                                      Robotics
                                    </button>
                                  </div>

                                  {/* Dynamic Modules Listing based on selected Major */}
                                  <div className="space-y-2">
                                    {selectedMajor === 'drives' && [
                                      { name: "Machine tools", cp: 5 },
                                      { name: "Electric drive technology", cp: 5 },
                                      { name: "Fluid engineering", cp: 5 },
                                      { name: "Power electronics", cp: 5 },
                                      { name: "Dynamics of machines", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border border-amber-500/10 flex items-center justify-between ${
                                        darkMode ? 'bg-amber-950/10' : 'bg-amber-50/30'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-amber-200' : 'text-amber-800'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}

                                    {selectedMajor === 'vehicle' && [
                                      { name: "Adaptronics", cp: 5 },
                                      { name: "Electrical cabin systems", cp: 5 },
                                      { name: "Active chassis systems", cp: 5 },
                                      { name: "Technology of fibre-reinforced composites", cp: 5 },
                                      { name: "Simulation and identification of dynamic systems", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border border-emerald-500/10 flex items-center justify-between ${
                                        darkMode ? 'bg-emerald-950/10' : 'bg-emerald-50/30'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}

                                    {selectedMajor === 'robotics' && [
                                      { name: "Actuators", cp: 5 },
                                      { name: "Image processing", cp: 5 },
                                      { name: "Industrial logistics", cp: 5 },
                                      { name: "Robotics", cp: 5 },
                                      { name: "Sensor technology", cp: 5 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-2.5 rounded-lg border border-cyan-500/10 flex items-center justify-between ${
                                        darkMode ? 'bg-cyan-950/10' : 'bg-cyan-50/30'
                                      }`}>
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>{mod.name}</span>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Semester 7 Card */}
                            {(selectedCurriculumYear === 'all' || selectedCurriculumYear === '4') && (
                              <div className={`p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                      Semester 7 (Year 4)
                                    </h4>
                                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/25">
                                      30 CP
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {[
                                      { name: "Industrial placement", cp: 15 },
                                      { name: "Bachelor's thesis", cp: 15 }
                                    ].map((mod, mIdx) => (
                                      <div key={mIdx} className={`p-3 rounded-lg border border-orange-500/10 flex items-center justify-between ${
                                        darkMode ? 'bg-orange-950/10' : 'bg-orange-50/10'
                                      }`}>
                                        <div>
                                          <span className={`block text-xs font-bold ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>{mod.name}</span>
                                          <span className={`block text-[10px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {mod.name === "Industrial placement" ? "12-week professional internship block" : "Final capstone project & defense"}
                                          </span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400">
                                          {mod.cp} CP
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {filteredCurriculumCards.length > 0 && (
                        <div 
                          className={`grid gap-5 w-full transition-all duration-300 ${
                            filteredCurriculumCards.length === 1 
                              ? 'grid-cols-1 max-w-xl mx-auto' 
                              : filteredCurriculumCards.length === 2 
                                ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' 
                                : 'grid-cols-1 md:grid-cols-3'
                          }`} 
                          id="curriculum-cards-grid"
                        >
                          {filteredCurriculumCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part B: Regulations */}
                  {(foundationTransitionMatches || filteredRegulationCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Official Regulations & Policies
                        </h2>
                      </div>

                      {foundationTransitionMatches && (
                        <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                          darkMode 
                            ? 'bg-slate-900/40 border-slate-800 backdrop-blur-xl' 
                            : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2">
                            <h3 className={`text-base font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              Academic Transition & Progression Regulations
                            </h3>
                            <p className={`text-xs leading-relaxed mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              To qualify for academic progression into subsequent semesters of the Mechatronics (MEC) program, students must successfully fulfill all of the following mandatory regulatory conditions:
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* IELTS Requirement Card */}
                              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                                darkMode 
                                  ? 'bg-slate-950/40 border-slate-900/80 hover:border-orange-500/20' 
                                  : 'bg-slate-50/50 border-slate-150 shadow-xs hover:border-orange-500/30'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-orange-500/10 text-orange-500 border border-orange-500/15">
                                      Language Proficiency
                                    </span>
                                    <span className="text-[10px] font-semibold text-rose-500 font-mono">Deadline: 15.08</span>
                                  </div>
                                  <h4 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    IELTS 6.0 Certificate
                                  </h4>
                                  <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Students must achieve a minimum English proficiency of <strong className="text-orange-500">IELTS 6.0</strong> and submit a valid certificate copy directly to the <strong className="text-slate-900 dark:text-white">VGU ASA</strong> office no later than <strong className="border-b border-rose-400/40 text-rose-500">15.08</strong>.
                                  </p>
                                </div>
                              </div>

                              {/* ECTS Academic Requirement Card */}
                              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                                darkMode 
                                  ? 'bg-slate-950/40 border-slate-900/80 hover:border-orange-500/20' 
                                  : 'bg-slate-50/50 border-slate-150 shadow-xs hover:border-orange-500/30'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">
                                      Academic Progress
                                    </span>
                                    <span className="text-[10px] font-semibold text-emerald-500 font-mono">Passed &ge; 80% ECTS</span>
                                  </div>
                                  <h4 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    Complete &ge; 80% ECTS
                                  </h4>
                                  <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Successfully pass a minimum of <strong className="text-emerald-500">&ge; 80% of total Credit Points (ECTS)</strong> required in the Foundation Semester curriculum. All component exams and coursework must have registered final grades.
                                  </p>
                                </div>
                              </div>

                              {/* Basic Internship Requirement Card */}
                              <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                                darkMode 
                                  ? 'bg-slate-950/40 border-slate-900/80 hover:border-orange-500/20' 
                                  : 'bg-slate-50/50 border-slate-150 shadow-xs hover:border-orange-500/30'
                              }`}>
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-blue-500/10 text-blue-500 border border-blue-500/15">
                                      Progression Standard
                                    </span>
                                    <span className="text-[10px] font-semibold text-blue-500 font-mono">S4 Requirement</span>
                                  </div>
                                  <h4 className={`font-bold text-sm mb-1.5 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    Basic Internship Completion
                                  </h4>
                                  <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    To qualify for progression into <strong className="text-blue-500">Semester 4</strong> of the curriculum, students must <strong className="text-blue-500">fully complete</strong> and obtain satisfactory grade verification for their Basic Internship block.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredRegulationCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="regulation-cards-grid">
                          {filteredRegulationCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 4. FORMS */}
              {activeTab === 'forms' && (
                <div className="space-y-4" id="section-forms">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="w-5 h-5 text-orange-500" />
                    <h2 className={`text-base font-extrabold tracking-tight ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Student Administrative Forms
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="form-cards-grid">
                    {filteredFormCards.map((card, idx) => (
                      <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                    ))}
                  </div>
                </div>
              )}

              {/* 5. INTERNSHIP & BACHELOR THESIS */}
              {activeTab === 'internship-thesis' && (
                <div className="space-y-8" id="section-internship-thesis">
                  {/* Part B: Internship Requirements */}
                  {(internshipOverviewMatches || filteredInternshipCards.length > 0) && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Internship Requirements
                        </h2>
                      </div>

                      {internshipOverviewMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Basic & Professional Internship
                          </h3>
                          
                          <div className="space-y-4 text-xs leading-relaxed">
                            <div>
                              <span className="block font-bold text-orange-500 mb-1">1. Basic Internship (Minimum 8 Weeks)</span>
                              <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                                Focused on fundamental mechanical operations, metal machining (turning, milling, drilling), basic electrical wiring, PCB fabrication, and technical draftings. Must be completed in registered industrial training workshops or approved mechatronic production lines before entering year 3.
                              </p>
                            </div>

                            <div className="pt-3 border-t border-dashed border-slate-800">
                              <span className="block font-bold text-orange-500 mb-1">2. Professional Internship (Minimum 12 Weeks)</span>
                              <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                                An advanced placement centering on systems engineering, factory automation (PLC/SCADA loops), software controls, or mechanical hardware design. Undertaken in reputable multi-national engineering firms or research facilities. Requires a dual sign-off from both VGU coordinator and corporate advisor.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredInternshipCards.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5" id="internship-cards-grid">
                          {filteredInternshipCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part A: Bachelor Thesis */}
                  {(thesisOverviewMatches || filteredThesisCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Bachelor Thesis Guidelines
                        </h2>
                      </div>

                      {thesisOverviewMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Bachelor Thesis Milestones & Deliverables
                          </h3>
                          <p className={`text-xs leading-relaxed mb-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            The final Bachelor Thesis (12 ECTS) is the capstone engineering achievement. It represents independent research addressing complex mechanical, hardware controller, and embedded software intersections.
                          </p>

                          {/* Timeline Stages */}
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3" id="thesis-timeline">
                            <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                              <span className="block font-mono text-[9px] text-orange-500 font-bold uppercase">Stage 1</span>
                              <span className={`block text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Proposal</span>
                              <span className="block text-[10px] text-slate-500">Month 1</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                              <span className="block font-mono text-[9px] text-orange-500 font-bold uppercase">Stage 2</span>
                              <span className={`block text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Literature</span>
                              <span className="block text-[10px] text-slate-500">Month 2</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                              <span className="block font-mono text-[9px] text-orange-500 font-bold uppercase">Stage 3</span>
                              <span className={`block text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Prototyping</span>
                              <span className="block text-[10px] text-slate-500">Months 3-4</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                              <span className="block font-mono text-[9px] text-orange-500 font-bold uppercase">Stage 4</span>
                              <span className={`block text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Draft Writing</span>
                              <span className="block text-[10px] text-slate-500">Month 5</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 rounded border border-orange-500/10 text-center">
                              <span className="block font-mono text-[9px] text-orange-500 font-bold uppercase">Stage 5</span>
                              <span className={`block text-xs font-bold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Defense</span>
                              <span className="block text-[10px] text-slate-500">Month 6</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredThesisCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5" id="thesis-cards-grid">
                          {filteredThesisCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part C: Graduation Audits */}
                  {(graduationOverviewMatches || filteredGraduationCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Graduation Checklists & Audits
                        </h2>
                      </div>

                      {graduationOverviewMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Final Graduation Academic Audits
                          </h3>
                          <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Students are advised to initiate the academic clearance audit during Year 4 Semester 2. All credits including basic studies, professional internship, and the Bachelor Thesis must be fully computed on SIS grade sheets.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <span className="text-xs">Satisfy 210 ECTS Credit Target</span>
                            </div>
                            <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <span className="text-xs">IELTS 6.0 English Proficiency level</span>
                            </div>
                            <div className={`p-3 rounded-lg border flex items-center gap-2.5 ${
                              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}>
                              <Check className="w-4 h-4 text-orange-500 flex-shrink-0" />
                              <span className="text-xs">Complete both Internship stages</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredGraduationCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="graduation-cards-grid">
                          {filteredGraduationCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SCHOLARSHIP & EXCHANGE */}
              {activeTab === 'scholarship-exchange' && (
                <div className="space-y-8" id="section-scholarship-exchange">
                  {/* Part A: Scholarships */}
                  {filteredScholarshipCards.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Scholarships
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="scholarship-cards-grid">
                        {filteredScholarshipCards.map((card, idx) => (
                          <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VGU Merit Scholarship & 4-Year Full Scholarship Guidelines */}
                  <div className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 ${
                    darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`} id="merit-scholarship-dashboard-panel">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                    
                    <div className="pl-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div>
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-orange-500/10 text-orange-500 border border-orange-500/15">
                            Official Regulatory Policy
                          </span>
                          <h3 className={`text-base font-extrabold mt-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            VGU Merit Scholarship & 4-Year Full Scholarship Guidelines
                          </h3>
                        </div>
                        
                        {/* Sub Tab Controls */}
                        <div className={`flex p-0.5 rounded-lg border ${
                          darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <button
                            onClick={() => setScholarshipSubTab('rules')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                              scholarshipSubTab === 'rules'
                                ? 'bg-orange-500 text-white shadow-xs'
                                : `text-slate-500 hover:text-slate-800 dark:hover:text-slate-200`
                            }`}
                          >
                            Annual Rules
                          </button>
                          <button
                            onClick={() => setScholarshipSubTab('full')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                              scholarshipSubTab === 'full'
                                ? 'bg-orange-500 text-white shadow-xs'
                                : `text-slate-500 hover:text-slate-800 dark:hover:text-slate-200`
                            }`}
                          >
                            4-Year Full
                          </button>
                          <button
                            onClick={() => setScholarshipSubTab('checker')}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                              scholarshipSubTab === 'checker'
                                ? 'bg-orange-500 text-white shadow-xs'
                                : `text-slate-500 hover:text-slate-800 dark:hover:text-slate-200`
                            }`}
                          >
                            Eligibility Checker
                          </button>
                        </div>
                      </div>

                      {/* Tab 1: Rules & Categories */}
                      {scholarshipSubTab === 'rules' && (
                        <div className="space-y-6">
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Merit Scholarships at VGU are awarded based on academic performance from the previous semester or academic year to support outstanding engineering achievements in the Mechatronics (MEC) program.
                          </p>

                          {/* Scholarship Categories Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl border relative overflow-hidden ${
                              darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50/50 border-slate-150'
                            }`}>
                              <div className="absolute top-0 right-0 px-6 py-2 text-base font-mono font-bold bg-orange-500/10 text-orange-500 border-b border-l border-orange-500/15 rounded-bl-lg">
                                Top 5%
                              </div>
                              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider block mb-1">Category A</span>
                              <div className={`text-2xl font-black mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>100% Scholarship</div>
                            </div>

                            <div className={`p-4 rounded-xl border relative overflow-hidden ${
                              darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50/50 border-slate-150'
                            }`}>
                              <div className="absolute top-0 right-0 px-6 py-2 text-base font-mono font-bold bg-blue-500/10 text-blue-500 border-b border-l border-blue-500/15 rounded-bl-lg">
                                Next 5%
                              </div>
                              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-1">Category B</span>
                              <div className={`text-2xl font-black mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>50% Scholarship</div>
                            </div>

                            <div className={`p-4 rounded-xl border relative overflow-hidden ${
                              darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50/50 border-slate-150'
                            }`}>
                              <div className="absolute top-0 right-0 px-6 py-2 text-base font-mono font-bold bg-green-500/10 text-green-500 border-b border-l border-green-500/15 rounded-bl-lg">
                                Next 5%
                              </div>
                              <span className="text-xs font-bold text-green-500 uppercase tracking-wider block mb-1">Category C</span>
                              <div className={`text-2xl font-black mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>25% Scholarship</div>
                            </div>
                          </div>

                          {/* Allocation Note */}
                          <div className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
                            darkMode ? 'bg-slate-950/20 border-slate-800/80 text-slate-300' : 'bg-slate-50/50 border-slate-200/60 text-slate-600'
                          }`}>
                            <Info className="w-4.5 h-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed">
                              <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Allocation Formula:</strong> The number of scholarships for Categories A, B, and C corresponds to exactly the top 5%, next 5%, and subsequent 5% of the total number of currently registered students in each study program (excluding deferred students), rounded to the nearest whole number.
                            </p>
                          </div>

                          {/* Eligibility Criteria Cards */}
                          <div>
                            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                              Mandatory Eligibility Conditions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>First-Attempt Only</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Only first exam attempts are counted for scholarship GPA calculation. Retake exam results are strictly excluded.</p>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Full Module Completion</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Must pass 100% of all required modules included in the specific list of modules for the semester or academic year under consideration.</p>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>No Failed or Skipped Exams</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Students must not fail or skip any registered exam or course module in that list.</p>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Minimum Academic GPA</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Requires a minimum GPA of <span className="font-semibold text-orange-500">2.30 (German scale)</span> or <span className="font-semibold text-orange-500">7.70 (Vietnamese scale)</span>.</p>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>IELTS Submission on Time</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Must submit IELTS Academic 6.0 (or equivalent) by August 31 of the 1st academic year.</p>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg border flex gap-2.5 ${
                                darkMode ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-50/30 border-slate-150'
                              }`}>
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>No Disciplinary Violations</strong>
                                  <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>No academic dishonesty or disciplinary warnings recorded. Tuition fee payments must be fully completed.</p>
                                </div>
                              </div>
                            </div>

                            {/* Ties Note */}
                            <div className={`mt-3 p-3 rounded-lg border ${
                              darkMode ? 'bg-slate-950/40 border-slate-900 text-slate-400' : 'bg-slate-50/40 border-slate-150 text-slate-500'
                            }`}>
                              <p className="text-[10.5px] leading-relaxed italic">
                                * <strong className="font-bold">GPA Tie-breaker:</strong> In cases where multiple students achieve identical GPA scores, social contributions and participation in student activities/clubs may also be considered.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 2: 4-Year Full Scholarship */}
                      {scholarshipSubTab === 'full' && (
                        <div className="space-y-6">
                          <div className={`p-4 rounded-xl border relative overflow-hidden ${
                            darkMode ? 'bg-slate-950/40 border-slate-850' : 'bg-orange-50/20 border-orange-100 shadow-xs'
                          }`}>
                            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold bg-orange-500/10 text-orange-500 border-b border-l border-orange-500/15 rounded-bl-lg">
                              Full Ride
                            </div>
                            <h4 className={`text-base font-extrabold mb-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              Full Merit Scholarship (4-Year Scholarship)
                            </h4>
                            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              Students may receive a 100% tuition scholarship for all four years of their Mechatronics studies if they satisfy the initial requirements and consistently meet the annual maintenance conditions.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Enrollment Prerequisites */}
                            <div className="space-y-3">
                              <h5 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                1. Freshman Eligibility Prerequisites
                              </h5>
                              <ul className="space-y-2 text-xs">
                                <li className="flex gap-2">
                                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                                    Have <strong className={darkMode ? 'text-white' : 'text-slate-900'}>IELTS Academic 7.0 or above</strong>.
                                  </span>
                                </li>
                                <li className="flex gap-2">
                                  <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                  <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                                    Received a <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Category A Scholarship</strong> in the first year through admission <strong className="text-orange-500">Modes 1, 3, or 4</strong>.
                                  </span>
                                </li>
                              </ul>
                            </div>

                            {/* Maintenance Conditions */}
                            <div className="space-y-3">
                              <h5 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                2. Annual Maintenance Requirements
                              </h5>
                              <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                To maintain this scholarship, students must consistently satisfy VGU's yearly academic review with the following cumulative GPA targets:
                              </p>
                              <div className={`p-3 rounded-lg border border-dashed flex gap-2.5 items-center ${
                                darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'
                              }`}>
                                <Award className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <div className="text-xs">
                                  <span className={`block font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Cumulative GPA Target:</span>
                                  <span className="text-orange-500 font-extrabold">≥ 1.70</span> (German scale) <span className="text-slate-400">or</span> <span className="text-orange-500 font-extrabold">≥ 8.70</span> (Vietnamese scale)
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                            darkMode ? 'bg-slate-950/25 border-slate-900 text-slate-400' : 'bg-slate-50/30 border-slate-150 text-slate-500'
                          }`}>
                            <p>
                              💡 <strong className="font-bold text-orange-500">Important Note:</strong> The 4-Year Full Merit Scholarship is audited annually. If a student falls below the 1.70 German / 8.70 Vietnamese scale GPA, the scholarship status is temporarily suspended until academic parameters are re-established.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Eligibility Checker */}
                      {scholarshipSubTab === 'checker' && (
                        <div className="space-y-6">
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Enter your academic data below to quickly verify your eligibility for the standard and 4-year VGU merit scholarship programs:
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Standard Merit Scholarship Form */}
                            <div className={`p-5 rounded-xl border space-y-4 ${
                              darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50/40 border-slate-200'
                            }`}>
                              <h4 className={`font-bold text-sm border-b pb-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'}`}>
                                Standard Merit Scholarship Check
                              </h4>
                              
                              <div className="space-y-3">
                                {/* GPA Input */}
                                <div>
                                  <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Your Academic GPA
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      placeholder="e.g. 1.85 or 8.2"
                                      value={chkGPAVal}
                                      onChange={(e) => setChkGPAVal(e.target.value)}
                                      className={`w-full px-3 py-1.5 text-xs rounded border outline-hidden transition-all duration-200 ${
                                        darkMode 
                                          ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' 
                                          : 'bg-white border-slate-200 text-slate-900 focus:border-orange-500 shadow-2xs'
                                      }`}
                                    />
                                    <select
                                      value={chkGPAScale}
                                      onChange={(e) => setChkGPAScale(e.target.value as 'german' | 'vietnamese')}
                                      className={`px-2.5 py-1.5 text-xs rounded border outline-hidden ${
                                        darkMode 
                                          ? 'bg-slate-950 border-slate-800 text-white' 
                                          : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                                      }`}
                                    >
                                      <option value="german">German Scale (0.7 - 4.0)</option>
                                      <option value="vietnamese">Vietnamese (0 - 10)</option>
                                    </select>
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-1 italic">
                                    * Note: German scale uses lower values for higher grades (e.g., 1.0 is excellent, 2.30 is minimum pass for scholarship).
                                  </p>
                                </div>

                                {/* Checkbox requirements */}
                                <div className="space-y-2 pt-1 text-xs">
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkPassedAll}
                                      onChange={(e) => setChkPassedAll(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I passed 100% of my required modules</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkNoFail}
                                      onChange={(e) => setChkNoFail(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I did not fail or skip any exam or module</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkNoRetake}
                                      onChange={(e) => setChkNoRetake(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Only first attempts used (no retake results counted)</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkIELTS}
                                      onChange={(e) => setChkIELTS(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I submitted IELTS Academic 6.0+ on time (by August 31 of Year 1)</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkNoDisciplinary}
                                      onChange={(e) => setChkNoDisciplinary(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I have zero disciplinary violations</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkTuitionPaid}
                                      onChange={(e) => setChkTuitionPaid(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>My tuition and other financial obligations are fully completed</span>
                                  </label>
                                </div>
                              </div>

                              {/* Standard Calculation Output */}
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                                {(() => {
                                  const parsed = parseFloat(chkGPAVal);
                                  const hasGPA = !isNaN(parsed) && chkGPAVal.trim() !== '';
                                  const gpaMeets = hasGPA && (
                                    chkGPAScale === 'german' ? parsed <= 2.30 && parsed >= 0.7 : parsed >= 7.70 && parsed <= 10.0
                                  );
                                  const othersMeets = chkPassedAll && chkNoFail && chkNoRetake && chkIELTS && chkNoDisciplinary && chkTuitionPaid;
                                  
                                  if (!chkGPAVal) {
                                    return (
                                      <div className={`p-3 rounded-lg text-xs flex gap-2 items-center ${
                                        darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        <Info className="w-4 h-4 text-orange-500" />
                                        <span>Please fill out your GPA and complete the checklist above.</span>
                                      </div>
                                    );
                                  }

                                  if (!gpaMeets) {
                                    return (
                                      <div className="p-3 rounded-lg text-xs bg-red-500/10 border border-red-500/15 text-red-500 flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <strong className="font-bold">Ineligible (GPA Standard):</strong>
                                          <p className="mt-0.5 leading-relaxed">
                                            Your GPA ({parsed}) does not satisfy the minimum requirement of {chkGPAScale === 'german' ? '≤ 2.30 (German Scale)' : '≥ 7.70 (Vietnamese Scale)'}.
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (!othersMeets) {
                                    return (
                                      <div className="p-3 rounded-lg text-xs bg-amber-500/10 border border-amber-500/15 text-amber-500 flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <strong className="font-bold">Ineligible (Conditions):</strong>
                                          <p className="mt-0.5 leading-relaxed">
                                            Your GPA is high enough, but all regulatory conditions must be checked to qualify. Note that only first attempts are counted (no retakes).
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="p-3 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 flex gap-2 items-start">
                                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <strong className="font-bold">🎉 Eligible for Merit Scholarship!</strong>
                                        <p className="mt-0.5 leading-relaxed">
                                          Excellent work! You meet all mandatory conditions. Your final scholarship category (Category A, B, or C) will depend on your academic ranking within the top 15% of your registered study program.
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* 4-Year Full ride Form */}
                            <div className={`p-5 rounded-xl border space-y-4 ${
                              darkMode ? 'bg-slate-950/40 border-slate-900' : 'bg-slate-50/40 border-slate-200'
                            }`}>
                              <h4 className={`font-bold text-sm border-b pb-2 ${darkMode ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'}`}>
                                4-Year Full Scholarship Audit
                              </h4>
                              
                              <div className="space-y-3">
                                {/* Cumulative GPA Input */}
                                <div>
                                  <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Your Cumulative Academic GPA (Maintenance)
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      placeholder="e.g. 1.55 or 8.9"
                                      value={chkFullCumulativeGPA}
                                      onChange={(e) => setChkFullCumulativeGPA(e.target.value)}
                                      className={`w-full px-3 py-1.5 text-xs rounded border outline-hidden transition-all duration-200 ${
                                        darkMode 
                                          ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' 
                                          : 'bg-white border-slate-200 text-slate-900 focus:border-orange-500 shadow-2xs'
                                      }`}
                                    />
                                    <select
                                      value={chkFullGPAScale}
                                      onChange={(e) => setChkFullGPAScale(e.target.value as 'german' | 'vietnamese')}
                                      className={`px-2.5 py-1.5 text-xs rounded border outline-hidden ${
                                        darkMode 
                                          ? 'bg-slate-950 border-slate-800 text-white' 
                                          : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
                                      }`}
                                    >
                                      <option value="german">German Scale (0.7 - 4.0)</option>
                                      <option value="vietnamese">Vietnamese (0 - 10)</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Freshmen Criteria Checkboxes */}
                                <div className="space-y-2 pt-1 text-xs">
                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkFullIELTS}
                                      onChange={(e) => setChkFullIELTS(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I have IELTS Academic 7.0 or above</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={chkFullCatA}
                                      onChange={(e) => setChkFullCatA(e.target.checked)}
                                      className="accent-orange-500 rounded"
                                    />
                                    <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>I received Category A scholarship in year 1 via Modes 1, 3, or 4</span>
                                  </label>
                                </div>
                              </div>

                              {/* Full Calculation Output */}
                              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                                {(() => {
                                  const parsed = parseFloat(chkFullCumulativeGPA);
                                  const hasGPA = !isNaN(parsed) && chkFullCumulativeGPA.trim() !== '';
                                  const maintenanceMeets = hasGPA && (
                                    chkFullGPAScale === 'german' ? parsed <= 1.70 && parsed >= 0.7 : parsed >= 8.70 && parsed <= 10.0
                                  );
                                  
                                  if (!chkFullCumulativeGPA) {
                                    return (
                                      <div className={`p-3 rounded-lg text-xs flex gap-2 items-center ${
                                        darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        <Info className="w-4 h-4 text-orange-500" />
                                        <span>Please enter your Cumulative GPA and verify freshmen status.</span>
                                      </div>
                                    );
                                  }

                                  if (!chkFullIELTS || !chkFullCatA) {
                                    return (
                                      <div className="p-3 rounded-lg text-xs bg-red-500/10 border border-red-500/15 text-red-500 flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <strong className="font-bold">Ineligible (Initial Requirements):</strong>
                                          <p className="mt-0.5 leading-relaxed">
                                            The 4-Year Full Merit Scholarship is exclusive to students entering via admission Modes 1, 3, or 4 with IELTS 7.0+ who received Category A scholarship in their first year.
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  if (!maintenanceMeets) {
                                    return (
                                      <div className="p-3 rounded-lg text-xs bg-amber-500/10 border border-amber-500/15 text-amber-500 flex gap-2 items-start">
                                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <strong className="font-bold">Suspended (GPA Maintenance Audit):</strong>
                                          <p className="mt-0.5 leading-relaxed">
                                            You met the initial criteria! However, your current Cumulative GPA ({parsed}) is below the required maintenance threshold of {chkFullGPAScale === 'german' ? '≤ 1.70 (German Scale)' : '≥ 8.70 (Vietnamese Scale)'}. Your 100% discount will be suspended for the next period.
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className="p-3 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 flex gap-2 items-start">
                                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <strong className="font-bold">🎉 Eligible! Full Scholarship Maintained!</strong>
                                        <p className="mt-0.5 leading-relaxed">
                                          Superb! You satisfy both initial freshmen conditions and current academic maintenance parameters. Your 100% full-ride tuition exemption is successfully renewed for the upcoming academic period!
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Part B: Exchange */}
                  {(exchangeOverviewMatches || filteredExchangeCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Exchange Semester
                        </h2>
                      </div>

                      {exchangeOverviewMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Student Mobility Partnership with HAW Hamburg
                          </h3>
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            VGU MEC students have the exclusive opportunity to spend their 7th semester at the Hamburg University of Applied Sciences (HAW Hamburg) in Germany. During this exchange block, students complete elective coursework and their Bachelor Thesis in collaboration with state-of-the-art German laboratory teams or partner industrial corporations.
                          </p>
                        </div>
                      )}

                      {filteredExchangeCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="exchange-cards-grid">
                          {filteredExchangeCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 7. FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4" id="section-faq">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-orange-500" />
                    <h2 className={`text-base font-extrabold tracking-tight ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      Frequently Asked Questions (FAQ)
                    </h2>
                  </div>
                  <div className="space-y-3" id="faq-accordion-group">
                    {filteredFaqItems.map((item, idx) => {
                      const isOpen = !!faqOpenState[idx];
                      return (
                        <div 
                          key={idx}
                          className={`rounded-xl border transition-all overflow-hidden ${
                            darkMode 
                              ? 'bg-slate-900/50 border-slate-800' 
                              : 'bg-white border-slate-200 shadow-xs'
                          }`}
                        >
                          <button
                            onClick={() => toggleFaq(idx)}
                            className={`w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.005] active:scale-[0.99] border-b ${
                              darkMode 
                                ? 'bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-950/40 border-b-slate-850 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-slate-800/80 hover:to-slate-900/80 hover:shadow-md' 
                                : 'bg-gradient-to-b from-white/95 via-white/85 to-slate-50/90 border-b-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:from-sky-50 hover:to-blue-100/30 hover:shadow-sm'
                            }`}
                            id={`faq-btn-${idx}`}
                          >
                            <span className={`text-xs md:text-sm font-bold leading-tight ${
                              darkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                              {item.question}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`} />
                          </button>

                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className={`px-5 pb-5 pt-1 text-xs leading-relaxed border-t whitespace-pre-line ${
                                  darkMode ? 'text-slate-400 border-slate-800/60' : 'text-slate-600 border-slate-100'
                                }`}>
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer */}
        <footer className={`mt-auto border-t py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          darkMode 
            ? 'bg-slate-950 border-slate-850 text-slate-400' 
            : 'bg-slate-100 border-slate-200 text-slate-800'
        }`} id="global-footer">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6" id="footer-top-row">
              <div className="space-y-2">
                <h2 className="font-sans font-extrabold text-sm uppercase tracking-wider text-orange-500" id="footer-heading">
                  Mechatronics Program · VGU
                </h2>
                <div className="text-xs leading-relaxed max-w-4xl text-slate-900 dark:text-slate-300 space-y-1.5" id="footer-office-info">
                  <p>
                    <span className="font-extrabold text-slate-950 dark:text-white border-b border-orange-500/30 pb-0.5 mr-1">Academic Coordinator:</span>{' '}
                    <span className="font-semibold text-slate-950 dark:text-slate-100">Assoc. Prof. Do Xuan Phu</span> (Building 5, Room 420 ·{' '}
                    <a href="mailto:phu.dx@vgu.edu.vn" className="text-orange-600 dark:text-orange-400 hover:underline">phu.dx@vgu.edu.vn</a>)
                  </p>
                  <p>
                    <span className="font-extrabold text-slate-950 dark:text-white border-b border-orange-500/30 pb-0.5 mr-1">Program Office:</span>{' '}
                    <span className="font-semibold text-slate-950 dark:text-slate-100">Ms. Tran Thi Yen</span> (Building 5, Room 527 ·{' '}
                    <a href="mailto:yen.tt@vgu.edu.vn" className="text-orange-600 dark:text-orange-400 hover:underline">mec@vgu.edu.vn</a>)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs" id="footer-bottom-row">
              <p className="font-medium text-slate-900 dark:text-slate-300" id="footer-help-note">
                Need help? Email the program office or come to <span className="font-extrabold text-slate-950 dark:text-white border-b border-orange-500/30 pb-0.5">Building 5, Room 527</span>.
              </p>
              <p className="font-mono text-[10.5px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase" id="footer-version-stamp">
                Last updated: July 2026
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
