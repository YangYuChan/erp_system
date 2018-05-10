<template>
  <div class="index-home">
    <img src="../../../static/img/bg.jpg" alt="" class="home-bg">
    <div class="font-box">
      <img src="../../../static/img/font.png" alt="" class="home-font">
    </div>
  </div>

</template>
<script>

</script>
<style type="text/css">
.index-home{
  position: relative;
  width:100%;
  height:100%;
  overflow: hidden;
  background-color: #f1f1f3;
}
  .home-bg{
    width:100%;
    height:100%;
    -webkit-background-size: cover;
    background-size: cover;
    overflow: hidden;
  }
  .font-box{
    position: absolute;
    z-index: 5;
    top:50%;
    left:50%;
    margin-left:-220px;
    margin-top: -123px;
    background-size: cover;
  }
</style>
