<template>
	<div class="table">
		<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery">
				<el-form-item style="margin-bottom: 0;" label="场地选择">
					<el-select v-model="listQuery.gymId" placeholder="全部" :clearable=true @change="getData">
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 会员管理</el-breadcrumb-item>
				<el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form :inline="true" :model="listQuery" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="listQuery.keyword" placeholder="输入会员姓名/手机号" :clearable=true></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="listQuery.cardNum" placeholder="实体卡号" :clearable=true></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="listQuery.status" placeholder="会员状态" :clearable=true @change="getData">
					<el-option v-for="item in memberType" :key="item.id" :label="item.value" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
			</el-form-item>
			<el-form-item style="float: right;">
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">会员办卡</el-button>
			</el-form-item>
			<div class="more">
				<a href="javascript:;" @click="moreFilter =!moreFilter">更多筛选<i class="icon iconfont icon-arrow-down"></i></a>
			</div>
			<div v-show="moreFilter">
				<el-form-item label="筛选条件">
					<el-select v-model="listQuery.kindType" placeholder="会员卡类型" :clearable=true @change="getCardList(listQuery.kindType)">
						<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
					<el-select v-model="listQuery.kindId" placeholder="会员卡名称" :clearable=true @change="getData">
						<el-option v-for="item in cardNameList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<br />
				<el-form-item label="余额筛选" v-if="listQuery.kindType == null || listQuery.kindType == ''">
					<el-input v-model="listQuery.minMoney" placeholder="输入数值" style="width: 100px;" :clearable=true disabled></el-input>
					至
					<el-input v-model="listQuery.maxMoney" placeholder="输入数值" style="width: 100px;" :clearable=true disabled></el-input>
          <el-button type="info" icon="search" disabled>查询</el-button>
				</el-form-item>
        <el-form-item label="余额筛选" v-else>
          <el-input v-model="listQuery.minMoney" placeholder="输入数值" style="width: 100px;" :clearable=true></el-input>
          至
          <el-input v-model="listQuery.maxMoney" placeholder="输入数值" style="width: 100px;" :clearable=true></el-input>
          <span v-if="listQuery.kindType == 1">天</span>
          <span v-if="listQuery.kindType == 2">次</span>
          <span v-if="listQuery.kindType == 3">元</span>
          <el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
        </el-form-item>
				<br />
				<el-form-item label="生效日期">
					<el-date-picker :picker-options="pickerOptions1" v-model="beginTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
					</el-date-picker>
				</el-form-item>
				<br />
				<el-form-item label="失效日期">
					<el-date-picker :picker-options="pickerOptions1" v-model="endTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
					</el-date-picker>
				</el-form-item>
			</div>

		</el-form>
		<p class="count">会员卡总数：{{total}}</p>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="cardNum" label="会员卡号"></el-table-column>
			<el-table-column prop="kindName" label="会员卡名称"></el-table-column>
			<el-table-column label="会员名称&头像">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
					<span class="userphoto"><img :src="scope.row.photo"/></span>
				</template>
			</el-table-column>
			<el-table-column prop="activateTime" label="生效日期"></el-table-column>
			<el-table-column prop="endTime" label="失效日期"></el-table-column>
			<el-table-column label="余额">
        <template slot-scope="scope">
          <span v-if="scope.row.kindType == 1">{{scope.row.dayNum}}(天)</span>
          <span v-else-if="scope.row.kindType == 2">{{scope.row.amount}}(次)</span>
          <span v-else-if="scope.row.kindType == 3">{{scope.row.balance}}(元)</span>
        </template>
      </el-table-column>
      <el-table-column label="是否激活">
        <template slot-scope="scope">
          <span v-if="scope.row.isActivate == 0">未激活</span>
          <span v-else-if="scope.row.isActivate == 1">激活成功</span>
        </template>
      </el-table-column>
			<el-table-column prop="createTime" label="创建日期"></el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>

		<el-dialog :visible.sync="addFormVisible" title="会员办卡" width="600px" :before-close="handleClose" :closeOnClickModal="false">
			<div class="type1" v-show="type1">

				<el-form ref="addForm1" :model="addForm1" label-width="160px" :rules="addRules1" class="form-container">
					<el-form-item label="售卖场地：">
						<el-select v-model="listQuery.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="addForm1.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm1.kindType)" required>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="addForm1.kindId" placeholder="请选择会员卡名称" :clearable=false required>
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="addForm1.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="addForm1.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="addForm1.dateType"></el-radio>
						<el-radio label="月" v-model="addForm1.dateType"></el-radio>
						<el-radio label="天" v-model="addForm1.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="赠送时间：" prop="giveTime" style="margin-bottom: 0px;">
						<el-input v-model.number="addForm1.giveTime" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="addForm1.giveDateType"></el-radio>
						<el-radio label="月" v-model="addForm1.giveDateType"></el-radio>
						<el-radio label="天" v-model="addForm1.giveDateType"></el-radio>
					</el-form-item>
					<el-form-item label="立即激活：" prop="isActivate">
						<el-radio label="是" v-model="addForm1.isActivate"></el-radio>
						<el-radio label="否" v-model="addForm1.isActivate"></el-radio>
						<p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
					</el-form-item>
					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="addForm1.money" style="width: 111px;"></el-input>
					</el-form-item>
					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="addForm1.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="addForm1.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="addForm1.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm1.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm1">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type2" v-show="type2">
				<el-form ref="addForm2" :model="addForm2" label-width="160px" :rules="addRules2" class="form-container">
					<el-form-item label="售卖场地：">
						<el-select v-model="listQuery.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="addForm2.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm2.kindType)" required>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="addForm2.kindId" placeholder="请选择会员卡名称" :clearable=false required >
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="addForm2.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效次数：" prop="number">
						<el-input v-model.number="addForm2.number" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
					</el-form-item>
					<el-form-item label="赠送次数：" prop="giveNumber">
						<el-input v-model.number="addForm2.giveNumber" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="addForm2.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="addForm2.dateType"></el-radio>
						<el-radio label="月" v-model="addForm2.dateType"></el-radio>
						<el-radio label="天" v-model="addForm2.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="addForm2.money" style="width: 111px;"></el-input>
					</el-form-item>
					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="addForm2.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="addForm2.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="addForm2.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm2.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm2">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type3" v-show="type3">
				<el-form ref="addForm3" :model="addForm3" label-width="160px" :rules="addRules3" class="form-container">
					<el-form-item label="售卖场地：">
						<el-select v-model="listQuery.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="addForm3.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm3.kindType)">
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="addForm3.kindId" placeholder="请选择会员卡名称" :clearable=false >
							<el-option v-for="item in cardList" :key="item.id+' '+item.price" :label="item.kindName" :value="item.id+' '+item.price"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="addForm3.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="addForm3.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="addForm3.dateType"></el-radio>
						<el-radio label="月" v-model="addForm3.dateType"></el-radio>
						<el-radio label="天" v-model="addForm3.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="立即激活：" prop="isActivate">
						<el-radio label="是" v-model="addForm3.isActivate"></el-radio>
						<el-radio label="否" v-model="addForm3.isActivate"></el-radio>
						<p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
					</el-form-item>

					<el-form-item label="是否正式会员可购买：" prop="isBuy">
						<el-radio label="是" v-model="isBuy"></el-radio>
						<el-radio label="否" v-model="isBuy"></el-radio>
					</el-form-item>

					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="addForm3.money" style="width: 111px;"></el-input>
					</el-form-item>

					<el-form-item label="充值金额：" prop="giveMoney">
						<el-input v-model.number="addForm3.giveMoney" style="width: 111px;"></el-input>
					</el-form-item>

					<el-form-item label="支持消费方式：" prop="isLeague" class="consume">
						<el-checkbox label="付费团课" v-model="addForm3.isLeague"></el-checkbox>
						<el-checkbox label="私教课" v-model="addForm3.isPersonal"></el-checkbox>
					</el-form-item>

					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="addForm3.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="addForm3.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="addForm3.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm3.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm3">提交</el-button>
					</el-form-item>
				</el-form>
			</div>

		</el-dialog>

		<!--编辑-->
		<el-dialog :visible.sync="editFormVisible" title="会员卡编辑" width="600px" :before-close="handleEditClose" :closeOnClickModal="false">
			<div class="type1" v-show="type1">

				<el-form ref="editForm1" :model="editForm1" label-width="160px" :rules="addRules1" class="form-container">
					<el-form-item label="售卖场地">
						<el-select v-model="editForm1.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="editForm1.kindType" placeholder="请选择会员卡类型" readonly disabled>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="editForm1.kindId" placeholder="请选择会员卡名称" :clearable=false required>
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="editForm1.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="editForm1.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="editForm1.dateType"></el-radio>
						<el-radio label="月" v-model="editForm1.dateType"></el-radio>
						<el-radio label="天" v-model="editForm1.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="赠送时间：" prop="giveTime" style="margin-bottom: 0px;">
						<el-input v-model.number="editForm1.giveTime" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="editForm1.giveDateType"></el-radio>
						<el-radio label="月" v-model="editForm1.giveDateType"></el-radio>
						<el-radio label="天" v-model="editForm1.giveDateType"></el-radio>
					</el-form-item>
					<el-form-item label="立即激活：" prop="isActivate">
						<el-radio label="是" v-model="editForm1.isActivate"></el-radio>
						<el-radio label="否" v-model="editForm1.isActivate"></el-radio>
						<p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
					</el-form-item>
					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="editForm1.money" style="width: 111px;"></el-input>
					</el-form-item>
					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="editForm1.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="editForm1.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="editForm1.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="editForm1.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleEditClose">取消</el-button>
						<el-button type="primary" @click="editSubmitForm1">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type2" v-show="type2">
				<el-form ref="editForm2" :model="editForm2" label-width="160px" :rules="addRules2" class="form-container">
					<el-form-item label="售卖场地">
						<el-select v-model="editForm2.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="editForm2.kindType" placeholder="请选择会员卡类型" readonly disabled>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="editForm2.kindId" placeholder="请选择会员卡名称" :clearable=false required>
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="editForm2.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效次数：" prop="number">
						<el-input v-model.number="editForm2.number" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
					</el-form-item>
					<el-form-item label="赠送次数：" prop="giveNumber">
						<el-input v-model.number="editForm2.giveNumber" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;次
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="editForm2.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="editForm2.dateType"></el-radio>
						<el-radio label="月" v-model="editForm2.dateType"></el-radio>
						<el-radio label="天" v-model="editForm2.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="editForm2.money" style="width: 111px;"></el-input>
					</el-form-item>
					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="editForm2.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="editForm2.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="editForm2.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="editForm2.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleEditClose">取消</el-button>
						<el-button type="primary" @click="editSubmitForm2">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type3" v-show="type3">
				<el-form ref="editForm3" :model="editForm3" label-width="160px" :rules="addRules3" class="form-container">
					<el-form-item label="售卖场地">
						<el-select v-model="editForm3.gymId" placeholder="全部" readonly disabled>
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="editForm3.kindType" placeholder="请选择会员卡类型" readonly disabled>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="editForm3.kindId" placeholder="请选择会员卡名称" :clearable=false>
							<el-option v-for="item in cardList" :key="item.id+' '+item.price" :label="item.kindName" :value="item.id+' '+item.price"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="memberId">
						<el-select v-model="editForm3.memberId" placeholder="输入会员姓名/手机号搜索" filterable :loading="loading" required=true>
							<el-option v-for="item in memberList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="有效时间：" prop="time">
						<el-input v-model.number="editForm3.time" style="width: 111px;"></el-input>&nbsp;&nbsp;&nbsp;
						<el-radio label="年" v-model="editForm3.dateType"></el-radio>
						<el-radio label="月" v-model="editForm3.dateType"></el-radio>
						<el-radio label="天" v-model="editForm3.dateType"></el-radio>
					</el-form-item>
					<el-form-item label="立即激活：" prop="isActivate">
						<el-radio label="是" v-model="editForm3.isActivate"></el-radio>
						<el-radio label="否" v-model="editForm3.isActivate"></el-radio>
						<p style="color:#f56c6c;line-height: 20px;font-size: 12px;">(未开启立即激活的卡，将在第一次使用会员卡后激活，<br />有效期会从激活当天开始算起)</p>
					</el-form-item>

					<!--<el-form-item label="是否正式会员可购买：" prop="isBuy">
						<el-radio label="是" v-model="isBuy"></el-radio>
						<el-radio label="否" v-model="isBuy"></el-radio>
					</el-form-item>-->

					<el-form-item label="实收金额：" prop="money">
						<el-input v-model.number="editForm3.money" style="width: 111px;"></el-input>
						<!--<span v-show="tags" style="color:#f56c6c;line-height: 20px;font-size: 12px;"> （实收金额不能小于实际价值）</span>-->
					</el-form-item>

					<el-form-item label="实际价值：" prop="giveMoney">
						<el-input v-model.number="editForm3.giveMoney" style="width: 111px;"></el-input>
					</el-form-item>

					<el-form-item label="支持消费方式：" prop="isLeague" class="consume">
						<el-checkbox label="付费团课" v-model="editForm3.isLeague"></el-checkbox>
						<el-checkbox label="私教课" v-model="editForm3.isPersonal"></el-checkbox>
					</el-form-item>

					<el-form-item label="支付方式：" prop="payType">
						<el-select v-model="editForm3.payType" placeholder="请选择支付方式" :clearable=false>
							<el-option v-for="item in payList" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="实体卡号：" prop="cardNum">
						<el-input v-model="editForm3.cardNum"></el-input>
					</el-form-item>
					<el-form-item label="销售人员：" prop="salesman">
						<el-select v-model="editForm3.salesman" placeholder="请选择销售" filterable>
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="editForm3.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleEditClose">取消</el-button>
						<el-button type="primary" @click="editSubmitForm3">提交</el-button>
					</el-form-item>
				</el-form>
			</div>

		</el-dialog>
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
				gymData: [],
				cardNameList: [],
				token: '',
				pickerOptions1: {
					firstDayOfWeek: 1
				},
				type1: true,
				type2: false,
				type3: false,
				listLoading: false,
				loading: false,
				total: 0,
				moreFilter: false,
				memberType: [{
					id: 1,
					value: '正式会员'
				}, {
					id: 2,
					value: '潜在会员'
				}, {
					id: 3,
					value: '过期会员'
				}],
				typeData: [{
					id: 1,
					value: '期限类型'
				}, {
					id: 2,
					value: '次卡类型'
				}, {
					id: 3,
					value: '储值类型'
				}],
				payList: [{
						id: 1,
						value: '现金'
					}, {
						id: 2,
						value: '支付宝'
					}, {
						id: 3,
						value: '微信'
					}, {
						id: 4,
						value: '刷卡'
					},
					{
						id: 5,
						value: '其它'
					}
				],
				listQuery: {
					page: 1,
					limit: 10,
					gymId: '',
					keyword: '',
					minMoney: '',
					maxMoney: '',
					status: '',
					cardNum: '',
					kindId: '',
					kindType: '',
					startActivateTime: '',
					endActivateTime: '',
					startLoseTime: '',
					endLoseTime: '',
				},
				beginTime: [],
				endTime: [],
				addFormVisible: false,
				editFormVisible: false,
				usrGymList: [],
				sellGymList: [],
				cardList: [],
				memberList: [],
				saleList: [],

				isBuy: '是',
				addForm1: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
					giveDateType: '月',
					giveTime: '',
					payType: 1,
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '否',
				},
				addForm2: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
					payType: 1,
					remark: '',
					salesman: '',
					cardNum: '',
					number: '',
					giveNumber: '',
				},
				addForm3: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
					payType: 1,
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '否',
          giveMoney: '',
					isLeague: false,
					isPersonal: false
				},
				editForm1: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '',
					money: '',
					giveDateType: '',
					giveTime: '',
					payType: 1,
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '',
				},
				editForm2: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '',
					money: '',
					payType: '',
					remark: '',
					salesman: '',
					cardNum: '',
					number: '',
					giveNumber: '',
				},
				editForm3: {
					gymId: '',
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '',
					money: '',
					payType: '',
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '',
          giveMoney: '',
					isLeague: '',
					isPersonal: ''
				},
				addRules1: {
					keyword: [{
						required: true,
						message: '请选择会员名称',
						trigger: 'blur'
					}],
					kindId: [{
						required: true,
						message: '请选择会员卡名称',
						trigger: 'change'
					}],
					time: [{
						required: true,
						message: '请输入有效时间',
						trigger: 'blur'
					}],
					money: [{
						required: true,
						message: '请输入实收金额',
						trigger: 'blur'
					}],
				},
				addRules2: {
					keyword: [{
						required: true,
						message: '请选择会员名称',
						trigger: 'blur'
					}],
					kindId: [{
						required: true,
						message: '请选择会员卡名称',
						trigger: 'change'
					}],
					number: [{
						required: true,
						message: '请输入有效次数',
						trigger: 'blur'
					}],
					money: [{
						required: true,
						message: '请输入实收金额',
						trigger: 'blur'
					}],
				},
				addRules3: {
					keyword: [{
						required: true,
						message: '请选择会员名称',
						trigger: 'blur'
					}],
					kindId: [{
						required: true,
						message: '请选择会员卡名称',
						trigger: 'change'
					}],
					time: [{
						required: true,
						message: '请输入有效时间',
						trigger: 'blur'
					}],
					money: [{
						required: true,
						validator: valid.checkMoney,
						trigger: 'blur'
					}],
          giveMoney: [{
            required: true,
						validator: valid.checkGiveMoney,
						trigger: 'blur'
					}],
				}

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
						this.listQuery.gymId = res.data[0].id;
						this.getData()
					})
					.catch((err) => {
						console.log(err);
					})
			},

			getTotal() {
				this.$axios({
						url: this.path + 'member/card/count',
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
			getCardList(type) {
				if(type != null && type != '') {
					this.$axios({
							url: this.path + 'member/kind/list?page=0&type=' + type,
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
							if(res.data.code === 100000) {
								this.cardNameList = res.data.result;
//								this.listQuery.kindId = this.cardNameList[0].id;
								this.getData();
							}
						})
						.catch((err) => {
							console.log(err);
						})
				} else {
					this.listQuery.kindId = '';
					this.getData();
				}
			},
			getCardName(type) {
				this.$axios({
						url: this.path + 'member/kind/list?gymId='+this.listQuery.gymId+'&page=0&status=0&type=' + type,
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
						if(res.data.code === 100000) {
							this.cardList = res.data.result;
						}
					})
					.catch((err) => {
						console.log(err);
					})

			},
			getSaleList() {
				this.$axios({
						url: this.path + 'staff/sell/list',
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
						if(res.data.code === 100000) {
							this.saleList = res.data.result;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getData() {
				global_.$options.exportSession(this.getData);
				if(this.beginTime != null && this.beginTime != '') {
					this.listQuery.startActivateTime = this.beginTime[0];
					this.listQuery.endActivateTime = this.beginTime[1];
				} else {
					this.listQuery.startActivateTime = ''
					this.listQuery.endActivateTime = ''
				}
				if(this.endTime != null && this.endTime != '') {
					this.listQuery.startLoseTime = this.endTime[0];
					this.listQuery.endLoseTime = this.endTime[1];
				} else {
					this.listQuery.startLoseTime = ''
					this.listQuery.endLoseTime = ''
				}
				this.listLoading = true;
				this.$axios({
						url: this.path + 'member/card/list',
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
			handleAdd() {
				this.addFormVisible = true;
				this.addForm1.kindType = 1;
				this.getCardName(this.addForm1.kindType);
				this.getMemberList();
				this.getSaleList();
			},
//			checkPrice(params){
//				var worth = this.addForm3.worth;
//				if(params < worth){
//					this.tags = true
//				}else{
//					this.tags = false
//				}
//			},
//			checkEditPrice(params){
//				var worth = this.editForm3.worth;
//				if(params < worth){
//					this.tags = true
//				}else{
//					this.tags = false
//				}
//			},
			handleAddForm(type) {
				if(type == 1) {
					this.addForm1.kindType = 1;
					this.type1 = true;
					this.type2 = false;
					this.type3 = false;
				} else if(type == 2) {
					this.addForm2.kindType = 2;
					this.type1 = false;
					this.type2 = true;
					this.type3 = false;
				} else {
					this.addForm3.kindType = 3;
					this.type1 = false;
					this.type2 = false;
					this.type3 = true;
				}
				this.getCardName(type);
			},

			handleUpdate(row) {
				this.$confirm('您确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'member/kind/updateStaus',
							method: 'post',
							data: {
								id: row.id,
								status: 1
							},
							transformRequest: [function(data) {
								let ret = ''
								for(let it in data) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.getData();
							} else {
								this.$message({
									message: '修改失败',
									type: 'error'
								});
							}

						})
						.catch((err) => {
							console.log(err);
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消修改'
					});
				});
			},
			getMemberList() {
				this.$axios({
						url: this.path + 'member/list?page=0&keyword=',
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
						if(res.data.code === 100000) {
							this.memberList = res.data.result;
							this.$nextTick(() => {
								this.list = this.memberList.map(item => {
									return {
										staffName: item.staffName,
										phone: item.phone,
										status: item.status
									};
								});
							});
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
//			kindChange(params){
//				this.addForm3.worth = params.slice(33,params.length);
//			},
//			kindEditChange(params){
//				this.editForm3.worth = params.slice(33,params.length);
//			},
			kindSelect(params){
				var that = this;
				this.$axios({
						url: this.path + 'member/kind/'+params,
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
						if(res.data.code === 100000) {
							this.editForm3.worth = res.data.result.price;
							this.editForm3.kindId = this.editForm3.kindId+' '+this.editForm3.worth
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			addSubmitForm1() {
				this.$refs.addForm1.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.addForm1.dateType == '年') {
								this.addForm1.dateType = 1
							} else if(this.addForm1.dateType == '月') {
								this.addForm1.dateType = 2
							} else {
								this.addForm1.dateType = 3
							}

							if(this.addForm1.giveDateType == '年') {
								this.addForm1.giveDateType = 1
							} else if(this.addForm1.giveDateType == '月') {
								this.addForm1.giveDateType = 2
							} else {
								this.addForm1.giveDateType = 3
							}
							if(this.addForm1.isActivate == '是') {
								this.addForm1.isActivate = 1
							} else {
								this.addForm1.isActivate = 0
							}
							this.$axios({
									url: this.path + 'member/card/add',
									method: 'put',
									data: {
										gymId: this.listQuery.gymId,
										kindId: this.addForm1.kindId,
										kindType: this.addForm1.kindType,
										memberId: this.addForm1.memberId,
										time: this.addForm1.time,
										dateType: this.addForm1.dateType,
										money: this.addForm1.money,
										giveDateType: this.addForm1.giveDateType,
										giveTime: this.addForm1.giveTime,
										payType: this.addForm1.payType,
										remark: this.addForm1.remark,
										salesman: this.addForm1.salesman,
										cardNum: this.addForm1.cardNum,
										isActivate: this.addForm1.isActivate,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm1'].resetFields();
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.addForm1.kindType = 1;
										this.addForm1.dateType = '年';
										this.addForm1.giveDateType = '月';

										this.addFormVisible = false;
										this.getData();
									} else {
                    if(this.addForm1.dateType == 1) {
                      this.addForm1.dateType = '年'
                    } else if(this.addForm1.dateType == 2) {
                      this.addForm1.dateType = '月'
                    } else if(this.addForm1.dateType == 3){
                      this.addForm1.dateType = '日'
                    }

                    if(this.addForm1.giveDateType == 1 ) {
                      this.addForm1.giveDateType = '年'
                    } else if(this.addForm1.giveDateType == 2) {
                      this.addForm1.giveDateType = '月'
                    } else if(this.addForm1.dateType == 3){
                      this.addForm1.giveDateType = '日'
                    }
                    if(this.addForm1.isActivate == '是') {
                      this.addForm1.isActivate = 1
                    } else {
                      this.addForm1.isActivate = 0
                    }
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			addSubmitForm2() {
				this.$refs.addForm2.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.addForm2.dateType == '年') {
								this.addForm2.dateType = 1
							} else if(this.addForm2.dateType == '月') {
								this.addForm2.dateType = 2
							} else {
								this.addForm2.dateType = 3
							}
							this.$axios({
									url: this.path + 'member/card/add',
									method: 'put',
									data: {
										gymId: this.listQuery.gymId,
										kindId: this.addForm2.kindId,
										kindType: this.addForm2.kindType,
										memberId: this.addForm2.memberId,
										time: this.addForm2.time,
										dateType: this.addForm2.dateType,
										money: this.addForm2.money,
										payType: this.addForm2.payType,
										remark: this.addForm2.remark,
										salesman: this.addForm2.salesman,
										cardNum: this.addForm2.cardNum,
										number: this.addForm2.number,
										giveNumber: this.addForm2.giveNumber,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addForm2'].resetFields();
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.addForm1.kindType = 1;
										this.addForm2.dateType = '年';
										this.addFormVisible = false;
										this.getData();
									} else {
                    if(this.addForm2.dateType == 1) {
                      this.addForm2.dateType = '年'
                    } else if(this.addForm2.dateType == 2) {
                      this.addForm2.dateType = '月'
                    } else {
                      this.addForm2.dateType = '日'
                    }
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			addSubmitForm3() {
				this.addForm3.kindId = this.addForm3.kindId.slice(0,32)
        var status = this.addForm3.status;
        if(this.isBuy == '是') {
          if(status == 1) {
						this.$refs.addForm3.validate((valid) => {
							if(valid) {
								this.$confirm('您确定要提交吗?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									if(this.addForm3.dateType == '年') {
										this.addForm3.dateType = 1
									} else if(this.addForm3.dateType == '月') {
										this.addForm3.dateType = 2
									} else {
										this.addForm3.dateType = 3
									}
									if(this.addForm3.isLeague == true) {
										this.addForm3.isLeague = 1
									} else {
										this.addForm3.isLeague = 0
									}

									if(this.addForm3.isPersonal == true) {
										this.addForm3.isPersonal = 1
									} else {
										this.addForm3.isPersonal = 0
									}

									if(this.addForm3.isActivate == '是') {
										this.addForm3.isActivate = 1
									} else {
										this.addForm3.isActivate = 0
									}
									this.$axios({
											url: this.path + 'member/card/add',
											method: 'put',
											data: {
												gymId: this.listQuery.gymId,
												kindId: this.addForm3.kindId,
												kindType: this.addForm3.kindType,
												memberId: this.addForm3.memberId,
												time: this.addForm3.time,
												dateType: this.addForm3.dateType,
												money: this.addForm3.money,
                        giveMoney:this.addForm3.giveMoney,
												payType: this.addForm3.payType,
												remark: this.addForm3.remark,
												salesman: this.addForm3.salesman,
												cardNum: this.addForm3.cardNum,
												isActivate: this.addForm3.isActivate,
												isLeague: this.addForm3.isLeague,
												isPersonal: this.addForm3.isPersonal
											},
											transformRequest: [function(data) {
												let ret = ''
												for(let it in data) {
													ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
												this.$message({
													message: '提交成功',
													type: 'success'
												});
												this.$refs['addForm3'].resetFields();
												this.type1 = true;
												this.type2 = false;
												this.type3 = false;
												this.addForm1.kindType = 1;
												this.addForm3.dateType = '年';
												this.addFormVisible = false;
												this.getData();
											} else {
                        if(this.addForm3.dateType == 1) {
                          this.addForm3.dateType = '年'
                        } else if(this.addForm3.dateType == 2) {
                          this.addForm3.dateType = '月'
                        } else {
                          this.addForm3.dateType = '日'
                        }
                        if(this.addForm3.isLeague == 1) {
                          this.addForm3.isLeague = true
                        } else {
                          this.addForm3.isLeague = false
                        }

                        if(this.addForm3.isPersonal == 1) {
                          this.addForm3.isPersonal = true
                        } else {
                          this.addForm3.isPersonal = false
                        }

                        if(this.addForm3.isActivate == 1) {
                          this.addForm3.isActivate = '是'
                        } else {
                          this.addForm3.isActivate = '否'
                        }
												this.$message({
                          message: res.data.message,
													type: 'error'
												});
											}
										})
										.catch((err) => {
											console.log(err);
										})
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '已取消提交'
									});
								});
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					} else {
						this.$alert('该卡只允许正式会员购买，该会员为非正式会员', '提示', {
							confirmButtonText: '确定'
						});
					}
				} else {
					this.$refs.addForm3.validate((valid) => {
						if(valid) {
							this.$confirm('您确定要提交吗?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								if(this.addForm3.dateType == '年') {
									this.addForm3.dateType = 1
								} else if(this.addForm3.dateType == '月') {
									this.addForm3.dateType = 2
								} else {
									this.addForm3.dateType = 3
								}
								if(this.addForm3.isLeague == true) {
									this.addForm3.isLeague = 1
								} else {
									this.addForm3.isLeague = 0
								}

								if(this.addForm3.isPersonal == true) {
									this.addForm3.isPersonal = 1
								} else {
									this.addForm3.isPersonal = 0
								}

								if(this.addForm3.isActivate == '是') {
									this.addForm3.isActivate = 1
								} else {
									this.addForm3.isActivate = 0
								}
								this.$axios({
										url: this.path + 'member/card/add',
										method: 'put',
										data: {
											gymId: this.listQuery.gymId,
											kindId: this.addForm3.kindId,
											kindType: this.addForm3.kindType,
											memberId: this.addForm3.memberId,
											time: this.addForm3.time,
											dateType: this.addForm3.dateType,
											money: this.addForm3.money,
                      giveMoney:this.addForm3.giveMoney,
											payType: this.addForm3.payType,
											remark: this.addForm3.remark,
											salesman: this.addForm3.salesman,
											cardNum: this.addForm3.cardNum,
											isActivate: this.addForm3.isActivate,
											isLeague: this.addForm3.isLeague,
											isPersonal: this.addForm3.isPersonal
										},
										transformRequest: [function(data) {
											let ret = ''
											for(let it in data) {
												ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
											this.$message({
												message: '提交成功',
												type: 'success'
											});
											this.$refs['addForm3'].resetFields();
											this.type1 = true;
											this.type2 = false;
											this.type3 = false;
											this.addForm1.kindType = 1;
											this.addForm3.dateType = '年';
											this.addFormVisible = false;
											this.getData();
										} else {
                      if(this.addForm3.dateType == 1) {
                        this.addForm3.dateType = '年'
                      } else if(this.addForm3.dateType == 2) {
                        this.addForm3.dateType = '月'
                      } else {
                        this.addForm3.dateType = '日'
                      }
                      if(this.addForm3.isLeague == 1) {
                        this.addForm3.isLeague = true
                      } else {
                        this.addForm3.isLeague = false
                      }

                      if(this.addForm3.isPersonal == 1) {
                        this.addForm3.isPersonal = true
                      } else {
                        this.addForm3.isPersonal = false
                      }

                      if(this.addForm3.isActivate == 1) {
                        this.addForm3.isActivate = '是'
                      } else {
                        this.addForm3.isActivate = '否'
                      }
											this.$message({
                        message: res.data.message,
												type: 'error'
											});
										}
									})
									.catch((err) => {
										console.log(err);
									})
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消提交'
								});
							});
						} else {
							console.log('error submit!!');
							return false;
						}
					});
				}
			},
			handleClose() {
				this.memberId = '';
				this.$refs['addForm1'].resetFields();
				this.$refs['addForm2'].resetFields();
				this.$refs['addForm3'].resetFields();
				this.type1 = true;
				this.type2 = false;
				this.type3 = false;
				this.addForm1.kindType = 1;
				this.addForm1.dateType = '年';
				this.addForm1.giveDateType = '月';
				this.addForm2.dateType = '年';
				this.addForm3.dateType = '年';
				this.addFormVisible = false;
			},
			handleEdit(row) {
				this.editForm1 = Object.assign({}, row);
				if(this.editForm1.dateType == 1) {
					this.editForm1.dateType = '年'
				} else if(this.editForm1.dateType == 2) {
					this.editForm1.dateType = '月'
				} else {
					this.editForm1.dateType = '天'
				}

				if(this.editForm1.giveDateType == 1) {
					this.editForm1.giveDateType = '年'
				} else if(this.editForm1.giveDateType == 2) {
					this.editForm1.giveDateType = '月'
				} else {
					this.editForm1.giveDateType = '天'
				}
				if(this.editForm1.isActivate == 1) {
					this.editForm1.isActivate = '是'
				} else {
					this.editForm1.isActivate = '否'
				}

				this.editForm2 = Object.assign({}, row);
				if(this.editForm2.dateType == 1) {
					this.editForm2.dateType = '年'
				} else if(this.editForm2.dateType == 2) {
					this.editForm2.dateType = '月'
				} else {
					this.editForm2.dateType = '天'
				}
				this.editForm3 = Object.assign({}, row);
				if(this.editForm3.dateType == 1) {
					this.editForm3.dateType = '年'
				} else if(this.editForm3.dateType == 2) {
					this.editForm3.dateType = '月'
				} else {
					this.editForm3.dateType = '天'
				}
				if(this.editForm3.isLeague == 1) {
					this.editForm3.isLeague = true
				} else {
					this.editForm3.isLeague = false
				}

				if(this.editForm3.isPersonal == 1) {
					this.editForm3.isPersonal = true
				} else {
					this.editForm3.isPersonal = false
				}

				if(this.editForm3.isActivate == 1) {
					this.editForm3.isActivate = '是'
				} else {
					this.editForm3.isActivate = '否'
				}

				if(row.kindType == 1) {
					this.type1 = true;
					this.type2 = false;
					this.type3 = false;
				} else if(row.kindType == 2) {
					this.type1 = false;
					this.type2 = true;
					this.type3 = false;
				} else if(row.kindType == 3) {
					this.type1 = false;
					this.type2 = false;
					this.type3 = true;
				}
				this.getCardName(row.kindType);
				this.getMemberList();
				this.getSaleList();
				this.kindSelect(row.kindId);
				this.editFormVisible = true;
			},
			editSubmitForm1() {
				this.$refs.editForm1.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.editForm1.dateType == '年') {
								this.editForm1.dateType = 1
							} else if(this.editForm1.dateType == '月') {
								this.editForm1.dateType = 2
							} else {
								this.editForm1.dateType = 3
							}

							if(this.editForm1.giveDateType == '年') {
								this.editForm1.giveDateType = 1
							} else if(this.editForm1.giveDateType == '月') {
								this.editForm1.giveDateType = 2
							} else {
								this.editForm1.giveDateType = 3
							}
							if(this.editForm1.isActivate == '是') {
								this.editForm1.isActivate = 1
							} else {
								this.editForm1.isActivate = 0
							}
							this.$axios({
									url: this.path + 'member/card/update',
									method: 'post',
									data: {
										id: this.editForm1.id,
										gymId: this.editForm1.gymId,
										kindId: this.editForm1.kindId,
										kindType: this.editForm1.kindType,
										memberId: this.editForm1.memberId,
										time: this.editForm1.time,
										dateType: this.editForm1.dateType,
										money: this.editForm1.money,
										giveDateType: this.editForm1.giveDateType,
										giveTime: this.editForm1.giveTime,
										payType: this.editForm1.payType,
										remark: this.editForm1.remark,
										salesman: this.editForm1.salesman,
										cardNum: this.editForm1.cardNum,
										isActivate: this.editForm1.isActivate,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm1'].resetFields();
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.editForm1.kindType = 1;
										this.editForm1.dateType = '年';
										this.editForm1.giveDateType = '月';

										this.editFormVisible = false;
										this.getData();
									} else if(res.data.code === 300045){
                    if(this.editForm1.dateType == 1) {
                      this.editForm1.dateType = '年'
                    } else if(this.editForm1.dateType == 2) {
                      this.editForm1.dateType = '月'
                    } else if(this.editForm1.dateType == 3){
                      this.editForm1.dateType = '日'
                    }

                    if(this.editForm1.giveDateType == 1 ) {
                      this.editForm1.giveDateType = '年'
                    } else if(this.editForm1.giveDateType == 2) {
                      this.editForm1.giveDateType = '月'
                    } else if(this.editForm1.dateType == 3){
                      this.editForm1.giveDateType = '日'
                    }
                    if(this.editForm1.isActivate == '是') {
                      this.editForm1.isActivate = 1
                    } else {
                      this.editForm1.isActivate = 0
                    }
										this.$message({
											message: res.data.message,
											type: 'error'
										});
									} else {
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			editSubmitForm2() {
				this.$refs.editForm2.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.editForm2.dateType == '年') {
								this.editForm2.dateType = 1
							} else if(this.editForm2.dateType == '月') {
								this.editForm2.dateType = 2
							} else {
								this.editForm2.dateType = 3
							}
							this.$axios({
									url: this.path + 'member/card/update',
									method: 'post',
									data: {
										id: this.editForm2.id,
										gymId: this.editForm2.gymId,
										kindId: this.editForm2.kindId,
										kindType: this.editForm2.kindType,
										memberId: this.editForm2.memberId,
										time: this.editForm2.time,
										dateType: this.editForm2.dateType,
										money: this.editForm2.money,
										payType: this.editForm2.payType,
										remark: this.editForm2.remark,
										salesman: this.editForm2.salesman,
										cardNum: this.editForm2.cardNum,
										number: this.editForm2.number,
										giveNumber: this.editForm2.giveNumber,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editForm2'].resetFields();
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.editForm1.kindType = 1;
										this.editForm2.dateType = '年';
										this.editFormVisible = false;
										this.getData();
									} else if(res.data.code === 300045){
                    if(this.editForm2.dateType == 1) {
                      this.editForm2.dateType = '年'
                    } else if(this.editForm2.dateType == 2) {
                      this.editForm2.dateType = '月'
                    } else {
                      this.editForm2.dateType = '日'
                    }
										this.$message({
											message: res.data.message,
											type: 'error'
										});
									} else {
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消提交'
							});
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			editSubmitForm3() {
				this.editForm3.kindId = this.editForm3.kindId.slice(0,32)
					this.$refs.editForm3.validate((valid) => {
						if(valid) {
							this.$confirm('您确定要提交吗?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								if(this.editForm3.dateType == '年') {
									this.editForm3.dateType = 1
								} else if(this.editForm3.dateType == '月') {
									this.editForm3.dateType = 2
								} else {
									this.editForm3.dateType = 3
								}
								if(this.editForm3.isLeague == true) {
									this.editForm3.isLeague = 1
								} else {
									this.editForm3.isLeague = 0
								}

								if(this.editForm3.isPersonal == true) {
									this.editForm3.isPersonal = 1
								} else {
									this.editForm3.isPersonal = 0
								}

								if(this.editForm3.isActivate == '是') {
									this.editForm3.isActivate = 1
								} else {
									this.editForm3.isActivate = 0
								}
								this.$axios({
										url: this.path + 'member/card/update',
										method: 'post',
										data: {
											id: this.editForm3.id,
											gymId: this.editForm3.gymId,
											kindId: this.editForm3.kindId,
											kindType: this.editForm3.kindType,
											memberId: this.editForm3.memberId,
											time: this.editForm3.time,
											dateType: this.editForm3.dateType,
											money: this.editForm3.money,
                      giveMoney:this.editForm3.giveMoney,
											payType: this.editForm3.payType,
											remark: this.editForm3.remark,
											salesman: this.editForm3.salesman,
											cardNum: this.editForm3.cardNum,
											isActivate: this.editForm3.isActivate,
											isLeague: this.editForm3.isLeague,
											isPersonal: this.editForm3.isPersonal
										},
										transformRequest: [function(data) {
											let ret = ''
											for(let it in data) {
												ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
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
											this.$message({
												message: '提交成功',
												type: 'success'
											});
											this.$refs['editForm3'].resetFields();
											this.type1 = true;
											this.type2 = false;
											this.type3 = false;
											this.editForm1.kindType = 1;
											this.editForm3.dateType = '年';
											this.editFormVisible = false;
											this.getData();
										} else if(res.data.code === 300045){
                      if(this.editForm3.dateType == 1) {
                        this.editForm3.dateType = '年'
                      } else if(this.editForm3.dateType == 2) {
                        this.editForm3.dateType = '月'
                      } else {
                        this.editForm3.dateType = '日'
                      }
                      if(this.editForm3.isLeague == 1) {
                        this.editForm3.isLeague = true
                      } else {
                        this.editForm3.isLeague = false
                      }

                      if(this.editForm3.isPersonal == 1) {
                        this.editForm3.isPersonal = true
                      } else {
                        this.editForm3.isPersonal = false
                      }

                      if(this.editForm3.isActivate == 1) {
                        this.editForm3.isActivate = '是'
                      } else {
                        this.editForm3.isActivate = '否'
                      }
										this.$message({
											message: res.data.message,
											type: 'error'
										});
									} else {
										this.$message({
                      message: res.data.message,
											type: 'error'
										});
									}
									})
									.catch((err) => {
										console.log(err);
									})
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消提交'
								});
							});
						} else {
							console.log('error submit!!');
							return false;
						}
					});
//				}
			},
			handleEditClose() {
				//				this.memberId ='';
				//				this.$refs['editForm1'].resetFields();
				//				this.$refs['editForm2'].resetFields();
				//				this.$refs['editForm3'].resetFields();
				//				this.type1 = true;
				//				this.type2 = false;
				//				this.type3 = false;
				//				this.addForm1.kindType = 1;
				//				this.addForm1.dateType = '年';
				//				this.addForm1.giveDateType = '月';
				//				this.addForm2.dateType = '年';
				//				this.addForm3.dateType = '年';
				this.editFormVisible = false;
			}
		}
	}
</script>

<style type="text/css">
	.plugins-tips {
		padding: 10px;
	}
	.consume .el-checkbox{
		width: 120px;
	}
	.count {
		font-size: 14px;
		line-height: 40px;
		height: 40px;
		padding-left: 10px;
		background-color: #FCFCFC;
	}

	.gym-group {
		border: 1px solid #f1f1f1;
		padding: 10px;
	}

	.more {
		margin-bottom: 20px;
	}

	.more a {
		font-size: 14px;
		color: #F9690E;
	}

	.userphoto img {
		width: 50px;
		height: 50px;
		border-radius: 100%;
	}
</style>
