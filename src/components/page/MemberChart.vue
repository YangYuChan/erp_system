<template>
	<div class="chart-box">
		<div class="chart-info clearfix">
			<div class="chart-data-font">
				<p class="chart-data">{{memberCount}}</p>
				<p class="chart-font">近30天日均新增会员</p>
			</div>
			<div class="chart-name">
				会员
			</div>
		</div>
		<div id="mountMemberNode"></div>
	</div>
</template>

<script>
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	const Axios = new AXIOS();
	export default {
		name: "memberChart",
		props:['gymId'],
		data() {
			return {
				path: global_.path,
				memberList:[],
				memberCount:'',
				chart:'',
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
//				this.getData();
				this.setChart();
			});
		},
		methods: {
			getData(){
				this.$axios({
						url: this.path + 'erp/index?gymId='+this.gymId,
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
						if(res.data.code == 100000){
							this.memberList = res.data.result.memberList;
							this.memberCount = res.data.result.memberCount;
							this.getMemberChart(this.memberList);
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			setChart(){
				this.chart = new G2.Chart({
					container: 'mountMemberNode',
					forceFit: true,
					height: 400,
				});
			},
			getMemberChart(arr) {
				this.chart.source(arr);
//				this.chart.scale('num', {
//					tickInterval: 10
//				});
				this.chart.interval().position('time*num').size(10);
				this.chart.render();
			},
		}
	}
</script>

<style>
	.chart-box {
		width: 90%;
		/*height: 300px;*/
		display: block;
		margin: 20px auto;
	}

	.chart-info {
		margin: 20px 10px 20px 45px;
	}

	.chart-data {
		font-size: 32px;
	}

	.chart-data-font {
		width: 50%;
		float: left;
	}

	.chart-font {
		font-size: 14px;
		color: #666;
	}

	.chart-name {
		float: right;
		width: 40%;
		color: #CCCCCC;
		font-size: 40px;
		text-align: right;
	}
</style>
