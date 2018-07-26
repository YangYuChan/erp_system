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
              <li class="clearfix result-item" v-for="item in memberListClass" @click="saleClassMsg(item)">
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
          <div class="member-info sale-class" v-show="saleClassStatusOut">
            <header class="sale-header clearfix">
              <span class="status fl-left" v-if="oneCardMessage.status == 0">潜在会员</span>
              <span class="status fl-left" v-if="oneCardMessage.status == 1">正式会员</span>
              <span class="status fl-left" v-if="oneCardMessage.status == 2">过期会员</span>
              <span class="icon fl-right" @click="hideSaleClassStatus"><i class="el-icon-close"></i></span>
            </header>
            <section class="info-section">
              <div class="user-photo">
                <p><img v-if="oneCardMessage.photo != null" :src="oneCardMessage.photo" width="100" height="100" style="display: block;margin: 0 auto;"></p>
                <p>{{oneCardMessage.name}}</p>
              </div>
              <div class="user-info">
                <p class="item"><span>性别：</span>{{oneCardMessage.sex}}</p>
                <p class="item"><span>手机号：</span>{{oneCardMessage.phone}}</p>
                <p class="item" v-if="oneCardMessage.salesmanName !=null"><span>会籍顾问：</span>{{oneCardMessage.salesmanName}}</p>
                <p class="item" v-if="oneCardMessage.status == 1 || oneCardMessage.status == 2">
                  <a v-if="oneCardMessage.memberCard.cardNum !='' ">
                    <span>已有卡号：</span>{{oneCardMessage.memberCard.cardNum}}
                  </a>
                  <span v-if="oneCardMessage.memberCard.isActivate == 0">(待激活)</span>
                  <span v-if="oneCardMessage.memberCard.isActivate == 1">
                      <span v-if="oneCardMessage.memberCard.isExpire == 0">(使用中)</span>
                      <span v-else-if="oneCardMessage.memberCard.isExpire == 1">(已过期)</span>
                  </span>
                </p>

              </div>

            </section>
            <footer class="info-footer clearfix">
              <a href="javascript:;" @click="memberSetCard(oneCardMessage)" class="btn-item">会员办卡</a>
              <a href="javascript:;" @click="salePersonalClass" class="btn-item">私教课售卖</a>
              <a href="javascript:;" @click="saleGroupClass" class="btn-item">预约团课</a>
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
          <buy-record ref="buyRecord"></buy-record>
        </el-tab-pane>
        <el-tab-pane label="预约记录" name="three">
          <order-list ref="orderList"></order-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  <!--会员办卡-->
    <el-dialog :visible.sync="addCardVisible" title="会员办卡" width="600px" :before-close="handleCardClose" :closeOnClickModal="false">
      <member-card ref="memberCard" v-bind:gymId ="gymId" v-bind:oneCardMessage ="oneCardMessage" v-on:memberCardClose="handleCardClose" v-on:openCenterDialog ="openCenterDialog"></member-card>
    </el-dialog>

    <el-dialog
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <h3 style="text-align: center">办卡成功</h3>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="goToPrint">打印小票预览</el-button>
    <el-button type="primary" @click="closeCenterDialog">确 定</el-button>
  </span>
    </el-dialog>
    <!--end-->
<!--私教课售卖-->
    <el-dialog :visible.sync="salePersonalVisible" title="私教课售卖" width="1200px" :before-close="handlePersonClose" :closeOnClickModal="false">
      <!--<personal-class v-bind:gymId ="gymId" v-bind:oneCardMessage ="oneCardMessage" v-on:affirmOrder="affirmOrder"></personal-class>-->
     <div class="group-msg-info personal-info clearfix">

      <div class="person-list">
      <el-tabs v-model="activePersonal" type="card" @tab-click="handleClickP">
        <el-tab-pane label="全部" name="all">
          <div class="class-list">
            <el-form :inline="true" :model="listQueryPersonP" class="demo-form-inline" style="padding: 10px 0;text-align: center">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQueryPersonP.keyword" placeholder="输入课程名称或教练名称查询" style="width: 200px;" size="mini">
                </el-input>
              </el-form-item>
              <el-button type="primary" class="el-icon-search" size="mini" style="margin-top:6px" @click="handleFilterP">查询</el-button>
            </el-form>
            <div class="data-list clearfix" >
              <ul>
                <li class="class-item" v-for="item in tableData" @click="selectClassDetails(item)">
                  <div class="mask">
                    <i class="el-icon-check"></i>
                  </div>
                  <h4>{{item.className}}</h4>
                  <p>课程时长：{{item.classTime}}分钟</p>
                  <p>总课时：{{item.classNumber}}课时</p>
                  <p>教练：{{item.classCoach}}</p>
                  <p class="price clearfix"><span class="fl-left">价格：</span><span class="fl-right num">￥{{item.classPrice}}</span></p>
                </li>
              </ul>
            </div>
            <div class="block" style="margin: 0;; text-align: center">
              <el-pagination @size-change="handleSizeChangeP" @current-change="handleCurrentChangeP" :current-page="listQueryPersonP.page" :page-sizes="[10,20,30,50]" :page-size="listQueryPersonP.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalP">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="门店课程" name="lineIn">
          <div class="class-list">
            <el-form :inline="true" :model="listQueryPersonP" class="demo-form-inline" style="margin: 10px auto;text-align: center">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQueryPersonP.keyword" placeholder="输入课程名称或教练名称查询" style="width: 200px;" size="mini">
                </el-input>
              </el-form-item>
              <el-button type="primary" class="el-icon-search" size="mini" style="margin-top:6px" @click="handleFilterP">查询</el-button>
            </el-form>
            <div class="data-list clearfix" >
              <ul>
                <li class="class-item" v-for="item in tableData" @click="selectClassDetails(item)">
                  <div class="mask">
                    <i class="el-icon-check"></i>
                  </div>
                  <h4>{{item.className}}</h4>
                  <p>课程时长：{{item.classTime}}分钟</p>
                  <p>总课时：{{item.classNumber}}课时</p>
                  <p>教练：{{item.classCoach}}</p>
                  <p class="price clearfix"><span class="fl-left">价格：</span><span class="fl-right num">￥{{item.classPrice}}</span></p>
                </li>
              </ul>
            </div>
            <div class="block" style="margin: 0;; text-align: center">
              <el-pagination @size-change="handleSizeChangeP" @current-change="handleCurrentChangeP" :current-page="listQueryPersonP.page" :page-sizes="[10,20,30,50]" :page-size="listQueryPersonP.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalP">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务号课程" name="lineOn">
          <div class="class-list">
            <el-form :inline="true" :model="listQueryPersonP" class="demo-form-inline" style="margin: 10px auto;text-align: center">
              <el-form-item style="margin-bottom: 0">
                <el-input v-model="listQueryPersonP.keyword" placeholder="输入课程名称或教练名称查询" style="width: 200px;" size="mini">
                </el-input>
              </el-form-item>
              <el-button type="primary" class="el-icon-search" size="mini" style="margin-top:6px" @click="handleFilterP">查询</el-button>
            </el-form>
            <div class="data-list clearfix" >
              <ul>
                <li class="class-item" v-for="item in tableData" @click="selectClassDetails(item)">
                  <div class="mask">
                    <i class="el-icon-check"></i>
                  </div>
                  <h4>{{item.className}}</h4>
                  <p>课程时长：{{item.classTime}}分钟</p>
                  <p>总课时：{{item.classNumber}}课时</p>
                  <p>教练：{{item.classCoach}}</p>
                  <p class="price clearfix"><span class="fl-left">价格：</span><span class="fl-right num">￥{{item.classPrice}}</span></p>
                </li>
              </ul>
            </div>
            <div class="block" style="margin: 0; text-align: center">
              <el-pagination @size-change="handleSizeChangeP" @current-change="handleCurrentChangeP" :current-page="listQueryPersonP.page" :page-sizes="[10,20,30,50]" :page-size="listQueryPersonP.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalP">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      </div>
       <!--左侧表单-->
      <div class="active-list fl-right">
        <div class="notActive" v-show="noActive">
          <p><i class="icon iconfont icon-icon-test"></i></p>
          <p class="font">请选择左侧课程</p>
        </div>
        <div class="one-class-msg" v-show="classForm">
          <el-form ref="addFormP" :model="addFormP" label-width="120px" :rules="addRulesP" class="form-container" size="mini">
            <el-form-item label="会员名称：" prop="name">
              <span>{{oneCardMessage.name}}</span>
              <span style="margin-left: 100px;">手机号：{{oneCardMessage.phone}}</span>
            </el-form-item>
            <el-form-item label="课程状态：" prop="classStatus">
              <h4 v-if="classDetails.classStatus == 0">门店课程</h4>
              <h4 v-else-if="classDetails.classStatus == 1">服务号课程</h4>
            </el-form-item>
            <div class="hr"></div>
            <el-form-item label="课程名称：" prop="className">
              <span>{{classDetails.className}}</span>
            </el-form-item>
            <el-form-item label="课程价格：" prop="classPrice">
              <span>￥{{classDetails.classPrice}}</span>
            </el-form-item>
            <el-form-item label="包含课时：" prop="classNumber">
              <span>{{classDetails.classNumber}}课时</span>
            </el-form-item>
            <el-form-item label="购买数量：" prop="amount" >
              <el-input v-model.number="addFormP.amount" style="width: 111px;" @change="amountNumberP()"></el-input>
            </el-form-item>
            <el-form-item label="赠送课时：" prop="giveClassNumber">
              <el-input v-model.number="addFormP.giveClassNumber" style="width: 111px;" @change="amountNumberP()" placeholder="0"></el-input>
            </el-form-item>
            <el-form-item label="合计课时：" prop="totalNumber">
              <span>{{totalNumber}}课时</span>
            </el-form-item>
            <div v-if="classDetails.classStatus == 1">
              <!--1 线下课程 上课教练必选-->
              <el-form-item label="上课教练：" prop="coachId">
                <el-select v-model="addFormP.coachId" placeholder="请选择" filterable>
                  <el-option v-for="item in coachList" :key="item.coachId" :label="item.name" :value="item.coachId"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!--0 是线上课程-->
            <div v-else-if="classDetails.classStatus == 0">
              <el-form-item label="上课教练：" prop="coachName">
                <span>{{classDetails.classCoach}}</span>
              </el-form-item>
            </div>

            <el-form-item label="销售教练：" prop="saleCoachId">
              <el-select v-model="addFormP.saleCoachId" placeholder="请选择" filterable>
                <el-option v-for="item in coachList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="售卖价格：" prop="classPrice">
              <span>￥{{salePrice}}</span>
              <el-input v-model.number="addFormP.classPrice" type="hidden"></el-input>
            </el-form-item>
            <el-form-item label="优惠：" prop="discountFee">
              <el-input v-model="addFormP.discountFee" style="width: 111px;" @change="discountPriceP" :disabled="disabledFee" placeholder="0"></el-input>
            </el-form-item>

            <el-form-item label="应收金额：" prop="amountPrice">
              <span style="color:red;margin-right: 15px;">￥{{amountPrice}}</span>
              <el-checkbox v-model="addFormP.isPresent" @change="isPresentChange" style="width: 60px;">赠课</el-checkbox>
            </el-form-item>
            <el-form-item label="合同编号：" prop="contractNo">
              <el-input v-model="addFormP.contractNo"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note">
              <el-input type="textarea" v-model="addFormP.note" style="width: 250px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="goToAffirmOrder">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>


     </div>
    </el-dialog>
   <!--end-->
    <!--团课预约-->
    <el-dialog :visible.sync="saleGroupVisible" title="团课预约" width="1200px" :before-close="handleGroupClose" :closeOnClickModal="false">
      <div class="group-msg-info clearfix">
        <div class="class-list fl-left" style="width: 55%;">
          <div class="date-list clearfix">
            <span class="arrow-left fl-left" @click="selectGroupFirst"><i class="el-icon-d-arrow-left"></i></span>
            <ul class="date-ul fl-left">
              <li class="date-item fl-left actived" data-id="one">
                <p class="weeked">{{group.week0}}</p>
                <p class="time">{{group.day0}}</p>
              </li>
              <li class="date-item fl-left" data-id="tow">
                <p class="weeked">{{group.week1}}</p>
                <p class="time">{{group.day1}}</p>
              </li>
              <li class="date-item fl-left" data-id="three">
                <p class="weeked">{{group.week2}}</p>
                <p class="time">{{group.day2}}</p>
              </li>
              <li class="date-item fl-left" data-id="four">
                <p class="weeked">{{group.week3}}</p>
                <p class="time">{{group.day3}}</p>
              </li>
              <li class="date-item fl-left" data-id="five">
                <p class="weeked">{{group.week4}}</p>
                <p class="time">{{group.day4}}</p>
              </li>
              <li class="date-item fl-left" data-id="sex">
                <p class="weeked">{{group.week5}}</p>
                <p class="time">{{group.day5}}</p>
              </li>
              <li class="date-item fl-left" data-id="seven">
                <p class="weeked">{{group.week6}}</p>
                <p class="time">{{group.day6}}</p>
              </li>
            </ul>
            <span class="arrow-right fl-left" @click="selectGroupNext"><i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="list-container">
            <!--第一天-->
            <div class="data-list" id="one">
              <ul class="clearfix">
                <li class="class-item fl-left" v-for="item in groupListData0" @click="selectGroupDetails(item)">
                  <div class="mask">
                    <i class="el-icon-check"></i>
                  </div>
                  <div class="row1 clearfix">
                    <h4 class="fl-left">{{item.className}}</h4>
                    <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                    <span class="price fl-right" v-else>{{item.classPrice}}</span>
                  </div>
                  <p>课程时长：{{item.classTime}}分钟</p>
                  <p>时间：{{item.briefBeginTime}}</p>
                  <p>教练：{{item.classCoach}}</p>
                  <p class="lastrow">剩余名额：
                    <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                    <span v-else >不限制</span>
                  </p>
                </li>
              </ul>
            </div>
          <!--end-->
          <div class="data-list" id="tow">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData1" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->
          <div class="data-list" id="three">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData2" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->
          <div class="data-list" id="four">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData3" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->
          <div class="data-list" id="five">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData4" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->
          <div class="data-list" id="sex">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData5" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->
          <div class="data-list" id="seven">
            <ul class="clearfix">
              <li class="class-item fl-left" v-for="item in groupListData6" @click="selectGroupDetails(item)">
                <div class="mask">
                  <i class="el-icon-check"></i>
                </div>
                <div class="row1 clearfix">
                  <h4 class="fl-left">{{item.className}}</h4>
                  <span class="price fl-right" v-if="item.classPrice == 0">免费</span>
                  <span class="price fl-right" v-else>{{item.classPrice}}</span>
                </div>
                <p>课程时长：{{item.classTime}}分钟</p>
                <p>时间：{{item.briefBeginTime}}</p>
                <p>教练：{{item.classCoach}}</p>
                <p class="lastrow">剩余名额：
                  <span v-if="item.spareNumber >= 0">{{item.spareNumber}}</span>
                  <span v-else >不限制</span>
                </p>
              </li>
            </ul>
          </div>
          <!--end-->

        </div>
        </div>
        <div class="active-list fl-right" style="margin-top:0;border-top:none;">
          <div class="notActive"  v-show="noActive">
            <p><i class="icon iconfont icon-icon-test"></i></p>
            <p class="font">请选择左侧课程</p>
          </div>
          <div class="one-class-msg" v-show="groupForm">
            <el-form ref="addGroupForm" :model="addGroupForm" label-width="120px" class="form-container" size="mini"  :rules="addRulesG">
              <el-form-item label="会员名称：" prop="name">
                <span>{{oneCardMessage.name}}</span>
                <span style="margin-left: 100px;">手机号：{{oneCardMessage.phone}}</span>
              </el-form-item>
              <el-form-item label="课程时间：" prop="yearBeginTime">
                <h4>{{classDetails.yearBeginTime}}&nbsp;{{currentWeek}}&nbsp;{{classDetails.briefBeginTime}}</h4>
              </el-form-item>
              <div class="hr"></div>
              <el-form-item label="课程名称：" prop="className">
                <span>{{classDetails.className}}</span>
              </el-form-item>
              <el-form-item label="课程价格：" prop="classPrice">
                <span style="color: red;">￥{{classDetails.classPrice}}</span>
              </el-form-item>
              <el-form-item label="包含课时：" prop="classTime">
                <span>1课时</span>
              </el-form-item>
              <div v-if="classDetails.classPrice ==0">
                <el-form-item label="预约数量：" prop="amount">
                  <el-input v-model.number="addGroupForm.amount" style="width: 111px;"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="上课教练：" prop="coachName">
                <span>{{classDetails.classCoach}}</span>
              </el-form-item>
              <div v-if="classDetails.classPrice !=0">
                <el-form-item label="销售教练：" prop="saleCoachId">
                  <el-select v-model="addGroupForm.saleCoachId" placeholder="请选择" filterable>
                    <el-option v-for="item in coachList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="售卖价格：" prop="classPrice">
                  <span>￥{{classDetails.classPrice}}</span>
                  <el-input v-model="addGroupForm.classPrice" type="hidden"></el-input>
                </el-form-item>
                <el-form-item label="优惠：" prop="discountFee">
                  <el-input v-model.number="addGroupForm.discountFee" style="width: 111px;" @change="discountPriceG()" :disabled="disabledFee"></el-input>
                </el-form-item>

                <el-form-item label="应收金额：" prop="remark">
                  <span style="color:red">￥{{amountPrice}}</span>
                  <el-checkbox v-model="addGroupForm.isPresent" @change="isPresentGroupChange" style="width: 60px;">赠课</el-checkbox>
                </el-form-item>
                <el-form-item label="合同编号：" prop="contractNo">
                  <el-input v-model="addGroupForm.contractNo"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="备注：" prop="note">
                <el-input type="textarea" v-model="addGroupForm.note" style="width: 250px;"></el-input>
              </el-form-item>
              <el-form-item>
                <div v-if="classDetails.classPrice ==0">
                  <el-button type="primary" @click="groupNoMoneyOrder">预约</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" @click="goToAffirmGroupOrder">预约</el-button>
                </div>
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
        <span class="goback"><el-button size="small" plain icon="el-icon-caret-left" @click="closeAffirmVisible">返回</el-button></span>
        <span class="title" v-if="classKind == 2">私教课售卖</span>
        <span class="title" v-else-if="classKind == 3">团课预约</span>
      </header>
     <div class="clearfix affirm-container">
       <div class="class-list fl-left" style="width: 55%;">
         <dl>
           <dt class="item-title"><span class="item-name">商品名称</span><span class="item-name">数量</span><span class="item-name">价格</span></dt>
           <dd class="item-title"><span class="item-name">{{classDetails.className}}</span>
             <span class="item-name" v-if="classKind == 2">{{totalNumber}}课时</span>
             <span class="item-name" v-else-if="classKind == 3">1课时</span>
             <span class="item-name">￥{{salePrice}}</span></dd>
         </dl>
       </div>
       <div class="active-list fl-right" style="margin-top: 0">
         <dl>
           <dt class="item-title"><span class="item-name" style="width: 50%;">应收金额</span><span class="item-name" style="width: 50%;">￥{{amountPrice}}</span></dt>
         </dl>
         <div class="pay-info">
           <p class="user-msg">会员信息：{{oneCardMessage.name}}（{{oneCardMessage.phone}}）</p>
           <p class="pay-mode clearfix"><span class="payfont">支付方式：</span>
             <el-radio-group v-model="payMethod">
             <el-radio v-for="item in payMethodList" :key="item.id" :label="item.id" :value="item.id">{{item.value}}</el-radio>
           </el-radio-group>
           </p>
           <el-button v-if="classKind == 2" type="primary" @click="addPersonalOrder">立即收款</el-button>
           <el-button v-else-if="classKind == 3" type="primary" @click="addGroupClassOrder">立即收款</el-button>
         </div>
       </div>
     </div>

    </el-dialog>
    <!--end-->
    <!--支付成功-->
    <el-dialog
      :visible.sync="payDialogVisible"
      width="25%"
      center
    class="paySuccessDialog">
      <header class="success-header">
        <i class="el-icon-success"></i>
        <span>支付成功</span>
      </header>
      <dl class="pay-success-info">
        <dd class="info-item"><span>购买日期：</span><span>{{orderSuccess.createTime}}</span></dd>
        <dd class="info-item"><span>操作人：</span><span>{{orderSuccess.operator}}</span></dd>
        <dd class="info-item"><span>会员：</span><span>{{orderSuccess.name}}</span></dd>
        <dd class="info-item"><span>合同编号：</span><span>{{orderSuccess.contractNo}}</span></dd>
        <dd class="ddhr"></dd>
        <dd class="info-item">
          <span v-if="classKind == 2">私教课名称：</span>
          <span v-else-if="classKind == 3">团课名称：</span>
          <span>{{orderSuccess.tradeDetail}}</span></dd>
        <dd class="info-item" v-if="classKind == 2"><span>购买数量：</span><span>购买{{orderSuccess.buyClassNumber}}课时，赠送{{orderSuccess.giveClassNumber}}课时</span></dd>
        <dd class="info-item" v-else-if="classKind == 3"><span>购买数量：</span><span>{{orderSuccess.amount}}课时</span></dd>
        <dd class="info-item"><span>实收金额：</span><span>￥{{orderSuccess.orderFee}}</span></dd>
        <dd class="info-item"><span>支付方式：</span>
          <span v-if="orderSuccess.payMethod == 1">微信支付</span>
          <span v-if="orderSuccess.payMethod == 2">支付宝支付</span>
          <span v-if="orderSuccess.payMethod == 3">现金支付</span>
          <span v-if="orderSuccess.payMethod == 4">pos机支付</span>
          <span v-if="orderSuccess.payMethod == 5">银联支付</span>
          <span v-if="orderSuccess.payMethod == 6">其他方式支付</span>
        </dd>
        <dd class="info-item"><span>订单号：</span><span>{{orderSuccess.tradeNo}}</span></dd>
        <dd class="info-item"><span>备注：</span><span>{{orderSuccess.note}}</span></dd>
      </dl>
      <div class="btn-box">
        <el-button type="primary" @click="goToClassPrint">打印小票预览</el-button>
        <el-button v-if="classKind == 2" type="primary" @click="confirmPersonalOrder">确 定</el-button>
        <el-button v-else-if="classKind == 3" type="primary" @click="confirmGroupOrder">确 定</el-button>
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
  import buyRecord from './BuyRecord.vue';
  import orderList from './OrderList.vue';
  import memberCard from './MemberCard.vue';
  import groupClass from './GroupClass.vue';
  const Axios = new AXIOS();
  export default {
    name:"signInOut",
    components:{
      buyRecord,
      orderList,
      memberCard,
      groupClass,
    },
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
        payDialogVisible:false,
        token: '',
        gymId: '',
        resultList: false,
        resultListOut:false,
        resultListClass:false,
        memberInfoStatus: false,
        memberInfoStatusOut:false,
        saleClassStatusOut:false,
        affirmClassVisible:false,//确认订单
        saleGroupVisible:false,//团课预约
        salePersonalVisible:false,//私教课售卖
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
        orderList:[],//预约记录
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
        payMethodList: [{
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
        payMethod:3,
        usrGymList: [],
        sellGymList: [],
        cardList: [],
        memberList: [],
        saleList: [],
        worth: '',
        isBuy: '是',
        filterGymId:'',
        cardType:'',
        classKind:null,
        listQuerySaleClass:{
          keyword:'',
          page:0,
          limit:0,
        },
        total:0,

        //私教课售卖
        tradeId:'',//购买成功返回商品id
        resultMemberId:'',//购买成功返回会员id
        orderSuccess:{},
        disabledFee:false,
        activePersonal:"all",
        noActive:true,
        classForm:false,
        listQueryPersonP:{
          keyword:'',
          page:1,
          limit:10,
          classStatus:null,
        },
        coachList:[],
        tableData:[],
        totalNumber:0, //合计课时
        totalP:0,
        amountPrice:0, //价格总计
        salePrice:0, //售卖价格
        classDetails:{},
        addFormP:{
          amount:'',
          saleCoachId:'',
          coachId:'',
          discountFee:'',
          note:'',
          giveClassNumber:'',
          contractNo:'',
          isPresent:false,
          classPrice:''//自定义价格
        },
        addRulesP: {
          amount: [{
            required: true,
            validator: valid.checkNumber,
            trigger: 'blur'
          }],
          saleCoachId:[{
            required: true,
            message: '请选择销售教练',
            trigger: 'change'
          }],
          classPrice:[{
            required: false,
            validator: valid.checkDiscountPrice,
          }],
          discountFee:[{
            required: false,
            validator: valid.checkDiscountFee,
            trigger: 'change'
          }],
        },

        //团课预约
        activeWeek:'mon',
        groupListData0:[],
        groupListData1:[],
        groupListData2:[],
        groupListData3:[],
        groupListData4:[],
        groupListData5:[],
        groupListData6:[],
        listQueryGroup:{
          offset:0,
        },
        group:{
          week0:'',
          week1:'',
          week2:'',
          week3:'',
          week4:'',
          week5:'',
          week6:'',

          day0:'',
          day1:'',
          day2:'',
          day3:'',
          day4:'',
          day5:'',
          day6:'',
        },
        addRulesG: {
          amount: [{
            required: true,
            validator: valid.checkNumber,
            trigger: 'blur'
          }],
          saleCoachId:[{
            required: true,
            message: '请选择销售教练',
            trigger: 'change'
          }],
          classPrice:[{
            required: false,
            validator: valid.checkDiscountPrice,
          }],
          discountFee:[{
            required: false,
            validator: valid.checkDiscountFee,
            trigger: 'change'
          }],
        },
        addGroupForm:{
          saleCoachId:'',
          contractNo:'',
          note:'',
          discountFee:'',
          amount:'',
          isPresent:'',
          classPrice:''
        },
        groupForm:false,
        groupClassDetails:{},
        currentWeek:'',//当前点击的日期
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
      handleDom(){
          $(".data-list").on("click",".class-item",function () {
            $(".class-item").removeClass("actived");
            $(this).addClass("actived");
          });
          $(".group-msg-info").on("click",".date-item",function () {
             let data = $(this).attr("data-id");
             $(this).siblings(".date-item").removeClass("actived");
             $(this).addClass("actived");
             $(".list-container .data-list").hide();
             $("#"+data).show();
          })
      },

      handlePersonClose(){
        this.salePersonalVisible = false;
      },
      handleGroupClose(){
        this.saleGroupVisible = false;
      },
      salePersonalClass(){
        this.salePersonalVisible = true;
        this.noActive = true;
        this.classForm = false;
        this.classDetails = '';
        $(".personal-info .class-item").removeClass("actived");
        this.listQueryPersonP.keyword = '';
        this.activePersonal ='all';
        this.listQueryPersonP.classStatus = '';
        this.getPersonClassP();
      },
      saleGroupClass(){
        this.saleGroupVisible = true;
        this.listQueryGroup.offset = 0;
        $(".group-msg-info .date-item").removeClass("actived");
        $(".group-msg-info .date-item:eq(0)").addClass("actived");
        $(".list-container .data-list").hide();
        $("#one").show();
        this.getGroupClassData();
      },
      goToPrint(){
        this.$refs.memberCard.routerPrint();
      },
      openCenterDialog(){
        this.centerDialogVisible = true
      },
      closeCenterDialog(){
        this.centerDialogVisible = false
      },
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
        this.listQuery.keyword = '';
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
        this.listQueryOut.keyword = '';
        this.selectOutDetails(id);
        this.resultListOut = false;
        this.memberInfoStatusOut = true;
        this.quitDisabled = false;
        this.hasGoOut = false;
        this.quitCheckedList=[];
      },
      saleClassMsg(item){
        this.listQueryClass.keyword = '';
        this.selectDetails(item.id);
        this.resultListClass = false;
        this.saleClassStatusOut = true;
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
        this.saleClassStatusOut = false;
        this.hideClass();
        global_.$options.exportSession(this.getMemberClassList);
        this.$axios({
          url: this.path + 'sign/member/list',
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
//      关闭售卖卡课会员
      hideSaleClassStatus(){
          this.saleClassStatusOut = false;
          this.oneCardMessage = '';
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
      memberSetCard(){
        console.log(this.oneCardMessage);
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

      handleCardClose(){
        this.addCardVisible = false;
      },


//      私教课售卖
      amountNumberP(){
        this.totalNumber = parseInt(((this.classDetails.classNumber) * (this.addFormP.amount)) + (this.addFormP.giveClassNumber));  //总课时
        this.amountPrice = ((this.classDetails.classPrice)*(this.addFormP.amount)) - this.addFormP.discountFee; //总价格
        this.salePrice = (this.classDetails.classPrice)*(this.addFormP.amount)  //售卖价格
        this.addFormP.classPrice = this.salePrice;
      },
      discountPriceP(){
        this.amountPrice = ((this.classDetails.classPrice)*(this.addFormP.amount)) - this.addFormP.discountFee;
      },
      getCoachListP() {
        if(this.gymId == null){
          this.gymId = '';
        }
        this.$axios({
          url: this.path + 'staff/coach/list?gymId='+this.gymId,
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
      handleClickP(tab,event){
        var index = tab.index;
        if(index == 0){
          this.listQueryPersonP.classStatus = '';
          this.getPersonClassP();

        }else if(index == 1){
          this.listQueryPersonP.classStatus = 1;
          this.getPersonClassP();

        }else if(index == 2){
          this.listQueryPersonP.classStatus = 0;
          this.getPersonClassP();

        }
      },
      handleSizeChangeP(val) {
        this.listQueryPersonP.limit = val;
        this.getPersonClassP();
      },
      handleCurrentChangeP(val) {
        this.listQueryPersonP.page = val;
        this.getPersonClassP();
      },
      handleFilterP(){
        this.getPersonClassP();
      },
      getPersonClassTotalP(){
        this.$axios({
          url: this.path + 'resource/class/count?classKind=2&gymId='+this.gymId,
          method: 'get',
          params: this.listQueryPersonP,
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
            this.totalP = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getPersonClassP(){
        global_.$options.exportSession(this.getPersonClassP);
        this.$axios({
          url: this.path + 'resource/class/list?classKind=2&gymId='+this.gymId,
          method: 'get',
          params: this.listQueryPersonP,
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
            if (res.data != null) {
              this.getPersonClassTotalP();
              this.getCoachList();
              this.handleDom();
              this.tableData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectClassDetails(item){
        this.classKind = 2;
        this.noActive = false;
        this.classForm = true;
        this.classDetails = item;
        this.addFormP.amount = '';
        this.addFormP.giveClassNumber= '';
        this.addFormP.saleCoachId = '';
        this.addFormP.contractNo ='';
        this.addFormP.note ='';
        this.addFormP.coachId = '';
        this.totalNumber = 0;
        this.addFormP.discountFee = 0;
        this.addFormP.isPresent = false;
        this.salePrice = 0;
        this.addFormP.classPrice =  this.salePrice;
        this.amountPrice = 0;
        this.getCoachListP();
      },
      goToAffirmOrder(){
        this.$refs.addFormP.validate((valid) => {
          if (valid) {
            this.salePersonalVisible = false;
            this.affirmClassVisible = true;
          }
        });
      },
      isPresentChange(){
        if(this.addFormP.isPresent == true){
          this.addFormP.discountFee = 0;
          this.salePrice = 0;
          this.amountPrice = 0;
          this.disabledFee = true;
        }else{
          this.amountPrice = ((this.classDetails.classPrice)*(this.addFormP.amount)) - this.addFormP.discountFee; //总价格
          this.salePrice = (this.classDetails.classPrice)*(this.addFormP.amount)  //售卖价格
          this.disabledFee = false;
        }
      },
      addPersonalOrder(){
        this.$refs.addFormP.validate((valid) => {
          if(valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.addFormP.isPresent == true){
                this.addFormP.isPresent = 1
              }else if(this.addFormP.isPresent == false){
                this.addFormP.isPresent = 0
              }
              if(this.addFormP.coachId == ''){
                this.$axios({
                  url: this.path + 'class/personal/book',
                  method: 'POST',
                  data: {
                    classId:this.classDetails.id,
                    memberId: this.oneCardMessage.id,
                    saleCoachId: this.addFormP.saleCoachId,
                    contractNo: this.addFormP.contractNo,
                    note: this.addFormP.note,
                    discountFee: this.addFormP.discountFee,
                    payMethod: this.payMethod,
                    amount: this.addFormP.amount,
                    isPresent: this.addFormP.isPresent,
                    giveClassNumber: this.addFormP.giveClassNumber,
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
                        message: '购买成功',
                        type: 'success'
                      });
                      this.orderSuccess = res.data.order;
                      this.$refs['addFormP'].resetFields();
                      this.tradeId = res.data.order.tradeId;
                      this.resultMemberId = res.data.order.userId;
                      this.affirmClassVisible = false;
                      this.payDialogVisible = true;
                      this.activeRecordName = "second";
                      this.$refs.buyRecord.getPersonalData();
                      this.$refs.buyRecord.getPriceTotal();
                      this.payMethod = 3;
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
              }else{
                this.$axios({
                  url: this.path + 'class/personal/book',
                  method: 'POST',
                  data: {
                    classId:this.classDetails.id,
                    memberId: this.oneCardMessage.id,
                    saleCoachId: this.addFormP.saleCoachId,
                    contractNo: this.addFormP.contractNo,
                    note: this.addFormP.note,
                    discountFee: this.addFormP.discountFee,
                    payMethod: this.payMethod,
                    amount: this.addFormP.amount,
                    isPresent: this.addFormP.isPresent,
                    coachId: this.addFormP.coachId,
                    giveClassNumber: this.addFormP.giveClassNumber,
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
                        message: '购买成功',
                        type: 'success'
                      });
                      this.orderSuccess = res.data.order;
                      this.$refs['addFormP'].resetFields();
                      this.tradeId = res.data.order.tradeId;
                      this.resultMemberId = res.data.order.userId;
                      this.affirmClassVisible = false;
                      this.payDialogVisible = true;
                      this.activeRecordName = "second";
                      this.$refs.buyRecord.getPersonalData();
                      this.$refs.buyRecord.getPriceTotal();
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
      closeAffirmVisible(){
        this.classDetails = '';
        this.noActive = true;
        this.classForm = false;
        this.groupForm = false;
        $(".data-list .class-item").removeClass("actived");
        this.affirmClassVisible = false;
      },
      confirmPersonalOrder(){
        this.payDialogVisible = false;
      },

      goToClassPrint(){
        sessionStorage.setItem("tradeId",this.tradeId);
        sessionStorage.setItem("memberId",this.resultMemberId)
        this.$router.push('/print');
      },


      //团课列表查询
      getGroupClassData(){
        global_.$options.exportSession(this.getGroupClassData);
        this.$axios({
          url: this.path + 'class/schedule/groupclass?gymId='+this.gymId,
          method: 'get',
          params: this.listQueryGroup,
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
            if (res.data.code == 100000) {
              this.getCoachList(this.gymId);
              this.handleDom();
              this.group.week0 = res.data.result[0].week;
              this.group.week1 = res.data.result[1].week;
              this.group.week2 = res.data.result[2].week;
              this.group.week3 = res.data.result[3].week;
              this.group.week4 = res.data.result[4].week;
              this.group.week5 = res.data.result[5].week;
              this.group.week6 = res.data.result[6].week;

              this.group.day0 = res.data.result[0].day;
              this.group.day1 = res.data.result[1].day;
              this.group.day2 = res.data.result[2].day;
              this.group.day3 = res.data.result[3].day;
              this.group.day4 = res.data.result[4].day;
              this.group.day5 = res.data.result[5].day;
              this.group.day6 = res.data.result[6].day;

              this.groupListData0 = res.data.result[0].schedules;
              this.groupListData1 = res.data.result[1].schedules;
              this.groupListData2 = res.data.result[2].schedules;
              this.groupListData3 = res.data.result[3].schedules;
              this.groupListData4 = res.data.result[4].schedules;
              this.groupListData5 = res.data.result[5].schedules;
              this.groupListData6 = res.data.result[6].schedules;

              this.currentWeek = this.group.week0;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectGroupFirst(){
        this.listQueryGroup.offset = 0
        this.getGroupClassData();
      },
      selectGroupNext(){
        this.listQueryGroup.offset = this.listQueryGroup.offset + 1;
        this.getGroupClassData();
      },
      selectGroupDetails(item){
        var week = $(".date-list .actived").find(".weeked").text();
        this.currentWeek = week;
        this.classKind = 3;
        this.classDetails = item;
        this.addGroupForm.classPrice = this.classDetails.classPrice;
        this.noActive = false;
        this.groupForm = true;
        this.getCoachListP();
        this.amountPrice = this.classDetails.classPrice;
        this.addGroupForm.amount = '';
        this.addGroupForm.saleCoachId = '';
        this.addGroupForm.contractNo ='';
        this.addGroupForm.note ='';
        this.addGroupForm.discountFee = 0;
        this.addGroupForm.isPresent = false;
      },
      groupNoMoneyOrder(){
        this.$refs.addGroupForm.validate((valid) => {
          if(valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'class/schedule/book',
                method: 'POST',
                data: {
                  classScheduleId:this.classDetails.id,
                  memberId: this.oneCardMessage.id,
                  note: this.addGroupForm.note,
                  amount: this.addGroupForm.amount,
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
                      message: '预约成功',
                      type: 'success'
                    });
                    this.$refs['addGroupForm'].resetFields();
                    this.saleGroupVisible = false;
                    this.activeRecordName = "three";
                    this.$refs.orderList.getData();
                    this.$refs.orderList.getPriceTotal();
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
      addGroupClassOrder(){
        this.$refs.addGroupForm.validate((valid) => {
          if(valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(this.addGroupForm.isPresent == true){
                this.addGroupForm.isPresent = 1
              }else if(this.addGroupForm.isPresent == false){
                this.addGroupForm.isPresent = 0
              }
                this.$axios({
                  url: this.path + 'class/schedule/book',
                  method: 'POST',
                  data: {
                    classScheduleId:this.classDetails.id,
                    memberId: this.oneCardMessage.id,
                    saleCoachId: this.addGroupForm.saleCoachId,
                    contractNo: this.addGroupForm.contractNo,
                    note: this.addGroupForm.note,
                    discountFee: this.addGroupForm.discountFee,
                    payMethod: this.payMethod,
                    amount: this.addGroupForm.amount,
                    isPresent: this.addGroupForm.isPresent,
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
                        message: '预约成功',
                        type: 'success'
                      });
                      this.orderSuccess = res.data.order;
                      this.$refs['addGroupForm'].resetFields();
                      this.tradeId = res.data.order.tradeId;
                      this.resultMemberId = res.data.order.userId;
                      this.affirmClassVisible = false;
                      this.saleGroupVisible = false;
                      this.payDialogVisible = true;
                      this.activeRecordName = "three";
                      this.$refs.orderList.getData();
                      this.$refs.orderList.getPriceTotal();
                      this.payMethod = 3;
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
      goToAffirmGroupOrder(){
        this.$refs.addGroupForm.validate((valid) => {
          if (valid) {
            this.salePrice = this.classDetails.classPrice;
            this.saleGroupVisible = false;
            this.affirmClassVisible = true;
          }
        });
      },
      isPresentGroupChange(){
        this.amountPrice = this.classDetails.classPrice - this.addGroupForm.discountFee;
      },
      confirmGroupOrder(){
        this.payDialogVisible = false;
      },
      isPresentGroupChange(){
        if(this.addGroupForm.isPresent == true){
          this.addGroupForm.discountFee = 0;
          this.amountPrice = 0;
          this.disabledFee = true;
        }else{
          this.amountPrice = this.classDetails.classPrice; //总价格
          this.salePrice = (this.classDetails.classPrice)*(this.addGroupForm.amount)  //售卖价格
          this.disabledFee = false;
        }
      },
      discountPriceG(){
          this.amountPrice = (this.classDetails.classPrice) - this.addGroupForm.discountFee;
      },
    }
  }
</script>

<style>
  .person-list{
    width:55%;
    float: left;
  }
  .sign-contianer > .el-tabs,
  .sign-list > .el-tabs{
    height:600px;
    overflow: auto;
  }
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
  .el-tabs__item:hover{
    color: #f9690e;
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
  .list-container .data-list{
    display: none;
  }
  .list-container .data-list:first-child{
    display: block;
  }
</style>
