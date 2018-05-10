<template>
  <div class="table">

    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 统计报表</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡销售报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item label="筛选条件">
        <el-select v-model="listQuery.staffId" placeholder="选择销售" :clearable=true  @change="getData">
          <el-option v-for="item in staffData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="listQuery.payType" placeholder="选择支付方式" :clearable=true @change="getData">
          <el-option v-for="item in payData" :key="item.id" :label="item.value" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="listQuery.kindType" placeholder="选择会员卡类型" :clearable=true @change="getCardList(listQuery.kindType)">
          <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="listQuery.kindId" placeholder="选择会员卡名称" :clearable=true @change="getData">
          <el-option v-for="item in cardNameList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="日期筛选">
        <el-date-picker :picker-options="pickerOptions1" v-model="ActivateTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
        </el-date-picker>
      </el-form-item>
      <br />

      <div class="clearfilter"><a href="javascript:;" @click="clearFilter">清空所有筛选项</a></div>
    </el-form>


    <p class="count">销售总金额：{{totalMoney}}元</p>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="no" label="编号"></el-table-column>
      <el-table-column prop="createTime" label="日期时间"></el-table-column>
      <el-table-column prop="staffName" label="业绩归属"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡编号"></el-table-column>
      <el-table-column prop="kindName" label="会员卡种类"></el-table-column>
      <el-table-column label="会员卡类型">
        <template slot-scope="scope">
          <span v-if="scope.row.kindType == 1">期限类型</span>
          <span v-else-if="scope.row.kindType == 2">次卡类型</span>
          <span v-else-if="scope.row.kindType == 3">储值类型</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="gymName" label="售卖场馆"></el-table-column>
      <el-table-column prop="money" label="实收金额"></el-table-column>
      <el-table-column prop="payType" label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payType == 1">现金</span>
          <span v-else-if="scope.row.payType == 2">支付宝</span>
          <span v-else-if="scope.row.payType == 3">微信</span>
          <span v-else-if="scope.row.payType == 4">刷卡</span>
          <span v-else-if="scope.row.payType == 5">其它</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="充值面额（元/次/天）">
          <template slot-scope="scope">
            <span v-if="scope.row.kindType == 1">{{scope.row.dayNum}}(天)</span>
            <span v-else-if="scope.row.kindType == 2">{{scope.row.amount}}(次)</span>
            <span v-else-if="scope.row.kindType == 3">{{scope.row.balance}}(元)</span>
          </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
        tableData: [], //
        cardNameList: [],
        token: '',
        pickerOptions1: {
          firstDayOfWeek: 1
        },
        listLoading: false,
        loading: false,
        total: 0,
        totalMoney:0,
        payData:[{
          id: 1,
          value: '现金'
        }, {
          id: 2,
          value: '支付宝'
        }, {
          id: 3,
          value: '微信'
        }, {
          id: 4,
          value: '刷卡'
        }, {
          id: 5,
          value: '其他'
          }
        ],
        staffData:[],
        typeData: [{
          id: 1,
          value: '期限类型'
        }, {
          id: 2,
          value: '次卡类型'
        }, {
          id: 3,
          value: '储值类型'
        }],
        ActivateTime:[],
        LoseTime:[],
        listQuery: {
          page: 1,
          limit: 10,
          kindId:"",
          kindType:"",
          staffId:"",
          payType:"",
          startTime:"", //生效日期开始
          endTime:"",   //生效日期结束
          startLoseTime: "", //失效日期开始
          endLoseTime: "", //失效日期结束
        },
        cardList: [],
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getSaleList();
        this.getData();
      });
    },
    methods: {
      clearFilter(){
        this.listQuery.kindId = "";
        this.listQuery.kindType = "";
        this.listQuery.staffId = "";
        this.listQuery.payType = "";
        this.ActivateTime = "";

        this.getData();
      },
      getTotal() {
        this.$axios({
          url: this.path + 'erp/card/sale/count',
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
              this.total = res.data.result.count;
              this.totalMoney = res.data.result.money;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getSaleList() {
        this.$axios({
          url: this.path + 'staff/sell/list',
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
            if(res.data.code === 100000) {
              this.staffData = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getCardList(type) {
        this.$axios({
          url: this.path + 'member/kind/list?page=0&type=' + type,
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
            if(res.data.code === 100000) {
              this.cardNameList = res.data.result;
              this.getData();
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
          url: this.path + 'erp/card/sale/list',
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
              for(var i = 0;i<this.tableData.length;i++){
                  this.tableData[i].createTime= this.tableData[i].createTime.slice(0,10)
              }
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
