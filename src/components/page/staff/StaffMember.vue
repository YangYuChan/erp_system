<template>
	<div class="table">
		<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery" label-width="100px">
				<el-form-item style="margin-bottom: 0;" label="员工所属场地">
					<el-select v-model="listQuery.gymId" placeholder="全部" :clearable=true @change="handleFilter">
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 职员管理</el-breadcrumb-item>
				<el-breadcrumb-item>工作人员</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form :inline="true" :model="listQuery" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="listQuery.keyword" placeholder="输入员工姓名/手机号" :clearable=true ></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
			</el-form-item>
			<el-form-item style="float: right;">
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加员工</el-button>
			</el-form-item>
			<br />
				<el-form-item label="筛选条件">
						<el-select v-model="listQuery.level" placeholder="员工权限"  :clearable=true @change="handleFilter">
							<el-option v-for="item in powerList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.status" placeholder="在职状态"  :clearable=true @change="handleFilter">
							<el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
		</el-form>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="name" label="真实姓名"></el-table-column>
			<el-table-column prop="sex" label="性别">
				<template slot-scope="scope">
					<span v-if="scope.row.sex == 0">男</span>
					<span v-else>女</span>
				</template>
			</el-table-column>
			<el-table-column prop="staffNo" label="工号"></el-table-column>
			<el-table-column prop="phone" label="手机号"></el-table-column>
			<el-table-column prop="cardNo" label="身份证号"></el-table-column>
			<el-table-column prop="positionName" label="职业"></el-table-column>
			<el-table-column prop="status" label="在职状态">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 1">在职</span>
					<span v-else-if="scope.row.status == 2">实习</span>
					<span v-else-if="scope.row.status == 3">兼职</span>
					<span v-else-if="scope.row.status == 4">顾问</span>
					<span v-else>离职</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" width="400">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 5">
						<el-button size="small" type="info" disabled>取消禁用</el-button>
						<!--<el-button size="small" type="info" disabled>离职</el-button>-->
						<el-button size="small" type="info" disabled>编辑</el-button>
					</span>
					<span v-else>
						<!--是否禁用 0否，1是-->
						<span v-if="scope.row.isUse == 0">
							<el-button size="small" @click="handleDisabled(scope.row)">禁用</el-button>
						</span>
						<span v-else>
							<el-button size="small" @click="handleEnabled(scope.row)">取消禁用</el-button>
						</span>
						<!--<el-button size="small" @click="handleLeave(scope.row)" style="margin-left: 10px;">离职</el-button>-->
						<el-button size="small" @click="handleEdit(scope.row)" style="margin-left: 10px;">编辑</el-button>
					</span>
					<!--<el-button size="small" @click="handleDetails(scope.row)">查看</el-button>-->
					<el-button size="small" type="danger" @click="handleDelete(scope.row)" style="margin-left: 10px;">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-dialog :visible.sync="addFormVisible" title="添加工作人员" width="680px" :before-close="handleAddClose" :closeOnClickModal="false">
				<el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules" class="form-container">
				<el-form-item label="在职门店：" prop="isCommon">
					<el-radio label="通用" v-model="addForm.isCommon"></el-radio>
					<el-radio label="门店" v-model="addForm.isCommon"></el-radio>
					<div class="gym-group" v-show="addForm.isCommon == '门店'">
					 <el-checkbox-group v-model="jobGymList">
					    <el-checkbox v-for="item in gymData" :label="item.id" :key="item.id">{{item.gymName}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
					<el-form-item label="姓名：" prop="name">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
					<el-form-item label="头像：" prop="photo">
						<el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="addUserImg" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
							<img v-if="addForm.photo" :src="addForm.photo" class="avatar" style="width:120px;height: 120px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="性别：" prop="sex">
						<el-radio label="男" v-model="addForm.sex"></el-radio>
						<el-radio label="女" v-model="addForm.sex"></el-radio>
					</el-form-item>
					<el-form-item label="手机号：" prop="phone">
						<el-input v-model.number="addForm.phone" @blur="vaildPhone(addForm.phone)"></el-input>
					</el-form-item>

					<el-form-item label="身份证号：" prop="cardNo">
						<el-input v-model="addForm.cardNo" @blur="setBirthday(addForm.cardNo)"></el-input>
					</el-form-item>
					<el-form-item label="生日：" prop="birthday">
						<el-input v-model.number="addForm.birthday" readonly></el-input>
					</el-form-item>
					<el-form-item label="地址：" prop="address">
						<el-input v-model="addForm.address"></el-input>
					</el-form-item>
					<el-form-item label="工号：" prop="staffNo">
						<el-input v-model="addForm.staffNo"></el-input>
					</el-form-item>
					<el-form-item label="密码：" prop="password">
						<el-input v-model="addForm.password" type="password" placeholder="请输入密码" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="职位：" prop="positionId">
						<el-select v-model="addForm.positionId" placeholder="职位" >
							<el-option v-for="item in jobList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="在职状态：" prop="status">
						<el-select v-model="addForm.status" placeholder="在职状态" :clearable=false >
							<el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="角色：" prop="role">
						<el-input v-model="addForm.role"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm.remark" type="textarea"></el-input>
					</el-form-item>
					<div style="width: 100%;height: 40px;line-height:40px;background-color: #eee;border-top: 1px solid #ccc;margin:30px 0;"><span style="padding-left: 40px;">供会员查看</span></div>
					<el-form-item label="昵称：" prop="nickname">
						<el-input v-model="addForm.nickname"></el-input>
					</el-form-item>
					<el-form-item label="简介：" prop="intro">
						<el-input v-model="addForm.intro" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="图库：" prop="dialogImageUrl" class="morePhoto">
						<el-upload
						  :action="uploadUrl()"
						  list-type="picture-card"
						  :on-success="morePhotos"
						  :on-remove="handleRemove"
						  :headers="uploadHeaders()"
						  :limit=5>
						  <i class="el-icon-plus"></i>
						</el-upload>

						<span class="pic-tigs">（最多可添加五张图片）</span>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleAddClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
					</el-form-item>
				</el-form>
		</el-dialog>
		<!--编辑会员-->
		<el-dialog :visible.sync="editFormVisible" title="编辑工作人员" width="680px" :closeOnClickModal="false">
				<el-form ref="editForm" :model="editForm" label-width="120px" :rules="editRules" class="form-container">
					<el-form-item label="在职门店：" prop="isCommon">
					<el-radio label="通用" v-model="editForm.isCommon"></el-radio>
					<el-radio label="门店" v-model="editForm.isCommon"></el-radio>
					<div class="gym-group" v-show="editForm.isCommon == '门店'">
					 <el-checkbox-group v-model="jobEditGymList">
					    <el-checkbox v-for="item in gymData" :label="item.id" :key="item.id">{{item.gymName}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
					<el-form-item label="姓名：" prop="name">
						<el-input v-model="editForm.name"></el-input>
					</el-form-item>
					<el-form-item label="头像：" prop="photo">
						<el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="editUserImg" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
							<img v-if="editForm.photo" :src="editForm.photo" class="avatar" style="width:120px;height: 120px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="性别：" prop="sex">
						<el-radio label="男" v-model="editForm.sex"></el-radio>
						<el-radio label="女" v-model="editForm.sex"></el-radio>
					</el-form-item>
					<el-form-item label="手机号：" prop="phone">
						<el-input v-model.number="editForm.phone"></el-input>
					</el-form-item>

					<el-form-item label="身份证号：" prop="cardNo">
						<el-input v-model="editForm.cardNo" @blur="setBirthday(editForm.cardNo)"></el-input>
					</el-form-item>
					<el-form-item label="生日：" prop="birthday">
						<el-input v-model.number="editForm.birthday" readonly></el-input>
					</el-form-item>
					<el-form-item label="地址：" prop="address">
						<el-input v-model="editForm.address"></el-input>
					</el-form-item>
					<el-form-item label="工号：" prop="staffNo">
						<el-input v-model="editForm.staffNo"></el-input>
					</el-form-item>
					<el-form-item label="密码：">
						<el-input value="000000" type="password" disabled></el-input>
					</el-form-item>
					<el-form-item label="设置新密码：" prop="newPassword">
						<el-input v-model="editForm.newPassword" type="password"></el-input>
					</el-form-item>
					<el-form-item label="职位：" prop="positionId">
						<el-select v-model="editForm.positionId" placeholder="职位" >
							<el-option v-for="item in jobList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="在职状态：" prop="status">
						<el-select v-model="editForm.status" placeholder="在职状态" :clearable=false >
							<el-option v-for="item in statusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="角色：" prop="role">
						<el-input v-model="editForm.role"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="editForm.remark" type="textarea"></el-input>
					</el-form-item>
					<div style="width: 100%;height: 40px;line-height:40px;background-color: #eee;border-top: 1px solid #ccc;margin:30px 0;"><span style="padding-left: 40px;">供会员查看</span></div>

					<el-form-item label="昵称：" prop="nickname">
						<el-input v-model="editForm.nickname"></el-input>
					</el-form-item>
					<el-form-item label="简介：" prop="intro">
						<el-input v-model="editForm.intro" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="图库：" prop="dialogImageUrl" class="morePhoto">
						<el-upload
						   :action="uploadUrl()"
						  list-type="picture-card"
						  :on-success="moreEditPhotos"
						  :on-remove="handleEditRemove"
						  :headers="uploadHeaders()"
						  :show-file-list=true
						 :file-list="showPhotoList"
						  :limit=5>
						  <i class="el-icon-plus"></i>
						</el-upload>

						<span class="pic-tigs">（最多可添加五张图片）</span>
					</el-form-item>
					<el-form-item>
						<el-button @click="editFormVisible = false">取消</el-button>
						<el-button type="primary" @click="editSubmitForm">提交</el-button>
					</el-form-item>
				</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common'
	import valid from '../../../common/js/validate'
	import '../../../common/js/sha512.js'
	const Axios = new AXIOS();
	export default {
		data() {
			return {
				path: global_.path,
				tableData: [], //
				gymData: [],
				action: global_.action,
				token: '',
				listLoading: false,
				total: 0,
				dialogImageUrl: '',
        		dialogVisible: false,
        		error:true,
				powerList: [{
					id: 1,
					value: '一级权限以上'
				}, {
					id: 2,
					value: '二级权限以上'
				}, {
					id: 3,
					value: '三级权限以上'
				}],
				statusList: [{
					id: 1,
					value: '在职'
				}, {
					id: 2,
					value: '实习'
				},{
					id: 3,
					value: '兼职'
				}, {
					id: 4,
					value: '顾问'
				},{
					id: 5,
					value: '离职'
				}],


				listQuery: {
					page: 1,
					limit: 10,
					gymId: '',
					keyword: '',
					status: '',
					level:''
				},
				gymStaffList:[],
				jobGymList:[],
				jobEditGymList:[],
				jobList:[],
				addFormVisible: false,
				editFormVisible: false,
				photoList:[],
				photoEditList:[],
				showPhotoList:[],
				addForm: {
					isCommon:'通用',
					jobGymId:'',
					name: '',
					photo: '',
					sex: '男',
					status:'',
					phone: '',
					cardNo: '',
					birthday: '',
					address: '',
					password:'',
					staffNo:'',
					positionId:'',
					role:'',
					remark: '',
					intro:'',
					nickname:'',
					morePhoto:'',
				},
				staffs:{},
				staffBean:{},
				staffExtendBeans:[],
				editForm: {
					id:'',
					isCommon:'',
					jobGymId:'',
					name: '',
					photo: '',
					sex: '',
					status:'',
					phone: '',
					cardNo: '',
					birthday: '',
					address: '',
					newPassword:'',
					staffNo:'',
					positionId:'',
					role:'',
					remark: '',
					intro:'',
					nickname:'',
					morePhoto:'',
				},
				addRules: {
					name: [{
						required: true,
						message: '请输入会员姓名',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						validator: valid.checkUserPhone,
						trigger: 'blur'
					}],
					cardNo: [{
						validator: valid.cardNo,
						trigger: 'blur'
					}],
					positionId: [{
						required: true,
						message: '请选择职位',
						trigger: 'change'
					}],
					password:[{
						required: true,
						validator: valid.checkPassword,
						trigger: 'blur'
					}]
				},
				editRules: {
					name: [{
						required: true,
						message: '请输入会员姓名',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						validator: valid.checkUserPhone,
						trigger: 'blur'
					}],
					cardNo: [{
						validator: valid.cardNo,
						trigger: 'blur'
					}],
					positionId: [{
						required: true,
						message: '请选择职位',
						trigger: 'change'
					}],
					newPassword:[{
						validator: valid.checkNewPassword,
						trigger: 'blur'
					}]
				},
				addMore:true,

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
						url: this.path + 'staff/count',
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
			getJob(){
				this.$axios({
						url: this.path + 'staff/position/list',
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
							this.jobList = res.data.result;
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
						url: this.path + 'staff/list',
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
			handleLeave(row){
				this.$confirm('您确定进行此操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'staff/update/status',
							method: 'post',
							data:{
								id:row.id,
								status:5
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
									message: '操作成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '操作失败',
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
						message: '已取消此操作'
					});
				});
			},
			handleEnabled(row){
				this.$confirm('您确定进行此操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'staff/user/enable',
							method: 'post',
							data:{
								phone:row.phone
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
									message: '操作成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '操作失败',
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
						message: '已取消此操作'
					});
				});
			},
			handleDisabled(row){
				this.$confirm('您确定进行此操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'staff/user/disable',
							method: 'post',
							data:{
								phone:row.phone
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
									message: '操作成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '操作失败',
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
						message: '已取消此操作'
					});
				});
			},
			handleAdd() {
				this.addFormVisible = true;
				this.getJob();
			},

			handleDelete(row) {
				this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'staff/delete/'+row.id,
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
			setBirthday(val){
				this.addForm.birthday = val.slice(6,14);
				this.editForm.birthday = val.slice(6,14);
			},
			vaildPhone(phone){
				this.$axios({
						url: this.path + 'staff/phone/exist?phone='+phone,
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
							this.$message({
					              type: 'error',
					              message:'该手机号码已被使用，请重新输入'
					            });
							this.addForm.phone='';
						}else{

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
							if(this.addForm.sex == '男') {
								this.addForm.sex = 0
							} else {
								this.addForm.sex = 1
							}
							if(this.addForm.isCommon == '通用'){
								this.addForm.isCommon = 1
							}else{
								this.addForm.isCommon = 0
							}
							this.addForm.morePhoto = this.photoList.join(",");
							this.addForm.jobGymId = this.jobGymList.join(",");
							let pwd = sha512(this.addForm.password);
							this.$axios({
									url: this.path + 'staff/add',
									method: 'put',
									data: {
										name: this.addForm.name,
										photo: this.addForm.photo,
										sex: this.addForm.sex,
										phone: this.addForm.phone,
										cardNo: this.addForm.cardNo,
										birthday: this.addForm.birthday,
										address: this.addForm.address,
										isCommon:this.addForm.isCommon,
										jobGymId:this.addForm.jobGymId,
										status:this.addForm.status,
										password:pwd,
										staffNo:this.addForm.staffNo,
										positionId:this.addForm.positionId,
										role:this.addForm.role,
										intro:this.addForm.intro,
										nickname:this.addForm.nickname,
										morePhoto:this.addForm.morePhoto,
										remark: this.addForm.remark,
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
										this.$refs['addForm'].resetFields();
										$(".el-upload-list").empty();
										this.jobGymList = [];
										this.photoList =[];
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
			handleEdit(row){
//				this.$nextTick(() => {
					this.getJob();
					this.editForm = Object.assign({}, row);
					this.editForm.id = row.id;

					if(this.editForm.sex == 0) {
						this.editForm.sex = '男'
					} else {
						this.editForm.sex = '女'
					}

					if(this.editForm.isCommon == 1){
						this.editForm.isCommon = '通用'
					}else{
						this.editForm.isCommon = '门店'
						this.getGymList(this.editForm.id);
					}
					this.photoEditList = [];
					this.getPhotoList(this.editForm.id);

					this.editFormVisible = true;
//				});
			},
			getGymList(id){
				this.$axios({
						url: this.path + 'staff/gym/list?staffId='+id,
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
							var arr = res.data.result;
							for(var i = 0;i < arr.length;i++){
								this.jobEditGymList.push(arr[i].gymId);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getPhotoList(id){
				this.$axios({
						url: this.path + 'staff/photo/list?staffId='+id,
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
							this.showPhotoList = res.data.result;
							var list = this.showPhotoList
							for(var i = 0;i<list.length;i++){
								this.photoEditList.push(list[i].url);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			editSubmitForm(){
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.editForm.sex == '男') {
								this.editForm.sex = 0
							} else {
								this.editForm.sex = 1
							}
							if(this.editForm.isCommon == '通用'){
								this.editForm.isCommon = 1
							}else{
								this.editForm.isCommon = 0
							}
							if(this.editForm.birthday == null){
								this.editForm.birthday = ''
							}
							this.editForm.jobGymId = this.jobEditGymList.join(",");
							this.editForm.morePhoto = this.photoEditList.join(",");
							let pwd
							if(this.editForm.newPassword == '' || this.editForm.newPassword == null || this.editForm.newPassword == undefined){
								this.editForm.newPassword = ''
								pwd = this.editForm.newPassword
							}else{
								pwd = sha512(this.editForm.newPassword);
							}
							this.$axios({
									url: this.path + 'staff/update',
									method: 'post',
									data: {
										id:this.editForm.id,
										name: this.editForm.name,
										photo: this.editForm.photo,
										sex: this.editForm.sex,
										phone: this.editForm.phone,
										password:pwd,
										cardNo: this.editForm.cardNo,
										birthday: this.editForm.birthday,
										address: this.editForm.address,
										isCommon:this.editForm.isCommon,
										jobGymId:this.editForm.jobGymId,
										status:this.editForm.status,
										staffNo:this.editForm.staffNo,
										positionId:this.editForm.positionId,
										role:this.editForm.role,
										intro:this.editForm.intro,
										nickname:this.editForm.nickname,
										remark: this.editForm.remark,
										morePhoto:this.editForm.morePhoto
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
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.photoEditList = [];
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
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//上传教练
			addUserImg(res, file) {
				this.addForm.photo = res;
			},
			editUserImg(res, file) {
				this.editForm.photo = res;
			},
			handleRemove(file, fileList) {
				var list = this.photoList;
				for(var i = 0;i<list.length;i++){
					if(list[i] == file.response){
						list.splice(i, 1);
					}
				}
		      },
		     handleEditRemove(file, fileList) {
				var list = this.photoEditList;
				for(var i = 0;i<list.length;i++){
					if(list[i] == file.url){
						list.splice(i, 1);
					}
				}
				console.log(list)
		     },
		    morePhotos(res, file){
		    	this.photoList.push(res);
		    },
		    moreEditPhotos(res, file){
				this.photoEditList.push(res);
			},
			//banner
			uploadUrl() {
				return this.action
			},
			uploadHeaders() {
				var headers = {
					'Authorization': this.token
				}
				return headers
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
			handleAddClose(){
				this.$refs['addForm'].resetFields();
				$(".el-upload-list").empty();
				this.jobGymList = [];
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

	.gym-group {
		border: 1px solid #f1f1f1;
		padding: 10px;
		width: 430px;
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


	.morePhoto .el-form-item__content{
		width: 320px;
	}
	.morePhoto .el-upload-list .el-upload-list__item{
		float: left;
	}
	.pic-tigs{
		color: #999;
		font-size: 12px;
	}
</style>
