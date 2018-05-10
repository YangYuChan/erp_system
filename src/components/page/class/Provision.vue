<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
        <el-breadcrumb-item>团课设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="text-align: right;margin-bottom: 20px;">
    	<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加团课</el-button>
    </div>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="classTime" label="课程时长"></el-table-column>
      <el-table-column prop="classInfo" label="课程简介"></el-table-column>
      <el-table-column prop="classPrice" label="课程价格"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
      <el-dialog :visible.sync="addFormVisible"  title="添加课程" width="600px" :closeOnClickModal="false">
        <el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules" class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="addForm.className" ></el-input>
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
            <el-upload ref="upload" class="upload-demo upload-video"
                       :action="uploadVUrl()"
                       :on-success="addClassVideo"
                       :file-list="videoList"
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择课程分类" >
              <el-option v-for="item in classType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="健身房" prop="gymId">
            <el-select v-model="addForm.gymId" placeholder="请选择健身房"  @change="coachChange" >
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="addForm.gymId != ''">
            <el-form-item label="健身教练">
              <el-checkbox-group v-model="coachId" >
                <el-checkbox v-for="item in coachData" :label="item.id" :key="item.id" :value="item.id" >{{item.coachName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <el-form-item label="是否免费" prop="isFree">
            <el-select v-model="addForm.isFree" placeholder="是否免费" @change="FreeChange" >
              <el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程售价" prop="classPrice">
          		<el-input v-model="addForm.classPrice" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="课程时间(分钟)" prop="classTime">
            <el-input v-model="addForm.classTime" :value="0" ></el-input>
          </el-form-item>
          <el-form-item label="注意事项" prop="classNotice">
           <el-input v-model="addForm.classNotice" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
          	<el-button @click="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>


    <!--编辑课程-->
    <div class="panel">
      <el-dialog :visible.sync="editFormVisible"  title="编辑课程"  width="600px" :closeOnClickModal="false">
        <el-form ref="editForm" :model="editForm" label-width="120px" :rules="editRules" class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="editForm.className" ></el-input>
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
            <el-upload ref="upload" class="upload-demo upload-video"
                       :action="uploadVUrl()"
                       :on-success="editClassVideo"
                       :file-list="videoList"
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="editForm.typeId" placeholder="请选择课程分类" >
              <el-option v-for="item in classType" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="健身房" prop="gymId">
            <el-select v-model="editForm.gymId" placeholder="请选择健身房"  @change="editCoachChange" >
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <template v-if="editForm.gymId != ''">
            <el-form-item label="健身教练">
              <el-checkbox-group v-model="coachId">
                <el-checkbox v-for="item in coachData" :label="item.id" :key="item.id" :value="item.id" >{{item.coachName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <el-form-item label="是否免费" prop="isFree">
            <el-select v-model="editForm.isFree" placeholder="是否免费" @change="editFreeChange" >
              <el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程售价" prop="classPrice">
            <el-input v-model="editForm.classPrice" :value="0" :disabled="disabledE"></el-input>
          </el-form-item>
          <el-form-item label="课程时间(分钟)" prop="classTime">
            <el-input v-model="editForm.classTime"></el-input>
          </el-form-item>
          <el-form-item label="注意事项" prop="classNotice">
           <el-input v-model="addForm.classNotice" type="textarea"></el-input>
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
//import { quillEditor } from 'vue-quill-editor'
  const Axios = new AXIOS();
  export default {
//	components: {
//			quillEditor
//		},
    data() {
      return {
        path: global_.path,
        action: global_.action,
        actionV: global_.actionV,
        tableData: [], //列表数组
        gymData: [],//健身房
        classType: [],//健身房
        videoList: [],
        coachClassData:[],
        coachData:[],
        coachId: [],
        token: '',
//      qeditor: '',
//      editorOption: {
//					modules: {
//						toolbar: '#toolbar',
//					}
//				},
        addFormVisible: false,
        editFormVisible: false,
        listLoading: false,
        total: null,
        listQuery: {
          page: 1,
          limit: 10,
        },
        freeData: [{
          type: false,
          value: '否'
        },
          {
            type: true,
            value: '是'
          }],
        disabled:true,
        disabledE:false,
        addForm: {
          className: '',
          classTime: '',
          classNotice: '',
          classInfo: '',
          classPath: '',
          classVideoUrl: '',
          classVideoTime: 0,
          classVideoSize: 0,
          classKind: 1,
          typeId: '',
          gymId: '',
          isFree: true,
          classPrice: 0
        },
        addRules: {
          className: [
            {required: true, validator: valid.checkClassName, trigger: 'blur'}
          ],
          classTime: [
            {required: true, message: '请输入课程时长', trigger: 'blur'}
          ]
        },
        editForm: {
          className: '',
          classTime: '',
          classNotice: '',
          classInfo: '',
          classPath: '',
          classVideoUrl: '',
          classVideoTime: 0,
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
           classTime: [
            {required: true, message: '请输入课程时长', trigger: 'blur'}
          ]
        },
      }
    },
//		computed: {
//			editor() {
//				return this.$refs.myTextEditor.quill;
//			}
//		},
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
      selectCoachClass(classId){
        global_.$options.exportSession(this.selectCoachClass);
        this.$axios({
          url: this.path + 'resource/class/coach?classId='+classId,
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
                this.coachId.push(data.id);
              })
            }
          })
          .catch((err) => {
            console.log(err);
          })
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
                  coachId:this.coachId,
                  classNotice:this.addForm.classNotice,
                  classKind:3,
                  typeId: this.addForm.typeId,
                  gymId: this.addForm.gymId,
                  isFree: this.addForm.isFree,
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
      editSubmitForm() {
        if (this.editForm.classVideoUrl == null) {
          this.editForm.classVideoUrl = '';
        }
        global_.$options.exportSession(this.editSubmitForm);
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.editLoading = true;
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
                  coachId:this.coachId,
                  classNotice:this.editForm.classNotice,
                  classKind:3,
                  typeId: this.editForm.typeId,
                  gymId: this.editForm.gymId,
                  isFree: this.editForm.isFree,
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
      getTotal() {
        this.$axios({
          url: this.path + 'resource/class/count?classKind=3',
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
            this.total = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      FreeChange(){
					var isFree = this.addForm.isFree;
					if(isFree == true){
							this.addForm.classPrice = 0;
							this.disabled = true
					}else{
							this.addForm.classPrice = '';
							this.disabled = false
					}
      },
      editFreeChange(){
      	var isFree = this.editForm.isFree;
					if(isFree == true){
						  this.editForm.classPrice = 0;
							this.disabledE = true
					}else{
						  this.editForm.classPrice = '';
							this.disabledE = false
					}
      },
      coachChange(){
        this.$axios({
          url: this.path + 'resource/coach/erp/list?page=0&gymId='+this.addForm.gymId,
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
          })
          .catch((err) => {
            console.log(err);
          })
      },
      editCoachChange(){
        this.$axios({
          url: this.path + 'resource/coach/erp/list?page=0&gymId='+this.editForm.gymId,
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
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getData() {
        global_.$options.exportSession(this.getData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'resource/class/list?classKind=3',
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
      handleEdit(row) {
        global_.$options.exportSession(this.handleEdit);
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.selectCoachClass(this.editForm.id);
        this.videoList = [];
        this.coachId = [];
        if(row.classVideoUrl != null && row.classVideoUrl !=''){
        	var sname = row.classVideoUrl.substring(row.classVideoUrl.lastIndexOf('/') + 1)
        	var name = {"name": sname};
        	this.videoList.push(name)
        }else{
        	this.videoList=[]
        }
        this.editCoachChange();
      },
//    onEditorFocus(editor) {
//				this.qeditor = editor
//			},
//			onEditorReady(editor) {
//				this.qeditor = editor;
//			},
//			customButtonClick() {
//				var range
//				if(this.qeditor.getSelection() != null) {
//					range = this.qeditor.getSelection()
//					this.length = range.index //content获取到焦点，计算光标所在位置，目的为了在该位置插入img
//				} else {
//					this.length = this.content.length //content没有获取到焦点时候 目的是为了在content末尾插入img
//				}
//			},
//			uploadEditorImage(){
//		        var img = event.target.files[0];
//		        if(!img){
//		            return ;
//		        }
//		        var that = this;
//		       	var formData = new FormData();
// 				formData.append("file", img);
//		        this.$axios({
//						url: global_.action,
//						method: 'put',
//						data: formData,
//						headers: {
//						'Content-Type': 'application/x-www-form-urlencoded',
//						'Authorization': this.token,
//						}
//						})
//						.then((res) => {
//							let self = this;
//							self.qeditor.insertEmbed(self.length, 'image', res.data);
//						})
//						.catch((err) => {
//							console.log(err);
//						})
//
//
//			},
    }
  }
</script>
<style type="text/css" scoped="scoped">
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

  .details-title {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    height: 50px;
    margin-bottom: 20px;
    color: #1f2d3d;
  }

  .details-content {
    font-size: 14px;
    line-height: 1.5;
    padding: 0 5rem;
  }

  .el-checkbox+.el-checkbox{
  	margin-left: 0;
  }
  .form-container .el-checkbox{
  	margin-right: 30px;
  	width: 70px;
  }

</style>
