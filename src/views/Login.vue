<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
    
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

    <div class="w-full max-w-md bg-slate-900 border-2 border-cyan-500 rounded-2xl p-8 md:p-10 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] z-10">
      
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-4-9 4 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white tracking-wide">Sistem Informasi Sekolah</h2>
        <p class="text-slate-400 text-sm mt-1">Edisi Dashboard PPLG / SMK Indonesia</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Email</label>
          <input 
            type="email" 
            v-model="form.email"
            placeholder="Masukkan email anda"
            class="w-full px-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">Password</label>
          <input 
            type="password" 
            v-model="form.password"
            placeholder="Masukan sandi"
            class="w-full px-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
            required
          />
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">Memproses...</span>
          <span v-else>Login ke Dashboard</span>
        </button>

      </form>

      <div class="text-center mt-8 text-xs text-slate-500">
        &copy; 2026 Tim Pengembang PPLG. All Rights Reserved.
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const form = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  console.log('Tombol login diklik') // ← tambah ini
  console.log('Email:', form.email)   // ← tambah ini
  console.log('Password:', form.password) // ← tambah ini

  try {
    const res = await api.post('/auth/login', {
      email: form.email,
      password: form.password
    })

    console.log('Response:', res.data) // ← tambah ini

    const { token, user } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('user_role', user.role)

    if (user.role === 'admin') {
      router.push('/dashboard/admin')
    } else if (user.role === 'guru') {
      router.push('/dashboard/guru')
    } else {
      router.push('/dashboard')
    }

  } catch (err) {
    console.log('Error:', err) // ← tambah ini
    errorMessage.value = err.response?.data?.message || 'Login gagal, coba lagi!'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
input {
  transition: all 0.2s ease-in-out;
}
</style>