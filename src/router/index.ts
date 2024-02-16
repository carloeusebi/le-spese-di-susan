import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CreateExpense from '@/views/CreateExpense.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/create/',
        name: 'Create',
        component: CreateExpense,
    },
    {
        path: '/expense/:id',
        name: 'Edit',
        component: CreateExpense,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
