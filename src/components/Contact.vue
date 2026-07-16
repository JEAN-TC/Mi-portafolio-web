<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Send, CheckCircle, AlertCircle, Loader2 } from '@lucide/vue'
import { t } from '../utils/i18n'

const API_URL = '/api/contact'

const form = reactive({ name: '', email: '', message: '' })
const isSubmitting = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')
const errorMsg = ref('')

const handleSubmit = async () => {
  if (!form.name || !form.email || !form.message) return
  isSubmitting.value = true
  status.value = 'idle'
  errorMsg.value = ''

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:    form.name.trim(),
        email:   form.email.trim(),
        message: form.message.trim(),
      }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      status.value = 'success'
      Object.assign(form, { name: '', email: '', message: '' })
    } else {
      status.value = 'error'
      errorMsg.value = data.error || t('contact.errorDef')
    }
  } catch {
    status.value = 'error'
    errorMsg.value = t('contact.errorConn')
  } finally {
    isSubmitting.value = false
    setTimeout(() => status.value = 'idle', 7000)
  }
}
</script>

<template>
  <section id="contacto" class="ct-section">
    <div class="ct-wrapper">

      <div class="ct-header">
        <span class="section-label mx-auto justify-center">{{ t('contact.label') }}</span>
        <h2 class="ct-title">{{ t('contact.title1') }} <span class="text-gradient">{{ t('contact.title2') }}</span></h2>
        <p class="ct-subtitle">{{ t('contact.subtitle') }}</p>
      </div>

      <div class="ct-card card-modern">
        <form @submit.prevent="handleSubmit" class="ct-form" novalidate>

          <div class="ct-field">
            <label for="ct-name" class="ct-label">{{ t('contact.nameLabel') }}</label>
            <input
              id="ct-name" type="text" v-model="form.name" required
              class="ct-input" :placeholder="t('contact.namePh')"
              :disabled="isSubmitting"
            />
          </div>

          <div class="ct-field">
            <label for="ct-email" class="ct-label">{{ t('contact.emailLabel') }}</label>
            <input
              id="ct-email" type="email" v-model="form.email" required
              class="ct-input" :placeholder="t('contact.emailPh')"
              :disabled="isSubmitting"
            />
          </div>

          <div class="ct-field">
            <label for="ct-message" class="ct-label">{{ t('contact.msgLabel') }}</label>
            <textarea
              id="ct-message" v-model="form.message" rows="5" required
              class="ct-input ct-textarea" :placeholder="t('contact.msgPh')"
              :disabled="isSubmitting"
            ></textarea>
          </div>

          <button
            type="submit" class="ct-btn"
            :disabled="isSubmitting || !form.name || !form.email || !form.message"
          >
            <Loader2 v-if="isSubmitting" class="ct-btn-icon ct-spin" />
            <Send v-else class="ct-btn-icon" />
            <span>{{ isSubmitting ? t('contact.sending') : t('contact.send') }}</span>
          </button>

          <transition name="ct-fade">
            <div v-if="status === 'success'" class="ct-alert ct-alert--success">
              <CheckCircle class="ct-alert-icon" />
              <span>{{ t('contact.success') }}</span>
            </div>
          </transition>

          <transition name="ct-fade">
            <div v-if="status === 'error'" class="ct-alert ct-alert--error">
              <AlertCircle class="ct-alert-icon" />
              <span>{{ errorMsg || t('contact.errorSend') }} {{ t('contact.directMid') }}
                <a href="mailto:jeantoscano5@gmail.com" class="ct-alert-link">jeantoscano5@gmail.com</a>
              </span>
            </div>
          </transition>

        </form>
      </div>

      <p class="ct-direct">
        {{ t('contact.directStart') }}
        <a href="mailto:jeantoscano5@gmail.com" class="ct-direct-link">jeantoscano5@gmail.com</a>
      </p>

    </div>
  </section>
</template>

<style scoped>
.ct-section { padding: 6rem 0; background: #000000; }
.ct-wrapper { max-width: 38rem; margin: 0 auto; padding: 0 1.5rem; }

.ct-header { text-align: center; margin-bottom: 2.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.ct-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: #fff; letter-spacing: -0.02em; }
.ct-subtitle { font-size: 0.9rem; color: #71717a; margin-top: 0.25rem; }

.ct-card { padding: 2.25rem; }

.ct-form { display: flex; flex-direction: column; gap: 1.25rem; }
.ct-field { display: flex; flex-direction: column; gap: 0.45rem; }
.ct-label { font-size: 0.8rem; font-weight: 600; color: #d4d4d8; letter-spacing: 0.02em; }

.ct-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.ct-input::placeholder { color: #3f3f46; }
.ct-input:focus {
  border-color: rgba(255,0,0,0.45);
  background: rgba(255,255,255,0.06);
  box-shadow: 0 0 0 3px rgba(255,0,0,0.08);
}
.ct-input:disabled { opacity: 0.5; cursor: not-allowed; }
.ct-textarea { resize: none; }

.ct-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; padding: 0.8rem 1.5rem;
  font-size: 0.9rem; font-weight: 700; font-family: inherit; color: #fff;
  border: 1px solid rgba(255,0,0,0.5); border-radius: 12px;
  background: linear-gradient(135deg, rgba(255,0,0,0.22), rgba(255,50,50,0.14));
  box-shadow: 0 0 20px -6px rgba(255,0,0,0.35);
  cursor: pointer; transition: all 0.25s ease; margin-top: 0.25rem;
}
.ct-btn:hover:not(:disabled) {
  border-color: rgba(255,0,0,0.75);
  background: linear-gradient(135deg, rgba(255,0,0,0.38), rgba(255,50,50,0.26));
  box-shadow: 0 0 30px -6px rgba(255,0,0,0.55);
  transform: translateY(-1px);
}
.ct-btn:active:not(:disabled) { transform: scale(0.98); }
.ct-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.ct-btn-icon { width: 16px; height: 16px; flex-shrink: 0; }
.ct-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.ct-alert {
  display: flex; align-items: flex-start; gap: 0.6rem;
  padding: 0.85rem 1rem; border-radius: 10px;
  font-size: 0.82rem; line-height: 1.5;
}
.ct-alert--success { background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.25); color: #86efac; }
.ct-alert--error   { background: rgba(239,68,68,0.08);  border: 1px solid rgba(239,68,68,0.25);  color: #fca5a5; }
.ct-alert-icon { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
.ct-alert-link { color: inherit; text-decoration: underline; text-underline-offset: 2px; }

.ct-fade-enter-active, .ct-fade-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.ct-fade-enter-from, .ct-fade-leave-to { opacity: 0; transform: translateY(-6px); }

.ct-direct { text-align: center; margin-top: 1.5rem; font-size: 0.78rem; color: #52525b; }
.ct-direct-link { color: #ff5555; text-decoration: none; transition: color 0.2s; }
.ct-direct-link:hover { color: #ff8888; }
</style>
