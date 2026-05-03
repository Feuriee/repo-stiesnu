<template>
  <div class="error-page">
    <!-- Animated background blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="error-card">
      <!-- Icon -->
      <div class="icon-wrap">
        <PhWarning weight="duotone" class="warn-icon" />
      </div>

      <div class="error-code">{{ code }}</div>

      <div class="divider"></div>

      <h1 class="error-title">{{ title }}</h1>
      <p class="error-desc">{{ description }}</p>

      <div class="actions">
        <button class="btn-primary" @click="router.push('/')">
          <PhHouse weight="bold" />
          Ke Beranda
        </button>
        <button class="btn-outline" @click="reload">
          <PhArrowClockwise weight="bold" />
          Coba Lagi
        </button>
      </div>

      <p class="error-hint">Kode Error: <code>{{ code }}</code></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PhWarning, PhHouse, PhArrowClockwise } from '@phosphor-icons/vue'

const router = useRouter()
const route  = useRoute()

// Bisa dioper via query: /error?code=503
const code = computed(() => Number(route.query.code) || 500)

const title = computed(() => {
  switch (code.value) {
    case 500: return 'Kesalahan Server'
    case 502: return 'Bad Gateway'
    case 503: return 'Layanan Tidak Tersedia'
    default:  return 'Terjadi Kesalahan'
  }
})

const description = computed(() => {
  switch (code.value) {
    case 500: return 'Server mengalami masalah internal. Tim kami sudah diberitahu. Silakan coba beberapa saat lagi.'
    case 502: return 'Server tidak mendapat respons yang valid dari upstream. Harap tunggu sebentar dan coba lagi.'
    case 503: return 'Layanan sedang dalam pemeliharaan atau kelebihan beban. Silakan coba kembali dalam beberapa menit.'
    default:  return 'Terjadi kesalahan yang tidak dikenal. Silakan coba kembali atau hubungi administrator.'
  }
})

const reload = () => window.location.reload()
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  animation: float 8s ease-in-out infinite;
}
.blob-1 {
  width: 500px; height: 500px;
  background: #818cf8;
  top: -150px; left: -150px;
  animation-delay: 0s;
}
.blob-2 {
  width: 400px; height: 400px;
  background: #c7d2fe;
  bottom: -120px; right: -120px;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-25px); }
}

.error-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2rem;
  padding: 3rem 3.5rem;
  text-align: center;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

.icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  animation: pulse 2.5s ease-in-out infinite;
}
.warn-icon {
  font-size: 4rem;
  width: 4rem;
  height: 4rem;
  color: #fbbf24;
  filter: drop-shadow(0 0 12px rgba(251,191,36,0.5));
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}

.error-code {
  font-size: clamp(3.5rem, 12vw, 6rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  margin-bottom: 1rem;
  letter-spacing: -2px;
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #818cf8, #c7d2fe);
  border-radius: 999px;
  margin: 0 auto 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
}

.error-desc {
  color: rgba(255,255,255,0.65);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.btn-primary, .btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(99,102,241,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99,102,241,0.5);
}

.btn-outline {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.85);
  border: 1px solid rgba(255,255,255,0.2);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.error-hint {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.3);
}
.error-hint code {
  background: rgba(255,255,255,0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
}
</style>
