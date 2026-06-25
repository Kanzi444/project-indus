<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-slate-100 tracking-wide">Absensi & Jurnal Mengajar</h2>
    
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 shadow-xl">
      <div class="flex-1">
        <label class="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Pilih Kelas</label>
        <select v-model="selectedKelasId" class="w-full px-3 py-2.5 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-blue-500 outline-none">
          <option value="">-- Pilih Kelas --</option>
          <option v-for="kelas in kelasList" :key="kelas.id" :value="kelas.id">
            {{ kelas.nama_kelas }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Tanggal</label>
        <input type="date" v-model="tanggal" class="w-full px-3 py-2.5 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-blue-500 outline-none"/>
      </div>
      <div class="flex-1 md:flex-[2]">
        <label class="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Mata Pelajaran</label>
        <input type="text" v-model="mataPelajaran" placeholder="Nama mata pelajaran..." class="w-full px-3 py-2.5 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-blue-500 outline-none"/>
      </div>
      <div class="flex items-end">
        <button @click="loadAbsensi" class="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all">
          Tampilkan Daftar Siswa
        </button>
      </div>
    </div>

    <div v-if="pesanInfo" class="p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm rounded-xl text-center">
      {{ pesanInfo }}
    </div>

    <div v-if="daftarSiswa.length" class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl pb-4">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold">
              <th class="p-4 w-12">No</th>
              <th class="p-4 w-32">NISN</th>
              <th class="p-4 w-48">Nama Siswa</th>
              <th class="p-4">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="(siswa, index) in daftarSiswa" :key="siswa.siswa_id" class="border-b border-slate-800/50 hover:bg-slate-800/20">
              <td class="p-4 text-slate-500">{{ index + 1 }}</td>
              <td class="p-4 text-slate-400 font-mono">{{ siswa.nisn || '-' }}</td>
              <td class="p-4 text-slate-200 font-medium">{{ siswa.nama_lengkap }}</td>
              <td class="p-4 flex flex-wrap items-center gap-4">
                <div class="flex bg-slate-950 rounded-lg border border-slate-700 p-1 gap-1">
                  <button v-for="stat in statusList" :key="stat.val"
                          @click="siswa.status = stat.val"
                          :class="[
                            'w-8 h-8 rounded text-xs font-bold transition-all',
                            siswa.status === stat.val ? stat.activeClass : 'text-slate-400 hover:bg-slate-800'
                          ]">
                    {{ stat.label }}
                  </button>
                </div>
                <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-x-4" enter-to-class="opacity-100 translate-x-0">
                  <input v-if="siswa.status === 'sakit' || siswa.status === 'izin'"
                         type="text"
                         v-model="siswa.keterangan"
                         :placeholder="siswa.status === 'sakit' ? 'Ket. Sakit...' : 'Ket. Izin...'"
                         class="flex-1 min-w-[200px] px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all">
                </transition>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="daftarSiswa.length" class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <label class="block text-sm font-bold text-slate-300 mb-3">Jurnal Ringkasan Materi Hari Ini</label>
      <textarea
        v-model="ringkasan"
        rows="3"
        placeholder="Tuliskan ringkasan materi yang diajarkan, hambatan, atau catatan khusus..."
        class="w-full p-4 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none placeholder-slate-600 transition-all">
      </textarea>
      <div class="mt-4 flex justify-end">
        <button @click="submitAbsensiJurnal" :disabled="isSubmitting" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50">
          {{ isSubmitting ? 'Menyimpan...' : 'Submit Absensi & Jurnal' }}
        </button>
      </div>
    </div>

    <div v-if="pesanSukses" class="p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl text-center">
      {{ pesanSukses }}
    </div>
    <div v-if="pesanError" class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
      {{ pesanError }}
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const kelasList = ref([])
const selectedKelasId = ref('')
const tanggal = ref(new Date().toISOString().split('T')[0])
const mataPelajaran = ref('')
const ringkasan = ref('')
const daftarSiswa = ref([])
const isSubmitting = ref(false)
const pesanInfo = ref('')
const pesanSukses = ref('')
const pesanError = ref('')

const statusList = [
  { val: 'hadir', label: 'H', activeClass: 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' },
  { val: 'sakit', label: 'S', activeClass: 'bg-amber-500 text-slate-900 shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  { val: 'izin',  label: 'I', activeClass: 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]' },
  { val: 'alpha', label: 'A', activeClass: 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' },
]

onMounted(async () => {
  try {
    const res = await api.get('/kelas')
    kelasList.value = res.data.data
  } catch (err) {
    console.error('Gagal load kelas:', err)
  }
})

const loadAbsensi = async () => {
  if (!selectedKelasId.value || !tanggal.value) {
    pesanInfo.value = 'Pilih kelas dan tanggal terlebih dahulu!'
    return
  }
  pesanInfo.value = ''
  try {
    const res = await api.get('/absensi', {
      params: { kelas_id: selectedKelasId.value, tanggal: tanggal.value }
    })
    daftarSiswa.value = res.data.data.map(s => ({
      ...s,
      status: s.status || 'hadir',
      keterangan: s.keterangan || ''
    }))
    if (!daftarSiswa.value.length) {
      pesanInfo.value = 'Tidak ada siswa di kelas ini.'
    }
  } catch (err) {
    pesanError.value = 'Gagal memuat data absensi.'
  }
}

const submitAbsensiJurnal = async () => {
  if (!mataPelajaran.value) {
    pesanError.value = 'Mata pelajaran wajib diisi!'
    return
  }
  isSubmitting.value = true
  pesanSukses.value = ''
  pesanError.value = ''

  try {
    // Submit absensi
    await api.post('/absensi/bulk', {
      kelas_id: selectedKelasId.value,
      tanggal: tanggal.value,
      absensi: daftarSiswa.value.map(s => ({
        siswa_id: s.siswa_id,
        status: s.status,
        keterangan: s.keterangan
      }))
    })

    // Submit jurnal
    await api.post('/jurnal', {
      kelas_id: selectedKelasId.value,
      tanggal: tanggal.value,
      mata_pelajaran: mataPelajaran.value,
      materi: ringkasan.value,
      ringkasan: ringkasan.value
    })

    pesanSukses.value = 'Absensi & Jurnal berhasil disimpan!'
    ringkasan.value = ''
  } catch (err) {
    pesanError.value = err.response?.data?.message || 'Gagal menyimpan data.'
  } finally {
    isSubmitting.value = false
  }
}
</script>