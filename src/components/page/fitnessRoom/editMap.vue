<template>
	<div class="map-box">
		<div id="map-editContainer"></div>
	</div>
</template>

<script>
import AMap from 'AMap';
	export default {
		name: "mapEditChild",
		mounted(){
			this.$emit('getEditMapChild'); 
		},
		methods: {
			getEditMapChild(longitude, latitude) {
				var map = new AMap.Map("map-editContainer", {
					resizeEnable: true,
					center: [longitude, latitude],
					zoom: 15,
				});
				var that = this,
					posObj = [],
					lng,
					lat,
					marker;
				AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
					marker = new SimpleMarker({
						//自定义图标地址
						iconStyle: '//webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
						//设置基点偏移
						offset: new AMap.Pixel(-20, -55),
						map: map,
						showPositionPoint: true,
						position: [longitude, latitude],
						zIndex: 100
					});
				});
				map.on('click', function(e) {
						lng = e.lnglat.getLng();
						lat = e.lnglat.getLat();
						posObj = [lng, lat];
						marker.setPosition(posObj);
						marker.setMap(map);
						marker.setIcon("//webapi.amap.com/theme/v1.3/markers/b/mark_r.png");
						marker.setOffset(new AMap.Pixel(-20, -55));
						document.getElementById("editLng").value = lng;
						document.getElementById("editLat").value = lat;
					});
	
					var autoOptions = {
						input: "tipinpute"
					};
					var auto = new AMap.Autocomplete(autoOptions);
					var placeSearch = new AMap.PlaceSearch({
						map: map
					}); //构造地点查询类
	
					AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
					function select(e) {
						placeSearch.setCity(e.poi.adcode);
						placeSearch.search(e.poi.name); //关键字查询查询
					};
				
			},
		}
	}
</script>

<style>
	 #map-editContainer {
    width: 800px;
    height: 500px;
    display: block;
    margin: 20px auto;
  }
</style>