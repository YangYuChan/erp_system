<template>
  <div class="page_wrap">
    <div class="box_wrap">
      <div class="content_wrap">
        <div class="row color-print">
          <div class="row-in">
            <div class="columns-24" style="margin-bottom: 20px">
              <h1>结账单</h1>
            </div>
            <div class="columns-24">
              时间 ：{{order.createTime}}        </div>
            <div class="columns-24">
              订单号：{{order.tradeNo}}
            </div>
            <div class="columns-24 nowrap">
              ...............................................................
            </div>
            <div class="columns-24">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th style="text-align: left" width="40%">项目名称</th>
                  <th width="20%">数量</th>
                  <th width="20%">单价</th>
                  <th width="20%">小计</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td style="text-align: left">{{order.tradeDetail}}</td>
                  <td style="text-align: center">{{order.amount}}</td>
                  <td style="text-align: center">￥{{order.tradePrice}}</td>
                  <td style="text-align: center">￥{{order.standardFee}}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="columns-24" style="margin-top: 15px">
              备注：{{order.note}}       </div>
            <div class="columns-24 nowrap">
              ...............................................................
            </div>
            <div class="columns-24">
              标准金额：￥{{order.standardFee}}
            </div>
            <div class="columns-24">
              优惠金额：￥{{order.discountFee}}             </div>
            <div class="columns-24">
              应收金额：￥{{order.orderFee}}           </div>
            <div class="columns-24">
              实收金额：￥{{order.orderFee}}             </div>
            <div class="columns-24 nowrap">
              ...............................................................
            </div>
            <div class="columns-24">
              实收明细：
            </div>
            <div class="columns-24">
              {{order.createTime}}
            </div>
            <div class="columns-24">
              <span v-if="order.payMethod == 1">微信支付</span>
              <span v-else-if="order.payMethod == 2">支付宝支付</span>
              <span v-else-if="order.payMethod == 3">现金支付</span>
              <span v-else-if="order.payMethod == 4">pos机支付</span>
              <span v-else-if="order.payMethod == 5">银联支付</span>
              <span v-else-if="order.payMethod == 6">其他方式支付</span>
              ￥{{order.orderFee}}
            </div>
            <div class="columns-24 nowrap">
              ..............................................................
            </div>
            <div class="columns-24">
              商家：{{order.brandName}}         </div>
            <div class="columns-24 nowrap">
              ...............................................................
            </div>
            <div class="columns-24">
              姓名：{{order.name}}        </div>
            <div class="columns-24">
              电话：{{order.phone}}         </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import AXIOS from '../../axios/axios'
  import global_ from '../../common/js/common'
  import valid from '../../common/js/validate'
  import '../../common/js/sha512.js'
  const Axios = new AXIOS();
  export default {
    data() {
      return {
        path: global_.path,
        token: '',
        tradeId:'',
        resultMemberId:'',
        order:{},

      };
    },

    mounted() {
      this.$nextTick(() => {
        this.tradeId= sessionStorage.getItem("tradeId");
        this.resultMemberId = sessionStorage.getItem("memberId");
        this.token = sessionStorage.getItem('token');
        this.getData();
      });
    },
    methods: {
      getData(){
        this.$axios({
          url: this.path + 'order/receipt',
          method: 'get',
          params: {
            tradeId:this.tradeId,
            userId:this.resultMemberId,
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
            if(res.data.code === 100000) {
              this.order = res.data.order;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
    }
  }
</script>
<style>
  .page_wrap{
    width:180px;
    padding:20px;
    line-height: 24px;
  }
  .columns-24{
    font-size:14px;
  }


</style>
