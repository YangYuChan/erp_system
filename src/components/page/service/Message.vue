<template>
	<div class="wechat-container">
		<div class="wechat-header">
			<h1>短信服务</h1><br />
			<p>当前剩余短信：{{count}}条</p>
			<p>价格：0.05元/条</p>
			<p>样式：固定、适用自己品牌签名</p>
			<h1 style="margin-top: 50px;">购买</h1><br />
			<p>如需购买请联系<span style="color:red">17721062233</span></p>
		</div>
	</div>
</template>

<script type="text/javascript">
	import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common'
	import valid from '../../../common/js/validate'
	import '../../../common/js/sha512.js'
	const Axios = new AXIOS();

	export default {
		data() {
			return {
				path: global_.path,
				token:'',
				info:'',
				count:0
			};
		},
		mounted() {
				this.$nextTick(() => {
					this.token = sessionStorage.getItem('token');
					this.getMessage();
				});
		},
		methods: {
			getMessage(){
				this.$axios({
					url: this.path + 'brand/sms/info',
					method: 'get',
					transformRequest: [function(params) {
						let ret = ''
						for(let it in params) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
						}
						return ret
					}],
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': this.token,
					}
				}).then(res => {
					if(res.data.code === 100000){
						this.count = res.data.info.remainSms;
						this.info = res.data.info
					}else{
						this.count = 0
					}
				}).catch(error => {
					console.log(error)
				});
			},
		}
	}
</script>

<style scoped="scoped">
	.wechat-container{
		margin: 30px 100px;
	}
	.wechat-header{
		width: 400px;
		float: left;
	}
	.wechat-header p{
		line-height: 30px;
	}
</style>
