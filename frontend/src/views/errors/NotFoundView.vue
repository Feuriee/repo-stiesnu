<template>
  <div class="error-page">
    <!-- Animated background blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="error-card">
      <!-- Animated 404 number -->
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit zero">0</span>
        <span class="digit">4</span>
      </div>

      <div class="divider"></div>

      <h1 class="error-title">Halaman Tidak Ditemukan</h1>
      <p class="error-desc">
        Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.<br />
        Periksa kembali URL atau kembali ke halaman utama.
      </p>

      <div class="actions">
        <button class="btn-primary" @click="router.push('/')">
          <PhHouse weight="bold" />
          Ke Beranda
        </button>
        <button class="btn-outline" @click="router.back()">
          <PhArrowLeft weight="bold" />
          Kembali
        </button>
      </div>

      <p class="error-hint">Kode Error: <code>404</code></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PhHouse, PhArrowLeft } from '@phosphor-icons/vue'

const router = useRouter()
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
}

/* Animated blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
  animation: float 8s ease-in-out infinite;
}
.blob-1 {
  width: 500px; height: 500px;
  background: #34d399;
  top: -150px; left: -150px;
  animation-delay: 0s;
}
.blob-2 {
  width: 400px; height: 400px;
  background: #6ee7b7;
  bottom: -120px; right: -120px;
  animation-delay: 2s;
}
.blob-3 {
  width: 300px; height: 300px;
  background: #a7f3d0;
  top: 60%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-30px) scale(1.05); }
}

/* Card */
.error-card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2rem;
  padding: 3rem 3.5rem;
  text-align: center;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 25px 60px rgba(0,0,0,0.3);
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 404 digits */
.error-code {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.digit {
  font-size: clamp(4rem, 14vw, 7rem);
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.digit.zero {
  color: #6ee7b7;
  display: inline-block;
  animation: spin 4s ease-in-out infinite;
}
@keyframes spin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25%       { transform: rotate(-15deg) scale(1.1); }
  75%       { transform: rotate(15deg) scale(1.1); }
}

.divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #34d399, #6ee7b7);
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
  color: rgba(255,255,255,0.7);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* Buttons */
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
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(16,185,129,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16,185,129,0.5);
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
  color: rgba(255,255,255,0.35);
}
.error-hint code {
  background: rgba(255,255,255,0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
}
</style>
