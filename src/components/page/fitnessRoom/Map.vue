<template>
<div class="map-box">
	<div id="map-container"></div>
</div>
</template>

<script>
import AMap from 'AMap';
	export default {
		name: "mapChild",
		mounted(){
			this.getMapChild()
		},
		methods: { 
			getMapChild(){
				var map = new AMap.Map("map-container", {
					resizeEnable: true,
				});				
				
				var marker = new AMap.Marker(), 
					posObj = [],
					lng,
					lat;
				
				map.on('click', function(e) {
				 	lng = e.lnglat.getLng();
					lat = e.lnglat.getLat();
					posObj = [lng,lat];
					marker.setPosition(posObj);
					marker.setMap(map);
					marker.setIcon("//webapi.amap.com/theme/v1.3/markers/b/mark_r.png");
					marker.setOffset(new AMap.Pixel(-20,-55));
					document.getElementById("Lng").value = lng;
					document.getElementById("Lat").value = lat;
		    	});
		    	
				    var autoOptions = {
				        input: "tipinput"
				    };
				    var auto = new AMap.Autocomplete(autoOptions);
				    var placeSearch = new AMap.PlaceSearch({
				        map: map
				    });  //构造地点查询类
				    
				    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
				    function select(e) {
				        placeSearch.setCity(e.poi.adcode);
				        placeSearch.search(e.poi.name);  //关键字查询查询
				    };
		},
	}
	}
</script>

<style>
#map-container{
		width: 800px;
		height: 500px;
		display: block;
		margin: 20px auto;
	}
</style>