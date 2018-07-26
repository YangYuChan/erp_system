<template>
	<div class="register clearfix">
		<div class="register-wrapper">
				<h2 class="registe-title">用户注册</h2>
		    <div class="step-group ">
		      <el-steps :space="200" :active="step" class="step">
		        <el-step title="第一步" description=""></el-step>
		        <el-step title="第二步" description=""></el-step>
		        <el-step title="第三步" description=""></el-step>
		        <el-step title="完成注册" description=""></el-step>
		      </el-steps>
		
		      <transition name="fade">
		        <router-view class="view" ref="step2"></router-view>
		      </transition>
		        <div class="but-group">
		         
		         <div class="first-btn-group" v-show="nextStep">
		         	<div class="checkbox-wrapper">
					<el-checkbox v-model="checked" class="remember">我已阅读</el-checkbox>
					</div>
			         <div v-if="checked == true">
						<el-button type="primary" @click.native="handleNextStep" style="width: 200px;">我已阅读服务协议，下一步</el-button>
					</div>
					<div v-else>
						<el-button type="primary" @click.native="handleNextStep" style="width: 200px;" disabled="disabled">我已阅读服务协议，下一步</el-button>
					</div>
		         </div>
		         
		          <el-button @click.native="handlePreStep" v-show="preStep" style="width: 200px;">上一步</el-button>
		          <el-button @click.native="handleRegister" v-show="nextRegisterStep" style="width: 200px" type="primary">注册</el-button>
		          <el-button @click.native="handleNextLogin" v-show="nextSubmitStep" style="width: 200px" type="primary" >下一步</el-button>
		          <el-button @click.native="handlePublish" v-show="publish" style="width: 200px" type="primary">立即登录</el-button>
		        </div>
		    </div>
			</div>
		</div>
	
	
</template>
<script type="text/javascript">
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	import '../../common/js/sha512.js'
//	import $ from 'jquery';
	const Axios = new AXIOS();
	export default {
		name:'register',
    data() {
      return {
      	path: global_.path,
      	disabled:true,
      	checked:false,
        isRouter: false,
        preStep: false,
        nextRegisterStep:false,
        nextSubmitStep:false,
        nextStep: true,
        publish: false,
        step: 1
      };
    },
    methods: {
      handlePreStep() {
            this.$router.go(-1);
            this.step--;
            this.goStep(this.step);
      },
      handleNextStep() {
      	this.$router.push('/register/step2');
          var _this = this;
          setTimeout(function () {
              if(_this.isRouter){
                  _this.step = 2;
                  _this.goStep(2);
              }
          })
      },
      handleRegister(){
      	this.$refs.step2.Register();
      	var _this = this;
      	setTimeout(function () {
              if(_this.isRouter){
                  _this.step++;
                  _this.goStep(_this.step);
              }
          })
      },
      handleNextLogin(){
      	this.$refs.step2.submitBrand();
      	this.$router.push('/register/step4');
      	var _this = this;
      	setTimeout(function () {
              if(_this.isRouter){
                  _this.step++;
                  _this.goStep(_this.step);
              }
          })
      },
      handlePublish() {
       this.$router.push('/login');
      },
      goStep: function (n) {
        switch (n) {
          case 1 :
            this.preStep = false;this.nextStep = true;this.nextRegisterStep = false,this.nextSubmitStep = false,this.publish = false;
            break;
          case 2 :
            this.preStep = true;this.nextStep = false;this.nextRegisterStep = true,this.nextSubmitStep = false,this.publish = false;
            break;
          case 3 :
            this.preStep = false;this.nextStep = false;this.nextRegisterStep = false,this.nextSubmitStep = true,this.publish = false;
            break;
          case 4 :
            this.preStep = false;this.nextStep = false;this.nextRegisterStep = false,this.nextSubmitStep = false,this.publish = true;
            break;
        }
      }
    },
    watch:{
        '$route': function (to,from) {
            this.isRouter = true;
        }
    }
  }
</script>
<style scoped>
	
</style>