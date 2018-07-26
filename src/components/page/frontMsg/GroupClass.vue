<template>
  <div class="element-container">
    <div class="group-msg-info clearfix">
      <div class="class-list fl-left">
        <div class="date-list clearfix">
          <span class="arrow-left fl-left"><i class="el-icon-d-arrow-left"></i></span>
          <ul class="date-ul fl-left">
            <li class="date-item fl-left actived">
              <p class="weeked">周四</p>
              <p class="time">05-10</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周五</p>
              <p class="time">05-11</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周六</p>
              <p class="time">05-12</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周日</p>
              <p class="time">05-13</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周一</p>
              <p class="time">05-14</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周二</p>
              <p class="time">05-15</p>
            </li>
            <li class="date-item fl-left">
              <p class="weeked">周三</p>
              <p class="time">05-17</p>
            </li>
          </ul>
          <span class="arrow-right fl-left"><i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="data-list">
          <ul class="clearfix">
            <li class="class-item fl-left actived">
              <div class="mask">
                <i class="el-icon-check"></i>
              </div>
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>
            <li class="class-item fl-left">
              <h4>王老师瑜伽课</h4>
              <p>课程时长：45分钟</p>
              <p>总课时：10课时</p>
              <p>教练：王超</p>
              <p class="price clearfix"><span class="fl-left">价格</span><span class="fl-right">￥150</span></p>
            </li>

          </ul>
        </div>
        <div class="block" style="margin: 0;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQueryGroup.page" :page-sizes="[10,20,30,50]" :page-size="listQueryGroup.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="active-list fl-right">
        <div class="notActive" v-show="noActive">
          <p><i class="icon iconfont icon-icon-test"></i></p>
          <p class="font">请选择左侧课程</p>
        </div>
        <div class="one-class-msg">
          <el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules" class="form-container" size="mini">
            <el-form-item label="会员名称：" prop="name">
              <span>王超</span>
              <span style="margin-left: 100px;">手机号：12345678945</span>
            </el-form-item>
            <el-form-item label="课程时间：" prop="name">
              <h4>2018-05-03 周四  15：30</h4>
            </el-form-item>
            <div class="hr"></div>
            <el-form-item label="课程名称：" prop="name">
              <span>王超老师瑜伽课</span>
            </el-form-item>
            <el-form-item label="课程价格：" prop="name">
              <span>￥150</span>
            </el-form-item>
            <el-form-item label="包含课时：" prop="name">
              <span>10课时</span>
            </el-form-item>
            <div>
              <el-form-item label="预约数量：" prop="salesman">
                <el-input v-model.number="addForm.money" style="width: 111px;"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="上课教练：" prop="money">
              <span>王超</span>
            </el-form-item>

            <div>
              <el-form-item label="销售教练：" prop="salesman">
                <el-select v-model="addForm.salesman" placeholder="请选择销售" filterable>
                  <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="售卖价格：" prop="money">
                <span>￥150</span>
              </el-form-item>
              <el-form-item label="优惠：" prop="money">
                <el-input v-model.number="addForm.money" style="width: 111px;"></el-input>
              </el-form-item>

              <el-form-item label="应收金额：" prop="remark">
                <span style="color:red">￥150</span>
                <el-checkbox>赠课</el-checkbox>
              </el-form-item>
              <el-form-item label="合同编号：" prop="remark">
                <el-input v-model="addForm.remark"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="addForm.remark" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import AXIOS from '../../../axios/axios'
  import global_ from '../../../common/js/common'
  import valid from '../../../common/js/validate'

  const Axios = new AXIOS();
  export default {
    name:"groupClass",
    props: ["oneCardMessage","openCenterDialog"],
    data() {
      return {
        path: global_.path,
        action: global_.action,
        token: '',
        listQueryGroup:{
          page:1,
          limit:10
        },
        noActive:false,
        saleList:[],
        total:0,
        addForm:{

        },
        addRules: {
          money: [{
            required: true,
            message: '请选择售卖场地',
            trigger: 'change'
          }],
        },
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
      });
    },
    methods: {
      handleSizeChange(val) {
        this.listQueryGroup.limit = val;
        this.getGroupClass();
      },
      handleCurrentChange(val) {
        this.listQueryGroup.page = val;
        this.getGroupClass();
      },
      getGroupClassTotal(){

      },
      getGroupClass(){

      },
    }
  }
</script>
<style scoped="scoped">
  .el-tabs{
    width:55%;
    float: left;
  }
  .class-list{
    width:55%;
  }
  .active-list{
    margin-top:0;
    border-top:none;
  }
</style>
