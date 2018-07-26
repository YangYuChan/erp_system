<template>
  <div class="table">


	<div class="add-power-box">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 职员管理</el-breadcrumb-item>
				<el-breadcrumb-item>职位与权限</el-breadcrumb-item>
			</el-breadcrumb>

		</div>
		<el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules">
			<el-form-item label="职位名称：" prop="name" style="width: 100%;">
				<el-input v-model="addForm.name" :maxlength="10" style="width: 300px;"></el-input>
				<span class="btn-gox" style="float: right;">
					<el-button @click="handleClose">取消</el-button>
					<el-button type="primary" @click="addSubmitForm">提交</el-button>
				</span>
			</el-form-item>

			<div class="power-list">
				<div class="role-list">
					<!--<p class="moudle">模板选择：</p>-->
					<el-form-item label="模板选择：" prop="roleId">
						<el-radio-group v-model="addForm.roleId">
							<el-radio v-for="item in roleData" :label="item.id" @change="getAuthority(item.id)">{{item.info}}</el-radio>
						</el-radio-group>
					</el-form-item>

				</div>
				<div class="menu-list">
					<h1 style="margin-bottom: 15px;">权限选择</h1>
					<div class="menu-box">
						<el-tree :data="authorityData" show-checkbox
							node-key="authorityInfo"
							default-expand-all
							:default-checked-keys="checkedAuto"
							:props="defaultProps"
							ref="tree"
							>
						</el-tree>
					</div>
				</div>
			</div>
		</el-form>
	</div>
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
				action: global_.action,
				token: '',
				addForm: {
					name: '',
					roleId: '1f569f737b9d40c5bbda2e78dc25c3d3',
					isFree:0,
				},
				authorities:[],
				roleData: [],
				addRules: {
					name: [{
						required: true,
						message: '请输入职位名称',
						trigger: 'blur'
					}],
					roleId: [{
						required: true,
						message: '请选择职位权限',
						trigger: 'change'
					}],
				},
				authorityData:[],
				checkedAuto:[],
				userDefined:[],
				disabledAuto:[],
				defaultProps: {
					children: 'authorities',
					label: 'menu',
				}

			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getAllRole();
			});
		},
		methods: {
			getAllRole() {
				this.$axios({
						url: this.path + 'sys/user/role/select',
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
							this.roleData = res.data.list;
							this.roleData.push({
								id: 1,
								info: "自由权限",
								role: ""
							})
							this.getAuthority(this.addForm.roleId);
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getAuthority(roleId){
				this.checkedAuto = [];
				this.$axios({
						url: this.path + 'authority/role/'+roleId,
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
							this.authorityData = res.data.authorities;
							this.authorityData[1].authorities[0].menu ='添加'
							this.authorityData[1].authorities[1].menu ='编辑'
							for(var i = 0;i < this.authorityData.length; i++){
								if(this.authorityData[i].status == 1){
									this.checkedAuto.push(this.authorityData[i].authorityInfo)
									this.authorityData[i].disabled = true;
								}
								var child = this.authorityData[i].authorities;
								for(var j = 0;j < child.length;j++){
									if(child[j].status == 1){
										this.checkedAuto.push(child[j].authorityInfo)

									}
									if(roleId == 1){
										child[j].disabled = false;
									}else{
										child[j].disabled = true;
									}
								}
							}
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			addSubmitForm() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.addForm.roleId === 1){
								this.authorities = this.$refs.tree.getCheckedKeys();
								this.addForm.isFree = 1;
							}else{
								this.addForm.isFree = 0;
								this.authorities = []
							}
							this.$axios({
									url: this.path + 'staff/position/add',
									method: 'put',
									data: {
										name:this.addForm.name,
										roleId:this.addForm.roleId,
										isFree:this.addForm.isFree,
										authorities:this.authorities
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$router.push('/power');
									} else {
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleClose(){

			},
		}
	}
</script>

<style type="text/css">
	.plugins-tips {
		padding: 10px;
	}

	.count {
		font-size: 14px;
		line-height: 40px;
		height: 40px;
		padding-left: 10px;
		background-color: #FCFCFC;
	}

	.gym-group {
		border: 1px solid #f1f1f1;
		padding: 10px;
	}

	.more {
		margin-bottom: 20px;
	}

	.more a {
		font-size: 14px;
		color: #F9690E;
	}

	.userphoto img {
		width: 50px;
		height: 50px;
		border-radius: 100%;
	}

	.el-radio-group .el-radio {
		display: block;
		line-height: 20px;
		margin-left: 0px;
		margin-top: 10px;
	}

	.role-list,
	.menu-list {
		float: left;
		width: 40%;
	}
	.el-tree-node__content .el-checkbox{
		width: 30px;
	}
	.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,
	.el-radio__input.is-checked .el-radio__inner{
		background: #F9690E !important;
    	border-color: #F9690E !important;
	}
	.el-radio__input.is-checked+.el-radio__label{
		color:#F9690E !important;
	}
</style>
