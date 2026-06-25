<template>
  <div class="space-y-6">

    <!-- Tab Menu -->
    <div class="flex gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 w-fit">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 text-xs font-semibold rounded-lg transition-all',
          activeTab === tab.id
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        ]">
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- TAB 1: Overview -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div class="flex flex-wrap items-center gap-3">
          <select class="px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg outline-none focus:border-cyan-500">
            <option>Semester Genap</option>
          </select>
          <select class="px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg outline-none focus:border-cyan-500">
            <option>Tahun Ajaran 2025/2026</option>
          </select>
        </div>
        <button class="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all">
          📥 Export Laporan PDF
        </button>
      </div>

      <!-- Stats -->
      <div v-if="isLoading" class="text-center text-slate-400 text-sm py-8">Memuat data...</div>
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Siswa</span>
          <div class="text-2xl font-black my-1 text-slate-100">{{ stats.totalSiswa }}</div>
          <div class="text-[9px] font-mono text-slate-500">Siswa Aktif</div>
        </div>
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Kelas</span>
          <div class="text-2xl font-black my-1 text-slate-100">{{ stats.totalKelas }}</div>
          <div class="text-[9px] font-mono text-slate-500">Kelas Aktif</div>
        </div>
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Guru</span>
          <div class="text-2xl font-black my-1 text-slate-100">{{ stats.totalGuru }}</div>
          <div class="text-[9px] font-mono text-slate-500">Tenaga Pengajar</div>
        </div>
        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total User</span>
          <div class="text-2xl font-black my-1 text-slate-100">{{ stats.totalUser }}</div>
          <div class="text-[9px] font-mono text-slate-500">Semua User</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div class="flex justify-between items-center mb-6">
            <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Tren Nilai Rata-rata</h4>
            <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono">↑ Progres Baik</span>
          </div>
          <div class="w-full h-48 border-l border-b border-slate-800 relative">
            <svg class="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 0 80 L 25 75 L 50 70 L 75 68 L 100 65" fill="none" stroke="#F59E0B" stroke-width="0.5" stroke-dasharray="2,2" />
              <path d="M 0 78 L 25 70 L 50 63 L 75 60 L 100 50" fill="none" stroke="#3B82F6" stroke-width="0.75" />
            </svg>
          </div>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Profil Kompetensi</h4>
          <div class="flex-1 flex items-center justify-center relative min-h-[192px]">
            <svg class="w-40 h-40 text-slate-800" viewBox="0 0 100 100">
              <polygon points="50,10 90,38 75,85 25,85 10,38" fill="none" stroke="currentColor" stroke-width="0.5"/>
              <polygon points="50,25 80,46 68,73 32,73 20,46" fill="none" stroke="currentColor" stroke-width="0.5"/>
              <polygon points="50,18 85,40 70,78 30,82 15,42" fill="none" stroke="#22D3EE" stroke-width="1"/>
            </svg>
            <span class="absolute top-2 text-[9px] font-mono text-slate-400">Matematika</span>
            <span class="absolute right-2 top-1/3 text-[9px] font-mono text-slate-400">Bhs. Indo</span>
            <span class="absolute bottom-2 right-6 text-[9px] font-mono text-slate-400">Produktif</span>
            <span class="absolute bottom-2 left-6 text-[9px] font-mono text-slate-400">Jaringan</span>
            <span class="absolute left-2 top-1/3 text-[9px] font-mono text-slate-400">Olahraga</span>
          </div>
        </div>
      </div>

      <!-- Data Kelas -->
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6">Data Kelas & Jumlah Siswa</h4>
        <div class="space-y-4">
          <div v-for="kelas in kelasList" :key="kelas.id" class="flex items-center gap-4">
            <span class="w-24 text-[10px] font-mono text-slate-400">{{ kelas.nama_kelas }}</span>
            <div class="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div class="h-full rounded-full transition-all duration-500 bg-cyan-500"
                   :style="{ width: getBarWidth(kelas.jumlah_siswa, kelas.kapasitas) + '%' }"></div>
            </div>
            <span class="w-20 text-right text-xs font-mono font-bold text-cyan-400">
              {{ kelas.jumlah_siswa }}/{{ kelas.kapasitas }} siswa
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: Manajemen Siswa -->
    <div v-if="activeTab === 'siswa'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-300">Data Siswa</h3>
        <button @click="openSiswaModal('tambah')"
          class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all">
          + Tambah Siswa
        </button>
      </div>

      <!-- Search Siswa -->
      <input v-model="searchSiswa" @input="loadSiswa" type="text" placeholder="Cari nama, NIS, atau NISN..."
        class="w-full px-4 py-2.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl focus:border-cyan-500 outline-none text-sm placeholder-slate-500"/>

      <!-- Tabel Siswa -->
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
              <tr v-if="isLoadingSiswa">
                <td colspan="8" class="p-6 text-center text-slate-500 text-xs">Memuat data...</td>
              </tr>
              <tr v-else-if="!siswaList.length">
                <td colspan="8" class="p-6 text-center text-slate-500 text-xs">Tidak ada data siswa</td>
              </tr>
              <tr v-for="(siswa, i) in siswaList" :key="siswa.id"
                class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-all">
                <td class="p-4 text-slate-500 text-xs">{{ i + 1 }}</td>
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
                <td class="p-4">
                  <div class="flex gap-2">
                    <button @click="openSiswaModal('edit', siswa)"
                      class="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-lg transition-all">
                      Edit
                    </button>
                    <button @click="hapusSiswa(siswa)"
                      class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-lg transition-all">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="flex items-center justify-between p-4 border-t border-slate-800">
          <p class="text-xs text-slate-500">Total: {{ paginasiSiswa.total }} siswa</p>
          <div class="flex gap-2">
            <button @click="changePageSiswa(paginasiSiswa.page - 1)" :disabled="paginasiSiswa.page <= 1"
              class="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg disabled:opacity-30 hover:bg-slate-700">
              ← Prev
            </button>
            <span class="px-3 py-1 text-xs text-slate-400">{{ paginasiSiswa.page }} / {{ paginasiSiswa.totalPages }}</span>
            <button @click="changePageSiswa(paginasiSiswa.page + 1)" :disabled="paginasiSiswa.page >= paginasiSiswa.totalPages"
              class="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg disabled:opacity-30 hover:bg-slate-700">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: Manajemen Guru -->
    <div v-if="activeTab === 'guru'" class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-300">Data Guru & User</h3>
        <button @click="openGuruModal('tambah')"
          class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all">
          + Tambah Guru
        </button>
      </div>

      <!-- Tabel Guru -->
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
              <tr v-if="isLoadingGuru">
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
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400">{{ guru.role }}</span>
                </td>
                <td class="p-4">
                  <span :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold',
                    guru.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  ]">{{ guru.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                </td>
                <td class="p-4">
                  <div class="flex gap-2">
                    <button @click="openGuruModal('edit', guru)"
                      class="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold rounded-lg transition-all">
                      Edit
                    </button>
                    <button @click="hapusGuru(guru)"
                      class="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded-lg transition-all">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Siswa -->
    <div v-if="showSiswaModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <h3 class="text-sm font-bold text-slate-200 mb-5">
          {{ siswaModalMode === 'tambah' ? '+ Tambah Siswa Baru' : '✏️ Edit Data Siswa' }}
        </h3>
        <div class="space-y-4 max-h-96 overflow-y-auto pr-1">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NIS *</label>
              <input v-model="siswaForm.nis" type="text" placeholder="2526001"
                :disabled="siswaModalMode === 'edit'"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs disabled:opacity-50"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">NISN</label>
              <input v-model="siswaForm.nisn" type="text" placeholder="0012345001"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Lengkap *</label>
            <input v-model="siswaForm.nama_lengkap" type="text" placeholder="Nama lengkap siswa"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Jenis Kelamin *</label>
              <select v-model="siswaForm.jenis_kelamin"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
                <option value="">-- Pilih --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Kelas</label>
              <select v-model="siswaForm.kelas_id"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
                <option value="">-- Pilih Kelas --</option>
                <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tempat Lahir</label>
              <input v-model="siswaForm.tempat_lahir" type="text" placeholder="Jakarta"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Tanggal Lahir</label>
              <input v-model="siswaForm.tanggal_lahir" type="date"
                class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Orang Tua</label>
            <input v-model="siswaForm.nama_orang_tua" type="text" placeholder="Nama orang tua"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">No. Telepon Orang Tua</label>
            <input v-model="siswaForm.no_telepon_orang_tua" type="text" placeholder="08xxxxxxxxxx"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
          <div v-if="siswaModalMode === 'edit'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status</label>
            <select v-model="siswaForm.status"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
              <option value="lulus">Lulus</option>
              <option value="pindah">Pindah</option>
            </select>
          </div>
          <div v-if="siswaModalMode === 'tambah'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Password</label>
            <input v-model="siswaForm.password" type="password" placeholder="Default: siswa123"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
        </div>
        <div v-if="siswaError" class="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">{{ siswaError }}</div>
        <div class="flex gap-3 mt-6">
          <button @click="showSiswaModal = false" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all">Batal</button>
          <button @click="submitSiswa" :disabled="isSubmittingSiswa"
            class="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            {{ isSubmittingSiswa ? 'Menyimpan...' : siswaModalMode === 'tambah' ? 'Tambah Siswa' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Guru -->
    <div v-if="showGuruModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 class="text-sm font-bold text-slate-200 mb-5">
          {{ guruModalMode === 'tambah' ? '+ Tambah Guru Baru' : '✏️ Edit Data Guru' }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Nama Lengkap *</label>
            <input v-model="guruForm.nama" type="text" placeholder="Nama lengkap"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Email *</label>
            <input v-model="guruForm.email" type="email" placeholder="email@sekolah.ac.id"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Role</label>
            <select v-model="guruForm.role"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div v-if="guruModalMode === 'edit'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Status</label>
            <select v-model="guruForm.is_active"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs">
              <option :value="1">Aktif</option>
              <option :value="0">Nonaktif</option>
            </select>
          </div>
          <div v-if="guruModalMode === 'tambah'">
            <label class="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Password *</label>
            <input v-model="guruForm.password" type="password" placeholder="Minimal 6 karakter"
              class="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none text-xs"/>
          </div>
        </div>
        <div v-if="guruError" class="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">{{ guruError }}</div>
        <div class="flex gap-3 mt-6">
          <button @click="showGuruModal = false" class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all">Batal</button>
          <button @click="submitGuru" :disabled="isSubmittingGuru"
            class="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-xl transition-all disabled:opacity-50">
            {{ isSubmittingGuru ? 'Menyimpan...' : guruModalMode === 'tambah' ? 'Tambah Guru' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// Tabs
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'siswa', label: 'Manajemen Siswa', icon: '👨‍🎓' },
  { id: 'guru', label: 'Manajemen Guru', icon: '👨‍🏫' },
]
const activeTab = ref('overview')

// Overview
const isLoading = ref(false)
const kelasList = ref([])
const stats = ref({ totalSiswa: 0, totalKelas: 0, totalGuru: 0, totalUser: 0 })

const getBarWidth = (jumlah, kapasitas) => {
  if (!kapasitas) return 0
  return Math.min(Math.round((jumlah / kapasitas) * 100), 100)
}

// Siswa
const siswaList = ref([])
const isLoadingSiswa = ref(false)
const isSubmittingSiswa = ref(false)
const showSiswaModal = ref(false)
const siswaModalMode = ref('tambah')
const searchSiswa = ref('')
const siswaError = ref('')
const selectedSiswaId = ref(null)
const paginasiSiswa = ref({ total: 0, page: 1, limit: 10, totalPages: 1 })

const siswaForm = ref({
  nis: '', nisn: '', nama_lengkap: '', jenis_kelamin: '',
  kelas_id: '', tempat_lahir: '', tanggal_lahir: '',
  nama_orang_tua: '', no_telepon_orang_tua: '',
  status: 'aktif', password: ''
})

// Guru
const guruList = ref([])
const isLoadingGuru = ref(false)
const isSubmittingGuru = ref(false)
const showGuruModal = ref(false)
const guruModalMode = ref('tambah')
const guruError = ref('')
const selectedGuruId = ref(null)

const guruForm = ref({
  nama: '', email: '', role: 'guru', is_active: 1, password: ''
})

// Load Overview
const loadOverview = async () => {
  isLoading.value = true
  try {
    const [resKelas, resSiswa, resUsers] = await Promise.all([
      api.get('/kelas'),
      api.get('/siswa?limit=50'),
      api.get('/users')
    ])
    kelasList.value = resKelas.data.data
    const users = resUsers.data.data.users
    stats.value = {
      totalSiswa: resSiswa.data.data.pagination.total,
      totalKelas: kelasList.value.length,
      totalGuru: users.filter(u => u.role === 'guru').length,
      totalUser: resUsers.data.data.pagination.total
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

// Load Siswa
const loadSiswa = async () => {
  isLoadingSiswa.value = true
  try {
    const res = await api.get('/siswa', {
      params: { page: paginasiSiswa.value.page, limit: paginasiSiswa.value.limit, search: searchSiswa.value }
    })
    siswaList.value = res.data.data.siswa
    paginasiSiswa.value = res.data.data.pagination
  } catch (err) {
    console.error(err)
  } finally {
    isLoadingSiswa.value = false
  }
}

const changePageSiswa = (page) => {
  paginasiSiswa.value.page = page
  loadSiswa()
}

const openSiswaModal = (mode, siswa = null) => {
  siswaModalMode.value = mode
  siswaError.value = ''
  if (mode === 'edit' && siswa) {
    selectedSiswaId.value = siswa.id
    siswaForm.value = {
      nis: siswa.nis, nisn: siswa.nisn || '',
      nama_lengkap: siswa.nama_lengkap,
      jenis_kelamin: siswa.jenis_kelamin,
      kelas_id: siswa.kelas_id || '',
      tempat_lahir: siswa.tempat_lahir || '',
      tanggal_lahir: siswa.tanggal_lahir || '',
      nama_orang_tua: siswa.nama_orang_tua || '',
      no_telepon_orang_tua: siswa.no_telepon_orang_tua || '',
      status: siswa.status, password: ''
    }
  } else {
    selectedSiswaId.value = null
    siswaForm.value = {
      nis: '', nisn: '', nama_lengkap: '', jenis_kelamin: '',
      kelas_id: '', tempat_lahir: '', tanggal_lahir: '',
      nama_orang_tua: '', no_telepon_orang_tua: '',
      status: 'aktif', password: ''
    }
  }
  showSiswaModal.value = true
}

const submitSiswa = async () => {
  if (!siswaForm.value.nis || !siswaForm.value.nama_lengkap || !siswaForm.value.jenis_kelamin) {
    siswaError.value = 'NIS, Nama Lengkap, dan Jenis Kelamin wajib diisi!'
    return
  }
  isSubmittingSiswa.value = true
  siswaError.value = ''
  try {
    if (siswaModalMode.value === 'tambah') {
      await api.post('/siswa', siswaForm.value)
    } else {
      await api.patch(`/siswa/${selectedSiswaId.value}`, siswaForm.value)
    }
    showSiswaModal.value = false
    loadSiswa()
    loadOverview()
  } catch (err) {
    siswaError.value = err.response?.data?.message || 'Gagal menyimpan data'
  } finally {
    isSubmittingSiswa.value = false
  }
}

const hapusSiswa = async (siswa) => {
  if (!confirm(`Hapus siswa ${siswa.nama_lengkap}?`)) return
  try {
    await api.delete(`/siswa/${siswa.id}`)
    loadSiswa()
    loadOverview()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus siswa')
  }
}

// Load Guru
const loadGuru = async () => {
  isLoadingGuru.value = true
  try {
    const res = await api.get('/users')
    guruList.value = res.data.data.users.filter(u => u.role === 'guru' || u.role === 'admin')
  } catch (err) {
    console.error(err)
  } finally {
    isLoadingGuru.value = false
  }
}

const openGuruModal = (mode, guru = null) => {
  guruModalMode.value = mode
  guruError.value = ''
  if (mode === 'edit' && guru) {
    selectedGuruId.value = guru.id
    guruForm.value = {
      nama: guru.nama, email: guru.email,
      role: guru.role, is_active: guru.is_active, password: ''
    }
  } else {
    selectedGuruId.value = null
    guruForm.value = { nama: '', email: '', role: 'guru', is_active: 1, password: '' }
  }
  showGuruModal.value = true
}

const submitGuru = async () => {
  if (!guruForm.value.nama || !guruForm.value.email) {
    guruError.value = 'Nama dan Email wajib diisi!'
    return
  }
  if (guruModalMode.value === 'tambah' && !guruForm.value.password) {
    guruError.value = 'Password wajib diisi!'
    return
  }
  isSubmittingGuru.value = true
  guruError.value = ''
  try {
    if (guruModalMode.value === 'tambah') {
      await api.post('/users', guruForm.value)
    } else {
      const payload = {
        nama: guruForm.value.nama,
        email: guruForm.value.email,
        role: guruForm.value.role,
        is_active: guruForm.value.is_active
      }
      await api.patch(`/users/${selectedGuruId.value}`, payload)
    }
    showGuruModal.value = false
    loadGuru()
    loadOverview()
  } catch (err) {
    guruError.value = err.response?.data?.message || 'Gagal menyimpan data'
  } finally {
    isSubmittingGuru.value = false
  }
}

const hapusGuru = async (guru) => {
  if (!confirm(`Hapus ${guru.nama}?`)) return
  try {
    await api.delete(`/users/${guru.id}`)
    loadGuru()
    loadOverview()
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus')
  }
}

onMounted(() => {
  loadOverview()
  loadSiswa()
  loadGuru()
})
</script>