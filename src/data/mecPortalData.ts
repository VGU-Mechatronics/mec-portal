/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortalCard {
  title: string;
  description: string;
  type: 'PDF' | 'LINK' | 'DRIVE' | 'FORM' | 'EXCEL' | 'DOCX';
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StaffMember {
  name: string;
  role: string;
  office: string;
  email: string;
}

export const DUMMY_DRIVE_URL = "https://drive.google.com/drive/folders/1dummy-mec-vgu-drive-link-placeholder";
export const DUMMY_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf_dummy-mec-vgu-form-placeholder/viewform";

export const PORTAL_TABS = [
  { id: 'guidelines', label: 'Guidelines', icon: 'BookOpen' },
  { id: 'schedules-exams', label: 'Schedules & Exams', icon: 'Calendar' },
  { id: 'curriculum-regulations', label: 'Curriculum & Regulations', icon: 'Cpu' },
  { id: 'forms', label: 'Forms', icon: 'ClipboardList' },
  { id: 'internship-thesis', label: 'Internship & Bachelor Thesis', icon: 'GraduationCap' },
  { id: 'scholarship-exchange', label: 'Scholarship & Exchange', icon: 'Globe' },
  { id: 'faq', label: 'FAQ', icon: 'HelpCircle' }
] as const;

export type PortalTabId = typeof PORTAL_TABS[number]['id'];

export const EXAM_CARDS: PortalCard[] = [
  {
    title: "Course Registration Form",
    description: "Submit your semester course list and elective module requests to the academic coordinator.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Step-back Registration Form",
    description: "Formally withdraw from an enrolled course or cancel your exam registration under approved regulations.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Exam Inspection Request",
    description: "Request a review of your graded final examination paper within the permitted administrative window.",
    type: "FORM",
    url: DUMMY_FORM_URL
  }
];

export const SCHEDULE_CARDS: PortalCard[] = [
  {
    title: "SS2026 Semester Schedule",
    description: "Check lecture halls, timetables, professors, and lab groups for the Summer Semester 2026.",
    type: "LINK",
    url: "https://calendar.google.com/calendar/u/0/embed?src=dummy-vgu-calendar"
  },
  {
    title: "WS2026 Semester Schedule",
    description: "Check lecture slots, lab rotations, and provisional exam schedules for the Winter Semester 2026.",
    type: "LINK",
    url: "https://calendar.google.com/calendar/u/0/embed?src=dummy-vgu-calendar"
  }
];

export const CURRICULUM_CARDS: PortalCard[] = [
  {
    title: "HAW Hamburg Module Handbook",
    description: "The complete German accredited module handbook specifying credits, learning outcomes, and assessment styles.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "VGU Module Handbook",
    description: "Official local handbook specifying study plans, credit structures, and VGU regulations for MEC.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Official MEC Syllabus",
    description: "Weekly content maps, project descriptions, textbook specifications, and course requirements.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const REGULATION_CARDS: PortalCard[] = [
  {
    title: "General Academic Regulations",
    description: "Core regulatory framework governing studies, grades, attendance, and student conduct at VGU.",
    type: "PDF",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "MEC Specific Examination Regulations",
    description: "Prerequisites, credit definitions, German-Vietnamese grading standards, and thesis defense guidelines.",
    type: "PDF",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Laboratory Conduct & Safety Policy",
    description: "Legally binding directives for operating high-voltage controllers, robotic cells, and mechanical cutting tools.",
    type: "PDF",
    url: DUMMY_DRIVE_URL
  }
];

export const FORM_CARDS: PortalCard[] = [
  {
    title: "Absenteeism Notification Form",
    description: "Submit medical certificates or approved justifications for missing mandatory lectures or exams.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Late Submission Request",
    description: "Petition for extended deadlines on laboratory manuals, capstone projects, or technical assignments.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Retake Exam Registration Form",
    description: "Sign up for subsequent exam iterations or remedial laboratory blocks for failed components.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Major Stream Selection Form",
    description: "Register your preferred specialization track (e.g. Industrial Automation, Robotics, Embedded Systems).",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "Official Academic Certificate Request",
    description: "Request transcripts, program certification letters, or temporary study status updates.",
    type: "FORM",
    url: DUMMY_FORM_URL
  },
  {
    title: "General Petition Form",
    description: "Submit personal academic requests directly to the MEC Program Office for special consideration.",
    type: "FORM",
    url: DUMMY_FORM_URL
  }
];

export const INTERNSHIP_CARDS: PortalCard[] = [
  {
    title: "Basic Internship Guidelines",
    description: "Official policy on early-stage manufacturing skills training, requirements, duration (8 weeks), and reporting.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Report Cover Template",
    description: "Standardized Microsoft Word template for your final internship portfolio, containing signature fields.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Industrial Placement Authorization Letter",
    description: "Request an official introductory letter signed by VGU to present to external host corporations.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Professional Internship Regulations",
    description: "Advanced engineering experience criteria, supervisor logs, and presentation evaluation rules.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const SCHOLARSHIP_CARDS: PortalCard[] = [
  {
    title: "VGU Merit Scholarship Policy",
    description: "Rules governing merit-based tuition fee discounts (up to 100%) calculated from annual GPA rankings.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "HAW Hamburg Exchange Scholarship Criteria",
    description: "Financial grants and sponsorship pathways for high-performing students completing their exchange semester in Germany.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Germany Scholarship (Deutschlandstipendium)",
    description: "Socio-academic co-funded scholarships open to international students studying on joint German curricula.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const THESIS_CARDS: PortalCard[] = [
  {
    title: "Bachelor Thesis Guidelines & Milestones",
    description: "Comprehensive timeline spanning supervisor pairing, abstract submission, draft editing, and final submission rules.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Thesis Proposal Template & Approval Slip",
    description: "Form to register thesis title, research scope, and obtain mandatory signatures from both VGU and Hamburg advisors.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Defense Evaluation Criteria Matrix",
    description: "Transparent grading rubric highlighting thesis presentation layout, engineering execution, and Q&A defense performance.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Formatting & Style Guidelines",
    description: "Latex and Word templates configured for standard MEC thesis drafts, referencing layout standards.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const GRADUATION_CARDS: PortalCard[] = [
  {
    title: "Degree Requirements Checklist",
    description: "Graduation planning spreadsheet to self-verify that your total accumulated credits meet VGU and HAW Hamburg standards.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "VGU Credit Transfer Request Form",
    description: "Official form to transfer academic credits earned during Hamburg exchange or other accredited summer modules.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Graduation Gown & Ceremony Protocols",
    description: "Details regarding the annual graduation ceremony, outfit sizing, gown rentals, guest invitations, and diploma dispatch.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const EXCHANGE_CARDS: PortalCard[] = [
  {
    title: "HAW Hamburg Semester Exchange Guide",
    description: "Essential information regarding visa applications, student accommodation in Hamburg, cost of living, and health insurance.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "Learning Agreement Template",
    description: "Pre-approved subject mapping list to guarantee academic equivalence and seamless credit transfer on return.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  },
  {
    title: "DAAD Exchange Scholarship Application",
    description: "How to apply for German Academic Exchange Service (DAAD) scholarships supporting long-term travel and living grants.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What are the attendance requirements for Mechatronics courses?",
    answer: "Students must maintain a minimum of 80% attendance in lectures and 100% attendance in all practical laboratory modules. Failure to satisfy this without a formal medical certificate submitted via the Absenteeism Form will result in barment from the final course examination."
  },
  {
    question: "How is the dual-degree program with HAW Hamburg structured?",
    answer: "Students complete their first 3 years of study at VGU. High-performing students can spend their 7th semester at HAW Hamburg in Germany for coursework and their Bachelor Thesis, with opportunities to apply for DAAD or institutional scholarships. Upon completion, you receive two degrees: a Bachelor of Science from HAW Hamburg and a Bachelor of Science from VGU."
  },
  {
    question: "Where can I find my exam grades and schedule?",
    answer: "Class and exam timetables are posted under the Schedule tab and official updates are dispatched to your institutional email. Graded exam transcripts and official records are permanently maintained on the VGU Student Information System (SIS)."
  },
  {
    question: "What happens if I fail a core mechatronics course exam?",
    answer: "If you fail a course, you are entitled to register for a retake exam during the scheduled makeup period. You must submit the Retake Exam Registration Form under the Forms tab. Retaking lab modules requires repeating the complete practical experiment series in the following academic year."
  },
  {
    question: "How long is the mandatory internship?",
    answer: "The Mechatronics program requires a Basic Internship of 8 weeks and a Professional Internship of 12 weeks. Detailed templates are located under the Internship tab."
  },
  {
    question: "How do I secure an academic advisor for my Bachelor Thesis?",
    answer: "You should review active faculty research interests on the Contact page, schedule an appointment, and submit your abstract alongside the Thesis Proposal Template (signed by the VGU and HAW advisors) before entering Year 4, Semester 2."
  }
];

export const STAFF_MEMBERS: StaffMember[] = [
  {
    name: "Assoc. Prof. Do Xuan Phu",
    role: "Academic Coordinator",
    office: "Building 5, Room 419",
    email: "phu.dx@vgu.edu.vn"
  },
  {
    name: "Ms. Tran Thi Yen",
    role: "Program Assistant",
    office: "Building 5, Room 511",
    email: "yen.tt@vgu.edu.vn"
  }
];
