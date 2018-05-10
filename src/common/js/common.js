import Vue from 'vue'
import AXIOS from '../../axios/axios'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router();
const Axios = new AXIOS();
	var vm = new Vue({
        data() {
			return { //120.76.76.220    192.168.1.100
				path:'http://192.168.1.100:8085/',
				action:'http://192.168.1.100:8085/file/upload/image',
				actionV:'http://192.168.1.100:8085/file/upload/video',
			}
		},
		methods:{
			handleSession(funObj) {
				let token = sessionStorage.getItem('token')
				this.$axios({
					url: this.path + 'sys/user/token/expiration',
					method: 'post',
					data:{
							token:token
					},
					transformRequest: [function(data) {
						let ret = ''
						for(let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
			       }).then(res => {
			         	if(res.data == 0){
			         		this.$message({
								message: '登录超时，请重新登录',
								type: 'error'
							});
							sessionStorage.setItem('token', null);
			         		router.push({ path: '/login' });

			         	}else{
			         		sessionStorage.setItem('token', token);
			         	}
			        }).catch((err) => {
						console.log(err);
					})
			},
		},
		exportSession(funObj){
			vm.handleSession(funObj)
		}

    });

export default vm;
