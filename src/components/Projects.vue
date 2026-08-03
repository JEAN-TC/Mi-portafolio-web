<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from '@lucide/vue'
import { t } from '../utils/i18n'
import administradorTareasImg from '../assets/projects/administrador-tareas.jpg'
import webVulImg from '../assets/projects/web-vul.jpg'
import wazuhImg from '../assets/projects/wazuh.jpg'
import fimMonitorImg from '../assets/projects/fim-monitor.png'

const projects = computed(() => {
  const list = t('projects.list')

  return [
    {
      ...list[0],
      tech: ['React', 'TypeScript', 'Python', 'SQLite'],
      href: 'https://github.com/JEAN-TC/monitoreo-de-integridad-de-archivos',
      image: fimMonitorImg,
      action: t('projects.repository'),
      isReference: false
    },
    {
      ...list[1],
      tech: ['Vue 3', 'Node.js', 'JavaScript', 'CSS'],
      href: 'https://github.com/JEAN-TC/administrador-de-tareas',
      image: administradorTareasImg,
      action: t('projects.repository'),
      isReference: false
    },
    {
      ...list[2],
      tech: ['JavaScript', 'Node.js', 'Express', 'HTML5'],
      href: 'https://github.com/JEAN-TC/web-vul',
      image: webVulImg,
      action: t('projects.repository'),
      isReference: false
    },
    {
      ...list[3],
      tech: ['Wazuh', 'Docker', 'Arch Linux', 'SIEM/XDR', 'OpenSearch'],
      href: 'https://github.com/wazuh/wazuh-docker',
      image: wazuhImg,
      action: t('projects.reference'),
      isReference: true
    }
  ]
})

</script>

<template>
  <section id="proyectos" class="projects-section">
    <div class="projects-shell">
      <header class="projects-heading">
        <h2>{{ t('projects.title1') }} <span>{{ t('projects.title2') }}</span></h2>
        <p>{{ t('projects.subtitle') }}</p>
      </header>

      <div class="projects-grid">
        <article
          v-for="project in projects"
          :key="project.title"
          class="project-card"
        >
          <div class="project-media">
            <img
              :src="project.image"
              :alt="'Vista del proyecto ' + project.title"
              loading="lazy"
              decoding="async"
            />
            <div class="project-focus">
              <span aria-hidden="true"></span>
              {{ project.focus }}
            </div>
          </div>

          <div class="project-content">
            <div class="project-title-row">
              <h3>{{ project.title }}</h3>
              <span v-if="project.isReference" class="project-reference">
                {{ t('projects.lab') }}
              </span>
            </div>

            <p class="project-description">{{ project.desc }}</p>

            <p class="project-proof">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="m5 12 4 4L19 6" />
              </svg>
              <span>{{ project.proof }}</span>
            </p>

            <ul class="project-tech" :aria-label="t('projects.stackLabel')">
              <li v-for="technology in project.tech" :key="technology">
                {{ technology }}
              </li>
            </ul>

            <a
              :href="project.href"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link"
            >
              <span>{{ project.action }}</span>
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-section {
  position: relative;
  overflow: hidden;
  padding: 7rem 1.5rem;
  background: #030305;
}

.projects-shell {
  position: relative;
  z-index: 1;
  width: min(100%, 72rem);
  margin: 0 auto;
}

.projects-heading {
  max-width: 46rem;
  margin-bottom: 3.5rem;
}

.projects-heading h2 {
  margin: 0 0 1rem;
  color: #f7f7f8;
  font-size: clamp(2.25rem, 5vw, 3.35rem);
  font-weight: 750;
  line-height: 1.02;
  letter-spacing: -0.035em;
}

.projects-heading h2 span {
  color: #ff2d2d;
}

.projects-heading p {
  max-width: 42rem;
  color: #a1a1aa;
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  line-height: 1.75;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.project-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #232329;
  border-radius: 16px;
  background: #09090c;
  transition:
    transform 280ms ease,
    border-color 280ms ease;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 45, 45, 0.55);
}

.project-media {
  position: relative;
  z-index: 1;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 45, 45, 0.22);
  background: #101014;
}

.project-media::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: inset 0 -52px 48px -42px rgba(3, 3, 5, 0.95);
  pointer-events: none;
}

.project-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 620ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 300ms ease;
}

.project-card:hover .project-media img {
  transform: scale(1.025);
  filter: brightness(1.05);
}

.project-focus {
  position: absolute;
  z-index: 2;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  max-width: calc(100% - 2rem);
  padding: 0.45rem 0.7rem;
  border: 1px solid rgba(255, 45, 45, 0.35);
  border-radius: 999px;
  background: rgba(5, 5, 7, 0.9);
  color: #e4e4e7;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.67rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.project-focus span {
  width: 0.42rem;
  height: 0.42rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #ff2d2d;
  box-shadow: 0 0 0 4px rgba(255, 45, 45, 0.12);
}

.project-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 20rem;
  flex-direction: column;
  padding: 1.75rem;
}

.project-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.project-title-row h3 {
  min-width: 0;
  margin: 0;
  color: #f4f4f5;
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 720;
  line-height: 1.24;
  letter-spacing: -0.025em;
}

.project-reference {
  flex: 0 0 auto;
  padding: 0.25rem 0.45rem;
  border: 1px solid #303038;
  border-radius: 6px;
  color: #8f8f99;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.project-description {
  margin: 0.85rem 0 1.15rem;
  color: #a1a1aa;
  font-size: 0.92rem;
  line-height: 1.72;
}

.project-proof {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin: 0 0 1.35rem;
  color: #d4d4d8;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.5;
}

.project-proof svg {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  margin-top: 0.12rem;
  stroke: #ff3b3b;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: auto 0 1.35rem;
  padding: 0;
  list-style: none;
}

.project-tech li {
  padding: 0.38rem 0.58rem;
  border: 1px solid #29292f;
  border-radius: 7px;
  background: #111116;
  color: #b5b5bd;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.66rem;
  line-height: 1;
}

.project-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 2.85rem;
  padding-top: 1rem;
  border-top: 1px solid #24242a;
  color: #f4f4f5;
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 180ms ease;
}

.project-link svg {
  width: 1rem;
  height: 1rem;
  transition: transform 180ms ease;
}

.project-link:hover {
  color: #ff3b3b;
}

.project-link:hover svg {
  transform: translate(2px, -2px);
}

.project-link:focus-visible {
  outline: 2px solid #ff3b3b;
  outline-offset: 5px;
  border-radius: 3px;
}

@media (max-width: 760px) {
  .projects-section {
    padding: 5.5rem 1.1rem;
  }

  .projects-heading {
    margin-bottom: 2.5rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-content {
    min-height: 0;
    padding: 1.35rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-media img,
  .project-link svg {
    transition: none;
  }

  .project-card:hover,
  .project-card:hover .project-media img,
  .project-link:hover svg {
    transform: none;
  }
}
</style>
