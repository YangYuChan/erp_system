<template>
  <div class="table">
    <!--查询-->
    <div class="plugins-tips">
      <el-form label-width="70px">
        <el-form-item style="margin-bottom: 0;" label="场地选择">
          <el-select v-model="gymId" placeholder="全部" @change="handleFilter">
            <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 前台管理</el-breadcrumb-item>
        <el-breadcrumb-item>签到签出</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sign-contianer fl-left">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="签到" name="signIn">
          <div class="search-box">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQuery.keyword" placeholder="输入会员名称、手机号、卡号" style="width: 100%;" @keyup.native="selectSetTimeOut()">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>

              </el-form-item>
            </el-form>
          </div>
          <div class="result-list" v-show="resultList" ref="main">
            <p v-show="listLoading">搜索中...</p>
            <ul v-if="memberList != ''">
              <li class="clearfix result-item" v-for="item in memberList" @click="memberMsgSignIn(item)">
                <div class="photo fl-left">
                  <img :src="item.photo" height="50" width="50"/>
                </div>
                <div class="info fl-left">
                  <p class="clearfix"><span class="fl-left">{{item.name}}</span><span
                    class="fl-right">{{item.phone}}</span></p>
                  <p class="clearfix" v-if="item.memberCard"><span class="fl-left">{{item.memberCard.name}}</span><span
                    class="fl-right">{{item.memberCard.cardNum}}</span></p>
                  <p class="clearfix">
                    <span class="fl-left" v-if="item.status == 0" style="color:red">未办卡</span>
                    <span class="fl-left" v-else-if="item.status == 1 && item.memberCard.isActivate == 1">
                      <span v-if="item.memberCard.kindType == 1">剩余{{item.memberCard.remainTime}}天</span>
                      <span v-else-if="item.memberCard.kindType == 2">剩余{{item.memberCard.remainTime}}次</span>
                    </span>
                    <span class="fl-left" v-else-if="item.status == 2" style="color:red">已过期</span>
                    <span v-if="item.memberCard && item.memberCard.isActivate == 0"
                         style="color:red">
                        <span class="fl-left" >未激活</span>
                        <span class="fl-right">点击签到立即激活</span>
                     </span>
                    <span class="fl-right"
                          v-if="item.memberCard && item.memberCard.isActivate == 1">有效期至{{item.memberCard.endTime}}</span>
                  </p>
                </div>

              </li>

            </ul>
            <p v-else class="noData">
              没有匹配的会员信息
            </p>
          </div>
          <div class="member-info" v-show="memberInfoStatus">
            <!--正常状态-->
            <div v-if="oneCardMessage.status == 1">
              <div class="user-photo clearfix">
                <span class="fl-left"><img :src="oneCardMessage.photo" height="120" width="120"/></span>
                <div class="user-msg fl-left">
                  <p class="name">{{oneCardMessage.name}}</p>
                  <p>性别：{{oneCardMessage.sex}}</p>
                  <p>手机号：{{oneCardMessage.phone}}</p>
                  <p>会籍顾问：{{oneCardMessage.salesmanName}}</p>
                  <p>上次到店时间：{{oneCardMessage.lastSignDate}}</p>
                </div>
                <span v-if="oneCardMessage.memberCard && oneCardMessage.memberCard.isExpire == 0 " class="fl-right"><img
                  src="../../../../static/img/signIn.png" height="120" width="120"/></span>
              </div>
              <div class="signIn-info clearfix" v-if="oneCardMessage.status == 1 && oneCardMessage.memberCard">
                <div class="card-msg fl-left">
                  <p>{{oneCardMessage.memberCard.name}}</p>
                  <p>卡号：{{oneCardMessage.memberCard.cardNum}}</p>
                  <p class="clearfix" v-if="cardMessage.isFirstActivate != 1">
                    <span>有效期：{{oneCardMessage.memberCard.activateTime}}  到  {{oneCardMessage.memberCard.endTime}}</span>
                    <span class="fl-right"
                          v-if="oneCardMessage.memberCard.kindType == 1">剩余{{oneCardMessage.memberCard.remainTime}}天</span>
                    <span class="fl-right"
                          v-else-if="oneCardMessage.memberCard.kindType == 2">剩余{{oneCardMessage.memberCard.remainTime}}次</span>
                  </p>
                </div>
                <a v-if="cardMessage.isFirstActivate == 1" class="activate fl-right">激活成功</a>
                <br>
                <a v-if="oneCardMessage.status == 1" href="javascript:;" @click="cancelSignIn(cardMessage.id)" class="revoke fl-right">撤销签到</a>
              </div>
            </div>
            <!--未办卡-->
            <div v-else-if="oneCardMessage.status == 0">
              <div class="user-photo clearfix">
                <span class="fl-left"><img :src="oneCardMessage.photo" height="120" width="120"/></span>
                <div class="user-msg fl-left">
                  <p class="name">{{oneCardMessage.name}}</p>
                  <p>性别：{{oneCardMessage.sex}}</p>
                  <p>手机号：{{oneCardMessage.phone}}</p>
                  <p>会籍顾问：{{oneCardMessage.salesmanName}}</p>
                  <p>上次到店时间：{{oneCardMessage.lastSignDate}}</p>
                </div>
              </div>
              <h3 class="noCard">{{oneCardMessage.name}}无办卡信息，无法签到</h3>
            </div>
            <!--已过期-->
            <div v-else-if="oneCardMessage.status == 2">
              <div class="user-photo clearfix">
                <span class="fl-left"><img :src="oneCardMessage.photo" height="120" width="120"/></span>
                <div class="user-msg fl-left">
                  <p class="name">{{oneCardMessage.name}}</p>
                  <p>性别：{{oneCardMessage.sex}}</p>
                  <p>手机号：{{oneCardMessage.phone}}</p>
                  <p>会籍顾问：{{oneCardMessage.salesmanName}}</p>
                  <p>上次到店时间：{{oneCardMessage.lastSignDate}}</p>
                </div>

              </div>
              <div class="signIn-info clearfix" v-if="oneCardMessage.memberCard">
                <div class="card-msg fl-left">
                  <p>{{oneCardMessage.memberCard.name}}</p>
                  <p>卡号：{{oneCardMessage.memberCard.cardNum}}</p>
                  <p class="clearfix">
                    <span>有效期：{{oneCardMessage.memberCard.activateTime}}  到  {{oneCardMessage.memberCard.endTime}}</span>

                    <span>已过期</span>
                  </p>
                </div>

                <span>
                <a class="revoke fl-right"
                   v-if="oneCardMessage.memberCard.kindType == 1">已过期{{oneCardMessage.memberCard.remainTime}}天</a>
                <a class="revoke fl-right"
                   v-else-if="oneCardMessage.memberCard.kindType == 2">剩余{{oneCardMessage.memberCard.remainTime}}次</a>
              </span>
              </div>

              <p class="isExpire" v-if="oneCardMessage.memberCard.isExpire == 1">
                {{oneCardMessage.name}}的会员卡已过期，请提醒他续费</p>
            </div>

          </div>
        </el-tab-pane>
        <!--签退-->
        <el-tab-pane label="签退" name="signOut">
          <div class="search-box">
            <el-form :inline="true" :model="listQueryOut" class="demo-form-inline">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQueryOut.keyword" placeholder="输入会员名称、手机号、卡号" style="width: 100%;"
                          @keyup.native="selectSetTimeSignOut()">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="result-list" v-show="resultListOut" ref="main">
            <p v-show="listLoading">搜索中...</p>
            <ul v-if="memberListOut != ''">
              <li class="clearfix result-item" v-for="item in memberListOut" @click="memberMsgSignOut(item.id)">
                <div class="photo fl-left">
                  <img :src="item.photo" height="50" width="50"/>
                </div>
                <div class="info fl-left">
                  <p class="clearfix"><span class="fl-left">{{item.name}}</span><span
                    class="fl-right">{{item.phone}}</span></p>
                  <p class="clearfix" v-if="item.memberCard"><span class="fl-left">{{item.memberCard.name}}</span><span
                    class="fl-right">{{item.memberCard.cardNum}}</span></p>
                  <p class="clearfix">
                    <span class="fl-left" v-if="item.status == 0" style="color:red">未办卡</span>
                    <span class="fl-left" v-else-if="item.status == 1 && item.memberCard.isActivate == 1">
                      <span v-if="item.memberCard.kindType == 1">剩余{{item.memberCard.remainTime}}天</span>
                      <span v-else-if="item.memberCard.kindType == 2">剩余{{item.memberCard.remainTime}}次</span>
                    </span>
                    <span class="fl-left" v-else-if="item.status == 2" style="color:red">已过期</span>

                    <span class="fl-left" v-else-if="item.memberCard && item.memberCard.isActivate == 0"
                          style="color:red">未激活</span>
                    <span class="fl-right"
                          v-if="item.memberCard && item.memberCard.isActivate == 1">有效期至{{item.memberCard.endTime}}</span>
                  </p>
                </div>

              </li>

            </ul>
            <p v-else class="noData">
              没有匹配的会员信息
            </p>
          </div>
          <div class="member-info" v-show="memberInfoStatusOut" style="height: auto">
            <!--正常状态-->
            <div v-if="oneOutCardMessage.status == 1">
              <div class="user-photo clearfix">
                <span class="fl-left"><img :src="oneOutCardMessage.photo" height="120" width="120"/></span>
                <div class="user-msg fl-left">
                  <p class="name">{{oneOutCardMessage.name}}</p>
                  <p>性别：{{oneOutCardMessage.sex}}</p>
                  <p>手机号：{{oneOutCardMessage.phone}}</p>
                  <p>会籍顾问：{{oneOutCardMessage.salesmanName}}</p>
                  <p>上次到店时间：{{oneOutCardMessage.lastSignDate}}</p>
                </div>
              </div>
              <div class="signIn-info clearfix" v-if="oneOutCardMessage.status == 1 && oneOutCardMessage.memberCard">
                <div class="card-msg fl-left">
                  <p>{{oneOutCardMessage.memberCard.name}}</p>
                  <p>卡号：{{oneOutCardMessage.memberCard.cardNum}}</p>
                  <p class="clearfix" v-if="cardQuitMessage.isFirstActivate != 1">
                    <span>有效期：{{oneOutCardMessage.memberCard.activateTime}}  到  {{oneOutCardMessage.memberCard.endTime}}</span>
                    <span class="fl-right"
                          v-if="oneOutCardMessage.memberCard.kindType == 1">剩余{{oneOutCardMessage.memberCard.remainTime}}天</span>
                    <span class="fl-right"
                          v-else-if="oneOutCardMessage.memberCard.kindType == 2">剩余{{oneOutCardMessage.memberCard.remainTime}}次</span>
                  </p>
                </div>
              </div>
              <div class="noQuit-list">
                <el-checkbox-group v-model="quitCheckedList" >
                  <span v-for="item in recordList" v-if="item.isQuit == 0">
                    <el-checkbox :label="item.id" :key="item.id" :disabled="item.quitDisabled" @change="checkboxChange()">
                      签到时间：{{item.signDate}}
                      <span style="margin-left:100px" v-show="item.quitDisabled">已离场</span>
                    </el-checkbox>
                    </span>

                </el-checkbox-group>
              </div>
              <div class="quitButton">
                <el-button type="primary" @click="memberSignOut(oneOutCardMessage.id)" :disabled="hasGoOut">确认签退</el-button>
              </div>
            </div>
            <div v-if="oneOutCardMessage.status == 2">
              <div class="user-photo clearfix">
                <span class="fl-left"><img :src="oneOutCardMessage.photo" height="120" width="120"/></span>
                <div class="user-msg fl-left">
                  <p class="name">{{oneOutCardMessage.name}}</p>
                  <p>性别：{{oneOutCardMessage.sex}}</p>
                  <p>手机号：{{oneOutCardMessage.phone}}</p>
                  <p>会籍顾问：{{oneOutCardMessage.salesmanName}}</p>
                  <p>上次到店时间：{{oneOutCardMessage.lastSignDate}}</p>
                </div>
              </div>
              <div class="signIn-info clearfix" v-if="oneOutCardMessage.status == 1 && oneOutCardMessage.memberCard">
                <div class="card-msg fl-left">
                  <p>{{oneOutCardMessage.memberCard.name}}</p>
                  <p>卡号：{{oneOutCardMessage.memberCard.cardNum}}</p>
                  <p class="clearfix" v-if="cardQuitMessage.isFirstActivate != 1">
                    <span>有效期：{{oneOutCardMessage.memberCard.activateTime}}  到  {{oneOutCardMessage.memberCard.endTime}}</span>
                    <span class="fl-right"
                          v-if="oneOutCardMessage.memberCard.kindType == 1">剩余{{oneOutCardMessage.memberCard.remainTime}}天</span>
                    <span class="fl-right"
                          v-else-if="oneOutCardMessage.memberCard.kindType == 2">剩余{{oneOutCardMessage.memberCard.remainTime}}次</span>
                  </p>
                </div>
              </div>
              <div class="noQuit-list">
                <el-checkbox-group v-model="quitCheckedList" >
                  <span v-for="item in recordList" v-if="item.isQuit == 0">
                    <el-checkbox :label="item.id" :key="item.id" :disabled="item.quitDisabled" @change="checkboxChange()">
                      签到时间：{{item.signDate}}
                      <span style="margin-left:100px" v-show="item.quitDisabled">已离场</span>
                    </el-checkbox>
                    </span>

                </el-checkbox-group>
              </div>
              <div class="quitButton">
                <el-button type="primary" @click="memberSignOut(oneOutCardMessage.id)" :disabled="hasGoOut">确认签退</el-button>
              </div>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="售卖卡课" name="saleClass">
          <div class="search-box">
            <el-form :inline="true" :model="listQueryClass" class="demo-form-inline">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQueryClass.keyword" placeholder="输入会员名称、手机号、卡号" style="width: 100%;" @keyup.native="selectSetTimeClass()">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>

              </el-form-item>
            </el-form>
          </div>
          <div class="result-list" v-show="resultListClass" ref="main">
            <p v-show="listLoading">搜索中...</p>
            <ul v-if="memberListClass != ''">
              <li class="clearfix result-item" v-for="item in memberListClass" @click="memberMsgSignIn(item)">
                <div class="photo fl-left">
                  <img :src="item.photo" height="50" width="50"/>
                </div>
                <div class="info fl-left">
                  <p class="clearfix"><span class="fl-left">{{item.name}}</span><span
                    class="fl-right">{{item.phone}}</span></p>
                  <p class="clearfix" v-if="item.memberCard"><span class="fl-left">{{item.memberCard.name}}</span><span
                    class="fl-right">{{item.memberCard.cardNum}}</span></p>
                  <p class="clearfix">
                    <span class="fl-left" v-if="item.status == 0" style="color:red">未办卡</span>
                    <span class="fl-left" v-else-if="item.status == 1 && item.memberCard.isActivate == 1">
                      <span v-if="item.memberCard.kindType == 1">剩余{{item.memberCard.remainTime}}天</span>
                      <span v-else-if="item.memberCard.kindType == 2">剩余{{item.memberCard.remainTime}}次</span>
                    </span>
                    <span class="fl-left" v-else-if="item.status == 2" style="color:red">已过期</span>

                    <span class="fl-left" v-else-if="item.memberCard && item.memberCard.isActivate == 0"
                          style="color:red">未激活</span>
                    <span class="fl-right"
                          v-if="item.memberCard && item.memberCard.isActivate == 1">有效期至{{item.memberCard.endTime}}</span>
                  </p>
                </div>

              </li>
            </ul>
            <p v-else class="noData">
              没有匹配的会员信息
            </p>
          </div>
          <div class="member-info sale-class">
            <header class="sale-header clearfix">
              <span class="status fl-left">正式会员</span>
              <span class="icon fl-right"><i class="el-icon-close"></i></span>
            </header>
            <section class="info-section">
              <div class="user-photo">
                <img src="../../../../static/img/1.jpg" alt="" width="100" height="100">
                <p>李易峰</p>
              </div>
              <div class="user-info">
                <p class="item"><span>性别：</span>男</p>
                <p class="item"><span>手机号：</span>15851356589</p>
                <p class="item"><span>会籍顾问：</span>杨玉婵</p>
              </div>
            </section>
            <footer class="info-footer clearfix">
              <a href="javascript:;" @click="memberSetCard" class="btn-item">会员办卡</a>
              <a href="javascript:;" @click="salePersonalClass" class="btn-item">私教课售卖</a>
              <a href="javascript:;" class="btn-item">预约团课</a>
            </footer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="sign-list fl-right">
      <el-tabs v-model="activeRecordName" type="border-card">
        <el-tab-pane label="签到记录" name="first">
          <ul class="record-list">
            <li class="clearfix" v-for="(item,index) in signRecordData">
              <span  v-if="(item.type == 3 || item.type == 4) && index == 0" class="message fl-left redColor">{{item.message}}</span>
              <span  v-else class="message fl-left">{{item.message}}</span>
              <span class="time fl-right">{{item.createTime}}</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="购买记录" name="second">
          <div class="buy-record">
            <dl>
              <dt class="clearfix">
                <b class="fl-left">今日合计</b>
                <span class="fl-right price">￥2400</span>
              </dt>
              <dd>
                <p class="clearfix">
                  <b class="fl-left">王老师瑜伽课</b>
                  <span class="fl-right">2018-05-02   11:30:30</span>
                </p>
                <p>私教课</p>
                <p>会员：王超</p>
                <p class="clearfix">
                  <span class="fl-left">课时：21课时</span>
                  <span class="fl-right price">￥120</span>
                </p>
            </dd>
            </dl>
          </div>
        </el-tab-pane>
        <el-tab-pane label="预约记录" name="three">
          <div class="buy-record">
            <dl>
              <dt></dt>
              <dd>
                <p class="clearfix">
                  <b class="fl-left">王老师瑜伽课</b>
                  <span class="fl-right">2018-05-02   11:30:30</span>
                </p>
                <p><span>团课</span><span class="fl-right price">￥120</span></p>
                <p>会员：王超</p>
                <p class="clearfix">
                  <span class="fl-left">课程时长：45分钟</span>
                  <span class="fl-right price">上课时间：2018-05-02   15:30</span>
                </p>
              </dd>
            </dl>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  <!--会员办卡-->
    <el-dialog :visible.sync="addCardVisible" title="会员办卡" width="600px" :before-close="handleCardClose" :closeOnClickModal="false">
      <div class="type1" v-show="type1">
        <el-form ref="addForm1" :model="addForm1" label-width="160px" :rules="addRules1" class="form-container">
          <el-form-item label="售卖场地：" prop="gymId">
            <el-select v-model="addForm1.gymId" placeholder="请选择售卖场地" @change="selectCardType(addForm1.gymId,addForm1.kindType)">
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
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm1.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleCardClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm1">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="type2" v-show="type2">
        <el-form ref="addForm2" :model="addForm2" label-width="160px" :rules="addRules2" class="form-container">
          <el-form-item label="售卖场地：" prop="gymId">
            <el-select v-model="addForm2.gymId" placeholder="请选择售卖场地" @change="selectCardType(addForm2.gymId,addForm2.kindType)">
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
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm2.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleCardClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm2">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="type3" v-show="type3">
        <el-form ref="addForm3" :model="addForm3" label-width="160px" :rules="addRules3" class="form-container">
          <el-form-item label="售卖场地：" prop="gymId">
            <el-select v-model="addForm3.gymId" placeholder="请选择售卖场地" @change="selectCardType(addForm3.gymId,addForm3.kindType)">
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
            <el-input v-model="addForm3.giveMoney" style="width: 111px;"></el-input>
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
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="addForm3.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleCardClose">取消</el-button>
            <el-button type="primary" @click="addSubmitForm3">提交</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-dialog>
    <!--end-->
<!--私教课售卖-->
    <el-dialog :visible.sync="salePersonalVisible" title="私教课售卖" width="1000px" :before-close="handleCardClose" :closeOnClickModal="false">
      <el-tabs v-model="activePersonal" type="card">
        <el-tab-pane label="全部" name="all">
          <div class="class-list fl-left">
            <el-form :inline="true" :model="listQuerySaleClass" class="demo-form-inline" style="margin: 10px auto;">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQuerySaleClass.keyword" placeholder="输入课程名称或教练名称查询" style="width: 300px;" size="mini">
                </el-input>
              </el-form-item>
              <el-button type="primary" class="el-icon-search" size="mini" style="margin-top:6px">查询</el-button>
            </el-form>
            <div class="data-list">
              <ul class="clearfix">
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
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuerySaleClass.page" :page-sizes="[10,20,30,50]" :page-size="listQuerySaleClass.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
          <div class="active-list fl-right">
              <div class="notActive" v-show="noActive">
                <p><i class="icon iconfont icon-icon-test"></i></p>
                <p class="font">请选择左侧课程</p>
              </div>
            <div class="one-class-msg">
              <el-form ref="addForm1" :model="addForm1" label-width="120px" :rules="addRules1" class="form-container" size="mini">

                <el-form-item label="会员名称：" prop="name">
                  <span>王超</span>
                  <span style="margin-left: 100px;">手机号：12345678945</span>
                </el-form-item>
                <el-form-item label="课程状态：" prop="name">
                  <h4>线上课程</h4>
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
                <el-form-item label="购买数量：" prop="name">
                  <el-input v-model="addForm1.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="赠送课时：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>
                <el-form-item label="合计课时：" prop="money">
                  <span>10课时</span>
                </el-form-item>
                <el-form-item label="上课教练：" prop="money">
                  <span>王超</span>
                </el-form-item>

                <el-form-item label="销售教练：" prop="salesman">
                  <el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
                    <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售卖价格：" prop="money">
                  <span>￥150</span>
                </el-form-item>
                <el-form-item label="优惠：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>

                <el-form-item label="应收金额：" prop="remark">
                  <span style="color:red">￥150</span>
                  <el-checkbox>赠课</el-checkbox>
                </el-form-item>
                <el-form-item label="合同编号：" prop="remark">
                  <el-input v-model="addForm1.remark"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="addForm1.remark" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addSubmitForm1">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="线下课程" name="lineIn"> <div class="class-list fl-left">
          <el-form :inline="true" :model="listQuerySaleClass" class="demo-form-inline" style="margin: 20px auto;">
            <el-form-item style="margin-bottom: 0">
              <el-input v-model="listQuerySaleClass.keyword" placeholder="输入课程名称或教练名称查询" style="width: 300px;">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="el-icon-search">查询</el-button>
          </el-form>
          <div class="data-list">
            <ul class="clearfix">
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuerySaleClass.page" :page-sizes="[10,20,30,50]" :page-size="listQuerySaleClass.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
          <div class="active-list fl-right">
            <div class="notActive" v-show="noActive">
              <p><i class="icon iconfont icon-icon-test"></i></p>
              <p class="font">请选择左侧课程</p>
            </div>
            <div class="one-class-msg">
              <el-form ref="addForm1" :model="addForm1" label-width="120px" :rules="addRules1" class="form-container" size="mini">

                <el-form-item label="会员名称：" prop="name">
                  <span>王超</span>
                  <span style="margin-left: 100px;">手机号：12345678945</span>
                </el-form-item>
                <el-form-item label="课程状态：" prop="name">
                  <h4>线上课程</h4>
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
                <el-form-item label="购买数量：" prop="name">
                  <el-input v-model="addForm1.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="赠送课时：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>
                <el-form-item label="合计课时：" prop="money">
                  <span>10课时</span>
                </el-form-item>
                <el-form-item label="上课教练：" prop="money">
                  <span>王超</span>
                </el-form-item>

                <el-form-item label="销售教练：" prop="salesman">
                  <el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
                    <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售卖价格：" prop="money">
                  <span>￥150</span>
                </el-form-item>
                <el-form-item label="优惠：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>

                <el-form-item label="应收金额：" prop="remark">
                  <span style="color:red">￥150</span>
                  <el-checkbox>赠课</el-checkbox>
                </el-form-item>
                <el-form-item label="合同编号：" prop="remark">
                  <el-input v-model="addForm1.remark"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="addForm1.remark" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addSubmitForm1">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="线上课程" name="lineOn">
          <div class="class-list fl-left">
          <el-form :inline="true" :model="listQuerySaleClass" class="demo-form-inline" style="margin: 20px auto;">
            <el-form-item style="margin-bottom: 0">
              <el-input v-model="listQuerySaleClass.keyword" placeholder="输入课程名称或教练名称查询" style="width: 300px;">
              </el-input>
            </el-form-item>
            <el-button type="primary" class="el-icon-search">查询</el-button>
          </el-form>
          <div class="data-list">
            <ul class="clearfix">
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuerySaleClass.page" :page-sizes="[10,20,30,50]" :page-size="listQuerySaleClass.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
          <div class="active-list fl-right">
            <div class="notActive" v-show="noActive">
              <p><i class="icon iconfont icon-icon-test"></i></p>
              <p class="font">请选择左侧课程</p>
            </div>
            <div class="one-class-msg">
              <el-form ref="addForm1" :model="addForm1" label-width="120px" :rules="addRules1" class="form-container" size="mini">

                <el-form-item label="会员名称：" prop="name">
                  <span>王超</span>
                  <span style="margin-left: 100px;">手机号：12345678945</span>
                </el-form-item>
                <el-form-item label="课程状态：" prop="name">
                  <h4>线上课程</h4>
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
                <el-form-item label="购买数量：" prop="name">
                  <el-input v-model="addForm1.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="赠送课时：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>
                <el-form-item label="合计课时：" prop="money">
                  <span>10课时</span>
                </el-form-item>
                <el-form-item label="上课教练：" prop="money">
                  <span>王超</span>
                </el-form-item>

                <el-form-item label="销售教练：" prop="salesman">
                  <el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
                    <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售卖价格：" prop="money">
                  <span>￥150</span>
                </el-form-item>
                <el-form-item label="优惠：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>

                <el-form-item label="应收金额：" prop="remark">
                  <span style="color:red">￥150</span>
                  <el-checkbox>赠课</el-checkbox>
                </el-form-item>
                <el-form-item label="合同编号：" prop="remark">
                  <el-input v-model="addForm1.remark"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="addForm1.remark" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addSubmitForm1">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
   <!--end-->
    <!--团课预约-->
    <el-dialog :visible.sync="saleGroupVisible" title="团课预约" width="1000px" :before-close="handleCardClose" :closeOnClickModal="false">
      <div class="group-msg-info clearfix">
          <div class="class-list fl-left">
            <div class="date-list"></div>
            <el-form :inline="true" :model="listQuerySaleClass" class="demo-form-inline" style="margin: 20px auto;">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQuerySaleClass.keyword" placeholder="输入课程名称或教练名称查询" style="width: 300px;">
                </el-input>
              </el-form-item>
              <el-button type="primary" class="el-icon-search">查询</el-button>
            </el-form>
            <div class="data-list">
              <ul class="clearfix">
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
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuerySaleClass.page" :page-sizes="[10,20,30,50]" :page-size="listQuerySaleClass.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
          <div class="active-list fl-right">
            <div class="notActive" v-show="noActive">
              <p><i class="icon iconfont icon-icon-test"></i></p>
              <p class="font">请选择左侧课程</p>
            </div>
            <div class="one-class-msg">
              <el-form ref="addForm1" :model="addForm1" label-width="120px" :rules="addRules1" class="form-container" size="mini">

                <el-form-item label="会员名称：" prop="name">
                  <span>王超</span>
                  <span style="margin-left: 100px;">手机号：12345678945</span>
                </el-form-item>
                <el-form-item label="课程状态：" prop="name">
                  <h4>线上课程</h4>
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
                <el-form-item label="购买数量：" prop="name">
                  <el-input v-model="addForm1.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="赠送课时：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>
                <el-form-item label="合计课时：" prop="money">
                  <span>10课时</span>
                </el-form-item>
                <el-form-item label="上课教练：" prop="money">
                  <span>王超</span>
                </el-form-item>

                <el-form-item label="销售教练：" prop="salesman">
                  <el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
                    <el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售卖价格：" prop="money">
                  <span>￥150</span>
                </el-form-item>
                <el-form-item label="优惠：" prop="money">
                  <el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
                </el-form-item>

                <el-form-item label="应收金额：" prop="remark">
                  <span style="color:red">￥150</span>
                  <el-checkbox>赠课</el-checkbox>
                </el-form-item>
                <el-form-item label="合同编号：" prop="remark">
                  <el-input v-model="addForm1.remark"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="addForm1.remark" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addSubmitForm1">提交</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          </div>
    </el-dialog>
    <!--end-->
    <!--确认课程-->
    <el-dialog :visible.sync="affirmClassVisible" width="1000px" :showClose="false" :closeOnClickModal="false" class="affirmDialog">
      <header class="affirm-title">
        <span class="goback"><el-button size="small" plain icon="el-icon-caret-left">返回</el-button></span>
        <span class="title">私教课售卖</span>
      </header>
     <div class="clearfix affirm-container">
       <div class="class-list fl-left">
         <dl>
           <dt class="item-title"><span class="item-name">商品名称</span><span class="item-name">数量</span></dt>
           <dd class="item-title"><span class="item-name">王老师瑜伽课</span><span class="item-name">21课时</span></dd>
         </dl>
       </div>
       <div class="active-list fl-right">
         <dl>
           <dt class="item-title"><span class="item-name">应收金额</span><span class="item-name">￥200</span></dt>
         </dl>
         <div class="pay-info">
           <p class="user-msg">会员信息：chasel（19288888888）</p>
           <p class="pay-mode clearfix"><span class="payfont">支付方式：</span>
             <el-radio-group>
             <el-radio :label="1">微信支付</el-radio>
             <el-radio :label="2">支付宝支付</el-radio>
             <el-radio :label="3">现金支付</el-radio>
             <el-radio :label="4">pos机支付</el-radio>
             <el-radio :label="5">银联支付</el-radio>
             <el-radio :label="6">其他方式支付</el-radio>
           </el-radio-group></p>
           <el-button type="primary" @click="addSubmitForm1">立即收款</el-button>
         </div>
       </div>
     </div>

    </el-dialog>
    <!--end-->
    <!--支付成功-->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="25%"
      center
    class="paySuccessDialog">
      <header class="success-header">
        <i class="el-icon-success"></i>
        <span>支付成功</span>
      </header>
      <dl class="pay-success-info">
        <dd class="info-item"><span>购买日期：</span><span>2018-05-02 11:30:30</span></dd>
        <dd class="info-item"><span>操作人：</span><span>林峰</span></dd>
        <dd class="info-item"><span>会员：</span><span>杨玉婵</span></dd>
        <dd class="info-item"><span>合同编号：</span><span>WD4662323232</span></dd>
        <dd class="ddhr"></dd>
        <dd class="info-item"><span>私教课名称：</span><span>王老师教瑜伽</span></dd>
        <dd class="info-item"><span>购买数量：</span><span>购买20课时，赠送2课时</span></dd>
        <dd class="info-item"><span>实收金额：</span><span>￥200</span></dd>
        <dd class="info-item"><span>支付方式：</span><span>现金</span></dd>
        <dd class="info-item"><span>订单号：</span><span>12345567788898999999</span></dd>
        <dd class="info-item"><span>备注：</span><span>方式范德萨范德萨发生地方都是</span></dd>
      </dl>
      <div class="btn-box">
        <el-button type="primary" @click="centerDialogVisible = false">打印小票</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--end-->
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
        path: global_.path,
        tableData: [], //
        gymData: [],
        action: global_.action,
        signRecordData: [],
        activeName: 'signIn',
        activeRecordName: 'first',
        activePersonal:'all',
        loading: false,
        token: '',
        gymId: '',
        resultList: false,
        resultListOut:false,
        resultListClass:false,
        memberInfoStatus: false,
        memberInfoStatusOut:false,
        affirmClassVisible:false,//确认订单
        saleGroupVisible:false,//团课预约
        salePersonalVisible:true,//私教课售卖
        centerDialogVisible: false,//支付成功
        cardMessage: '',
        oneCardMessage: '',
        oneOutCardMessage:'',
        cardQuitMessage:'',
        listQuery: {
          keyword: '',
        },
        listQueryOut: {
          keyword: '',
        },
        listQueryClass: {
          keyword: '',
        },
        recordIdList:[],
        checkedId:[],//选中的签退日期id
        recordList:[],
        memberList: [],
        memberListOut:[],
        memberListClass:[],
        quitCheckedList:[],
//        quitDisabled:false,
        hasGoOut:false,
        listLoading:false,
        timein:null,
        timeout:null,
        timeclass:null,

        type1: true,//会员办卡
        type2: false,
        type3: false,
        moreFilter: false,
        addCardVisible: false,
        saleList: [],
        coachList: [],
        cardList:[],
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
        },
          {
            id: 5,
            value: '其它'
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
          gymId: '',
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          giveDateType: '月',
          giveTime: '',
          payType: 1,
          remark: '',
          salesman: '',
          cardNum: '',
          isActivate: '否',
        },
        addForm2: {
          gymId: '',
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          payType: 1,
          remark: '',
          salesman: '',
          cardNum: '',
          number: '',
          giveNumber: '',
        },
        addForm3: {
          gymId: '',
          kindId: '',
          kindType: '',
          memberId: '',
          time: '',
          dateType: '年',
          money: '',
          giveMoney:'',
          payType: 1,
          remark: '',
          salesman: '',
          cardNum: '',
          isActivate: '否',
          isLeague: '',
          isPersonal: ''
        },
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
        },
        listQuerySaleClass:{
          keyword:'',
          page:0,
          limit:0,
        },
        total:0,
        noActive:false
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getType();
        this.getSignRecord();
      });
    },
    methods: {
      showIn() {
        this.resultList = true;
        document.addEventListener('click', this.hidePanel, false)
      },

      hideIn() {
        this.resultList = false;
        document.removeEventListener('click', this.hidePanel, false)
      },
      showOut() {
        this.resultListOut = true;
        document.addEventListener('click', this.hidePanelOut, false)
      },

      hideOut() {
        this.resultListOut = false;
        document.removeEventListener('click', this.hidePanelOut, false)
      },

      showClass() {
        this.resultListClass = true;
        document.addEventListener('click', this.hidePanelClass, false)
      },

      hideClass() {
        this.resultListClass = false;
        document.removeEventListener('click', this.hidePanelClass, false)
      },

      //点击空白处隐藏面板
      hidePanel(e) {
        if (!this.$refs.main.contains(e.target)) {
          this.hideIn();
        }
      },
      hidePanelOut(e) {
        if (!this.$refs.main.contains(e.target)) {
          this.hideOut();
        }
      },
      hidePanelClass(e) {
        if (!this.$refs.main.contains(e.target)) {
          this.hideClass();
        }
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
            this.gymId = res.data[0].id;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleFilter() {
        this.getSignRecord();
      },
      memberMsgSignIn(item) {
        this.selectDetails(item.id);
        if(item.memberCard){
          this.memberSignIn(item.id,item.memberCard.id);
        }else{
          this.memberSignIn(item.id,'');
        }

        this.resultList = false;
        this.memberInfoStatus = true;

      },
      memberMsgSignOut(id){
        this.selectOutDetails(id);
        this.resultListOut = false;
        this.memberInfoStatusOut = true;
        this.quitDisabled = false;
        this.hasGoOut = false;
        this.quitCheckedList=[];
      },

      selectDetails(id) {
        global_.$options.exportSession(this.selectDetails);
        this.$axios({
          url: this.path + 'sign/member/' + id,
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
            if (res.data.code === 100000) {
              this.oneCardMessage = res.data.signMember;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectOutDetails(id){
        global_.$options.exportSession(this.selectOutDetails);
        this.quitChecked = false;
        this.recordList = [];
        this.$axios({
          url: this.path + 'sign/member/' + id,
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
            if (res.data.code === 100000) {
              this.oneOutCardMessage = res.data.signMember;
              this.recordList = res.data.signMember.signRecordList;
              for(var i = 0;i<this.recordList.length;i++){
                if(this.recordList[i].isQuit == 0){
                  this.quitCheckedList.push(this.recordList[i].id);
                }
              }
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //撤销签到
      cancelSignIn(id){
        this.$axios({
          url: this.path + 'sign/cancel',
          method: 'post',
          params:{
            recordId:id,
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
              this.$message({
                message: '撤销签到成功',
                type: 'success'
              });
              this.memberInfoStatus = false;
              this.getSignRecord();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      checkboxChange(){
        if(this.quitCheckedList != null){
          this.hasGoOut = false;
        }else{
          this.hasGoOut = true;
        }
      },
      //签退
      memberSignOut(id){
        global_.$options.exportSession(this.memberSignOut);
        var recordId = this.quitCheckedList.join(",");
        this.$axios({
          url: this.path + 'sign/quit',
          method: 'post',
          params:{
            memberId:id,
            gymId:this.gymId,
            recordList:recordId,
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
              this.cardQuitMessage = res.data.record;
              this.$message({
                message: '签退成功',
                type: 'success'
              });
              for(var i = 0;i<this.recordList.length;i++){
                for(var j = 0;j<this.quitCheckedList.length;j++){
                  if(this.recordList[i].id == this.quitCheckedList[j]){
                      this.recordList[i].quitDisabled = true;
                      this.hasGoOut = true;
                  }
                }
              }
              this.getSignRecord();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //签到
      memberSignIn(id,cardId) {
        global_.$options.exportSession(this.memberSignIn);
        this.$axios({
          url: this.path + 'sign/enter',
          method: 'post',
          params:{
            memberId:id,
            memberCardId:cardId,
            gymId:this.gymId
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
              this.cardMessage = res.data.record;
              this.getSignRecord();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectSetTimeSignOut(){
        clearTimeout(this.timeclass);
        if(this.listQueryOut.keyword != '' && this.listQueryOut.keyword != null){

          this.timeclass = setTimeout(() => {
            this.getMemberListOut();
          }, 300);
        }else{
          this.hideOut();
        }
      },
      getMemberListOut(){
        this.memberInfoStatusOut = false;
        this.hideOut();
        global_.$options.exportSession(this.getMemberListOut);
        this.$axios({
          url: this.path + 'sign/member/enter/list',
          method: 'get',
          params: this.listQueryOut,
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
              this.memberListOut = res.data.list;
              this.showOut();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectSetTimeOut(){
        clearTimeout(this.timein);

        if(this.listQuery.keyword != '' && this.listQuery.keyword != null){
          this.timein = setTimeout(() => {
            this.getMemberList();
          }, 300);
        }else{
          this.hideIn();
        }
      },
      getMemberList() {
        this.memberInfoStatus = false;
        this.hideIn();

        global_.$options.exportSession(this.getMemberList);
        this.$axios({
          url: this.path + 'sign/member/list',
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
              this.memberList = res.data.list;
              this.showIn();

            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
     //售卖卡课
      selectSetTimeClass(){
        clearTimeout(this.timeout);
        if(this.listQueryClass.keyword != '' && this.listQueryClass.keyword != null){

          this.timeout = setTimeout(() => {
            this.getMemberClassList();
          }, 300);
        }else{
          this.hideClass();
        }
      },
      getMemberClassList(){
        this.memberInfoStatusOut = false;
        this.hideClass();
        global_.$options.exportSession(this.getMemberClassList);
        this.$axios({
          url: this.path + 'sign/member/enter/list',
          method: 'get',
          params: this.listQueryClass,
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
              this.memberListClass = res.data.list;
              this.showClass();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getSignRecord() {
        global_.$options.exportSession(this.getSignRecord);
        this.$axios({
          url: this.path + 'sign/record/list?gymId=' + this.gymId,
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
            if (res.data.code === 100000) {
              this.signRecordData = res.data.list;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //会员办卡
      memberSetCard(row){
        this.addForm1.kindType = 1;
        this.addForm1.name = row.name;
        this.addForm1.memberId = row.id;
        this.addForm2.name = row.name;
        this.addForm2.memberId = row.id;
        this.addForm3.name = row.name;
        this.addForm3.memberId = row.id;
        this.addForm3.status = row.status;
        this.getCardName(this.filterGymId,this.addForm1.kindType);
        this.getMemberList();
        this.getSaleList();
        this.addCardVisible = true;
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
      getCoachList(gymId) {
        if(gymId == null){
          gymId = '';
        }
        this.$axios({
          url: this.path + 'staff/coach/list?gymId='+gymId,
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
              this.coachList = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })
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
                  gymId:this.addForm1.gymId,
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
                    this.type1 = true;
                    this.type2 = false;
                    this.type3 = false;
                    this.addForm1.kindType = 1;
                    this.addForm1.dateType = '年';
                    this.addForm1.giveDateType = '月';

                    this.addCardVisible = false;
                    this.getData();
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
                  gymId:this.addForm2.gymId,
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
                    this.type1 = true;
                    this.type2 = false;
                    this.type3 = false;
                    this.addForm1.kindType = 1;
                    this.addForm2.dateType = '年';
                    this.addCardVisible = false;
                    this.getData();
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
                      gymId:this.addForm3.gymId,
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
                      isPersonal: this.addForm3.isPersonal
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
                        this.type1 = true;
                        this.type2 = false;
                        this.type3 = false;
                        this.addForm1.kindType = 1;
                        this.addForm3.dateType = '年';
                        this.addCardVisible = false;
                        this.getData();
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
                    gymId:this.addForm3.gymId,
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
                    isPersonal: this.addForm3.isPersonal
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
                      this.type1 = true;
                      this.type2 = false;
                      this.type3 = false;
                      this.addForm1.kindType = 1;
                      this.addForm3.dateType = '年';
                      this.addCardVisible = false;
                      this.getData();
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
      handleCardClose(){
        this.memberId ='';
        this.$refs['addForm1'].resetFields();
        this.$refs['addForm2'].resetFields();
        this.$refs['addForm3'].resetFields();
        this.type1 = true;
        this.type2 = false;
        this.type3 = false;
        this.addForm1.kindType = 1;
        this.addForm1.dateType = '年';
        this.addForm1.giveDateType = '月';
        this.addForm2.dateType = '年';
        this.addForm3.dateType = '年';
        this.addCardVisible = false;
      },
      //私教课售卖
      salePersonalClass(){

      },
      handleSizeChange(val) {
        this.listQuerySaleClass.limit = val;
        this.getPersonalClass();
      },
      handleCurrentChange(val) {
        this.listQuerySaleClass.page = val;
        this.getPersonalClass();
      },
      //查询私教课程
      getPersonalClass(){

      },
    }
  }
</script>

<style>
  .affirmDialog .el-dialog__header{
    padding: 0 !important;
  }
  .affirmDialog .el-dialog__body{
    padding: 15px 0 0;
  }
  .redColor{
    color: #ff0000;
    font-size: 20px;
  }
  .noQuit-list{
    margin:30px 0;
  }
  .noQuit-list .el-checkbox{
    display: block;
    line-height: 30px;
  }
  .quitButton{
    text-align: center;
  }
  .noCard {
    font-size: 24px;
    text-align: center;
    margin-top: 50px;
  }

  .user-msg {
    margin-left: 20px;
    font-size: 14px;
    line-height: 1.5;
  }

  .user-msg .name {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .revoke {
    margin-top: 100px;
    color: #ff4b00;
    font-weight: bold;
    font-size: 14px;
  }

  .isExpire {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
  }

  .activate {
    position: absolute;
    bottom: 80px;
    right: 40px;
    color: #ff4b00;
    font-size: 14px;
  }

  .card-msg {
    background-color: #ff4b00;
    border-radius: 10px;
    width: 70%;
    line-height: 26px;
    padding: 16px;
    font-size: 16px;
    color: #ffffff;
    margin-top: 30px;
  }
  .noData {
    font-size: 14px;
    padding: 5px;
    color: #999999;
  }

  .noData,
  .result-item {
    border-bottom: 1px solid #dcdfe6;
  }

  .fl-left {
    float: left;
  }

  .fl-right {
    float: right;
  }

  .sign-contianer {
    width: 55%;
  }

  .sign-list {
    width: 40%;

  }

  .record-list li {
    padding: 0 30px;
    line-height: 40px;
    height: 40px;
  }

  .search-box {
    margin: 50px auto 0;
    width: 600px;
  }

  .search-box .el-form-item,
  .search-box .el-form-item__content {
    width: 100%;
  }

  .result-list .photo img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-position: top center;
    margin: 5px;
  }

  .result-list .info {
    display: block;
    width: 420px;
    margin: 5px 0;
    font-size: 14px;
  }

  .result-list .info p {
    line-height: 20px;
    height: 20px;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover{
    color: #f9690e;
  }
</style>
