<template>
  <div class="table">
  	<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery">
				 <el-form-item style="margin-bottom: 0;">
	        <el-select v-model="listQuery.gymId" placeholder="全部健身房" :clearable=true  @change="handleFilter">
	          <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
	        </el-select>
	      </el-form-item>
			</el-form>
		</div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
        <el-breadcrumb-item>私教管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="listQuery.coachId" placeholder="全部教练" :clearable=true @change="handleFilter">
          <el-option v-for="item in coachData" :key="item.id" :label="item.coachName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.className" placeholder="课程名称" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="用户手机或昵称" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-select v-model="listQuery.source" placeholder="售卖通道" :clearable=true @change="handleFilter">
          <el-option v-for="item in statusData" :key="item.value" :label="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="listQuery.status" placeholder="课程状态" :clearable=true @change="handleFilter">
          <el-option v-for="item in classStatusList" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="coachName" label="教练"></el-table-column>
      <el-table-column prop="saleCoachName" label="销售教练"></el-table-column>
      <el-table-column prop="memberName" label="购买人"></el-table-column>
      <el-table-column prop="memberPhone" label="手机号"></el-table-column>
      <el-table-column prop="fee" label="价格">
        <template slot-scope="scope">
          <span>
					 {{scope.row.fee}}元
					</span>
        </template>
      </el-table-column>
      <el-table-column prop="amountClassNumber" label="购买课时"></el-table-column>
      <el-table-column prop="classNumber" label="剩余课时"></el-table-column>
      <el-table-column prop="lastScheduleTime" label="最近上课时间"></el-table-column>
      <el-table-column prop="createTime" label="时间">
        <template slot-scope="scope">
          <span v-if="scope.row.spareClassNumber == 0">
					  已确认
					</span>
          <span v-else>
            待确定
					</span>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="售卖通道"></el-table-column>
      <el-table-column prop="status" label="课程状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">
					  进行中
					</span>
          <span v-else-if="scope.row.status == 1">
            已结课
					</span>
          <span v-else-if="scope.row.status == 2">
            已退课
					</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="350">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 2">
            <el-button size="small" disabled="disabled">编辑时间</el-button>
            <el-button size="small" disabled="disabled">结课</el-button>
            <el-button size="small" disabled="disabled">销课</el-button>
            <el-button size="small" disabled="disabled">退款</el-button>
          </div>
          <div v-else-if="scope.row.status == 1">
            <el-button size="small">编辑时间</el-button>
            <el-button size="small" disabled="disabled">结课</el-button>
            <el-button size="small" disabled="disabled">销课</el-button>
            <el-button size="small" disabled="disabled">退款</el-button>
          </div>
          <div v-else>
            <el-button size="small" @click="handleEdit(scope.row)">编辑时间</el-button>
            <el-button size="small" type="danger" @click="handleExit(scope.row)">结课</el-button>
            <el-button size="small" type="danger" @click="handleOff(scope.row)">销课</el-button>
            <el-button size="small" type="danger" @click="handleExitMoney(scope.row)">退款</el-button>
          </div>

        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="offFormVisible" title="快速销课" width="550px"  :before-close="handleClose" :closeOnClickModal="false" class="details-container">
      <div class="details-box">
      <p class="tags">(可在列表中编辑时间，自动销课)</p>
      <el-form ref="offForm" :model="offForm" label-width="150px"  class="form-container" :rules="offRules">
        <el-form-item label="会员姓名：" prop="memberName" style="margin-bottom: 0px;">
         <span>{{classObj.memberName}}</span>
        </el-form-item>
        <el-form-item label="课程名称：" prop="className" style="margin-bottom: 0px;">
         <span>{{classObj.className}}</span>
        </el-form-item>
        <el-form-item label="购买时间：" prop="createTime" style="margin-bottom: 0px;">
          <span>{{classObj.createTime}}</span>
        </el-form-item>
        <el-form-item label="平均客单价：" prop="averageFee" style="margin-bottom: 0px;">
          <span>{{classObj.averageFee}}</span>
        </el-form-item>
        <el-form-item label="上课教练：" prop="coachName"  style="margin-bottom: 0px;">
          <span>{{classObj.coachName}}</span>
        </el-form-item>
        <el-form-item label="上课时间：" prop="beginTime" style="margin-bottom: 0px;">
          <el-date-picker
            v-model="offForm.beginTime"
            type="datetime"
            placeholder="选择上课时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          @change="beginTimeChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下课时间：" prop="endClass" style="margin-bottom: 0px;">
          <span>{{endClass}}</span>
        </el-form-item>
        <el-form-item label="上课情况：" prop="isArrived" style="margin-bottom: 0px;">
          <el-radio-group v-model="offForm.isArrived">
            <el-radio v-for="item in arrived" :key="item.id" :label="item.id">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消耗课时：" style="margin-bottom: 0px;">
          <span>1课时</span>
        </el-form-item>
          <p class="remark">注：销课后无法更改，请谨慎操作</p>
        <el-form-item>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="addSubmitForm">确定销课</el-button>
        </el-form-item>
      </el-form>

      </div>
    </el-dialog>
    <el-dialog :visible.sync="offMoneyVisible" title="私教课退款" width="550px"  :before-close="handleMoneyClose" :closeOnClickModal="false" class="details-container">
      <div class="details-box">
        <el-form ref="exitMoneyForm" :model="exitMoneyForm" label-width="100px" :rules="exitMoneyRules"  class="form-container">
          <div class="gray-bg">
          <div class="clearfix">
            <el-form-item label="购买人：" prop="memberName" class="exit-form">
              <span>{{classObj.memberName}}</span>
            </el-form-item>
            <el-form-item label="手机号：" prop="memberPhone" class="exit-form">
              <span>{{classObj.memberPhone}}</span>
            </el-form-item>
          </div>
          <div class="bline clearfix">
            <el-form-item label="销售教练：" prop="saleCoachName" class="exit-form">
              <span>{{classObj.saleCoachName}}</span>
            </el-form-item>
            <el-form-item label="上课教练：" prop="coachName"  class="exit-form">
              <span>{{classObj.coachName}}</span>
            </el-form-item>
          </div>

          <el-form-item label="课程名称：" prop="className" style="margin-bottom: 0">
            <span>{{classObj.className}}</span>
          </el-form-item>
          <div class="clearfix">
            <el-form-item label="购买课时：" prop="amountClassNumber"  class="exit-form">
              <span>{{classObj.amountClassNumber}}</span>
            </el-form-item>
            <el-form-item label="剩余课时：" prop="classNumber"  class="exit-form">
              <span>{{classObj.classNumber}}</span>
            </el-form-item>
          </div>

          <el-form-item label="价格：" prop="fee"  style="margin-bottom: 0">
            <span>{{classObj.fee}}元</span>
            <el-input v-model.number="exitMoneyForm.fee" type="hidden"></el-input>
          </el-form-item>
          <el-form-item label="合同编号：" prop="contractNo"  style="margin-bottom: 0">
            <span>{{classObj.contractNo}}</span>
          </el-form-item>
        </div>
          <el-form-item label="退款方式：" prop="type">
            <el-radio label="终止合同" v-model="exitMoneyForm.type"></el-radio>
            <br>
            <el-radio label="仅退款" v-model="exitMoneyForm.type" style="margin-left: 0"></el-radio>
          </el-form-item>
          <el-form-item label="退款：" prop="refundFee">
            <el-input v-model.number="exitMoneyForm.refundFee" placeholder="请输入金额"></el-input>&nbsp;&nbsp;元
          </el-form-item>
          <el-form-item label="退款方式：" prop="payMethod">
            <el-select v-model="exitMoneyForm.payMethod" placeholder="请选择退款方式" :clearable=false>
              <el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="note" >
            <el-input v-model="exitMoneyForm.note" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exitMoneySubmit">确定</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>

  </div>
</template>

<script>
  import AXIOS from '../../../axios/axios'
  import global_ from '../../../common/js/common'
  import valid from '../../../common/js/validate'
  import moment from 'moment';
  const Axios = new AXIOS();
  import Vue from 'vue';
  var personFee;
  export default {
    data() {
      return {
        path: global_.path,
        tableData: [], //
        coachData: [],
        gymData: [],
        token: '',
        listLoading: false,
        statusData:[{
          value:'服务号',
        },{
          value:'工作台'
        }],
        offRules:{
          beginTime: [{
            required: true,
            message: '开课时间不能为空',
            trigger: 'change'
          }],
        },
        exitMoneyRules:{
          fee:[{
            required: false,
            validator:function(rule, value, callback) {
					    personFee = value;
					    callback();
            },
          }],
          refundFee:[{
            required: false,
            validator:function (rule, value, callback) {
              if(value.length == 0){
					      	return callback(new Error('请输入退款金额'));
					    }else{
					    	  if(value < 0){
							      return callback(new Error('退款金额不能小于0'));
							    }else if(value > personFee) {
							      return callback(new Error('退款金额不能大于课程价格'));
							    }else{
							      callback();
							    }
					    }
            },
            trigger: 'blur'
          }]
        },
        classStatusList:[{
          id:0,
          value:'进行中',
        },{
          id:1,
          value:'已结课',
        },{
          id:2,
          value:'已退课',
        }],
        total:0,
        listQuery: {
          page: 1,
          limit: 10,
          keyword: '',
          coachId: '',
          gymId: '',
          className: '',
          source:'',
          status:'',
        },
        offForm:{
          personalClassId:'',
          beginTime:'',
          isArrived:1,
        },

        arrived:[{
          id:1,
          value:'已到场'
        },{
          id:0,
          value:'未到场'
        }],
        endClass:'',
        offFormVisible:false,
        offMoneyVisible:false,
        classObj:{},
        exitMoneyForm:{
          type:'终止合同',
          refundFee:'',
          payMethod:3,
          note:'',
          fee:'',
        },
        payList: [{
          id: 1,
          value: '微信支付'
        }, {
          id: 2,
          value: '支付宝支付'
        }, {
          id: 3,
          value: '现金支付'
        }, {
          id: 4,
          value: 'pos机支付'
        },
          {
            id: 5,
            value: '银联支付'
          },
          {
            id: 6,
            value: '其他方式支付'
          }
        ],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getData();
      });
    },
    methods: {
      getTotal() {
        this.$axios({
          url: this.path + 'class/personal/count',
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
            this.total = res.data.count;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getCoach() {
        this.$axios({
          url: this.path + 'resource/coach/erp/list?page=0&gymId='+this.listQuery.gymId,
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
      getType() {
        this.$axios({
          url: this.path + 'resource/gym/erp/list?gymId='+this.listQuery.gymId,
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
      getData() {
        global_.$options.exportSession(this.getData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'class/personal/list',
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
//          if (res.data.code = 100000) {
              this.getTotal();
              this.getCoach();
              this.getType();
              this.tableData = res.data.list;
              for(var i = 0;i<this.tableData.length;i++){
                this.tableData[i].amountClassNumber = this.tableData[i].buyClassNumber+this.tableData[i].giveClassNumber
              }
              this.listLoading = false;
//          }
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
      handleEdit(row) {
//    	sessionStorage.setItem("obj",JSON.stringify(row));
				sessionStorage.setItem('classid',row.id);
				this.$router.push('/ptEditCoach');
      },
      //结课
      handleExit(row) {
        global_.$options.exportSession(this.handleExit);
        this.$confirm('确认要结课吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'class/personal/finish/'+row.id,
            method: 'post',
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
          }).then((res) => {
            if (res.data.code === 100000) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      //销课
      handleOff(row){
        this.$nextTick(() => {
          this.classObj = Object.assign({}, row);
          this.offForm.personalClassId = this.classObj.id;
          this.offForm.beginTime = '';
          this.offFormVisible = true;
        });
      },
      addSubmitForm(){
        this.$confirm('确认要销课吗？', '提示', {type: 'warning'}).then(() => {
        this.$axios({
          url: this.path + 'class/personal/add',
          method: 'put',
          params: this.offForm,
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
        }).then((res) => {
          if (res.data.code === 100000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.offFormVisible = false;
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
        })
      },
      handleClose(){
          this.offFormVisible = false;
      },
      handleMoneyClose(){
          this.offMoneyVisible = false;
        this.$refs['exitMoneyForm'].resetFields();
        this.exitMoneyForm.type = '终止合同';
      },
      //上课时间改变计算下课时间
      beginTimeChange(){
        let begin = this.offForm.beginTime;
        let classTime = this.classObj.classTime;
        let t = moment(begin,'YYYY-MM-DD-HH-mm-ss').add(classTime, 'minute').format('YYYY-MM-DD HH:mm:ss');
        this.endClass= t;
      },
      handleExitMoney(row){
        this.$nextTick(() => {
          this.classObj = Object.assign({}, row);
          this.exitMoneyForm.personalClassId = this.classObj.id;
          this.$nextTick(() => {
          this.exitMoneyForm.fee = this.classObj.fee;
        });
          
          this.offMoneyVisible = true;
        });
      },
      exitMoneySubmit(){
        this.$confirm('确认要退款吗？', '提示', {type: 'warning'}).then(() => {
            this.$refs.exitMoneyForm.validate((valid) => {
              if (valid) {
                if (this.exitMoneyForm.type == "终止合同") {
                  this.exitMoneyForm.type = 0
                } else if (this.exitMoneyForm.type == "仅退款") {
                  this.exitMoneyForm.type = 1
                }
                this.$axios({
                  url: this.path + 'class/personal/refund/' + this.exitMoneyForm.personalClassId,
                  method: 'post',
                  data: {
                    type: this.exitMoneyForm.type,
                    payMethod: this.exitMoneyForm.payMethod,
                    refundFee: this.exitMoneyForm.refundFee,
                    note: this.exitMoneyForm.note,
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
                }).then((res) => {
                  if (res.data.code === 100000) {
                    this.$message({
                      message: '退款成功',
                      type: 'success'
                    });
                    this.$refs['exitMoneyForm'].resetFields();
                    this.exitMoneyForm.type = '终止合同';
                    this.offMoneyVisible = false;
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
              }
            });
        })
      },

    }
  }
</script>

<style type="text/css">
	.plugins-tips {
		padding: 10px;
	}
  .ptags{
    margin:10px 65px;
    color: #666;
    font-size:14px;
  }
  .remark{
    margin:10px 0 30px 65px;
    color: #f00;
  }
  .exit-form{
    margin-bottom: 0px;
    width: 50%;
    float: left
  }
  .bline{
    border-bottom:1px solid #ccc;
  }
  .gray-bg{
    background-color: #efefef;
  }
</style>
