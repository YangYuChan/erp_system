<template>
  <div class="table">

    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 统计报表</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡报表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="筛选条件">
          <el-select v-model="listQuery.kindType" placeholder="选择会员卡类型" :clearable=true @change="getCardList(listQuery.kindType)">
            <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="listQuery.kindId" placeholder="选择会员卡名称" :clearable=true @change="getData">
            <el-option v-for="item in cardNameList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="余额筛选" v-if="listQuery.kindType == null || listQuery.kindType == ''">
          <el-input v-model="listQuery.minNum" placeholder="输入数值" style="width: 100px;" :clearable=true disabled></el-input>
          至
          <el-input v-model="listQuery.maxNum" placeholder="输入数值" style="width: 100px;" :clearable=true disabled></el-input>
          <el-button type="info" icon="search" disabled>查询</el-button>
        </el-form-item>
      <el-form-item label="余额筛选" v-else>
        <el-input v-model="listQuery.minNum" placeholder="输入数值" style="width: 100px;" :clearable=true></el-input>
        &nbsp;至&nbsp;
        <el-input v-model="listQuery.maxNum" placeholder="输入数值" style="width: 100px;" :clearable=true></el-input>
        &nbsp;
        <span v-if="listQuery.kindType == 1">天</span>
        <span v-if="listQuery.kindType == 2">次</span>
        <span v-if="listQuery.kindType == 3">元</span>
        &nbsp;
        <el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
      </el-form-item>
        <br />
        <el-form-item label="生效日期">
          <el-date-picker :picker-options="pickerOptions1" v-model="ActivateTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
          </el-date-picker>
        </el-form-item>
        <br />
        <el-form-item label="失效日期">
          <el-date-picker :picker-options="pickerOptions1" v-model="LoseTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
          </el-date-picker>
        </el-form-item>
       <div class="clearfilter"><a href="javascript:;" @click="clearFilter">清空所有筛选项</a></div>
    </el-form>


    <p class="count">会员卡总数：{{total}}</p>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="no" label="编号"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="kindName" label="会员卡名称"></el-table-column>
      <el-table-column label="会员卡类型">
        <template slot-scope="scope">
          <span v-if="scope.row.kindType == 1">期限类型</span>
          <span v-else-if="scope.row.kindType == 2">次卡类型</span>
          <span v-else-if="scope.row.kindType == 3">储值类型</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="绑定会员"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 0">男</span>
          <span v-else-if="scope.row.sex == 1">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="gymName" label="售卖场馆"></el-table-column>
      <el-table-column prop="staffName" label="销售"></el-table-column>
      <el-table-column prop="money" label="价格"></el-table-column>
      <el-table-column label="余额">
        <template slot-scope="scope">
          <span v-if="scope.row.kindType == 1">{{scope.row.dayNum}}(天)</span>
          <span v-else-if="scope.row.kindType == 2">{{scope.row.amount}}(次)</span>
          <span v-else-if="scope.row.kindType == 3">{{scope.row.balance}}(元)</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活">
        <template slot-scope="scope">
          <span v-if="scope.row.isActivate == 0">未激活</span>
          <span v-else-if="scope.row.isActivate == 1">激活成功</span>
        </template>
      </el-table-column>
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
          kindId:'',
          kindType:'',
          minNum:'',
          maxNum:'',
          startTime:'',//生效日期开始
          endTime:'', //生效日期结束
          startLoseTime: '', //失效日期开始
          endLoseTime: '', //失效日期结束
        },
        cardList: [],
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
        this.listQuery.kindId = "";
        this.listQuery.kindType = "";
        this.listQuery.minNum = "";
        this.listQuery.maxNum = "";
        this.ActivateTime = "";
        this.LoseTime = "";
        this.getData();
      },
      getTotal() {
        this.$axios({
          url: this.path + 'erp/card/table/count',
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
        if(this.LoseTime != null && this.LoseTime != '') {
          this.listQuery.startLoseTime = this.LoseTime[0];
          this.listQuery.endLoseTime = this.LoseTime[1];
        } else {
          this.listQuery.startLoseTime = ''
          this.listQuery.endLoseTime = ''
        }
        this.listLoading = true;
        this.$axios({
          url: this.path + 'erp/card/table/list',
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
