import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Api from './api';
import config from '../config';

const WS = new Api();
// eslint-disable-next-line
WS.init(`ws://${location.hostname}:${config.server.port.ws}`, store);

const app = createApp(App);
app.config.globalProperties.$api = WS; 
app.use(store).use(router).mount('#app')
