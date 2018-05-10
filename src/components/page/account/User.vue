<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 用户管理</el-breadcrumb-item>
				<el-breadcrumb-item>账号数据</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="请输入昵称或手机号搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="userDetailBean.nickName" label="昵称"> </el-table-column>
			<el-table-column prop="userDetailBean.sex" label="性别"> </el-table-column>
			<el-table-column prop="phone" label="手机"></el-table-column>
			<el-table-column prop="userDetailBean.createTime" label="注册时间"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="个人详情">
				<el-tabs type="border-card" v-model="activeName">
				  <el-tab-pane label="个人资料"  style="min-height: 400px;" name="first"> 
				  	<el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="realName" label="真实姓名"></el-table-column>
						<el-table-column prop="nickName" label="昵称"> </el-table-column>
						<el-table-column prop="sex" label="性别"> </el-table-column>
						<el-table-column prop="constellation" label="星座"> </el-table-column>
						<el-table-column prop="birthday" label="出生年月"> </el-table-column>
						<el-table-column prop="city" label="所在城市"> </el-table-column>
						<el-table-column prop="height" label="身高"></el-table-column>
						<el-table-column prop="weight" label="体重"></el-table-column>
					</el-table>
				  </el-tab-pane>
				  <el-tab-pane label="好友" style="min-height: 400px;" name="second">
				  	<el-table :data="friendData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="id" label="用户id"> </el-table-column>
						<el-table-column prop="nickName" label="昵称"> </el-table-column>
						<el-table-column prop="createTime" label="注册日期"> </el-table-column>
					</el-table>
				  </el-tab-pane>
				  <el-tab-pane label="历史数据" style="min-height: 400px;" name="three">
				  	<el-table :data="histroyData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="distance" label="距离"> </el-table-column>
						<el-table-column prop="rate" label="心率"> </el-table-column>
						<el-table-column prop="speed" label="速度"> </el-table-column>
						<el-table-column prop="avgePower" label="功率"> </el-table-column>
						<el-table-column prop="calorie" label="消耗"> </el-table-column>
						<el-table-column prop="deviceNo" label="设备ID"> </el-table-column>
						<el-table-column prop="endTime" label="记录时间"> </el-table-column>
					</el-table>
				  </el-tab-pane>
				  <el-tab-pane label="其他" style="min-height: 400px;" name="fourth">
				  	<el-table :data="otherData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="status" label="是否在线"> </el-table-column>
						<el-table-column prop="sumFollow" label="关注人数"> </el-table-column>
						<el-table-column prop="sumFollower" label="粉丝数"> </el-table-column>
						<el-table-column prop="sumDynamic" label="动态数"> </el-table-column>
						<el-table-column prop="sumArticleFavorite" label="收藏文章数"> </el-table-column>
						<el-table-column prop="vitality" label="活跃度"> </el-table-column>
					</el-table>
				  </el-tab-pane>
				</el-tabs>
			</el-dialog>
		</div>
		<!--end-->

	
	</div>
</template>

<script>
	import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common'
	import valid from '../../../common/js/validate'
	const Axios = new AXIOS();
	export default {
		data() {
			return {
				path: global_.path,
				activeName:'first',
				tableData: [], //列表数组
				token:'',
				detailsData: null,
				friendData: null,
				histroyData:null,
				otherData:null,
				detailsVisible: false,
				listLoading: false,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
		
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
			});
		},
		methods: {
			
			getTotal() {
				this.$axios({
						url: this.path + 'user/count',
						method: 'get',
						params: this.listQuery,
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.total = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getData() {
				global_.$options.exportSession(this.getData);
				this.listLoading = true;
				this.$axios({
						url: this.path + 'user/list',
						method: 'get',
						params: this.listQuery,
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.getTotal();
							this.tableData = res.data;
							this.listLoading = false;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleFilter() {
				this.getData();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getData();
			},
			handleSelect(index, row) {
				this.detailsVisible = true;
				this.selectDetails(index, row);
				this.selectFriend(index, row);
				this.selectHistory(index, row);
				this.selectOther(index, row)
			},
//			tabClick(obj){
//				var name = obj.name;
//				if(name == 'first'){
//					this.selectDetails(index, row);
//				}else if(name == 'second'){
//					this.selectFriend(index, row);
//				}else if(name == 'three'){
//					this.selectHistory(index, row);
//				}else if(name == 'fourth'){
//					this.selectOther(index, row)
//				}
//			},
			//查看
			selectDetails(index, row) {
				global_.$options.exportSession(this.selectDetails);
				this.$axios({
						url: this.path + 'user/'+ row.id+'?type=1',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.detailsData = res.data;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			selectFriend(index, row) {
				global_.$options.exportSession(this.selectFriend);
				this.$axios({
						url: this.path + 'user/'+ row.id+'?type=2',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.friendData = res.data;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			selectHistory(index, row) {
				global_.$options.exportSession(this.selectHistory);
				this.$axios({
						url: this.path + 'user/'+ row.id+'?type=3',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.histroyData = res.data;
						}
					})
					.catch((err) => {
					console.log(err);
					})
			},
			selectOther(index, row) {
				global_.$options.exportSession(this.selectOther);
				this.$axios({
						url: this.path + 'user/'+ row.id+'?type=4',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.otherData = res.data;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},

			
		}
	}
</script>
<style type="text/css">
	.v-modal{
		z-index: 1000!important;
	}
	.el-dialog__wrapper{
		z-index: 1001!important;
	}
	.el-form-item__content{
		line-height: 0;
	}
	.block {
		float: right;
		margin-top: 25px;
	}
	
	.plugins-tips .el-form-item {
		margin-bottom: 0;
	}
	
</style>