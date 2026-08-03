import { reactive } from 'vue'

const savedLang = localStorage.getItem('site_lang') as 'es' | 'en'
const initialLang = savedLang || 'en'

export const i18nState = reactive({
  lang: initialLang,
  setLang(newLang: 'es' | 'en') {
    this.lang = newLang
    localStorage.setItem('site_lang', newLang)
    document.documentElement.lang = newLang
  }
})

// Configuración inicial del idioma en el HTML
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18nState.lang
}

export const dict: Record<'es' | 'en', any> = {
  es: {
    sidePanel: {
      title: "Centro de Comando",
      language: "Idioma",
      findMe: "Redes Externas",
      quote: `"El que deja de aprender deja de ser peligroso."`,
      quoteAuthor: "— Jean Piero",
      downloadCv: "Extraer CV",
      copyEmail: "Copiar Correo",
      emailCopied: "¡Copiado!",
      performanceMode: "Modo de Rendimiento",
      performanceOn: "Gráficos Reducidos",
      performanceOff: "Gráficos Máximos",
      sysStatus: "Estado del Sistema",
      statusSecure: "Conexión Segura",
      statusOnline: "Servidor Activo",
      quickAccess: "Acceso Rápido",
      openTerminal: "Iniciar Terminal"
    },
    hero: {
      hi: "Hola, soy",
      phrases: [
        'conecto seguridad, redes y desarrollo.',
        'aprendo construyendo y documentando.',
        'rompo sistemas en entornos seguros para entenderlos.',
        'convierto curiosidad técnica en proyectos reales.',
      ],
      aboutLabel: "sobre mí",
      aboutText1: "Me gusta seguir una pregunta hasta el fondo: leer, probar, equivocarme y dejar documentado lo que aprendí.",
      aboutText2: "La curiosidad se vuelve útil cuando termina en algo que funciona",
      rasgos: [
        { label: 'Investigar', desc: 'No me basta con que algo funcione. Necesito saber por qué funciona, y qué pasa si lo rompo.' },
        { label: 'Noche', desc: 'Funciono mejor de noche. El silencio ayuda a pensar sin interrupciones.' },
        { label: 'Romper para entender', desc: 'La mejor forma de aprender algo es desmontarlo por completo. Así entiendo desde adentro.' },
        { label: 'Rabbit holes', desc: 'Empiezo buscando una cosa y termino tres horas después entendiendo algo completamente diferente. Y está bien.' },
        { label: 'Introvertido', desc: 'Soy callado hasta que encuentro el tema correcto. Ahí ya no paro.' },
        { label: 'Aprender siempre', desc: 'El que deja de aprender deja de ser relevante. No me permito estancarme.' }
      ],
      mindsetLabel: "mentalidad",
      mindsetQuote1: "No diseño para el escenario perfecto,",
      mindsetQuote2: "forjo para la adversidad.",
      mindsetSub: "Anticipar la falla no es pesimismo, es preparación. Entender cómo se rompen los sistemas me ha enseñado que la verdadera fortaleza nace de reconocer nuestras propias vulnerabilidades.",
      notesLabel: "apuntes",
      viewAllNotes: "Ver todos los apuntes"
    },
    about: {
      profile: "01 — Perfil",
      studentOf: "Estudiante de",
      cyber: "Ciberseguridad",
      andDev: "y desarrollo.",
      roleCyber: "Ciberseguridad",
      roleDev: "Desarrollo Web",
      bio1: "Estudiante de Ciberseguridad. Me apasiona entender los sistemas y cómo funcionan — desde su arquitectura hasta sus límites. Trabajo con la convicción de que quien entiende el sistema, lo domina.",
      bio2: "Si algo me atrapa a las 2am, no lo suelto hasta entenderlo del todo.",
      yearsLabel: "Años",
      certsLabel: "Certs",
      curiosityLabel: "Curiosidad",
      interests: "Intereses",
      education: "Formación",
      inProgress: "En curso",
      completed: "Completado",
      intList: ['Ciberseguridad', 'Desarrollo web', 'Redes', 'CTF', 'Open Source', 'Linux']
    },
    projects: {
      label: "03. Portafolio",
      title1: "Trabajos",
      title2: "Destacados",
      subtitle: "Proyectos construidos y laboratorios documentados que muestran cómo pienso, implemento y verifico soluciones de seguridad y desarrollo.",
      list: [
        {
          title: 'Monitor de Integridad de Archivos (FIM)',
          focus: 'Seguridad defensiva',
          desc: 'Construí un monitor que detecta cambios no autorizados y los presenta en un panel web para revisar eventos sin perder contexto.',
          proof: 'Detección de cambios y visualización en tiempo real'
        },
        {
          title: 'Administrador de Tareas',
          focus: 'Aplicación full-stack',
          desc: 'Desarrollé una aplicación para crear, organizar y dar seguimiento a tareas, cuidando tanto el flujo del usuario como la estructura técnica.',
          proof: 'Flujo CRUD completo con interfaz responsive'
        },
        {
          title: 'Web-Vul',
          focus: 'Seguridad web',
          desc: 'Laboratorio web creado para practicar análisis de vulnerabilidades, entender su impacto y reforzar hábitos de desarrollo seguro.',
          proof: 'Escenarios controlados de análisis y mitigación'
        },
        {
          title: 'Wazuh SIEM/XDR',
          focus: 'Laboratorio SOC',
          desc: 'Laboratorio defensivo con Wazuh en Docker sobre Arch Linux para centralizar eventos y practicar monitoreo de integridad y auditoría de configuración.',
          proof: 'FIM, inventario activo y auditoría SCA'
        }
      ],
      lab: "Laboratorio",
      repository: "Ver repositorio",
      reference: "Ver base técnica",
      stackLabel: "Tecnologías utilizadas",
      liveDemo: "Demo en Vivo",
      code: "Código"
    },
    skills: {
      label: "02. Stack Técnico",
      title1: "Habilidades",
      title2: "Técnicas",
      security: "Ciberseguridad",
      networking: "Redes & Infraestructura",
      development: "Desarrollo",
      cloud: "Cloud & Unix"
    },
    certs: {
      label: "04. Educación",
      title1: "Colección de",
      title2: "Certificaciones",
      subtitle: "Acreditaciones oficiales organizadas por plataforma emisora.",
      documents: "Documentos",
      explore: "Explorar Certificados",
      items: {
        coursera: {
          name: 'Coursera',
          desc: 'Certificaciones técnicas de ciberseguridad e ingeniería avaladas por Microsoft, Google y universidades.'
        },
        fortinet: {
          name: 'Fortinet',
          desc: 'Acreditaciones oficiales en fundamentos y nivel asociado de ciberseguridad y redes.'
        },
        aws: {
          name: 'AWS',
          desc: 'Certificaciones de arquitectura y operaciones en la nube de Amazon Web Services.'
        },
        hackthebox: {
          name: 'Hack The Box',
          desc: 'Certificaciones avanzadas en pentesting, análisis forense y operaciones de red teaming.'
        },
        cwl: {
          name: 'CWL',
          desc: 'Certificaciones especializadas y técnicas de CWL.'
        },
        cisco: {
          name: 'Cisco',
          desc: 'Certificaciones de redes y ciberseguridad avaladas por Cisco Networking Academy.'
        },
        otros: {
          name: 'Otros Certificados',
          desc: 'Acreditaciones misceláneas, diplomas universitarios y constancias de participación.'
        }
      }
    },
    contact: {
      label: "05. Hablemos",
      title1: "Ponte en",
      title2: "Contacto",
      subtitle: "Conversemos sobre tu próximo proyecto o colaboración.",
      nameLabel: "Nombre",
      namePh: "Tu nombre completo",
      emailLabel: "Email",
      emailPh: "tu@email.com",
      msgLabel: "Mensaje",
      msgPh: "¿En qué te puedo ayudar?",
      send: "Enviar Mensaje",
      sending: "Enviando...",
      success: "¡Mensaje enviado! Te responderé lo antes posible.",
      errorDef: "Error inesperado. Inténtalo de nuevo.",
      errorConn: "No se pudo conectar con el servidor.",
      errorSend: "Error al enviar.",
      directStart: "¿Prefieres escribirme directo?",
      directMid: "Escríbeme directo a"
    },
    stats: {
      title: "Estadísticas de Laboratorios",
      pwned: "Sistemas Pwned",
      flags: "Banderas (Flags)",
      vulns: "Vulnerabilidades",
      audits: "Auditorías Limpias"
    },
    services: {
      label: "Lo que hago",
      title1: "Áreas de",
      title2: "Especialización",
      subtitle: "Combino la mentalidad ofensiva de un hacker con la capacidad constructiva de un desarrollador para crear soluciones inquebrantables.",
      list: [
        {
          title: 'Auditoría Web & Pentesting',
          desc: 'Análisis de vulnerabilidades, pruebas de penetración y reporte de fallos de seguridad en aplicaciones web utilizando OWASP Top 10 y herramientas especializadas.'
        },
        {
          title: 'Desarrollo SecDevOps',
          desc: 'Construcción de aplicaciones full-stack robustas integrando prácticas de seguridad desde el código fuente, previniendo inyecciones SQL, XSS y CSRF por defecto.'
        },
        {
          title: 'Arquitectura Segura',
          desc: 'Diseño e implementación de infraestructuras en la nube (AWS) y redes locales con configuraciones de firewalls, segmentación y control de accesos estrictos.'
        }
      ]
    },
    nav: {
      home: "Inicio",
      profile: "Perfil",
      skills: "Habilidades",
      certs: "Certificaciones",
      projects: "Proyectos",
      notes: "Apuntes",
      terminal: "Terminal",
      contact: "Contacto"
    },
    header: {
      online: "En línea",
      idle: "Ausente",
      dnd: "No molestar",
      offline: "Desconectado"
    },
    footer: {
      bio: "Security Engineer & Full Stack Developer apasionado por la ciberseguridad, el desarrollo web y el aprendizaje continuo.",
      navigation: "Navegación",
      contact: "Contacto",
      downloadCv: "Descargar CV",
      socials: "Redes",
      rights: "Todos los derechos reservados.",
      backToTop: "Volver arriba"
    }
  },
  en: {
    sidePanel: {
      title: "Command Center",
      language: "Language",
      findMe: "External Networks",
      quote: `"He who stops learning ceases to be dangerous."`,
      quoteAuthor: "— Jean Piero",
      downloadCv: "Extract Resume",
      copyEmail: "Copy Email",
      emailCopied: "Copied!",
      performanceMode: "Performance Mode",
      performanceOn: "Reduced Graphics",
      performanceOff: "Max Graphics",
      sysStatus: "System Status",
      statusSecure: "Secure Connection",
      statusOnline: "Server Online",
      quickAccess: "Quick Access",
      openTerminal: "Init Terminal"
    },
    hero: {
      hi: "Hi, I'm",
      phrases: [
        'I connect security, networks, and development.',
        'I learn by building and documenting.',
        'I break systems safely to understand them.',
        'I turn technical curiosity into real projects.',
      ],
      aboutLabel: "about me",
      aboutText1: "I like following a question all the way through: reading, testing, getting things wrong, and documenting what I learned.",
      aboutText2: "Curiosity becomes useful when it ends in something that works",
      rasgos: [
        { label: 'Investigate', desc: "It's not enough for something to work. I need to know why it works, and what happens if I break it." },
        { label: 'Night Owl', desc: 'I function better at night. Silence helps me think without interruptions.' },
        { label: 'Break to Understand', desc: 'The best way to learn something is to take it completely apart. That way I understand it from the inside out.' },
        { label: 'Rabbit holes', desc: 'I start looking for one thing and end up three hours later understanding something completely different. And that is fine.' },
        { label: 'Introvert', desc: "I'm quiet until I find the right topic. Then I don't stop." },
        { label: 'Always Learning', desc: "He who stops learning ceases to be relevant. I don't allow myself to stagnate." }
      ],
      mindsetLabel: "mindset",
      mindsetQuote1: "I do not design for the perfect scenario,",
      mindsetQuote2: "I forge for adversity.",
      mindsetSub: "Anticipating failure is not pessimism, it is preparation. Understanding how systems break has taught me that true strength comes from recognizing our own vulnerabilities.",
      notesLabel: "notes",
      viewAllNotes: "View all notes"
    },
    about: {
      profile: "01 — Profile",
      studentOf: "Student of",
      cyber: "Cybersecurity",
      andDev: "and development.",
      roleCyber: "Cybersecurity",
      roleDev: "Web Development",
      bio1: "Cybersecurity Student. I am passionate about understanding systems and how they work — from their architecture to their limits. I work with the conviction that whoever understands the system, masters it.",
      bio2: "If something catches my attention at 2am, I won't let it go until I completely understand it.",
      yearsLabel: "Years",
      certsLabel: "Certs",
      curiosityLabel: "Curiosity",
      interests: "Interests",
      education: "Education",
      inProgress: "In progress",
      completed: "Completed",
      intList: ['Cybersecurity', 'Web Dev', 'Networking', 'CTF', 'Open Source', 'Linux']
    },
    projects: {
      label: "03. Portfolio",
      title1: "Featured",
      title2: "Works",
      subtitle: "Built projects and documented labs that show how I think, implement, and verify security and development solutions.",
      list: [
        {
          title: 'File Integrity Monitor (FIM)',
          focus: 'Defensive security',
          desc: 'I built a monitor that detects unauthorized changes and presents them in a web dashboard so events can be reviewed without losing context.',
          proof: 'Change detection and real-time visualization'
        },
        {
          title: 'Task Manager',
          focus: 'Full-stack application',
          desc: 'I developed an application to create, organize, and track tasks while caring for both the user flow and the technical structure.',
          proof: 'Complete CRUD flow with a responsive interface'
        },
        {
          title: 'Web-Vul',
          focus: 'Web security',
          desc: 'A web lab created to practice vulnerability analysis, understand impact, and strengthen secure development habits.',
          proof: 'Controlled analysis and mitigation scenarios'
        },
        {
          title: 'Wazuh SIEM/XDR',
          focus: 'SOC laboratory',
          desc: 'A defensive Wazuh lab running in Docker on Arch Linux to centralize events and practice integrity monitoring and configuration auditing.',
          proof: 'FIM, active inventory, and SCA auditing'
        }
      ],
      lab: "Laboratory",
      repository: "View repository",
      reference: "View technical base",
      stackLabel: "Technologies used",
      liveDemo: "Live Demo",
      code: "Code"
    },
    skills: {
      label: "02. Tech Stack",
      title1: "Technical",
      title2: "Skills",
      security: "Cybersecurity",
      networking: "Networking & Infra",
      development: "Development",
      cloud: "Cloud & Unix"
    },
    certs: {
      label: "04. Education",
      title1: "Collection of",
      title2: "Certifications",
      subtitle: "Official accreditations organized by issuing platform.",
      documents: "Documents",
      explore: "Explore Certificates",
      items: {
        coursera: {
          name: 'Coursera',
          desc: 'Technical cybersecurity and engineering certifications backed by Microsoft, Google, and universities.'
        },
        fortinet: {
          name: 'Fortinet',
          desc: 'Official accreditations in fundamentals and associate level of cybersecurity and networking.'
        },
        aws: {
          name: 'AWS',
          desc: 'Cloud architecture and operations certifications from Amazon Web Services.'
        },
        hackthebox: {
          name: 'Hack The Box',
          desc: 'Advanced certifications in pentesting, forensics, and red teaming operations.'
        },
        cwl: {
          name: 'CWL',
          desc: 'Specialized and technical CWL certifications.'
        },
        cisco: {
          name: 'Cisco',
          desc: 'Networking and cybersecurity certifications backed by Cisco Networking Academy.'
        },
        otros: {
          name: 'Other Certificates',
          desc: 'Miscellaneous accreditations, university diplomas, and certificates of participation.'
        }
      }
    },
    contact: {
      label: "05. Let's Talk",
      title1: "Get in",
      title2: "Touch",
      subtitle: "Let's discuss your next project or collaboration.",
      nameLabel: "Name",
      namePh: "Your full name",
      emailLabel: "Email",
      emailPh: "you@email.com",
      msgLabel: "Message",
      msgPh: "How can I help you?",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! I'll get back to you as soon as possible.",
      errorDef: "Unexpected error. Please try again.",
      errorConn: "Could not connect to the server.",
      errorSend: "Error sending.",
      directStart: "Prefer to email me directly?",
      directMid: "Email me directly at"
    },
    stats: {
      title: "Laboratory Statistics",
      pwned: "Pwned Systems",
      flags: "Flags Captured",
      vulns: "Vulnerabilities",
      audits: "Clean Audits"
    },
    services: {
      label: "What I do",
      title1: "Areas of",
      title2: "Specialization",
      subtitle: "I combine the offensive mindset of a hacker with the constructive capability of a developer to build unbreakable solutions.",
      list: [
        {
          title: 'Web Auditing & Pentesting',
          desc: 'Vulnerability analysis, penetration testing, and security flaw reporting in web applications using OWASP Top 10 and specialized tools.'
        },
        {
          title: 'SecDevOps Development',
          desc: 'Building robust full-stack applications integrating security practices from the source code, preventing SQL injections, XSS, and CSRF by default.'
        },
        {
          title: 'Secure Architecture',
          desc: 'Design and implementation of cloud infrastructures (AWS) and local networks with firewall configurations, segmentation, and strict access control.'
        }
      ]
    },
    nav: {
      home: "Home",
      profile: "Profile",
      skills: "Skills",
      certs: "Certifications",
      projects: "Projects",
      notes: "Notes",
      terminal: "Terminal",
      contact: "Contact"
    },
    header: {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline"
    },
    footer: {
      bio: "Security Engineer & Full Stack Developer passionate about cybersecurity, web development, and continuous learning.",
      navigation: "Navigation",
      contact: "Contact",
      downloadCv: "Download CV",
      socials: "Socials",
      rights: "All rights reserved.",
      backToTop: "Back to top"
    }
  }
}

export function t(path: string): any {
  const keys = path.split('.')
  let current = dict[i18nState.lang]
  for (const k of keys) {
    if (current[k] === undefined) return path
    current = current[k]
  }
  return current
}
