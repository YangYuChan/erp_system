<template>
	<div class="table">
		<!--查询-->
		<div class="plugins-tips">
			<el-form :model="listQuery" label-width="100px">
				<el-form-item style="margin-bottom: 0;" label="会员所属场地">
					<el-select v-model="listQuery.gymId" placeholder="全部" :clearable=true @change="getOtherData">
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 会员管理</el-breadcrumb-item>
				<el-breadcrumb-item>会员列表</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-form :inline="true" :model="listQuery" class="demo-form-inline">
			<el-form-item>
				<el-input v-model="listQuery.keyword" placeholder="输入会员姓名/手机号" :clearable=true></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="listQuery.cardNum" placeholder="设备号或卡号" :clearable=true></el-input>
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
				<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加会员</el-button>
			</el-form-item>
			<div class="more">
				<a href="javascript:;" @click="moreFilter =!moreFilter">更多筛选<i class="icon iconfont icon-arrow-down"></i></a>
			</div>
			<div v-show="moreFilter">
				<el-form-item label="筛选条件">
					<el-select v-model="listQuery.month" placeholder="生日" :clearable=true @change="getData">
						<el-option v-for="item in monthList" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="listQuery.sex" placeholder="性别" :clearable=true @change="getData">
						<el-option v-for="item in sexType" :key="item.id" :label="item.value" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<div style="margin-left: 68px;">
					<el-form-item>
						<el-select v-model="listQuery.staffName" placeholder="输入销售姓名" filterable :clearable=true @change="getData">
							<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.coachInfo" placeholder="输入教练姓名/手机号" filterable :clearable=true @change="getData">
							<el-option v-for="item in coachList" :key="item.id" :label="item.name+' '+item.phone" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div style="margin-left: 68px;">
					<el-form-item>
						<el-input v-model="listQuery.referrer" placeholder="输入推荐人姓名" :clearable=true style="width: 217px;"></el-input>
					</el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</div>

				<el-form-item label="注册日期">
					<el-date-picker :picker-options="pickerOptions1" v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" :editable=true end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable=true @change="getData">
					</el-date-picker>
				</el-form-item>
				<br />

			</div>

		</el-form>
		<p class="count">用户总数：{{total}}</p>
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column label="头像&姓名">
				<template slot-scope="scope">
					<span class="userphoto"><img :src="scope.row.photo"/></span>
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="sex" label="性别">
				<template slot-scope="scope">
					<span v-if="scope.row.sex == 0">男</span>
					<span v-else-if="scope.row.sex == 1">女</span>
				</template>
			</el-table-column>
			<el-table-column prop="phone" label="手机号"></el-table-column>
			<el-table-column prop="staffName" label="销售"></el-table-column>
			<el-table-column prop="followStaffBeans" label="销售跟进">
				<template slot-scope="scope">
				<p v-for="item in scope.row.followStaffBeans">
								{{item.name}}
							</p>
							</template>
			</el-table-column>
			<el-table-column prop="coachName" label="教练"></el-table-column>
			<el-table-column prop="followCoachBeans" label="教练跟进">
					<template slot-scope="scope">
				<p v-for="item in scope.row.followCoachBeans">
								{{item.name}}
							</p>
							</template>
			</el-table-column>

			<el-table-column prop="status" label="会员状态">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 1">正式会员</span>
					<span v-else-if="scope.row.status == 2">潜在会员</span>
					<span v-else-if="scope.row.status == 3">过期会员</span>
				</template>
			</el-table-column>
			<el-table-column prop="source" label="来源"></el-table-column>
			<el-table-column prop="referrer" label="推荐人"></el-table-column>
			<el-table-column prop="createTime" label="注册时间"></el-table-column>
			<el-table-column prop="remark" label="备注"></el-table-column>
			<el-table-column label="操作" width="250">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" type="success" @click="handleApplyCard(scope.row)">办卡</el-button>
					<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-dialog :visible.sync="addCardVisible" title="会员办卡" width="600px" :before-close="handleCardClose" :closeOnClickModal="false">
			<div class="type1" v-show="type1">
				<el-form ref="addForm1" :model="addForm1" label-width="160px" :rules="addRules1" class="form-container">
					<el-form-item label="售卖场地：" prop="cardGymId">
						<el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm1.kindType)">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id" ></el-option>
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
					<el-form-item label="会员名称：" prop="name">
						<el-input v-model="addForm1.name" disabled></el-input>
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
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm1.contractNo"></el-input>
          </el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm1.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleCardClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm1">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type2" v-show="type2">
				<el-form ref="addForm2" :model="addForm2" label-width="160px" :rules="addRules2" class="form-container">
					<el-form-item label="售卖场地：" prop="cardGymId">
						<el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm2.kindType)">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="addForm2.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm2.kindType)" required>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="addForm2.kindId" placeholder="请选择会员卡名称" :clearable=false required>
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="name">
						<el-input v-model="addForm2.name" disabled></el-input>
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
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm2.contractNo"></el-input>
          </el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm2.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleCardClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm2">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="type3" v-show="type3">
				<el-form ref="addForm3" :model="addForm3" label-width="160px" :rules="addRules3" class="form-container">
					<el-form-item label="售卖场地：" prop="cardGymId">
						<el-select v-model="cardGymId" placeholder="请选择售卖场地" @change="selectCardType(cardGymId,addForm3.kindType)">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡类型：" prop="kindType">
						<el-select v-model="addForm3.kindType" placeholder="请选择会员卡类型" :clearable=false @change="handleAddForm(addForm3.kindType)" required>
							<el-option v-for="item in typeData" :key="item.id" :label="item.value" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员卡名称：" prop="kindId">
						<el-select v-model="addForm3.kindId" placeholder="请选择会员卡名称" :clearable=false required>
							<el-option v-for="item in cardList" :key="item.id" :label="item.kindName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会员名称：" prop="name">
						<el-input v-model="addForm3.name" disabled></el-input>
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
						<el-input v-model="addForm3.giveMoney" style="width: 111px;"></el-input>
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
          <el-form-item label="合同编号：" prop="contractNo">
            <el-input v-model="addForm3.contractNo"></el-input>
          </el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input v-model="addForm3.remark"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleCardClose">取消</el-button>
						<el-button type="primary" @click="addSubmitForm3">提交</el-button>
					</el-form-item>
				</el-form>
			</div>

		</el-dialog>
		<el-dialog :visible.sync="addFormVisible" title="添加会员" width="600px" :before-close="handleClose" :closeOnClickModal="false">
			<el-form ref="addForm" :model="addForm" label-width="120px" :rules="addRules" class="form-container">
				<el-form-item label="所属场地选择">
					<el-select v-model="listQuery.gymId" placeholder="全部" readonly disabled>
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="头像：" prop="photo">
					<el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="addUserImg" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
						<img v-if="addForm.photo" :src="addForm.photo" class="avatar" style="width:120px;height: 120px;">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<template>
						<span style="color:#999999">(点击图片重新上传)</span>
					</template>
				</el-form-item>
				<el-form-item label="性别：" prop="sex">
					<el-radio label="男" v-model="addForm.sex"></el-radio>
					<el-radio label="女" v-model="addForm.sex"></el-radio>
				</el-form-item>
				<el-form-item label="手机号：" prop="phone">
					<el-input v-model.number="addForm.phone"></el-input>
				</el-form-item>

				<el-form-item label="身份证号：" prop="cardNo">
					<el-input v-model="addForm.cardNo" @blur="setBirthday(addForm.cardNo)"></el-input>
				</el-form-item>
				<el-form-item label="生日：" prop="birthday">
					<el-input v-model="addForm.birthday" readonly></el-input>
				</el-form-item>
				<el-form-item label="地址：" prop="address">
					<el-input v-model="addForm.address"></el-input>
				</el-form-item>
				<el-form-item label="销售：" prop="staffId">
					<el-select v-model="addForm.staffId" placeholder="请选择销售" filterable>
						<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销售跟进：" prop="addfollowStaff">
					<div class="checkbox-list">
						<el-checkbox-group v-model="addfollowStaff">
					    <el-checkbox v-for="item in saleList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="教练：" prop="coachId">
					<el-select v-model="addForm.coachId" placeholder="请选择教练" filterable>
						<el-option v-for="item in coachList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教练跟进：" prop="addfollowCoach">
					<div class="checkbox-list">
						<el-checkbox-group v-model="addfollowCoach">
					    <el-checkbox v-for="item in coachList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="来源：" prop="source">
					<el-input v-model="addForm.source"></el-input>
				</el-form-item>
				<el-form-item label="推荐人：" prop="referrer">
					<el-input v-model="addForm.referrer"></el-input>
				</el-form-item>
				<el-form-item label="备注：" prop="remark">
					<el-input v-model="addForm.remark" type="textarea"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="handleClose">取消</el-button>
					<el-button type="primary" @click="addSubmitForm">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--编辑会员-->
		<el-dialog :visible.sync="editFormVisible" title="编辑会员" width="600px" :closeOnClickModal="false">
			<el-form ref="editForm" :model="editForm" label-width="120px" :rules="addRules" class="form-container">
				<el-form-item label="所属场地选择">
					<el-select v-model="editForm.gymId" placeholder="全部"  readonly disabled>
						<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="头像：" prop="photo">
					<el-upload class="avatar-uploader" :action="uploadUrl()" :on-success="editUserImg" :before-upload="beforeAvatarUpload" :show-file-list="false" :headers="uploadHeaders()">
						<img v-if="editForm.photo" :src="editForm.photo" class="avatar" style="width:120px;height: 120px;">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<template>
						<span style="color:#999999">(点击图片重新上传)</span>
					</template>
				</el-form-item>
				<el-form-item label="性别：" prop="sex">
					<el-radio label="男" v-model="editForm.sex"></el-radio>
					<el-radio label="女" v-model="editForm.sex"></el-radio>
				</el-form-item>
				<el-form-item label="手机号：" prop="phone">
					<el-input v-model.number="editForm.phone"></el-input>
				</el-form-item>

				<el-form-item label="身份证号：" prop="cardNo">
					<el-input v-model="editForm.cardNo" @blur="setBirthday(editForm.cardNo)"></el-input>
				</el-form-item>
				<el-form-item label="生日：" prop="birthday">
					<el-input v-model="editForm.birthday" readonly></el-input>
				</el-form-item>
				<el-form-item label="地址：" prop="address">
					<el-input v-model="editForm.address"></el-input>
				</el-form-item>
				<el-form-item label="销售：" prop="staffId">
					<el-select v-model="editForm.staffId" placeholder="请选择销售" filterable>
						<el-option v-for="item in saleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销售跟进：" prop="editfollowStaff">
					<div class="checkbox-list">
						<el-checkbox-group v-model="editfollowStaff">
					    <el-checkbox v-for="item in saleList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="教练：" prop="coachId">
					<el-select v-model="editForm.coachId" placeholder="请选择教练" filterable>
						<el-option v-for="item in coachList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教练跟进：" prop="editfollowCoach">
					<div class="checkbox-list">
						<el-checkbox-group v-model="editfollowCoach">
					    <el-checkbox v-for="item in coachList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
					</div>
				</el-form-item>
				<el-form-item label="来源：" prop="source">
					<el-input v-model="editForm.source"></el-input>
				</el-form-item>
				<el-form-item label="推荐人：" prop="referrer">
					<el-input v-model="editForm.referrer"></el-input>
				</el-form-item>
				<el-form-item label="备注：" prop="remark">
					<el-input v-model="editForm.remark" type="textarea"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click="editSubmitForm">提交</el-button>
				</el-form-item>
			</el-form>
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
				action: global_.action,
				token: '',
				pickerOptions1: {
					firstDayOfWeek: 1
				},
				type1: true,
				type2: false,
				type3: false,
				listLoading: false,
				loading: false,
				imgLoading: false,
				total: 0,
				moreFilter: false,
				monthList: [{
					id: 1,
					value: '一月'
				}, {
					id: 2,
					value: '二月'
				}, {
					id: 3,
					value: '三月'
				}, {
					id: 4,
					value: '四月'
				}, {
					id: 5,
					value: '五月'
				}, {
					id: 6,
					value: '六月'
				}, {
					id: 7,
					value: '七月'
				}, {
					id: 8,
					value: '八月'
				}, {
					id: 9,
					value: '九月'
				}, {
					id: 10,
					value: '十月'
				}, {
					id: 11,
					value: '十一月'
				}, {
					id: 12,
					value: '十二月'
				}],
				sexType: [{
					id: 0,
					value: '男'
				}, {
					id: 1,
					value: '女'
				}],
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
				dateTime: '',
				listQuery: {
					page: 1,
					limit: 10,
					gymId: '',
					keyword: '',
					coachInfo: '',
					staffId: '',
					referrer: '',
					cardNum: '',
					startTime: '',
					endTime: '',
					sex: '',
					month: '',
					status: '',
				},
				addFormVisible: false,
				editFormVisible: false,
				saleList: [],
				coachList: [],
				addForm: {
					gymId: '',
					name: '',
					photo: '',
					sex: '男',
					phone: '',
					cardNo: '',
					birthday: '',
					address: '',
					staffId: '',
					followStaff: '',
					coachId: '',
					followCoach: '',
					source: '',
					referrer: '',
					remark: '',
				},
				addfollowStaff:[],
				addfollowCoach:[],
				editfollowStaff:[],
				editfollowCoach:[],
				editForm: {
					gymId: '',
					name: '',
					photo: '',
					sex: '',
					phone: '',
					cardNo: '',
					birthday: '',
					address: '',
					staffId: '',
					followStaff: '',
					coachId: '',
					followCoach: '',
					source: '',
					referrer: '',
					remark: '',
				},
				addRules: {
					name: [{
						required: true,
						message: '请输入会员姓名',
						trigger: 'blur'
					}],
					sex: [{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						validator: valid.checkUserPhone,
						trigger: 'blur'
					}],
					staffId: [{
						required: true,
						message: '请选择销售人员',
						trigger: 'change'
					}],
					cardNo: [{
						required: false,
						validator: valid.cardNo,
						trigger: 'blur'
					}],
				},
				beginTime: [],
				endTime: [],
				addCardVisible: false,
				type1: true,
				type2: false,
				type3: false,
				moreFilter: false,

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
          value: '微信支付'
        }, {
          id: 2,
          value: '支付宝支付'
        }, {
          id: 3,
          value: '现金支付'
        }, {
          id: 4,
          value: 'pos机支付'
        },
          {
            id: 5,
            value: '银联支付'
          },
          {
            id: 6,
            value: '其他方式支付'
          }
				],
				usrGymList: [],
				sellGymList: [],
				cardList: [],
				memberList: [],
				saleList: [],
				worth: '',
				isBuy: '是',
				filterGymId:'',
				cardType:'',
				cardGymId:'',
				addForm1: {
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
					giveDateType: '月',
					giveTime: '',
					payType: 3,
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '否',
          contractNo:'',
				},
				addForm2: {
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
					payType: 3,
					remark: '',
					salesman: '',
					cardNum: '',
					number: '',
					giveNumber: '',
          contractNo:'',
				},
				addForm3: {
					kindId: '',
					kindType: '',
					memberId: '',
					time: '',
					dateType: '年',
					money: '',
          giveMoney:'',
					payType: 3,
					remark: '',
					salesman: '',
					cardNum: '',
					isActivate: '否',
					isLeague: '',
					isPersonal: '',
          contractNo:''
				},
				addRules1: {
					gymId: [{
						required: true,
						message: '请选择售卖场地',
						trigger: 'change'
					}],
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
            validator: valid.checkValidTime,
						trigger: 'blur'
					}],
					money: [{
						required: true,
						message: '请输入实收金额',
						trigger: 'blur'
					}],
				},
				addRules2: {
					gymId: [{
						required: true,
						message: '请选择售卖场地',
						trigger: 'change'
					}],
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
					gymId: [{
						required: true,
						message: '请选择售卖场地',
						trigger: 'change'
					}],
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
				this.getData()
				this.getCoachList();
				this.getSaleList();
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
					})
					.catch((err) => {
						console.log(err);
					})
			},

			getTotal() {
				this.$axios({
						url: this.path + 'member/count',
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
				if(this.dateTime != null && this.dateTime != '') {
					this.listQuery.startTime = this.dateTime[0];
					this.listQuery.endTime = this.dateTime[1];
				} else {
					this.listQuery.startTime = ''
					this.listQuery.endTime = ''
				}
				this.listLoading = true;
				this.$axios({
						url: this.path + 'member/list',
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
        this.listQuery.page = 1;
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
				this.getCoachList(this.listQuery.gymId);
				this.getSaleList(this.listQuery.gymId);
				this.addFormVisible = true;
			},
			setBirthday(val) {
				this.addForm.birthday = val.slice(6, 14);
				this.editForm.birthday = val.slice(6, 14);
			},
			getOtherData(){
				this.handleFilter();
				this.listQuery.staffName = '';
				this.listQuery.coachInfo = '';
				this.getSaleList(this.listQuery.gymId);
				this.getCoachList(this.listQuery.gymId);
			},
			handleDelete(row) {
				this.$confirm('您确定要删除该数据吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios({
							url: this.path + 'member/delete/' + row.id,
							method: 'DELETE',
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
									message: '删除成功',
									type: 'success'
								});
								this.getData();
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
						message: '已取消删除'
					});
				});
			},
			getSaleList(gymId) {
				if(gymId == null){
					gymId = '';
				}
				this.$axios({
						url: this.path + 'staff/sell/list?gymId='+gymId,
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
							console.log(this.saleList)
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getCoachList(gymId) {
				if(gymId == null){
					gymId = '';
				}
				this.$axios({
						url: this.path + 'staff/coach/list?gymId='+gymId,
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
							this.coachList = res.data.result;
						}
					})
					.catch((err) => {
						console.log(err);
					})
			},
			addSubmitForm() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.addForm.sex == '男') {
								this.addForm.sex = 0
							} else {
								this.addForm.sex = 1
							}
							this.addForm.followStaff = this.addfollowStaff.join(",");
							this.addForm.followCoach = this.addfollowCoach.join(",");
							this.$axios({
									url: this.path + 'member/add',
									method: 'put',
									data: {
										gymId: this.listQuery.gymId,
										name: this.addForm.name,
										photo: this.addForm.photo,
										sex: this.addForm.sex,
										phone: this.addForm.phone,
										cardNo: this.addForm.cardNo,
										birthday: this.addForm.birthday,
										address: this.addForm.address,
										staffId: this.addForm.staffId,
										followStaff: this.addForm.followStaff,
										coachId: this.addForm.coachId,
										followCoach: this.addForm.followCoach,
										source: this.addForm.source,
										referrer: this.addForm.referrer,
										remark: this.addForm.remark,
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
										this.$refs['addForm'].resetFields();
										this.addfollowStaff = [];
										this.addfollowCoach = [];
										this.addFormVisible = false;
										this.getData();
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
			handleEdit(row) {
				this.editfollowCoach = [];
				this.editfollowStaff = [];
				this.editForm = Object.assign({}, row);
				if(this.editForm.sex == 0) {
					this.editForm.sex = '男'
				} else {
					this.editForm.sex = '女'
				}
				var coach = row.followCoachBeans;
				var staff = row.followStaffBeans;
				for(var i = 0;i<coach.length;i++){
					this.editfollowCoach.push(coach[i].staffId);
				}
				for(var i = 0;i<staff.length;i++){
					this.editfollowStaff.push(staff[i].staffId);
				}
				this.getSaleList(this.editForm.gymId);
				this.getCoachList(this.editForm.gymId);
				this.editFormVisible = true;
			},
			editSubmitForm() {
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							if(this.editForm.sex == '男') {
								this.editForm.sex = 0
							} else {
								this.editForm.sex = 1
							}
							if(this.editForm.birthday == null){
								this.editForm.birthday = ''
							}
							if(this.editForm.gymId == null){
                this.editForm.gymId =''
              }
							this.editForm.followStaff = this.editfollowStaff.join(",");
							this.editForm.followCoach = this.editfollowCoach.join(",");
							this.$axios({
									url: this.path + 'member/update',
									method: 'post',
									data: {
										gymId: this.editForm.gymId,
										id: this.editForm.id,
										name: this.editForm.name,
										photo: this.editForm.photo,
										sex: this.editForm.sex,
										phone: this.editForm.phone,
										cardNo: this.editForm.cardNo,
										birthday: this.editForm.birthday,
										address: this.editForm.address,
										staffId: this.editForm.staffId,
										followStaff: this.editForm.followStaff,
										coachId: this.editForm.coachId,
										followCoach: this.editForm.followCoach,
										source: this.editForm.source,
										referrer: this.editForm.referrer,
										remark: this.editForm.remark,
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
										this.$refs['editForm'].resetFields();
										this.editfollowStaff = [];
										this.editfollowCoach = [];
										this.editFormVisible = false;
										this.getData();
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
			//上传教练
			addUserImg(res, file) {
				this.addForm.photo = res;
			},
			editUserImg(res, file) {
				this.editForm.photo = res;
			},
			//banner
			uploadUrl() {
				return this.action
			},
			uploadHeaders() {
				var headers = {
					'Authorization': this.token
				}
				return headers
			},
			beforeAvatarUpload(file) {
				let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
				const isJPG = supportedTypes.indexOf(file.type)
				const isLt2M = file.size / 1024 / 1024 < 3;
				if(isJPG < 0) {
					this.$message.error('上传头像图片格式错误!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 3MB!');
				}
				return isJPG && isLt2M;
			},
			handleClose() {
				this.$refs['addForm'].resetFields();
				this.addFormVisible = false;
			},
			handleApplyCard(row) {
				this.addForm1.kindType = 1;
				this.addForm1.name = row.name;
				this.addForm1.memberId = row.id;
				this.addForm2.name = row.name;
				this.addForm2.memberId = row.id;
				this.addForm3.name = row.name;
				this.addForm3.memberId = row.id;
				this.addForm3.status = row.status;
				this.getCardName(this.filterGymId,this.addForm1.kindType);
				this.getMemberList();
				this.getSaleList();
				this.getType();
				this.addCardVisible = true;
			},
			handleAddForm(type) {
				this.filterGymId = '';
				if(type == 1) {
					this.addForm1.kindType = 1;
					this.type1 = true;
					this.type2 = false;
					this.type3 = false;
					this.cardType = 1;
					this.getCardName(this.filterGymId,this.cardType);
				} else if(type == 2) {
					this.addForm2.kindType = 2;
					this.type1 = false;
					this.type2 = true;
					this.type3 = false;
					this.cardType = 2;
					this.getCardName(this.filterGymId,this.cardType);
				} else {
					this.addForm3.kindType = 3;
					this.type1 = false;
					this.type2 = false;
					this.type3 = true;
					this.cardType = 3;
					this.getCardName(this.filterGymId,this.cardType);
				}

			},
			selectCardType(id,type){
				this.filterGymId = id;
				this.cardType = type
				this.getCardName(this.filterGymId,this.cardType);
			},
			getCardName(filterGymId,cardType) {
				this.$axios({
						url: this.path + 'member/kind/list?gymId='+filterGymId+'&page=0&status=0&type=' + cardType,
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
										gymId:this.cardGymId,
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
                    contractNo:this.addForm1.contractNo,
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
										this.cardGymId ='',
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.addForm1.kindType = 1;
										this.addForm1.dateType = '年';
										this.addForm1.giveDateType = '月';

										this.addCardVisible = false;
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
										gymId:this.cardGymId,
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
                    contractNo:this.addForm2.contractNo,
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
										this.cardGymId ='',
										this.type1 = true;
										this.type2 = false;
										this.type3 = false;
										this.addForm1.kindType = 1;
										this.addForm2.dateType = '年';
										this.addCardVisible = false;
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
											gymId:this.cardGymId,
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
											isPersonal: this.addForm3.isPersonal,
                      contractNo:this.addForm3.contractNo,
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
											this.cardGymId ='',
											this.type1 = true;
											this.type2 = false;
											this.type3 = false;
											this.addForm1.kindType = 1;
											this.addForm3.dateType = '年';
											this.addCardVisible = false;
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
				}else{
					this.$refs.addForm3.validate((valid) => {
						if(valid) {
							this.$confirm('您确定要提交吗?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {

								var status = this.addForm3.status;

								if(this.addForm3.dateType == '年') {
									this.addForm3.dateType = 1
								} else if(this.addForm3.dateType == '月') {
									this.addForm3.dateType = 2
								} else {
									this.addForm3.dateType = 3
								}
								if(this.addForm3.isLeague == '是') {
									this.addForm3.isLeague = 1
								} else {
									this.addForm3.isLeague = 0
								}

								if(this.addForm3.isPersonal == '是') {
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
											gymId:this.cardGymId,
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
											isPersonal: this.addForm3.isPersonal,
                      contractNo:this.addForm3.contractNo,
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
											this.cardGymId ='',
											this.addForm1.kindType = 1;
											this.addForm3.dateType = '年';
											this.addCardVisible = false;
											this.getData();
										} else {
                      if(this.addForm3.dateType == 1) {
                        this.addForm3.dateType = '年'
                      } else if(this.addForm3.dateType == 2) {
                        this.addForm3.dateType = '月'
                      } else {
                        this.addForm3.dateType = '日'
                      }
                      if(this.addForm3.isPersonal == 1) {
                        this.addForm3.isPersonal = '私教课'
                      } else {
                        this.addForm3.isPersonal = ''
                      }

                      if(this.addForm3.isActivate == 1) {
                        this.addForm3.isActivate = '团课'
                      } else {
                        this.addForm3.isActivate = ''
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
			handleCardClose(){
				this.memberId ='';
				this.$refs['addForm1'].resetFields();
				this.$refs['addForm2'].resetFields();
				this.$refs['addForm3'].resetFields();
				this.cardGymId ='',
				this.type1 = true;
				this.type2 = false;
				this.type3 = false;
				this.addForm1.kindType = 1;
				this.addForm1.dateType = '年';
				this.addForm1.giveDateType = '月';
				this.addForm2.dateType = '年';
				this.addForm3.dateType = '年';
				this.addCardVisible = false;
			},
		}
	}
</script>

<style type="text/css">
	.plugins-tips {
		padding: 10px;
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
	.consume .el-checkbox{
		width: 120px;
	}
	.checkbox-list .el-checkbox{
		width: 100px;
	}
	.checkbox-list .el-checkbox+.el-checkbox{
		margin-right: 0!important;
	}

</style>
