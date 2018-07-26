<template>
	<div class="register-container clearfix">
		<div class="register-wrapper">
			<h2 class="registe-title">用户注册</h2>
			<div class="step-group clearfix">
				<div class="step-item step-item1 step-active"><span class="num">1</span></div>
				<div class="step-item step-item2 step-active"><span class="num">2</span></div>
				<div class="step-item step-item3"><span class="num">3</span></div>
				<div class="step-item step-item4"><span class="num">4</span></div>
			</div>
	<div class="step2">
		<el-form class="phoneForm clearfix" :model="ruleForm" :rules="rules" ref="ruleForm">
                 <el-form-item prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="vaCode" >
                    <el-input v-model="ruleForm.vaCode" placeholder="请输入动态验证码" style="float: left;width:50%"></el-input>
                    <span>
                    	<el-button @click.native="getVaCode" style="float: right;width: 40%;color: #8C939D;" v-if="!sendMsgDisabled">
                    		获取验证码
                    	</el-button>
                    	<el-button style="float: right;width: 40%;color: #8C939D;" v-if="sendMsgDisabled" disabled="disabled">
                    		{{time +"秒后重新发送"}}
                    	</el-button>
                    </span>
                </el-form-item>
        </el-form>
	</div>
			<div class="reg-btn-group">
					<el-button @click.native="handlePreStep" style="width: 200px;color: #FFFFFF;">上一步</el-button>
		          <el-button @click.native="handleRegister" style="width: 200px" type="primary">注册</el-button>
			</div>
	</div>
	</div>
</template>

<script type="text/javascript">
	import AXIOS from '../../axios/axios';
	import global_ from '../../common/js/common';
	import valid from '../../common/js/validate';
	import $ from 'jquery';
	import '../../common/js/sha512.js';
	const Axios = new AXIOS();
	export default {
		name:'step2',
		data() {
	      return {
	      	path: global_.path,
	      	temToken:'',
	      	time:60,
	      	sendMsgDisabled:false,
	        ruleForm: {
	          phone: '',
	          vaCode: ''
	        },
	        rules: {
	          phone: [
	            {required: true, validator: valid.checkPhone, trigger: 'blur' }
	          ],
	        },
	      }
	   },
	   methods: {
	   	handlePreStep(){
	   		this.$router.push('/step1');
	   	},
        getVaCode(){
        	 this.$refs.ruleForm.validate((valid) => {
        	 	if (valid) {
		        	this.$axios({
								url: this.path + 'user/register/vacode',
								method: 'post',
								data:{
									phone:this.ruleForm.phone,
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
								if(res.data.code === 100000){
								this.$message({
				                  message: '验证码发送成功',
				                  type: 'success'
				                });
				                let me = this;
							        me.sendMsgDisabled = true;
							        let interval = window.setInterval(function() {
							          if ((me.time--) <= 0) {
							            me.time = 60;
							            me.sendMsgDisabled = false;
							            window.clearInterval(interval);
							          }
							        }, 1000);
				              }else if(res.data.code === 100001){
				              	this.$message({
				                  message: '账号已存在',
				                  type: 'error'
				                });
				              }else{
				              	this.$message({
				                  message: '验证码发送失败，请重新发送',
				                  type: 'error'
				                });
				              }
				            }).catch(error =>{

				            	console.log(error)
				            });
		        }
		   })
        },
        handleRegister() {
	        this.$refs.ruleForm.validate((valid) => {
	            if (valid) {
	                this.$axios({
						url: this.path + 'user/register/vacode/validate',
						method: 'post',
						data:{
							phone:this.ruleForm.phone,
							vaCode:this.ruleForm.vaCode,
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
					if(res.data.code == 100000){
				                this.temToken = res.data.token;
				                this.verifyPhone();
				                sessionStorage.setItem('userPhone', this.ruleForm.phone);
				                sessionStorage.setItem('temToken', this.temToken);

				              }else if(res.data.code === 100001){
				              	this.$message({
				                  message: '手机号已注册',
				                  type: 'error'
				                });
				              }else if(res.data.code === 100004){
				              	this.$message({
				                  message: '验证码不正确，请重新输入',
				                  type: 'error'
				                });
				              }else if(res.data.code === 100021){
				              	this.$message({
				                  message: '手机号或验证码错误',
				                  type: 'error'
				                });
				              }
		            }).catch(error =>{
		            	console.log(error)
		            });
          		}
        });
     },
     verifyPhone(){
     	 this.$axios({
						url: this.path + 'user/register/userinfo',
						method: 'post',
						data:{
							phone:this.ruleForm.phone,
							token:this.temToken,
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
					if(res.data.code === 100000){
							let userNickName = res.data.userDetail.nickName;
							let userId = res.data.userDetail.id;
							sessionStorage.setItem('userNickName', userNickName);
							sessionStorage.setItem('userId', userId);
				        }else if(res.data.code === 100016){
				        	sessionStorage.setItem('userNickName', '');
				        	sessionStorage.setItem('userId', '');
				        }
				        this.$router.push('/step3');
		            }).catch(error =>{
		            	console.log(error)
		            });
     }
    }

	}
</script>
<style type="text/css">

</style>
