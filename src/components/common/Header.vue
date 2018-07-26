
	<div class="header clearfix">
		<div class="header-tit">
			<span><img src="../../../static/img/logo.png" class="logo"></span>
		</div>
		<div class="user-info">
			<span id="time"></s<template>pan>
			<span class="username">&nbsp;欢迎您，{{user}}</span>
			<el-badge :value="unReadTotal" class="item" >
			  	<span class="new-msg" id="advices" @click.prevent = "messageShow"><i class="icon iconfont icon-tixing"></i></span>
			</el-badge>

			<span class="exit" @click.prevent="logout"><i class="icon iconfont icon-exit"></i></span>
		</div>
	</div>
</template>

<style type="text/css">
	.header {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1000;
		width: 100%;
		height: 70px;
		line-height: 70px;
	    transition: all .5s ease;
	    /*box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);*/

	}
	.header .header-tit{
		float: left;
		margin-left: 20px;
	}
	.header .header-tit .logo{
		margin-top: 17px;
		display: inline-block;
		height: 40px;
		background-size: cover;
		float: left;
	}
	.header h4 {
		display: inline-block;
		font-weight: normal;
		margin-left: 20px;
	}

	.header .user-info {
		float: right;
		font-size: 14px;
		margin-right: 20px;
	}

	.header .user-info .exit {
		margin-left: 15px;
		opacity: 0.7;
		cursor: pointer;
		display: inline-block;
	}
	.el-badge__content.is-fixed{
		top: 20px;
		right: 30px;
	}
	.new-msg{
		margin-left: 20px;
		border-right: 2px solid #444;
		border-left: 2px solid #444;
		padding: 0 20px;
		cursor: pointer;
	}
	.new-msg .icon{
		color: #c2c2c5;
	}
</style>
