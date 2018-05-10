<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
				<el-breadcrumb-item>私教管理</el-breadcrumb-item>
				<el-breadcrumb-item>编辑私教时间</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--课程信息-->
		 <el-table :data="tableData" border stripe style="width:99.8%">
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="coachName" label="教练"></el-table-column>
      <el-table-column prop="realName" label="购买人">
      	 <template slot-scope="scope">
          <span>{{scope.row.realName}}&nbsp;</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="phone" label="手机号"></el-table-column>-->
      <el-table-column prop="classPrice" label="费用">
        <template slot-scope="scope">
          <span>
					 {{scope.row.classPrice}}元/{{scope.row.classNumber}}课时
					</span>
        </template>
      </el-table-column>
      <el-table-column prop="spareClassNumber" label="剩余课时"></el-table-column>
      <el-table-column prop="recentScheduledClassTime" label="最近上课时间"></el-table-column>
      <el-table-column prop="spareClassNumber" label="时间">
        <template slot-scope="scope">
          <span v-if="scope.row.spareClassNumber == 0">已确认</span>
          <span v-else>待确定</span>
        </template>
      </el-table-column>
    </el-table>
    <!--end-->
    	<div class="coachInfo clearfix">
    		<h1 class="fl-left">{{coachName}}课程时间安排</h1>
    		<span class="fl-right"><el-button type="default" icon="el-icon-delete" @click="deleteClass()">删除</el-button></span>
    	</div>
    	<div style="color: red;font-size: 12px;margin-top: 12px;text-align: right;">(仅允许删除当前课程的排课时间)</div>
		<div class="group-container mt30 clearfix">
			<table width="100%" v-loading="listLoading">
				<tr valign="top">
					<td class="time-handel">
						<div class="calendar">
							<input type="text" id="datetimepicker3" style="display: none;"/>
						</div>
						<div class="copy-date">
							<el-form ref="addForm" :model="addForm">
							<h3>课程安排时间：</h3>
							<el-form-item label="上课日期"style="margin-top: 10px;">
								<el-date-picker :picker-options="pickerOptions1"
								v-model="addForm.addDate"
								type="date"
								:editable=false
								:clearable=false
								placeholder="选择日期"
								value-format="yyyy-MM-dd"
								style="width: 150px;"
								>
							</el-date-picker>
							</el-form-item>
							<el-form-item label="上课时间" prop="time" placeholder="请选择上课时间">
								<div class="el-input" style="width: 150px;">
									<input class="el-input__inner" id="datetimepicker1" onfocus="this.blur()">
								</div>
							</el-form-item>
							<el-form-item label="上课场地" prop="environmentId">
								<el-select v-model="addForm.environmentId" placeholder="请选择场地" style="width: 150px;">
									<el-option v-for="item in enviroList" :key="item.id" :label="item.environmentName" :value="item.id"> </el-option>
								</el-select>
							</el-form-item>
							<h4>批量操作</h4>
							<el-form-item>
								<el-radio label="每天重复" v-model="addForm.limit" @change='dayChange'></el-radio>
							    <!--<el-input style="width: 100px;margin-left: 11px;" placeholder="" :number="true" size="large" v-model="addForm.classNumber1" :disabled="addForm.limit== '每周重复' "></el-input>&nbsp;&nbsp;课时-->
							    <el-input style="width: 100px;margin-left: 11px;" :number="true" size="large" v-model="addForm.classNumber1" :disabled="ddisabled"></el-input>&nbsp;&nbsp;课时

								<p class="tigs">每天一节课，重复安排</p>
							</el-form-item>
							<el-form-item>
									<el-radio label="每周重复" v-model="addForm.limit" @change='weekChange'></el-radio>
									<!--<el-input style="width: 100px;margin-left: 11px" placeholder="" :number="true" size="large" v-model="addForm.classNumber2" :disabled="addForm.limit== '每天重复' "></el-input>&nbsp;&nbsp;课时-->
									<el-input style="width: 100px;margin-left: 11px" :number="true" size="large" v-model="addForm.classNumber2" :disabled="wdisabled"></el-input>&nbsp;&nbsp;课时

									<p class="tigs">每周一节课，重复安排</p>
							</el-form-item>
							<div class="copy-btn">
								<el-button type="primary" @click="addClassSubmit">添加课程</el-button>
							</div>
							</el-form>
						</div>

					</td>
					<td width="20"></td>
					<td>
						<div class="table-date">
							<table class="class-list" cellpadding="1" cellspacing="1">
								<tr>
									<th width="100">开课时间</th>
									<th>
										<p>{{currentFWeekend1.weekend}}</p>
										<span>{{currentFWeekend1.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend2.weekend}}</p>
										<span>{{currentFWeekend2.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend3.weekend}}</p>
										<span>{{currentFWeekend3.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend4.weekend}}</p>
										<span>{{currentFWeekend4.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend5.weekend}}</p>
										<span>{{currentFWeekend5.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend6.weekend}}</p>
										<span>{{currentFWeekend6.dates}}</span>
									</th>
									<th>
										<p>{{currentFWeekend7.weekend}}</p>
										<span>{{currentFWeekend7.dates}}</span>
									</th>
								</tr>
								<tr v-for="item in classData">
									<td>{{item.time}}</td>
									<td v-for="pitem in item.parent">
										<div class="class_item" v-for="citem in pitem.child" @click="selectedClass(citem.id,citem.classId)">
											<p><span style="color: #383838">{{citem.className}}</span> </p>
											<p>{{citem.environmentName}}</p>
											<p>{{citem.coachName}} </p>
											<p class="time">[{{citem.classTime}}分钟]</p>
										</div>
									</td>
								</tr>
								<tr v-show="dataState">
									<td colspan="8" height="50" style="color: #999;">本周暂无排课安排</td>
								</tr>
							</table>
						</div>

					</td>
				</tr>
			</table>
			<!--添加-->
		</div>
	</div>
</template>
<script>
	import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common'
	import valid from '../../../common/js/validate'
	import $ from 'jquery'
	const Axios = new AXIOS();
	export default {
		data() {
			return {
				path: global_.path,
				token: '',
				listLoading: false,

				pickerOptions1:{
					firstDayOfWeek:1
				},
				tableData:[],
				listLoading: false,
				ddisabled:true,
				wdisabled:true,
				gymId:'',
				coachId:'',
				coachName:'',
				classId:'',
				orderId:'',
				selectedClassId:'',
				currentFWeekend1:{},
				currentFWeekend2:{},
				currentFWeekend3:{},
				currentFWeekend4:{},
				currentFWeekend5:{},
				currentFWeekend6:{},
				currentFWeekend7:{},
				classData:[],
				dataList:[],
				gymList: [],
				enviroList:[],
				classList:[],
				coachList:[],
				otherCoachList:[],
				selectedId:'',
				disabled:true,
				formatTime: '', //传递当前日期
				time: '',
				dataState:false,
				currentWeekend:[],
				currentFWeekend:[],
				addForm:{
					batchType:'',
					environmentId:'',
					classNumber:1,
					classNumber1:0,
					classNumber2:0,
					beginTime:'',
					addDate:'',
					limit:''
				},
				parmaid:'',
				addRules:[{

				}]

			}
		},
		created() {
			this.token = sessionStorage.getItem("token");
			this.userId = sessionStorage.getItem("userId");
			this.parmaid = sessionStorage.getItem('classid');
//			var obj = sessionStorage.getItem("obj");
//			var fm = JSON.parse(obj)
//			this.tableData.push(fm);
//			this.gymId = fm.gymId;
//			this.coachName = fm.coachName;
//			this.coachId = fm.coachId;
//			this.orderId = fm.id;
//			this.classId = fm.classId;
		},
		mounted() {
			this.getList(this.parmaid);
			this.dateTime();
			this.$nextTick(() => {
				this.domHandel();
				$('#datetimepicker1').datetimepicker({
						datepicker: false,
						format: 'H:i',
						step: 15
					});
			});
		},
		methods: {
			dayChange(){
				this.ddisabled = false;
				this.wdisabled = true;
			},
			weekChange(){
				this.ddisabled = true;
				this.wdisabled = false;
			},
			getList(parmaid){
				this.tableData = [];
				this.$axios({
							url: this.path + '/class/personal/'+parmaid,
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
							if(res.data.code === 100000){
								this.tableData.push(res.data.personalClassBean);
								this.gymId = this.tableData[0].gymId;
								this.coachName = this.tableData[0].coachName;
								this.coachId = this.tableData[0].coachId;
								this.orderId = this.tableData[0].id;
								this.classId = this.tableData[0].classId;
								this.getClassData();
								this.getEnvironment();
							}
						})
						.catch((err) => {
							console.log(err);
						})
			},
				getClassData() {
					this.listLoading = true;
					this.$axios({
							url: this.path + 'class/schedule/list',
							method: 'get',
							params: {
								gymId: this.gymId,
								coachId: this.coachId,
								beginTime: this.formatTime,
								isPersonal: 2
							},
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
							if(res.data.code === 100000){
								if(res.data.result.length > 0){
									this.dataState = false;
									this.classData = res.data.result;
								}else{
									this.classData=null
									this.dataState = true;
								}
								this.listLoading = false;
							}
						})
						.catch((err) => {
							console.log(err);
						})
			},
			//获取课程列表
			selectedClass(id,classId){
				this.selectedId = id;
				this.selectedClassId = classId;
			},

			deleteClass(){
				if(this.selectedClassId ==null  || this.selectedClassId==''){
					this.$message({
						message: '请选择要删除的课程',
						type: 'warning'
					});
				}else if(this.selectedClassId != this.classId){
					this.$message({
						message: '仅允许删除当前课程的排课',
						type: 'warning'
					});
				}else{
					this.$confirm('确认要删除吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'class/schedule/delete/'+ this.selectedId,
						method: 'delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						},
						transformRequest: [function(params) {
								let ret = ''
								for(let it in params) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
								}
								return ret
							}],
					}).then((res) => {
						if(res.data.code === 100000) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getClassData();
						}else if(res.data.code === 1){
							this.$message({
								message: '该课程已经结束,不能删除',
								type: 'error'
							});
						}else{
							this.$message({
                message: res.data.message,
								type: 'error'
							});
						}
					}).catch((err) => {
						console.log(err);
					})
				})
				}
			},

			//操作日历

			dateTime() {
				var list = new Array();
				var argsTime;
				var self = this;
				$.datetimepicker.setLocale('zh');
				$('#datetimepicker3').datetimepicker({
					inline: true,
					timepicker: false,
					dayOfWeekStart: 1,
					scrollMonth:false,
					onGenerate(ct) {
						list = [];
						var year = ct.getYear() + 1900,
							month = ct.getMonth() + 1,
							dates = ct.getDate();
						if(month < 10) {
							month = "0" + month;
						}
						if(dates < 10) {
							dates = "0" + dates;
						}

						argsTime = year + '-' + month + '-' + dates;
						self.formatTime = argsTime;
						var tr = $(this).find('.xdsoft_calendar tr'),
							parent = $('.xdsoft_current').parent('tr'),
							td = parent.find('.xdsoft_date');

						tr.find(".xdsoft_current").siblings('.xdsoft_date').css("background", "#33aaff");

						var c_year, c_month, c_date, c_format;
						td.each(function(i) {
							c_year = $(this).attr("data-year");
							c_month = parseInt($(this).attr("data-month")) + 1;
							c_date = $(this).attr("data-date");
							if(c_month < 10) {
								c_month = "0" + c_month;
							}
							if(c_date < 10) {
								c_date = "0" + c_date;
							}
							c_format = c_year + '年' + c_month + '月' + c_date + '日';
							list.push(c_format);
						});
						self.dataList = list;
						self.getClassData();
						self.setFormatTime(self.dataList);
					},
				});
			},
			setFormatTime(weekend){
				this.currentWeekend = weekend;
				var arr = this.currentWeekend;
				var year,month,dates,fm=[];
				for(var i = 0;i<arr.length;i++){
					year = this.currentWeekend[i].substring(0, 4)
					month = this.currentWeekend[i].substring(5, 7)
					dates = this.currentWeekend[i].substring(8, 10)
					fm[i] = year+'-'+month+'-'+dates;
				}
				this.currentFWeekend1 = {
					dates:this.currentWeekend[0].substring(5, 11),
					weekend:'星期一',
					allFormat:fm[0]
				};
				this.currentFWeekend2 = {
					dates:this.currentWeekend[1].substring(5, 11),
					weekend:'星期二',
					allFormat:fm[1]
				};
				this.currentFWeekend3 = {
					dates:this.currentWeekend[2].substring(5, 11),
					weekend:'星期三',
					allFormat:fm[2]
				};
				this.currentFWeekend4 = {
					dates:this.currentWeekend[3].substring(5, 11),
					weekend:'星期四',
					allFormat:fm[3]
				};
				this.currentFWeekend5 = {
					dates:this.currentWeekend[4].substring(5, 11),
					weekend:'星期五',
					allFormat:fm[4]
				};
				this.currentFWeekend6 = {
					dates:this.currentWeekend[5].substring(5, 11),
					weekend:'星期六',
					allFormat:fm[5]
				};
				this.currentFWeekend7 = {
					dates:this.currentWeekend[6].substring(5, 11),
					weekend:'星期日',
					allFormat:fm[6]
				};
			},

		//查询健身房场地
			getEnvironment(){
				this.$axios({
							url: this.path + 'resource/gym/environ/list',
							method: 'get',
							params: {
								gymId: this.gymId,
							},
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
							this.enviroList = res.data;
						})
						.catch((err) => {
							console.log(err);
						})
			},
			addClassSubmit(){
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							var dates = this.addForm.addDate;
							var time = $("#datetimepicker1").val();
							this.addForm.beginTime = dates+' '+time+':00';
							if(this.addForm.limit == '每天重复'){
								this.addForm.batchType = 'daily';
								this.addForm.classNumber = this.addForm.classNumber1
							}else if(this.addForm.limit == '每周重复'){
								this.addForm.batchType = 'weekly'
								this.addForm.classNumber = this.addForm.classNumber2
							}
							this.$axios({
									url: this.path + 'class/personal/batch/add',
									method: 'POST',
									data:{
										gymId:this.gymId,
										beginTime:this.addForm.beginTime,
										batchType:this.addForm.batchType,
										classNumber:this.addForm.classNumber,
										personalClassId:this.orderId,
										environmentId:this.addForm.environmentId
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
										this.addForm.addDate = '';
										$("#datetimepicker1").val(" ");
										this.addForm.environmentId = ''
										this.addForm.limit = '';
										this.addForm.classNumber1 ='';
										this.addForm.classNumber2 ='';
										this.getList(this.parmaid);
										this.getClassData();
									}else{
										this.$message({
											message: '提交失败,'+res.data.message,
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
			//操作dom;
			domHandel() {
				$(".class-list").on("click", ".class_item", function() {
					$(".class_item").removeClass("selected");
					$(this).addClass("selected");
				});
			},
		}
	}
</script>
<style scoped="scoped">
	.el-popper {
		display: block!important;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	.fl-left {
		float: left;
	}

	.fl-right {
		float: right;
	}

	.btn-large {
		padding: 16px 28px;
		margin-top: 0;
	}

	.subTips {
		padding-bottom: 20px;
		border-bottom: 1px solid #ccc;
		margin-bottom: 20px;
	}

	.time-handel {
		width: 262px;
		vertical-align: top;
	}

	.class-list {
		width: 100%;
		background: #ddd;
	}

	.class-list th:first-child,
	.class-list td:first-child {
		text-align: center;
		vertical-align: middle;
	}

	.group-container {
		font-size: 14px;
	}

	.class-list th {
		padding: 20px 10px;
	}

	.class-list th {
		background-color: #FcFcFc;
	}

	.class-list td {
		background-color: #FFFFFF;
		vertical-align: top;
	}

	.copy-date {
		width: 242px;
		height: 450px;
		background-color: #EEEEEE;
		margin-top: 20px;
		padding: 20px 10px 10px;
	}

	.copy-date .font {
		margin: 10px 0;
	}

	.class_item {
		margin: 10px;
		cursor: pointer;
		color: #999;

	}
	.class_item{
		padding-bottom: 10px;
		border-bottom: 1px solid #ddd;
	}
	.class_item:last-child{
		padding-bottom:0 ;
		border-bottom: 0;
	}

	.copy-btn {
		margin-top: 20px;
		text-align: center;
	}

	.hr {
		margin: 10px;
		height: 1px;
		background-color: #ddd;
	}

	.selected  p{
		background: rgba(249, 105, 14, 0.1);
	}

	.copy-date .el-input--suffix .el-input__inner {
		padding-right: 0;
	}

	.el-date-editor .el-range-input {
		width: 35%;
	}

	.el-range-editor.el-input__inner {
		padding: 3px 5px;
	}

	.el-input__prefix {
		left: 1px;
	}

	.add-class-row {
		margin-bottom: 20px;
	}

	.add-class-row>div {
		float: left;
		margin-right: 20px;
	}

	.add-class-row .columns-1 {
		line-height: 40px;
	}

	.plugins-tips {
		padding: 10px;
	}

	.btn-group {
		position: relative;
		width: 40%;
	}

	.btn-group .other-btn {
		position: absolute;
		right: 148px;
	}

	.btn-group .btn-large {
		position: absolute;
		right: 0;
		top: -9px;
	}
	.coachInfo{
		margin: 30px 0 0;
	}
	.mt30{
		margin-top: 30px;
	}
	.tigs{
		font-size: 12px;
		text-align: right;
		color: #f56c6c;
		line-height: 20px;
		padding-right: 14px;
	}
</style>
