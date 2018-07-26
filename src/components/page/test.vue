<template>
	<div class="table">
		<!--查询-->
		<div class="plugins-tips">
			<el-form>
				<el-form-item label="选择分店">
					<el-select v-model="listQuery.gymId" @change="getCoachList">
						<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
				<el-breadcrumb-item>团课课表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="subTips clearfix">
			<div class="filter-group fl-left">
				<el-form :inline="true" :model="listQuery" class="demo-form-inline">
					<el-form-item label="选择教练">
						<el-select v-model="listQuery.coachId" @change="getClassList">
							<el-option v-for="item in coachList" :key="item.id" :label="item.coachName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
			<div class="btn-group fl-right">
				<span class="other-btn">
					<el-button type="default" icon="el-icon-edit">编辑</el-button>
					<el-button type="default" icon="el-icon-view">查看</el-button>
					<el-button type="default" icon="el-icon-delete">删除</el-button>
				</span>
				<el-button type="primary" icon="el-icon-plus" class="btn-large" @click="handleAdd()">添加课程</el-button>
			</div>
		</div>
		<div class="group-container clearfix">
			<table width="100%">
				<tr>
					<td class="time-handel">
						<div class="calendar">
							<input type="text" id="datetimepicker3"/>
						</div>
						<div class="copy-date">
							<span>课程批量复制：</span>
							<el-select v-model="listQuery.gymId" style="width: 140px;">
								<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
							</el-select>

							<el-date-picker v-model="value6" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" style="margin-top: 10px;width: 240px;">
							</el-date-picker>
							<p class="font">的团课复制到</p>
							<el-date-picker v-model="value1" type="date" :editable=false placeholder="选择日期" style="width: 140px;">
							</el-date-picker>
							<span>至&nbsp;2017-12-21</span>
							<div class="copy-btn">
								<el-button type="primary">复制</el-button>
							</div>
						</div>

					</td>
					<td width="20"></td>
					<td>
						<div class="table-date">
							<table class="class-list" cellpadding="1" cellspacing="1">
								<tr>
									<th width="100">开课时间</th>
									<th>
										<p>星期一</p>
										<span>{{addClassDate1.day}}</span>
									</th>
									<th>
										<p>星期二</p>
										<span>{{addClassDate2.day}}</span>
									</th>
									<th>
										<p>星期三</p>
										<span>{{addClassDate3.day}}</span>
									</th>
									<th>
										<p>星期四</p>
										<span>{{addClassDate4.day}}</span>
									</th>
									<th>
										<p>星期五</p>
										<span>{{addClassDate5.day}}</span>
									</th>
									<th>
										<p>星期六</p>
										<span>{{addClassDate6.day}}</span>
									</th>
									<th>
										<p>星期日</p>
										<span>{{addClassDate7.day}}</span>
									</th>
								</tr>
								<tr v-for="item in classList">
									<td>12:00</td>
									<td>
										<div class="class_item selected">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
										<div class="hr"></div>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
								</tr>
								<tr>
									<td>12:15</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
								</tr>
								<tr>
									<td>12:15</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
									<td>
										<div class="class_item">
											<p><span style="color: #383838">极速燃脂瘦身</span> </p>
											<p>释金石设备测试场地之3</p>
											<p>阿珂 [40min]</p>
											<p>0/20</p>
											<p>到0 </p>
										</div>
									</td>
								</tr>
							</table>
						</div>

					</td>
				</tr>
			</table>
			<!--添加-->
		</div>

		<!--添加课程-->
		<el-dialog :visible.sync="addFormVisible" width="40%" title="添加课程">
			<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
				<el-form-item label="上课场地" prop="brandName">
					<el-select v-model="listQuery.gymId" placeholder="请选择场地" style="width: 300px;">
						<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上课时间" prop="status" style="margin: 20px 0;">
					<div class="el-input" style="width: 300px;"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner" id="datetimepicker1"></div>
				</el-form-item>
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期一(<span>{{addFormatTime1}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期二(<span>{{addFormatTime2}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期三(<span>{{addFormatTime3}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期四(<span>{{addFormatTime4}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期五(<span>{{addFormatTime5}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期六(<span>{{addFormatTime6}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<!--一天-->
				<div class="add-class-row clearfix">
					<div class="columns-1"><label>星期日(<span>{{addFormatTime7}}</span>)</label></div>
					<div class="columns-2">
						<el-select v-model="listQuery.gymId" placeholder="请选择课程" style="width: 170px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-3">
						<el-select v-model="listQuery.gymId" placeholder="请选择教练" style="width: 120px;">
							<el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</div>
					<div class="columns-4">
						<el-radio v-model="radio" label="1">备选项</el-radio>
						<el-radio v-model="radio" label="2">
							<el-input v-model="addForm.brandName" style="width: 100px;" placeholder="预约人数"></el-input>
						</el-radio>
					</div>
				</div>
				<!--end-->
				<el-form-item style="margin-left: 42px;">
					<el-button type="primary" @click="addSubmitForm">提交</el-button>
					<el-button @click="addFormVisible = false">取消</el-button>
					<span style="color: #FF0000;margin-left: 30px;">注：最大可预约人数若不填写则为不限人数</span>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--end-->

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
				value3: '',
				value6: '',
				value1: '',
				//      activedGymId:'',
				//      activedCoachId:'',
				listQuery: {
					gymId: '',
					coachId: '',
				},
				dataList:[],
				formatTime: '', //传递当前日期
				time: '',
				addClassDate1: '', //添加一周课程获取日期
				addClassDate2: '',
				addClassDate3: '',
				addClassDate4: '',
				addClassDate5: '',
				addClassDate6: '',
				addClassDate7: '',
				addFormatTime1: '',
				addFormatTime2: '',
				addFormatTime3: '',
				addFormatTime4: '',
				addFormatTime5: '',
				addFormatTime6: '',
				addFormatTime7: '',
				gymList: [],
				coachList: [],
				tableData: [],
				pickerOptions: {
					firstDayOfWeek: 1,
				},
				radio: '',
				addForm: {
					brandName: '',
					brandLogo: '',
					brandInfo: '',
					status: 0,
				},
				addRules: {
					brandName: [{
						required: true,
						validator: valid.checkName,
						trigger: 'blur'
					}]
				},
				editForm: {
					id: 0,
					brandName: '',
					brandLogo: '',
					brandInfo: '',
					status: ''
				},
				editRules: {
					brandName: [{
						required: true,
						validator: valid.checkName,
						trigger: 'blur'
					}]
				},
				addFormVisible: false,
				editFormVisible: false,
			}
		},
		created() {
			this.token = sessionStorage.getItem("token");
		},
		mounted() {
			this.getGymList();
			this.$nextTick(() => {
				this.domHandel();
			});
		},
		methods: {
			//获取健身房列表
			getGymList() {
				//				global_.$options.exportSession(this.getGymList);
				this.$axios({
						url: this.path + 'resource/gym/list',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': this.token,
						}
					})
					.then((res) => {
						this.listQuery.gymId = res.data[0].id;
						this.gymList = res.data;
						this.getCoachList();
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//获取教练列表
			getCoachList() {
				//				global_.$options.exportSession(this.getCoachList);
				this.$axios({
						url: this.path + 'resource/coach/list?gymId=' + this.listQuery.gymId,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization': this.token,
						}
					})
					.then((res) => {
						res.data.unshift({
							"id": '',
							"coachName": "全部教练"
						})
						this.coachList = res.data;
						this.dateTime();
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//获取课程列表
			
			addSubmitForm() {

			},
			//操作日历
			
			dateTime() {
				var list = new Array();
				var argsTime;
				var self = this;
				$.datetimepicker.setLocale('zh');
				$('#datetimepicker1').datetimepicker({
					datepicker: false,
					format: 'H:i',
					step: 5
				});
			
				$('#datetimepicker3').datetimepicker({
					inline: true,
					timepicker: false,
					dayOfWeekStart: 1,
					onChangeDateTime(dp, $input) {
						var value = $input.val();
						var year = value.substring(0, 4),
							month = value.substring(5, 7),
							dates = value.substring(8, 10);
							argsTime = year + '-' + month + '-' + dates;
							self.formatTime = argsTime;
							self.getClassList();
					},
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
							c_month = parseInt($(this).attr("data-month") + 1);
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
						this.dataList = list;
						self.getClassList();
					},
				});
			},
				getClassList() {
					//				global_.$options.exportSession(this.getCoachList);
					this.$axios({
							url: this.path + 'class/schedule/list',
							method: 'get',
							params: {
								gymId: this.listQuery.gymId,
								coachId: this.listQuery.coachId,
								beginTime: this.formatTime
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
							if(res.data.code == 100000){
								var month,day;
								this.classList = res.data.result;
								for(var i = 0;i<this.classList.length;i++){
									month = this.classList[i].day.substring(5, 7);
									day = this.classList[i].day.substring(8, 10);
									this.classList[i].day = month+'月'+day+'日';
								}
								this.addClassDate1 = this.classList[0]
								this.addClassDate2 = this.classList[1]
								this.addClassDate3 = this.classList[2]
								this.addClassDate4 = this.classList[3]
								this.addClassDate5 = this.classList[4]
								this.addClassDate6 = this.classList[5]
								this.addClassDate7 = this.classList[6]
							}
							
						})
						.catch((err) => {
							console.log(err);
						})
			},
			//操作dom;
			domHandel() {
				$(".class-list").on("click", ".class_item", function() {
					$(".class_item").removeClass("selected");
					$(this).addClass("selected");
				});

			},
			handleAdd() {
//				for(var i = 0; i < dataList.length; i++) {
//							this.addClassDate1 = dataList[0].time
//							this.addClassDate2 = dataList[1].time
//							this.addClassDate3 = dataList[2].time
//							this.addClassDate4 = dataList[3].time
//							this.addClassDate5 = dataList[4].time
//							this.addClassDate6 = dataList[5].time
//							this.addClassDate7 = dataList[6].time
//						};
//
//				this.addFormatTime1 = this.addClassDate1.substring(5, 12);
//				this.addFormatTime2 = this.addClassDate2.substring(5, 12);
//				this.addFormatTime3 = this.addClassDate3.substring(5, 12);
//				this.addFormatTime4 = this.addClassDate4.substring(5, 12);
//				this.addFormatTime5 = this.addClassDate5.substring(5, 12);
//				this.addFormatTime6 = this.addClassDate6.substring(5, 12);
//				this.addFormatTime7 = this.addClassDate7.substring(5, 12);
				this.addFormVisible = true;
			},
			handleClose() {
				this.addFormVisible = false;
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
		height: 260px;
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
	
	.class_item:last-child {
		padding-bottom: 0;
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
	
	.selected {
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
</style>