<template>
  <div class="table">
    <!--查询-->
    <div class="plugins-tips">
      <el-form>
        <el-form-item label="选择分店">
          <el-select v-model="listQuery.gymId" @change="getCoachList">
            <el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
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
            <el-select v-model="listQuery.coachId" @change="getClassData" :clearable=true>
              <el-option v-for="item in coachList" :key="item.id" :label="item.coachName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-group fl-right">
				<span class="other-btn">
					<el-button type="default" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
          <!--<el-button type="default" icon="el-icon-view">查看</el-button>-->
					<el-button type="default" icon="el-icon-delete" @click="deleteClass">删除</el-button>
				</span>
        <el-button type="primary" icon="el-icon-plus" class="btn-large" @click="handleAdd()">添加课程</el-button>
      </div>
    </div>
    <div class="group-container clearfix">
      <table width="100%" v-loading="listLoading">
        <tr valign="top">
          <td class="time-handel">
            <div class="calendar">
              <input type="text" id="datetimepicker3" style="display: none;"/>
            </div>
            <div class="copy-date">
              <el-form ref="copyForm" :model="copyForm" :rules="copyRules">
                <p>课程批量复制：</p>
                <el-select v-model="copyForm.gymId" style="width: 240px;margin-top: 10px;" placeholder="请选择门店">
                  <el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
                </el-select>

                <el-date-picker :picker-options="pickerOptions1" v-model="copyForm.copyTime" type="daterange"
                                range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期"
                                @change="DateDiff" value-format="yyyy-MM-dd" :clearable=false
                                style="margin-top: 10px;width: 240px;">
                </el-date-picker>
                <p class="font">的团课复制到</p>
                <el-date-picker :picker-options="pickerOptions1" v-model="copyForm.copyDate" type="date" :editable=false
                                :clearable=false placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 140px;"
                                @change="copyDateChange">
                </el-date-picker>
                <span>至&nbsp;{{pasteEndTime}}</span>
                <div class="copy-btn">
                  <el-button type="primary" @click="copyClassData">复制</el-button>
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
                    <div class="class_item" v-for="citem in pitem.child" @click="selectedClass(citem.id,citem)">
                      <p><span style="color: #383838">{{citem.className}}</span></p>
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

    <!--添加课程-->
    <el-dialog :visible.sync="addFormVisible" width="950px" title="添加课程" :before-close="handleClose"
               :closeOnClickModal="false">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
        <el-form-item label="健身房" prop="gymId">
          <el-select v-model="listQuery.gymId" placeholder="请选择场地" style="width: 250px;margin-bottom: 20px"
                     disabled="disabled">
            <el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课场地" prop="environmentId" style="height: 46px;">
          <el-select v-model="addForm.environmentId" placeholder="请选择场地" style="width: 250px;"
                     @change="checkEnvironment(addForm.environmentId)">
            <el-option v-for="item in enviroList" :key="item.id" :label="item.environmentName"
                       :value="item.id"></el-option>
          </el-select>
          <!--<p style="color: #f56c6c;line-height: 20px;height: 20px;" v-show="envirValid">请选择上课场地</p>-->
        </el-form-item>
        <div class="form-item" style="margin: 20px 0 0;height: 70px;">
          <span style="color: red;">*</span>
          <label for="">上课时间&nbsp;&nbsp;&nbsp;</label>
          <div class="el-input" style="width: 250px;">
            <input class="el-input__inner" id="datetimepicker1" @blur="checkTime" placeholder="请选择上课时间">
          </div>
          <p style="color: #f56c6c;margin-left: 80px; height: 30px;" v-show="timeValid">请选择一个上课时间</p>
        </div>
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend1.weekend}}(<span>{{currentFWeekend1.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails1.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails1.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails1.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails1.limit"></el-radio>
            <el-radio v-model="scheduleDetails1.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails1.numberLimit"
                      :disabled="scheduleDetails1.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails1.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails1.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails1.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid1">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend2.weekend}}(<span>{{currentFWeekend2.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails2.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails2.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails2.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails2.limit"></el-radio>
            <el-radio v-model="scheduleDetails2.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails2.numberLimit"
                      :disabled="scheduleDetails2.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails2.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails2.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails2.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid2">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend3.weekend}}(<span>{{currentFWeekend3.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails3.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails3.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails3.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails3.limit"></el-radio>
            <el-radio v-model="scheduleDetails3.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails3.numberLimit"
                      :disabled="scheduleDetails3.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails3.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails3.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails3.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid3">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend4.weekend}}(<span>{{currentFWeekend4.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails4.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails4.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails4.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails4.limit"></el-radio>
            <el-radio v-model="scheduleDetails4.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails4.numberLimit"
                      :disabled="scheduleDetails4.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails4.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails4.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails4.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid4">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend5.weekend}}(<span>{{currentFWeekend5.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails5.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails5.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails5.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails5.limit"></el-radio>
            <el-radio v-model="scheduleDetails5.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails5.numberLimit"
                      :disabled="scheduleDetails5.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails5.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails5.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails5.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid5">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend6.weekend}}(<span>{{currentFWeekend6.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails6.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails6.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails6.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails6.limit"></el-radio>
            <el-radio v-model="scheduleDetails6.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails6.numberLimit"
                      :disabled="scheduleDetails6.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails6.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails6.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails6.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid6">请输入教练名称</p>
        </div>
        <!--end-->
        <!--一天-->
        <div class="add-class-row clearfix">
          <div class="columns-1"><label>{{currentFWeekend7.weekend}}(<span>{{currentFWeekend7.dates}}</span>)</label>
          </div>
          <div class="columns-2">
            <el-select v-model="scheduleDetails7.classId" placeholder="请选择课程" style="width: 170px;" :clearable=true
                       @change="getOtherCoachList(scheduleDetails7.classId)">
              <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-3">
            <el-select v-model="scheduleDetails7.coachId" placeholder="请选择教练" style="width: 140px;" :clearable=true
                       @change="checkCoach">
              <el-option v-for="item in otherCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="columns-4">
            <el-radio label="不限制" v-model="scheduleDetails7.limit"></el-radio>
            <el-radio v-model="scheduleDetails7.limit"></el-radio>
            <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large"
                      v-model.number="scheduleDetails7.numberLimit"
                      :disabled="scheduleDetails7.limit== '不限制' "></el-input>
          </div>
        </div>
        <div class="add-temporary" style="margin-left: 309px;margin-bottom: 20px;"
             v-show="scheduleDetails7.coachId == 1">
          <span style="color: red;">*&nbsp;</span>
          <el-input style="width: 140px" placeholder="输入教练名称" v-model="scheduleDetails7.coachName"></el-input>
          <el-input style="width: 227px;margin-left: 15px;" placeholder="输入教练手机号"
                    v-model="scheduleDetails7.phone"></el-input>
          <p style="color: #f56c6c;height: 20px;margin-left: 13px;" v-show="coachValid7">请输入教练名称</p>
        </div>
        <!--end-->
        <el-form-item style="margin-left: 42px;">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="addSubmitForm">提交</el-button>
          <span style="color: #f56c6c;margin-left: 30px;">注：最大可预约人数若不填写则为不限人数</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--end-->
    <!--编辑课程-->
    <el-dialog :visible.sync="editFormVisible" width="500px" title="编辑课程信息" class="form-container"
               :closeOnClickModal="false">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
        <el-form-item label="课程名称" prop="className" style="margin-bottom: 20px;">
          {{editForm.className}}
        </el-form-item>
        <el-form-item label="上课时间" prop="environmentPath" style="margin-bottom: 20px;">
          {{editForm.yearBeginTime}}&nbsp;{{editForm.briefBeginTime}}
        </el-form-item>
        <el-form-item label="上课门店" prop="gymId" style="margin-bottom: 20px;">
          <el-select v-model="editForm.gymId" placeholder="请选择门店" style="width: 300px;" :clearable=false
                     @change="editChangeGym(editForm.gymId)">
            <el-option v-for="item in gymList" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课场地" prop="environmentId" style="margin-bottom: 20px;">
          <el-select v-model="editForm.environmentId" placeholder="请选择场地" style="width: 300px;" :clearable=false>
            <el-option v-for="item in enviroList" :key="item.id" :label="item.environmentName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教练" prop="coachId" style="margin-bottom: 20px;">
					<span v-if="editForm.coachType == 1">
						<el-select v-model="editForm.coachName" placeholder="请选择教练" style="width: 300px;" :clearable=false
                       disabled="disabled">
							<el-option v-for="item in editCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"> </el-option>
						</el-select>
					</span>
          <span v-else>
						<el-select v-model="editForm.coachId" placeholder="请选择教练" style="width: 300px;" :clearable=false>
							<el-option v-for="item in editCoachList" :key="item.id" :label="item.coachName"
                         :value="item.id"> </el-option>
						</el-select>
					</span>
        </el-form-item>
        <el-form-item label="上课人数" prop="numberLimit" style="margin-bottom: 20px;">
          <el-radio label="不限制" v-model="limit"></el-radio>
          <el-radio label=" " v-model="limit"></el-radio>
          <el-input style="width: 100px;" placeholder="预约人数" :number="true" size="large" v-model="editForm.numberLimit"
                    :disabled="limit== '不限制' "></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 20px;">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editSubmitForm">提交</el-button>
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
        copyForm: {
          gymId: '',
          copyTime: '',
          startDate: '',
          overDate: '',
          copyDate: '',
        },
        envirValid: false,
        coachValid1: false,
        coachValid2: false,
        coachValid3: false,
        coachValid4: false,
        coachValid5: false,
        coachValid6: false,
        coachValid7: false,
        coachFlag: null,
        copyRules: {
          copyTime: [{
            required: true,
            message: '请选择日期',
            trigger: 'blur'
          }],
          copyDate: [{
            required: true,
            message: '请选择日期',
            trigger: 'blur'
          }]
        },
        value3: '',
        copyTime: '',
        iDays: 0,
        pasteEndTime: '',
        pickerOptions1: {
          firstDayOfWeek: 1
        },
        listLoading: false,
        listQuery: {
          gymId: '',
          coachId: '',
        },
        addForm: {
          gymId: '',
          environmentId: '',
          scheduleTime: ''
        },
        timeValid: false,
        scheduleDetails: [],
        weekSchedules: {},
        scheduleDetails1: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails2: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails3: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails4: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails5: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails6: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        scheduleDetails7: {
          classId: '',
          coachId: '',
          numberLimit: '',
          limit: '不限制',
          scheduleDate: '',
          coachName: '',
          phone: '',
          coachType: 0
        },
        currentFWeekend1: {},
        currentFWeekend2: {},
        currentFWeekend3: {},
        currentFWeekend4: {},
        currentFWeekend5: {},
        currentFWeekend6: {},
        currentFWeekend7: {},
        classData: [],
        dataList: [],
        gymList: [],
        enviroList: [],
        classList: [],
        coachList: [],
        otherCoachList: [],
        editCoachList: [],
        selectedId: '',
        disabled: true,
        formatTime: '', //传递当前日期
        time: '',
        dataState: false,
        currentWeekend: [],
        currentFWeekend: [],
        pickerOptions: {
          firstDayOfWeek: 1,
        },

        addRules: {
          brandName: [{
            required: true,
            validator: valid.checkName,
            trigger: 'blur'
          }],

          scheduleTime: [{
            required: true,
            message: '请选择一个上课时间',
            trigger: 'change'
          }],
        },
        limit: '不限制',
        editForm: {
          gymId: '',
          environmentId: '',
          coachId: '',
          numberLimit: '',
        },
        editRules: {},
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
        //global_.$options.exportSession(this.getGymList);
        this.$axios({
          url: this.path + 'resource/gym/erp/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            this.listQuery.gymId = res.data[0].id;
            this.copyForm.gymId = res.data[0].id;
            this.gymList = res.data;
            this.getCoachList(this.listQuery.gymId);
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //获取教练列表
      getCoachList(id) {
        //global_.$options.exportSession(this.getCoachList);
        this.$axios({
          url: this.path + 'resource/coach/erp/list?gymId=' + id,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            this.coachList = res.data;
            this.coachList.unshift({
              "id": '',
              "coachName": "全部教练"
            });
            this.listQuery.coachId = ''
            this.dateTime();
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //获取教练列表
      getOtherCoachList(id) {
        //global_.$options.exportSession(this.getCoachList);
        this.$axios({
          url: this.path + 'resource/class/coach?classId=' + id,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            this.otherCoachList = res.data;
            this.otherCoachList.push({
              id: 1,
              coachName: '添加临时教练'
            })
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getEditCoachList(classId) {
        this.$axios({
          url: this.path + 'resource/class/coach?classId=' + classId,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            this.editCoachList = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //获取课程列表
      selectedClass(id, obj) {
        this.selectedId = id;
        this.classObj = obj;
      },
      editSubmitForm() {
        this.$confirm('您确定要提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.limit == '不限制') {
            this.editForm.numberLimit = 0
          }
          this.$axios({
            url: this.path + 'class/schedule/update',
            method: 'post',
            data: {
              id: this.editForm.id,
              gymId: this.editForm.gymId,
              environmentId: this.editForm.environmentId,
              coachId: this.editForm.coachId,
              numberLimit: this.editForm.numberLimit,
              coachType: this.editForm.coachType

            },
            transformRequest: [function (data) {
              let ret = ''
              for (let it in data) {
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
              if (res.data.code === 100000) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.classObj = [];
                $(".class_item").removeClass("selected");
                this.getClassData();
                this.editFormVisible = false;
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
            message: '已取消编辑'
          });
          this.editFormVisible = false;
        });
      },
      deleteClass() {
        if (this.selectedId == null || this.selectedId == '') {
          this.$message({
            message: '请选择要删除的课程',
            type: 'warning'
          });
        } else {
          this.$confirm('确认要删除吗？', '提示', {
            type: 'warning'
          }).then(() => {
            this.$axios({
              url: this.path + 'class/schedule/delete/' + this.selectedId,
              method: 'delete',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': this.token,

              }
            }).then((res) => {
              if (res.data.code === 100000) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getClassData();
              } else if (res.data.code === 300044) {
                this.$message({
                  message: res.data.message,
                  type: 'error'
                });
              }
              else {
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
      checkEnvironment(id) {
        if (id) {
          this.envirValid = false;
        } else {
          this.envirValid = true;
          return false;
        }
      },
      checkTime() {
        var time = $('#datetimepicker1').val();
        if (time == '' || time == null) {
          this.timeValid = true
        } else {
          this.timeValid = false
        }
      },
//			addChangeCoach(){
//				this.coachFlag = null;
//			},
      checkCoach() {

      },
      addSubmitForm() {
        var time = $('#datetimepicker1').val();
        if (time) {
          this.timeValid = false;
        } else {
          this.timeValid = true;
          return false;
        }
        if (this.scheduleDetails1.coachId == 1) {
          this.scheduleDetails1.coachType = 1;
          if (this.scheduleDetails1.coachName == '') {
            this.coachValid1 = true;
            return false;
          } else {
            this.coachValid1 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails1.coachType = 0
        }

        if (this.scheduleDetails2.coachId == 1) {
          this.scheduleDetails2.coachType = 1
          if (this.scheduleDetails2.coachName == '') {
            this.coachValid2 = true;
            return false;
          } else {
            this.coachValid2 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails2.coachType = 0
        }

        if (this.scheduleDetails3.coachId == 1) {
          this.scheduleDetails3.coachType = 1
          if (this.scheduleDetails3.coachName == '') {
            this.coachValid3 = true;
            return false;
          } else {
            this.coachValid3 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails3.coachType = 0
        }

        if (this.scheduleDetails4.coachId == 1) {
          this.scheduleDetails4.coachType = 1
          if (this.scheduleDetails4.coachName == '') {
            this.coachValid4 = true;
            return false;
          } else {
            this.coachValid4 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails4.coachType = 0
        }

        if (this.scheduleDetails5.coachId == 1) {
          this.scheduleDetails5.coachType = 1
          if (this.scheduleDetails5.coachName == '') {
            this.coachValid5 = true;
            return false;
          } else {
            this.coachValid5 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails5.coachType = 0
        }

        if (this.scheduleDetails6.coachId == 1) {
          this.scheduleDetails6.coachType = 1
          if (this.scheduleDetails6.coachName == '') {
            this.coachValid6 = true;
            return false;
          } else {
            this.coachValid6 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails6.coachType = 0

        }

        if (this.scheduleDetails7.coachId == 1) {
          this.scheduleDetails7.coachType = 1
          if (this.scheduleDetails7.coachName == '') {
            this.coachValid7 = true;
            return false;
          } else {
            this.coachValid7 = false;
            this.coachFlag = 1;
          }
        } else {
          this.scheduleDetails7.coachType = 0
        }


        this.scheduleDetails1.scheduleDate = this.currentFWeekend1.allFormat;
        this.scheduleDetails2.scheduleDate = this.currentFWeekend2.allFormat;
        this.scheduleDetails3.scheduleDate = this.currentFWeekend3.allFormat;
        this.scheduleDetails4.scheduleDate = this.currentFWeekend4.allFormat;
        this.scheduleDetails5.scheduleDate = this.currentFWeekend5.allFormat;
        this.scheduleDetails6.scheduleDate = this.currentFWeekend6.allFormat;
        this.scheduleDetails7.scheduleDate = this.currentFWeekend7.allFormat;


        if (this.scheduleDetails1.numberLimit == '') {
          this.scheduleDetails1.numberLimit = 0
        }
        if (this.scheduleDetails2.numberLimit == '') {
          this.scheduleDetails2.numberLimit = 0
        }
        if (this.scheduleDetails3.numberLimit == '') {
          this.scheduleDetails3.numberLimit = 0
        }
        if (this.scheduleDetails4.numberLimit == '') {
          this.scheduleDetails4.numberLimit = 0
        }
        if (this.scheduleDetails5.numberLimit == '') {
          this.scheduleDetails5.numberLimit = 0
        }
        if (this.scheduleDetails6.numberLimit == '') {
          this.scheduleDetails6.numberLimit = 0
        }
        if (this.scheduleDetails7.numberLimit == '') {
          this.scheduleDetails7.numberLimit = 0
        }
        this.scheduleDetails.push(this.scheduleDetails1);
        this.scheduleDetails.push(this.scheduleDetails2);
        this.scheduleDetails.push(this.scheduleDetails3);
        this.scheduleDetails.push(this.scheduleDetails4);
        this.scheduleDetails.push(this.scheduleDetails5);
        this.scheduleDetails.push(this.scheduleDetails6);
        this.scheduleDetails.push(this.scheduleDetails7);
        this.addForm.scheduleTime = time;
        this.weekSchedules = {
          gymId: this.listQuery.gymId,
          environmentId: this.addForm.environmentId,
          scheduleTime: this.addForm.scheduleTime,
          scheduleDetails: this.scheduleDetails
        }
        this.$confirm('您确定要提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: this.path + 'class/schedule/week/add',
            method: 'POST',
            data: {
              weekSchedules: JSON.stringify(this.weekSchedules)
            },
            transformRequest: [function (data) {
              let ret = ''
              for (let it in data) {
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
              if (res.data.code === 100000) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addForm.environmentId = '';
                $('#datetimepicker1').val("");
                this.scheduleDetails1.classId = null;
                this.scheduleDetails2.classId = null;
                this.scheduleDetails3.classId = null;
                this.scheduleDetails4.classId = null;
                this.scheduleDetails5.classId = null;
                this.scheduleDetails6.classId = null;
                this.scheduleDetails7.classId = null;
                this.scheduleDetails1.classId = null;

                this.scheduleDetails1.coachId = null;
                this.scheduleDetails2.coachId = null;
                this.scheduleDetails3.coachId = null;
                this.scheduleDetails4.coachId = null;
                this.scheduleDetails5.coachId = null;
                this.scheduleDetails6.coachId = null;
                this.scheduleDetails7.coachId = null;

                this.scheduleDetails1.coachName = ''
                this.scheduleDetails2.coachName = ''
                this.scheduleDetails3.coachName = ''
                this.scheduleDetails4.coachName = ''
                this.scheduleDetails5.coachName = ''
                this.scheduleDetails6.coachName = ''
                this.scheduleDetails7.coachName = ''

                this.scheduleDetails1.phone = ''
                this.scheduleDetails2.phone = ''
                this.scheduleDetails3.phone = ''
                this.scheduleDetails4.phone = ''
                this.scheduleDetails5.phone = ''
                this.scheduleDetails6.phone = ''
                this.scheduleDetails7.phone = ''

                this.scheduleDetails1.numberLimit = '';
                this.scheduleDetails2.numberLimit = '';
                this.scheduleDetails3.numberLimit = '';
                this.scheduleDetails4.numberLimit = '';
                this.scheduleDetails5.numberLimit = '';
                this.scheduleDetails6.numberLimit = '';
                this.scheduleDetails7.numberLimit = '';

                this.scheduleDetails1.limit = '不限制';
                this.scheduleDetails2.limit = '不限制'
                this.scheduleDetails3.limit = '不限制'
                this.scheduleDetails4.limit = '不限制'
                this.scheduleDetails5.limit = '不限制'
                this.scheduleDetails6.limit = '不限制'
                this.scheduleDetails7.limit = '不限制'

                this.scheduleDetails = [];

                this.addFormVisible = false;
                this.getClassData();
              } else if (res.data.code === 30044) {
                this.$message({
                  message: '已过期排课无法删除',
                  type: 'error'
                });
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
          this.$refs['addForm'].resetFields();
          this.addForm.environmentId = '';
          $('#datetimepicker1').val("");
          this.scheduleDetails1.classId = null;
          this.scheduleDetails2.classId = null;
          this.scheduleDetails3.classId = null;
          this.scheduleDetails4.classId = null;
          this.scheduleDetails5.classId = null;
          this.scheduleDetails6.classId = null;
          this.scheduleDetails7.classId = null;
          this.scheduleDetails1.classId = null;

          this.scheduleDetails1.coachId = null;
          this.scheduleDetails2.coachId = null;
          this.scheduleDetails3.coachId = null;
          this.scheduleDetails4.coachId = null;
          this.scheduleDetails5.coachId = null;
          this.scheduleDetails6.coachId = null;
          this.scheduleDetails7.coachId = null;

          this.scheduleDetails1.coachName = ''
          this.scheduleDetails2.coachName = ''
          this.scheduleDetails3.coachName = ''
          this.scheduleDetails4.coachName = ''
          this.scheduleDetails5.coachName = ''
          this.scheduleDetails6.coachName = ''
          this.scheduleDetails7.coachName = ''

          this.scheduleDetails1.phone = ''
          this.scheduleDetails2.phone = ''
          this.scheduleDetails3.phone = ''
          this.scheduleDetails4.phone = ''
          this.scheduleDetails5.phone = ''
          this.scheduleDetails6.phone = ''
          this.scheduleDetails7.phone = ''

          this.scheduleDetails1.numberLimit = '';
          this.scheduleDetails2.numberLimit = '';
          this.scheduleDetails3.numberLimit = '';
          this.scheduleDetails4.numberLimit = '';
          this.scheduleDetails5.numberLimit = '';
          this.scheduleDetails6.numberLimit = '';
          this.scheduleDetails7.numberLimit = '';

          this.scheduleDetails1.limit = '不限制';
          this.scheduleDetails2.limit = '不限制'
          this.scheduleDetails3.limit = '不限制'
          this.scheduleDetails4.limit = '不限制'
          this.scheduleDetails5.limit = '不限制'
          this.scheduleDetails6.limit = '不限制'
          this.scheduleDetails7.limit = '不限制'

          this.scheduleDetails = [];

//										this.addFormVisible = false;
        });
//					}else if(time == '' || time == null){
//						console.log('time空了')
//						this.timeValid = true
//						return false;
//					}else{
//						console.log('submit error')
//					}
//				});
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
          scrollMonth: false,
          onGenerate(ct) {
            list = [];
            var year = ct.getYear() + 1900,
              month = ct.getMonth() + 1,
              dates = ct.getDate();
            if (month < 10) {
              month = "0" + month;
            }
            if (dates < 10) {
              dates = "0" + dates;
            }

            argsTime = year + '-' + month + '-' + dates;
            self.formatTime = argsTime;
            var tr = $(this).find('.xdsoft_calendar tr'),
              parent = $('.xdsoft_current').parent('tr'),
              td = parent.find('.xdsoft_date');

            tr.find(".xdsoft_current").siblings('.xdsoft_date').css("background", "#33aaff");

            var c_year, c_month, c_date, c_format;
            td.each(function (i) {
              c_year = $(this).attr("data-year");
              c_month = parseInt($(this).attr("data-month")) + 1;
              c_date = $(this).attr("data-date");
              if (c_month < 10) {
                c_month = "0" + c_month;
              }
              if (c_date < 10) {
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
      setFormatTime(weekend) {
        this.currentWeekend = weekend;
        var arr = this.currentWeekend;
        var year, month, dates, fm = [];
        for (var i = 0; i < arr.length; i++) {
          year = this.currentWeekend[i].substring(0, 4)
          month = this.currentWeekend[i].substring(5, 7)
          dates = this.currentWeekend[i].substring(8, 10)
          fm[i] = year + '-' + month + '-' + dates;
        }
        this.currentFWeekend1 = {
          dates: this.currentWeekend[0].substring(5, 11),
          weekend: '星期一',
          allFormat: fm[0]
        };
        this.currentFWeekend2 = {
          dates: this.currentWeekend[1].substring(5, 11),
          weekend: '星期二',
          allFormat: fm[1]
        };
        this.currentFWeekend3 = {
          dates: this.currentWeekend[2].substring(5, 11),
          weekend: '星期三',
          allFormat: fm[2]
        };
        this.currentFWeekend4 = {
          dates: this.currentWeekend[3].substring(5, 11),
          weekend: '星期四',
          allFormat: fm[3]
        };
        this.currentFWeekend5 = {
          dates: this.currentWeekend[4].substring(5, 11),
          weekend: '星期五',
          allFormat: fm[4]
        };
        this.currentFWeekend6 = {
          dates: this.currentWeekend[5].substring(5, 11),
          weekend: '星期六',
          allFormat: fm[5]
        };
        this.currentFWeekend7 = {
          dates: this.currentWeekend[6].substring(5, 11),
          weekend: '星期日',
          allFormat: fm[6]
        };
      },
      getClassData() {
        this.listLoading = true;
        this.$axios({
          url: this.path + 'class/schedule/list',
          method: 'get',
          params: {
            gymId: this.listQuery.gymId,
            coachId: this.listQuery.coachId,
            beginTime: this.formatTime
          },
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            if (res.data.code === 100000) {
              if (res.data.result.length > 0) {
                this.dataState = false;
                this.classData = res.data.result;
              } else {
                this.classData = null
                this.dataState = true;
              }
              this.listLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //查询健身房场地
      getEnvironment(id) {
        this.$axios({
          url: this.path + 'resource/gym/environ/list',
          method: 'get',
          params: {
            gymId: id,
          },
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
      //查询健身房课程
      getClassList() {
        this.$axios({
          url: this.path + 'resource/class/list',
          method: 'get',
          params: {
            gymId: this.listQuery.gymId,
            classKind: 3
          },
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            if (res.data != null) {
              this.classList = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //操作dom;
      domHandel() {
        $(".class-list").on("click", ".class_item", function () {
          $(".class_item").removeClass("selected");
          $(this).addClass("selected");
        });
      },
      handleAdd() {
        this.getEnvironment(this.listQuery.gymId);
//				this.getOtherCoachList();
        this.getClassList();
        this.addFormVisible = true;
        this.$nextTick(() => {
          $('#datetimepicker1').datetimepicker({
            datepicker: false,
            format: 'H:i',
            step: 15
          });
        });
      },
      editChangeGym(id) {

        this.editForm.environmentId = this.enviroList[0].id;
        this.editForm.coachId = this.otherCoachList[0].id;
        this.getEnvironment(id);
        this.getOtherCoachList(id);

      },
      handleEdit() {
        if (this.classObj == null || this.classObj == '') {
          this.$message({
            message: '请选择要编辑 的课程',
            type: 'warning'
          });
        } else {
          this.editForm = '';
          this.getEnvironment(this.listQuery.gymId);
          this.editForm = Object.assign({}, this.classObj);
          this.getEditCoachList(this.editForm.classId);
          if (this.classObj.numberLimit == 0 || this.classObj.numberLimit == '') {
            this.limit = '不限制'
          } else {
            this.limit = ' '
          }

          this.editFormVisible = true;
        }
      },
      handleClose() {
        this.$refs['addForm'].resetFields();
        this.addForm.environmentId = '';
        $('#datetimepicker1').val("");
        this.scheduleDetails1.classId = null;
        this.scheduleDetails2.classId = null;
        this.scheduleDetails3.classId = null;
        this.scheduleDetails4.classId = null;
        this.scheduleDetails5.classId = null;
        this.scheduleDetails6.classId = null;
        this.scheduleDetails7.classId = null;
        this.scheduleDetails1.classId = null;

        this.scheduleDetails1.coachId = null;
        this.scheduleDetails2.coachId = null;
        this.scheduleDetails3.coachId = null;
        this.scheduleDetails4.coachId = null;
        this.scheduleDetails5.coachId = null;
        this.scheduleDetails6.coachId = null;
        this.scheduleDetails7.coachId = null;


        this.scheduleDetails1.coachName = ''
        this.scheduleDetails2.coachName = ''
        this.scheduleDetails3.coachName = ''
        this.scheduleDetails4.coachName = ''
        this.scheduleDetails5.coachName = ''
        this.scheduleDetails6.coachName = ''
        this.scheduleDetails7.coachName = ''

        this.scheduleDetails1.phone = ''
        this.scheduleDetails2.phone = ''
        this.scheduleDetails3.phone = ''
        this.scheduleDetails4.phone = ''
        this.scheduleDetails5.phone = ''
        this.scheduleDetails6.phone = ''
        this.scheduleDetails7.phone = ''

        this.scheduleDetails1.numberLimit = '';
        this.scheduleDetails2.numberLimit = '';
        this.scheduleDetails3.numberLimit = '';
        this.scheduleDetails4.numberLimit = '';
        this.scheduleDetails5.numberLimit = '';
        this.scheduleDetails6.numberLimit = '';
        this.scheduleDetails7.numberLimit = '';

        this.scheduleDetails1.limit = '不限制';
        this.scheduleDetails2.limit = '不限制'
        this.scheduleDetails3.limit = '不限制'
        this.scheduleDetails4.limit = '不限制'
        this.scheduleDetails5.limit = '不限制'
        this.scheduleDetails6.limit = '不限制'
        this.scheduleDetails7.limit = '不限制'

        this.scheduleDetails = [];

        this.addFormVisible = false;
      },
      //计算日期差
      DateDiff(val) { //sDate1和sDate2是2006-12-18格式
        this.copyForm.startDate = val[0],
          this.copyForm.overDate = val[1];
        var oDate1, oDate2, sy, sm, sd, oy, om, od;
        sy = this.copyForm.startDate.slice(0, 4);
        sm = this.copyForm.startDate.slice(5, 7);
        sd = this.copyForm.startDate.slice(8, 10);
        oy = this.copyForm.overDate.slice(0, 4);
        om = this.copyForm.overDate.slice(5, 7);
        od = this.copyForm.overDate.slice(8, 10);
        oDate1 = new Date(sm + '-' + sd + '-' + sy) //转换为12-18-2006格式
        oDate2 = new Date(om + '-' + od + '-' + oy)
        this.iDays = parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
        if (this.copyForm.copyDate != null && this.copyForm.copyDate != '') {
          this.copyDateChange(this.copyForm.copyDate);
        }
      },
      copyDateChange(startDate) {
        if (startDate != null && startDate != '') {
          var day = this.iDays;
          startDate = new Date(startDate);
          startDate = +startDate + 1000 * 60 * 60 * 24 * (day);
          startDate = new Date(startDate);

          var year = startDate.getFullYear(),
            month = startDate.getMonth() + 1,
            dates = startDate.getDate();
          if (month < 10) {
            month = "0" + month;
          }
          if (dates < 10) {
            dates = "0" + dates;
          }
          this.pasteEndTime = year + "-" + month + "-" + dates;
        }
      },
      //复制课程数据
      copyClassData() {
        if (this.copyForm.startDate != '' && this.copyForm.copyDate != '') {
          this.$confirm('您确定要提交吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.editLoading = true;
            this.$axios({
              url: this.path + 'class/schedule/copy',
              method: 'post',
              data: {
                gymId: this.copyForm.gymId,
                startDate: this.copyForm.startDate,
                overDate: this.copyForm.overDate,
                copyDate: this.copyForm.copyDate,

              },
              transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
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
                if (res.data.code === 100000) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.copyForm.copyTime = '';
                  this.copyForm.copyDate = '';
                  this.pasteEndTime = '';
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
              message: '已取消编辑'
            });
          });
        } else {
          this.$message({
            message: '请选择日期',
            type: 'warning'
          });
        }
      },

    }
  }
</script>
<style scoped="scoped">
  .el-popper {
    display: block !important;
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
    height: 270px;
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

  .class_item {
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }

  .class_item:last-child {
    padding-bottom: 0;
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

  .selected p {
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

  .add-class-row > div {
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

  .form-container .el-input,
  .form-container .el-select {
    width: 150px;
  }
</style>
