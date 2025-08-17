'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations: { [key: string]: { [key: string]: string } } = {
  en: {
    home: 'Home',
    about: 'About',
    videos: 'Videos',
    missions: 'Missions',
    'mission-control': 'Mission Control',
    progress: 'Progress',
    settings: 'Settings',
    'choose-mission-level-up': 'Choose your mission. Level up your digital life.',
    'hero-description': 'Learn essential digital literacy skills through interactive games. Master healthy screen time habits and become an expert at spotting online scams, and detecting AI-generated content.',
    'start-your-mission': 'Start Your Mission',
    'learn-more': 'Learn More',
    'choose-learning-path': 'Choose Your Learning Path',
    'mindfog-mission': 'MindFog Mission',
    'mindfog-tagline': 'Balance screen time, protect your mood',
    'mindfog-description': 'Learn to create healthy digital habits, manage screen time effectively, and protect your mental wellbeing from digital overwhelm.',
    '5-7-minutes': '5-7 minutes',
    'focus-champion': 'Focus Champion',
    'start-mission': 'Start Mission',
    'phisher-hunt': 'Phisher Hunt',
    'phisher-tagline': 'Spot scams before they catch you',
    'phisher-description': 'Become a scam detection expert. Learn to identify phishing emails, fake websites, and social engineering tactics.',
    'scam-spotter': 'Scam Spotter',
    'ai-truth-hunter': 'AI Truth Hunter',
    'ai-tagline': 'Detect AI fakes and misinformation',
    'ai-description': 'Master the art of detecting AI-generated images, deepfakes, and fake news. Become a digital truth detective.',
    '6-8-minutes': '6-8 minutes',
    'truth-detective': 'Truth Detective',
    'why-digital-defenders': 'Why Digital Defenders?',
    'youth-led-design': 'Youth-Led Design',
    'youth-led-description': 'Created with input from young people, for young people. Friendly, empowering, and relevant to your digital life.',
    'privacy-first': 'Privacy First',
    'privacy-description': 'Your data stays on your device. No tracking, no accounts required. Learn safely and privately.',
    'real-skills': 'Real Skills',
    'real-skills-description': 'Practical knowledge you can use immediately. Earn certificates and build confidence in your digital abilities.',
    'ready-to-become-defender': 'Ready to Become a Digital Defender?',
    'join-thousands': 'Join thousands of young people who have already leveled up their digital literacy skills. Your journey starts now.',
    'begin-training': 'Begin Your Training',
    certificate: 'Certificate',
  },
  ar: {
    home: 'الرئيسية',
    about: 'حول',
    videos: 'الفيديوهات',
    missions: 'المهام',
    'mission-control': 'مركز التحكم بالمهام',
    progress: 'التقدم',
    settings: 'الإعدادات',
    'choose-mission-level-up': 'اختر مهمتك. ارفع مستوى حياتك الرقمية.',
    'hero-description': 'تعلم مهارات محو الأمية الرقمية الأساسية من خلال الألعاب التفاعلية. أتقن عادات وقت الشاشة الصحية وكن خبيرًا في اكتشاف عمليات الاحتيال عبر الإنترنت، واكتشاف المحتوى الذي تم إنشاؤه بواسطة الذكاء الاصطناعي.',
    'start-your-mission': 'ابدأ مهمتك',
    'learn-more': 'تعلم المزيد',
    'choose-learning-path': 'اختر مسار التعلم الخاص بك',
    'mindfog-mission': 'مهمة ضباب العقل',
    'mindfog-tagline': 'وازن وقت الشاشة، احمِ مزاجك',
    'mindfog-description': 'تعلم كيفية إنشاء عادات رقمية صحية، وإدارة وقت الشاشة بفعالية، وحماية صحتك العقلية من الإرهاق الرقمي.',
    '5-7-minutes': '5-7 دقائق',
    'focus-champion': 'بطل التركيز',
    'start-mission': 'ابدأ المهمة',
    'phisher-hunt': 'صيد المحتالين',
    'phisher-tagline': 'اكتشف عمليات الاحتيال قبل أن تصطادك',
    'phisher-description': 'كن خبيرًا في اكتشاف عمليات الاحتيال. تعلم كيفية تحديد رسائل البريد الإلكتروني التصيدية والمواقع الإلكترونية المزيفة وتكتيكات الهندسة الاجتماعية.',
    'scam-spotter': 'كاشف الاحتيال',
    'ai-truth-hunter': 'صياد حقيقة الذكاء الاصطناعي',
    'ai-tagline': 'اكتشف تزييف الذكاء الاصطناعي والمعلومات المضللة',
    'ai-description': 'أتقن فن اكتشاف الصور التي تم إنشاؤها بواسطة الذكاء الاصطناعي، والتزييف العميق، والأخبار المزيفة. كن محققًا رقميًا للحقيقة.',
    '6-8-minutes': '6-8 دقائق',
    'truth-detective': 'محقق الحقيقة',
    'why-digital-defenders': 'لماذا المدافعون الرقميون؟',
    'youth-led-design': 'تصميم بقيادة الشباب',
    'youth-led-description': 'تم إنشاؤه بمساهمة من الشباب، للشباب. ودود، تمكيني، وذو صلة بحياتك الرقمية.',
    'privacy-first': 'الخصوصية أولاً',
    'privacy-description': 'تبقى بياناتك على جهازك. لا تتبع، لا يلزم وجود حسابات. تعلم بأمان وخصوصية.',
    'real-skills': 'مهارات حقيقية',
    'real-skills-description': 'معرفة عملية يمكنك استخدامها على الفور. احصل على شهادات وابنِ الثقة في قدراتك الرقمية.',
    'ready-to-become-defender': 'هل أنت مستعد لتصبح مدافعًا رقميًا؟',
    'join-thousands': 'انضم إلى الآلاف من الشباب الذين قاموا بالفعل برفع مستوى مهاراتهم في محو الأمية الرقمية. رحلتك تبدأ الآن.',
    'begin-training': 'ابدأ تدريبك',
    certificate: 'الشهادة',
  },
  zh: {
      home: '首页',
      about: '关于',
      videos: '视频',
      missions: '任务',
      'mission-control': '任务控制',
      progress: '进度',
      settings: '设置',
      'choose-mission-level-up': '选择你的任务。提升你的数字生活。',
      'hero-description': '通过互动游戏学习必要的数字素养技能。掌握健康的屏幕时间习惯，并成为发现网络诈骗和识别AI生成内容的专家。',
      'start-your-mission': '开始你的任务',
      'learn-more': '了解更多',
      'choose-learning-path': '选择你的学习路径',
      'mindfog-mission': '迷雾任务',
      'mindfog-tagline': '平衡屏幕时间，保护你的情绪',
      'mindfog-description': '学习养成健康的数字习惯，有效管理屏幕时间，并保护你的心理健康免受数字过载的影响。',
      '5-7-minutes': '5-7分钟',
      'focus-champion': '专注冠军',
      'start-mission': '开始任务',
      'phisher-hunt': '钓鱼狩猎',
      'phisher-tagline': '在诈骗抓住你之前发现它们',
      'phisher-description': '成为诈骗检测专家。学习识别网络钓鱼邮件、虚假网站和社交工程策略。',
      'scam-spotter': '诈骗侦察兵',
      'ai-truth-hunter': 'AI真相猎人',
      'ai-tagline': '发现AI假冒和错误信息',
      'ai-description': '掌握识别AI生成图像、深度伪造和假新闻的艺术。成为数字真相侦探。',
      '6-8-minutes': '6-8分钟',
      'truth-detective': '真相侦探',
      'why-digital-defenders': '为什么选择数字卫士？',
      'youth-led-design': '青年主导设计',
      'youth-led-description': '由年轻人输入，为年轻人创造。友好、赋权，并与你的数字生活相关。',
      'privacy-first': '隐私优先',
      'privacy-description': '你的数据保留在你的设备上。没有跟踪，无需账户。安全私密地学习。',
      'real-skills': '真实技能',
      'real-skills-description': '你可以立即使用的实用知识。获得证书，增强你的数字能力信心。',
      'ready-to-become-defender': '准备好成为数字卫士了吗？',
      'join-thousands': '加入成千上万已经提升数字素养技能的年轻人。你的旅程现在开始。',
      'begin-training': '开始你的训练',
    certificate: '证书',
    },
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    videos: 'Videos',
    missions: 'Misiones',
    'mission-control': 'Control de Misión',
    progress: 'Progreso',
    settings: 'Configuración',
    'choose-mission-level-up': 'Elige tu misión. Mejora tu vida digital.',
    'hero-description': 'Aprende habilidades esenciales de alfabetización digital a través de juegos interactivos. Domina hábitos saludables de tiempo de pantalla y conviértete en un experto en detectar estafas en línea y contenido generado por IA.',
    'start-your-mission': 'Comienza tu misión',
    'learn-more': 'Aprende más',
    'choose-learning-path': 'Elige tu ruta de aprendizaje',
    'mindfog-mission': 'Misión Niebla Mental',
    'mindfog-tagline': 'Equilibra el tiempo de pantalla, protege tu estado de ánimo',
    'mindfog-description': 'Aprende a crear hábitos digitales saludables, gestionar el tiempo de pantalla de forma eficaz y proteger tu bienestar mental del agobio digital.',
    '5-7-minutes': '5-7 minutos',
    'focus-champion': 'Campeón de Enfoque',
    'start-mission': 'Comenzar Misión',
    'phisher-hunt': 'Caza de Phishers',
    'phisher-tagline': 'Detecta estafas antes de que te atrapen',
    'phisher-description': 'Conviértete en un experto en detección de estafas. Aprende a identificar correos electrónicos de phishing, sitios web falsos y tácticas de ingeniería social.',
    'scam-spotter': 'Detector de Estafas',
    'ai-truth-hunter': 'Cazador de la Verdad de la IA',
    'ai-tagline': 'Detecta falsificaciones de IA y desinformación',
    'ai-description': 'Domina el arte de detectar imágenes generadas por IA, deepfakes y noticias falsas. Conviértete en un detective de la verdad digital.',
    '6-8-minutes': '6-8 minutos',
    'truth-detective': 'Detective de la Verdad',
    'why-digital-defenders': '¿Por qué Digital Defenders?',
    'youth-led-design': 'Diseño Liderado por Jóvenes',
    'youth-led-description': 'Creado con la participación de jóvenes, para jóvenes. Amigable, empoderador y relevante para tu vida digital.',
    'privacy-first': 'Privacidad Primero',
    'privacy-description': 'Tus datos permanecen en tu dispositivo. Sin seguimiento, no se requieren cuentas. Aprende de forma segura y privada.',
    'real-skills': 'Habilidades Reales',
    'real-skills-description': 'Conocimientos prácticos que puedes usar de inmediato. Obtén certificados y desarrolla confianza en tus habilidades digitales.',
    'ready-to-become-defender': '¿Listo para convertirte en un Defensor Digital?',
    'join-thousands': 'Únete a miles de jóvenes que ya han mejorado sus habilidades de alfabetización digital. Tu viaje comienza ahora.',
    'begin-training': 'Comienza tu entrenamiento',
    certificate: 'Certificado',
  },
  hi: {
    home: 'होम',
    about: 'बारे में',
    videos: 'वीडियो',
    missions: 'मिशन',
    'mission-control': 'मिशन नियंत्रण',
    progress: 'प्रगति',
    settings: 'सेटिंग्स',
    'choose-mission-level-up': 'अपना मिशन चुनें। अपनी डिजिटल जीवन को बेहतर बनाएं।',
    'hero-description': 'इंटरैक्टिव गेम्स के माध्यम से आवश्यक डिजिटल साक्षरता कौशल सीखें। स्वस्थ स्क्रीन टाइम की आदतों में महारत हासिल करें और ऑनलाइन घोटालों को पहचानने और एआई-जनित सामग्री का पता लगाने में विशेषज्ञ बनें।',
    'start-your-mission': 'अपना मिशन शुरू करें',
    'learn-more': 'और जानें',
    'choose-learning-path': 'अपनी सीखने की राह चुनें',
    'mindfog-mission': 'माइंडफॉग मिशन',
    'mindfog-tagline': 'स्क्रीन टाइम को संतुलित करें, अपने मूड की रक्षा करें',
    'mindfog-description': 'स्वस्थ डिजिटल आदतें बनाना सीखें, स्क्रीन टाइम को प्रभावी ढंग से प्रबंधित करें, और डिजिटल ओवरवेलम से अपनी मानसिक भलाई की रक्षा करें।',
    '5-7-minutes': '5-7 मिनट',
    'focus-champion': 'फोकस चैंपियन',
    'start-mission': 'मिशन शुरू करें',
    'phisher-hunt': 'फिशर हंट',
    'phisher-tagline': 'घोटालों को पकड़ने से पहले पहचानें',
    'phisher-description': 'घोटाला पहचान विशेषज्ञ बनें। फ़िशिंग ईमेल, नकली वेबसाइटों और सोशल इंजीनियरिंग युक्तियों की पहचान करना सीखें।',
    'scam-spotter': 'घोटाला पहचानकर्ता',
    'ai-truth-hunter': 'एआई ट्रुथ हंटर',
    'ai-tagline': 'एआई नकली और गलत सूचना का पता लगाएं',
    'ai-description': 'एआई-जनित छवियों, डीपफेक और नकली समाचारों का पता लगाने की कला में महारत हासिल करें। एक डिजिटल सत्य जासूस बनें।',
    certificate: 'प्रमाणपत्र',
    '6-8-minutes': '6-8 मिनट',
    'truth-detective': 'सत्य जासूस',
    'why-digital-defenders': 'डिजिटल डिफेंडर्स क्यों?',
    'youth-led-design': 'युवा-नेतृत्व वाला डिज़ाइन',
    'youth-led-description': 'युवा लोगों के इनपुट के साथ, युवा लोगों के लिए बनाया गया। दोस्ताना, सशक्त और आपके डिजिटल जीवन के लिए प्रासंगिक।',
    'privacy-first': 'गोपनीयता पहले',
    'privacy-description': 'आपका डेटा आपके डिवाइस पर रहता है। कोई ट्रैकिंग नहीं, कोई खाता आवश्यक नहीं। सुरक्षित और निजी रूप से सीखें।',
    'real-skills': 'वास्तविक कौशल',
    'real-skills-description': 'व्यावहारिक ज्ञान जिसका आप तुरंत उपयोग कर सकते हैं। प्रमाण पत्र अर्जित करें और अपनी डिजिटल क्षमताओं में आत्मविश्वास बढ़ाएं।',
    'ready-to-become-defender': 'डिजिटल डिफेंडर बनने के लिए तैयार हैं?',
    'join-thousands': 'हजारों युवाओं से जुड़ें जिन्होंने पहले ही अपनी डिजिटल साक्षरता कौशल को उन्नत कर लिया है। आपकी यात्रा अब शुरू होती है।',
    'begin-training': 'अपना प्रशिक्षण शुरू करें',
  },
  ne: {
    home: 'गृहपृष्ठ',
    about: 'बारेमा',
    videos: 'भिडियोहरू',
    missions: 'मिसनहरू',
    'mission-control': 'मिसन नियन्त्रण',
    progress: 'प्रगति',
    settings: 'सेटिङहरू',
    'choose-mission-level-up': 'आफ्नो मिशन छान्नुहोस्। आफ्नो डिजिटल जीवनलाई अगाडि बढाउनुहोस्।',
    'hero-description': 'अन्तरक्रियात्मक खेलहरू मार्फत आवश्यक डिजिटल साक्षरता सीपहरू सिक्नुहोस्। स्वस्थ स्क्रिन समय बानीहरूमा निपुण हुनुहोस् र अनलाइन घोटालाहरू पत्ता लगाउन र एआई-उत्पन्न सामग्री पत्ता लगाउनमा विशेषज्ञ बन्नुहोस्।',
    'start-your-mission': 'आफ्नो मिशन सुरु गर्नुहोस्',
    'learn-more': 'थप जान्नुहोस्',
    'choose-learning-path': 'आफ्नो सिकाई मार्ग छान्नुहोस्',
    'mindfog-mission': 'माइंडफग मिशन',
    'mindfog-tagline': 'स्क्रिन समय सन्तुलन गर्नुहोस्, आफ्नो मुडको रक्षा गर्नुहोस्',
    'mindfog-description': 'स्वस्थ डिजिटल बानीहरू सिर्जना गर्न, स्क्रिन समयलाई प्रभावकारी रूपमा व्यवस्थापन गर्न, र डिजिटल अत्यधिकताबाट आफ्नो मानसिक स्वास्थ्यको रक्षा गर्न सिक्नुहोस्।',
    '5-7-minutes': '५-७ मिनेट',
    'focus-champion': 'फोकस च्याम्पियन',
    'start-mission': 'मिशन सुरु गर्नुहोस्',
    'phisher-hunt': 'फिशर हन्ट',
    'phisher-tagline': 'घोटालाहरूले तपाईंलाई समात्नु अघि पत्ता लगाउनुहोस्',
    'phisher-description': 'घोटाला पत्ता लगाउने विशेषज्ञ बन्नुहोस्। फिसिङ इमेलहरू, नक्कली वेबसाइटहरू, र सामाजिक इन्जिनियरिङ रणनीतिहरू पहिचान गर्न सिक्नुहोस्।',
    'scam-spotter': 'घोटाला पत्ता लगाउने',
    'ai-truth-hunter': 'एआई सत्य शिकारी',
    'ai-tagline': 'एआई नक्कली र गलत जानकारी पत्ता लगाउनुहोस्',
    'ai-description': 'एआई-उत्पन्न छविहरू, डीपफेकहरू, र नक्कली समाचारहरू पत्ता लगाउने कलामा निपुण हुनुहोस्। एक डिजिटल सत्य जासूस बन्नुहोस्।',
    '6-8-minutes': '६-८ मिनेट',
    'truth-detective': 'सत्य जासूस',
    'why-digital-defenders': 'किन डिजिटल डिफेन्डर्स?',
    'youth-led-design': 'युवा-नेतृत्व डिजाइन',
    'youth-led-description': 'युवाहरूको इनपुटको साथ, युवाहरूका लागि सिर्जना गरिएको। मैत्रीपूर्ण, सशक्तिकरण, र तपाईंको डिजिटल जीवनसँग सम्बन्धित।',
    'privacy-first': 'गोपनीयता पहिले',
    'privacy-description': 'तपाईंको डाटा तपाईंको उपकरणमा रहन्छ। कुनै ट्र्याकिङ छैन, कुनै खाता आवश्यक छैन। सुरक्षित र निजी रूपमा सिक्नुहोस्।',
    'real-skills': 'वास्तविक सीपहरू',
    'real-skills-description': 'व्यावहारिक ज्ञान जुन तपाईं तुरुन्तै प्रयोग गर्न सक्नुहुन्छ। प्रमाणपत्रहरू कमाउनुहोस् र आफ्नो डिजिटल क्षमताहरूमा आत्मविश्वास निर्माण गर्नुहोस्।',
    'ready-to-become-defender': 'डिजिटल डिफेन्डर बन्न तयार हुनुहुन्छ?',
    'join-thousands': 'हजारौं युवाहरूसँग सामेल हुनुहोस् जसले पहिले नै आफ्नो डिजिटल साक्षरता सीपहरू बढाएका छन्। तपाईंको यात्रा अब सुरु हुन्छ।',
    'begin-training': 'आफ्नो प्रशिक्षण सुरु गर्नुहोस्',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<string>('en'); // Default to English

  useEffect(() => {
    // Initialize language from localStorage or default to 'en'
    const storedLang = localStorage.getItem('selectedLanguage');
    if (storedLang && translations[storedLang]) {
      setLanguageState(storedLang);
    } else {
      setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};