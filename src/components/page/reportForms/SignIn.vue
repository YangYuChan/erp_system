<template>
  <div class="table">

    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 统计报表</el-breadcrumb-item>
        <el-breadcrumb-item>签到报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="条件筛选">
        <el-input v-model="listQuery.keyword" placeholder="输入姓名或手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleFilter">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="exportList">导出excel</el-button>
      </el-form-item>
      <br />
      <el-form-item label="签到日期">
        <el-date-picker
          :picker-options="pickerOptions1"
          v-model="ActivateTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleFilter">
        </el-date-picker>
      </el-form-item>
      <br />
      <el-form-item label="签到状态">
        <el-select v-model="listQuery.isQuit" placeholder="选择状态" :clearable=true  @change="handleFilter">
          <el-option v-for="item in QuitStatus" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <div class="clearfilter"><a href="javascript:;" @click="clearFilter">清空所有筛选项</a></div>
    </el-form>


    <p class="count">签到总人次：{{total}}</p>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading" id="exportTable">
      <el-table-column prop="createTime" label="签到时间"></el-table-column>
      <el-table-column prop="signOutCreateTime" label="签出时间"></el-table-column>
      <el-table-column prop="memberName" label="会员名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 0">男</span>
          <span v-else-if="scope.row.sex == 1">女</span>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="staffName" label="会籍销售"></el-table-column>
      <el-table-column prop="gymName" label="场馆"></el-table-column>

      <el-table-column prop="operator" label="操作人"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
  import AXIOS from '../../../axios/axios';
  import global_ from '../../../common/js/common';
  import valid from '../../../common/js/validate';
  const Axios = new AXIOS();
  export default {
    data() {
      return {
        path: global_.path,
        tableData: [], //

        token: '',
        pickerOptions1: {
          firstDayOfWeek: 1
        },
        listLoading: false,
        loading: false,
        QuitStatus:[{
          id:0,
          name:'签到未签出'
        }],
        ActivateTime:[],
        total:0,
        listQuery: {
          page: 1,
          limit: 10,
          keyword:"",
          isQuit:"",
          startTime:"", //日期开始
          endTime:"",   //日期结束
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
      clearFilter(){
        this.listQuery.keyword = "";
        this.listQuery.isQuit = "";
        this.ActivateTime = "";
        this.getData();
      },
      getTotal() {
        this.$axios({
          url: this.path + 'erp/sign/member/count',
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
        if(this.ActivateTime != null && this.ActivateTime != '') {
          this.listQuery.startTime = this.ActivateTime[0];
          this.listQuery.endTime = this.ActivateTime[1];
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        this.listLoading = true;
        this.$axios({
          url: this.path + 'erp/sign/member/list',
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
      exportList(){
        if(this.listQuery.startTime != '' && this.listQuery.startTime != null){
          this.handleExport();
        }else{
          this.$confirm('未选择时间，默认导出近30天信息', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleExport();
          }).catch(() => {

          });
        }

      },
      handleExport(){
        this.downloadUrl = this.path + 'erp/sign/member/excel?keyword='+this.listQuery.keyword+'&isQuit='+this.listQuery.isQuit+'&startTime='+this.listQuery.startTime+'&endTime='+this.listQuery.endTime;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.downloadUrl, true);
        xhr.responseType = 'blob';
        xhr.setRequestHeader("Authorization", this.token);
        xhr.onload = function (e) {
          if (this.status == 200) {
            var blob = new Blob([this.response], {
              type: 'application/vnd.ms-excel'
            });
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            let date = new Date();
            let year = date.getYear()+1900;
            let month = date.getMonth()+1;
            let dates = date.getDate();
            if(month < 10){
              month = "0"+month;
            }
            if(dates < 10){
              dates = "0"+dates;
            }
            link.download = year+month+dates+'签到报表.xls';
            link.click()
          } else {
            alert('Unable to download excel.')
          }
        };
        xhr.send();
      },
    }
  }
</script>

<style type="text/css">
  .plugins-tips {
    padding: 10px;
  }
  .consume .el-checkbox{
    width: 120px;
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
  .clearfilter{
    margin:0 0 20px;
  }
  .clearfilter a{
    font-size:14px;
    color: #ff9900;
  }
</style>
