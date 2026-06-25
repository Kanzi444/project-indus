<template>
  <div class="min-h-screen bg-slate-950 flex">

    <!-- Sidebar Kiri (hanya muncul kalau sudah login) -->
    <aside v-if="isLoggedIn" class="w-56 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50">
      
      <!-- Logo -->
      <div class="p-5 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-4-9 4 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <p class="text-white font-bold text-sm">SIS PPLG</p>
            <p class="text-[10px] text-slate-500">SMK Indonesia</p>
          </div>
        </div>
      </div>

      <!-- Menu Navigasi -->
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto">

        <!-- Label -->
        <p class="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-2 pb-1">Menu Utama</p>

        <!-- Menu Admin -->
        <template v-if="userRole === 'admin'">
          <router-link to="/dashboard/admin"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="$route.path === '/dashboard/admin'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'">
            <span class="text-base">📊</span>
            Dashboard
          </router-link>

          <router-link to="/dashboard/guru"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="$route.path === '/dashboard/guru'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'">
            <span class="text-base">📋</span>
            Absensi & Jurnal
          </router-link>

          <router-link to="/kenaikan-kelas"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            :class="$route.path === '/kenaikan-kelas'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'">
            <span class="text-base">🎓</span>
            Kenaikan Kelas
          </router-link>
        </template>

        <!-- Menu Guru -->
        <template v-if="userRole === 'guru'">
   <router-link to="/manajemen-siswa"
  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
  :class="$route.path === '/manajemen-siswa'
    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
    : 'text-slate-400 hover:text-white hover:bg-slate-800'">
  <span class="text-base">👨‍🎓</span>
  Manajemen Siswa
</router-link>

<router-link to="/manajemen-guru"
  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
  :class="$route.path === '/manajemen-guru'
    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
    : 'text-slate-400 hover:text-white hover:bg-slate-800'">
  <span class="text-base">👨‍🏫</span>
  Manajemen Guru
</router-link>
        </template>

      </nav>

      <!-- User Info & Logout -->
      <div class="p-3 border-t border-slate-800">
        <div class="flex items-center gap-3 px-3 py-2 mb-2">
          <div class="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {{ userName.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-white truncate">{{ userName }}</p>
            <p class="text-[10px] text-slate-400 capitalize">{{ userRole }}</p>
          </div>
        </div>
        <button @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold rounded-xl transition-all">
          <span>🚪</span> Logout
        </button>
      </div>

    </aside>

    <!-- Konten Utama -->
    <main :class="isLoggedIn ? 'ml-56 flex-1 p-6' : 'flex-1'">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const token = ref(localStorage.getItem('token') || '')
const userRole = ref(localStorage.getItem('user_role') || '')
const userName = ref('')

const loadUserData = () => {
  token.value = localStorage.getItem('token') || ''
  userRole.value = localStorage.getItem('user_role') || ''
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    userName.value = user.nama || ''
  }
}

loadUserData()

const isLoggedIn = computed(() => {
  return !!token.value && route.path !== '/login'
})

watch(route, () => {
  loadUserData()
})

onMounted(() => {
  window.addEventListener('storage', loadUserData)
})

onUnmounted(() => {
  window.removeEventListener('storage', loadUserData)
})

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('user_role')
  token.value = ''
  userRole.value = ''
  userName.value = ''
  router.push('/login')
}
</script>