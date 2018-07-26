/**
 * http配置
 */

import axios from 'axios'
import { Loading, Message } from 'element-ui'
import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router)
const router = new Router();

// http请求拦截器

axios.interceptors.request.use(config => {
	return config
}, error => {
	Message.error({
		message: '请求失败'
	})

	return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {
	return data
}, error => {
	Message.error({
		message: '加载失败'
	})
	return Promise.reject(error)
})

export default axios
