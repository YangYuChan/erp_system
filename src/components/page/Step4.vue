<template>
	<div class="register-container clearfix">
		<div class="register-wrapper">
			<h2 class="registe-title">用户注册</h2>
			<div class="step-group clearfix">
				<div class="step-item step-item1 step-active"><span class="num">1</span></div>
				<div class="step-item step-item2 step-active"><span class="num">2</span></div>
				<div class="step-item step-item3 step-active"><span class="num">3</span></div>
				<div class="step-item step-item4 step-active"><span class="num">4</span></div>
			</div>
	<div class="step4 clearfix">
		<h2 class="hint">恭喜您，您的商家账号已创建成功<br />请点击下方登录按钮进行登录</h2>
	</div>
	<div class="reg-btn-group">
				<el-button @click.native="handlePublish" style="width: 200px" type="primary">立即登录</el-button>
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
		name:'step4',
		data() {
	      return {
	      	path: global_.path,
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
 		handlePublish(){
 			this.$router.push('/login');
 		}
    }
	
	}
</script>
<style type="text/css">
	
</style>