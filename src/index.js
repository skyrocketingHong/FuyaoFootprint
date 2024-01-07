import { createApp, h } from 'vue';
import store from './store';
import App from './App.vue';
import './plugins/echarts';
import './plugins/basic';

createApp(App).use(store).mount('#middle-map');
