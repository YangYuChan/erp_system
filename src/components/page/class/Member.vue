<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 服务号管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="name" label="姓名"></el-table-column>
			<el-table-column prop="phone" label="手机号"></el-table-column>
			<el-table-column prop="status" label="是否付费">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="orderFee" label="消费金额"></el-table-column>
			<el-table-column prop="tradeDetail" label="购买课程"></el-table-column>
			<el-table-column prop="createTime" label="绑定注册时间"></el-table-column>
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
        action:global_.action,
        tableData: [], //列表数组
    		listQuery: {
					page: 1,
					limit: 10,
				},
        token:'',
        listLoading: false,
        total: null,

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
						url: this.path + 'member/line/count',
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

			getData() {
				global_.$options.exportSession(this.getData);

				this.listLoading = true;
				this.$axios({
						url: this.path + 'member/line/list',
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
  .block {
    float: right;
    margin-top: 25px;
  }

  .plugins-tips .el-form-item {
    margin-bottom: 0;
  }

  .btn-box {
    margin-bottom: 20px;
  }
  .details-title{
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    height: 50px;
    margin-bottom: 20px;
    color: #1f2d3d;
  }
  .details-content{
    font-size: 14px;
    line-height: 1.5;
    padding: 0 5rem;
  }

  .gyminfo{
    width:230px;
    word-break:break-all;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
</style>
