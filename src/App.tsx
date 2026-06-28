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
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }

    setShowDropdown(false);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      if (isMobileMenuOpen) {
        setShowHeader(true);
        lastScrollY = currentScrollY;
        return;
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      
      lastScrollY = currentScrollY;
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

  const labSafetyMatches = !query ||
    "Laboratory Safety & Conduct Guidelines".toLowerCase().includes(query) ||
    "Mechatronics laboratories are equipped with heavy industrial robotics, advanced pneumatic grids, and high-voltage power electronics. Unsupervised work is strictly forbidden. Safety shoes, glasses, and professional lab coats are mandatory during all scheduled laboratory blocks.".toLowerCase().includes(query) ||
    "Laser & PLC Safety training certificates required".toLowerCase().includes(query) ||
    "All incident logs must be immediate-dispatched to Coordinator".toLowerCase().includes(query);

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

  const totalMatchesCount = query 
    ? (filteredInfoChannels.length + filteredScheduleCards.length + filteredExamCards.length + filteredCurriculumCards.length + 
       filteredRegulationCards.length + filteredFormCards.length + filteredThesisCards.length + 
       filteredInternshipCards.length + filteredGraduationCards.length + filteredScholarshipCards.length + 
       filteredExchangeCards.length + filteredFaqItems.length)
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
        return filteredScholarshipCards.length + filteredExchangeCards.length;
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
              ? 'bg-slate-900 shadow-md border-b border-slate-800/80' 
              : 'bg-white shadow-md border-b border-slate-200/80'
            : 'bg-transparent'
        }`} id="top-sticky-header-container">
          
          {/* Row 1: Brand & Logos & Controls with smooth slide transition */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showHeader 
              ? 'max-h-[90px] opacity-100' 
              : 'max-h-0 opacity-0 pointer-events-none'
          }`}>
            <header className={`px-4 py-1 sm:px-6 lg:px-8 border-b transition-all duration-300 flex flex-row items-center justify-between gap-3 sm:gap-4 ${
              isScrolled 
                ? 'bg-transparent border-transparent' 
                : darkMode 
                  ? 'border-slate-800/50 bg-slate-900/75' 
                  : 'border-slate-200/50 bg-white/75'
            }`} id="top-navbar">
              
              {/* Two Official Logos side-by-side with a clean separator */}
              <div className="flex items-center space-x-3 sm:space-x-4" id="navbar-left-container">
                {/* HAW Hamburg Official Logo Slot */}
                <div className="flex items-center" id="haw-logo-wrapper">
                  <img 
                    src="https://i.postimg.cc/Y9YKTnDp/haw-hamburg-seeklogo.png" 
                    alt="HAW Hamburg University" 
                    className="h-[38.4px] md:h-[44.8px] w-auto object-contain bg-transparent transition-all duration-300 hover:scale-102"
                    referrerPolicy="no-referrer"
                    id="haw-official-logo"
                  />
                </div>

                {/* Clean separator */}
                <div className={`h-8 md:h-[38.4px] w-[1px] transition-colors duration-300 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} id="logos-separator" />

                {/* VGU Official Logo Slot */}
                <div className="flex items-center" id="vgu-logo-wrapper">
                  <img 
                    src="https://i.postimg.cc/vHQFSvWh/VGU-Logo-(1).png" 
                    alt="Vietnamese-German University (VGU)" 
                    className="h-[38.4px] md:h-[44.8px] w-auto object-contain px-1 bg-transparent transition-all duration-300 hover:scale-102"
                    referrerPolicy="no-referrer"
                    id="vgu-official-logo"
                  />
                </div>

                {/* Small subtle academic portal title next to logos */}
                <div className={`hidden lg:flex flex-col border-l pl-4 py-1 justify-center transition-colors duration-300 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`} id="portal-title-block">
                  <h1 className={`font-sans font-black text-[19.2px] md:text-[24px] tracking-tight leading-none flex items-center transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    MEC <span className="bg-orange-500 text-white font-bold text-[9.6px] uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm ml-1.5 inline-flex items-center justify-center leading-none transition-all duration-300 ease-in-out cursor-pointer hover:bg-orange-500/25 hover:backdrop-blur-lg hover:border hover:border-orange-500/30 hover:text-orange-500 hover:shadow-[0_4px_15px_-3px_rgba(249,115,22,0.35)] dark:hover:shadow-[0_4px_15px_-3px_rgba(249,115,22,0.5)]">PORTAL</span>
                  </h1>
                  <span className="text-[9.6px] md:text-[11.2px] font-medium tracking-widest uppercase mt-1 border-l-2 border-slate-700 dark:border-slate-500 pl-2 ml-0.5 text-slate-800 dark:text-slate-400 leading-none transition-colors duration-300">
                    Mechatronics Engineering
                  </span>
                </div>
              </div>

              {/* Right Header Controls: Dark Mode and Mobile Hamburger Menu */}
              <div className="flex items-center justify-end space-x-2.5 sm:space-x-3" id="navbar-controls">
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
          } px-4 py-3 sm:px-6 lg:px-8`} id="horizontal-navigation-hub">
            <div className="max-w-full mx-auto w-full">
              <div 
                className="flex flex-wrap justify-center gap-y-3 gap-x-4 py-1.5 w-full" 
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
                      className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-sm md:text-base font-semibold whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 active:scale-95 cursor-pointer flex-shrink-0 border ${
                        isActive
                          ? darkMode
                            ? 'bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 text-orange-400 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(249,115,22,0.25)] font-bold backdrop-blur-md'
                            : 'bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 text-orange-600 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(249,115,22,0.12)] font-bold backdrop-blur-md'
                          : darkMode
                            ? 'text-slate-400 border-t-white/10 border-x-white/5 border-b-black/30 bg-gradient-to-b from-slate-850/60 via-slate-900/40 to-slate-950/50 hover:text-slate-100 hover:from-slate-800/80 hover:to-slate-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)]'
                            : 'text-slate-600 border-t-white border-x-white/80 border-b-slate-200/40 bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.02)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:shadow-md hover:border-b-blue-300 hover:shadow-blue-100/30'
                      }`}
                    >
                      <span className={`${
                        isActive 
                          ? darkMode ? 'text-orange-400' : 'text-orange-600' 
                          : 'text-slate-400 dark:text-slate-500'
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
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] active:scale-95 cursor-pointer border w-full text-left ${
                          isActive
                            ? darkMode
                              ? 'bg-gradient-to-b from-orange-500/25 via-orange-500/15 to-orange-600/30 text-orange-400 border-t-orange-400/40 border-x-orange-500/20 border-b-orange-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(249,115,22,0.25)] font-bold backdrop-blur-md'
                              : 'bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-orange-500/10 text-orange-600 border-t-orange-400/40 border-x-orange-400/20 border-b-orange-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_rgba(249,115,22,0.12)] font-bold backdrop-blur-md'
                            : darkMode
                              ? 'text-slate-400 border-t-white/10 border-x-white/5 border-b-black/30 bg-gradient-to-b from-slate-850/60 via-slate-900/40 to-slate-950/50 hover:text-slate-100 hover:from-slate-800/80 hover:to-slate-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.25)]'
                              : 'text-slate-600 border-t-white border-x-white/80 border-b-slate-200/40 bg-gradient-to-b from-white/95 via-white/85 to-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.02)] hover:text-blue-600 hover:from-sky-50 hover:to-blue-100/70 hover:shadow-md hover:border-b-blue-300 hover:shadow-blue-100/30'
                        }`}
                      >
                        <span className={`${
                          isActive 
                            ? darkMode ? 'text-orange-400' : 'text-orange-600' 
                            : 'text-slate-400 dark:text-slate-500'
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
              ? 'py-2 bg-transparent border-b border-transparent'
              : 'py-3 bg-transparent'
          }`} id="global-search-bar-row">
            <div className="max-w-4xl mx-auto w-full relative" id="global-search-container" ref={searchContainerRef}>
              <div                className={`relative flex items-center w-full rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
                  darkMode 
                    ? 'border-slate-800/50 bg-slate-900/60 text-white shadow-slate-950/25 hover:bg-white/10 hover:backdrop-blur-lg hover:border-white/20 hover:shadow-[0_4px_15px_-3px_rgba(255,255,255,0.15)] focus-within:bg-slate-900/85 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20' 
                    : 'border-slate-200 bg-white/60 text-slate-800 shadow-slate-200/40 hover:bg-sky-100/50 hover:backdrop-blur-lg hover:border-sky-200/60 hover:shadow-md focus-within:bg-white/90 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
                }`}
                id="global-search-pill"
              >
                <div className="absolute left-4 flex items-center pointer-events-none" id="search-icon-wrapper">
                  <Search className={`w-4 h-4 transition-colors duration-200 ${
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
                  className={`w-full py-2.5 pl-11 pr-10 rounded-full text-xs md:text-sm bg-transparent border-0 outline-none focus:outline-none focus:ring-0 placeholder:transition-colors duration-200 ${
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
                    className={`absolute right-4 p-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-90 cursor-pointer shadow-xs hover:shadow-sm ${
                      darkMode 
                        ? 'text-slate-400 hover:text-slate-200 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
                        : 'text-slate-400 hover:text-blue-600 bg-gradient-to-b from-white/95 to-slate-100/95 hover:from-sky-50 hover:to-blue-100/40 border border-slate-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                    }`}
                    title="Clear Search"
                    id="clear-search-btn"
                  >
                    <X className="w-3.5 h-3.5" />
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

        {/* Dynamic content rendering stage */}
        <main className={`flex-1 p-5 md:p-8 relative transition-colors duration-300 ${
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
                            className={`p-5 rounded-xl border transition-all ${
                              darkMode ? 'bg-slate-900/60 border-slate-800 hover:border-orange-500/40' : 'bg-white border-slate-200 hover:border-orange-500/35 hover:shadow-sm'
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
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`font-bold text-sm mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Core Engineering Curriculum Overview
                          </h3>
                          <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            The Mechatronics program is meticulously aligned with HAW Hamburg accreditation standards. It spans over 4 academic years (7-8 semesters), covering fundamental sciences, electrical systems, control loops, and robotics, culminating in a dual-degree Bachelor of Science award.
                          </p>

                          {/* Timeline representation */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-dashed border-slate-800">
                            <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                              <span className="block font-mono text-[10px] text-orange-500 font-bold uppercase mb-1">Year 1</span>
                              <span className={`block text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Foundations</span>
                              <span className={`block text-[10.5px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Maths, Physics, Electronics, CAD Drafting</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                              <span className="block font-mono text-[10px] text-orange-500 font-bold uppercase mb-1">Year 2</span>
                              <span className={`block text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Core Engineering</span>
                              <span className={`block text-[10.5px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Signals, Sensors, Fluidics, Manufacturing Labs</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                              <span className="block font-mono text-[10px] text-orange-500 font-bold uppercase mb-1">Year 3</span>
                              <span className={`block text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Advanced Systems</span>
                              <span className={`block text-[10.5px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Embedded Controllers, Robotics, PLC, DSP</span>
                            </div>
                            <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                              <span className="block font-mono text-[10px] text-orange-500 font-bold uppercase mb-1">Year 4</span>
                              <span className={`block text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Specialization</span>
                              <span className={`block text-[10.5px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Thesis, Elective Modules, Professional Internship</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredCurriculumCards.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="curriculum-cards-grid">
                          {filteredCurriculumCards.map((card, idx) => (
                            <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Part B: Regulations */}
                  {(labSafetyMatches || filteredRegulationCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          Official Regulations & Policies
                        </h2>
                      </div>

                      {labSafetyMatches && (
                        <div className={`p-6 rounded-xl border ${
                          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <h3 className={`text-base font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Laboratory Safety & Conduct Guidelines
                          </h3>
                          <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            Mechatronics laboratories are equipped with heavy industrial robotics, advanced pneumatic grids, and high-voltage power electronics. Unsupervised work is strictly forbidden. Safety shoes, glasses, and professional lab coats are mandatory during all scheduled laboratory blocks.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center gap-2 p-2.5 rounded bg-orange-500/5 border border-orange-500/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Laser & PLC Safety training certificates required</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded bg-orange-500/5 border border-orange-500/10">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>All incident logs must be immediate-dispatched to Coordinator</span>
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
                          MEC & VGU Scholarship Framework
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="scholarship-cards-grid">
                        {filteredScholarshipCards.map((card, idx) => (
                          <PortalCardComponent key={idx} card={card} darkMode={darkMode} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Part B: Exchange */}
                  {(exchangeOverviewMatches || filteredExchangeCards.length > 0) && (
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-orange-500" />
                        <h2 className={`text-base font-extrabold tracking-tight ${
                          darkMode ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          International Student Mobility & Exchanges
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
                                <div className={`px-5 pb-5 pt-1 text-xs leading-relaxed border-t ${
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
                    <span className="font-semibold text-slate-950 dark:text-slate-100">Assoc. Prof. Do Xuan Phu</span> (Building 5, Room 419 ·{' '}
                    <a href="mailto:phu.dx@vgu.edu.vn" className="text-orange-600 dark:text-orange-400 hover:underline">phu.dx@vgu.edu.vn</a>)
                  </p>
                  <p>
                    <span className="font-extrabold text-slate-950 dark:text-white border-b border-orange-500/30 pb-0.5 mr-1">Program Office:</span>{' '}
                    <span className="font-semibold text-slate-950 dark:text-slate-100">Ms. Tran Thi Yen - Program Assistant</span> (Building 5, Room 511 ·{' '}
                    <a href="mailto:yen.tt@vgu.edu.vn" className="text-orange-600 dark:text-orange-400 hover:underline">yen.tt@vgu.edu.vn</a>)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs" id="footer-bottom-row">
              <p className="font-medium text-slate-900 dark:text-slate-300" id="footer-help-note">
                Need help? Email the program office or make an appointment to come to <span className="font-extrabold text-slate-950 dark:text-white border-b border-orange-500/30 pb-0.5">Building 3, Room 511</span>.
              </p>
              <p className="font-mono text-[10.5px] font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase" id="footer-version-stamp">
                Last updated: June 2026
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
