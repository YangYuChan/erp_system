<template>
  <div class="wrapper">
    <!--<v-header></v-header>-->
    <!--头部-->
    <div class="header clearfix">
      <div class="header-tit">
        <span @click="linkToModule" class="logo-link"><img src="../../../static/img/logo.png" class="logo"></span>
      </div>
      <div class="user-info">
        <span id="time"></span>
        <span class="username">&nbsp;欢迎您，{{user}}</span>
        <el-badge :value="unReadTotal" class="item">
          <span class="new-msg" id="advices" @click.prevent="messageShow"><i
            class="icon iconfont icon-tixing"></i></span>
        </el-badge>

        <span class="exit" @click="logout"><i class="icon iconfont icon-exit"></i></span>
      </div>
    </div>
    <!--菜单-->
    <v-sidebar></v-sidebar>
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="message-container">
      <header class="message-title">
        <a href="javascript:;" class="close" @click.prevent="closeMessage"><i class="icon iconfont icon-delete"></i></a>
        <div class="title-wrapper clearfix">
          <div class="title-left clearfix">
            <div class="notice">
              <span><i class="icon iconfont icon-tixing"></i></span>
              <a href="javascript:;" class="msg-down" id="noticeTit" @click.prevent="noticeType">
                <span class="current">通知</span>
                <i class="icon iconfont icon-arrow-down"></i>
              </a>
              <ul class="ms-type" id="noticeType">
                <li><a href="javacript:;" class="notice-type" @click.prevent="filterAll()"><span class="font">通知</span></a>
                </li>
                <li><a href="javacript:;" class="notice-type" @click.prevent="filterUnRead()">
							<span v-if="unReadTotal == 0">
								<span class="font">未读消息</span>
							</span>
                  <span v-else>
								<el-badge is-dot class="item"><span class="font">未读消息</span></el-badge>
							</span>
                </a></li>
                <li><a href="javacript:;" class="notice-type" @click.prevent="filterRead"><span class="font">已读消息</span></a>
                </li>
              </ul>
            </div>
            <div class="more-operate">
              <a href="javascript:;" id="moreOperate">
                <i class="icon iconfont icon-more"></i>
              </a>
              <ul class="ms-operate" id="operateList">
                <li>
                  <a href="javascript:;" @click.prevent="setAllRead()">
                    <i class="icon iconfont icon-right"></i>
                    <span class="font">标记全部已读</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;" @click.prevent="delAllRead()">
                    <i class="icon iconfont icon-remove"></i>
                    <span class="font">清空全部已读</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div class="message-wrapper">
        <div class="message-list-wrapper">
          <div class="message-list">
            <ul class="messages">
              <li class="message-item" v-for="item in noticeListData" @click.prevent="selectDetails(item.id)">
                <div class="send-info">
                  <span class="sender">来自：{{item.author}}</span>
                  <span class="send-time">{{item.createTime}}</span>
                  <a href="javascript:;" @click.stop="delNotice(item.id)"><i class="icon iconfont icon-delete"></i></a>
                </div>
                <div class="send-content">
                  <div class="intro">
									<span class="msg-type" v-if="item.isRead == 0">
										<el-badge is-dot class="item">【{{item.title}}】</el-badge>
									</span>
                    <span class="msg-type" v-else>
										【{{item.title}}】
									</span>
                    <a href="javascript:;" id="msgIntro">
                      {{item.intro}}
                    </a>
                  </div>

                </div>
              </li>
            </ul>
            <!--<div class="page-block" v-if="noticeListData != null">
                          <el-pagination @size-change="handleSizeNoticeChange" @current-change="handleCurrentNoticeChange" :current-page="listNoticeQuery.page" :page-sizes="[10,20,30,50]" :page-size="listNoticeQuery.limit" layout="prev, pager, next" :total="noticeTotal">
                          </el-pagination>
                      </div>-->
          </div>
        </div>
        <div class="message-content" v-if="detailsNoticeData != null">
          <div class="content-panel" v-if="detailsNoticeData.list.type==0">
            <div class="msg-correlation">
              <span class="sender msg-type">【{{detailsNoticeData.list.title}}】</span>
              <span style="color:#999">({{detailsNoticeData.list.createTime}})</span>
            </div>
            <div class="msg-content">
              {{detailsNoticeData.list.context}}
            </div>
            <p class="infomsg">
              课程名称：{{detailsNoticeData.className}}
            </p>
            <p class="infomsg">
              上线时间：<span style="color:#999">{{detailsNoticeData.classTime}}</span>
            </p>
            <p class="infomsg">
              审核时间：<span style="color:#999">{{detailsNoticeData.checkTime}}</span>
            </p>
            <div v-if="detailsNoticeData.list.status==2">
              <p class="infomsg">
                失败原因：{{detailsNoticeData.errorInfo}}
              </p>
              <p class="infomsg">
                {{detailsNoticeData.info}}
              </p>
            </div>
          </div>
          <div class="content-panel" v-else-if="detailsNoticeData.list.type==1">
            <div class="msg-correlation">
              <span class="sender msg-type">【{{detailsNoticeData.list.title}}】</span>
              <span style="color:#999">({{detailsNoticeData.list.createTime}})</span>
            </div>
            <div class="msg-content">
              {{detailsNoticeData.list.context}}
            </div>
            <p class="infomsg">
              课程名称：{{detailsNoticeData.className}}
            </p>
            <p class="infomsg">
              售卖价格：{{detailsNoticeData.classPrice}}元
            </p>
            <p class="infomsg">
              购买时间：<span style="color:#999">{{detailsNoticeData.list.createTime}}</span>
            </p>
              <p class="infomsg">
                {{detailsNoticeData.info}}
              </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="protocolVisible" title="未度体育场馆服务协议" width="600px" center :show-close="false"
               :closeOnClickModal="false">
      <v-protocol></v-protocol>
      <div class="reg-btn-group" style="margin-top: 20px;">
        <div class="checkbox-wrapper" style="margin-bottom: 10px;">
          <el-checkbox v-model="checked" class="remember">我已阅读并同意未度体育场馆协议</el-checkbox>
        </div>
        <div v-if="checked == true">
          <el-button type="primary" @click.native="handleSubmit" style="width: 100px;">确定</el-button>
        </div>
        <div v-else>
          <el-button style="width: 100px;" disabled="disabled">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  //	import vHeader from './Header.vue';
  import vSidebar from './Sidebar.vue';
  import vProtocol from './Protocol.vue';
  import AXIOS from '../../axios/axios'
  import global_ from '../../common/js/common'
  import valid from '../../common/js/validate'

  const Axios = new AXIOS();
  export default {
    components: {
//          vHeader,
      vSidebar,
      vProtocol
    },
    data() {
      return {
        path: global_.path,
        token: '',
        user: '',
        checked: false,
        noticeTotal: null,
        protocolVisible: null,
        isRead: '',  // 0 未读，1 已读
        echartStatus: 0,
        listNoticeQuery: {
          keyword: '',
          page: 1,
          limit: 10,
        },
        noticeListData: null,
        detailsNoticeData: null,
        unReadTotal: null,
        protocol: null,
        echartStatus:'',
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.user = sessionStorage.getItem('user');
        this.getMenu();
        this.getProtocol();
        this.echartStatus = sessionStorage.getItem("echartStatus"); //是否可以查看图表
        this.sysTime();
        this.getLength();
        this.noticeChange();
        window.setTimeout(this.getLength(), 30000);

      });
    },
    methods: {
      getMenu() {
        global_.$options.exportSession(this.getMenu);
        this.$axios({
          url: this.path + 'authority/lookover',
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
              this.echartStatus = res.data.authorities[0].status;
              sessionStorage.setItem("echartStatus",this.echartStatus);
              if(this.echartStatus == 1){
                this.$router.push({
                  path: '/main'
                });
              }else if(this.echartStatus == 0){
                this.$router.push({
                  path: '/index'
                });
              }
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getProtocol() {
        global_.$options.exportSession(this.getProtocol);
        this.$axios({
          url: this.path + 'erp/protocol/status',
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
            if (res.data.status == 0) {
              this.protocolVisible = true;
            } else if (res.data.status == 1) {
              this.protocolVisible = false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSubmit() {
        global_.$options.exportSession(this.handleSubmit);
        this.$axios({
          url: this.path + 'erp/protocol/confirm',
          method: 'post',
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
              this.protocolVisible = false;
            } else {
              this.protocolVisible = true;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      linkToModule() {
        if (this.echartStatus == 1) {
          this.$router.push({
            path: '/main'
          });
        } else if (this.echartStatus == 0) {
          this.$router.push({
            path: '/index'
          });
        }
      },
      sysTime() {
        var now = new Date(); //获取日期对象
        var year = now.getYear() + 1900; //获取的年
        var month = now.getMonth() + 1; //获得月份
        var date = now.getDate(); //获得日
        var time = year + "年" + month + "月" + date + "日 ";
        document.getElementById("time").innerHTML = time;
      },

      logout() {
        this.closeMessage();
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          _this.$router.push('/login');
        }).catch(() => {
        });
      },
      messageShow() {
        this.getNoticeData();
        $(".message-container").show();
      },
      closeMessage() {
        $(".message-container").hide();
      },
      noticeType() {
        $("#noticeType").show();
      },
      noticeChange() {
        $(".notice-type").on("click", function () {
          var type = $(this).find(".font").text();
          $(".msg-down").find(".current").text(type);
          $("#noticeType").hide();
        });
        $(".msg-down").on("click", function () {
          $("#operateList").hide();
        });

        $("#moreOperate").on("click", function () {
          $("#operateList").show();
          $("#noticeType").hide();
        });
        $("#operateList li").on("click", function () {
          $("#operateList").hide();
        });
        $(".messages").on("click", ".message-item", function () {
          $(this).find(".msg-type").html($(this).find(".msg-type").text());
          $(this).siblings(".message-item").removeClass("message-active");
          $(this).addClass("message-active");
          $(".message-content").show();
        });
        $(".ms-operate").on("blur", function (event) {
        });

      },

      filterUnRead() {
        this.isRead = 0;
        this.getNoticeData();
      },
      filterRead() {
        this.isRead = 1;
        this.getNoticeData();
      },
      filterAll() {
        this.isRead = '';
        this.getNoticeData();
      },
      getNoticeTotal() {
        global_.$options.exportSession(this.getNoticeTotal);
        this.$axios({
          url: this.path + 'message/count?isRead=' + this.isRead,
          method: 'get',
          params: this.listNoticeQuery,
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
            this.noticeTotal = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getNoticeData() {
        global_.$options.exportSession(this.getNoticeData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'message/list?isRead=' + this.isRead,
          method: 'get',
          params: this.listNoticeQuery,
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
              this.getNoticeTotal();
              this.noticeListData = res.data;
              this.listLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeNoticeChange(val) {
        this.listNoticeQuery.limit = val;
        this.getNoticeData();
      },
      handleCurrentNoticeChange(val) {
        this.listNoticeQuery.page = val;
        this.getNoticeData();
      },
      selectDetails(id) {
        global_.$options.exportSession(this.selectDetails);
        this.$axios({
          url: this.path + 'message/readMessage?id=' + id,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.detailsNoticeData = res.data;
              this.getLength();
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      delNotice(id) {
        global_.$options.exportSession(this.delNotice);
        this.$axios({
          url: this.path + 'message/delMessage/' + id,
          method: 'delete',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data == 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getNoticeData();
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      setAllRead() {
        global_.$options.exportSession(this.setAllRead);
        this.$axios({
          url: this.path + 'message/updateReadAll?isRead=1',
          method: 'post',
          params: this.listNoticeQuery,
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
            this.getNoticeData();
          })
          .catch((err) => {
            console.log(err);
          })
      },
      delAllRead() {
        global_.$options.exportSession(this.delAllRead);
        this.$axios({
          url: this.path + 'message/delMessageAll',
          method: 'delete',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data == 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getNoticeData();
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getLength() {
        this.$axios({
          url: this.path + 'message/count?isRead=0',
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
            this.unReadTotal = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },

    }
  }
</script>
<style type="text/css">
  ul, li {
    list-style: none;
  }

  .header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 30;
    width: 100%;
    height: 70px;
    line-height: 70px;
    transition: all .5s ease;
    /*box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/

  }

  .header .header-tit {
    float: left;
    margin-left: 20px;
  }

  .logo-link {
    display: inline-block;
  }

  .header .header-tit .logo {
    margin-top: 17px;
    display: inline-block;
    height: 40px;
    background-size: cover;
    float: left;
  }

  .header h4 {
    display: inline-block;
    font-weight: normal;
    margin-left: 20px;
  }

  .header .user-info {
    float: right;
    font-size: 14px;
    margin-right: 20px;
  }

  .header .user-info .exit {
    margin-left: 15px;
    opacity: 0.7;
    cursor: pointer;
    display: inline-block;
  }

  .el-badge__content.is-fixed {
    top: 20px;
    right: 30px;
  }

  .new-msg {
    margin-left: 20px;
    border-right: 2px solid #444;
    border-left: 2px solid #444;
    padding: 0 20px;
    cursor: pointer;
  }

  .new-msg .icon {
    color: #c2c2c5;
  }

  .messages {
    background-color: #F1F1F2;
  }

  .messages .message-item {
    border-bottom: 1px solid #cdcdcd;
    font-size: 14px;
    padding: 20px 15px;
    cursor: pointer;
  }

  .messages .message-item:hover,
  .messages .message-active {
    background-color: #E2E2E3;
  }

  .messages .message-item .send-info {
    margin-bottom: 10px;
  }

  .content-panel,
  .msg-correlation {
    font-size: 14px;
  }

  .msg-correlation .send-time {
    float: right;
  }

  .msg-correlation,
  .messages .message-item .send-info,
  .messages .message-item .send-info a {
    color: #1E202A;
  }

  .messages .message-item .send-info .sender {
    width: 140px;
    display: inline-block;

  }

  .messages .message-item .send-info .send-time {
    display: inline-block;
    width: 200px;
  }

  .messages .message-item .send-content,
  .messages .message-item .send-content a {
    color: #474951;
  }

  #noticeType, #operateList {
    display: none;
  }

  .title-wrapper {
    position: relative;
    width: 1100px;
    margin: 0 auto;
    color: #c2c2c5;
  }

  .title-wrapper a {
    color: #1E202A;
  }

  .title-wrapper .msg-down {
    margin-left: 7px;
  }

  .title-wrapper .msg-down .current {
    font-size: 14px;
  }

  .title-wrapper .msg-down .icon {
    font-size: 12px;
  }

  .title-wrapper .icon-tixing,
  .title-wrapper .msg-down:hover {
    color: #F9690E;

  }

  .title-left {
    width: 424px;
    border-right: 1px solid #999;
  }

  .el-pager li.active:hover {
    color: #FFFFFF;
  }

  .el-pager li.active, .el-button--primary {
    color: #FFFFFF;
    border-color: #F9690E;
    background: #F9690E;
  }

  .el-button--default:focus, .el-button--default:hover {
    border-color: #F9690E;
    color: #F9690E;
  }

  .el-button--default:active {
    border-color: #CC4E00;
    color: #CC4E00;
  }

  .el-tabs__item.is-active,
  .el-pager li:hover {
    color: #F9690E;
  }

  .message-container {
    background: #CCCCCC;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: none;
  }

  .message-title {
    /*height: 50px;*/
    line-height: 48px;
    border-top: 1px solid #F9690E;
    border-bottom: 1px solid #999;
    position: relative;
  }

  .message-title .close {
    position: absolute;
    right: 20px;
    color: #1E202A;
  }

  .message-title .close:hover {
    color: #F9690E;
  }

  .message-wrapper {
    width: 1100px;
    height: 100%;
    margin: 0 auto;
  }

  .ms-type {
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 1111;
    box-shadow: 1px 1px 5px #999;
    width: 150px;
  }

  .ms-type li {
    height: 40px;
    line-height: 40px;
    list-style: none;
    background-color: #F0F0EE;
    border-bottom: 1px solid #D3D6DA;
    font-size: 14px;
    padding-left: 30px;
  }

  .ms-type li:hover,
  .ms-operate li:hover {
    background-color: #D3D6DA;
  }

  .ms-type li a,
  .ms-type li a:hover {
    color: #474951;
    display: block;

  }

  .el-badge__content.is-fixed.is-dot {
    top: 12px;
    right: 3px;
  }

  .message-list-wrapper {
    width: 424px;
    height: 100%;
    overflow-y: auto;
    float: left;
  }

  .message-list {
    width: 400px;
    margin: 20px 20px 126px 0;
    background-color: #f1f1f3;
  }

  .message-content {
    display: none;
    width: 675px;
    height: 100%;
    border-left: 1px solid #999;
    float: right;
  }

  .content-panel {
    height: 100%;
    overflow-y: auto;
    margin: 20px;
    background-color: #f1f1f3;
    padding: 20px;
  }

  .notice {
    position: relative;
    float: left;
  }

  .more-operate {
    margin-right: 24px;
    position: relative;
    float: right;
  }

  .more-operate .icon-more {
    font-size: 24px;
  }

  .more-operate .icon-more:hover {
    color: #F9690E;
  }

  .ms-operate {
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 1111;
    width: 150px;
    box-shadow: 1px 1px 5px #999;
  }

  .ms-operate li {
    height: 40px;
    line-height: 40px;
    list-style: none;
    background-color: #F0F0EE;
    font-size: 14px;
    padding-left: 10px;
    border-bottom: 1px solid #D3D6DA;
  }

  .msg-content,
  .ms-operate li a,
  .ms-operate li a:hover {
    color: #474951;
  }

  .ms-operate li .icon {
    font-size: 14px;
    width: 20px;
    display: inline-block;
  }

  .message-title a:hover {
    color: #f8f8f9;
  }

  .msg-type {
    color: #F9690E;
  }

  .send-content .el-badge__content.is-fixed.is-dot {
    top: 3px;
    right: 6px;
  }

  .msg-content {
    margin-top: 20px;
    text-indent: 30px;
    line-height: 24px;
    margin-bottom: 30px;
  }
  .infomsg{
    line-height: 30px;
    color: #474951;
  }
  .page-block {
    width: 100%;
    text-align: center;
    padding: 20px 0;
  }

  /*默认滚动条样式*/
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    border: 1px #777 solid;
    box-shadow: 0px 0px 3px #777 inset;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.4);
  }

  ::-webkit-scrollbar-thumb {
    border: 1px #808080 solid;
    border-radius: 10px;
    background: #999;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #7d7d7d;
  }
</style>
