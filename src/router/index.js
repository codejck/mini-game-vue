import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '',
        name: 'Home',
        component: Home
    }, {
        path: '/puzzle',
        name: 'Puzzle',
        component: () => import('@/views/Puzzle.vue')
    }, {
        path: '/magic',
        name: 'Magic',
        component: () => import('@/views/Magic.vue')
    }, {
        path: '/horse',
        name: 'Horse',
        component: () => import('@/views/Horse.vue')
    }, {
        path: '/turntable',
        name: 'Turntable',
        component: () => import('@/views/Turntable.vue')
    }, {
        path: '/hanoi',
        name: 'Hanoi',
        component: () => import('@/views/Hanoi.vue')
    }, {
        path: '/findmatch',
        name: 'Findmatch',
        component: () => import('@/views/Findmatch.vue')
    }]
})

export default router