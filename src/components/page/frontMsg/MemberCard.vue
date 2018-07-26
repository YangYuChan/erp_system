<template>
  <div class="element-container">
      <div class="type1" v-show="type1">
        <el-form ref="addForm1" :model="addForm1" label-width="160px" :rules="addRules1" class="form-container">
          <el-form-item label="售卖场地：" prop="cardGymId">
            <el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm1.kindType)">
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡类型：" prop="kindType">
            <el-select v-model="addForm1.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm1.kindType)" required>
              <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡名称：" prop="kindId">
            <el-select v-model="addForm1.kindId" placeholder="请选择会员卡名称" :clearable=false required>
              <el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员名称：" prop="name">
            <el-input v-model="addForm1.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="有效时间：" prop="time">
            <el-input v-model.number="addForm1.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
            <el-radio label="年" v-model="addForm1.dateType"></el-radio>
            <el-radio label="月" v-model="addForm1.dateType"></el-radio>
            <el-radio label="天" v-model="addForm1.dateType"></el-radio>
          </el-form-item>
          <el-form-item label="赠送时间：" prop="giveTime" style="margin-bottom: 0px;">
            <el-input v-model.number="addForm1.giveTime" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
            <el-radio label="年" v-model="addForm1.giveDateType"></el-radio>
            <el-radio label="月" v-model="addForm1.giveDateType"></el-radio>
            <el-radio label="天" v-model="addForm1.giveDateType"></el-radio>
          </el-form-item>
          <el-form-item label="立即激活：" prop="isActivate">
            <el-radio label="是" v-model="addForm1.isActivate"></el-radio>
            <el-radio label="否" v-model="addForm1.isActivate"></el-radio>
            <p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
          </el-form-item>
          <el-form-item label="实收金额：" prop="money">
            <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payType">
            <el-select v-model="addForm1.payType" placeholder="请选择支付方式" :clearable=false>
              <el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体卡号：" prop="cardNum">
            <el-input v-model="addForm1.cardNum"></el-input>
          </el-form-item>
          <el-form-item label="销售人员：" prop="salesman">
            <el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
              <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm1.contractNo"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm1.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm1">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="type2" v-show="type2">
        <el-form ref="addForm2" :model="addForm2" label-width="160px" :rules="addRules2" class="form-container">
          <el-form-item label="售卖场地：" prop="cardGymId">
            <el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm2.kindType)">
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡类型：" prop="kindType">
            <el-select v-model="addForm2.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm2.kindType)" required>
              <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡名称：" prop="kindId">
            <el-select v-model="addForm2.kindId" placeholder="请选择会员卡名称" :clearable=false required>
              <el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员名称：" prop="name">
            <el-input v-model="addForm2.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="有效次数：" prop="number">
            <el-input v-model.number="addForm2.number" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
          </el-form-item>
          <el-form-item label="赠送次数：" prop="giveNumber">
            <el-input v-model.number="addForm2.giveNumber" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
          </el-form-item>
          <el-form-item label="有效时间：" prop="time">
            <el-input v-model.number="addForm2.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
            <el-radio label="年" v-model="addForm2.dateType"></el-radio>
            <el-radio label="月" v-model="addForm2.dateType"></el-radio>
            <el-radio label="天" v-model="addForm2.dateType"></el-radio>
          </el-form-item>
          <el-form-item label="实收金额：" prop="money">
            <el-input v-model.number="addForm2.money" style="width: 111px;"></el-input>
          </el-form-item>
          <el-form-item label="支付方式：" prop="payType">
            <el-select v-model="addForm2.payType" placeholder="请选择支付方式" :clearable=false>
              <el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体卡号：" prop="cardNum">
            <el-input v-model="addForm2.cardNum"></el-input>
          </el-form-item>
          <el-form-item label="销售人员：" prop="salesman">
            <el-select v-model="addForm2.salesman" placeholder="请选择销售" filterable>
              <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm2.contractNo"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm2.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm2">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="type3" v-show="type3">
        <el-form ref="addForm3" :model="addForm3" label-width="160px" :rules="addRules3" class="form-container">
          <el-form-item label="售卖场地：" prop="cardGymId">
            <el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm3.kindType)">
              <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡类型：" prop="kindType">
            <el-select v-model="addForm3.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm3.kindType)" required>
              <el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡名称：" prop="kindId">
            <el-select v-model="addForm3.kindId" placeholder="请选择会员卡名称" :clearable=false required>
              <el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员名称：" prop="name">
            <el-input v-model="addForm3.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="有效时间：" prop="time">
            <el-input v-model.number="addForm3.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
            <el-radio label="年" v-model="addForm3.dateType"></el-radio>
            <el-radio label="月" v-model="addForm3.dateType"></el-radio>
            <el-radio label="天" v-model="addForm3.dateType"></el-radio>
          </el-form-item>
          <el-form-item label="立即激活：" prop="isActivate">
            <el-radio label="是" v-model="addForm3.isActivate"></el-radio>
            <el-radio label="否" v-model="addForm3.isActivate"></el-radio>
            <p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
          </el-form-item>

          <el-form-item label="是否正式会员可购买：" prop="isBuy">
            <el-radio label="是" v-model="isBuy"></el-radio>
            <el-radio label="否" v-model="isBuy"></el-radio>
          </el-form-item>

          <el-form-item label="实收金额：" prop="money">
            <el-input v-model.number="addForm3.money" style="width: 111px;"></el-input>
          </el-form-item>

          <el-form-item label="充值金额：" prop="giveMoney">
            <el-input v-model.number="addForm3.giveMoney" style="width: 111px;"></el-input>
          </el-form-item>

          <el-form-item label="支持消费方式：" prop="isLeague" class="consume">
            <el-checkbox label="付费团课" v-model="addForm3.isLeague"></el-checkbox>
            <el-checkbox label="私教课" v-model="addForm3.isPersonal"></el-checkbox>
          </el-form-item>

          <el-form-item label="支付方式：" prop="payType">
            <el-select v-model="addForm3.payType" placeholder="请选择支付方式" :clearable=false>
              <el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实体卡号：" prop="cardNum">
            <el-input v-model="addForm3.cardNum"></el-input>
          </el-form-item>
          <el-form-item label="销售人员：" prop="salesman">
            <el-select v-model="addForm3.salesman" placeholder="请选择销售" filterable>
              <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm3.contractNo"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm3.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm3">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>

</template>

<script>
  import AXIOS from '../../../axios/axios'
  import global_ from '../../../common/js/common'
  import valid from '../../../common/js/validate'

  const Axios = new AXIOS();
  export default {
    name:"memberCard",
    props: ["oneCardMessage","openCenterDialog"],
    data() {
      return {
        centerDialogVisible:true,
        path: global_.path,
        gymData: [],
        cardNameList: [],
        action: global_.action,
        token: '',
        pickerOptions1: {
          firstDayOfWeek: 1
        },
        order:'',
        type1: true,
        type2: false,
        type3: false,
        saleList: [],
        coachList: [],
        type1: true,
        type2: false,
        type3: false,
        moreFilter: false,

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
        usrGymList: [],
        sellGymList: [],
        cardList: [],
        memberList: [],
        saleList: [],
        worth: '',
        isBuy: '是',
        filterGymId:'',
        cardType:'',
        addForm1: {
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          giveDateType: '月',
          giveTime: '',
          payType: 3,
          remark: '',
          salesman: '',
          cardNum: '',
          isActivate: '否',
          contractNo:'',
        },
        addForm2: {
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          payType: 3,
          remark: '',
          salesman: '',
          cardNum: '',
          number: '',
          giveNumber: '',
          contractNo:'',
        },
        addForm3: {
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          giveMoney:'',
          payType: 3,
          remark: '',
          salesman: '',
          cardNum: '',
          isActivate: '否',
          isLeague: '',
          isPersonal: '',
          contractNo:'',
        },
        cardGymId:'',
        tradeId:'',
        resultMemberId:'',
        addRules1: {
          gymId: [{
            required: true,
            message: '请选择售卖场地',
            trigger: 'change'
          }],
          keyword: [{
            required: true,
            message: '请选择会员名称',
            trigger: 'blur'
          }],
          kindId: [{
            required: true,
            message: '请选择会员卡名称',
            trigger: 'change'
          }],
          time: [{
            required: true,
            validator: valid.checkValidTime,
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '请输入实收金额',
            trigger: 'blur'
          }],
        },
        addRules2: {
          gymId: [{
            required: true,
            message: '请选择售卖场地',
            trigger: 'change'
          }],
          keyword: [{
            required: true,
            message: '请选择会员名称',
            trigger: 'blur'
          }],
          kindId: [{
            required: true,
            message: '请选择会员卡名称',
            trigger: 'change'
          }],
          number: [{
            required: true,
            message: '请输入有效次数',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            message: '请输入实收金额',
            trigger: 'blur'
          }],
        },
        addRules3: {
          gymId: [{
            required: true,
            message: '请选择售卖场地',
            trigger: 'change'
          }],
          keyword: [{
            required: true,
            message: '请选择会员名称',
            trigger: 'blur'
          }],
          kindId: [{
            required: true,
            message: '请选择会员卡名称',
            trigger: 'change'
          }],
          time: [{
            required: true,
            message: '请输入有效时间',
            trigger: 'blur'
          }],
          money: [{
            required: true,
            validator: valid.checkMoney,
            trigger: 'blur'
          }],
          giveMoney: [{
            required: true,
            validator: valid.checkGiveMoney,
            trigger: 'blur'
          }],
        }

      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.handleApplyCard();

      });
    },
    methods: {
      handleClose(){
        this.$emit("memberCardClose");
      },
      openDialog(){
        this.$emit("openCenterDialog");
      },
      getType() {
        this.$axios({
          url: this.path + 'resource/gym/erp/list',
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
            this.gymData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getSaleList(gymId) {
        if(gymId == null){
          gymId = '';
        }
        this.$axios({
          url: this.path + 'staff/sell/list?gymId='+gymId,
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
              this.saleList = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },

      handleApplyCard() {
        var row = this.oneCardMessage;
        this.addForm1.kindType = 1;
        this.addForm1.name = row.name;
        this.addForm1.memberId = row.id;
        this.addForm2.name = row.name;
        this.addForm2.memberId = row.id;
        this.addForm3.name = row.name;
        this.addForm3.memberId = row.id;
        this.addForm3.status = row.status;
        this.getCardName(this.filterGymId,this.addForm1.kindType);
        this.getSaleList();
        this.getType();
      },
      handleAddForm(type) {
        this.filterGymId = '';
        if(type == 1) {
          this.addForm1.kindType = 1;
          this.type1 = true;
          this.type2 = false;
          this.type3 = false;
          this.cardType = 1;
          this.getCardName(this.filterGymId,this.cardType);
        } else if(type == 2) {
          this.addForm2.kindType = 2;
          this.type1 = false;
          this.type2 = true;
          this.type3 = false;
          this.cardType = 2;
          this.getCardName(this.filterGymId,this.cardType);
        } else {
          this.addForm3.kindType = 3;
          this.type1 = false;
          this.type2 = false;
          this.type3 = true;
          this.cardType = 3;
          this.getCardName(this.filterGymId,this.cardType);
        }

      },
      selectCardType(id,type){
        this.filterGymId = id;
        this.cardType = type
        this.getCardName(this.filterGymId,this.cardType);
      },
      getCardName(filterGymId,cardType) {
        this.$axios({
          url: this.path + 'member/kind/list?gymId='+filterGymId+'&page=0&status=0&type=' + cardType,
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
              this.cardList = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })

      },
      routerPrint(){
        sessionStorage.setItem("tradeId",this.tradeId);
        sessionStorage.setItem("memberId",this.resultMemberId)
        this.$router.push('/print');
      },
      addSubmitForm1() {
        this.$refs.addForm1.validate((valid) => {
          if(valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.addForm1.dateType == '年') {
                this.addForm1.dateType = 1
              } else if(this.addForm1.dateType == '月') {
                this.addForm1.dateType = 2
              } else {
                this.addForm1.dateType = 3
              }

              if(this.addForm1.giveDateType == '年') {
                this.addForm1.giveDateType = 1
              } else if(this.addForm1.giveDateType == '月') {
                this.addForm1.giveDateType = 2
              } else {
                this.addForm1.giveDateType = 3
              }
              if(this.addForm1.isActivate == '是') {
                this.addForm1.isActivate = 1
              } else {
                this.addForm1.isActivate = 0
              }
              this.$axios({
                url: this.path + 'member/card/add',
                method: 'put',
                data: {
                  gymId:this.cardGymId,
                  kindId: this.addForm1.kindId,
                  kindType: this.addForm1.kindType,
                  memberId: this.addForm1.memberId,
                  time: this.addForm1.time,
                  dateType: this.addForm1.dateType,
                  money: this.addForm1.money,
                  giveDateType: this.addForm1.giveDateType,
                  giveTime: this.addForm1.giveTime,
                  payType: this.addForm1.payType,
                  remark: this.addForm1.remark,
                  salesman: this.addForm1.salesman,
                  cardNum: this.addForm1.cardNum,
                  isActivate: this.addForm1.isActivate,
                  contractNo:this.addForm1.contractNo,
                },
                transformRequest: [function(data) {
                  let ret = ''
                  for(let it in data) {
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
                  if(res.data.code === 100000) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm1'].resetFields();
                    this.cardGymId ='',
                    this.type1 = true;
                    this.type2 = false;
                    this.type3 = false;
                    this.addForm1.kindType = 1;
                    this.addForm1.dateType = '年';
                    this.addForm1.giveDateType = '月';

                    this.handleClose();
                    this.addForm1.memberId = '';
                    this.tradeId = res.data.order.tradeId;
                    this.resultMemberId = res.data.order.userId;


                    this.openDialog();
                  } else {
                    if(this.addForm1.dateType == 1) {
                      this.addForm1.dateType = '年'
                    } else if(this.addForm1.dateType == 2) {
                      this.addForm1.dateType = '月'
                    } else if(this.addForm1.dateType == 3){
                      this.addForm1.dateType = '日'
                    }

                    if(this.addForm1.giveDateType == 1 ) {
                      this.addForm1.giveDateType = '年'
                    } else if(this.addForm1.giveDateType == 2) {
                      this.addForm1.giveDateType = '月'
                    } else if(this.addForm1.dateType == 3){
                      this.addForm1.giveDateType = '日'
                    }
                    if(this.addForm1.isActivate == '是') {
                      this.addForm1.isActivate = 1
                    } else {
                      this.addForm1.isActivate = 0
                    }
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
                message: '已取消提交'
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      addSubmitForm2() {
        this.$refs.addForm2.validate((valid) => {
          if(valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.addForm2.dateType == '年') {
                this.addForm2.dateType = 1
              } else if(this.addForm2.dateType == '月') {
                this.addForm2.dateType = 2
              } else {
                this.addForm2.dateType = 3
              }
              this.$axios({
                url: this.path + 'member/card/add',
                method: 'put',
                data: {
                  gymId:this.cardGymId,
                  kindId: this.addForm2.kindId,
                  kindType: this.addForm2.kindType,
                  memberId: this.addForm2.memberId,
                  time: this.addForm2.time,
                  dateType: this.addForm2.dateType,
                  money: this.addForm2.money,
                  payType: this.addForm2.payType,
                  remark: this.addForm2.remark,
                  salesman: this.addForm2.salesman,
                  cardNum: this.addForm2.cardNum,
                  number: this.addForm2.number,
                  giveNumber: this.addForm2.giveNumber,
                  contractNo:this.addForm2.contractNo,
                },
                transformRequest: [function(data) {
                  let ret = ''
                  for(let it in data) {
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
                  if(res.data.code === 100000) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm2'].resetFields();
                    this.cardGymId ='',
                    this.type1 = true;
                    this.type2 = false;
                    this.type3 = false;
                    this.addForm1.kindType = 1;
                    this.addForm2.dateType = '年';
                    this.handleClose();
                    this.addForm2.memberId = '';
                    this.tradeId = res.data.order.tradeId;
                    this.resultMemberId = res.data.order.userId;
                    this.openDialog();
                  } else {
                    if(this.addForm2.dateType == 1) {
                      this.addForm2.dateType = '年'
                    } else if(this.addForm2.dateType == 2) {
                      this.addForm2.dateType = '月'
                    } else {
                      this.addForm2.dateType = '日'
                    }
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
                message: '已取消提交'
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      addSubmitForm3() {
        var status = this.addForm3.status;
        if(this.isBuy == '是') {
          if(status == 1) {
            this.$refs.addForm3.validate((valid) => {
              if(valid) {
                this.$confirm('您确定要提交吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if(this.addForm3.dateType == '年') {
                    this.addForm3.dateType = 1
                  } else if(this.addForm3.dateType == '月') {
                    this.addForm3.dateType = 2
                  } else {
                    this.addForm3.dateType = 3
                  }
                  if(this.addForm3.isLeague == true) {
                    this.addForm3.isLeague = 1
                  } else {
                    this.addForm3.isLeague = 0
                  }

                  if(this.addForm3.isPersonal == true) {
                    this.addForm3.isPersonal = 1
                  } else {
                    this.addForm3.isPersonal = 0
                  }

                  if(this.addForm3.isActivate == '是') {
                    this.addForm3.isActivate = 1
                  } else {
                    this.addForm3.isActivate = 0
                  }
                  this.$axios({
                    url: this.path + 'member/card/add',
                    method: 'put',
                    data: {
                      gymId:this.cardGymId,
                      kindId: this.addForm3.kindId,
                      kindType: this.addForm3.kindType,
                      memberId: this.addForm3.memberId,
                      time: this.addForm3.time,
                      dateType: this.addForm3.dateType,
                      money: this.addForm3.money,
                      giveMoney:this.addForm3.giveMoney,
                      payType: this.addForm3.payType,
                      remark: this.addForm3.remark,
                      salesman: this.addForm3.salesman,
                      cardNum: this.addForm3.cardNum,
                      isActivate: this.addForm3.isActivate,
                      isLeague: this.addForm3.isLeague,
                      isPersonal: this.addForm3.isPersonal,
                      contractNo:this.addForm3.contractNo,
                    },
                    transformRequest: [function(data) {
                      let ret = ''
                      for(let it in data) {
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
                      if(res.data.code === 100000) {
                        this.$message({
                          message: '提交成功',
                          type: 'success'
                        });
                        this.$refs['addForm3'].resetFields();
                        this.cardGymId ='',
                        this.type1 = true;
                        this.type2 = false;
                        this.type3 = false;
                        this.addForm1.kindType = 1;
                        this.addForm3.dateType = '年';
                        this.handleClose();
                        this.addForm3.memberId = '';
                        this.tradeId = res.data.order.tradeId;
                        this.resultMemberId = res.data.order.userId;
                        this.openDialog();

                      } else {
                        if(this.addForm3.dateType == 1) {
                          this.addForm3.dateType = '年'
                        } else if(this.addForm3.dateType == 2) {
                          this.addForm3.dateType = '月'
                        } else {
                          this.addForm3.dateType = '日'
                        }
                        if(this.addForm3.isLeague == 1) {
                          this.addForm3.isLeague = true
                        } else {
                          this.addForm3.isLeague = false
                        }

                        if(this.addForm3.isPersonal == 1) {
                          this.addForm3.isPersonal = true
                        } else {
                          this.addForm3.isPersonal = false
                        }

                        if(this.addForm3.isActivate == 1) {
                          this.addForm3.isActivate = '是'
                        } else {
                          this.addForm3.isActivate = '否'
                        }
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
                    message: '已取消提交'
                  });
                });
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          } else {
            this.$alert('该卡只允许正式会员购买，该会员为非正式会员', '提示', {
              confirmButtonText: '确定'
            });
          }
        }else{
          this.$refs.addForm3.validate((valid) => {
            if(valid) {
              this.$confirm('您确定要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                var status = this.addForm3.status;

                if(this.addForm3.dateType == '年') {
                  this.addForm3.dateType = 1
                } else if(this.addForm3.dateType == '月') {
                  this.addForm3.dateType = 2
                } else {
                  this.addForm3.dateType = 3
                }
                if(this.addForm3.isLeague == '是') {
                  this.addForm3.isLeague = 1
                } else {
                  this.addForm3.isLeague = 0
                }

                if(this.addForm3.isPersonal == '是') {
                  this.addForm3.isPersonal = 1
                } else {
                  this.addForm3.isPersonal = 0
                }

                if(this.addForm3.isActivate == '是') {
                  this.addForm3.isActivate = 1
                } else {
                  this.addForm3.isActivate = 0
                }
                this.$axios({
                  url: this.path + 'member/card/add',
                  method: 'put',
                  data: {
                    gymId:this.cardGymId,
                    kindId: this.addForm3.kindId,
                    kindType: this.addForm3.kindType,
                    memberId: this.addForm3.memberId,
                    time: this.addForm3.time,
                    dateType: this.addForm3.dateType,
                    money: this.addForm3.money,
                    giveMoney:this.addForm3.giveMoney,
                    payType: this.addForm3.payType,
                    remark: this.addForm3.remark,
                    salesman: this.addForm3.salesman,
                    cardNum: this.addForm3.cardNum,
                    isActivate: this.addForm3.isActivate,
                    isLeague: this.addForm3.isLeague,
                    isPersonal: this.addForm3.isPersonal,
                    contractNo:this.addForm3.contractNo,
                  },
                  transformRequest: [function(data) {
                    let ret = ''
                    for(let it in data) {
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
                    if(res.data.code === 100000) {
                      this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
                      this.$refs['addForm3'].resetFields();
                      this.cardGymId ='',
                      this.type1 = true;
                      this.type2 = false;
                      this.type3 = false;
                      this.addForm1.kindType = 1;
                      this.addForm3.dateType = '年';
                      this.handleClose();
                      this.addForm3.memberId = '';
                      this.tradeId = res.data.order.tradeId;
                      this.resultMemberId = res.data.order.userId;
                      this.openDialog();


                    } else {
                      if(this.addForm3.dateType == 1) {
                        this.addForm3.dateType = '年'
                      } else if(this.addForm3.dateType == 2) {
                        this.addForm3.dateType = '月'
                      } else {
                        this.addForm3.dateType = '日'
                      }
                      if(this.addForm3.isPersonal == 1) {
                        this.addForm3.isPersonal = '私教课'
                      } else {
                        this.addForm3.isPersonal = ''
                      }

                      if(this.addForm3.isActivate == 1) {
                        this.addForm3.isActivate = '团课'
                      } else {
                        this.addForm3.isActivate = ''
                      }

                      if(this.addForm3.isActivate == 1) {
                        this.addForm3.isActivate = '是'
                      } else {
                        this.addForm3.isActivate = '否'
                      }
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
                  message: '已取消提交'
                });
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      },
    }
  }
</script>

<style type="text/css">
  .plugins-tips {
    padding: 10px;
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
  .consume .el-checkbox{
    width: 120px;
  }
  .checkbox-list .el-checkbox{
    width: 100px;
  }
  .checkbox-list .el-checkbox+.el-checkbox{
    margin-right: 0!important;
  }

</style>
