import router from './router';
import 'mdui/mdui.css';
import 'mdui';
import './js/color';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(router).mount('#app');
