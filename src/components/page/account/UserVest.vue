<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 用户管理</el-breadcrumb-item>
				<el-breadcrumb-item>马甲号管理</el-breadcrumb-item>
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
					<el-button type="primary" icon="plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="userDetailBean.nickName" label="昵称"> </el-table-column>
			<el-table-column prop="phone" label="手机"></el-table-column>			
			<el-table-column prop="num" label="发送动态数"></el-table-column>
			<el-table-column prop="updateTime" label="最近发布动态时间"> </el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleEdit(scope.index,scope.row)">编辑</el-button>
					<el-button size="small" @click="msgAdd(scope.row.id)">发送动态</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		
		<!--添加马甲号-->
		<div class="panel">
			<el-dialog v-model="addFormVisible" size="tiny" title="添加马甲号信息">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="手机号" prop="phone" >
						<el-input v-model="addForm.phone" @blur="isRegister(addForm.phone)"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input v-model="addForm.password"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="nickname">
						<el-input v-model="addForm.nickname"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-select v-model="addForm.sex">
								<el-option v-for="item in chainData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
					</el-form-item>
					<el-form-item label="地址" prop="city">
						<el-input v-model="addForm.city"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
						<el-button @click="addFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<!--
        	作者：970056019@qq.com
        	时间：2017-09-13
        	描述：编辑马甲号
        -->
		<div class="panel">
			<el-dialog v-model="editFormVisible" size="small" title="编辑资讯">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="昵称" prop="nickName">
						<el-input v-model="editForm.nickName"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-select v-model="editForm.sex">
								<el-option v-for="item in chainData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
							</el-select>
					</el-form-item>
					<el-form-item label="头像" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleEditAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="uploadHeaders()">
							<img v-if="editForm.headPhoto" :src="editForm.headPhoto" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="城市" prop="shareContext">
						<el-input v-model="editForm.city"></el-input>
					</el-form-item>
					<!--<el-form-item label="所属地区" prop="region">
						<template>
					  <div id="app">
					    <el-cascader
					      size="large"
					      :options="options"
					      v-model="regionEdit"
					      @change="handleEditAreaChange" placeholder="请选择省/市/区"> 
					    </el-cascader>
					  </div>
					</template>
					</el-form-item>-->
					<el-form-item label="个性签名" prop="persionSignature">
					<template>
						<div id="context">
							<ueditor  style="height: 500px" v-model="editForm.persionSignature"></ueditor>
							<!--<VueUEditor v-model="editForm.context" style="height: 500px;"></VueUEditor>-->
						</div>
					</template>
				</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="editSubmitForm">提交</el-button>
						<el-button @click="editFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
			<!--添加动态-->
		<div class="panel">
			<el-dialog v-model="addMsgVisible" size="small" title="添加动态">
				<el-form ref="addMsg" :model="addMsg" label-width="80px" :rules="addRules">
					<el-form-item label="动态类型">
						<el-select v-model="addMsg.state">
								<el-option v-for="item in dynamicData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<template v-if="addMsg.state == 2">
						<el-form-item label="标题" prop="title">
							<el-input v-model="addMsg.title"></el-input>
						</el-form-item>
					</template>
					<el-form-item label="图片" prop="dynamicPath">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="handleAvatarSuccess" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false"
							:headers="uploadHeaders()">
							<img v-if="addMsg.dynamicPath" :src="addMsg.dynamicPath" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<template v-if="addMsg.state == 3">
						<el-form-item label="视频上传" prop="videoPath">
							<el-upload ref="upload" class="upload-demo" 
								:action="uploadVUrl()"  
								:on-success="handleChange" 
								:file-list="videoList" 
								:headers="uploadHeaders()"
								>
									<el-button v-if="addMsg.videoPath" size="small" type="primary">重新上传</el-button>
									<el-button v-else size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传视频文件</div>
							</el-upload>
						</el-form-item>
					</template>
					<el-form-item label="内容" prop="context">
					<template>
						<div id="context">
							<ueditor  style="height: 500px;" v-model="addMsg.context"></ueditor>
						<!--<VueUEditor v-model="addForm.context" style="height: 500px;"></VueUEditor>-->
					</div>
					</template>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addMsgForm">提交</el-button>
						<el-button @click="addMsgVisible = false">取消</el-button>
					</el-form-item>
			
				</el-form>
			</el-dialog>
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
				action:global_.action,
				actionV:global_.actionV,
				activeName:'first',
				tableData: [], //列表数组
				token:'',
				uid:'',
				detailsData: null,
				friendData: null,
				histroyData:null,
				otherData:null,
				detailsVisible: false,
				listLoading: false,
				total: null,
				regionEdit:[],
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				addFormVisible: false,
				region:null,
				addForm:{
					phone:'',
					password:'',
					nickname:'',
					city:'',
					sex:0 
				},
				editForm: {
					province:'',
					city:'',
					area:'',
					nickName:'',
					sex:0,
					headPhoto:'',
					persionSignature:''
				},
				editRules: {
					title: [
						{ required: true, validator: valid.checkTitle, trigger: 'blur' }
					],
					auth: [
						{ required: true, validator: valid.checkAuth, trigger: 'blur' }
					],
					context: [
						{ required: true, validator: valid.checkContext, trigger: 'blur' }
					],
				},
				editFormVisible: false,
				videoList:[],
				addMsgVisible: false,
				addMsg:{
					uid:'',
					context :'',
					dynamicPath:'',
					width :'',
					videoPath:'',
					height:'',
					title:'',
					state:1
				},
				addRules: {
					title: [
						{ required: true, validator: valid.checkTitle, trigger: 'blur' }
					],
					auth: [
						{ required: true, validator: valid.checkAuth, trigger: 'blur' }
					],
					context: [
						{ required: true, validator: valid.checkContext, trigger: 'blur' }
					],
				},
				chainData:[{
					id:0,
					value:'男',
				},{
					id:1,
					value:'女'
				},{
					id:2,
					value:'保密'
				}],
				dynamicData:[{
					id:1,
					value:'动态',
				},{
					id:2,
					value:'长文章'
				},{
					id:3,
					value:'视频文章'
				}],
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
			uploadVUrl(){
				return this.actionV
			},
			getTotal() {
				this.$axios({
						url: this.path + 'userVest/count',
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
						url: this.path + 'userVest/list',
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
			ale(a){
				alert(a);
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
			handleSelect(index,row) {
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
			/*添加马甲号*/
			handleAdd() {
				this.addFormVisible = true;
			},
			/*打开发送动态弹出窗*/
			msgAdd(row) {
				this.addMsgVisible = true;
				this.addMsg.uid=row;
			},
			handleEdit(index, row) {
				global_.$options.exportSession(this.handleEdit);
				this.editFormVisible = true;
				this.uid=row.id;
				this.editForm = Object.assign({}, row.userDetailBean);
			},
			isRegister(phone){
				global_.$options.exportSession(this.isRegister);
				this.$axios({
						url: this.path +'sys/user/isRegister?phone='+phone,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						if(res.data != 0){
							this.$message({
										message: '手机号已存在',
										type: 'error'
									});
							this.addForm.phone = '';
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//上传封面
			handleAvatarSuccess(res, file) {
				global_.$options.exportSession(this.handleAvatarSuccess);
				this.addMsg.dynamicPath = res;
			},
			handleEditAvatarSuccess(res, file) {
				global_.$options.exportSession(this.handleEditAvatarSuccess);
				this.editForm.headPhoto = res;
			},
			beforeAvatarUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 2;
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isLt2M;
			},
			handleChange(file,fileList) {
				global_.$options.exportSession(this.handleChange);
				this.addForm.vrVideoId = fileList.response;  //获取上传的资源地址
				var sname = fileList.response.substring(fileList.response.lastIndexOf('/')+1)//截取文件名
				var name = {"name":sname};
				this.videoList.push(name)//保存文件名到数组
				var args = this.videoList.pop();//把最新的文件名放到一个新数组
				this.videoList = new Array(args)//把新数组里的文件名显示出来
			},
			handleEditChange(file,fileList) {
				global_.$options.exportSession(this.handleEditChange);
				this.editForm.vrVideoId = fileList.response;
				var sname = fileList.response.substring(fileList.response.lastIndexOf('/')+1)
				var name = {"name":sname};
				this.videoList.push(name)
				var args = this.videoList.pop();
				this.videoList = new Array(args)

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
									url: this.path + 'registerByApp',
									method: 'put',
									data:{
										phone:this.addForm.phone,
										password:this.addForm.password,
										sex:this.addForm.sex,
										city:this.addForm.city,
										nickname:this.addForm.nickname
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
										this.addForm.sex=0,
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
							this.addFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//添加动态提交
			addMsgForm() {
				global_.$options.exportSession(this.addMsgForm);
				this.$refs.addMsg.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/dynamic/add',
									method: 'put',
									data:{
										context:this.addMsg.context,
										title:this.addMsg.title,
										state:this.addMsg.state,
										dynamicPath:this.addMsg.dynamicPath,
										videoPath:this.addMsg.videoPath,
										title:this.addMsg.title,
										userId:this.addMsg.uid
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
										this.$refs['addMsg'].resetFields();
										this.addMsgVisible = false;
										this.addMsg.state=1,
										this.addMsg.dynamicPath='';
										this.addMsg.videoPath='';
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
							this.addFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//编辑马甲号
			editSubmitForm() {
				global_.$options.exportSession(this.editSubmitForm);
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.editForm.sex=='女'){
								this.editForm.sex=1;
							}
							if(this.editForm.sex=='男'){
								this.editForm.sex=1;

							}
							if(this.editForm.sex=='保密'){
								this.editForm.sex=2;
							}
							this.$axios({
									url: this.path + 'userVest/update',
									method: 'post',
									data: {
										userId:this.uid,
										nickName: this.editForm.nickName,
										sex: this.editForm.sex,
										city:this.editForm.city,
										headPhoto: this.editForm.headPhoto,
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