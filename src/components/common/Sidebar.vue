<template>
	<div class="sidebar">
 <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" router>
       <el-submenu v-for="(item,index) in menuList" v-if="item.status == 1" :index="'menu'+index">
       	<template slot="title">
       		<i class="icon iconfont icon-guanligudong"></i>
       		<!--<i class="icon iconfont icon-dianpu"></i>-->
       		<span>{{item.menu}}</span>
       	</template>
        <el-menu-item-group>
          <el-menu-item v-for="child in item.authorities" v-if="child.status == 1" :index="child.authorityInfo">{{child.menu}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!--<el-submenu index="2">
        <template slot="title">
        	<i class="icon iconfont icon-weixin"></i>
        	<span>服务号管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="groupClassList">团课课表</el-menu-item>
          <el-menu-item index="provision">团课设置</el-menu-item>
          <el-menu-item index="ptCoach">私教管理</el-menu-item>
          <el-menu-item index="ptProvision">私教设置</el-menu-item>
          <el-menu-item index="member">会员管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
     <el-submenu index="3">
        <template slot="title">
        	<i class="icon iconfont icon-manage"></i>
        	<span>会员管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="members">会员管理</el-menu-item>
          <el-menu-item index="cards">会员卡管理</el-menu-item>
          <el-menu-item index="types">会员卡种类</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
        	<i class="icon iconfont icon-power"></i>
        	<span>职员管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="staffMember">工作人员</el-menu-item>
          <el-menu-item index="power">职位与权限</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
       <el-submenu index="5">
        <template slot="title">
        	<i class="icon iconfont icon-power"></i>
        	<span>服务</span>
        </template>
        <el-menu-item-group>
          	<el-menu-item index="myService">我的服务</el-menu-item>
        </el-menu-item-group>
      </el-submenu>-->
    </el-menu>
	</div>
</template>
<style type="text/css">
	.sidebar{
        display: block;
        position: absolute;
        width: 160px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #F9FAFC;
        overflow: auto;
    }
    .sidebar > ul {
        height:100%;
      overflow: auto;
    }
    .el-menu{
		background-color: #1E202A;
	}
	.el-submenu__title i{
		color: #FFFFFF;
		margin-right: 5px;
		font-size: 14px;
	}
	/*.el-submenu__title:hover,
	.el-submenu .el-menu{
		background-color: #32343D;
	}*/
	.el-submenu__title:hover{
		background-color: rgba(30,32,42,0.3);
	}
	.el-submenu .el-menu-item:hover{
		background-color: #474951;
	}
	.el-menu-item, .el-submenu__title{
		color: #FFFFFF;
	}
	.el-submenu__title{
		padding: 0 10px!important;
	}
	.el-menu-item-group__title{
		padding: 0;
	}
	.el-submenu .el-menu-item{
		color: #999;
		width: 149px;
		padding-left: 33px!important;
		min-width: auto;
	}
	.el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active{
		color: #F9690E;
	}
	.el-menu-item:focus, .el-menu-item:hover{
	background-color: transparent;
}

</style>
<script>
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	import '../../common/js/sha512.js'
	const Axios = new AXIOS();
  export default {
  	data() {
			return {
				path: global_.path,
				menuList: [], //
				childMenu:[],
				addGym:null,
				subMenuList:{
					"AUTHORITY_GYM_EDIT": "gymlist", 						            //编辑
          "AUTHORITY_CLASS_ORDER":"appBuyClass",                     //未度购买课程
					"AUTHORITY_GROUPCLASS_SCHEDULE": "groupClassList", 			//团课课表
					"AUTHORITY_GROUPCLASS_MANAGEMENT": "provision",			    //团课设置
					"AUTHORITY_PRIVATECLASS_SCHEDULE": "ptCoach", 			    //私教管理
					"AUTHORITY_PRIVATECLASS_MANAGEMENT": "ptProvision", 		//私教设置
					"AUTHORITY_WECHAT_MEMBER": "member", 					       //服务号会员
					"AUTHORITY_MEMBER": "members", 						           //会员
					"AUTHORITY_MEMBER_CARD": "cards", 				      	   //会员卡
					"AUTHORITY_CARD_KIND": "types", 						         //会员卡种类
					"AUTHORITY_STAFF": "staffMember",	 						       //员工
					"AUTHORITY_STAFF_AUTHORITY": "power", 						   //服务
					"AUTHORITY_COMPONENT_SERVICE": "myService",			     //微信服务
          "AUTHORITY_SIGN_REPORT":"signIn",                    //签到报表
          "AUTHORITY_MEMBER_CARD_REPORT":"memberCard",         //会员卡报表
          "AUTHORITY_CARD_SALE_REPORT":"memberCardSale",       //会员卡销售报表
          "AUTHORITY_CLASS_REPORT":"course",                    //课程报表
          "AUTHORITY_SIGN_MANAGEMENT":"signInOut"               //签到签出
				},
			}
	},
  	 computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
    mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getMenu();
			});
		},
    methods: {
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
              res.data.authorities.splice(0,1);
							this.menuList = res.data.authorities;
							this.addGymStatus = this.menuList[0].authorities[0].status;
							sessionStorage.setItem("addGymStatus",this.addGymStatus);
							this.menuList[0].authorities.splice(0,1)
							for(var i = 0;i<this.menuList.length;i++){
								for(var j = 0;j<this.menuList[i].authorities.length;j++){
									for(var m in this.subMenuList){
										if(this.menuList[i].authorities[j].authorityInfo == m){
											this.menuList[i].authorities[j].authorityInfo = this.subMenuList[m];


										};
									}
								}
							}
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }
    }
  }

</script>
