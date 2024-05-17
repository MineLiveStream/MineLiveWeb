import { createRouter, createWebHistory } from 'vue-router'
import Home from '../view/Home.vue'
import Stream from '../view/Stream.vue'

const suffix = " - MineLive";

const routes = [
    { path: '/', component: Home, name: 'Home', meta: {title: '首页' + suffix}},
    { path: '/stream', component: Stream, name: 'Stream', meta: {title: '推流' + suffix}},
    { path: '/material', component: Stream, name: 'Material', meta: {title: '素材' + suffix}},
    { path: '/admin', component: Stream, name: 'Admin', meta: {title: '管理' + suffix}},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title || "404"} - MineLive`;
    next();
})

export default router