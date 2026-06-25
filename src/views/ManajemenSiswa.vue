<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-slate-100">Manajemen Siswa</h2>
      <button @click="openModal('tambah')"
        class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        + Tambah Siswa
      </button>
    </div>

    <!-- Search -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <input v-model="search" @input="loadSiswa" type="text" placeholder="Cari nama, NIS, atau NISN..."
        class="w-full px-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-sm placeholder-slate-500"/>
    </div>

    <!-- Tabel -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold">
              <th class="p-4">No</th>
              <th class="p-4">NIS</th>
              <th class="p-4">NISN</th>
              <th class="p-4">Nama Lengkap</th>
              <th class="p-4">Kelas</th>
              <th class="p-4">JK</th>
              <th class="p-4">Status</th>
              <th class="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="isLoading">
              <td colspan="8" class="p-6 text-center text-slate-500 text-xs">Memuat data...</td>
            </tr>
            <tr v-else-if="!siswaList.length">
              <td colspan="8" class="p-6 text-center text-slate-500 text-xs">Tidak ada data siswa</td>
            </tr>
            <tr v-for="(siswa, i) in siswaList" :key="siswa.id"
              class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-all">
              <td class="p-4 text-slate-500 text-xs">{{ (pagination.page - 1) * pagination.limit + i + 1 }}</td>
              <td class="p-4 text-slate-400 font-mono text-xs">{{ siswa.nis }}</td>
              <td class="p-4 text-slate-400 font-mono text-xs">{{ siswa.nisn || '-' }}</td>
              <td class="p-4 text-slate-200 font-medium text-xs">{{ siswa.nama_lengkap }}</td>
              <td class="p-4 text-slate-400 text-xs">{{ siswa.nama_kelas || '-' }}</td>
              <td class="p-4 text-slate-400 text-xs">{{ siswa.jenis_kelamin }}</td>
              <td class="p-4">
                <span :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold',
                  siswa.status === 'aktif' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                ]">{{ siswa.status }}</span>
              </td>
              <td class="p-4 flex gap-2">
                <button @click="openModal('edit', siswa)"
                  class="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-lg transition-all">
                  Edit
                </button>
                <button @click="hapusSiswa(siswa)"
                  class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-lg transition-all">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between p-4 border-t border-slate-800">
        <p class="text-xs text-slate-500">
          Total: {{ pagination.total }} siswa
        </p>
        <div class="flex gap-2">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
            class="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg disabled:opacity-30 hover:bg-slate-700 transition-all">
            ← Prev
          </button>
          <span class="px-3 py-1 text-xs text-slate-400">
            {{ pagination.page }} / {{ pagination.totalPages }}
          </span>
          <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg disabled:opacity-30 hover:bg-slate-700 transition-all">
            Next →
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h3 class="text-sm font-bold text-slate-200 mb-5">
          {{ modalMode === 'tambah' ? '+ Tambah Siswa Baru' : '✏️ Edit Data Siswa' }}
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NIS *</label>
              <input v-model="form.nis" type="text" placeholder="2526001"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"
                :disabled="modalMode === 'edit'"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NISN</label>
              <input v-model="form.nisn" type="text" placeholder="0012345001"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Lengkap *</label>
            <input v-model="form.nama_lengkap" type="text" placeholder="Nama lengkap siswa"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Jenis Kelamin *</label>
              <select v-model="form.jenis_kelamin"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
                <option value="">-- Pilih --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Kelas</label>
              <select v-model="form.kelas_id"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
                <option value="">-- Pilih Kelas --</option>
                <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tempat Lahir</label>
              <input v-model="form.tempat_lahir" type="text" placeholder="Jakarta"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tanggal Lahir</label>
              <input v-model="form.tanggal_lahir" type="date"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Orang Tua</label>
            <input v-model="form.nama_orang_tua" type="text" placeholder="Nama orang tua"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">No. Telepon Orang Tua</label>
            <input v-model="form.no_telepon_orang_tua" type="text" placeholder="08xxxxxxxxxx"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>

          <div v-if="modalMode === 'edit'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status</label>
            <select v-model="form.status"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
              <option value="lulus">Lulus</option>
              <option value="pindah">Pindah</option>
            </select>
          </div>

          <div v-if="modalMode === 'tambah'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Password</label>
            <input v-model="form.password" type="password" placeholder="Default: siswa123"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
        </div>

        <div v-if="pesanError" class="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
          {{ pesanError }}
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="closeModal"
            class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all">
            Batal
          </button>
          <button @click="submitForm" :disabled="isSubmitting"
            class="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            {{ isSubmitting ? 'Menyimpan...' : modalMode === 'tambah' ? 'Tambah Siswa' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const siswaList = ref([])
const kelasList = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const modalMode = ref('tambah')
const search = ref('')
const pesanError = ref('')
const selectedId = ref(null)

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1
})

const form = ref({
  nis: '',
  nisn: '',
  nama_lengkap: '',
  jenis_kelamin: '',
  kelas_id: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  nama_orang_tua: '',
  no_telepon_orang_tua: '',
  status: 'aktif',
  password: ''
})

const loadSiswa = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/siswa', {
      params: {
        page: pagination.value.page,
        limit: pagination.value.limit,
        search: search.value
      }
    })
    siswaList.value = res.data.data.siswa
    pagination.value = res.data.data.pagination
  } catch (err) {
    console.error('Gagal load siswa:', err)
  } finally {
    isLoading.value = false
  }
}

const loadKelas = async () => {
  const res = await api.get('/kelas')
  kelasList.value = res.data.data
}

const openModal = (mode, siswa = null) => {
  modalMode.value = mode
  pesanError.value = ''
  if (mode === 'edit' && siswa) {
    selectedId.value = siswa.id
    form.value = {
      nis: siswa.nis,
      nisn: siswa.nisn || '',
      nama_lengkap: siswa.nama_lengkap,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas_id: siswa.kelas_id || '',
      tempat_lahir: siswa.tempat_lahir || '',
      tanggal_lahir: siswa.tanggal_lahir || '',
      nama_orang_tua: siswa.nama_orang_tua || '',
      no_telepon_orang_tua: siswa.no_telepon_orang_tua || '',
      status: siswa.status,
      password: ''
    }
  } else {
    selectedId.value = null
    form.value = {
      nis: '', nisn: '', nama_lengkap: '',
      jenis_kelamin: '', kelas_id: '',
      tempat_lahir: '', tanggal_lahir: '',
      nama_orang_tua: '', no_telepon_orang_tua: '',
      status: 'aktif', password: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  pesanError.value = ''
}

const submitForm = async () => {
  if (!form.value.nis || !form.value.nama_lengkap || !form.value.jenis_kelamin) {
    pesanError.value = 'NIS, Nama Lengkap, dan Jenis Kelamin wajib diisi!'
    return
  }
  isSubmitting.value = true
  pesanError.value = ''
  try {
    if (modalMode.value === 'tambah') {
      await api.post('/siswa', form.value)
    } else {
      await api.patch(`/siswa/${selectedId.value}`, form.value)
    }
    closeModal()
    loadSiswa()
  } catch (err) {
    pesanError.value = err.response?.data?.message || 'Gagal menyimpan data'
  } finally {
    isSubmitting.value = false
  }
}

const hapusSiswa = async (siswa) => {
  if (!confirm(`Hapus siswa ${siswa.nama_lengkap}?`)) return
  try {
    await api.delete(`/siswa/${siswa.id}`)
    loadSiswa()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus siswa')
  }
}

const changePage = (page) => {
  pagination.value.page = page
  loadSiswa()
}

onMounted(() => {
  loadSiswa()
  loadKelas()
})
</script>