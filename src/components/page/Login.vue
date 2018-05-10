<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="logo"><img src="../../../static/img/logo.png" alt="" /></div>

			<el-tabs v-model="activeLogin" type="border-card" id="login-card">
				<el-tab-pane label="用户登录" name="first">
					<el-form class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" >
						<el-form-item prop="uname">
							<el-input v-model="ruleForm.username" placeholder="请输入手机号"></el-input>
						</el-form-item>
						<el-form-item prop="pwd">
							<el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
						</el-form-item>

						<el-form-item style="margin-top: 40px;">
							<!--<el-button style="width:48%;" @click.native="Register">注册</el-button>-->
							<el-button type="primary" @click.native.prevent="handleSubmit" @keyup.13="handleSubmit" style="width: 100%;">登录</el-button>
						</el-form-item>
					</el-form>
					<div class="pane-bottom clearfix">
						<a href="javascript:;" @click="getQrCode" class="wechat"><span class="icon"><img src="../../../static/img/wechat.png"/></span><span class="font">微信</span></a>
						<a href="javascript:;" @click="Register" class="register">立即注册</a>
					</div>
				</el-tab-pane>
			</el-tabs>

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
		data() {
			return {
				path: global_.path,
				logining: false,
				activeLogin: 'first',
				uname: '',
				pwd: '',
				ruleForm: {
					username: '',
					password: ''
				},
        token:'',
				rules: {
					username: [{
						required: true,
						validator: valid.checkUsername,
						trigger: 'blur'
					}],
					password: [{
						required: true,
						validator: valid.checkPassword,
						trigger: 'blur'
					}]
				},
				checked: true,
				userId: '',
				userState:'',
        echartStatus:0,
			};
		},
		//  mounted() {
		//			this.$nextTick(() => {
		//				if(this.checked == true){
		//					this.getData();
		//					this.checked = true
		//				}else{
		//					this.checked = false
		//				}
		//			});
		//		},
		methods: {
			Register() {
				this.$router.push('/step1');
			},
			getQrCode() {
				this.$axios({
					url: this.path + 'user/login/qrcode',
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
					}
				}).then(res => {
//					this.userState = 'c4ab024db246cbbcaa653f4e4c27b107';
					//res.data.state;
					setTimeout(this.getWeChatState(res.data.state), 2000);
					window.open(res.data.url, "_blank");

				}).catch(error => {
					console.log(error)
				});
			},
			getWeChatState(state) {
				this.$axios({
					url: this.path + 'user/login/wechat?state='+state,
					method: 'get',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					}
				}).then(res => {

					if(res.data.code === 100000) {
						this.$message({
							message: '登录成功',
							type: 'success'
						});
            this.token = res.data.token;
						sessionStorage.setItem('token', this.token);
						this.getMenu();
					}else if(res.data.code === 300015) {
						setTimeout(this.getWeChatState(this.userState), 2000);
					}else if(res.data.code === 300014) {
						this.$message({
							message: '微信授权失败',
							type: 'error'
						});
					}else if(res.data.code === 300016) {
						this.$message({
							message: '未传入微信登录凭据',
							type: 'error'
						});
					}else if(res.data.code === 300017) {
						this.$message({
							message: '二维码过期，请重新生成',
							type: 'error'
						});
					}else if(res.data.code === 300012) {
						this.$message({
							message: '用户拒绝微信授权登录',
							type: 'error'
						});
					}else if(res.data.code === 300013) {
						this.$message({
							message: '用户未绑定微信账号，请绑定后重试',
							type: 'error'
						});
					}

				}).catch(error => {
					console.log(error +"--------")
				});
			},
			handleSubmit(ev) {
				let pwd = sha512(this.ruleForm.password);
				this.$refs.ruleForm.validate((valid) => {
					if(valid) {
						this.$axios({
							url: this.path + 'sys/user/login',
							method: 'post',
							data: {
								username: this.ruleForm.username,
								password: pwd
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
							if(res.data.code === 100002) {
								this.$message({
									message: '密码不正确，请重新输入',
									type: 'error'
								});
							}else if(res.data.result  === 0) {
								this.$message({
									message: '用户名或密码错误',
									type: 'error'
								});
							}else if(res.data.result === 1) {
								let user = this.ruleForm.username;
								this.token = res.data.token;
								let isAdmin = res.data.isAdmin;
								let sysUserId = res.data.sysUserId;
								sessionStorage.setItem('token', this.token);
								sessionStorage.setItem('user', user);
								sessionStorage.setItem('userId',sysUserId)
								sessionStorage.setItem('isAdmin', isAdmin);
								this.getMenu();
							}else if(res.data.result === 2){
                this.$message({
                  message: '该帐号已禁用',
                  type: 'error'
                });
              }
						}).catch(error => {
							console.log(error)
						});
					}
				});
			},
      getMenu() {
        global_.$options.exportSession(this.getMenu);
        this.$axios({
          url: this.path + 'authority/lookover',
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
        })
          .then((res) => {
            if(res.data.code === 100000) {
              this.echartStatus = res.data.authorities[0].status;
              sessionStorage.setItem("echartStatus",this.echartStatus);
              if(this.echartStatus == 1){
                this.$router.push({
                  path: '/main'
                });
              }else if(this.echartStatus == 0){
                this.$router.push({
                  path: '/index'
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
		}
	}
</script>
<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #1E202A;
	}

	.logo {
		text-align: center;
		margin: 147px auto 70px;
	}

	.logo img {
		width: 326px;
		background-size: cover;
	}

	.ms-title {
		text-align: center;
		font-size: 26px;
		color: #FFFFFF;
		margin-bottom: 80px;
		font-weight: normal;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		width: 500px;
		height: auto;
		margin-left: -300px;
	}

	.demo-ruleForm {
		margin: 50px 100px 0;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
	}

	.el-button:active {
		background: transparent!important;
	}

	.register {
		float: right;
		color: #F9690E;
		margin-top: 15px;
	}

	.register:hover {
		color: #CC4E00;
		text-decoration: underline;
	}

	.pane-bottom {
		background-color: #F1F1F2;
		height: 50px;
		margin-top: 50px;
		padding: 0 20px;
	}

	.wechat .icon {
		display: block;
		margin-top: 14px;
		width: 26px;
		height: 26px;
		float: left;
	}

	.wechat .icon img {
		width: 26px;
		height: 26px;
	}

	.wechat .font {
		display: block;
		float: left;
		color: #474951;
		font-size: 14px;
		margin-left: 5px;
		margin-top: 17px;
	}
</style>
