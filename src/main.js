// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from  'vuex'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import G2 from '@antv/g2';
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment';

import ueditor  from './components/vue-ueditor'
import './router/http.js'
import './common/js/sha512.js'
import './common/js/jquery.datetimepicker.full.js'
import $ from 'jquery'

import Area from './components/common/Area.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import "../static/style/index.scss";

/* eslint-disable no-new */
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(ueditor);
Vue.use(moment);
Vue.use(VueQuillEditor)
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

