export interface DepartmentData {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  leadPhysician: string;
  leadTitle: string;
  location: string;
  beds: number;
  annualProcedures: string;
  emergencySupport: boolean;
  iconName: string;
  conditionsTreated: string[];
  proceduresOffered: string[];
  technologies: string[];
}

export interface DoctorData {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availableDays: string[];
  availableSlots: string[];
  avatarUrl: string;
  npiNumber: string;
  education: string[];
  certifications: string[];
  bio: string;
  phone: string;
  email: string;
}

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorTitle: string;
  authorDoctorId: string;
  date: string;
  readTime: string;
  imageUrl: string;
  reviewedBy: string;
  content: string[];
  tags: string[];
}

export const DEPARTMENTS: DepartmentData[] = [
  {
    id: 'dept_card',
    name: 'Cardiology & Heart Center',
    shortDesc: 'Comprehensive cardiovascular care, interventional cardiology, electrophysiology, and advanced cardiac rehabilitation.',
    fullDesc: 'The ProHealth Heart & Vascular Institute is a nationally recognized center of excellence providing end-to-end cardiovascular care. Our multidisciplinary team of cardiologists, cardiothoracic surgeons, and vascular specialists treat the most complex structural heart conditions with minimally invasive techniques.',
    leadPhysician: 'Dr. Sarah Patel, MD, FACC',
    leadTitle: 'Director of Interventional Cardiology',
    location: 'Pavilion A, Floors 3–4',
    beds: 72,
    annualProcedures: '3,800+',
    emergencySupport: true,
    iconName: 'HeartPulse',
    conditionsTreated: [
      'Coronary Artery Disease & Acute Myocardial Infarction',
      'Atrial Fibrillation & Complex Arrhythmias',
      'Congestive Heart Failure (Systolic & Diastolic)',
      'Aortic & Mitral Valvular Disease',
      'Hypertensive Heart Disease & Cardiomyopathy'
    ],
    proceduresOffered: [
      'Transcatheter Aortic Valve Replacement (TAVR)',
      'Percutaneous Coronary Intervention (PCI / Stenting)',
      'Cardiac Resynchronization Therapy & Pacemaker Implantation',
      '3D Mapping Catheter Ablation for Arrhythmias',
      'Cardiopulmonary Stress Testing & Echocardiography'
    ],
    technologies: [
      'Siemens Artis icono Biplane Angiography Suite',
      'Philips EPIQ CVxi 4D Echocardiography',
      'Biosense Webster CARTO 3 Electrophysiology Mapping'
    ]
  },
  {
    id: 'dept_neuro',
    name: 'Neurology & Brain Sciences',
    shortDesc: 'Cutting-edge neurodiagnostics, Comprehensive Stroke Center, neurosurgical robotics, and cognitive disorder clinics.',
    fullDesc: 'ProHealth Brain Sciences combines world-class neurology, neurocritical care, and neurosurgery. Designated as a Comprehensive Stroke Center, our rapid-response stroke team achieves door-to-needle thrombolysis times well below national standards.',
    leadPhysician: 'Dr. Elena Rostova, MD, PhD',
    leadTitle: 'Chief of Clinical Neurology & Stroke Director',
    location: 'Tower East, Floors 5–6',
    beds: 56,
    annualProcedures: '2,400+',
    emergencySupport: true,
    iconName: 'Brain',
    conditionsTreated: [
      'Acute Ischemic & Hemorrhagic Stroke',
      'Epilepsy & Refractory Seizure Disorders',
      'Parkinson’s Disease & Movement Disorders',
      'Multiple Sclerosis & Neuroimmunology',
      'Intracranial Aneurysms & Brain Tumors'
    ],
    proceduresOffered: [
      'Mechanical Thrombectomy for Large Vessel Occlusion',
      'Deep Brain Stimulation (DBS) for Movement Disorders',
      'Frameless Stereotactic Cranial Navigation',
      'Continuous 256-Channel Video-EEG Telemetry',
      'Botulinum Toxin Injections for Spasticity & Migraine'
    ],
    technologies: [
      'Siemens Magnetom Vida 3T BioMatrix MRI',
      'Medtronic StealthStation S8 Surgical Navigation',
      'Canon Aquilion ONE GENESIS 640-Slice CT'
    ]
  },
  {
    id: 'dept_peds',
    name: 'Pediatrics & Neonatal ICU (NICU)',
    shortDesc: 'Level IV Neonatal Intensive Care, pediatric subspecialty clinics, child development, and family-centered pediatric emergency care.',
    fullDesc: 'The ProHealth Children’s Center delivers compassionate, pediatric-tailored care from premature birth through adolescence. Our Level IV NICU is equipped with advanced extracorporeal life support (ECLS) and dedicated pediatric surgical suites.',
    leadPhysician: 'Dr. Marcus Chen, MD, FAAP',
    leadTitle: 'Chairman of Pediatric Medicine & Neonatology',
    location: 'Children’s Pavilion, Floors 1–3',
    beds: 64,
    annualProcedures: '1,950+',
    emergencySupport: true,
    iconName: 'Baby',
    conditionsTreated: [
      'Extreme Prematurity & Neonatal Respiratory Distress',
      'Congenital Heart Anomalies in Children',
      'Pediatric Asthma, Allergies & Immunology',
      'Pediatric Neurological & Developmental Disorders',
      'Acute Pediatric Infections & Critical Care'
    ],
    proceduresOffered: [
      'Neonatal ECMO (Extracorporeal Membrane Oxygenation)',
      'High-Frequency Oscillatory Ventilation',
      'Pediatric Minimally Invasive Laparoscopy',
      'Comprehensive Developmental & Autism Assessments',
      'Pediatric Sedation & Imaging Suite'
    ],
    technologies: [
      'GE Giraffe OmniBed Carestation Incubators',
      'Dräger Babylog VN500 Dedicated Neonatal Ventilators',
      'Sensory-Integrated Child Life Assessment Playrooms'
    ]
  },
  {
    id: 'dept_ortho',
    name: 'Orthopedics & Robotic Surgery',
    shortDesc: 'Mako robotic joint replacements, sports medicine, complex spine reconstructive surgery, and musculoskeletal rehabilitation.',
    fullDesc: 'Our Center for Joint Reconstruction and Musculoskeletal Health offers pioneering surgical precision through robotic-arm assisted arthroplasty. Patients benefit from rapid recovery clinical pathways that reduce inpatient length of stay by 40%.',
    leadPhysician: 'Dr. James Wilson, MD, FAAOS',
    leadTitle: 'Head of Orthopedic Surgery & Arthroplasty',
    location: 'Pavilion B, Floors 2–3',
    beds: 48,
    annualProcedures: '3,200+',
    emergencySupport: false,
    iconName: 'Bone',
    conditionsTreated: [
      'Severe Osteoarthritis of Hip, Knee, and Shoulder',
      'Sports Ligament Tears (ACL, MCL, Meniscus)',
      'Degenerative Disc Disease & Spinal Stenosis',
      'Complex Musculoskeletal Trauma & Fractures',
      'Rotator Cuff Tears & Shoulder Instability'
    ],
    proceduresOffered: [
      'Mako SmartRobotics Total & Partial Knee Arthroplasty',
      'Anterior Approach Muscle-Sparing Total Hip Arthroplasty',
      'Minimally Invasive Spine Decompression & Fusion',
      'Outpatient Arthroscopic Shoulder & Knee Reconstruction',
      'Custom 3D-Printed Titanium Orthopedic Implants'
    ],
    technologies: [
      'Stryker Mako Robotic-Arm Surgical System',
      'O-Arm Intraoperative 3D Imaging Navigation',
      'AlterG Anti-Gravity Physical Therapy Treadmills'
    ]
  },
  {
    id: 'dept_emrg',
    name: 'Emergency & Level 1 Trauma',
    shortDesc: '24/7 dedicated emergency trauma bays, rooftop helipad, rapid triage system, and integrated disaster response.',
    fullDesc: 'Verified by the American College of Surgeons as a Level 1 Trauma Center, ProHealth Emergency Department delivers immediate surgical, medical, and resuscitation interventions 24 hours a day, 365 days a year.',
    leadPhysician: 'Dr. Arthur Vance, MD, FACEP',
    leadTitle: 'Medical Director of Trauma & Emergency Services',
    location: 'Ground Floor, Dedicated Ambulance Bay Entrance',
    beds: 80,
    annualProcedures: '45,000+ Visits',
    emergencySupport: true,
    iconName: 'Ambulance',
    conditionsTreated: [
      'Major Polytrauma & Blunt/Penetrating Injuries',
      'Acute Cardiac Arrest & Shock',
      'Severe Respiratory Failure & Airway Emergencies',
      'Acute Stroke & Intracranial Hemorrhage',
      'Toxicological Ingestions & Poison Control'
    ],
    proceduresOffered: [
      'Emergency Damage Control Resuscitative Laparotomy',
      'Rapid Sequence Intubation & Difficult Airway Algorithm',
      'Chest Tube Thoracostomy & Resuscitative Thoracotomy',
      'Point-of-Care Emergency Ultrasound (POCUS / eFAST)',
      'Immediate 24/7 Transfusion with Massive Transfusion Protocol'
    ],
    technologies: [
      'Integrated Dual-Source Rapid Trauma CT Suite in Bay',
      'Zoll AutoPulse Mechanical CPR Chest Compression Units',
      'Level 1 FastFlow Rapid Blood & Fluid Warmers'
    ]
  },
  {
    id: 'dept_obgyn',
    name: 'Gynecology & Maternal Health',
    shortDesc: 'Comprehensive obstetrical care, high-risk maternal-fetal medicine, private labor & delivery suites, and gynecological oncology.',
    fullDesc: 'ProHealth Women’s Health Center provides whole-life care, encompassing adolescent health, family planning, high-risk maternal-fetal medicine, and robotic gynecologic surgery in modern, family-friendly private birthing suites.',
    leadPhysician: 'Dr. Maya Lin, MD, FACOG',
    leadTitle: 'Director of Maternal-Fetal Medicine',
    location: 'Tower West, Floors 4–5',
    beds: 50,
    annualProcedures: '2,600+ Deliveries',
    emergencySupport: true,
    iconName: 'Sparkles',
    conditionsTreated: [
      'High-Risk Pregnancy (Preeclampsia, Gestational Diabetes)',
      'Uterine Fibroids & Endometriosis',
      'Pelvic Organ Prolapse & Urogynecology',
      'Cervical Dysplasia & Gynecologic Oncology',
      'Menopausal Symptoms & Hormone Therapy'
    ],
    proceduresOffered: [
      'Family-Centered Gentle Cesarean Delivery',
      'da Vinci Robotic-Assisted Hysterectomy & Myomectomy',
      'Fetal Echocardiography & Genetic Amniocentesis',
      'Minimally Invasive Hysteroscopic Polypectomy',
      'Pelvic Floor Biofeedback & Reconstructive Surgery'
    ],
    technologies: [
      'Intuitive da Vinci Xi Surgical System',
      'GE Voluson E10 High-Definition 4D Obstetrical Ultrasound',
      'Wireless telemetry fetal heart rate monitoring monitors'
    ]
  }
];

export const DOCTORS: DoctorData[] = [
  {
    id: 'doc_sarah',
    name: 'Dr. Sarah Patel',
    title: 'Dr. Sarah Patel, MD, FACC',
    departmentId: 'dept_card',
    departmentName: 'Cardiology & Heart Center',
    specialty: 'Interventional Cardiology',
    qualification: 'MD (Harvard), FACC, FSCAI',
    experienceYears: 16,
    rating: 4.95,
    reviewCount: 384,
    consultationFee: 220,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    npiNumber: '1942098412',
    education: [
      'Doctor of Medicine (MD) — Harvard Medical School',
      'Internal Medicine Residency — Massachusetts General Hospital',
      'Cardiovascular Disease Fellowship — Johns Hopkins Hospital',
      'Interventional Cardiology Fellowship — Cleveland Clinic'
    ],
    certifications: [
      'American Board of Internal Medicine — Cardiovascular Disease',
      'American Board of Internal Medicine — Interventional Cardiology',
      'Fellow of the American College of Cardiology (FACC)'
    ],
    bio: 'Dr. Sarah Patel is an acclaimed interventional cardiologist specializing in complex coronary interventions, transcatheter valve therapies (TAVR), and peripheral vascular interventions. She has published over 40 peer-reviewed articles in the Journal of the American College of Cardiology and Circulation.',
    phone: '+1 (555) 019-2840',
    email: 'sarah.patel@prohealth.hospital'
  },
  {
    id: 'doc_elena',
    name: 'Dr. Elena Rostova',
    title: 'Dr. Elena Rostova, MD, PhD',
    departmentId: 'dept_neuro',
    departmentName: 'Neurology & Brain Sciences',
    specialty: 'Clinical Neurology & Stroke',
    qualification: 'MD (Johns Hopkins), PhD (Neurobiology)',
    experienceYears: 19,
    rating: 4.98,
    reviewCount: 412,
    consultationFee: 240,
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813571-638f02638520?auto=format&fit=crop&q=80&w=600',
    npiNumber: '1839201948',
    education: [
      'MD / PhD Combined Medical Scientist Training — Johns Hopkins University',
      'Neurology Residency — Columbia University Irving Medical Center',
      'Vascular Neurology (Stroke) Fellowship — Stanford Medicine'
    ],
    certifications: [
      'American Board of Psychiatry and Neurology — Neurology',
      'American Board of Psychiatry and Neurology — Vascular Neurology',
      'United Council for Neurologic Subspecialties — Neurocritical Care'
    ],
    bio: 'Dr. Elena Rostova directs the Comprehensive Stroke Center at ProHealth. She is an international authority on reperfusion therapies for acute ischemic stroke and neuroplastic recovery, frequently serving as an expert panelist for the American Heart Association / American Stroke Association.',
    phone: '+1 (555) 019-2842',
    email: 'elena.rostova@prohealth.hospital'
  },
  {
    id: 'doc_marcus',
    name: 'Dr. Marcus Chen',
    title: 'Dr. Marcus Chen, MD, FAAP',
    departmentId: 'dept_peds',
    departmentName: 'Pediatrics & Neonatal ICU (NICU)',
    specialty: 'Neonatology & Pediatric Critical Care',
    qualification: 'MD (Stanford), FAAP',
    experienceYears: 14,
    rating: 4.92,
    reviewCount: 298,
    consultationFee: 180,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    availableSlots: ['08:30 AM', '10:00 AM', '01:30 PM', '03:00 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    npiNumber: '1728394012',
    education: [
      'Doctor of Medicine (MD) — Stanford University School of Medicine',
      'Pediatric Residency — Boston Children’s Hospital',
      'Neonatal-Perinatal Medicine Fellowship — Children’s Hospital of Philadelphia'
    ],
    certifications: [
      'American Board of Pediatrics — General Pediatrics',
      'American Board of Pediatrics — Neonatal-Perinatal Medicine',
      'Pediatric Advanced Life Support (PALS) National Instructor'
    ],
    bio: 'Dr. Marcus Chen leads the Level IV NICU at ProHealth. With over a decade of dedication to extremely low birthweight infants and neonatal ventilation innovation, Dr. Chen emphasizes holistic family integration during critical neonatal recovery.',
    phone: '+1 (555) 019-2844',
    email: 'marcus.chen@prohealth.hospital'
  },
  {
    id: 'doc_james',
    name: 'Dr. James Wilson',
    title: 'Dr. James Wilson, MD, FAAOS',
    departmentId: 'dept_ortho',
    departmentName: 'Orthopedics & Robotic Surgery',
    specialty: 'Robotic Joint Arthroplasty',
    qualification: 'MD (Duke), FAAOS',
    experienceYears: 22,
    rating: 4.96,
    reviewCount: 512,
    consultationFee: 250,
    availableDays: ['Monday', 'Wednesday', 'Thursday'],
    availableSlots: ['09:00 AM', '11:15 AM', '02:00 PM', '04:15 PM'],
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
    npiNumber: '1902834710',
    education: [
      'Doctor of Medicine (MD) — Duke University School of Medicine',
      'Orthopedic Surgery Residency — Hospital for Special Surgery (HSS)',
      'Adult Reconstruction & Joint Replacement Fellowship — Mayo Clinic'
    ],
    certifications: [
      'American Board of Orthopaedic Surgery (ABOS)',
      'Fellow of the American Academy of Orthopaedic Surgeons (FAAOS)',
      'Mako Robotic Certified Specialist Instructor'
    ],
    bio: 'Dr. James Wilson is a pioneer in computer-navigated and robotic-arm assisted hip and knee replacements. Having performed more than 4,000 joint reconstructions, he works closely with biomedical engineers to design personalized implant solutions for active seniors and athletes.',
    phone: '+1 (555) 019-2846',
    email: 'james.wilson@prohealth.hospital'
  }
];

export const BLOG_POSTS: BlogPostData[] = [
  {
    slug: 'understanding-cardiac-risk-factors-early-prevention',
    title: 'Understanding Cardiac Risk Factors: A Blueprint for Early Cardiovascular Prevention',
    excerpt: 'Coronary heart disease remains the leading cause of mortality worldwide. Learn the primary modifiable biomarkers and clinical screening protocols that save lives.',
    category: 'Cardiovascular Health',
    authorName: 'Dr. Sarah Patel, MD, FACC',
    authorTitle: 'Director of Interventional Cardiology',
    authorDoctorId: 'doc_sarah',
    date: 'September 8, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    reviewedBy: 'ProHealth Clinical Quality & Ethics Board',
    content: [
      'Cardiovascular disease (CVD) continues to represent the single greatest clinical threat to adult health. While age and genetic predispositions cannot be altered, over 80% of premature coronary events are clinically preventable through aggressive mitigation of modifiable biomarkers.',
      'Primary among these markers is Apolipoprotein B (ApoB) and low-density lipoprotein cholesterol (LDL-C). When excessive atherogenic particles circulate within vascular endothelium, inflammatory cascades trigger atherosclerotic plaque deposition, culminating in vascular stenosis.',
      'Current ACC/AHA guidelines strongly recommend obtaining a Coronary Artery Calcium (CAC) scan for asymptomatic individuals between ages 40 and 70 with borderline risk. A zero calcium score offers powerful reassurance, whereas elevated scores indicate an immediate need for statin therapy and targeted antihypertensive protocols.',
      'Lifestyle interventions must not be underestimated: adopting a Mediterranean-style whole food dietary framework, engaging in 150 minutes of zone-2 aerobic activity per week, and maintaining strict blood pressure targets below 120/80 mmHg collectively reduce 10-year major adverse cardiac events (MACE) by more than 50%.'
    ],
    tags: ['Cardiology', 'Atherosclerosis', 'Hypertension', 'Preventive Medicine']
  },
  {
    slug: 'rapid-stroke-recognition-the-be-fast-protocol',
    title: 'Time is Brain: The BE-FAST Protocol and Acute Stroke Interventions',
    excerpt: 'In acute ischemic stroke, approximately 1.9 million neurons perish every minute without blood flow. Here is how modern thrombectomy is transforming neurologic survival.',
    category: 'Neurology & Stroke',
    authorName: 'Dr. Elena Rostova, MD, PhD',
    authorTitle: 'Chief of Clinical Neurology',
    authorDoctorId: 'doc_elena',
    date: 'August 24, 2026',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    reviewedBy: 'Comprehensive Stroke Quality Committee',
    content: [
      'When a cerebral artery suffers occlusion from a thromboembolus, the surrounding ischemic penumbra remains viable for only a brief window. In neurologic emergency medicine, the aphorism "Time is Brain" underscores the reality that 1.9 million neurons and 14 billion synapses degrade with each passing sixty seconds.',
      'The modern BE-FAST paradigm serves as the gold standard for clinical recognition: Balance difficulties, Eyesight changes, Facial asymmetry, Arm weakness, Speech slurring, and Time to dial emergency services immediately (Ambulance: 876-256-876).',
      'At ProHealth Comprehensive Stroke Center, our rapid neurovascular protocol combines immediate non-contrast CT with CT Perfusion angiography within 12 minutes of door arrival. For large vessel occlusions (LVO), endovascular mechanical thrombectomy performed in our biplane catheterization lab restores cerebral perfusion in over 90% of eligible candidates.',
      'Survivors benefit from our multidisciplinary neurocritical unit, where early mobilization, speech pathology, and targeted neuroprotective regimens initiate immediately on post-procedure day one.'
    ],
    tags: ['Stroke', 'Neurology', 'Emergency', 'Mechanical Thrombectomy']
  },
  {
    slug: 'robotic-joint-replacement-advances-in-arthroplasty',
    title: 'The Era of Sub-Millimeter Precision: How Robotic Arthroplasty Restores Active Living',
    excerpt: 'Robotic-arm assisted knee and hip reconstruction allows orthopedic surgeons to match prosthetic implants to each patient’s unique skeletal anatomy within 0.5mm.',
    category: 'Orthopedic Surgery',
    authorName: 'Dr. James Wilson, MD, FAAOS',
    authorTitle: 'Head of Orthopedic Surgery',
    authorDoctorId: 'doc_james',
    date: 'August 12, 2026',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    reviewedBy: 'ProHealth Surgical Review Panel',
    content: [
      'End-stage osteoarthritis often strips individuals of mobility, independence, and comfort. Traditional joint replacement relies heavily on mechanical cutting jigs and visual alignment estimates, which can carry an outlier rate of up to 15-20% in complex anatomical variations.',
      'The advent of Mako SmartRobotics transforms arthroplasty by generating a 3D computerized bone model derived from preoperative CT scans. During surgery, real-time optical tracking monitors joint kinematics through full range-of-motion, allowing the surgeon to balance ligamentous tension dynamically before making any bone cuts.',
      'The robotic arm enforces haptic boundaries, strictly preventing surgical instruments from exceeding planned resection margins, thereby protecting delicate periarticular neurovascular structures and collateral ligaments.',
      'Patients undergoing robotic-arm assisted arthroplasty demonstrate significantly reduced postoperative pain scores, lower opioid requirements, and an average hospital discharge within 24 hours.'
    ],
    tags: ['Orthopedics', 'Robotics', 'Joint Replacement', 'Arthroplasty']
  },
  {
    slug: 'childhood-immunizations-safeguarding-community-health',
    title: 'Childhood Immunizations: The Scientific Foundation of Pediatric Immunity',
    excerpt: 'An evidence-based guide by our pediatric department explaining how vaccine schedules stimulate protective antibodies and prevent resurgent infectious pathogens.',
    category: 'Pediatrics',
    authorName: 'Dr. Marcus Chen, MD, FAAP',
    authorTitle: 'Chairman of Pediatric Medicine',
    authorDoctorId: 'doc_marcus',
    date: 'July 30, 2026',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    reviewedBy: 'Pediatric Infectious Disease Taskforce',
    content: [
      'Vaccination represents one of the most transformative public health accomplishments in medical history. Vaccines introduce non-pathogenic antigens that prime the adaptive immune system, facilitating the development of high-affinity memory B cells and T cells without the perilous complications of active infection.',
      'The recommended Centers for Disease Control and Prevention (CDC) and American Academy of Pediatrics (AAP) immunization schedule is formulated to shield infants during their window of greatest immunological vulnerability, specifically targeting Streptococcus pneumoniae, Haemophilus influenzae type b, and Bordetella pertussis.',
      'Decades of global clinical trials encompassing millions of pediatric subjects repeatedly affirm the superlative safety profile and protective efficacy of standardized immunization protocols.',
      'Our pediatric team partners closely with families to address questions with transparency, offering dedicated sensory-friendly vaccination appointments for children with special healthcare needs.'
    ],
    tags: ['Pediatrics', 'Vaccines', 'Immunology', 'Child Health']
  }
];
