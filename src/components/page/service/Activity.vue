<template>
  <div class="table">
    <!--查询-->
    <div class="plugins-tips">
      <el-form :model="listQuery" label-width="100px">
        <el-form-item style="margin-bottom: 0;" label="场馆名称">
          <el-select v-model="listQuery.gymId" placeholder="全部" :clearable=true @change="handleFilter()">
            <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-input placeholder="活动名称" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="手机号" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.isFinished" placeholder="状态" :clearable=true @change="getData">
          <el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
      </el-form-item>
      <br>
    </el-form>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="activityName" label="活动名称"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span class="status" v-if="scope.row.status =='待处理'">
					 {{scope.row.status}}
					</span>
          <span v-else class="status over">
					 {{scope.row.status}}
					</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '待处理'">
            <el-button size="small" type="danger" @click="handleOver(scope.row)">已致电</el-button>
            <el-button size="small" type="danger" @click="handleFinish(scope.row)">完成到店</el-button>
          </span>
          <span v-else-if="scope.row.status == '已致电'">
            <el-button size="small" type="danger" disabled="disabled">已致电</el-button>
          <el-button size="small" type="danger" @click="handleFinish(scope.row)">完成到店</el-button>
          </span>
          <span v-else-if="scope.row.status == '完成到店'">
            <el-button size="small" disabled="disabled">已致电</el-button>
          <el-button size="small" disabled="disabled">完成到店</el-button>
          </span>

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
  import moment from 'moment';
  const Axios = new AXIOS();
  export default {
    data() {
      return {
        path: global_.path,
        tableData: [], //
        coachData: [],
        gymData: [],
        token: '',
        listLoading: false,
        statusData:[{
          id:0,
          value:'待处理',
        },{
          id:1,
          value:'完成到店'
        },{
          id:2,
          value:'已致电'
        }],
        total:0,
        listQuery: {
          page: 1,
          limit: 10,
          keyword: '',
          isFinished: '',
          gymId: '',
        },
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getGymList();
      });
    },
    methods: {
      getGymList() {
        this.$axios({
          url: this.path + 'resource/gym/erp/list?gymId='+this.listQuery.gymId,
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
            this.listQuery.gymId = res.data[0].id;
            this.getData()
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getTotal() {
        global_.$options.exportSession(this.getTotal);
        this.$axios({
          url: this.path + 'activity/subscribe/count',
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
            this.total = res.data.result;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getData() {
        global_.$options.exportSession(this.getData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'activity/subscribe/list',
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
            if (res.data.code===100000) {
              this.listLoading = false;
              this.getTotal();
              this.tableData = res.data.result;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleClear(){
        this.listQuery.keyword = '';
        this.listQuery.isFinished = '';
        this.getData();
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
      //取消预约
      handleOver(row) {
        global_.$options.exportSession(this.handleOver);

        this.$axios({
          url: this.path + 'activity/subscribe/delete/'+row.id,
          method: 'delete',
          transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],

          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        }).then((res) => {
          if (res.data.code === 100000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getData();
          } else {
            this.$message({
              message: res.data.message,
              type: 'error'
            });
          }
        }).catch((err) => {
          console.log(err);
        })

      },
      //完成到店
      handleFinish(row) {
        global_.$options.exportSession(this.handleFinish);
        this.$confirm('请在客户完成体验课程后，再点击确认。 是否确认?', '重要提示：', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          customClass:'msgBoxStyle',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: this.path + 'activity/subscribe/update/finish',
            data:{
              id:row.id
            },
            method: 'post',
            transformRequest: [function (data) {
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }],

            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,
            }
          }).then((res) => {
            if (res.data.code === 100000) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
    }
  }
</script>

<style type="text/css">
  .plugins-tips {
    padding: 10px;
  }
  .ptags{
    margin:10px 65px;
    color: #666;
    font-size:14px;
  }
  .remark{
    margin:10px 0 30px 65px;
    color: #f00;
  }
  .status{

  }
  .status:before{
    width:6px;
    height:6px;
    display: block;
    float: left;
    margin-top:8px;
    margin-right: 3px;
    border-radius: 100%;
    background: #007fff;
    content: '';
  }
  .over{
    color: #ccc;
  }
  .over:before{
    background: #ccc;
  }
  .msgBoxStyle{
    font-weight: bold;
  }
</style>
