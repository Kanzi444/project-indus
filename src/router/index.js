import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
import DashboardGuru from '@/views/DashboardGuru.vue'
import KenaikanKelas from '@/views/KenaikanKelas.vue'
import ManajemenSiswa from '@/views/ManajemenSiswa.vue'
import ManajemenGuru from '@/views/ManajemenGuru.vue'

const routes = [
  {
  path: '/manajemen-siswa',
  name: 'ManajemenSiswa',
  component: ManajemenSiswa,
  meta: { requiresAuth: true, role: 'admin' }
},
{
  path: '/manajemen-guru',
  name: 'ManajemenGuru',
  component: ManajemenGuru,
  meta: { requiresAuth: true, role: 'admin' }
},
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/admin',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/guru',
    name: 'DashboardGuru',
    component: DashboardGuru,
    meta: { requiresAuth: true, role: 'guru' }
  },
  {
    path: '/kenaikan-kelas',
    name: 'KenaikanKelas',
    component: KenaikanKelas,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard - cek login sebelum masuk halaman
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
})

export default router