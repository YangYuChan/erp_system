<template>
  <div class="element-container">
    <div class="buy-record">
      <dl>
        <dt class="clearfix">
          <b class="fl-left">今日合计</b>
          <span class="fl-right price">￥{{priceTotal}}</span>
        </dt>
        <dd v-for="item in tableData">
          <p class="clearfix">
            <b class="fl-left">{{item.tradeDetail}}</b>
            <span class="fl-right">{{item.createTime}}</span>
          </p>
          <p v-if="item.tradeType == 1">私教课</p>
          <p v-else-if="item.tradeType == 2">团课</p>
          <p v-else-if="item.tradeType == 3">会员卡</p>
          <p>会员：{{item.name}}</p>
          <p class="clearfix" v-if="item.tradeType == 1">
            <span class="fl-left">课时：{{item.classNumber}}课时</span>
            <span class="fl-right price">￥{{item.orderFee}}</span>
          </p>
          <p class="clearfix" v-if="item.tradeType == 2">
            <span class="fl-left">课时：1课时</span>
            <span class="fl-right price">￥{{item.orderFee}}</span>
          </p>
          <p class="clearfix" v-else-if="item.tradeType == 3">
            <span class="fl-left">会员卡号：{{item.cardNo}}</span>
            <span class="fl-right price">￥{{item.orderFee}}</span>
          </p>
        </dd>
      </dl>
    </div>

    <div class="block" v-if="total != 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>
<script>
  import AXIOS from '../../../axios/axios';
  import global_ from '../../../common/js/common';
  import valid from '../../../common/js/validate';
  import $ from 'jquery';
  const Axios = new AXIOS();
  export default {
    data() {
      return {
        name:'buyRecord',
        path: global_.path,
        tableData: [], //
        action: global_.action,
        buyRecordList:[],//购买记录
        token:'',
        total: 0,
        priceTotal:0,
        listQuery:{
          page: 1,
          limit: 10,
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getPersonalData();
      });
    },
    methods: {
      getTotal(){
        this.$axios({
          url: this.path + 'order/record/count',
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
              this.total = res.data.count;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getPriceTotal(){
        this.$axios({
          url: this.path + 'order/record/total',
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
              this.priceTotal = res.data.total;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getPersonalData(){
        this.$axios({
          url: this.path + 'order/record/list',
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
              this.getPriceTotal();
              this.tableData = res.data.records;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getPersonalData();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getPersonalData();
      },
    }

  }
  </script>
