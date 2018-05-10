<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 统计报表</el-breadcrumb-item>
        <el-breadcrumb-item>课程报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="条件筛选">
        <el-select v-model="listQuery.kind" placeholder="选择课程类型" :clearable=true @change="handleFilter" style="width: 168px;">
          <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      	<el-form-item>
        <el-select v-model="listQuery.coachId" placeholder="选择教练" :clearable=true @change="handleFilter" style="width: 168px;">
          <el-option v-for="item in coachData" :key="item.id" :label="item.coachName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

       <!--<div style="margin-left: 68px;">-->
      <el-form-item>
			<el-date-picker :picker-options="pickerOptions1" v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="handleFilter">
			</el-date-picker>
		</el-form-item>
		 <!--</div>-->
      <br />

      <div class="clearfilter"><a href="javascript:;" @click="clearFilter">清空所有筛选项</a></div>
    </el-form>
    <p class="count">收入总计：{{totalMoney}}元</p>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="no" label="编号"></el-table-column>
      <el-table-column prop="coachName" label="教练名称"></el-table-column>
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="numberLimit" label="课程数量"></el-table-column>
      <el-table-column prop="" label="实到数（人）"></el-table-column>

       <el-table-column prop="num" label="预约数（次）"></el-table-column>
      <el-table-column prop="money" label="课程收入"></el-table-column>
      <el-table-column prop="" label="储值卡消费"></el-table-column>
      <el-table-column prop="" label="优惠总计"></el-table-column>
      <el-table-column prop="money" label="实际收入"></el-table-column>

    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
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
        tableData: [], //列表数组
        token: '',
        typeData: [{
          id: 2,
          value: '私教课'
        }, {
          id: 3,
          value: '团课'
        }],
        listLoading: false,
        pickerOptions1: {
          firstDayOfWeek: 1
        },
		    dateTime: '',
        totalMoney:0,
        coachData:[],
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          startTime: '',
          endTime: '',
          kind: '',
          coachId: ''
        },

      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getCount();
        this.getData();
        this.getCoachList();
      });
    },
    methods: {
      uploadHeaders() {
        var headers = {
          'Authorization': this.token
        }
        return headers
      },
      clearFilter(){
        this.listQuery.coachId = "";
        this.listQuery.kind = "";
        this.dateTime = "";
        this.getCount();
        this.getData();
      },
      getCoachList() {
        this.$axios({
          url: this.path + 'resource/coach/erp/list?page=0',
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
              this.coachData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getTotal() {
        this.$axios({
          url: this.path + 'erp/class/table/count',
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
            if (res.data.code === 100000) {
              this.total = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getCount() {
        global_.$options.exportSession(this.getCount);
        if(this.dateTime != null && this.dateTime != '') {
          this.listQuery.startTime = this.dateTime[0];
          this.listQuery.endTime = this.dateTime[1];
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        this.listLoading = true;
        this.$axios({
          url: this.path + 'erp/class/table/list',
          method: 'get',
          params: {
              page: 0,
              startTime: this.listQuery.startTime,
              endTime: this.listQuery.endTime,
              kind: this.listQuery.kind,
              coachId: this.listQuery.coachId,
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
              this.totalMoney = res.data.result.amount;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getData() {
        global_.$options.exportSession(this.getData);
        if(this.dateTime != null && this.dateTime != '') {
					this.listQuery.startTime = this.dateTime[0];
					this.listQuery.endTime = this.dateTime[1];
				} else {
					this.listQuery.startTime = ''
					this.listQuery.endTime = ''
				}
        this.listLoading = true;
        this.$axios({
          url: this.path + 'erp/class/table/list',
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
            if (res.data.code === 100000) {
              this.getTotal();
              this.tableData = res.data.result.classTable;
              this.listLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleFilter() {
        this.getCount();
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
  .count {
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    padding-left: 10px;
    background-color: #FCFCFC;
  }
  .clearfilter{
    margin:0 0 20px;
  }
  .clearfilter a{
    font-size:14px;
    color: #ff9900;
  }
</style>
