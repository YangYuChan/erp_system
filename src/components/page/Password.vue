<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="logo"><img src="../../../static/img/logo.png" alt="" /></div>

      <el-tabs v-model="activeLogin" type="border-card" id="login-card">
        <el-tab-pane label="修改密码" name="first">
          <el-form class="demo-ruleForm" :model="updateForm" :rules="rules" ref="updateForm" >
            <el-form-item prop="phone">
              <el-input v-model="updateForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="vaCode" >
              <el-input v-model="updateForm.vaCode" placeholder="请输入验证码" style="float: left;width:50%"></el-input>
              <span>
                    	<el-button @click.native="getVaCode" style="float: right;width: 40%;" v-if="!sendMsgDisabled">
                    		获取验证码
                    	</el-button>
                    	<el-button style="float: right;width: 40%;color: #8C939D;" v-if="sendMsgDisabled" disabled="disabled">
                    		{{time +"秒"}}
                    	</el-button>
                    </span>
            </el-form-item>
            <el-form-item prop="newPassword">
              <el-input type="password" v-model="updateForm.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="password2">
              <el-input type="password" v-model="updateForm.password2" placeholder="请再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 40px;margin-bottom: 40px">
              <el-button @click="goBack" style="width: 35.2%;">返回登录</el-button>
              <el-button type="primary" @click.native.prevent="handleSubmit" @keyup.13="handleSubmit" style="width: 60%;">确定重置密码</el-button>
            </el-form-item>
          </el-form>
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
        updateForm: {
          phone: '',
          vaCode:'',
          newPassword: '',
          password2:'',
        },
        token:'',
        rules: {
          phone: [{
            required: true,
            validator: valid.checkUserPhone,
            trigger: 'blur'
          }],
          newPassword: [{
            required: true,
            validator: valid.checkRegPassword,
            trigger: 'blur'
          }],
          password2: [{
            required: true,
            validator: valid.checkRegPasswordBean,
            trigger: 'blur'
          }],
          vaCode: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }],
        },
        time:60,
        sendMsgDisabled:false,
      };
    },
    methods: {
      goBack() {
        this.$router.push('/login');
      },
      getVaCode(){
        this.$refs.updateForm.validateField(('phone'),(error )=> {
          if(error == ''){
            this.$axios({
              url: this.path + 'user/validate/vacode',
              method: 'post',
              data:{
                phone:this.updateForm.phone,
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
              }else{
                this.$message({
                  message: res.data.message,
                  type: 'error'
                });
              }
            }).catch(error =>{
              console.log(error)
            });
          }
        })
      },
      handleSubmit() {
        let pwd = sha512(this.updateForm.newPassword);
        this.$refs.updateForm.validate((valid) => {
          if(valid) {
            this.$axios({
              url: this.path + 'sys/user/password/reset',
              method: 'post',
              data: {
                phone: this.updateForm.phone,
                newPassword: pwd,
                vaCode:this.updateForm.vaCode,
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
                  message: '重置密码成功',
                  type: 'success'
                });
                this.$router.push('/login');
              }else{
                this.$message({
                  message: res.data.message,
                  type: 'error'
                });
              }
            }).catch(error => {
              console.log(error)
            });
          }
        });
      },
    }
  }
</script>
<style>
  .el-button:focus, .el-button:hover{
    color: #f9690e;
    border-color: #f9690e;
  }
  .forgetPsw{
    margin-top:10px;
    text-align: right;
  }
  .forgetPsw a{
    color: #666;
  }
  .forgetPsw a:hover{
    color: #f9690e;
  }
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
    margin-top: 0px;
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
