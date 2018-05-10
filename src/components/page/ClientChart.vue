<template>
	<div class="chart-box">
		<div class="chart-info clearfix">
			<div class="chart-data-font">
				<p class="chart-data">0</p>
				<p class="chart-font">近30天日均客流</p>
			</div>
			<div class="chart-name">
				客流
			</div>
		</div>
		<div id="mountClientNode"></div>
	</div>
</template>

<script>
	//import AMap from 'AMap';
	export default {
		name: "clientChart",
		mounted() {
			this.getClientChart()
		},
		methods: {
			getClientChart() {
				const data = null
				const chart = new G2.Chart({
					container: 'mountClientNode',
					forceFit: true,
					height: 400,
				});
				chart.source(data);
				chart.scale({
					value: {
						min: 10000
					},
					year: {
						range: [0, 1]
					}
				});
				chart.axis('value', {
					label: {
						formatter: val => {
							return(val / 10000).toFixed(1) + 'k';
						}
					}
				});
				chart.tooltip({
					crosshairs: {
						type: 'line'
					}
				});
				chart.area().position('year*value');
				chart.line().position('year*value').size(2);
				chart.render();
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