import { reactive } from 'vue'

const savedLang = localStorage.getItem('site_lang') as 'es' | 'en'
const initialLang = savedLang || 'es'

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
        'practicante de ciberseguridad.',
        'lector empedernido.',
        'rompedor de cosas para entenderlas.',
        'introvertido con ideas que explotan.',
      ],
      aboutLabel: "sobre mí",
      aboutText1: "Soy de los que leen hasta las 2am porque encontré algo interesante. Callado en los cuartos, ruidoso en las ideas.",
      aboutText2: "Siempre hay algo nuevo por aprender",
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
      subtitle: "Selección de mis proyectos recientes más importantes con interfaces avanzadas e interactivas.",
      list: [
        {
          title: 'Monitor de Integridad de Archivos (FIM)',
          desc: 'Sistema de File Integrity Monitoring que detecta cambios no autorizados en archivos y los presenta en un dashboard web interactivo en tiempo real.'
        },
        {
          title: 'Administrador de Tareas',
          desc: 'Sistema completo de administración de tareas para usuarios. Permite crear, organizar y gestionar tareas con una interfaz moderna e intuitiva.'
        },
        {
          title: 'Web-Vul',
          desc: 'Proyecto de prácticas web enfocado en seguridad y vulnerabilidades. Incluye análisis de vulnerabilidades y técnicas de desarrollo seguro.'
        },
        {
          title: 'Wazuh SIEM/XDR',
          desc: 'Implementación all-in-one de Wazuh v4.14.6 usando contenedores Docker en un host Arch Linux. Centralización de eventos, análisis FIM, monitoreo de integridad, inventario activo y auditoría SCA.'
        }
      ],
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
      subtitle: "Credenciales y formación verificable, organizadas por plataforma emisora.",
      documents: "Documentos",
      explore: "Explorar Certificados",
      items: {
        coursera: {
          name: 'Coursera',
          desc: 'Cursos y certificados técnicos de ciberseguridad impartidos por Microsoft, Google, IBM y otras instituciones.'
        },
        fortinet: {
          name: 'Fortinet',
          desc: 'Acreditaciones oficiales en fundamentos y nivel asociado de ciberseguridad y redes.'
        },
        aws: {
          name: 'AWS',
          desc: 'Formación en fundamentos, arquitectura y operaciones en la nube de Amazon Web Services.'
        },
        hackthebox: {
          name: 'Hack The Box',
          desc: 'Laboratorios prácticos y progreso técnico en pentesting, sistemas y seguridad ofensiva.'
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
      subtitle: "Combino curiosidad ofensiva, monitoreo defensivo y desarrollo para construir soluciones más seguras y comprensibles.",
      list: [
        {
          title: 'Auditoría Web & Pentesting',
          desc: 'Práctica de análisis de vulnerabilidades y seguridad web en laboratorios controlados, utilizando OWASP Top 10 y herramientas especializadas.'
        },
        {
          title: 'Desarrollo SecDevOps',
          desc: 'Desarrollo de aplicaciones full-stack aplicando validación, control de acceso y buenas prácticas de seguridad desde el código.'
        },
        {
          title: 'Arquitectura Segura',
          desc: 'Laboratorios de Linux, redes, Docker y nube orientados a monitoreo, segmentación y control de accesos.'
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
      bio: "Estudiante de Ciberseguridad con proyectos prácticos en SOC, Linux, redes y desarrollo web seguro.",
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
        'cybersecurity practitioner.',
        'avid reader.',
        'breaker of things to understand them.',
        'introvert with explosive ideas.',
      ],
      aboutLabel: "about me",
      aboutText1: "I'm the kind of person who reads until 2am because I found something interesting. Quiet in rooms, loud in ideas.",
      aboutText2: "There's always something new to learn",
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
      subtitle: "A selection of my most important recent projects with advanced and interactive interfaces.",
      list: [
        {
          title: 'File Integrity Monitor (FIM)',
          desc: 'File Integrity Monitoring system that detects unauthorized changes to files and presents them in a real-time interactive web dashboard.'
        },
        {
          title: 'Task Manager',
          desc: 'Complete task management system for users. Allows creating, organizing, and managing tasks with a modern and intuitive interface.'
        },
        {
          title: 'Web-Vul',
          desc: 'Web practice project focused on security and vulnerabilities. Includes vulnerability analysis and secure development techniques.'
        },
        {
          title: 'Wazuh SIEM/XDR',
          desc: 'All-in-one implementation of Wazuh v4.14.6 using Docker containers on an Arch Linux host. Event centralization, FIM analysis, integrity monitoring, active inventory, and SCA auditing.'
        }
      ],
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
      subtitle: "Verifiable credentials and training, organized by issuing platform.",
      documents: "Documents",
      explore: "Explore Certificates",
      items: {
        coursera: {
          name: 'Coursera',
          desc: 'Cybersecurity courses and technical certificates delivered by Microsoft, Google, IBM, and other institutions.'
        },
        fortinet: {
          name: 'Fortinet',
          desc: 'Official accreditations in fundamentals and associate level of cybersecurity and networking.'
        },
        aws: {
          name: 'AWS',
          desc: 'Training in cloud fundamentals, architecture, and operations from Amazon Web Services.'
        },
        hackthebox: {
          name: 'Hack The Box',
          desc: 'Hands-on labs and technical progress in pentesting, systems, and offensive security.'
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
      subtitle: "I combine offensive curiosity, defensive monitoring, and development to build safer, easier-to-understand solutions.",
      list: [
        {
          title: 'Web Auditing & Pentesting',
          desc: 'Vulnerability analysis and web security practice in controlled labs using OWASP Top 10 and specialized tools.'
        },
        {
          title: 'SecDevOps Development',
          desc: 'Full-stack development applying validation, access control, and security practices from the source code.'
        },
        {
          title: 'Secure Architecture',
          desc: 'Linux, networking, Docker, and cloud labs focused on monitoring, segmentation, and access control.'
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
      bio: "Cybersecurity student building practical projects in SOC, Linux, networking, and secure web development.",
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
