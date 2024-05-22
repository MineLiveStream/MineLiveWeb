import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    { path: '/', component: () => import('../views/Home.vue'), name: 'Home', meta: {title: '首页'}},
    { path: '/stream', component: () => import('../views/Stream.vue'), name: 'Stream', meta: {title: '推流'}},
    { path: '/material', component: () => import('../views/Material.vue'), name: 'Material', meta: {title: '素材'}},
    { path: '/admin', component: () => import('../views/Admin.vue'), name: 'Admin', meta: {title: '管理'}},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title || "404"} - MineLive`;
    next();
})

export default router