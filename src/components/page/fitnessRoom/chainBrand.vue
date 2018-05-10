<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 场馆管理</el-breadcrumb-item>
				<el-breadcrumb-item>连锁品牌列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="按品牌名称搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="brandName" label="品牌名称"> </el-table-column>
			<el-table-column prop="gymNumber" label="门店数量"> </el-table-column>
			<el-table-column label="操作" width="400">
				<template slot-scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleEdit(scope.index,scope.row)">编辑</el-button>
					<span v-if="scope.row.status == '0'">
					<el-button type="danger" size="small" @click="handleSoldOut(scope.index,scope.row)">下架</el-button>
					</span>
					<span v-else>
					<el-button type="primary" size="small" @click="handleSoldIn(scope.index,scope.row)">上架</el-button>
					</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看-->
		<div class="panel">
			<el-dialog :visible.sync="detailsVisible" size="large" title="连锁品牌详情">
				<el-tabs type="border-card" v-model="activeName">
				  <el-tab-pane label="基本信息"  style="min-height: 400px;" name="first"> 
				  	<el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="brandName" label="品牌名称"></el-table-column>
						<el-table-column prop="brandLogo" label="品牌LOGO">
							<template slot-scope="scope">
								<span><img :src="scope.row.brandLogo" alt="" style="width: 225px;height: 100px; background-size: contain;"/></span>
							</template>
						</el-table-column>
						<el-table-column prop="brandInfo" label="品牌简介"> </el-table-column>
					</el-table>
				  </el-tab-pane>
				  <el-tab-pane label="关联信息" style="min-height: 400px;" name="second">
				  	<el-table :data="gymData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column type="index" width="150" sortable></el-table-column>
						<el-table-column prop="gymName" label="品牌旗下场馆名称"> </el-table-column>
					</el-table>
				  </el-tab-pane>
				</el-tabs>
			</el-dialog>
		</div>
		<!--end-->
		<!--编辑-->
		<div class="panel">
			<el-dialog :visible.sync="editFormVisible" size="tiny" title="编辑连锁品牌">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="品牌名称" prop="brandName">
						<el-input v-model="editForm.brandName"></el-input>
					</el-form-item>
					<el-form-item label="是否上架" prop="status">
						<el-select v-model="editForm.status">
							<el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="品牌logo" prop="brandLogo">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="handleAvatarEditSuccess" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false" :headers="uploadHeaders()">
							<img v-if="editForm.brandLogo" :src="editForm.brandLogo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					
					<el-form-item label="品牌简介" prop="brandInfo">
						<el-input type="textarea" v-model="editForm.brandInfo"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="editSubmitForm">提交</el-button>
						<el-button @click="editFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<!--end-->
		<!--添加-->
		<div class="panel">
			<el-dialog :visible.sync="addFormVisible" size="tiny" title="添加连锁品牌">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="品牌名称" prop="brandName">
						<el-input v-model="addForm.brandName"></el-input>
					</el-form-item>
					<el-form-item label="是否上架" prop="status">
						<el-select v-model="addForm.status">
							<el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="封面图" prop="brandLogo">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="handleAvatarSuccess" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="addForm.brandLogo" :src="addForm.brandLogo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					
					<el-form-item label="品牌简介" prop="brandInfo">
						<el-input type="textarea" v-model="addForm.brandInfo"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
						<el-button @click="addFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
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
				action:global_.action,
				activeName:'first',
				tableData: [], //列表数组
				gymData:[],
				detailsData:[],
				statusData:[{
					id:0,
					value:'是'
				},{
					id:1,
					value:'否'
				}],
				token:'',
				listLoading: false,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				addForm:{
					brandName:'',
					brandLogo:'',
					brandInfo:'',
					status:0,
				},
				addRules: {
					brandName: [
						{ required: true, validator: valid.checkName, trigger: 'blur' }
					]
				},
				editForm:{
					id:0,
					brandName:'',
					brandLogo:'',
					brandInfo:'',
					status:''
				},
				editRules: {
					brandName: [
						{ required: true, validator: valid.checkName, trigger: 'blur' }
					]
				},
				addFormVisible: false,
				editFormVisible: false,
				detailsVisible: false,
				videoList:[],
			}
		},
		filters:{
  			time (value) {
        		var date = new Date(value),
		        y = date.getFullYear(),
		        m = date.getMonth() + 1,
		        d = date.getDate(),
		        h = date.getHours(),
		        i = date.getMinutes(),
		        s = date.getSeconds();
		        if (m < 10) {
		            m = '0' + m;
		        }
		        if (d < 10) {
		            d = '0' + d;
		        }
		        if (h < 10) {
		            h = '0' + h;
		        }
		        if (i < 10) {
		            i = '0' + i;
		        }
		        if (s < 10) {
		            s = '0' + s;
		        }
			//  获取时间格式 2017-01-03 10:13:48
		        var t = y+'-'+m+'-'+d+'    '+h+':'+i+':'+s;
			//  获取时间格式 2017-01-03
			//	var t = y + '-' + m + '-' + d;
		        return t;
		    		}
  	},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
			});
		},
		methods: {  
			uploadUrl(){
				return this.action
			},
			uploadHeaders(){
				var headers = {'Authorization':this.token}
				return headers
			},
			
			getTotal() {
				this.$axios({
						url: this.path + 'resource/brand/count',
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
						url: this.path + 'resource/brand/list',
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
			handleAdd() {
				global_.$options.exportSession(this.handleAdd);
				this.addFormVisible = true;
			},
			//添加
			addSubmitForm() {
				global_.$options.exportSession(this.addSubmitForm);
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/brand/add',
									method: 'put',
									data:{
										brandName:this.addForm.brandName,
										brandLogo:this.addForm.brandLogo,
										brandInfo:this.addForm.brandInfo,
										status:this.addForm.status
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
										'Authorization':this.token,
									}
								})
								.then((res) => {
									if(res.data === 1){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm'].resetFields();
										this.addFormVisible = false;
										this.addForm.activityPath=''
										this.getData();
									}else{
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
								message: '已取消上传'
							});
							this.addFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleEdit(index, row) {
				global_.$options.exportSession(this.handleEdit);
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			editSubmitForm() {
				global_.$options.exportSession(this.editSubmitForm);
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.editLoading = true;
							this.$axios({
									url: this.path + 'resource/brand/update',
									method: 'post',
									data:{
										id:this.editForm.id,
										brandName:this.editForm.brandName,
										brandLogo:this.editForm.brandLogo,
										brandInfo:this.editForm.brandInfo,
										status:this.editForm.status
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
										'Authorization':this.token,
									}
								})
								.then((res) => {
									if(res.data === 1){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getData();
									}else{
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
								message: '已取消编辑'
							});
							this.editFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			
			handleSelect(index, row) {
				this.selectDetails(index, row);
				this.selectRelevance(index,row);
				this.detailsVisible = true;
			},
			//查看
			selectDetails(index, row) {
				global_.$options.exportSession(this.selectDetails);
				this.$axios({
						url: this.path + 'resource/brand/'+row.id,
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
			selectRelevance(index,row) {
				global_.$options.exportSession(this.selectRelevance);
				this.$axios({
						url: this.path + 'resource/gym/list?brandId='+row.id,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.gymData = res.data;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//下架
			handleSoldOut(index, row) {
				global_.$options.exportSession(this.handleSoldOut);
				this.$confirm('确认要下架该品牌吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/brand/disable/'+row.id,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data === 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.getData();
						}else if(res.data == 0){
							this.$message({
								message: '操作失败',
								type: 'error'
							});
						}
					}).catch((err) => {
						console.log(err);
					})
				})
			},
			//上架
			handleSoldIn(index, row) {
				global_.$options.exportSession(this.handleSoldIn);
				this.$confirm('确认要上架该品牌吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/brand/enable/'+row.id,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data === 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.getData();
						}else if(res.data == 0){
							this.$message({
								message: '操作失败',
								type: 'error'
							});
						}
					}).catch((err) => {
						console.log(err);
					})
				})
			},			//上传封面
			handleAvatarSuccess(res, file) {
//				global_.$options.exportSession(this.handleAvatarSuccess);
				this.addForm.brandLogo = res;
			},
			handleAvatarEditSuccess(res, file) {
//				global_.$options.exportSession(this.handleAvatarEditSuccess);
				this.editForm.brandLogo = res;
			},
			beforeAvatarUpload(file) {
				let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png','image/gif','image/bmp'];
				const isJPG = supportedTypes.indexOf(file.type)
		        const isLt2M = file.size / 1024 / 1024 < 3;
						if (isJPG < 0) {
							this.$message.error('上传头像图片格式错误!');
		       }
		        if (!isLt2M) {
		          this.$message.error('上传头像图片大小不能超过 3MB!');
		        }
		        return isJPG && isLt2M;
		     },
		}
	}
</script>
<style type="text/css">
	.block {
		float: right;
		margin-top: 25px;
	}
	
	.plugins-tips .el-form-item {
		margin-bottom: 0;
	}
	
	.btn-box {
		margin-bottom: 20px;
	}
	.details-title{
		text-align: center;
		line-height: 50px;
		font-size: 20px;
		height: 50px;
		margin-bottom: 20px;
		color: #1f2d3d;
	}
	.details-content{
		font-size: 14px;
		line-height: 1.5;
		padding: 0 5rem;
	}
	.gyminfo{
		width:230px;
	    word-break:break-all;
	    display:-webkit-box;
	    -webkit-line-clamp:3;
	    -webkit-box-orient:vertical;
	    overflow:hidden;
	}
</style>