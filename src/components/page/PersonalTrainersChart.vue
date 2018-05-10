<template>
	<div class="chart-box">
		<div class="chart-info clearfix">
			<div class="chart-data-font">
				<p class="chart-data">{{classCount}}</p>
				<p class="chart-font">近30天日均私教售客</p>
			</div>
			<div class="chart-name">
				私教
			</div>
		</div>
		<div id="mountPersonalNode"></div>
	</div>
</template>

<script>
	import AXIOS from '../../axios/axios'
	import global_ from '../../common/js/common'
	import valid from '../../common/js/validate'
	const Axios = new AXIOS();
	export default {
		name: "personalChart",
		props:['gymId'],
		data() {
			return {
				path: global_.path,
				classList:[],
				classCount:'',
				chart:'',
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
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
							this.classList = res.data.result.classList;
							this.classCount = res.data.result.classCount;
							this.getPersonalChart(this.classList);
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			setChart(){
				this.chart = new G2.Chart({
					container: 'mountPersonalNode',
					forceFit: true,
					height: 400,
				});

			},
			getPersonalChart(arr) {
				this.chart.source(arr);
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
