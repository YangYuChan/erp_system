<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 场馆管理</el-breadcrumb-item>
				<el-breadcrumb-item>教练列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
				<el-form :inline="true" :model="listQuery" class="demo-form-inline">
						<el-form-item label="条件查询">
							<el-input v-model="listQuery.keyword" placeholder="教练姓名"></el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="listQuery.sex" placeholder="请选择性别" clearable >
								<el-option v-for="item in sexData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-select v-model="listQuery.isExist" placeholder="是否有未度账号" clearable >
								<el-option v-for="item in approveData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-select v-model="listQuery.isApprove" placeholder="是否认证" clearable >
								<el-option v-for="item in approveData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
						</el-form-item>
						<el-form-item style="float: right;">
							<el-button type="primary" icon="el-icon-plus" @click="handleAddCoach()">添加</el-button>
						</el-form-item>
					</el-form>
					<el-table :data="tableData" border stripe style="width:100%;margin-top:20px" v-loading="listLoading">
					  	<el-table-column prop="coachName" label="教练名称" width="130"> </el-table-column>
						<el-table-column prop="coachPath" label="图片" width="200">
							<template slot-scope="scope">
								<img :src="scope.row.coachPath" alt="" style="width:120px;height: 120px;"/>
							</template>
						</el-table-column>
						<el-table-column prop="gymName" label="健身房"> </el-table-column>
						<el-table-column prop="count" label="课程数" width="130"> </el-table-column>
						<el-table-column label="操作" width="350">
							<template slot-scope="scope">
								<el-button size="small" @click="handleSelect(scope.row)">查看详情</el-button>
								<el-button size="small" @click="handleEditCoach(scope.row)">编辑</el-button>
								<el-button size="small" @click="handleCoachClass(scope.row)">关联课程</el-button>
								<span v-if="scope.row.status == '0'">
									<el-button type="danger" size="small" @click="handleSoldOut(scope.row)">下架</el-button>
									</span>
									<span v-else>
									<el-button type="primary" size="small" @click="handleSoldIn(scope.row)">上架</el-button>
								</span>
							</template>
						</el-table-column>
						</el-table>
						<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看-->
		<!--给教练添加课程-->
		<div class="panel">
			<el-dialog :visible.sync="classVisible" size="tiny" title="教练添加课程">
				<el-form ref="addClassForm">
					<el-checkbox-group v-model="checkedClass">
						<el-checkbox v-for="item in classData" :label="item.id" :key="item.id" :value="item.id" style="margin:10px 0;width:260px">{{item.className}}</el-checkbox>
					</el-checkbox-group>
					<el-form-item style="text-align:center;margin-top:30px">
						<el-button type="primary" @click="submitCocahClass">提交</el-button>
						<el-button @click="classVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<div class="panel">
			<el-dialog :visible.sync="detailsVisible" size="large" title="教练详情">
				  	<el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="coachName" label="教练名称" width="130"> </el-table-column>
						<el-table-column prop="typeName" label="教练类型" width="150"> </el-table-column>
						<el-table-column prop="phone" label="手机号"> </el-table-column>
						<el-table-column prop="cardNo" label="身份证号"> </el-table-column>
						<el-table-column prop="cardPhoto" label="身份证图片" width="220">
							<template slot-scope="scope">
								<img :src="scope.row.cardPhoto" alt="" style="width:150px;height: 100px;"/>
							</template>
						</el-table-column>
						<el-table-column prop="honor" label="获奖记录" width="300"> </el-table-column>
						<el-table-column prop="weiduNo" label="未度账号">
							<template slot-scope="scope">
								<span class="wdNo"><img :src="scope.row.photo" alt="" style="width:50px;height: 50px;"/></span>
								<span class="wdNo">{{scope.row.nickName}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="isApprove" label="是否认证" width="140">
							<template slot-scope="scope">
								<span v-if="scope.row.isApprove == 0">否</span>
								<span v-else-if="scope.row.isApprove == 1">是</span>
							</template>
						</el-table-column>
							
					</el-table>
			</el-dialog>
		</div>
		<!--end-->
		<div class="panel">
			<el-dialog :visible.sync="addCoachVisible" size="tiny" title="添加教练信息">
				<el-form ref="addCoach" :model="addCoach" label-width="80px" :rules="addCoachRules">
					<el-form-item label="名称" prop="coachName">
						<el-input v-model="addCoach.coachName"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
							<el-select v-model="addCoach.sex" placeholder="请选择性别">
								<el-option v-for="item in sexData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
					<el-form-item label="教练类型" prop="typeId">
						<el-select v-model="addCoach.typeId" placeholder="请选择教练类型">
							<el-option v-for="item in coachTypeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="教练图片" prop="coachPath">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="addCoachImg" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="addCoach.coachPath" :src="addCoach.coachPath" class="avatar" style="width:178px;height: 178px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="个人成果" prop="honor">
						<el-input v-model="addCoach.honor" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="健身房" prop="gymId">
						<el-select v-model="addCoach.gymId" placeholder="请选择健身房" style="width:100%">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="addCoach.phone"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="cardNo">
						<el-input v-model="addCoach.cardNo"></el-input>
					</el-form-item>
					<el-form-item label="身份证照" prop="cardPhoto">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="addCoachCardImg" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="addCoach.cardPhoto" :src="addCoach.cardPhoto" class="avatar" style="width: 250px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
						</el-form-item>
						<el-form-item label="未度账号" prop="weiduNo">
							<el-select v-model="addCoach.weiduNo" filterable remote placeholder="搜索手机号或昵称" :remote-method="getFilterUserData" :loading="loading">
							    <el-option v-for="item in userData" :key="item.id" :label="item.nickName" :value="item.id" class="user-list">
							    	<span style="float: left"><img :src="item.photo" alt="" class="user-photo"/></span>
							    	<span class="user-span">{{ item.nickName }}</span>
							    	<span class="user-span">{{ item.phone }}</span>
							    </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否认证" prop="isApprove">
							<el-select v-model="addCoach.isApprove" placeholder="是否认证">
								<el-option v-for="item in approveData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否上架" prop="status">
						<el-select v-model="addCoach.status">
							<el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSubmitCoach">提交</el-button>
						<el-button @click="addCoachVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<!--编辑教练-->
		<div class="panel">
			<el-dialog :visible.sync="editCoachVisible" size="tiny" title="编辑教练信息">
				<el-form ref="editCoach" :model="editCoach" label-width="80px" :rules="editCoachRules">
					<el-form-item label="名称" prop="coachName">
						<el-input v-model="editCoach.coachName"></el-input>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
							<el-select v-model="editCoach.sex" placeholder="请选择性别">
								<el-option v-for="item in sexData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
					<el-form-item label="教练类型" prop="typeId">
						<el-select v-model="editCoach.typeId" placeholder="请选择教练类型">
							<el-option v-for="item in coachTypeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="教练图片" prop="coachPath">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="editCoachImg" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="editCoach.coachPath" :src="editCoach.coachPath" class="avatar" style="width:178px;height: 178px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="个人成果" prop="honor">
						<el-input v-model="editCoach.honor" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="健身房" prop="gymId">
						<el-select v-model="editCoach.gymId" placeholder="请选择健身房" style="width:100%">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系电话" prop="phone">
						<el-input v-model="editCoach.phone"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="cardNo">
						<el-input v-model="editCoach.cardNo"></el-input>
					</el-form-item>
					<el-form-item label="身份证照" prop="cardPhoto">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="editCoachCardImg" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="editCoach.cardPhoto" :src="editCoach.cardPhoto" class="avatar" style="width: 250px;">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="未度账号" prop="weiduNo">
							<el-select v-model="editCoach.weiduNo" filterable remote placeholder="搜索手机号或昵称" :remote-method="getFilterUserData" :loading="loading">
							    <el-option v-for="item in userData" :key="item.id" :label="item.nickName" :value="item.id" class="user-list">
							    	<span style="float: left"><img :src="item.photo" alt="" class="user-photo"/></span>
							    	<span class="user-span">{{ item.nickName }}</span>
							    	<span class="user-span">{{ item.phone }}</span>
							    </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否认证" prop="isApprove">
							<el-select v-model="editCoach.isApprove" placeholder="是否认证">
								<el-option v-for="item in approveData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否上架" prop="status">
							<el-select v-model="editCoach.status">
								<el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
						</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="editSubmitCoach">提交</el-button>
						<el-button @click="editCoachVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>

</template>
<script>
	import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common';
	import valid from '../../../common/js/validate'
	const Axios = new AXIOS();
	export default {
		data() {
			return {
				path: global_.path,
				action:global_.action,
				token:'',
				listLoading: false,
				loading: false,
				tableData: [],
				userData:[],
				userList:[],
				sexData:[{
					id:0,
					value:'男',
				},{
					id:1,
					value:'女'
				},{
					id:2,
					value:'保密'
				}
				],
				approveData:[{
					id:0,
					value:'否',
				},{
					id:1,
					value:'是'
				}],
				//是否上架
				statusData:[{
					id:0,
					value:'是'
				},{
					id:1,
					value:'否'
				}],
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: null,
					sex:null,
					isExist:null,
					isApprove:null,
				},
				//查看详情
				detailsVisible:false,
				detailsData:[],
				//添加教练
				gymData:[],//健身房
				coachTypeData:[],
				addCoachVisible:false,
				addCoach:{
					coachName:'',
					sex:'',
					typeId:'',
					coachPath:'',
					honor:'',
					isHot:false,
					isRecommend:null,
					phone:'',
					cardNo:'',
					gymId:'',
					cardPhoto:'',
					weiduNo:null,
					isApprove: 0,
					status:1,
				},
				addCoachRules:{
					coachName: [
						{ required: true, validator: valid.checkName, trigger: 'blur' }
					],
					typeId: [
						{ required: true, validator: valid.checkType, trigger: 'change' }
					],
					phone: [
						{ required: true, validator: valid.checkPhone, trigger: 'blur' }
					],
					cardNo: [
						{ required: true, validator: valid.checkCardNo, trigger: 'blur' }
					],
				},
				//编辑教练
				editCoachVisible:false,
				editCoach:{
					coachName:'',
					typeId:'',
					coachPath:'',
					honor:'',
					isHot:false,
					isRecommend:null,
					phone:'',
					cardNo:'',
					gymId:'',
					cardPhoto:'',
					weiduNo:null,
					approveData:0,
					status:null
				},
				editCoachRules:{
					coachName: [
						{ required: true, validator: valid.checkName, trigger: 'blur' }
					],
					typeId: [
						{ required: true, validator: valid.checkType, trigger: 'change' }
					],
					phone: [
						{ required: true, validator: valid.checkPhone, trigger: 'blur' }
					],
					cardNo: [
						{ required: true, validator: valid.checkCardNo, trigger: 'blur' }
					],
				},
				classVisible:false,
				coachClassData:[],
				checkedClass:[],
				classData:[],
				coachId:undefined,
				gymId:undefined,
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
				this.getUserData();
			});
			
		},
		methods: {
			//banner
			uploadUrl(){
				return this.action
			},
			uploadHeaders(){
				var headers = {'Authorization':this.token}
				return headers
			},
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				const isImages = file.type === 'JPG/JPEG/PNG/GIF/RAW/BMP';

		        if (!isImages) {
		          this.$message.error('请上传正确的图片格式！');
		        }	
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isImages && isLt2M;
			},
			//健身房列表
			getGym(){
				this.$axios({
						url: this.path + 'resource/gym/select',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.gymData = res.data
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getTotal() {
				this.$axios({
						url: this.path + 'resource/coach/count',
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
						url: this.path + 'resource/coach/list',
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
			getCoachType(){
				this.$axios({
						url: this.path + 'resource/coach/type/list',
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
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.coachTypeData = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleSelect(row) {
				this.selectDetails(row);
				this.detailsVisible = true;
			},
			//查看
			selectDetails(row) {
				global_.$options.exportSession(this.selectDetails);
				this.$axios({
						url: this.path + 'resource/coach/'+row.id,
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
			getFilterUserData(query) {
				global_.$options.exportSession(this.getFilterUserData);
				this.getUserData(query);
				 if (query !== '') {
		          this.loading = true;
		          setTimeout(() => {
		            this.loading = false;
		            this.userData = this.userList.filter(item => {
		            	return { id:item.id, nickName:item.nickName,phone:item.phone, photo:item.photo};
		            });
		          }, 200);
		        } else {
		          this.userData = [];
		        }
			},
			getUserData(query){
				this.$axios({
						url: this.path + 'resource/coach/findName?text='+query,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.userData = res.data;
							this.userList = this.userData.map(item => {
					        return { id:item.id, nickName:item.nickName,phone:item.phone, photo:item.photo};
					      });
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
		//添加教练
			handleAddCoach(){
				global_.$options.exportSession(this.handleAddCoach);
				this.getGym();
				this.getCoachType();
				this.addCoachVisible = true;
			},
			addSubmitCoach(){
				global_.$options.exportSession(this.addSubmitCoach);
				this.$refs.addCoach.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/coach/add',
									method: 'put',
									data:{
										coachName:this.addCoach.coachName,
										sex:this.addCoach.sex,
										typeId:this.addCoach.typeId,
										coachPath:this.addCoach.coachPath,
										honor:this.addCoach.honor,
										isHot:this.addCoach.isHot,
										isRecommend:this.addCoach.isRecommend,
										phone:this.addCoach.phone,
										cardNo:this.addCoach.cardNo,
										gymId:this.addCoach.gymId,
										cardPhoto:this.addCoach.cardPhoto,
										weiduNo:this.addCoach.weiduNo,
										isApprove: this.addCoach.isApprove,
										status:this.addCoach.status,
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
										this.$refs['addCoach'].resetFields();
										this.addCoachVisible = false;
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
								message: '已取消提交'
							});
							this.addCoachVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//编辑教练
			handleEditCoach(row){
				global_.$options.exportSession(this.handleEditCoach);
				this.getGym();
				this.getCoachType();
				this.editCoachVisible = true;
				this.editCoach = Object.assign({}, row);
			},
			editSubmitCoach(row){
				global_.$options.exportSession(this.editSubmitCoach);
				this.$refs.editCoach.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/coach/update',
									method: 'post',
									data:{
										id:this.editCoach.id,
										coachName:this.editCoach.coachName,
										sex:this.editCoach.sex,
										typeId:this.editCoach.typeId,
										coachPath:this.editCoach.coachPath,
										honor:this.editCoach.honor,
										isHot:this.editCoach.isHot,
										isRecommend:this.editCoach.isRecommend,
										phone:this.editCoach.phone,
										cardNo:this.editCoach.cardNo,
										gymId:this.editCoach.gymId,
										cardPhoto:this.editCoach.cardPhoto,
										weiduNo:this.editCoach.weiduNo,
										isApprove: this.editCoach.isApprove,
										status:this.editCoach.status,
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
										this.$refs['editCoach'].resetFields();
										this.editCoachVisible = false;
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
							this.editCoachVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//下架
			handleSoldOut(row) {
				global_.$options.exportSession(this.handleSoldOut);
				this.$confirm('确认要下架该教练吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/coach/update?id='+row.id+'&status=1',
						method: 'POST',
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
			handleSoldIn(row) {
				global_.$options.exportSession(this.handleSoldIn);
				this.$confirm('确认要上架该教练吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/coach/update?id='+row.id+'&status=0',
						method: 'POST',
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
			
				//查询教练课程列表
			handleCoachClass(row) {
				global_.$options.exportSession(this.handleCoachClass);
				this.classVisible = true;
				this.cocahId = row.id;
				this.gymId = row.gymId;
				this.checkedClass = [];
				this.selectCoachClass(this.cocahId,this.gymId);
				this.selectClass(this.gymId);
			},
			selectClass(gymId) {
				global_.$options.exportSession(this.selectClass);
				this.$axios({
						url: this.path + 'resource/class/list?gymId='+gymId,
						method: 'get',
						params: this.listClass,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.classData = res.data;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			selectCoachClass(coachId,gymId){
				global_.$options.exportSession(this.selectCoachClass);
				this.$axios({
						url: this.path + 'resource/coach/class?coachId='+coachId,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != null){
							this.coachClassData = res.data;
							this.coachClassData.forEach((data,index)=>{
						 		this.checkedClass.push(data.id);
						 	})
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			submitCocahClass() {
				global_.$options.exportSession(this.submitCocahClass);
				this.$refs.addClassForm.validate((valid) => {
					if(valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.$axios({
									url: this.path + 'resource/coach/add/class?coachId='+this.cocahId+'&classId='+this.checkedClass,
									method: 'put',
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
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.classVisible = false;
									this.selectCoach();
								})
								.catch((err) => {
									console.log(err);
								})
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//上传教练
			addCoachImg(res, file){
				this.addCoach.coachPath = res;
			},
			addCoachCardImg(res, file){
				this.addCoach.cardPhoto = res;
			},
			//编辑教练
			editCoachImg(res, file){
				this.editCoach.coachPath = res;
			},
			editCoachCardImg(res, file){
				this.editCoach.cardPhoto = res;
			},
		}
	}
</script>
<style type="text/css">
	.wdNo{
		height: 50px;
		line-height: 50px;
		display: block;
		float: left;
		margin-right: 10px;
	}
	.wdNo img{
		border-radius: 100%;
	}
	.el-select-dropdown__item{
		height: 50px;
		line-height: 1;
	}
	.user-span{
		float: left;
		margin-top: 10px;
		margin-left: 10px;
	}
	.user-photo{
		width: 36px;
		height: 36px;
		border-radius: 100%;
	}
	.btn-box {
		margin: 20px 0;
	}
	.article-item {
		border: 1px solid #dfe6ec;
		padding: 0 20px 20px;
	}
	
	.tags-box {
		height: 50px;
	}
	
	.tags-box .tags {
		float: left;
	}
	
	.tags-box .art-btnbox {
		float: right;
	}
	
	.art-photo {
		float: left;
	}
	
	.art-info {
		position: relative;
		left: 30px;
		padding-right: 30px;
	}
	
	.art-photo img {
		width: 178px;
		height: 178px;
	}
	
	.art-title {
		margin-bottom: 10px;
	}
	
	.art-content {
		line-height: 27px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}
	
	.change {
		text-align: center;
		margin-top: 10px;
	}
	
	.el-pagination {
		text-align: right;
		margin-top: 30px;
	}
	
	.d-context {
		/*height: 120px;*/
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>