<script setup lang="ts">
import { computed } from 'vue'
import { t } from '../utils/i18n'


const education = computed(() => [
  {
    degree: 'Ciberseguridad',
    institution: 'SENATI Independencia',
    period: '2023 – Presente',
    tag: t('about.inProgress'),
    active: true,
  },
  {
    degree: 'CCNA: Introduction to Networks',
    institution: 'Cisco Networking Academy',
    period: '2024',
    tag: t('about.completed'),
    active: false,
  },
  {
    degree: 'CyberOps Associate',
    institution: 'Cisco Networking Academy',
    period: '2025',
    tag: t('about.completed'),
    active: false,
  },
  {
    degree: 'Ethical Hacker',
    institution: 'Cisco Networking Academy',
    period: '2024',
    tag: t('about.completed'),
    active: false,
  },
])

const interests = computed(() => t('about.intList'))
</script>

<template>
  <section id="sobre-mi" class="ab-section">
    <div class="ab-container">

      <!-- ═══ IZQUIERDA ══════════════════════════ -->
      <div class="ab-left">

        <span class="ab-eyebrow">{{ t('about.profile') }}</span>

        <h2 class="ab-headline">
          {{ t('about.studentOf') }}<br/>
          <span class="ab-headline-red">{{ t('about.cyber') }}</span><br/>
          <span class="ab-headline-dim">{{ t('about.andDev') }}</span>
        </h2>

        <div class="ab-role-chips">
          <span class="ab-chip">{{ t('about.roleCyber') }}</span>
          <span class="ab-chip">{{ t('about.roleDev') }}</span>
        </div>

        <div class="ab-divider-sm"></div>

        <div class="ab-bio">
          <p>{{ t('about.bio1') }}</p>
          <p>{{ t('about.bio2') }}</p>
        </div>

        <div class="ab-stats-row">
          <div class="ab-stat">
            <span class="ab-stat-n">3+</span>
            <span class="ab-stat-l">{{ t('about.yearsLabel') }}</span>
          </div>
          <div class="ab-stat-sep"></div>
          <div class="ab-stat">
            <span class="ab-stat-n">15+</span>
            <span class="ab-stat-l">{{ t('about.certsLabel') }}</span>
          </div>
          <div class="ab-stat-sep"></div>
          <div class="ab-stat">
            <span class="ab-stat-n">∞</span>
            <span class="ab-stat-l">{{ t('about.curiosityLabel') }}</span>
          </div>
        </div>

      </div>

      <!-- ═══ DERECHA ═══════════════════════════ -->
      <div class="ab-right">

        <!-- Intereses -->
        <div class="ab-card">
          <p class="ab-card-label">{{ t('about.interests') }}</p>
          <div class="ab-tags">
            <span v-for="tag in interests" :key="tag" class="ab-tag">{{ tag }}</span>
          </div>
        </div>

        <!-- Formación -->
        <div class="ab-card">
          <p class="ab-card-label">{{ t('about.education') }}</p>
          <div class="ab-edu-list">
            <div v-for="item in education" :key="item.degree" class="ab-edu-item">
              <div class="ab-edu-indicator" :class="{ active: item.active }"></div>
              <div class="ab-edu-body">
                <p class="ab-edu-degree">{{ item.degree }}</p>
                <p class="ab-edu-inst">{{ item.institution }}</p>
              </div>
              <div class="ab-edu-meta">
                <span class="ab-edu-period">{{ item.period }}</span>
                <span class="ab-edu-badge" :class="item.active ? 'badge-on' : 'badge-off'">
                  {{ item.tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── BASE ──────────────────────────────── */
.ab-section {
  background: #000;
  padding: 7rem 0 8rem;
  position: relative;
}
.ab-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,0,0,0.3), transparent);
}
.ab-section::after {
  content: '';
  position: absolute;
  bottom: -100px; right: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(255,0,0,0.035) 0%, transparent 65%);
  pointer-events: none;
}

.ab-container {
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
  position: relative;
  z-index: 1;
}
@media (max-width: 860px) {
  .ab-container { grid-template-columns: 1fr; gap: 3.5rem; }
}

/* ── LEFT ──────────────────────────────── */
.ab-left { display: flex; flex-direction: column; gap: 0; }

.ab-photo-wrap {
  width: 90px;
  height: 90px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #1e1e1e;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(255,51,51,0.08);
}
.ab-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.ab-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ff3333;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.ab-eyebrow::before {
  content: '';
  display: block;
  width: 24px; height: 1px;
  background: #ff3333;
  opacity: 0.5;
}

.ab-headline {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #fff;
  margin-bottom: 1.25rem;
}
.ab-headline-red {
  color: #ff3333;
}
.ab-headline-dim { color: #fff; }

.ab-role-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.75rem;
}
.ab-chip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #444;
  border: 1px solid #1e1e1e;
  border-radius: 5px;
  padding: 0.28rem 0.65rem;
  letter-spacing: 0.05em;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.ab-chip:hover {
  color: #fff;
  border-color: rgba(255, 51, 51, 0.4);
  background: rgba(255, 51, 51, 0.05);
  box-shadow: 0 0 12px rgba(255, 51, 51, 0.15);
  transform: translateY(-2px);
}

.ab-divider-sm {
  width: 40px; height: 1px;
  background: linear-gradient(90deg, #ff3333, transparent);
  margin-bottom: 1.75rem;
  opacity: 0.5;
}

.ab-bio {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 2.5rem;
}
.ab-bio p {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #5e5e5e;
  line-height: 1.85;
}

.ab-stats-row {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding-top: 1.75rem;
  border-top: 1px solid #111;
}
.ab-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  transition: transform 0.3s ease;
}
.ab-stat:hover {
  transform: translateY(-4px);
}
.ab-stat:hover .ab-stat-n {
  color: #ff3333;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
}
.ab-stat-n {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.9rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}
.ab-stat-l {
  font-family: 'Inter', sans-serif;
  font-size: 0.62rem;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}
.ab-stat:hover .ab-stat-l {
  color: #888;
}
.ab-stat-sep {
  width: 1px; height: 36px;
  background: #111;
  flex-shrink: 0;
}

/* ── RIGHT ─────────────────────────────── */
.ab-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 5rem;
}

.ab-card {
  background: #080808;
  border: 1px solid #161616;
  border-radius: 16px;
  padding: 1.5rem 1.5rem 1.25rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.35s, box-shadow 0.35s;
}
.ab-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,0,0,0.2), transparent);
  opacity: 0;
  transition: opacity 0.35s;
}
.ab-card:hover {
  border-color: rgba(255,0,0,0.18);
  box-shadow: 0 0 40px rgba(255,0,0,0.04), 0 12px 40px rgba(0,0,0,0.5);
}
.ab-card:hover::after { opacity: 1; }

.ab-card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #ff3333;
  margin-bottom: 1.1rem;
  opacity: 0.8;
}

/* Tags */
.ab-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.ab-tag {
  font-family: 'Inter', sans-serif;
  font-size: 0.71rem;
  color: #444;
  background: #0c0c0c;
  border: 1px solid #181818;
  border-radius: 6px;
  padding: 0.28rem 0.65rem;
  cursor: default;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.ab-tag:hover {
  color: #ff3333;
  border-color: rgba(255,51,51,0.3);
  background: rgba(255,51,51,0.03);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 12px rgba(255, 51, 51, 0.05);
}

/* Education */
.ab-edu-list { display: flex; flex-direction: column; }
.ab-edu-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 0.5rem;
  border-bottom: 1px solid #0d0d0d;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.ab-edu-item:hover {
  background: rgba(255, 255, 255, 0.01);
  transform: translateX(6px);
  padding-left: 0.8rem;
}
.ab-edu-item:last-child { border-bottom: none; padding-bottom: 0; }
.ab-edu-item:first-child { padding-top: 0; }

.ab-edu-indicator {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #1c1c1c;
  flex-shrink: 0;
  transition: background 0.2s;
}
.ab-edu-indicator.active {
  background: #ff3333;
  box-shadow: 0 0 6px rgba(255,0,0,0.5);
}

.ab-edu-body { flex: 1; min-width: 0; }
.ab-edu-degree {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #bbb;
  line-height: 1.3;
  transition: color 0.2s;
}
.ab-edu-item:hover .ab-edu-degree { color: #fff; }
.ab-edu-inst {
  font-family: 'Inter', sans-serif;
  font-size: 0.67rem;
  color: #2e2e2e;
  margin-top: 2px;
}

.ab-edu-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  flex-shrink: 0;
}
.ab-edu-period {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: #252525;
  white-space: nowrap;
}
.ab-edu-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid;
  white-space: nowrap;
}
.badge-on {
  color: #ff3333;
  border-color: rgba(255,0,0,0.22);
  background: rgba(255,0,0,0.05);
}
.badge-off { color: #222; border-color: #161616; }
</style>
