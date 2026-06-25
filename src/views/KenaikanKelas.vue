<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-slate-100 tracking-wide mb-6">Modul Kenaikan Kelas</h2>

    <div class="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col items-center">
      <div class="flex items-center gap-6 w-full max-w-2xl">
        <div class="flex-1">
          <label class="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Dari Kelas Asal</label>
          <select v-model="kelasAsalId" class="w-full px-4 py-3 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none transition-all">
            <option value="">-- Pilih Kelas Asal --</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
          </select>
        </div>
        <div class="mt-6">
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <label class="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Ke Kelas Baru</label>
          <select v-model="kelasTujuanId" class="w-full px-4 py-3 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none transition-all">
            <option value="">-- Pilih Kelas Tujuan --</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
          </select>
        </div>
      </div>

      <div class="mt-6 w-full max-w-2xl">
        <label class="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Tahun Ajaran</label>
        <input v-model="tahunAjaran" type="text" placeholder="2025/2026"
          class="w-full px-4 py-3 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"/>
      </div>

      <button @click="prosesKenaikan" :disabled="isProses"
        class="mt-8 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50">
        {{ isProses ? 'Memproses...' : 'Proses Kenaikan Kelas Masal' }}
      </button>

      <div v-if="pesanSukses" class="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl text-center w-full">
        {{ pesanSukses }}
      </div>
      <div v-if="pesanError" class="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center w-full">
        {{ pesanError }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl h-80 flex flex-col">
        <h3 class="text-sm font-bold text-slate-200 mb-4">Tracing History Kenaikan</h3>
        <div class="flex-1 overflow-y-auto space-y-3 pr-2">
          <div v-if="!historyList.length" class="text-slate-500 text-xs text-center mt-4">
            Belum ada data kenaikan kelas
          </div>
          <div v-for="item in historyList" :key="item.id" class="flex justify-between items-center pb-3 border-b border-slate-800/50">
            <div>
              <p class="text-sm font-semibold text-slate-300">{{ item.nama_lengkap }}</p>
              <p class="text-[10px] text-slate-500">{{ item.kelas_asal }} → {{ item.kelas_tujuan || 'Lulus' }}</p>
              <p class="text-[10px] text-slate-600">{{ item.tahun_ajaran }}</p>
            </div>
            <div :class="[
              'px-2 py-1 rounded text-[10px] font-bold',
              item.status === 'naik' ? 'bg-green-500/10 text-green-400' :
              item.status === 'lulus' ? 'bg-blue-500/10 text-blue-400' :
              'bg-red-500/10 text-red-400'
            ]">
              {{ item.status.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col">
        <h3 class="text-sm font-bold text-slate-200 mb-6">Statistik Kenaikan</h3>
        <div class="flex-1 flex items-center justify-center gap-10">
          <div class="relative w-32 h-32 rounded-full flex items-center justify-center"
               :style="`background: conic-gradient(#10B981 0% ${pctNaik}%, #EF4444 ${pctNaik}% 100%)`">
            <div class="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center">
              <span class="text-xs font-bold text-slate-300">{{ pctNaik }}%</span>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <p class="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <span class="w-3 h-3 rounded-full bg-green-500"></span> Naik Kelas
              </p>
              <p class="text-xl font-bold text-slate-200 ml-5">{{ totalNaik }} Siswa</p>
            </div>
            <div>
              <p class="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-1">
                <span class="w-3 h-3 rounded-full bg-red-500"></span> Tinggal Kelas
              </p>
              <p class="text-xl font-bold text-slate-200 ml-5">{{ totalTinggal }} Siswa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'

const kelasList = ref([])
const kelasAsalId = ref('')
const kelasTujuanId = ref('')
const tahunAjaran = ref('2025/2026')
const historyList = ref([])
const isProses = ref(false)
const pesanSukses = ref('')
const pesanError = ref('')

const totalNaik = computed(() => historyList.value.filter(h => h.status === 'naik').length)
const totalTinggal = computed(() => historyList.value.filter(h => h.status === 'tinggal').length)
const pctNaik = computed(() => {
  const total = historyList.value.length
  return total ? Math.round((totalNaik.value / total) * 100) : 0
})

onMounted(async () => {
  try {
    const [resKelas, resHistory] = await Promise.all([
      api.get('/kelas'),
      api.get('/kenaikan-kelas')
    ])
    kelasList.value = resKelas.data.data
    historyList.value = resHistory.data.data
  } catch (err) {
    console.error('Gagal load data:', err)
  }
})

const prosesKenaikan = async () => {
  if (!kelasAsalId.value || !kelasTujuanId.value) {
    pesanError.value = 'Pilih kelas asal dan kelas tujuan!'
    return
  }

  isProses.value = true
  pesanSukses.value = ''
  pesanError.value = ''

  try {
    // Load siswa di kelas asal
    const resSiswa = await api.get(`/kelas/${kelasAsalId.value}/siswa`)
    const siswaList = resSiswa.data.data.siswa

    if (!siswaList.length) {
      pesanError.value = 'Tidak ada siswa di kelas asal!'
      return
    }

    // Proses kenaikan satu per satu
    for (const siswa of siswaList) {
      await api.post('/kenaikan-kelas', {
        siswa_id: siswa.id,
        kelas_asal_id: kelasAsalId.value,
        kelas_tujuan_id: kelasTujuanId.value,
        tahun_ajaran: tahunAjaran.value,
        status: 'naik'
      })
    }

    pesanSukses.value = `${siswaList.length} siswa berhasil diproses kenaikan kelas!`

    // Refresh history
    const resHistory = await api.get('/kenaikan-kelas')
    historyList.value = resHistory.data.data

  } catch (err) {
    pesanError.value = err.response?.data?.message || 'Gagal proses kenaikan kelas.'
  } finally {
    isProses.value = false
  }
}
</script>