<template>
	<div class="table">
		<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery">
				<el-form-item style="margin-bottom: 0;" label="售卖场馆">
					<el-select v-model="listQuery.gymId" placeholder="全部" :clearable=true @change="handleFilter">
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 会员管理</el-breadcrumb-item>
				<el-breadcrumb-item>会员卡种类</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form :inline="true" :model="listQuery" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="listQuery.keyword" placeholder="会员卡种类名称" :clearable=true></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="listQuery.type" placeholder="选择会员卡类型" :clearable=true @change="handleFilter">
					<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
			</el-form-item>
			<el-form-item style="float: right;">
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加种类</el-button>
			</el-form-item>
		</el-form>
		<p class="count">会员卡种类总数：{{total}}</p>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="kindName" label="会员卡种类名称"></el-table-column>
			<el-table-column prop="type" label="会员卡类型">
				<template slot-scope="scope">
						<div v-if="scope.row.type == 1">
							期限类型
						</div>
						<div v-else-if="scope.row.type == 2">
							次卡类型
						</div>
						<div v-else-if="scope.row.type == 3">
							储值类型
						</div>
					</template>
			</el-table-column>
			<el-table-column prop="usrGymList" label="适用场馆">
				<template slot-scope="scope">
						<div v-if="scope.row.isGymCommon == 0">
							<p v-for="item in scope.row.usrGymList">
								{{item.gymName}}
							</p>
						</div>
						<div v-else-if="scope.row.isGymCommon == 1">
							通用
						</div>
					</template>
			</el-table-column>
			<el-table-column prop="sellGymList" label="售卖场馆">
					<template slot-scope="scope">
						<div v-if="scope.row.isSellCommon == 0">
							<p v-for="item in scope.row.sellGymList">
								{{item.gymName}}
							</p>
						</div>
						<div v-else-if="scope.row.isSellCommon == 1">
							通用
						</div>
					</template>

			</el-table-column>
			<el-table-column prop="price" label="基础价格"></el-table-column>
			<el-table-column prop="createTime" label="创建日期"></el-table-column>
			<el-table-column prop="intro" label="简介"></el-table-column>
			<el-table-column prop="username" label="创建人"></el-table-column>
			<el-table-column prop="status" label="状态(是否停用)">
				<template slot-scope="scope">
				<span v-if="scope.row.status == 1">
				是
			    </span>
				<span v-else-if="scope.row.status == 0">
				 否
		    	</span>
				</template>

			</el-table-column>
			<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 1">
		          		<el-button size="small"  @click="handleStart(scope.row)">启用</el-button>
		         	</span>
		         	<span v-else>
		         		<el-button size="small" type="danger" @click="handleStop(scope.row)">停用</el-button>
		         	</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-dialog :visible.sync="addFormVisible" title="添加会员卡种类" width="680px" :before-close="handleClose" :closeOnClickModal="false">
			<el-form ref="addForm" :model="addForm" label-width="150px" :rules="addRules" class="form-container">
				<el-form-item label="会员卡类型：" prop="type">
					<el-select v-model="addForm.type" placeholder="选择会员卡类型" :clearable=true >
						<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员卡种类名称：" prop="kindName">
					<el-input v-model="addForm.kindName"  :maxlength="12"></el-input>
				</el-form-item>
				<el-form-item label="会员使用场馆：" prop="isGymCommon">
					<el-radio label="通用" v-model="addForm.isGymCommon"></el-radio>
					<el-radio label="门店" v-model="addForm.isGymCommon"></el-radio>
					<div class="gym-group" v-show="addForm.isGymCommon == '门店'">
					 <el-checkbox-group v-model="usrGymList">
					    <el-checkbox v-for="item in gymData" :label="item.id" :key="item.id">{{item.gymName}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="售卖场馆：" prop="isSellCommon">
					<el-radio label="通用" v-model="addForm.isSellCommon"></el-radio>
					<el-radio label="门店" v-model="addForm.isSellCommon"></el-radio>
					<div class="gym-group" v-show="addForm.isSellCommon == '门店'">
					 <el-checkbox-group v-model="sellGymList">
					    <el-checkbox v-for="item in gymData" :label="item.id" :key="item.id">{{item.gymName}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="最低售卖价格：" prop="price">
					<el-input v-model.number="addForm.price" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;元
				</el-form-item>
				<el-form-item label="转让手续费：" prop="transferType"  style="margin-bottom: 0px;">
					<el-radio label="百分比" v-model="addForm.transferType"></el-radio>
					<el-radio label="固定金额" v-model="addForm.transferType"></el-radio>
				</el-form-item>
				<el-form-item label="" prop="transferMoney">
					<span v-show="addForm.transferType== '百分比'">
						<el-input style="width: 111px;" v-model.number="addForm.transferMoney" ></el-input>&nbsp;&nbsp;&nbsp;%
					</span>
					<span  v-show="addForm.transferType== '固定金额'">
						<el-input style="width: 111px;" v-model.number="addForm.transferMoney"></el-input>&nbsp;&nbsp;&nbsp;元
					</span>
				</el-form-item>
				<el-form-item label="排序：" prop="sort">
					<el-input v-model.number="addForm.sort" style="width: 111px;" :maxlength="2" :minlength="1"></el-input>
					<span style="color:#f56c6c;margin-left: 30px;">0-99以内数值，数值越小，排序靠前</span>
				</el-form-item>
				<el-form-item label="是否为体验卡：" prop="isFree">
					<el-radio label="否" v-model="addForm.isFree"></el-radio>
					<el-radio label="是" v-model="addForm.isFree"></el-radio>
					<span style="color:#f56c6c;margin-left: 30px;">选择是：一人限购一次</span>
				</el-form-item>
				<el-form-item label="简介：" prop="intro">
					<el-input v-model="addForm.intro" type="textarea" style="width: 370px;"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button @click="handleClose">取消</el-button>
					<el-button type="primary" @click="addSubmitForm">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
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
				tableData: [], //
				gymData: [],
				token: '',
				listLoading: false,
				total: 0,
				typeData: [{
					id: 1,
					value: '期限类型'
				}, {
					id: 2,
					value: '次卡类型'
				}, {
					id: 3,
					value: '储值类型'
				}],
				listQuery: {
					page: 1,
					limit: 10,
					keyword: '',
					type: '',
					gymId: '',
				},
				addFormVisible: false,
				usrGymList:[],
				sellGymList:[],
				addForm: {
					kindName:'',
					type:'',
					isGymCommon:'通用',
					isSellCommon:'通用',
					price:'',
					transferType:'百分比',
					transferMoney:'',
					sort:'',
					isFree:'否',
					intro:'',
					usrGymId:'',
					sellGymId:'',
					status:0
				},
				addRules: {
					kindName: [{
							required: true,
							message: '请输入会员卡种类名称',
							trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '请选择会员卡类型',
						trigger: 'change'
					}],
				}

			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getType();
			});
		},
		methods: {
			getType() {
				this.$axios({
						url: this.path + 'resource/gym/erp/list',
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
						this.gymData = res.data;
						this.getData()
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getTotal() {
				this.$axios({
						url: this.path + 'member/kind/count',
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
						url: this.path + 'member/kind/list',
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
				this.addFormVisible = true;
			},
			handleStop(row) {
				this.$confirm('您确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'member/kind/update/status',
							method: 'post',
							data: {
								id: row.id,
								status: 1
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
									message: '修改成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '修改失败',
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
						message: '已取消修改'
					});
				});
			},
			handleStart(row) {
				this.$confirm('您确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'member/kind/update/status',
							method: 'post',
							data: {
								id: row.id,
								status: 0
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
									message: '修改成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '修改失败',
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
						message: '已取消修改'
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
							if(this.addForm.isGymCommon == '通用'){
								this.addForm.isGymCommon = 1
							}else{
								this.addForm.isGymCommon = 0
							}
							if(this.addForm.isSellCommon == '通用'){
								this.addForm.isSellCommon = 1
							}else{
								this.addForm.isSellCommon = 0
							}
							if(this.addForm.transferType == '百分比'){
								this.addForm.transferType = 1
							}else{
								this.addForm.transferType = 2
							}
							if(this.addForm.isFree == '是'){
								this.addForm.isFree = 1
							}else{
								this.addForm.isFree = 0
							}
							this.addForm.sellGymId = this.sellGymList.join(",");
							this.addForm.usrGymId = this.usrGymList.join(",");
							if(this.addForm.sort == ''){
								this.$axios({
									url: this.path + 'member/kind/add',
									method: 'put',
									data:{
										kindName:this.addForm.kindName,
										type:this.addForm.type,
										isGymCommon:this.addForm.isGymCommon,
										isSellCommon:this.addForm.isSellCommon,
										price:this.addForm.price,
										transferType:this.addForm.transferType,
										transferMoney:this.addForm.transferMoney,
										isFree:this.addForm.isFree,
										intro:this.addForm.intro,
										usrGymId:this.addForm.usrGymId,
										sellGymId:this.addForm.sellGymId,
										status:this.addForm.status,
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
									if(res.data.code === 100000){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm'].resetFields();
										this.sellGymList = [];
										this.usrGymList= [];
										this.addFormVisible = false;
										this.getData();
									}else{
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
							}else{
								this.$axios({
									url: this.path + 'member/kind/add',
									method: 'put',
									data:{
										kindName:this.addForm.kindName,
										type:this.addForm.type,
										isGymCommon:this.addForm.isGymCommon,
										isSellCommon:this.addForm.isSellCommon,
										price:this.addForm.price,
										transferType:this.addForm.transferType,
										transferMoney:this.addForm.transferMoney,
										sort:this.addForm.sort,
										isFree:this.addForm.isFree,
										intro:this.addForm.intro,
										usrGymId:this.addForm.usrGymId,
										sellGymId:this.addForm.sellGymId,
										status:this.addForm.status,
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
									if(res.data.code === 100000){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm'].resetFields();
										this.sellGymList = [];
										this.usrGymList= [];
										this.addFormVisible = false;
										this.getData();
									}else{
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
							}

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
				this.sellGymList = [];
				this.usrGymList= [];
				this.addFormVisible = false;
			}
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
	.gym-group{
		border: 1px solid #f1f1f1;
		padding: 10px;
	}
</style>
