<template>
	<div class="register-container clearfix">
		<div class="register-wrapper">
			<h2 class="registe-title">用户注册</h2>
			<div class="step-group clearfix">
				<div class="step-item step-item1 step-active"><span class="num">1</span></div>
				<div class="step-item step-item2 step-active"><span class="num">2</span></div>
				<div class="step-item step-item3 step-active"><span class="num">3</span></div>
				<div class="step-item step-item4"><span class="num">4</span></div>
			</div>
	<div class="step3">
		<el-form class="phoneForm clearfix" :model="ruleForm" :rules="rules" ref="ruleForm">
			<div class="account-msg no-account" v-if="uname !='' && uname != null">
				<el-form-item prop="brand">
					<el-input v-model="ruleForm.brand" placeholder="商家品牌名称"></el-input>
				</el-form-item>
				<el-form-item prop="realName">
					<el-input v-model="ruleForm.realName" placeholder="真实姓名"></el-input>
				</el-form-item>
				<p class="tips">检测到您的未度app帐号</p>
				<p class="account-name">账号昵称：<b>{{uname}}</b></p>
				<p>您可直接点击下一步登录</p>
			</div>

			<div class="account-msg has-account" v-else>
				<el-form-item prop="brand">
					<el-input v-model="ruleForm.brand" placeholder="商家品牌名称"></el-input>
				</el-form-item>
				<el-form-item prop="realName">
					<el-input v-model="ruleForm.realName" placeholder="真实姓名"></el-input>
				</el-form-item>
				<p class="tips">检测到您未注册未度app，已帮您生成未度帐号</p>
				<p class="account-name">账号：<b>{{ruleForm.phone}}</b></p>

				<el-form-item prop="password">
					<el-input v-model="ruleForm.password" placeholder="未度帐号密码" type="password"></el-input>
				</el-form-item>
				<el-form-item prop="pageBean">
					<el-input v-model="ruleForm.pageBean" placeholder="再次输入密码" type="password"></el-input>
				</el-form-item>
				<div class="scan-code-box">
					<span class="scan-code">请扫码下载未度app：</span>
					<span><img src="../../../static/img/android.png" width="100"/></span>
					<span><img src="../../../static/img/ios.png" width="100"></span>
				</div>
			</div>
		</el-form>
	</div>
	<div class="reg-btn-group">
				<el-button @click.native="handleNextLogin" style="width: 200px" type="primary" >下一步</el-button>
			</div>
	</div>
	</div>
</template>

<script type="text/javascript">
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	import '../../common/js/sha512.js'
	const Axios = new AXIOS();
	export default {
		name: 'step2',
		data() {
			return {
				path: global_.path,
				ruleForm: {
					temToken:'',
					phone: '',
					brand: '',
					realName: '',
					password: '',
					pageBean: '',
				},
				uid: '',
				uname: '',
				rules: {
					brand: [{
						required: true,
						validator: valid.checkBrand,
						trigger: 'blur'
					}],
					realName: [{
						required: true,
						validator: valid.checkRealName,
						trigger: 'blur'
					}],
					password: [{
						required: true,
						validator: valid.checkRegPassword,
						trigger: 'blur'
					}],
					pageBean: [{
						required: true,
						validator: valid.checkRegPasswordBean,
						trigger: 'blur'
					}],
				}
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.ruleForm.temToken = sessionStorage.getItem('temToken');
				if(this.ruleForm.temToken =='' || this.ruleForm.temToken == null){
					this.$router.push('/step1');
				}
				this.uname = sessionStorage.getItem('userNickName');
				this.uid = sessionStorage.getItem('userId');
				this.ruleForm.phone = sessionStorage.getItem('userPhone');
			});
		},
		methods: {
			handleNextLogin() {
				if(this.password == null || this.password ==''){
					this.password = 0;
				}
				let pwd = sha512(this.ruleForm.password);
				this.$refs.ruleForm.validate((valid) => {
					if(valid) {
						this.$axios({
							url: this.path + 'user/register/signup',
							method: 'post',
							data: {
								token:this.ruleForm.temToken,
								phone: this.ruleForm.phone,
								brand: this.ruleForm.brand,
								realName: this.ruleForm.realName,
								password: pwd,
								pageBean: pwd,
							},
							transformRequest: [function(params) {
								let ret = ''
								for(let it in params) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
								}
								return ret
							}],
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
							}
						}).then(res => {
							if(res.data.code === 100000) {
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$router.push('/step4');
							} else {
								this.$message({
									message: '提交失败',
									type: 'error'
								});
							}
						}).catch(error => {
							console.log(error)
						});
					}
				})
			},
		}

	}
</script>
<style type="text/css">
</style>