<template>
  <div class="min-h-screen bg-slate-950 text-white flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 p-6">
      
      <h1 class="text-2xl font-bold mb-8 text-cyan-400">
        Dashboard
      </h1>

      <nav class="space-y-4">

        <router-link 
          to="/dashboard/admin"
          class="block bg-slate-800 px-4 py-3 rounded-lg hover:bg-slate-700"
        >
          Dashboard Admin
        </router-link>

        <router-link 
          to="/dashboard/guru"
          class="block bg-slate-800 px-4 py-3 rounded-lg hover:bg-slate-700"
        >
          Dashboard Guru
        </router-link>
        <router-link 
  to="/kenaikan-kelas"
  class="block bg-slate-800 px-4 py-3 rounded-lg hover:bg-slate-700"
>
        <span class="opacity-70">📈</span> Kenaikan Kelas
        </router-link>
      </nav>

    </aside>

    <!-- Content -->
    <main class="flex-1 p-8">
      <router-view />
    </main>

  </div>
</template>