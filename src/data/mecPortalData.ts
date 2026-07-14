/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortalCard {
  title: string;
  description: string;
  type: 'PDF' | 'LINK' | 'DRIVE' | 'FORM' | 'EXCEL' | 'DOCX';
  url: string;
  isTba?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StaffMember {
  name: string;
  role?: string;
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
    title: "Step-back/Retake Registration Form",
    description: "Formally withdraw from an enrolled course or cancel your exam registration under approved regulations.",
    type: "FORM",
    url: "https://forms.gle/BfFdnugcUd8paw7u9"
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
    url: "https://docs.google.com/spreadsheets/d/1sJelAiP0W4muYTBEJmJpsRB4XXnTOx7bKoESl0muhFU/edit?gid=218939538#gid=218939538"
  },
  {
    title: "WS2026 Semester Schedule",
    description: "Check lecture slots, lab rotations, and provisional exam schedules for the Winter Semester 2026.",
    type: "LINK",
    url: "https://docs.google.com/spreadsheets/d/1Dj9MiKupgDBFr8GGaJIKbt6GlPgVcQELVLam8EGl0cM/edit?gid=218939538#gid=218939538"
  }
];

export const CURRICULUM_CARDS: PortalCard[] = [
  {
    title: "HAW Hamburg Module Handbook",
    description: "The complete German accredited module handbook specifying credits, learning outcomes, and assessment styles.",
    type: "DRIVE",
    url: "https://drive.google.com/file/d/1rh3PepYMkBW5jeH974UE_YP1VKTuwyCB/view?usp=sharing"
  }
];

export const REGULATION_CARDS: PortalCard[] = [
  {
    title: "General Academic Regulations",
    description: "Core regulatory framework governing studies, grades, attendance, and student conduct at VGU.",
    type: "PDF",
    url: "https://drive.google.com/file/d/1ZnSs0yf3dfuOvu5Uvu-5Ph02n9uT3xjG/view?usp=sharing"
  },
  {
    title: "MEC Specific Examination Regulations",
    description: "Prerequisites, credit definitions, German-Vietnamese grading standards, and thesis defense guidelines.",
    type: "PDF",
    url: "https://drive.google.com/file/d/1Mk7j64VLJRwcZjAoLXu_Yu81wVQmHV5l/view?usp=sharing"
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
    url: "https://vgu.edu.vn/documents/48694/12962566/20260320_213_QD-DHVD_Ve+viec+ban+hanh+Quy+dinh+ve+hoc+bong+tai+nang+cac+chuong+trinh+dao+tao+trinh+do+DH-VIE.pdf/260ef17b-a749-48ca-80e1-bb89a8c429db"
  },
  {
    title: "DAAD Scholarships",
    description: "Financial grants and sponsorship pathways for high-performing students completing their exchange semester in Germany.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL,
    isTba: true
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
    url: DUMMY_DRIVE_URL,
    isTba: true
  },
  {
    title: "Learning Agreement Template",
    description: "Pre-approved subject mapping list to guarantee academic equivalence and seamless credit transfer on return.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL,
    isTba: true
  },
  {
    title: "DAAD Exchange Scholarship Application",
    description: "How to apply for German Academic Exchange Service (DAAD) scholarships supporting long-term travel and living grants.",
    type: "DRIVE",
    url: DUMMY_DRIVE_URL,
    isTba: true
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How many attempts do I have to pass an examination?",
    answer: "You are permitted two resits for each examination you do not pass at the first attempt, meaning you have a total of three attempts."
  },
  {
    question: "What happens if I fail a subject after all three attempts?",
    answer: "If you exhaust all resits without success, the examination is deemed \"conclusively unsuccessful\" (endgültig nicht bestanden), which typically disqualifies you from continuing the MEC program."
  },
  {
    question: "Is there a way to \"save\" a failed written exam attempt?",
    answer: "Yes, for written exams, you may apply for a final oral assessment to attempt to redeem the grade to a 4.0 (the lowest pass). Crucially, this oral assessment does not constitute a resit; its purpose is to save the current attempt. However, you can only use this option three times total during your entire degree and only once per module, therefore, use them wisely :)"
  },
  {
    question: "Is class attendance mandatory? What is the minimum attendance requirement?",
    answer: "Yes, attendance is mandatory for certain types of classes, such as seminars and lab practicals.\n\nIf no specific requirement is defined by the faculty, the default rule is that students must attend at least 80% of the total class hours to meet the attendance requirement and be eligible for the final exam."
  },
  {
    question: "Is registering for a module the same as registering for the exam?",
    answer: "Registering for a module means you will be added to the class’s student list and the tentative exam list.\n\n- If you want to take the final exam: No action is required (you are already registered by default).\n- If you want to skip the final in the current semester: You MUST select the \"Unregister\" option for that specific module in the Exam Registration form provided by the MEC program."
  },
  {
    question: "Can I un-register from an exam? What happens after the registration deadline?",
    answer: "Yes, you can un-register from an exam electronically before the registration deadline. The final exam list will be confirmed by the date announced by the MEC program (normally 7 days prior to the exam).\n\nOnce the exam list is finalized, your registration becomes legally binding. After this point, withdrawal is only possible under strict conditions:\n\n1. Valid reasons\nYou may withdraw only in cases of urgent and serious circumstances (e.g., illness). Withdrawal is not possible after the exam has already been taken.\n\n2. Submission requirements\nYou must inform the MEC Program without delay and provide supporting documents:\n- A clear written explanation of your reason for withdrawal\n- A medical certificate (if due to illness), including:\n  * Description of your health condition (physical or mental)\n  * Its impact on your ability to take the exam\n  * Date of medical examination\n  * Expected duration of the condition\n\n3. Outcome\n- If approved: You will be registered for the next available exam\n- If rejected: The exam will be graded as “unsuccessful” (5.0)\n\nYou will be notified in writing of the decision, including reasons and your right to appeal."
  },
  {
    question: "When am I eligible to register for my Bachelor’s thesis?",
    answer: "You are eligible to register for your Bachelor’s thesis once you have successfully completed 180 Credit Points (CP).\n\nWhile the thesis is officially scheduled to be completed in the seventh semester, you can initiate the registration process as soon as you meet that credit point threshold.\n\nKey details regarding the Bachelor's thesis include:\n- Registration Process: The topic is assigned at your request via the chair of the examination board.\n- Duration: You have three months to complete the thesis once it has been assigned.\n- Components: The module \"Bachelor's thesis with colloquium\" carries a total of 15 CP, divided into 12 CP for the written paper and 3 CP for the public presentation and colloquium.\n- Supervision: You may propose a supervisor (typically a professor who teaches the subject) and a specific topic for your thesis.\n- Format: It can be a theoretical, programming-related, design-related, or experimental final thesis."
  },
  {
    question: "What are the requirements to start my 5th semester?",
    answer: "To start the examinations and coursework for the fifth semester (which marks the beginning of the third year of study at HAW), you must meet two primary requirements:\n- Completion of the First Year: You must have successfully completed all examinations, preliminary examination requirements, and coursework for the first year of study (Semesters 1 and 2).\n- Preliminary Practical Training: You must provide proof that you have successfully completed the required 13 weeks of preliminary practical training (pre-practical training).\n\nExceptional Cases: If you have not yet fully completed the first-year requirements, you may still be allowed to take third-year examinations and coursework in justified exceptional cases. To do so, you must:\n- Submit a written request to the examination board.\n- Demonstrate that you have earned at least 50 Credit Points (CP) from the first year of study.\n- The examination board will make the final decision based on a recommendation from your subject advisor.\n\nProgression Context: The first year of study that must be completed includes Mathematics 1 & 2, Technical Mechanics A & B, Fundamentals of Electrical Engineering 1 & 2, Construction 1 & 2, and Programming Methods 1 & 2. Once you enter the fifth semester, you will begin taking integration subjects, the Bachelor's project, and start your chosen specialisation (Robotics, Drive Dynamics, or Mechatronics in Vehicle and Aircraft Construction)."
  },
  {
    question: "How long is the mandatory internship and when does it happen?",
    answer: "The main internship for Mechatronics students is scheduled for the 7th semester and lasts for 14 weeks. Additionally, a 13-week pre-practical training must be completed before starting the program."
  },
  {
    question: "What is the exact numerical grading scale used at HAW Hamburg?",
    answer: "The university uses a decimal scale where 0.7 to 4.0 are passing grades, and 4.3 to 5.0 are failing grades. Specifically, 1.0–1.3 is \"very good,\" 1.7–2.3 is \"good,\" 2.7–3.3 is \"satisfactory,\" and 3.7–4.0 is \"sufficient\"."
  },
  {
    question: "What happens if I miss a binding deadline for an assignment or fail to show up for a registered exam?",
    answer: "If you miss a binding deadline or are registered for an exam but do not attend without a valid reason, you will be awarded a grade of 5.0 (unsuccessful). This counts as one of your permitted attempts."
  },
  {
    question: "Can I take extra modules to improve my final grade?",
    answer: "You may take additional modules beyond the required number. While you can apply to have up to three of these listed on your certificate, their grades are not included in the calculation of your overall final grade."
  },
  {
    question: "Can a passed module be retaken?",
    answer: "As a general rule, examinations that have already been passed cannot be retaken. This means once you achieve a grade of 4.0 or better, that result is final and you cannot attempt the exam again to get a higher grade. However, there are two specific exceptions to this rule:\n\n- Bachelor or Master Thesis: If you submit your thesis within the standard course duration and receive a passing grade, you may apply to re-submit a new thesis once for the purpose of improving your grade. This application must be submitted to the Examinations Committee within two weeks of being notified of your original grade. In this case, the better of the two grades will be recorded.\n- Recognized Prior Learning: If you have prior learning (from another institution or course) recognized as \"sufficient\" (4.0) because the previous grading system was not comparable to HAW Hamburg’s, you have the right to apply to undergo an examination for the purpose of improving that specific grade.\n\nAside from these two cases, you are not permitted to repeat a module or examination once a passing grade has been awarded."
  },
  {
    question: "When will the resit date for an exam be announced?",
    answer: "MEC program is responsible for setting binding dates and may designate specific dates for resits. They must announce the timetable at least four weeks before the first exam of the semester."
  },
  {
    question: "Do I have to register for the resit exam?",
    answer: "Yes. All examination data is managed electronically, and students must register for resit examinations electronically. MEC program sets binding dates and timescales for the registration process of every examination session and may designate specific dates specifically for resits. Failure to register during the designated period will result in you not being on the exam list."
  },
  {
    question: "How many times is an examination for a specific module held per semester?",
    answer: "- Standard Frequency: Generally, there is one main examination date scheduled for each module per semester, as established by the Examinations Committee in the official examination timetable.\n- Resit Opportunities: The Examinations Committee has the authority to designate specific additional dates for resits within the same examination period if necessary."
  },
  {
    question: "If I failed a section in the Basic Internship, am I allowed to continue with remaining sections of the Basic Internship?",
    answer: "Yes, If you do not pass a section, you may still continue your studies in Semester 1 (Year 1), Semester 2 and Semester 3 (Year 2).\n\n- The Hard Deadline: The Basic Internship must be fully completed by the end of Semester 3.\n- Consequence: Students who fail to meet this deadline will not be allowed to progress to Semester 4 (Year 3) and must defer their studies until the requirement is met.\n\nFor example, if you do not pass the Design section, you can absolutely continue with Mechanical section, Electrical section, and also remaining modules in the Semester 1."
  },
  {
    question: "Basic Internship - Regulations",
    answer: "Please find below the essential regulations regarding your Basic Internship. We strongly recommend you read these carefully to ensure your study progression.\n\n1. Structure of the Basic Internship: The internship consists of three mandatory sections: Design, Mechanical, and Electrical.\n\n2. Completion Requirements:\n- To pass the Basic Internship, students must pass all three sections.\n- Once completed, your results will be officially submitted to HAW Hamburg as part of the program requirements.\n\n3. Study Progression & Deadlines:\n- Flexibility: If you do not pass a section, you may still continue your studies in Semester 1 (Year 1), Semester 2 and Semester 3 (Year 2).\n- The Hard Deadline: The Basic Internship must be fully completed by the end of Semester 3.\n- Consequence: Students who fail to meet this deadline will not be allowed to progress to Semester 4 (Year 3) and must defer their studies until the requirement is met.\n\n4. Re-enrollment Policy:\n- You only need to re-enroll in the specific section(s) failed.\n- Note: Each section is offered only once per year.\n\n5. Tuition Fee:\n- The total fee is 15,000,000 VND for all three sections.\n- No additional fees are charged for re-enrolling in failed sections.\n\n6. Registration for Re-enrollment:\n- Students must complete a registration form for any re-enrollment.\n- Announcements will be sent approximately one month before the internship begins.\n- It is your responsibility to monitor your email and register on time."
  },
  {
    question: "What should I do if I have failed multiple modules and want to focus on retaking them before continuing with new ones?",
    answer: "If you have accumulated several failed modules, you may consider deferring your studies for one academic year. During the deferral period, you can focus on clearing your backlog by:\n- Attending previous modules to strengthen your knowledge (if available), and/or\n- Self-studying in preparation for retake exams.\n\nPlease note that during the deferral period, you are not allowed to register for any new modules. You may only retake or complete modules that were previously failed."
  },
  {
    question: "Quick Checklist — Am I Eligible for Merit Scholarship?",
    answer: "Please check ALL items below:\n[ ] I passed all required modules in the list of modules for the semester under consideration.\n[ ] I did not fail or skip any exam/module.\n[ ] I passed all modules on the first attempt.\n[ ] My GPA is at least 2.30 (German scale) / 7.70 (Vietnamese scale).\n[ ] I submitted IELTS 6.0 (or equivalent) on time.\n[ ] I have no disciplinary violations.\n[ ] I completed tuition fee payment and other financial obligations.\n\nIf any item above is not fulfilled, you may become ineligible for scholarship consideration for that semester/year."
  },
  {
    question: "How many categories of scholarship?",
    answer: "- Top 5%: Category A – 100% tuition scholarship\n- Next 5%: Category B – 50% tuition scholarship\n- Next 5%: Category C – 25% tuition scholarship\n\nThe number of scholarships for Categories A, B, and C shall correspond to the top 5%, the next 5%, and the following 5%, respectively, of the total number of current students in each study program, excluding deferred students, rounded to the nearest whole number."
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
    office: "Building 5, Room 511",
    email: "yen.tt@vgu.edu.vn"
  }
];
