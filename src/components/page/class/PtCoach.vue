<template>
  <div class="table">
  	<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery">
				 <el-form-item style="margin-bottom: 0;">
	        <el-select v-model="listQuery.gymId" placeholder="全部健身房" :clearable=true  @change="getData">
	          <el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
	        </el-select>
	      </el-form-item>
			</el-form>
		</div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
        <el-breadcrumb-item>私教管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="listQuery" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="listQuery.coachId" placeholder="全部教练" :clearable=true @change="getData">
          <el-option v-for="item in coachData" :key="item.id" :label="item.coachName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.className" placeholder="课程名称" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.keyword" placeholder="用户手机或昵称" :clearable=true></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="className" label="课程名称"></el-table-column>
      <el-table-column prop="coachName" label="教练"></el-table-column>
      <el-table-column prop="realName" label="购买人"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="classPrice" label="费用">
        <template slot-scope="scope">
          <span>
					 {{scope.row.classPrice}}元/{{scope.row.classNumber}}课时
					</span>
        </template>
      </el-table-column>
      <el-table-column prop="spareClassNumber" label="剩余课时"></el-table-column>
      <el-table-column prop="recentScheduledClassTime" label="最近上课时间"></el-table-column>
      <el-table-column prop="classPrice" label="时间">
        <template slot-scope="scope">
          <span v-if="scope.row.spareClassNumber == 0">
					  已确认
					</span>
          <span v-else>
            待确定
					</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑时间</el-button>
          <el-button size="small" type="danger" @click="handleReservation(scope.row)">取消预约</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
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
        coachData: [],
        gymData: [],
        token: '',
        listLoading: false,
        total:0,
        listQuery: {
          page: 1,
          limit: 10,
          keyword: '',
          coachId: '',
          gymId: '',
          className: ''
        },

      }
    },

    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getData();
      });
    },
    methods: {
      getTotal() {
        this.$axios({
          url: this.path + 'class/personal/count',
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
            this.total = res.data.count;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getCoach() {
        this.$axios({
          url: this.path + 'resource/coach/erp/list?page=0&gymId='+this.listQuery.gymId,
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
            this.coachData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getType() {
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
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getData() {
        global_.$options.exportSession(this.getData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'class/personal/list',
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
//          if (res.data.code = 100000) {
              this.getTotal();
              this.getCoach();
              this.getType();
              this.tableData = res.data.list;
              this.listLoading = false;
//          }
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
      handleEdit(row) {
//    	sessionStorage.setItem("obj",JSON.stringify(row));
				sessionStorage.setItem('classid',row.id);
				this.$router.push('/ptEditCoach');
      },
      //取消预约
      handleReservation(row) {
        global_.$options.exportSession(this.handleSoldIn);
        this.$confirm('确认要取消预约吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'class/personal/schedule/delete',
            method: 'post',
            data: {
              userId: row.userId,
              classId: row.classId
            },
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
        })
      },
    }
  }
</script>

<style type="text/css">
	.plugins-tips {
		padding: 10px;
	}
</style>
