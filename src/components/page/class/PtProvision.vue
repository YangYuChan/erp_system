<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
        <el-breadcrumb-item>私教课程设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="listQuery.gymId" placeholder="全部健身房" :clearable=true @change="handleFilter">
          <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.classStatus" placeholder="全部课程" :clearable=true @change="handleFilter">
          <el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;">
        <!--<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>-->
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加私教课程</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="classStatus" label="课程状态">
        <template slot-scope="scope">
          <span v-if="scope.row.classStatus == 0">服务号课程</span>
          <span v-else-if="scope.row.classStatus == 1">门店课程</span>
        </template>
      </el-table-column>
      <el-table-column prop="classTime" label="课程时长"></el-table-column>
      <el-table-column prop="classInfo" label="课程简介"></el-table-column>
      <el-table-column prop="classPrice" label="课程价格"></el-table-column>
      <el-table-column prop="classNumber" label="课时"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <span v-if="scope.row.classStatus == '0'">
					<el-button type="danger" size="small" @click="handleSoldOut(scope.row)">下架</el-button>
					</span>
          <span v-else>
					<el-button type="success" size="small" @click="handleSoldIn(scope.row)">上架</el-button>
					</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--添加课程-->
    <div class="panel">
      <el-dialog :visible.sync="addFormVisible" title="添加私教课程" width="600px" :before-close="handleClose" :closeOnClickModal="false">
        <el-form ref="addForm" :model="addForm" label-width="130px" :rules="addRules" class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="addForm.className" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="classInfo">
             <el-input v-model="addForm.classInfo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="封面图" prop="classPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
              <img v-if="addForm.classPath" :src="addForm.classPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="视频上传" prop="classVideoUrl">
            <el-upload ref="upload" class="upload-demo"
                       :action="uploadVUrl()"
                       :on-success="addClassVideo"
                       :before-upload="beforeVideoUpload"
                       :file-list="videoList"
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传正确的视频格式文件(mp4、flv、avi、3gp)</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择课程分类">
              <el-option v-for="item in classType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="健身房" prop="gymId">
            <el-select v-model="addForm.gymId" placeholder="请选择健身房" @change="coachChange">
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上线到服务号" prop="classStatus">
            <el-radio-group v-model="addForm.classStatus">
              <el-radio v-for="item in statusList" :key="item.id" :label="item.id" :value="item.id">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="addForm.gymId != '' && addForm.classStatus == 0">
            <el-form-item label="健身教练">
              <el-select v-model="addForm.coachId" placeholder="请选择教练">
                <el-option v-for="item in coachData" :key="item.id" :label="item.coachName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="课程库存" prop="classStorage">
            <el-input v-model.number="addForm.classStorage"></el-input>
          </el-form-item>
          <el-form-item label="课程时间(分钟)" prop="classTime">
            <el-input v-model="addForm.classTime"></el-input>
          </el-form-item>
          <el-form-item label="课时" prop="classNumber">
            <el-input v-model.number="addForm.classNumber"></el-input>
          </el-form-item>
          <el-form-item label="课程价格" prop="classPrice">
            <el-input v-model="addForm.classPrice"></el-input>
          </el-form-item>
          <el-form-item>
          	<el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--编辑课程-->
    <div class="panel">
      <el-dialog :visible.sync="editFormVisible"  title="编辑私教课程" width="600px" :closeOnClickModal="false">
        <el-form ref="editForm" :model="editForm" label-width="130px" :rules="editRules"  class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="editForm.className" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="classInfo">
             <el-input v-model="editForm.classInfo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="封面图" prop="classPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="handleAvatarEditSuccess"
                       :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
              <img v-if="editForm.classPath" :src="editForm.classPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="视频上传" prop="classVideoUrl">
            <el-upload ref="upload"
                       :action="uploadVUrl()"
                       :on-success="editClassVideo"
                       :file-list="videoList"
                       :before-upload="beforeVideoUpload"
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传正确的视频格式文件(mp4、flv、avi、3gp)</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="editForm.typeId" placeholder="请选择课程分类">
              <el-option v-for="item in classType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="健身房" prop="gymId">
            <el-select v-model="editForm.gymId" placeholder="请选择健身房" @change="editCoachChange">
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上线到服务号" prop="classStatus">
            <el-radio-group v-model="editForm.classStatus">
              <el-radio v-for="item in statusList" :key="item.id" :label="item.id" :value="item.id">{{item.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="editForm.gymId != '' && editForm.classStatus == 0">
            <el-form-item label="健身教练">
              <el-select v-model="editForm.coachId" placeholder="请选择教练">
                <el-option v-for="item in coachData" :key="item.id" :label="item.coachName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程库存" prop="classStorage">
              <el-input v-model.number="editForm.classStorage"></el-input>
            </el-form-item>
          </template>

          <el-form-item label="课程时间(分钟)" prop="classTime">
            <el-input v-model="editForm.classTime"></el-input>
          </el-form-item>
          <el-form-item label="课时" prop="classNumber">
            <el-input v-model.number="editForm.classNumber"></el-input>
          </el-form-item>
          <el-form-item label="课程价格" prop="classPrice">
            <el-input v-model="editForm.classPrice"></el-input>
          </el-form-item>
          <el-form-item>
          	<el-button @click="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
        actionV: global_.actionV,
        tableData: [], //列表数组
        gymData: [],//健身房
        classType: [],//健身房
        videoList: [],
        coachClassData: [],
        coachData: [],
        coachId: [],
        addFormVisible: false,
        editFormVisible: false,
        addForm: {
          className: '',
          classTime: '',
          classNotice: '',
          classInfo: '',
          classPath: '',
          classStatus: 1,
          coachId: '',
          classVideoUrl: '',
          classVideoTime: 0,
          classNumber: 1,
          classStorage: '',
          classVideoSize: 0,
          classKind: 1,
          typeId: '',
          gymId: '',
          isFree: true,
          classPrice: ''
        },
        statusList:[{
          id:0,
          value:'是'
        },{
          id:1,
          value:'否'
        }],
        addRules: {
          className: [
            {required: true, validator: valid.checkClassName, trigger: 'blur'}
          ],
          classNumber: [
            {required: true, message: '请输入课时', trigger: 'blur'}
          ],
          classTime:[
            {required: true, message: '请输入课程时长', trigger: 'blur'}
          ],
          classPrice:[
            {required: true, validator: valid.checkPPrice, trigger: 'blur'}
          ],
          gymId:[
            {required: true, message: '请选择健身房', trigger: 'change'}
          ],
        },
        editForm: {
          className: '',
          classTime: '',
          classNotice: '',
          classInfo: '',
          classPath: '',
          classStatus: '',
          coachId: '',
          classVideoUrl: '',
          classVideoTime: 0,
          classNumber: 1,
          classStorage: 0,
          classVideoSize: 0,
          classKind: 1,
          typeId: '',
          gymId: '',
          isFree: true,
          classPrice: 0
        },
        editRules: {
          className: [
            {required: true, validator: valid.checkClassName, trigger: 'blur'}
          ],
          classNumber: [
            {required: true, message: '请输入课时', trigger: 'blur'}
          ],
          classTime:[
            {required: true, message: '请输入课程时长', trigger: 'blur'}
          ],
          classPrice:[
            {required: true, validator: valid.checkPPrice, trigger: 'blur'}
          ],
          gymId:[
            {required: true, message: '请选择健身房', trigger: 'change'}
          ],
        },
        token: '',
        statusData: [{
          id: 0,
          value: '上架课程'
        }, {
          id: 1,
          value: '下架课程'
        }],
        listLoading: false,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          gymId: '',
          classStatus: ''
        },

      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getData();
      });
    },
    methods: {
      uploadUrl() {
        return this.action
      },
      uploadHeaders() {
        var headers = {
          'Authorization': this.token
        }
        return headers
      },
      uploadVUrl() {
        return this.actionV
      },
      handleAvatarSuccess(res, file) {
        global_.$options.exportSession(this.handleAvatarSuccess);
        this.addForm.classPath = res;
      },
      handleAvatarEditSuccess(res, file) {
        global_.$options.exportSession(this.handleAvatarEditSuccess);
        this.editForm.classPath = res;
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
      selectCoachClass(classId) {
        global_.$options.exportSession(this.selectCoachClass);
        this.$axios({
          url: this.path + 'resource//class/coach?classId=' + classId,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.editForm.coachId = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },

      getType() {
        this.$axios({
          url: this.path + 'resource/gym/erp/list',
          method: 'get',
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
            this.gymData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      coachChange() {
      	this.coachData = [];
        this.$axios({
          url: this.path + 'resource/coach/erp/list?gymId=' + this.addForm.gymId,
          method: 'get',
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
            this.coachData = res.data;
            if(res.data != ''){
            	this.addForm.coachId = this.coachData[0].id
            }else{
            	this.addForm.coachId = ''
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      editCoachChange() {
      	this.coachData = [];
        this.$axios({
          url: this.path + 'resource/coach/erp/list?gymId=' + this.editForm.gymId,
          method: 'get',
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
            this.coachData = res.data;
            if(res.data == ''){
            	this.editForm.coachId = ''
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
//    addClassVideo(file, fileList) {
//      global_.$options.exportSession(this.addClassVideo);
//      this.addForm.classVideoUrl = fileList.response;  //获取上传的资源地址
//      var sname = fileList.response.substring(fileList.response.lastIndexOf('/') + 1)//截取文件名
//      var name = {"name": sname};
//      this.videoList.push(name)//保存文件名到数组
//      var args = this.videoList.pop();//把最新的文件名放到一个新数组
//      this.videoList = new Array(args)//把新数组里的文件名显示出来
//    },
//    editClassVideo(file, fileList) {
//      global_.$options.exportSession(this.editClassVideo);
//      this.editForm.classVideoUrl = fileList.response;  //获取上传的资源地址
//      var sname = fileList.response.substring(fileList.response.lastIndexOf('/') + 1)//截取文件名
//      var name = {"name": sname};
//      this.videoList.push(name)//保存文件名到数组
//      var args = this.videoList.pop();//把最新的文件名放到一个新数组
//      this.videoList = new Array(args)//把新数组里的文件名显示出来
//    },
		addClassVideo(file, fileList) {
        global_.$options.exportSession(this.addClassVideo);
        this.addForm.classVideoUrl = file;  //获取上传的资源地址
        var sname = fileList.name//截取文件名
        var name = {"name": sname};
        this.videoList.push(name)//保存文件名到数组
        var args = this.videoList.pop();//把最新的文件名放到一个新数组
        this.videoList = new Array(args)//把新数组里的文件名显示出来
      },
      editClassVideo(file, fileList) {
        global_.$options.exportSession(this.editClassVideo);
        this.editForm.classVideoUrl = file;  //获取上传的资源地址
        var sname = fileList.response.name//截取文件名
        var name = {"name": sname};
        this.videoList.push(name)//保存文件名到数组
        var args = this.videoList.pop();//把最新的文件名放到一个新数组
        this.videoList = new Array(args)//把新数组里的文件名显示出来
      },
      getClassType() {
        this.$axios({
          url: this.path + 'resource/class/types',
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.classType = res.data
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getTotal() {
        this.$axios({
          url: this.path + 'resource/class/count?classKind=2',
          method: 'get',
          params: this.listQuery,
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
          url: this.path + 'resource/class/list?classKind=2',
          method: 'get',
          params: this.listQuery,
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
              this.getTotal();
              this.getType();
              this.getClassType();
              this.tableData = res.data;
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
      //下架
      handleSoldOut(row) {
        global_.$options.exportSession(this.handleSoldOut);
        this.$confirm('确认要下架该课程吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/class/disable/' + row.id,
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data.code === 100000) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '操作失败，'+res.data.message,
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
        this.$confirm('确认要上架该课程吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/class/enable/' + row.id,
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data.code === 100000) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else if (res.data === 0) {
              this.$message({
                message: '操作失败，'+res.data.message,
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getData();
      },
      handleAdd() {
        global_.$options.exportSession(this.handleAdd);
        this.videoList = [];
        this.coachId = [];
        this.addFormVisible = true;
      },
      //添加
      addSubmitForm() {
        global_.$options.exportSession(this.addSubmitForm);
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/class/add',
                method: 'put',
                data: {
                  className: this.addForm.className,
                  classPath: this.addForm.classPath,
                  classInfo: this.addForm.classInfo,
                  classVideoUrl: this.addForm.classVideoUrl,
                  classTime: this.addForm.classTime,
                  coachId: this.addForm.coachId,
                  classNotice: this.addForm.classNotice,
                  classKind: 2,
                  classStatus: this.addForm.classStatus,
                  classNumber: this.addForm.classNumber,
                  classStorage: this.addForm.classStorage,
                  isFree: 0,
                  typeId: this.addForm.typeId,
                  gymId: this.addForm.gymId,
                  classPrice: this.addForm.classPrice,
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.getData();
                  } else {
                    this.$message({
                      message: res.data.message,
                      type: 'error'
                    });
                  }
                })
                .catch((err) => {
                  this.$message({
                    message: '加载失败',
                    type: 'error'
                  });
                })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消添加'
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleEdit(row) {
        global_.$options.exportSession(this.handleEdit);
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.videoList = [];
        if(row.classVideoUrl != null && row.classVideoUrl !=''){
        	var sname = row.classVideoUrl.substring(row.classVideoUrl.lastIndexOf('/') + 1)
        	var name = {"name": sname};
        	this.videoList.push(name)
        }else{
        	this.videoList=[]
        }
        this.editCoachChange();
      },
      editSubmitForm() {
        global_.$options.exportSession(this.editSubmitForm);
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.editForm.classVideoUrl == null) {
			          this.editForm.classVideoUrl = '';
			        }
              this.$axios({
                url: this.path + 'resource/class/update',
                method: 'post',
                data: {
                  id: this.editForm.id,
                  className: this.editForm.className,
                  classPath: this.editForm.classPath,
                  classInfo: this.editForm.classInfo,
                  classVideoUrl: this.editForm.classVideoUrl,
                  classTime: this.editForm.classTime,
                  coachId: this.editForm.coachId,
                  classNotice: this.editForm.classNotice,
                  classKind: 2,
                  classStatus: this.editForm.classStatus,
                  classNumber: this.editForm.classNumber,
                  classStorage: this.editForm.classStorage,
                  typeId: this.editForm.typeId,
                  gymId: this.editForm.gymId,
                  isFree: 0,
                  classPrice: this.editForm.classPrice,
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editForm'].resetFields();
                    this.editFormVisible = false;
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
      handleClose(){
      	this.$refs['addForm'].resetFields();
				this.addFormVisible = false;
      },
      beforeVideoUpload(file){
        let supportedTypes = ['video/mp4', 'video/3gp', 'video/flv','video/avi','video/mp3'];
				const isVideo = supportedTypes.indexOf(file.type)
				if (isVideo < 0) {
					this.$message.error('上传视频格式错误!');
					return false;
				}
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

</style>
