<template>
	<div class="main-container clearfix">
		<div class="plugins-tips">
			<el-form :inline="true" class="demo-form-inline">
				<el-form-item style="margin-bottom: 0;" label="场地选择">
					<el-select v-model="gymId" placeholder="全部健身房" :clearable=true @change="gymChange">
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="chart-wrapper">
			<div class="sale-container">
				<sale-chart ref="saleChart" :gymId="gymId"></sale-chart>
			</div>
			<div class="member-container">
				<member-chart ref="memberChart" :gymId="gymId"></member-chart>
			</div>
			<div class="client-container">
				<client-chart ref="clientChart"></client-chart>
			</div>
			<div class="personal-container">
				<personal-chart ref="personalChart" :gymId="gymId"></personal-chart>
			</div>

		</div>
	</div>
</template>
<style>
	.main-container {
		width: 96%;
		margin: 20px auto;
	}
	.sale-container,
	.member-container,
	.client-container,
	.personal-container {
		float: left;
		width: 48%;
		height: 520px;
	}
</style>
<script type="text/javascript">
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	import saleChart from './SaleChart.vue';
	import memberChart from './MemberChart.vue';
	import clientChart from './ClientChart.vue';
	import personalChart from './PersonalTrainersChart.vue';
	const Axios = new AXIOS();
	export default {
		components: {
			saleChart,
			memberChart,
			clientChart,
			personalChart
		},
		data() {
			return {
				path: global_.path,
				gymData: [],
				token: '',
				listLoading: false,
				gymId: '',
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getType();
			});
		},
		methods: {
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
						this.gymChange();
					})
					.catch((err) => {
						console.log(err);
					})
			},
			gymChange(){
				this.$nextTick(() => {
				this.$refs.saleChart.getData();
				this.$refs.memberChart.getData();
				this.$refs.personalChart.getData();
				});
			}
		}
	}
</script>