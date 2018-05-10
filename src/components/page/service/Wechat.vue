<template>
	<div class="wechat-container">
		<div class="wechat-header">
			<h1>服务号的功能</h1><br />
			<p>1.帮助健身房销售团课私教课</p>
			<p>2.查看连锁门店</p>
			<p>3.查看我在未度上的运动数据</p>
			<p>4.员工登陆后协助员工预售</p>
			<p>5.用户可预约购买团课私教课</p>
			<p>6.用户可查看自己预约的课程</p>
		</div>
		<div class="wechat-section">
			<h1>注意事项</h1><br />
			<p style="color:red">现有服务号页面会被覆盖，自动生成以下样式服务号</p>
			<div class="wechat-bg clearfix">
				<p class="name">{{brandName}}</p>
			</div>
			<div class="cognate-btn">
				<span v-show="noAuthority">
					<el-button type="primary" @click="getUrl">生成授权</el-button>
				</span>
				<span v-show="hasAuthority">
					<el-button type="primary" disabled>已授权</el-button>
				</span>
			</div>
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
				brandName:'轻重健身',
				noAuthority:null,
				hasAuthority:null,
				url:''
		
			};
		},
		mounted() {
				this.$nextTick(() => {
					this.token = sessionStorage.getItem('token');
					this.getIsbind();
				});
		},
		methods: {
			getIsbind() {
				this.$axios({
					url: this.path + 'wechat/authorizer/isbind',
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
						this.noAuthority = false;
						this.hasAuthority = true;
					}else if(res.data.code === 300047){
						this.noAuthority = true;
						this.hasAuthority = false;
					}
				}).catch(error => {
					console.log(error)
				});
			},
			getUrl(){
				this.$axios({
					url: this.path + 'wechat/component/authorizer/url',
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
						location.href = res.data.url;
					}else{
						this.$message({
							message: '请求失败',
							type: 'error'
						});
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
	.wechat-section{
		float: left;
		margin-left: 100px;
	}
	.wechat-bg{
		position: relative;
		margin-top: 20px;
		width: 300px;
		height: 476px;
		background: url('../../../../static/img/wechat-bg.png') 0 0 no-repeat;
	}
	.wechat-bg .name{
		color: #FFFFFF;
		margin: 9px 40px 0;
		font-size: 14px;
	}
	.cognate-btn{
		margin:30px 100px
	}
</style>
