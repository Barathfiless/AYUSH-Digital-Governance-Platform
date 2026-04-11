import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ─── KEY TRANSLATIONS ──────────────────────────────────────────────────────────
// Keys: nav.home, nav.about, nav.register, nav.track, nav.contact, nav.login, nav.signup,
//       hero.title, hero.subtitle, hero.description, hero.cta.register, hero.cta.track,
//       features.title, features.subtitle, categories.title,
//       testimonials.title, testimonials.subtitle,
//       footer.copyright, dashboard.welcome, wizard.next, wizard.prev, wizard.submit

const resources = {
  // ── ENGLISH ────────────────────────────────────────────────────────────────
  en: {
    translation: {
      "nav.home": "Home", "nav.about": "About AYUSH Portal", "nav.register": "Apply for License",
      "nav.track": "Track Application", "nav.resources": "Drug Database", "nav.contact": "Contact",
      "nav.login": "Login", "nav.signup": "Sign Up",
      "hero.title": "AYUSH Portal", "hero.subtitle": "ASU & H Drug Licensing System",
      "hero.description": "Integrated platform for Online Licensing, Drug Warehouse Management, and Inventory Monitoring for Ayurveda, Siddha, Unani, and Homoeopathy.",
      "hero.cta.register": "Apply for License", "hero.cta.track": "Track Application Status",
      "features.title": "Benefits of AYUSH Portal", "features.subtitle": "Ensuring transparency, accountability, and quality in AYUSH drug regulation",
      "features.ai.title": "Online Licensing", "features.ai.desc": "Application for Form 25-D, 24-D and other manufacturing licenses with automated workflow.",
      "features.blockchain.title": "Drug Warehouse", "features.blockchain.desc": "Real-time monitoring of drug stock, expiry tracking, and automated indent generation.",
      "features.tracking.title": "SMS/Email Alerts", "features.tracking.desc": "Instant notifications for application status and upcoming item expiries.",
      "features.multilingual.title": "Regional Support", "features.multilingual.desc": "Interface available in 23 Indian regional languages.",
      "features.compliance.title": "Quality Monitoring", "features.compliance.desc": "Tracking of drug testing reports and detection of spurious or substandard drugs.",
      "features.investor.title": "Manufacturer Directory", "features.investor.desc": "Publicly accessible database of all licensed ASU & H drug manufacturers.",
      "categories.title": "AYUSH Categories",
      "categories.subtitle": "Register your startup under any of the five traditional AYUSH medicine systems",
      "categories.explore": "Explore More",
      "categories.ayurveda": "Ayurveda",
      "categories.ayurveda.desc": "Traditional Indian medicine system focusing on balance of body, mind, and spirit through natural remedies.",
      "categories.yoga": "Yoga & Naturopathy",
      "categories.yoga.desc": "Holistic wellness through yoga asanas, pranayama, and natural healing therapies.",
      "categories.unani": "Unani",
      "categories.unani.desc": "Greco-Arabic medicine emphasising natural elements and herbal formulations.",
      "categories.siddha": "Siddha",
      "categories.siddha.desc": "Ancient Tamil medicine using herbs, metals, and minerals for holistic healing.",
      "categories.homeopathy": "Homeopathy",
      "categories.homeopathy.desc": "Treating ailments with highly diluted substances that trigger natural healing.",
      "testimonials.title": "Success Stories", "testimonials.subtitle": "Hear from startups who transformed their registration experience",
      "cta.title": "Apply for Manufacturing License Today",
      "cta.subtitle": "Join thousands of licensed manufacturers ensuring quality AYUSH medicines",
      "cta.button": "Start New License Application",
      "cta.benefit1": "Fixed timelines for license processing",
      "cta.benefit2": "Real-time drug warehouse monitoring",
      "cta.benefit3": "Automated indent and stock alerts",
      "cta.benefit4": "Integrated with Quality Testing Labs",
      "footer.copyright": "© 2024 AYUSH Portal. Ministry of AYUSH, Government of India.",
      "dashboard.welcome": "Welcome back", "dashboard.applications": "Your Applications",
      "dashboard.welcomeTitle": "Welcome to",
      "dashboard.portalName": "AYUSH Portal",
      "dashboard.sessionActive": "Session Active",
      "dashboard.activeLicenses": "Active Licenses",
      "dashboard.productApprovals": "Product Approvals",
      "dashboard.pendingReview": "Pending Review",
      "dashboard.rejected": "Rejected",
      "dashboard.quickDigital": "Digital Bazaar",
      "dashboard.quickPurchases": "My Purchases",
      "dashboard.quickLicense": "New License",
      "dashboard.quickTrack": "Track Items",
      "sidebar.dashboard": "Dashboard",
      "sidebar.newLicense": "New License",
      "sidebar.trackApp": "Track Application",
      "sidebar.warehouse": "Warehouse",
      "sidebar.certifications": "Certifications",
      "sidebar.approval": "Approval",
      "sidebar.approved": "Approved",
      "sidebar.rejected": "Rejected",
      "sidebar.officerPanel": "Officer Panel",
      "sidebar.reviewApplications": "Review Applications",
      "sidebar.inspections": "Inspections",
      "sidebar.inventoryOversight": "Inventory Oversight",
      "sidebar.digitalCerts": "Digital Certificates",
      "sidebar.queries": "Queries",
      "sidebar.home": "Home",
      "sidebar.store": "AYUSH Store",
      "sidebar.cart": "Cart",
      "sidebar.myOrders": "My Orders",
      "sidebar.adminPortal": "Admin Portal",
      "sidebar.manageUsers": "Manage Users",
      "sidebar.allApplications": "All Applications",
      "sidebar.systemSecurity": "System Security",
      "sidebar.systemLogs": "System Logs",
      "sidebar.logout": "Log out",
      "sidebar.loans": "Loans",
      "sidebar.manageSchemes": "Manage Schemes",
      "sidebar.loanRequests": "Loan Requests",
      "header.notifications": "Notifications",
      "header.markAllRead": "Mark All as Read",
      "header.noNotifications": "No system notifications yet",
      "header.myAccount": "My Account",
      "header.logout": "Log out",
      "wizard.next": "Continue", "wizard.prev": "Back", "wizard.submit": "Submit Application",
      "stats.registered": "Licensed Manufacturers", "stats.processing": "Avg. Approval Days",
      "stats.approval": "Compliance Rate", "stats.states": "States Integrated",
    }
  },

  // ── HINDI ──────────────────────────────────────────────────────────────────
  hi: {
    translation: {
      "nav.home": "होम", "nav.about": "आयुष के बारे में", "nav.register": "लाइसेंस के लिए आवेदन करें",
      "nav.track": "आवेदन ट्रैक करें", "nav.resources": "दवा डेटाबेस", "nav.contact": "संपर्क",
      "nav.login": "लॉगिन", "nav.signup": "साइन अप",
      "hero.title": "आयुष पोर्टल", "hero.subtitle": "एएसयू और एच दवा लाइसेंसिंग प्रणाली",
      "hero.description": "आयुर्वेद, सिद्ध, यूनानी और होम्योपैथी दवाओं के लिए ऑनलाइन लाइसेंसिंग, दवा गोदाम प्रबंधन और इन्वेंट्री निगरानी हेतु एकीकृत मंच।",
      "hero.cta.register": "लाइसेंस के लिए आवेदन करें", "hero.cta.track": "आवेदन स्थिति ट्रैक करें",
      "features.title": "आयुष पोर्टल के लाभ", "features.subtitle": "आयुष दवा विनियमन में पारदर्शिता, जवाबदेही और गुणवत्ता सुनिश्चित करना",
      "categories.title": "आयुष श्रेणियाँ",
      "categories.subtitle": "पाँच पारंपरिक आयुष चिकित्सा प्रणालियों में से किसी के तहत अपना स्टार्टअप पंजीकृत करें",
      "categories.explore": "और जानें",
      "categories.ayurveda": "आयुर्वेद",
      "categories.ayurveda.desc": "शरीर, मन और आत्मा के संतुलन पर ध्यान केंद्रित करने वाली पारंपरिक भारतीय चिकित्सा प्रणाली।",
      "categories.yoga": "योग और प्राकृतिक चिकित्सा",
      "categories.yoga.desc": "योगासन, प्राणायाम और प्राकृतिक उपचार चिकित्साओं के माध्यम से समग्र स्वास्थ्य।",
      "categories.unani": "यूनानी",
      "categories.unani.desc": "प्राकृतिक तत्वों और हर्बल फॉर्मूलेशन पर जोर देने वाली ग्रेको-अरबी चिकित्सा।",
      "categories.siddha": "सिद्ध",
      "categories.siddha.desc": "समग्र उपचार के लिए जड़ी-बूटियों, धातुओं और खनिजों का उपयोग करने वाली प्राचीन तमिल चिकित्सा।",
      "categories.homeopathy": "होम्योपैथी",
      "categories.homeopathy.desc": "अत्यधिक पतला पदार्थों से बीमारियों का उपचार जो प्राकृतिक उपचार को ट्रिगर करता है।",
      "testimonials.title": "सफलता की कहानियाँ", "testimonials.subtitle": "उन स्टार्टअप से सुनें जिन्होंने पंजीकरण अनुभव को बदल दिया",
      "cta.title": "आज ही विनिर्माण लाइसेंस के लिए आवेदन करें",
      "cta.subtitle": "गुणवत्तापूर्ण आयुष दवाइयाँ सुनिश्चित करने वाले हजारों लाइसेंसधारी निर्माताओं से जुड़ें",
      "cta.button": "नया लाइसेंस आवेदन शुरू करें",
      "cta.benefit1": "लाइसेंस प्रसंस्करण के लिए निश्चित समय-सीमा",
      "cta.benefit2": "दवा गोदाम की रीयल-टाइम निगरानी",
      "cta.benefit3": "स्वचालित इंडेंट और स्टॉक अलर्ट",
      "cta.benefit4": "गुणवत्ता परीक्षण प्रयोगशालाओं के साथ एकीकृत",
      "footer.copyright": "© 2024 आयुष पोर्टल। आयुष मंत्रालय, भारत सरकार।",
      "dashboard.welcome": "वापस स्वागत है", "wizard.next": "जारी रखें", "wizard.prev": "वापस", "wizard.submit": "आवेदन जमा करें",
      "stats.registered": "लाइसेंस प्राप्त निर्माता", "stats.processing": "औसत अनुमोदन दिन",
      "dashboard.welcomeTitle": "स्वागत है",
      "dashboard.portalName": "आयुष पोर्टल",
      "dashboard.sessionActive": "सत्र सक्रिय",
      "dashboard.activeLicenses": "सक्रिय लाइसेंस",
      "dashboard.productApprovals": "उत्पाद अनुमोदन",
      "dashboard.pendingReview": "समीक्षा प्रतीक्षित",
      "dashboard.rejected": "अस्वीकृत",
      "dashboard.quickDigital": "डिजिटल बाज़ार",
      "dashboard.quickPurchases": "मेरी खरीदारी",
      "dashboard.quickLicense": "नया लाइसेंस",
      "dashboard.quickTrack": "ट्रैक करें",
      "sidebar.dashboard": "डैशबोर्ड",
      "sidebar.newLicense": "नया लाइसेंस",
      "sidebar.trackApp": "आवेदन ट्रैक करें",
      "sidebar.warehouse": "गोदाम",
      "sidebar.certifications": "प्रमाणपत्र",
      "sidebar.approval": "अनुमोदन",
      "sidebar.approved": "स्वीकृत",
      "sidebar.rejected": "अस्वीकृत",
      "sidebar.officerPanel": "अधिकारी पैनल",
      "sidebar.reviewApplications": "आवेदन समीक्षा",
      "sidebar.inspections": "निरीक्षण",
      "sidebar.inventoryOversight": "इन्वेंट्री निगरानी",
      "sidebar.digitalCerts": "डिजिटल प्रमाणपत्र",
      "sidebar.queries": "प्रश्न",
      "sidebar.home": "होम",
      "sidebar.store": "आयुष स्टोर",
      "sidebar.cart": "कार्ट",
      "sidebar.myOrders": "मेरे ऑर्डर",
      "sidebar.adminPortal": "एडमिन पोर्टल",
      "sidebar.manageUsers": "उपयोगकर्ता प्रबंधन",
      "sidebar.allApplications": "सभी आवेदन",
      "sidebar.systemSecurity": "सिस्टम सुरक्षा",
      "sidebar.systemLogs": "सिस्टम लॉग",
      "sidebar.logout": "लॉग आउट",
      "sidebar.loans": "ऋण",
      "sidebar.manageSchemes": "योजनाएं प्रबंधित करें",
      "sidebar.loanRequests": "ऋण अनुरोध",
      "header.notifications": "सूचनाएं",
      "header.markAllRead": "सभी पढ़ा हुआ चिह्नित करें",
      "header.noNotifications": "कोई सिस्टम सूचना नहीं",
      "header.myAccount": "मेरा खाता",
      "header.logout": "लॉग आउट",
    }
  },

  // ── ASSAMESE ───────────────────────────────────────────────────────────────
  as: {
    translation: {
      "nav.home": "হোম", "nav.about": "আয়ুষৰ বিষয়ে", "nav.register": "অনুজ্ঞাপত্ৰৰ বাবে আবেদন",
      "nav.track": "আবেদন ট্ৰেক কৰক", "nav.contact": "যোগাযোগ", "nav.login": "লগইন", "nav.signup": "চাইন আপ",
      "hero.title": "আয়ুষ পৰ্টেল", "hero.subtitle": "এএছইউ আৰু এইচ ড্ৰাগ লাইচেন্সিং ব্যৱস্থা",
      "hero.description": "আয়ুৰ্বেদ, সিদ্ধ, ইউনানী আৰু হোমিওপেথিৰ বাবে অনলাইন লাইচেন্সিং আৰু ইনভেন্টৰী পৰিচালনা।",
      "hero.cta.register": "লাইচেন্সৰ বাবে আবেদন কৰক", "hero.cta.track": "আবেদনৰ স্থিতি ট্ৰেক কৰক",
      "categories.title": "আয়ুষ শ্ৰেণীসমূহ", "categories.ayurveda": "আয়ুৰ্বেদ", "categories.yoga": "যোগ আৰু প্ৰাকৃতিক চিকিৎসা",
      "testimonials.title": "সাফলতাৰ কাহিনী", "footer.copyright": "© 2024 আয়ুষ পৰ্টেল। আয়ুষ মন্ত্ৰালয়, ভাৰত চৰকাৰ।",
      "dashboard.welcome": "পুনৰ স্বাগতম", "wizard.next": "অব্যাহত ৰাখক", "wizard.prev": "উভতি যাওক", "wizard.submit": "আবেদন দাখিল কৰক",
    }
  },

  // ── BENGALI ────────────────────────────────────────────────────────────────
  bn: {
    translation: {
      "nav.home": "হোম", "nav.about": "আয়ুষ সম্পর্কে", "nav.register": "লাইসেন্সের জন্য আবেদন করুন",
      "nav.track": "আবেদন ট্র্যাক করুন", "nav.contact": "যোগাযোগ", "nav.login": "লগইন", "nav.signup": "সাইন আপ",
      "hero.title": "আয়ুষ পোর্টাল", "hero.subtitle": "এএসইউ ও এইচ ড্রাগ লাইসেন্সিং সিস্টেম",
      "hero.description": "আয়ুর্বেদ, সিদ্ধ, ইউনানী ও হোমিওপ্যাথি ওষুধের জন্য অনলাইন লাইসেন্সিং ও ইনভেন্টরি পর্যবেক্ষণ।",
      "hero.cta.register": "লাইসেন্সের জন্য আবেদন করুন", "hero.cta.track": "আবেদনের অবস্থা ট্র্যাক করুন",
      "categories.title": "আয়ুষ বিভাগসমূহ", "categories.ayurveda": "আয়ুর্বেদ", "categories.yoga": "যোগ ও প্রাকৃতিক চিকিৎসা",
      "testimonials.title": "সাফল্যের গল্প", "footer.copyright": "© 2024 আয়ুষ পোর্টাল। আয়ুষ মন্ত্রণালয়, ভারত সরকার।",
      "dashboard.welcome": "আবার স্বাগতম", "wizard.next": "চালিয়ে যান", "wizard.prev": "পিছনে", "wizard.submit": "আবেদন জমা দিন",
    }
  },

  // ── BODO ───────────────────────────────────────────────────────────────────
  brx: {
    translation: {
      "nav.home": "होम", "nav.about": "आयुष बिफाव", "nav.register": "लाइसेन्स आफाद",
      "nav.track": "आफाद ट्रेक", "nav.contact": "खावनाय", "nav.login": "लगइन", "nav.signup": "साइन आप",
      "hero.title": "आयुष पोर्टेल", "hero.subtitle": "एएसयू एबा एइच गोनां लाइसेन्स सिस्टेम",
      "hero.description": "आयुर्वेद, सिद्ध, यूनानी एबा होमियोपैथीयाव गोनां लाइसेन्स एबा इन्वेन्टोरी मनहोनाय।",
      "hero.cta.register": "लाइसेन्सनि आफाद", "hero.cta.track": "आफाद स्थिति ट्रेक",
      "categories.title": "आयुष खन्थाय", "dashboard.welcome": "बापलायनानै बाहागो",
      "wizard.next": "थाखोसो", "wizard.prev": "उनाव", "wizard.submit": "आफाद पाहैनाय",
      "footer.copyright": "© 2024 आयुष पोर्टेल। आयुष मन्ट्रालय, भारत सरकार।",
    }
  },

  // ── CHHATTISGARHI ──────────────────────────────────────────────────────────
  hne: {
    translation: {
      "nav.home": "होम", "nav.about": "आयुष के बारे में", "nav.register": "लाइसेंस बर आवेदन",
      "nav.track": "आवेदन ट्रैक करव", "nav.contact": "संपर्क", "nav.login": "लॉगइन", "nav.signup": "साइन अप",
      "hero.title": "आयुष पोर्टल", "hero.subtitle": "एएसयू अउ एच दवाई लाइसेंसिंग सिस्टम",
      "hero.description": "आयुर्वेद, सिद्ध, यूनानी अउ होमियोपैथी बर ऑनलाइन लाइसेंसिंग अउ भंडार प्रबंधन।",
      "hero.cta.register": "लाइसेंस बर आवेदन करव", "hero.cta.track": "आवेदन स्थिति देखव",
      "categories.title": "आयुष श्रेणी", "dashboard.welcome": "वापस आपके स्वागत हे",
      "wizard.next": "आगे बढ़व", "wizard.prev": "पाछु", "wizard.submit": "आवेदन जमा करव",
      "footer.copyright": "© 2024 आयुष पोर्टल। आयुष मंत्रालय, भारत सरकार।",
    }
  },

  // ── GUJARATI ───────────────────────────────────────────────────────────────
  gu: {
    translation: {
      "nav.home": "હોમ", "nav.about": "આયુષ વિશે", "nav.register": "લાઇસન્સ માટે અરજી",
      "nav.track": "અરજી ટ્રૅક કરો", "nav.contact": "સંપર્ક", "nav.login": "લૉગઇન", "nav.signup": "સાઇન અપ",
      "hero.title": "આયુષ પોર્ટલ", "hero.subtitle": "એએસયુ અને એચ ડ્રગ લાઇસન્સિંગ સિસ્ટમ",
      "hero.description": "આયુર્વેદ, સિદ્ધ, યુનાની અને હોમિયોપેથી દવાઓ માટે ઓનલાઇન લાઇસન્સિંગ અને ઇન્વેન્ટ્રી મોનિટરિંગ.",
      "hero.cta.register": "લાઇસન્સ માટે અરજી કરો", "hero.cta.track": "અરજીની સ્થિતિ ટ્રૅક કરો",
      "categories.title": "આયુષ કેટેગરી", "categories.ayurveda": "આયુર્વેદ", "categories.yoga": "યોગ અને પ્રાકૃતિક ઉપચાર",
      "testimonials.title": "સફળતાની વાર્તાઓ", "footer.copyright": "© 2024 આયુષ પોર્ટલ। આયુષ મંત્રાલય, ભારત સરકાર.",
      "dashboard.welcome": "પાછા આવ્યા", "wizard.next": "આગળ", "wizard.prev": "પાછળ", "wizard.submit": "અરજી સબમિટ કરો",
    }
  },

  // ── KANNADA ───────────────────────────────────────────────────────────────
  kn: {
    translation: {
      "nav.home": "ಮುಖಪುಟ", "nav.about": "ಆಯುಷ್ ಬಗ್ಗೆ", "nav.register": "ಪರವಾನಗಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      "nav.track": "ಅರ್ಜಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ", "nav.contact": "ಸಂಪರ್ಕ", "nav.login": "ಲಾಗಿನ್", "nav.signup": "ಸೈನ್ ಅಪ್",
      "hero.title": "ಆಯುಷ್ ಪೋರ್ಟಲ್", "hero.subtitle": "ಎಎಸ್‌ಯು ಮತ್ತು ಎಚ್ ಔಷಧ ಪರವಾನಗಿ ವ್ಯವಸ್ಥೆ",
      "hero.description": "ಆಯುರ್ವೇದ, ಸಿದ್ಧ, ಯೂನಾನಿ ಮತ್ತು ಹೋಮಿಯೋಪತಿ ಔಷಧಗಳಿಗಾಗಿ ಆನ್‌ಲೈನ್ ಪರವಾನಗಿ.",
      "hero.cta.register": "ಪರವಾನಗಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ", "hero.cta.track": "ಅರ್ಜಿ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "categories.title": "ಆಯುಷ್ ವರ್ಗಗಳು", "categories.ayurveda": "ಆಯುರ್ವೇದ", "categories.yoga": "ಯೋಗ ಮತ್ತು ಪ್ರಕೃತಿ ಚಿಕಿತ್ಸೆ",
      "testimonials.title": "ಯಶೋಗಾಥೆಗಳು", "footer.copyright": "© 2024 ಆಯುಷ್ ಪೋರ್ಟಲ್. ಆಯುಷ್ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ.",
      "dashboard.welcome": "ಮರಳಿ ಸ್ವಾಗತ", "wizard.next": "ಮುಂದುವರಿಸಿ", "wizard.prev": "ಹಿಂದೆ", "wizard.submit": "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    }
  },

  // ── KASHMIRI ──────────────────────────────────────────────────────────────
  ks: {
    translation: {
      "nav.home": "ہوم", "nav.about": "آیوش بابت", "nav.register": "لائسنس کیٔتہ درخواست",
      "nav.track": "درخواست ٹریک کرو", "nav.contact": "رابطہ", "nav.login": "لاگ ان", "nav.signup": "سائن اپ",
      "hero.title": "آیوش پورٹل", "hero.subtitle": "اے ایس یو تہٕ ایچ دوائی لائسنسنگ نظام",
      "hero.description": "آیروید، سدھ، یونانی تہٕ ہومیوپیتھی دوائیوں کیٔتہ آنلائن لائسنسنگ تہٕ نگرانی۔",
      "hero.cta.register": "لائسنس کیٔتہ درخواست", "hero.cta.track": "درخواست حال ٹریک کرو",
      "categories.title": "آیوش خانہ بندی", "dashboard.welcome": "واپسی مبارک",
      "wizard.next": "اگٕر", "wizard.prev": "پتٕہ", "wizard.submit": "درخواست پیش کرو",
      "footer.copyright": "© 2024 آیوش پورٹل۔ آیوش وزارت، ہندوستان سرکار۔",
    }
  },

  // ── KONKANI ───────────────────────────────────────────────────────────────
  kok: {
    translation: {
      "nav.home": "मुखेल", "nav.about": "आयुष विशीं", "nav.register": "लायसन्स खातीर अर्ज",
      "nav.track": "अर्ज ट्रॅक करात", "nav.contact": "संपर्क", "nav.login": "लॉगिन", "nav.signup": "साइन अप",
      "hero.title": "आयुष पोर्टल", "hero.subtitle": "एएसयू आनी एच दवाखाणे लायसन्सिंग यंत्रणा",
      "hero.description": "आयुर्वेद, सिद्ध, युनानी आनी होमियोपैथी दवाईंखातीर ऑनलाइन लायसन्सिंग.",
      "hero.cta.register": "लायसन्स खातीर अर्ज दिवात", "hero.cta.track": "अर्जाचितो हाल",
      "categories.title": "आयुष प्रकार", "dashboard.welcome": "परते येवकार",
      "wizard.next": "फुडें", "wizard.prev": "मागें", "wizard.submit": "अर्ज सादर करात",
      "footer.copyright": "© 2024 आयुष पोर्टल. आयुष मंत्रालय, भारत सरकार.",
    }
  },

  // ── KOKBOROK ──────────────────────────────────────────────────────────────
  kok_TT: {
    translation: {
      "nav.home": "হোম", "nav.about": "আয়ুষ সম্পর্কে", "nav.register": "লাইসেন্স অনুরোধ",
      "nav.track": "আবেদন ট্র্যাক", "nav.contact": "যোগাযোগ", "nav.login": "লগইন", "nav.signup": "সাইন আপ",
      "hero.title": "আয়ুষ পোর্টাল", "hero.subtitle": "এএসইউ ও এইচ ওষুধ লাইসেন্সিং",
      "hero.description": "আয়ুর্বেদ, সিদ্ধ, ইউনানী ও হোমিওপ্যাথি ওষুধের অনলাইন লাইসেন্সিং।",
      "hero.cta.register": "লাইসেন্স আবেদন করুন", "hero.cta.track": "আবেদন ট্র্যাক করুন",
      "categories.title": "আয়ুষ বিভাগ", "dashboard.welcome": "ফিরে স্বাগতম",
      "wizard.next": "এগিয়ে যান", "wizard.prev": "পিছনে", "wizard.submit": "আবেদন জমা দিন",
      "footer.copyright": "© 2024 আয়ুষ পোর্টাল। আয়ুষ মন্ত্রণালয়, ভারত সরকার।",
    }
  },

  // ── LEPCHA ────────────────────────────────────────────────────────────────
  lep: {
    translation: {
      "nav.home": "Home", "nav.about": "AYUSH ᰛᰦᰶᰕ", "nav.register": "License ᰆᰔᰕᰱ",
      "nav.track": "ᰆᰔᰕᰱ Track", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up",
      "hero.title": "AYUSH Portal", "hero.subtitle": "ASU & H Drug Licensing",
      "hero.description": "Ayurveda, Siddha, Unani ᰛᰦ Homoeopathy ᰒᰛᰤᰢ Online Licensing.",
      "hero.cta.register": "License ᰆᰔᰕᰱ", "hero.cta.track": "ᰆᰔᰕᰱ Status Track",
      "categories.title": "AYUSH ᰛᰦᰶᰕ", "dashboard.welcome": "ᰃᰤᰵᰙ",
      "wizard.next": "Next", "wizard.prev": "Back", "wizard.submit": "Submit",
      "footer.copyright": "© 2024 AYUSH Portal. Ministry of AYUSH, Government of India.",
    }
  },

  // ── MALAYALAM ─────────────────────────────────────────────────────────────
  ml: {
    translation: {
      "nav.home": "ഹോം", "nav.about": "ആയുഷ് കുറിച്ച്", "nav.register": "ലൈസൻസിനായി അപേക്ഷിക്കുക",
      "nav.track": "അപേക്ഷ ട്രാക്ക് ചെയ്യുക", "nav.contact": "ബന്ധപ്പെടുക", "nav.login": "ലോഗിൻ", "nav.signup": "സൈൻ അപ്",
      "hero.title": "ആയുഷ് പോർട്ടൽ", "hero.subtitle": "എഎസ്‌യു & എച്ച് ഡ്രഗ് ലൈസൻസിങ് സിസ്റ്റം",
      "hero.description": "ആയുർവേദ, സിദ്ധ, യൂനാനി, ഹോമിയോപ്പതി മരുന്നുകൾക്കായി ഓൺലൈൻ ലൈസൻസിങ് ആൻഡ് ഇൻവെന്ററി മോണിറ്ററിങ്.",
      "hero.cta.register": "ലൈസൻസിനായി അപേക്ഷിക്കുക", "hero.cta.track": "അപേക്ഷ നില ട്രാക്ക് ചെയ്യുക",
      "categories.title": "ആയുഷ് വിഭാഗങ്ങൾ", "categories.ayurveda": "ആയുർവേദം", "categories.yoga": "യോഗ & പ്രകൃതി ചികിത്സ",
      "testimonials.title": "വിജയ കഥകൾ", "footer.copyright": "© 2024 ആയുഷ് പോർട്ടൽ. ആയുഷ് മന്ത്രാലയം, ഭാരത സർക്കാർ.",
      "dashboard.welcome": "തിരിച്ചു സ്വാഗതം", "wizard.next": "തുടരുക", "wizard.prev": "പുറകോട്ട്", "wizard.submit": "അപേക്ഷ സമർപ്പിക്കുക",
    }
  },

  // ── MANIPURI (MEITEI) ─────────────────────────────────────────────────────
  mni: {
    translation: {
      "nav.home": "ꯍꯣꯝ", "nav.about": "ꯑꯥꯌꯨꯁ ꯑꯩꯥꯕꯤ", "nav.register": "ꯂꯥꯏꯁꯦꯟꯁ ꯑꯦꯞꯂꯥꯏ",
      "nav.track": "ꯑꯦꯞꯂꯤꯀꯦꯁꯅ ꯠꯔꯦꯛ", "nav.contact": "ꯆꯪꯁꯤꯟ", "nav.login": "ꯂꯣꯒꯤꯟ", "nav.signup": "ꯁꯥꯏꯟ ꯑꯞ",
      "hero.title": "ꯑꯥꯌꯨꯁ ꯄꯣꯔꯇꯜ", "hero.subtitle": "ꯑꯦꯁꯌꯨ & ꯑꯦꯆ ꯗ꯭ꯔꯒ ꯂꯥꯏꯁꯦꯟꯁꯤꯡ",
      "hero.description": "ꯑꯥꯌꯨꯔꯚꯦꯗ, ꯁꯤꯗ꯭ꯙ, ꯌꯨꯅꯥꯅꯤ ꯑꯃꯗꯤ ꯍꯣꯃꯤꯌꯣꯄꯦꯊꯤꯖꯒꯤ ꯑꯣꯅꯂꯥꯏꯟ ꯂꯥꯏꯁꯦꯟꯁꯤꯡ.",
      "hero.cta.register": "ꯂꯥꯏꯁꯦꯟꯁ ꯑꯦꯞꯂꯥꯏ", "hero.cta.track": "ꯑꯦꯞꯂꯤꯀꯦꯁꯅ ꯇ꯭ꯔꯦꯛ",
      "categories.title": "ꯑꯥꯌꯨꯁ ꯀꯦꯇꯦꯒꯣꯔꯤ", "dashboard.welcome": "ꯇꯨꯝꯅꯥ ꯂꯥꯛꯅꯐꯝ",
      "wizard.next": "ꯑꯣꯌꯅꯕꯤꯌꯨ", "wizard.prev": "ꯅꯨꯡꯉꯥꯢ", "wizard.submit": "ꯑꯦꯞꯂꯤꯀꯦꯁꯅ ꯁꯥꯕꯃꯤꯠ",
      "footer.copyright": "© 2024 ꯑꯥꯌꯨꯁ ꯄꯣꯔꯇꯜ. ꯑꯥꯌꯨꯁ ꯃꯤꯅꯤꯁ꯭ꯇ꯭ꯔꯤ, ꯐꯥꯏꯕꯒꯤ ꯁꯔꯀꯥꯔ.",
    }
  },

  // ── MARATHI ───────────────────────────────────────────────────────────────
  mr: {
    translation: {
      "nav.home": "मुख्यपृष्ठ", "nav.about": "आयुषबद्दल", "nav.register": "परवान्यासाठी अर्ज करा",
      "nav.track": "अर्ज ट्रॅक करा", "nav.contact": "संपर्क", "nav.login": "लॉगिन", "nav.signup": "साइन अप",
      "hero.title": "आयुष पोर्टल", "hero.subtitle": "एएसयू आणि एच औषध परवाना प्रणाली",
      "hero.description": "आयुर्वेद, सिद्ध, युनानी आणि होमिओपॅथी औषधांसाठी ऑनलाइन परवाना आणि यादी देखरेख.",
      "hero.cta.register": "परवान्यासाठी अर्ज करा", "hero.cta.track": "अर्जाची स्थिती ट्रॅक करा",
      "categories.title": "आयुष प्रकार", "categories.ayurveda": "आयुर्वेद", "categories.yoga": "योग आणि निसर्गोपचार",
      "testimonials.title": "यशोगाथा", "footer.copyright": "© 2024 आयुष पोर्टल. आयुष मंत्रालय, भारत सरकार.",
      "dashboard.welcome": "पुन्हा स्वागत आहे", "wizard.next": "पुढे", "wizard.prev": "मागे", "wizard.submit": "अर्ज सादर करा",
    }
  },

  // ── MIZO ──────────────────────────────────────────────────────────────────
  lus: {
    translation: {
      "nav.home": "Home", "nav.about": "AYUSH a chungchang", "nav.register": "License dil rawh",
      "nav.track": "Dilna track rawh", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up",
      "hero.title": "AYUSH Portal", "hero.subtitle": "ASU & H Thuthumna License System",
      "hero.description": "Ayurveda, Siddha, Unani leh Homoeopathy-te tan online license leh inventory zawng.",
      "hero.cta.register": "License dil rawh", "hero.cta.track": "Dilna status en rawh",
      "categories.title": "AYUSH Categories", "dashboard.welcome": "Nangmah lut leh rawh",
      "wizard.next": "Zawngin", "wizard.prev": "Hnu thlenin", "wizard.submit": "Dilna submit rawh",
      "footer.copyright": "© 2024 AYUSH Portal. AYUSH Ministry, Government of India.",
    }
  },

  // ── NEPALI ────────────────────────────────────────────────────────────────
  ne: {
    translation: {
      "nav.home": "गृहपृष्ठ", "nav.about": "आयुषको बारेमा", "nav.register": "लाइसेन्सको लागि आवेदन",
      "nav.track": "आवेदन ट्र्याक गर्नुहोस्", "nav.contact": "सम्पर्क", "nav.login": "लगइन", "nav.signup": "साइन अप",
      "hero.title": "आयुष पोर्टल", "hero.subtitle": "एएसयू र एच औषधि लाइसेन्सिङ प्रणाली",
      "hero.description": "आयुर्वेद, सिद्ध, युनानी र होम्योप्याथी औषधिका लागि अनलाइन लाइसेन्सिङ र सूची अनुगमन।",
      "hero.cta.register": "लाइसेन्सको लागि आवेदन गर्नुहोस्", "hero.cta.track": "आवेदन स्थिति ट्र्याक गर्नुहोस्",
      "categories.title": "आयुष श्रेणीहरू", "categories.ayurveda": "आयुर्वेद", "categories.yoga": "योग र प्राकृतिक चिकित्सा",
      "testimonials.title": "सफलताका कथाहरू", "footer.copyright": "© 2024 आयुष पोर्टल. आयुष मन्त्रालय, भारत सरकार.",
      "dashboard.welcome": "फिर्ता स्वागत छ", "wizard.next": "जारी राख्नुहोस्", "wizard.prev": "पछाडि", "wizard.submit": "आवेदन पेश गर्नुहोस्",
    }
  },

  // ── ODIA ──────────────────────────────────────────────────────────────────
  or: {
    translation: {
      "nav.home": "ହୋମ", "nav.about": "ଆୟୁଷ ବିଷୟରେ", "nav.register": "ଲାଇସେନ୍ସ ପାଇଁ ଆବେଦନ",
      "nav.track": "ଆବେଦନ ଟ୍ରାକ କରନ୍ତୁ", "nav.contact": "ସମ୍ପର୍କ", "nav.login": "ଲଗ ଇନ", "nav.signup": "ସାଇନ ଅପ",
      "hero.title": "ଆୟୁଷ ପୋର୍ଟାଲ", "hero.subtitle": "ଏଏସୟୁ ଓ ଏଚ ଔଷଧ ଲାଇସେନ୍ସ ସିଷ୍ଟମ",
      "hero.description": "ଆୟୁର୍ବେଦ, ସିଦ୍ଧ, ୟୁନାନୀ ଓ ହୋମିଓପ୍ୟାଥି ଔଷଧ ପାଇଁ ଅନଲାଇନ ଲାଇସେନ୍ସ {}  ଇନ୍ଭେଣ୍ଟ୍ରି।",
      "hero.cta.register": "ଲାଇସେନ୍ସ ଆବେଦନ", "hero.cta.track": "ଆବେଦନ ସ୍ଥିତି ଟ୍ରାକ",
      "categories.title": "ଆୟୁଷ ବର୍ଗ", "dashboard.welcome": "ପୁଣି ସ୍ୱାଗତ",
      "wizard.next": "ଆଗକୁ", "wizard.prev": "ପଛକୁ", "wizard.submit": "ଆବେଦନ ଦାଖଲ",
      "footer.copyright": "© 2024 ଆୟୁଷ ପୋର୍ଟାଲ. ଆୟୁଷ ମନ୍ତ୍ରଣାଳୟ, ଭାରତ ସରକାର।",
    }
  },

  // ── PUNJABI ───────────────────────────────────────────────────────────────
  pa: {
    translation: {
      "nav.home": "ਹੋਮ", "nav.about": "ਆਯੁਸ਼ ਬਾਰੇ", "nav.register": "ਲਾਇਸੈਂਸ ਲਈ ਅਰਜ਼ੀ ਕਰੋ",
      "nav.track": "ਅਰਜ਼ੀ ਟ੍ਰੈਕ ਕਰੋ", "nav.contact": "ਸੰਪਰਕ", "nav.login": "ਲਾਗਿਨ", "nav.signup": "ਸਾਈਨ ਅੱਪ",
      "hero.title": "ਆਯੁਸ਼ ਪੋਰਟਲ", "hero.subtitle": "ਏਐਸਯੂ ਅਤੇ ਐਚ ਦਵਾਈ ਲਾਇਸੈਂਸਿੰਗ ਸਿਸਟਮ",
      "hero.description": "ਆਯੁਰਵੇਦ, ਸਿੱਧ, ਯੂਨਾਨੀ ਅਤੇ ਹੋਮਿਓਪੈਥੀ ਦਵਾਈਆਂ ਲਈ ਆਨਲਾਈਨ ਲਾਇਸੈਂਸਿੰਗ।",
      "hero.cta.register": "ਲਾਇਸੈਂਸ ਲਈ ਅਰਜ਼ੀ ਕਰੋ", "hero.cta.track": "ਅਰਜ਼ੀ ਸਥਿਤੀ ਟ੍ਰੈਕ ਕਰੋ",
      "categories.title": "ਆਯੁਸ਼ ਸ਼੍ਰੇਣੀਆਂ", "categories.ayurveda": "ਆਯੁਰਵੇਦ", "categories.yoga": "ਯੋਗ ਅਤੇ ਕੁਦਰਤੀ ਇਲਾਜ",
      "testimonials.title": "ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ", "footer.copyright": "© 2024 ਆਯੁਸ਼ ਪੋਰਟਲ. ਆਯੁਸ਼ ਮੰਤਰਾਲਾ, ਭਾਰਤ ਸਰਕਾਰ.",
      "dashboard.welcome": "ਵਾਪਸ ਜੀ ਆਇਆਂ", "wizard.next": "ਜਾਰੀ ਰੱਖੋ", "wizard.prev": "ਪਿੱਛੇ", "wizard.submit": "ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਕਰੋ",
    }
  },

  // ── SANSKRIT ──────────────────────────────────────────────────────────────
  sa: {
    translation: {
      "nav.home": "मुखपृष्ठम्", "nav.about": "आयुषः विषये", "nav.register": "अनुज्ञापत्राय निवेदनम्",
      "nav.track": "निवेदनं अनुगच्छतु", "nav.contact": "सम्पर्कः", "nav.login": "प्रवेशः", "nav.signup": "नाम लेखनम्",
      "hero.title": "आयुष पोर्टलम्", "hero.subtitle": "एएसयू च एच औषध अनुज्ञापत्र व्यवस्था",
      "hero.description": "आयुर्वेद, सिद्ध, यूनानी च होमियोपैथी औषधानां कृते ऑनलाइन अनुज्ञापत्रम्।",
      "hero.cta.register": "अनुज्ञापत्राय निवेदनम्", "hero.cta.track": "निवेदन स्थितिः",
      "categories.title": "आयुष प्रकाराः", "categories.ayurveda": "आयुर्वेदः",
      "dashboard.welcome": "पुनः स्वागतम्", "wizard.next": "अग्रे", "wizard.prev": "पृष्ठतः", "wizard.submit": "निवेदनं सादरय",
      "footer.copyright": "© 2024 आयुष पोर्टलम्. आयुष मन्त्रालयम्, भारत सर्वकारः.",
    }
  },

  // ── SIKKIMESE (BHUTIA) ────────────────────────────────────────────────────
  sio: {
    translation: {
      "nav.home": "Home", "nav.about": "AYUSH སྐོར", "nav.register": "License ཞུ",
      "nav.track": "ཞུ་ཡིག Track", "nav.contact": "Contact", "nav.login": "Login", "nav.signup": "Sign Up",
      "hero.title": "AYUSH Portal", "hero.subtitle": "ASU & H སྨན་གཡྲིག License ལག་ལེན",
      "hero.description": "Ayurveda, Siddha, Unani དང་ Homoeopathy སྨན་གཡྲིག License ཐོབ་ཐང་།",
      "hero.cta.register": "License ཞུ", "hero.cta.track": "ཞུ་ཡིག Status",
      "categories.title": "AYUSH རིགས", "dashboard.welcome": "ཡོང་བ་ལེགས་སོ།",
      "wizard.next": "མཐར", "wizard.prev": "ཕྱིར", "wizard.submit": "ཞུ་ཡིག Submit",
      "footer.copyright": "© 2024 AYUSH Portal. AYUSH Ministry, Government of India.",
    }
  },

  // ── TAMIL (தமிழ்) — COMPLETE ───────────────────────────────────────────────
  ta: {
    translation: {
      // Navigation
      "nav.home": "முகப்பு",
      "nav.about": "ஆயுஷ் பற்றி",
      "nav.register": "உரிமத்திற்கு விண்ணப்பிக்க",
      "nav.track": "விண்ணப்பம் கண்காணி",
      "nav.resources": "மருந்து தரவுத்தொகுப்பு",
      "nav.contact": "தொடர்பு கொள்ள",
      "nav.login": "உள்நுழை",
      "nav.signup": "பதிவு செய்க",

      // Hero
      "hero.title": "ஆயுஷ் தொகுப்பு",
      "hero.subtitle": "ASU & H மருந்து உரிம அமைப்பு",
      "hero.description": "ஆயுர்வேதம், சித்தா, யுனானி மற்றும் ஹோமியோபதி மருந்துகளுக்கான ஒன்றிணைந்த ஆன்லைன் உரிமம், மருந்து கிடங்கு மேலாண்மை மற்றும் சரக்கு கண்காணிப்பு தளம்.",
      "hero.cta.register": "உரிமத்திற்கு விண்ணப்பி",
      "hero.cta.track": "விண்ணப்ப நிலை கண்காணி",

      // Features
      "features.title": "ஆயுஷ் தொகுப்பின் நன்மைகள்",
      "features.subtitle": "ஆயுஷ் மருந்து ஒழுங்குமுறையில் வெளிப்படைத்தன்மை, பொறுப்பு மற்றும் தரம் உறுதிசெய்தல்",
      "features.ai.title": "ஆன்லைன் உரிமம்",
      "features.ai.desc": "படிவம் 25-D, 24-D மற்றும் பிற உற்பத்தி உரிமங்களுக்கு தானியங்கி பணிப்பாய்வுடன் விண்ணப்பம்.",
      "features.blockchain.title": "மருந்து கிடங்கு",
      "features.blockchain.desc": "மருந்து இருப்பு நிகழ்நேர கண்காணிப்பு, காலாவதி கண்காணிப்பு மற்றும் தானியங்கி இண்டெண்ட் உருவாக்கம்.",
      "features.tracking.title": "SMS/மின்னஞ்சல் அறிவிப்புகள்",
      "features.tracking.desc": "விண்ணப்ப நிலை மற்றும் வரவிருக்கும் காலாவதிகளுக்கான உடனடி அறிவிப்புகள்.",
      "features.multilingual.title": "பிராந்திய ஆதரவு",
      "features.multilingual.desc": "23 இந்திய மொழிகளில் கிடைக்கும் இடைமுகம்.",
      "features.compliance.title": "தர கண்காணிப்பு",
      "features.compliance.desc": "மருந்து சோதனை அறிக்கைகள் கண்காணிப்பு மற்றும் போலி மருந்துகள் கண்டறிதல்.",
      "features.investor.title": "உற்பத்தியாளர் அடைவு",
      "features.investor.desc": "அனைத்து உரிமம் பெற்ற ASU & H மருந்து உற்பத்தியாளர்களின் பொது அணுகல் தரவுத்தொகுப்பு.",

      // Categories
      "categories.title": "ஆயுஷ் பிரிவுகள்",
      "categories.subtitle": "ஐந்து பாரம்பரிய ஆயுஷ் மருத்துவ முறைகளில் ஒன்றின் கீழ் உங்கள் தொடக்க நிறுவனத்தை பதிவு செய்யுங்கள்",
      "categories.explore": "மேலும் அறிய",
      "categories.ayurveda": "ஆயுர்வேதம்",
      "categories.ayurveda.desc": "இயற்கை மருத்துவம் மூலம் உடல், மனம் மற்றும் ஆன்மாவின் சமநிலையில் கவனம் செலுத்தும் பாரம்பரிய இந்திய மருத்துவ முறை.",
      "categories.yoga": "யோகா & இயற்கை மருத்துவம்",
      "categories.yoga.desc": "யோகாசனம், பிராணாயாமம் மற்றும் இயற்கை சிகிச்சை மூலம் முழுமையான நலன்.",
      "categories.unani": "யுனானி",
      "categories.unani.desc": "இயற்கை கூறுகள் மற்றும் மூலிகை கூட்டுகளை வலியுறுத்தும் கிரேக்க-அரபு மருத்துவம்.",
      "categories.siddha": "சித்தா",
      "categories.siddha.desc": "முழுமையான குணப்படுத்தலுக்கு மூலிகைகள், உலோகங்கள் மற்றும் கனிமங்களை பயன்படுத்தும் பண்டைய தமிழ் மருத்துவம்.",
      "categories.homeopathy": "ஹோமியோபதி",
      "categories.homeopathy.desc": "இயற்கை குணப்படுத்தலை தூண்டும் அதிக மெலிந்த பொருட்களால் நோய்களை சிகிச்சையளித்தல்.",

      // Testimonials
      "testimonials.title": "வெற்றிக் கதைகள்",
      "testimonials.subtitle": "பதிவு அனுபவத்தை மாற்றிய தொடக்க நிறுவனங்களிடமிருந்து கேளுங்கள்",

      // CTA
      "cta.title": "இன்றே உற்பத்தி உரிமத்திற்கு விண்ணப்பிக்கவும்",
      "cta.subtitle": "தரமான ஆயுஷ் மருந்துகளை உறுதிசெய்யும் ஆயிரக்கணக்கான உரிமம் பெற்ற உற்பத்தியாளர்களுடன் இணையுங்கள்",
      "cta.button": "புதிய உரிம விண்ணப்பத்தை தொடங்கு",
      "cta.benefit1": "உரிம செயல்பாட்டிற்கான நிர்ணயிக்கப்பட்ட காலக்கெடுக்கள்",
      "cta.benefit2": "மருந்து கிடங்கு நிகழ்நேர கண்காணிப்பு",
      "cta.benefit3": "தானியங்கி இண்டெண்ட் மற்றும் பங்கு எச்சரிக்கைகள்",
      "cta.benefit4": "தர சோதனை ஆய்வகங்களுடன் ஒருங்கிணைக்கப்பட்டது",

      // Footer
      "footer.copyright": "© 2024 ஆயுஷ் தொகுப்பு. ஆயுஷ் அமைச்சகம், இந்திய அரசு.",

      // Stats
      "stats.registered": "உரிமம் பெற்ற உற்பத்தியாளர்கள்",
      "stats.processing": "சராசரி அனுமதி நாட்கள்",
      "stats.approval": "இணக்க விகிதம்",
      "stats.states": "மாநிலங்கள் ஒருங்கிணைக்கப்பட்டன",

      // Dashboard
      "dashboard.welcome": "மீண்டும் வரவேற்கிறோம்",
      "dashboard.applications": "உங்கள் விண்ணப்பங்கள்",
      "dashboard.welcomeTitle": "வரவேற்கிறோம்",
      "dashboard.portalName": "ஆயுஷ் தொகுப்பு",
      "dashboard.sessionActive": "அமர்வு செயலில் உள்ளது",
      "dashboard.activeLicenses": "செயலில் உள்ள உரிமங்கள்",
      "dashboard.productApprovals": "தயாரிப்பு அனுமதிகள்",
      "dashboard.pendingReview": "மதிப்பாய்வு நிலுவையில்",
      "dashboard.rejected": "நிராகரிக்கப்பட்டது",
      "dashboard.quickDigital": "டிஜிட்டல் சந்தை",
      "dashboard.quickPurchases": "என் கொள்முதல்கள்",
      "dashboard.quickLicense": "புதிய உரிமம்",
      "dashboard.quickTrack": "கண்காணி",

      // Sidebar
      "sidebar.dashboard": "டாஷ்போர்டு",
      "sidebar.newLicense": "புதிய உரிமம்",
      "sidebar.trackApp": "விண்ணப்பம் கண்காணி",
      "sidebar.warehouse": "கிடங்கு",
      "sidebar.certifications": "சான்றிதழ்கள்",
      "sidebar.approval": "அனுமதி",
      "sidebar.approved": "அனுமதிக்கப்பட்டது",
      "sidebar.rejected": "நிராகரிக்கப்பட்டது",
      "sidebar.officerPanel": "அதிகாரி குழு",
      "sidebar.reviewApplications": "விண்ணப்பங்கள் மதிப்பாய்வு",
      "sidebar.inspections": "ஆய்வுகள்",
      "sidebar.inventoryOversight": "சரக்கு மேற்பார்வை",
      "sidebar.digitalCerts": "டிஜிட்டல் சான்றிதழ்கள்",
      "sidebar.queries": "கேள்விகள்",
      "sidebar.home": "முகப்பு",
      "sidebar.store": "ஆயுஷ் கடை",
      "sidebar.cart": "கார்ட்",
      "sidebar.myOrders": "என் ஆர்டர்கள்",
      "sidebar.adminPortal": "நிர்வாகி தொகுப்பு",
      "sidebar.manageUsers": "பயனர்களை நிர்வகி",
      "sidebar.allApplications": "அனைத்து விண்ணப்பங்கள்",
      "sidebar.systemSecurity": "கணினி பாதுகாப்பு",
      "sidebar.systemLogs": "கணினி பதிவுகள்",
      "sidebar.logout": "வெளியேறு",
      "sidebar.loans": "கடன்கள்",

      // Header
      "header.notifications": "அறிவிப்புகள்",
      "header.markAllRead": "அனைத்தையும் படித்ததாக குறி",
      "header.noNotifications": "இன்னும் கணினி அறிவிப்புகள் இல்லை",
      "header.myAccount": "என் கணக்கு",
      "header.logout": "வெளியேறு",

      // Wizard
      "wizard.next": "தொடரவும்",
      "wizard.prev": "முந்தையது",
      "wizard.submit": "விண்ணப்பம் சமர்ப்பி",
      "wizard.save": "சேமி & வெளியேறு",
      "wizard.step1": "அடிப்படை தகவல்",
      "wizard.step2": "வணிக விவரங்கள்",
      "wizard.step3": "இணக்கம்",
      "wizard.step4": "நிதி",
      "wizard.step5": "மதிப்பாய்வு & கையொப்பம்",
    }
  },

  // ── TELUGU ────────────────────────────────────────────────────────────────
  te: {
    translation: {
      "nav.home": "హోమ్", "nav.about": "ఆయుష్ గురించి", "nav.register": "లైసెన్స్‌కు దరఖాస్తు",
      "nav.track": "దరఖాస్తు ట్రాక్ చేయండి", "nav.contact": "సంప్రదించండి", "nav.login": "లాగిన్", "nav.signup": "సైన్ అప్",
      "hero.title": "ఆయుష్ పోర్టల్", "hero.subtitle": "ఏఎస్‌యూ & హెచ్ ఔషధ లైసెన్సింగ్ వ్యవస్థ",
      "hero.description": "ఆయుర్వేదం, సిద్ధ, యూనానీ మరియు హోమియోపతి ఔషధాల కోసం ఆన్‌లైన్ లైసెన్సింగ్ మరియు ఇన్వెంటరీ పర్యవేక్షణ.",
      "hero.cta.register": "లైసెన్స్‌కు దరఖాస్తు చేయండి", "hero.cta.track": "దరఖాస్తు స్థితి ట్రాక్ చేయండి",
      "categories.title": "ఆయుష్ విభాగాలు", "categories.ayurveda": "ఆయుర్వేదం", "categories.yoga": "యోగా & ప్రకృతి వైద్యం",
      "testimonials.title": "విజయ గాథలు", "footer.copyright": "© 2024 ఆయుష్ పోర్టల్. ఆయుష్ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం.",
      "dashboard.welcome": "తిరిగి స్వాగతం", "wizard.next": "కొనసాగించు", "wizard.prev": "వెనుకకు", "wizard.submit": "దరఖాస్తు సమర్పించండి",
    }
  },

  // ── URDU ──────────────────────────────────────────────────────────────────
  ur: {
    translation: {
      "nav.home": "ہوم", "nav.about": "آیوش کے بارے میں", "nav.register": "لائسنس کے لیے درخواست",
      "nav.track": "درخواست ٹریک کریں", "nav.contact": "رابطہ", "nav.login": "لاگ ان", "nav.signup": "سائن اپ",
      "hero.title": "آیوش پورٹل", "hero.subtitle": "اے ایس یو اور ایچ دوائی لائسنسنگ نظام",
      "hero.description": "آیروید، سدھ، یونانی اور ہومیوپیتھی دوائیوں کے لیے آنلائن لائسنسنگ اور انوینٹری نگرانی۔",
      "hero.cta.register": "لائسنس کے لیے درخواست کریں", "hero.cta.track": "درخواست کی حالت ٹریک کریں",
      "categories.title": "آیوش زمرے", "categories.ayurveda": "آیروید", "categories.yoga": "یوگا اور قدرتی علاج",
      "testimonials.title": "کامیابی کی کہانیاں", "footer.copyright": "© 2024 آیوش پورٹل۔ آیوش وزارت، حکومت ہند۔",
      "dashboard.welcome": "واپس آپ کا خیر مقدم ہے", "wizard.next": "جاری رکھیں", "wizard.prev": "پیچھے", "wizard.submit": "درخواست جمع کریں",
    }
  },
};

// Restore saved language on load
const savedLang = localStorage.getItem('ayush_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
