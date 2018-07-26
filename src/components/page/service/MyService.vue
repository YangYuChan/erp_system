<template>
	<div class="service-container">
    <div class="clearfix">
      <router-link :to="{name:'message'}">
        <div class="message-box">
          <span class="icon"><img src="../../../../static/img/m-icon.png" alt="" /></span>
          <div class="box-title">
            <h2>短信服务</h2>
            <p>剩余{{count}}条</p>
          </div>
        </div>
      </router-link>
      <router-link :to="{name:'wechat'}">
        <div class="wechat-box">
          <span class="icon"><img src="../../../../static/img/w-icon.png"/></span>
          <div class="box-title">
            <h2>服务号绑定</h2>
            <p>{{isband}}</p>
          </div>
        </div>
      </router-link>
    </div>

    <div class="clearfix">
      <router-link :to="{name:'activity'}">
        <div class="wechat-box">
          <span class="icon"><img src="../../../../static/img/activity.png"/></span>
          <div class="box-title">
            <h2>活动预约</h2>
            <p>{{amount}}人未到店</p>
          </div>
        </div>
      </router-link>
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
				isband:'',
				count:0,
        amount:'',

			};
		},
		mounted() {
				this.$nextTick(() => {
					this.token = sessionStorage.getItem('token');
					this.getIsbind();
					this.getMsgCount();
					this.getPersonAmount();
				});
		},
		methods: {
			getMsgCount(){
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
						this.count = res.data.info.remainSms
					}else{
						this.count = 0
					}
				}).catch(error => {
					console.log(error)
				});
			},
      getPersonAmount(){
        this.$axios({
          url: this.path + 'activity/subscribe/count?isFinished=0',
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
            this.amount = res.data.result
          }else{
            this.amount = 0
          }
        }).catch(error => {
          console.log(error)
        });
      },
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
						this.isband = '已绑定'
					}else if(res.data.code === 300047){
						this.isband = '未绑定'
					}
				}).catch(error => {
					console.log(error)
				});
			},


		}
	}
</script>

<style scoped="scoped">
	.message-box,.wechat-box{
		width: 400px;
		height: 190px;
		float: left;
		border: 1px solid #CCCCCC;
		margin: 40px 50px;
	}
	.message-box:hover,.wechat-box:hover{
		border-color: #F9690E;
	}
	.message-box .icon,.wechat-box .icon{
		float: left;
		margin: 20px 0;
	}
	.box-title{
		float: left;
		color: #333333;
		margin: 50px 0;
	}
	.box-title h2{
		font-size: 26px;
		margin-bottom: 10px;
	}
</style>
