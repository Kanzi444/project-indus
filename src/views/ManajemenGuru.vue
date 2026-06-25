<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-slate-100">Manajemen Guru</h2>
      <button @click="openModal('tambah')"
        class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
        + Tambah Guru
      </button>
    </div>

    <!-- Tabel -->
    <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold">
              <th class="p-4">No</th>
              <th class="p-4">Nama</th>
              <th class="p-4">Email</th>
              <th class="p-4">Role</th>
              <th class="p-4">Status</th>
              <th class="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-if="isLoading">
              <td colspan="6" class="p-6 text-center text-slate-500 text-xs">Memuat data...</td>
            </tr>
            <tr v-else-if="!guruList.length">
              <td colspan="6" class="p-6 text-center text-slate-500 text-xs">Tidak ada data guru</td>
            </tr>
            <tr v-for="(guru, i) in guruList" :key="guru.id"
              class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-all">
              <td class="p-4 text-slate-500 text-xs">{{ i + 1 }}</td>
              <td class="p-4 text-slate-200 font-medium text-xs">{{ guru.nama }}</td>
              <td class="p-4 text-slate-400 text-xs">{{ guru.email }}</td>
              <td class="p-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">
                  {{ guru.role }}
                </span>
              </td>
              <td class="p-4">
                <span :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold',
                  guru.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                ]">{{ guru.is_active ? 'Aktif' : 'Nonaktif' }}</span>
              </td>
              <td class="p-4 flex gap-2">
                <button @click="openModal('edit', guru)"
                  class="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-lg transition-all">
                  Edit
                </button>
                <button @click="hapusGuru(guru)"
                  class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-lg transition-all">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Tambah/Edit -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="text-sm font-bold text-slate-200 mb-5">
          {{ modalMode === 'tambah' ? '+ Tambah Guru Baru' : '✏️ Edit Data Guru' }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Lengkap *</label>
            <input v-model="form.nama" type="text" placeholder="Nama lengkap guru"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Email *</label>
            <input v-model="form.email" type="email" placeholder="email@guru.sekolah.ac.id"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Role</label>
            <select v-model="form.role"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div v-if="modalMode === 'edit'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status</label>
            <select v-model="form.is_active"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option :value="1">Aktif</option>
              <option :value="0">Nonaktif</option>
            </select>
          </div>

          <div v-if="modalMode === 'tambah'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Password *</label>
            <input v-model="form.password" type="password" placeholder="Minimal 6 karakter"
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
            {{ isSubmitting ? 'Menyimpan...' : modalMode === 'tambah' ? 'Tambah Guru' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const guruList = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const modalMode = ref('tambah')
const pesanError = ref('')
const selectedId = ref(null)

const form = ref({
  nama: '',
  email: '',
  role: 'guru',
  is_active: 1,
  password: ''
})

const loadGuru = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/users')
    guruList.value = res.data.data.users.filter(u => u.role === 'guru' || u.role === 'admin')
  } catch (err) {
    console.error('Gagal load guru:', err)
  } finally {
    isLoading.value = false
  }
}

const openModal = (mode, guru = null) => {
  modalMode.value = mode
  pesanError.value = ''
  if (mode === 'edit' && guru) {
    selectedId.value = guru.id
    form.value = {
      nama: guru.nama,
      email: guru.email,
      role: guru.role,
      is_active: guru.is_active,
      password: ''
    }
  } else {
    selectedId.value = null
    form.value = { nama: '', email: '', role: 'guru', is_active: 1, password: '' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  pesanError.value = ''
}

const submitForm = async () => {
  if (!form.value.nama || !form.value.email) {
    pesanError.value = 'Nama dan Email wajib diisi!'
    return
  }
  if (modalMode.value === 'tambah' && !form.value.password) {
    pesanError.value = 'Password wajib diisi!'
    return
  }
  isSubmitting.value = true
  pesanError.value = ''
  try {
    if (modalMode.value === 'tambah') {
      await api.post('/users', form.value)
    } else {
      const payload = { nama: form.value.nama, email: form.value.email, role: form.value.role, is_active: form.value.is_active }
      await api.patch(`/users/${selectedId.value}`, payload)
    }
    closeModal()
    loadGuru()
  } catch (err) {
    pesanError.value = err.response?.data?.message || 'Gagal menyimpan data'
  } finally {
    isSubmitting.value = false
  }
}

const hapusGuru = async (guru) => {
  if (!confirm(`Hapus ${guru.nama}?`)) return
  try {
    await api.delete(`/users/${guru.id}`)
    loadGuru()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus')
  }
}

onMounted(() => {
  loadGuru()
})
</script>