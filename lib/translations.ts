export const locales = ["pl", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "pl"

export const translations = {
  pl: {
    // Navigation
    nav: {
      home: "HOME",
      portfolio: "PORTFOLIO",
      info: "INFO",
      blog: "BLOG",
      contact: "KONTAKT",
    },
    // Hero
    hero: {
      tagline1: "W\u00A0świecie",
      tagline1Italic: "cyfrowego hałasu,",
      tagline2: "bądź",
      tagline2Signal: "SYGNAŁEM",
      tagline2Italic: "który zmienia zasady.",
      description: "Wideo marketing dla\u00A0firm i\u00A0marek osobistych | Automatyzuję procesy i\u00A0zwiększam sprzedaż",
      cta: "Skontaktuj się",
      portfolio: "Portfolio",
      scroll: "Scroll",
    },
    // Elevator / About
    elevator: {
      sectionLabel: "AKT II — O\u00A0MNIE",
      floor1: {
        title: "PASJA",
        subtitle: "Gdzie wszystko się zaczęło",
        description:
          "Kamera w\u00A0dłoni od\u00A015 roku życia. Każdy kadr to\u00A0historia, każda sekunda to\u00A0emocja zamknięta w\u00A0obrazie.",
      },
      floor2: {
        title: "ROZWÓJ",
        subtitle: "Nauka przez działanie",
        description: "50+ projektów. Setki godzin nagrań. Tysiące zmontowanych klatek. Za\u00A0każdym razem coś nowego.",
      },
      floor3: {
        title: "WIZJA",
        subtitle: "Przyszłość marketingu",
        description: "AI + Wideo + Automatyzacja. Połączenie, które zmienia zasady gry i\u00A0przekuwa trendy w\u00A0zysk.",
      },
    },
    // One Day Pack
    oneDayPack: {
      title: "ONE DAY PACK",
      subtitle: "Pełna produkcja w\u00A0jeden dzień",
      description:
        "Nagrywamy, montujemy, dostarczamy. Profesjonalne materiały wideo dla\u00A0Twojej marki bez\u00A0tygodni oczekiwania.",
      cta: "Sprawdź szczegóły",
      features: {
        recording: "Nagranie",
        editing: "Montaż",
        delivery: "Dostawa 48h",
      },
    },
    // Podcast Katowice
    podcast: {
      sectionLabel: "STUDIO",
      title: "PODCAST",
      titleAccent: "KATOWICE",
      subtitle: "Profesjonalne studio nagrań",
      description: "Twórz treści audio i\u00A0wideo na\u00A0najwyższym poziomie. Nowoczesne studio w\u00A0centrum Katowic.",
      cta: "Zarezerwuj termin",
      features: {
        audio: "Nagrania audio",
        video: "Produkcja wideo",
        live: "Transmisje live",
      },
    },
    // Maszyna / Stats
    maszyna: {
      sectionLabel: "WYNIKI",
      title: "MASZYNA",
      titleAccent: "MARKETINGOWA",
      subtitle: "Liczby mówią same za\u00A0siebie",
      stats: {
        revenue: "+300 tyś. złotych",
        revenueLabel: "Przychód",
        revenueDesc: "dodatkowego przychodu w\u00A03 miesiące działań",
        revenueIndustry: "Branża fitness",
        leads: "+104",
        leadsLabel: "Hot Leads",
        leadsDesc: "na\u00A0usługę transportu premium osób VIP w\u00A0jednym miesiącu",
        reach: "+4,3 mln",
        reachLabel: "zasięgu organicznego",
        reachDesc: "wygenerowanego w\u00A0social mediach. Regularnie 1,5 mln po\u00A012 miesiącach",
        months: "+12",
        monthsLabel: "Miesięcy",
        monthsDesc: "średni czas współpracy z\u00A0klientami. Długofalowe partnerstwa",
      },
      testimonials: {
        title: "Co mówią klienci",
      },
    },
    // Contact
    contact: {
      sectionLabel: "KONTAKT",
      title: "Porozmawiajmy",
      subtitle: "o\u00A0Twoim projekcie",
      description: "Napisz lub zadzwoń. Odpowiadam w\u00A0ciągu 24 godzin.",
      form: {
        name: "Imię i\u00A0nazwisko",
        email: "Email",
        message: "Wiadomość",
        send: "Wyślij wiadomość",
      },
    },
    // Footer
    footer: {
      services: "Usługi",
      siteMap: "Mapa strony",
      socialMedia: "Social Media",
      newsletter: "Newsletter",
      emailPlaceholder: "Twój email",
      copyright: "Wszelkie prawa zastrzeżone.",
      privacy: "Polityka prywatności",
      terms: "Regulamin",
      servicesList: {
        videoMarketing: "Wideo Marketing",
        oneDayPack: "One Day Pack",
        podcastStudio: "Studio Podcastowe",
        aiAutomation: "Automatyzacja AI",
        consultations: "Konsultacje",
      },
      siteMapList: {
        home: "Strona główna",
        portfolio: "Portfolio",
        about: "O\u00A0mnie",
        blog: "Blog",
        contact: "Kontakt",
      },
    },
    // Common
    common: {
      learnMore: "Dowiedz się więcej",
      seeMore: "Zobacz więcej",
      back: "Powrót",
      loading: "Ładowanie...",
    },
  },
  en: {
    // Navigation
    nav: {
      home: "HOME",
      portfolio: "PORTFOLIO",
      info: "INFO",
      blog: "BLOG",
      contact: "CONTACT",
    },
    // Hero
    hero: {
      tagline1: "In the world of",
      tagline1Italic: "digital noise,",
      tagline2: "be the",
      tagline2Signal: "SIGNAL",
      tagline2Italic: "that changes the rules.",
      description: "Video marketing for companies and personal brands | I automate processes & boost sales",
      cta: "Get in touch",
      portfolio: "Portfolio",
      scroll: "Scroll",
    },
    // Elevator / About
    elevator: {
      sectionLabel: "ACT II — ABOUT ME",
      floor1: {
        title: "PASSION",
        subtitle: "Where it all began",
        description: "Camera in hand since age 15. Every frame is a story, every second an emotion captured in motion.",
      },
      floor2: {
        title: "GROWTH",
        subtitle: "Learning by doing",
        description:
          "50+ projects. Hundreds of hours of footage. Thousands of edited frames. Something new every time.",
      },
      floor3: {
        title: "VISION",
        subtitle: "The future of marketing",
        description: "AI + Video + Automation. A combination that changes the game and turns trends into profit.",
      },
    },
    // One Day Pack
    oneDayPack: {
      title: "ONE DAY PACK",
      subtitle: "Full production in one day",
      description: "We record, edit, deliver. Professional video content for your brand without weeks of waiting.",
      cta: "See details",
      features: {
        recording: "Recording",
        editing: "Editing",
        delivery: "48h Delivery",
      },
    },
    // Podcast Katowice
    podcast: {
      sectionLabel: "STUDIO",
      title: "PODCAST",
      titleAccent: "KATOWICE",
      subtitle: "Professional recording studio",
      description: "Create top-tier audio and video content. Modern studio in the heart of Katowice.",
      cta: "Book a session",
      features: {
        audio: "Audio recording",
        video: "Video production",
        live: "Live streaming",
      },
    },
    // Maszyna / Stats
    maszyna: {
      sectionLabel: "RESULTS",
      title: "MARKETING",
      titleAccent: "MACHINE",
      subtitle: "Numbers speak for themselves",
      stats: {
        revenue: "+300K PLN",
        revenueLabel: "Revenue",
        revenueDesc: "additional revenue in 3 months of activities",
        revenueIndustry: "Fitness industry",
        leads: "+104",
        leadsLabel: "Hot Leads",
        leadsDesc: "for premium VIP transport service in one month",
        reach: "+4.3M",
        reachLabel: "organic reach",
        reachDesc: "generated on social media. Regularly 1.5M after 12 months",
        months: "+12",
        monthsLabel: "Months",
        monthsDesc: "average client collaboration time. Long-term partnerships",
      },
      testimonials: {
        title: "What clients say",
      },
    },
    // Contact
    contact: {
      sectionLabel: "CONTACT",
      title: "Let's talk",
      subtitle: "about your project",
      description: "Write or call. I respond within 24 hours.",
      form: {
        name: "Full name",
        email: "Email",
        message: "Message",
        send: "Send message",
      },
    },
    // Footer
    footer: {
      services: "Services",
      siteMap: "Site Map",
      socialMedia: "Social Media",
      newsletter: "Newsletter",
      emailPlaceholder: "Your email",
      copyright: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      servicesList: {
        videoMarketing: "Video Marketing",
        oneDayPack: "One Day Pack",
        podcastStudio: "Podcast Studio",
        aiAutomation: "AI Automation",
        consultations: "Consultations",
      },
      siteMapList: {
        home: "Home",
        portfolio: "Portfolio",
        about: "About",
        blog: "Blog",
        contact: "Contact",
      },
    },
    // Common
    common: {
      learnMore: "Learn more",
      seeMore: "See more",
      back: "Back",
      loading: "Loading...",
    },
  },
} as const

export type TranslationKey = keyof typeof translations.pl

export function getTranslation(locale: Locale) {
  return translations[locale] || translations[defaultLocale]
}
