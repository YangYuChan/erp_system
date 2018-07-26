<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 职员管理</el-breadcrumb-item>
				<el-breadcrumb-item>职位与权限</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form :inline="true" :model="listQuery" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="listQuery.keyword" placeholder="输入职位名称" :clearable=true ></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
			</el-form-item>
			<el-form-item style="float: right;">
				<router-link :to="{name:'addPower'}">
					<el-button type="primary" icon="el-icon-plus">添加职位</el-button>
				</router-link>
			</el-form-item>
		</el-form>
		<p class="count">职位总数：{{total}}</p>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="brandName" label="品牌"></el-table-column>
			<el-table-column prop="name" label="职位名称"></el-table-column>
			<el-table-column prop="info" label="权限"></el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<!--<el-dialog :visible.sync="addFormVisible" title="添加职位" width="600px" :before-close="handleClose">
			<div style="width: 400px;">
				<el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules" class="form-container">
					<el-form-item label="职位名称：" prop="name">
						<el-input v-model="addForm.name" :maxlength="10" ></el-input>
					</el-form-item>
					<el-form-item label="职位权限：" prop="roleId">
						<el-select v-model="addForm.roleId" placeholder="职位权限" filterable >
							<el-option v-for="item in roleData" :key="item.id" :label="item.info" :value="item.id"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button @click="handleClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>-->
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
				tableData: [],
				action: global_.action,
				token: '',
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: '',
				},
				total:0,
				addFormVisible: false,
				addForm: {
					roleId: '',
					name: '',
				},
				roleData:[],
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

				}

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
						url: this.path + 'staff/position/count',
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
							'Authorization': this.token,
						}
					})
					.then((res) => {
						if(res.data.code === 100000) {
							this.total = res.data.result;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},

			getData() {
				global_.$options.exportSession(this.getData);
				this.listLoading = true;
				this.$axios({
						url: this.path + 'staff/position/list',
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
							'Authorization': this.token,
						}
					})
					.then((res) => {
						if(res.data.code === 100000) {
							this.getTotal();
							this.tableData = res.data.result;
							this.listLoading = false;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleFilter() {
        this.listQuery.page = 1;
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
//			handleAdd() {
//				this.getAllRole();
//				this.addFormVisible = true;
//			},
//			getAllRole(){
//				this.$axios({
//						url: this.path + 'staff/position/role/list',
//						method: 'get',
//						transformRequest: [function(params) {
//							let ret = ''
//							for(let it in params) {
//								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
//							}
//							return ret
//						}],
//						headers: {
//							'Content-Type': 'application/x-www-form-urlencoded',
//							'Authorization': this.token,
//						}
//					})
//					.then((res) => {
//						if(res.data.code = 100000) {
//							this.roleData = res.data.result;
//						}
//					})
//					.catch((err) => {
//						console.log(err);
//					})
//			},
			handleDelete(row) {
				this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'staff/position/delete/'+row.id,
							method: 'DELETE',
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
									message: '删除成功',
									type: 'success'
								});
								this.getData();
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
						message: '已取消删除'
					});
				});
			},

			addSubmitForm() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'staff/position/add',
									method: 'put',
									data: this.addForm,
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
										this.$refs['addForm'].resetFields();
										this.addFormVisible = false;
										this.getData();
									} else {
										this.$message({
											message: '提交失败',
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
				this.$refs['addForm'].resetFields();
				this.addFormVisible = false;
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
</style>
