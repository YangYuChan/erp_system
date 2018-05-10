<template>

  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i> 未度App管理</el-breadcrumb-item>
        <el-breadcrumb-item>未度App管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--查询-->
    <div class="plugins-tips">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <!--<el-form-item label="条件筛选">
          <el-select v-model="listQuery.isChain" style="width:130px" placeholder="是否连锁" clearable>
            <el-option v-for="item in chainData" :key="item.id" :label="item.value" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <!--<template v-if="listQuery.isChain === 1">
          <el-form-item>
            <el-select v-model="listQuery.brandId" placeholder="请选择连锁品牌" clearable>
              <el-option v-for="item in brandData" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template>-->
        <el-form-item>
          <el-input v-model="listQuery.keyword" placeholder="输入场馆名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.typeId" placeholder="请选择场馆类型" clearable @change="getData">
            <el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter()">查询</el-button>
        </el-form-item>
        <span v-if="addGymAuto == 0"></span>
        <span v-else-if="addGymAuto == 1">
        <el-form-item style="float: right;">
							<el-button type="primary" icon="el-icon-plus" @click="handleAdd()">添加场馆</el-button>
						</el-form-item>
        </span>
        <div style="margin-top:20px;">
          <el-form-item>
            <template>
              <div id="app">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleAreaChange" placeholder="请选择省/市/区">
                </el-cascader>
              </div>
            </template>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleCityFilter()">查询</el-button>
        </div>
      </el-form>
    </div>
    <!--列表-->
    <el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
      <el-table-column prop="gymName" label="健身房名称"></el-table-column>
      <el-table-column prop="gymPath" label="场馆图片" width="300">
        <template slot-scope="scope">
          <img :src="scope.row.gymPath" alt="" style="width:225px;height: 100px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="typeName" label="场馆类型"></el-table-column>
      <el-table-column prop="isContract" label="是否签约">
        <template slot-scope="scope">
          <span v-if="scope.row.isContract === 0">未签约</span>
          <span v-else-if="scope.row.isContract === 1">已签约</span>
        </template>
      </el-table-column>
      <el-table-column prop="serialNumber" label="识别码"></el-table-column>
      <el-table-column prop="gymPhone" label="联系方式"></el-table-column>
      <!--<el-table-column prop="city" label="城市"></el-table-column>
			<el-table-column prop="area" label="区域"></el-table-column>-->
      <el-table-column prop="address" label="详细地址">
        <template slot-scope="scope">
          <span v-if="scope.row.province == scope.row.city"></span>
          <span v-else>{{scope.row.province}}</span>
           <span v-if="scope.row.city == '市辖区'"></span>
           <span v-else>{{scope.row.city}}</span>
           <span>{{scope.row.area}}</span>
           <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" @click="handleSelect(scope.row)">查看详情</el-button>
          <span v-if="scope.row.status === 0">
					<el-button type="danger" size="small" @click="handleSoldOut(scope.row)">下架</el-button>
					</span>
          <span v-else>
					<el-button type="success" size="small" @click="handleSoldIn(scope.row)">上架</el-button>
					</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!--查看-->
    <div class="panel">
      <el-dialog  :visible.sync="detailsVisible" width="90%" title="场馆详情" :closeOnClickModal="false">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="基本信息" style="min-height: 400px;" name="first">
            <el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">
              <el-table-column prop="gymName" label="健身房名称"></el-table-column>
              <el-table-column prop="gymInfo" label="场馆介绍" width="500"></el-table-column>
              <!--<el-table-column prop="typeName" label="场馆类型"></el-table-column>
						<el-table-column prop="gymPhone" label="联系方式"> </el-table-column>
						<el-table-column prop="address" label="详细地址">
							<template slot-scope="scope">
								{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}
							</template>
						</el-table-column>-->
              <el-table-column prop="longitude" label="经度"></el-table-column>
              <el-table-column prop="latitude" label="纬度"></el-table-column>
              <!--<el-table-column prop="isChain" label="是否连锁">
                <template slot-scope="scope">
                  <span v-if="scope.row.isChain === 0">否</span>
                  <span v-else-if="scope.row.isChain === 1">是</span>
                </template>
              </el-table-column>
              <el-table-column prop="brandName" label="连锁品牌"></el-table-column>-->
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleEditBase(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="教练列表" style="min-height: 400px;" name="second">
            <el-tabs type="card" v-model="activeCName">
              <el-tab-pane label="教练信息" style="min-height: 400px;" name="firstC">
                <el-button type="primary" icon="plus" @click="handleAddCoach()">添加教练</el-button>
                <el-table :data="coachData" border stripe style="width:100%;margin-top:20px" v-loading="listLoading">
                  <el-table-column prop="coachName" label="教练名称" width="130"></el-table-column>
                  <el-table-column prop="coachPath" label="图片" width="200">
                    <template slot-scope="scope">
                      <img :src="scope.row.coachPath" alt="" style="width:120px;height: 120px;"/>
                    </template>
                  </el-table-column>
                  <el-table-column prop="honor" label="获奖记录"></el-table-column>
                  <el-table-column prop="typeName" label="教练类型" width="150"></el-table-column>
                  <el-table-column prop="phone" label="手机号"></el-table-column>
                  <el-table-column prop="cardNo" label="身份证号"></el-table-column>
                  <el-table-column prop="cardPhoto" label="身份证图片" width="300">
                    <template slot-scope="scope">
                      <img :src="scope.row.cardPhoto" alt="" style="width:150px;height: 100px;"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="280">
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEditCoach(scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleCoachClass(scope.row)">关联课程</el-button>
                      <el-button size="small" type="danger" @click="handleRemoveCoach(scope.row)">解雇</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="block">
                  <el-pagination @size-change="handleSizeCoach" @current-change="handleCurrentCoach"
                                 :current-page="listCoach.page" :page-sizes="[10,20,30,50]" :page-size="listCoach.limit"
                                 layout="total, sizes, prev, pager, next, jumper" :total="coachTotal">
                  </el-pagination>
                </div>
              </el-tab-pane>
              <el-tab-pane label="课程列表" style="min-height: 400px;" name="secondC">
                <el-button type="primary" icon="plus" @click="handleAddClass()">添加课程</el-button>
                <el-table :data="classData" border stripe style="width:100%;margin-top:20px" v-loading="listLoading">
                  <el-table-column prop="className" label="课程名称"></el-table-column>
                  <el-table-column prop="classInfo" label="课程简介"></el-table-column>
                  <el-table-column prop="classKind" label="课程渠道" width="130">
                    <template slot-scope="scope">
                      <span v-if="scope.row.classKind === 0">线上课程</span>
                      <span v-else>线下课程</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="typeName" label="课程类型" width="130"></el-table-column>

                  <el-table-column prop="classVideoUrl" label="课程视频">
                    <template slot-scope="scope">
                      <a :href="scope.row.classVideoUrl">{{scope.row.classVideoUrl}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="gymName" label="健身房"></el-table-column>
                  <el-table-column prop="isFree" label="是否免费" width="130">
                    <template slot-scope="scope">
                      <span v-if="scope.row.isFree == true">是</span>
                      <span v-else>否</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="classPrice" label="售价"></el-table-column>
                  <el-table-column label="操作" width="280">
                    <template slot-scope="scope">
                      <el-button size="small" @click="handleEditClass(scope.row)">编辑</el-button>
                      <el-button size="small" @click="handleClassCoach(scope.row)">关联教练</el-button>
                      <el-button type="danger" size="small" @click="handleRemoveClass(scope.row)">下架</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="block">
                  <el-pagination @size-change="handleSizeClass" @current-change="handleCurrentClass"
                                 :current-page="listClass.page" :page-sizes="[10,20,30,50]" :page-size="listClass.limit"
                                 layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
                  </el-pagination>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="器械列表" style="min-height: 400px;" name="three">
            <el-button type="primary" icon="plus" @click="handleAddInstrument()">添加器械</el-button>
            <el-table :data="instrumentData" border stripe style="width:100%;margin-top:20px" v-loading="listLoading">
              <el-table-column prop="equipmentName" label="器械名称"></el-table-column>
              <el-table-column prop="equipmentType" label="器械类型"></el-table-column>
              <el-table-column prop="equipmentPath" label="图片" width="400">
                <template slot-scope="scope">
                  <img :src="scope.row.equipmentPath" alt="" style="width:250px;height: 120px;"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleEditInstrument(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDeleteInstrument(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination @size-change="handleSizeInstrument" @current-change="handleCurrentInstrument"
                             :current-page="listInstrument.page" :page-sizes="[10,20,30,50]"
                             :page-size="listInstrument.limit" layout="total, sizes, prev, pager, next, jumper"
                             :total="instrumentTotal">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="环境列表" style="min-height: 400px;" name="fourth">
            <el-button type="primary" icon="plus" @click="handleAddEnvironment()">添加环境</el-button>
            <el-table :data="environmentData" border stripe style="width:100%;margin-top:20px" v-loading="listLoading">
              <el-table-column prop="environmentName" label="环境名称"></el-table-column>
              <el-table-column prop="environmentPath" label="图片" width="500">
                <template slot-scope="scope">
                  <img :src="scope.row.environmentPath" alt="" style="width:250px;height: 120px;"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleEditEnvironment(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDeleteEnvironment(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination @size-change="handleSizeEnvir" @current-change="handleCurrentEnvir"
                             :current-page="listEnvir.page" :page-sizes="[10,20,30,50]" :page-size="listEnvir.limit"
                             layout="total, sizes, prev, pager, next, jumper" :total="environmentTotal">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-dialog>
    </div>
    <!--end-->
    <!--给教练添加课程-->
    <div class="panel">
      <el-dialog  :visible.sync="classVisible" title="教练添加课程" :closeOnClickModal="false">
        <el-form ref="addClassForm">
          <el-checkbox-group v-model="checkedClass">
            <el-checkbox v-for="item in classData" :label="item.id" :key="item.id" :value="item.id"
                         style="margin:10px 0;width:260px">{{item.className}}
            </el-checkbox>
          </el-checkbox-group>
          <el-form-item style="text-align:center;margin-top:30px">
            <el-button type="primary" @click="submitCocahClass">提交</el-button>
            <el-button @click="classVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--给课程添加教练-->
    <div class="panel">
      <el-dialog  :visible.sync="coachVisible" title="课程添加教练" :closeOnClickModal="false">
        <el-form ref="addCoachForm">
          <el-checkbox-group v-model="checkedCoach">
            <el-checkbox v-for="item in coachData" :label="item.id" :key="item.id" :value="item.id"
                         style="margin:10px 0;width:260px">{{item.coachName}}
            </el-checkbox>
          </el-checkbox-group>
          <el-form-item style="text-align:center;margin-top:30px">
            <el-button type="primary" @click="submitClassCocah">提交</el-button>
            <el-button @click="coachVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加-->
    <div class="panel">
      <el-dialog  :visible.sync="addFormVisible" title="添加场馆信息" width="850px" :closeOnClickModal="false">
        <el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules" class="form-container">
          <el-form-item label="场馆名称" prop="gymName">
            <el-input v-model="addForm.gymName" id="addForm" ></el-input>
          </el-form-item>
          <el-form-item label="场馆类型" prop="typeId">
            <el-select v-model="addForm.typeId" placeholder="请选择场馆类型" >
              <el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场馆封面" prop="gymPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="addForm.gymPath" :src="addForm.gymPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="场馆电话" prop="gymPhone">
            <el-input v-model="addForm.gymPhone" ></el-input>
          </el-form-item>
          <el-form-item label="所属地区" prop="region">
            <template>
              <div id="app">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="regionAdd"
                  @change="handleAddAreaChange" placeholder="请选择省/市/区">
                </el-cascader>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <input v-model="addForm.address" id="tipinput" class="el-input__inner" style="width: 250px;"/>
          </el-form-item>
          <div class="map-box">
            <v-map ref="mapChild"></v-map>
          </div>
          <el-form-item label="经度" prop="longitude">
            <input id="Lng" class="el-input__inner" disabled="disabled" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <input id="Lat" class="el-input__inner" disabled="disabled" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="场馆介绍" prop="gymInfo">
            <input type="textarea" v-model="addForm.gymInfo" class="el-input__inner" style="width: 250px;"/>
          </el-form-item>
          <!--<el-form-item label="是否连锁">
            <el-select v-model="addForm.isChain" >
              <el-option v-for="item in chainData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>-->
          <!--<template v-if="addForm.isChain === 1">
            <el-form-item label="品牌名称">
              <el-select v-model="addForm.brandId" placeholder="请选择连锁品牌" >
                <el-option v-for="item in brandData" :key="item.id" :label="item.brandName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </template>-->

          <el-form-item label="是否上架" prop="status">
            <el-select v-model="addForm.status" >
              <el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
          	<el-button @click="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--end-->
    <!--编辑基本信息-->
    <div class="panel">
      <el-dialog  :visible.sync="editFormVisible" title="编辑场馆信息" width="850px" :closeOnClickModal="false">
        <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules" class="form-container">
          <el-form-item label="场馆名称" prop="gymName">
            <el-input v-model="editForm.gymName" ></el-input>
          </el-form-item>
          <el-form-item label="场馆类型" prop="typeId">
            <el-select v-model="editForm.typeId" placeholder="请选择场馆类型" >
              <el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场馆封面" prop="gymPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="handleAvatarEditSuccess"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="editForm.gymPath" :src="editForm.gymPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="场馆电话" prop="gymPhone">
            <el-input v-model="editForm.gymPhone" ></el-input>
          </el-form-item>
          <el-form-item label="所属地区" prop="region">
            <template>
              <div id="app">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="regionEdit"
                  @change="handleEditAreaChange" placeholder="请选择省/市/区">
                </el-cascader>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <input v-model="editForm.address" id="tipinpute" class="el-input__inner" style="width: 250px;"/>
          </el-form-item>
          <!--<el-form-item label="经度" prop="longitude">
						<el-input v-model="editForm.longitude"></el-input>
					</el-form-item>
					<el-form-item label="纬度" prop="latitude">
						<el-input v-model="editForm.latitude"></el-input>
					</el-form-item>-->
          <div class="map-box">
            <v-editMap ref="mapEditChild" v-on:getEditMapChild="getEditMap"></v-editMap>
          </div>
          <el-form-item label="经度" prop="longitude">
            <input id="editLng" class="el-input__inner" v-model="editForm.longitude" disabled="disabled" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <input id="editLat" class="el-input__inner" v-model="editForm.latitude" disabled="disabled" style="width: 250px;"/>
          </el-form-item>
          <el-form-item label="场馆介绍" prop="gymInfo">
            <el-input type="textarea" v-model="editForm.gymInfo" ></el-input>
          </el-form-item>
          <!--<el-form-item label="是否连锁">
            <el-select v-model="editForm.isChain" >
              <el-option v-for="item in chainData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="editForm.isChain === 1">
            <el-form-item label="品牌名称">
              <el-select v-model="editForm.brandId" placeholder="请选择连锁品牌" >
                <el-option v-for="item in brandData" :key="item.id" :label="item.brandName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </template>-->

          <el-form-item label="是否上架" prop="status">
            <el-select v-model="editForm.status" >
              <el-option v-for="item in statusData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
          	<el-button @click="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--end-->
    <!--添加教练-->
    <div class="panel">
      <el-dialog  :visible.sync="addCoachVisible" title="添加教练信息" width="600px" :closeOnClickModal="false">
        <el-form ref="addCoach" :model="addCoach" label-width="80px" :rules="addCoachRules" class="form-container">
          <el-form-item label="名称" prop="coachName">
            <el-input v-model="addCoach.coachName" ></el-input>
          </el-form-item>
          <el-form-item label="教练类型" prop="typeId">
            <el-select v-model="addCoach.typeId" placeholder="请选择教练类型" >
              <el-option v-for="item in coachTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教练图片" prop="coachPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="addCoachImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="addCoach.coachPath" :src="addCoach.coachPath" class="avatar"
                   style="width:178px;height: 178px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="个人成果" prop="honor">
            <el-input v-model="addCoach.honor" type="textarea" ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="addCoach.phone" ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardNo">
            <el-input v-model="addCoach.cardNo" ></el-input>
          </el-form-item>
          <el-form-item label="身份证照" prop="cardPhoto">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="addCoachCardImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="addCoach.cardPhoto" :src="addCoach.cardPhoto" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
          	<el-button @click="addCoachVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitCoach">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--编辑教练-->
    <div class="panel">
      <el-dialog  :visible.sync="editCoachVisible" title="编辑教练信息" width="600px" :closeOnClickModal="false">
        <el-form ref="editCoach" :model="editCoach" label-width="80px" :rules="editCoachRules" class="form-container">
          <el-form-item label="名称" prop="coachName">
            <el-input v-model="editCoach.coachName" ></el-input>
          </el-form-item>
          <el-form-item label="教练类型" prop="typeId">
            <el-select v-model="editCoach.typeId" placeholder="请选择教练类型" >
              <el-option v-for="item in coachTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教练图片" prop="coachPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="editCoachImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="editCoach.coachPath" :src="editCoach.coachPath" class="avatar"
                   style="width:178px;height: 178px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item label="个人成果" prop="honor">
            <el-input v-model="editCoach.honor" type="textarea" ></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="editCoach.phone" ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="cardNo">
            <el-input v-model="editCoach.cardNo" ></el-input>
          </el-form-item>
          <el-form-item label="身份证照" prop="cardPhoto">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="editCoachCardImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="editCoach.cardPhoto" :src="editCoach.cardPhoto" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
          	<el-button @click="editCoachVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmitCoach">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加课程-->
    <div class="panel">
      <el-dialog  :visible.sync="addClassVisible" title="添加课程" width="600px" :closeOnClickModal="false">
        <el-form ref="addClass" :model="addClass" label-width="80px" :rules="addClassRules" class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="addClass.className" ></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="classInfo">
            <el-input v-model="addClass.classInfo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="视频上传" prop="classVideoUrl">
            <el-upload ref="upload" class="upload-demo"
                       :action="uploadVUrl()"
                       :on-success="addClassVideo"
                       :before-upload="beforeVideoUpload"
                       :limit=1
                       :file-list="videoList"
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传正确的视频格式文件(mp4、flv、avi、3gp)</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="课程渠道" prop="classKind">
            <el-select v-model="addClass.classKind" placeholder="请选择课程渠道" @change="KindChange" >
              <el-option v-for="item in kindData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="addClass.typeId" placeholder="请选择课程分类" >
              <el-option v-for="item in classTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否免费" prop="isFree">
            <el-select v-model="addClass.isFree" placeholder="是否免费" @change="FreeChange" >
              <el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程售价" prop="classPrice">
            <el-input v-model="addClass.classPrice" :value="0" :disabled="pdisabled" ></el-input>
          </el-form-item>
          <el-form-item label="时长(秒)" prop="classVideoTime">
            <el-input v-model="addClass.classVideoTime" :disabled="disabled" ></el-input>
          </el-form-item>
          <el-form-item label="大小(MB)" prop="classVideoSize">
            <el-input v-model="addClass.classVideoSize" :disabled="disabled" ></el-input>
          </el-form-item>

          <el-form-item>
          	<el-button @click="addClassVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitClass">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--编辑课程-->
    <div class="panel">
      <el-dialog  :visible.sync="editClassVisible" title="编辑课程" width="600px" :closeOnClickModal="false">
        <el-form ref="editClass" :model="editClass" label-width="80px" :rules="editClassRules" class="form-container">
          <el-form-item label="课程名称" prop="className">
            <el-input v-model="editClass.className" ></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="classInfo">
            <el-input v-model="editClass.classInfo" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="视频上传" prop="classVideoUrl">
            <el-upload ref="upload"
                       :action="uploadVUrl()"
                       :on-success="editClassVideo"
                       :file-list="videoList"
                       :before-upload="beforeVideoUpload"
                       :limit=1
                       :headers="uploadHeaders()"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传正确的视频格式文件(mp4、flv、avi、3gp)</div>
            </el-upload>
          </el-form-item>

          <el-form-item label="课程渠道" prop="classKind">
            <el-select v-model="editClass.classKind" placeholder="请选择课程渠道" @change="eKindChange" >
              <el-option v-for="item in kindData" :key="item.id" :label="item.value" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="typeId">
            <el-select v-model="editClass.typeId" placeholder="请选择课程分类" >
              <el-option v-for="item in classTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否免费" prop="isFree">
            <el-select v-model="editClass.isFree" placeholder="是否免费" @change="eFreeChange" >
              <el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程售价" prop="classPrice">
            <el-input v-model="editClass.classPrice" :value="0" :disabled="epdisabled" ></el-input>
          </el-form-item>
          <el-form-item label="时长(秒)" prop="classVideoTime">
            <el-input v-model="editClass.classVideoTime" :disabled="edisabled" ></el-input>
          </el-form-item>
          <el-form-item label="大小(MB)" prop="classVideoSize">
            <el-input v-model="editClass.classVideoSize" :disabled="edisabled" ></el-input>
          </el-form-item>

          <el-form-item>
          	<el-button @click="editClassVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmitClass">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加器械-->
    <div class="panel">
      <el-dialog  :visible.sync="addInstrVisible" title="添加器械信息" width="600px" :closeOnClickModal="false">
        <el-form ref="addInstrument" :model="addInstrument" label-width="80px" :rules="addInstrRules" class="form-container">
          <el-form-item label="名称" prop="equipmentName">
            <el-input v-model="addInstrument.equipmentName" ></el-input>
          </el-form-item>
          <el-form-item label="器械类型">
            <el-select v-model="addInstrument.equipmentTypeId" >
              <el-option v-for="item in instrTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="equipmentPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="addInstrImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="addInstrument.equipmentPath" :src="addInstrument.equipmentPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
          	<el-button @click="addInstrVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitInstr">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--编辑器械-->
    <div class="panel">
      <el-dialog  :visible.sync="editInstrVisible" title="编辑器械信息" width="600px" :closeOnClickModal="false">
        <el-form ref="editInstrument" :model="editInstrument" label-width="80px" :rules="editEnvirRules" class="form-container">
          <el-form-item label="器械名称" prop="equipmentName">
            <el-input v-model="editInstrument.equipmentName" ></el-input>
          </el-form-item>
          <el-form-item label="器械类型">
            <el-select v-model="editInstrument.equipmentTypeId" >
              <el-option v-for="item in instrTypeData" :key="item.id" :label="item.typeName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" prop="equipmentPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="editInstrImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="editInstrument.equipmentPath" :src="editInstrument.equipmentPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSubmitInstr">提交</el-button>
            <el-button @click="editInstrVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--添加环境-->
    <div class="panel">
      <el-dialog  :visible.sync="addEnvirVisible" title="添加环境信息" width="600px" :closeOnClickModal="false">
        <el-form ref="addEnvironment" :model="addEnvironment" label-width="80px" :rules="addEnvirRules" class="form-container">
          <el-form-item label="名称" prop="environmentName">
            <el-input v-model="addEnvironment.environmentName" ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="environmentPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="addEnvirImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="addEnvironment.environmentPath" :src="addEnvironment.environmentPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
          	<el-button @click="addEnvirVisible = false">取消</el-button>
            <el-button type="primary" @click="addSubmitEnvir">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--编辑环境-->
    <div class="panel">
      <el-dialog  :visible.sync="editEnvirVisible" title="编辑环境信息" width="600px" :closeOnClickModal="false">
        <el-form ref="editEnvironment" :model="editEnvironment" label-width="80px" :rules="editEnvirRules" class="form-container">
          <el-form-item label="名称" prop="environmentName">
            <el-input v-model="editEnvironment.environmentName" ></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="environmentPath">
            <el-upload class="avatar-uploader" :action="uploadUrl()"
                       :on-success="editEnvirImg"
                       :before-upload="beforeAvatarUpload"
                       :show-file-list="false"
                       :headers="uploadHeaders()">
              <img v-if="editEnvironment.environmentPath" :src="editEnvironment.environmentPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <template>
              <span style="color:#999999">(点击图片重新上传)</span>
            </template>
          </el-form-item>
          <el-form-item>
          	<el-button @click="editEnvirVisible = false">取消</el-button>
            <el-button type="primary" @click="editSubmitEnvir">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>


</template>

<script>
 import AXIOS from '../../../axios/axios'
	import global_ from '../../../common/js/common'
	import valid from '../../../common/js/validate'
	import { regionDataPlus, CodeToText, TextToCode} from '../../../common/js/area.js'
	import AMap from 'AMap';
  import vMap from './Map.vue';
  import vEditMap from './editMap.vue';
  import $ from 'jquery';

  const Axios = new AXIOS();
  export default {
    components: {
      vMap,
      vEditMap
    },
    data() {
      return {
        readonly: true,
        options: regionDataPlus,//选择省市区
        selectedOptions: [],
        regionAdd: [],
        regionEdit: [],
        path: global_.path,
        action: global_.action,
        actionV: global_.actionV,
        activeName: 'first',
        activeCName: 'firstC',
        tableData: [], //列表数组
        gymObj: undefined,
        gymId: '',
        GymList: [],
        brandData: [],
        typeData: [],
        coachClassData: [],
        checkedClass: [],
        checkedCoach: [],
        classCoachData: [],
        coachId: '',
        classId: '',
        token: '',
        listLoading: false,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          isChain: '',
          keyword: '',
          brandId: '',
          typeId: '',
          city: '',
        },
        //是否连锁
        chainData: [{
          id: 0,
          value: '否',
        }, {
          id: 1,
          value: '是'
        }],

        //是否上架
        statusData: [{
          id: 0,
          value: '是'
        }, {
          id: 1,
          value: '否'
        }],
        //添加
        addFormVisible: false,
        region: '',
        addForm: {
          gymName: '',
          gymPath: '',
          gymInfo: '',
          typeId: '',
          gymPhone: '',
          province: '',
          city: '',
          area: '',
          address: '',
          isChain: 0,
          brandId: '',
          status: 1 //1下架状态  0上架状态
        },
        longitude: '',
        latitude: '',
        addRules: {
          gymName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          typeId: [
            {required: true, validator: valid.checkType, trigger: 'change'}
          ],
          gymPhone: [
            {required: true, validator: valid.checkPhone, trigger: 'blur'}
          ],
        },
        detailsVisible: false,
        detailsData: [],
        listCoach: {
          page: 1,
          limit: 10,
        },
        coachTotal: 0,
        coachData: [],
        listClass: {
          page: 1,
          limit: 10,
        },
        classTotal: 0,
        classData: [],
        listInstrument: {
          page: 1,
          limit: 10,
        },
        instrumentTotal: 0,
        instrumentData: [],
        listEnvir: {
          page: 1,
          limit: 10,
        },
        environmentTotal: 0,
        environmentData: [],
        editFormVisible: false,
        editForm: {
          gymName: '',
          gymPath: '',
          gymInfo: '',
          typeId: '',
          gymPhone: '',
          province: '',
          city: '',
          area: '',
          address: '',
          longitude: 0,
          latitude: 0,
          isChain: 0,
          brandId: '',
          status: 1
        },
        editRules: {
          gymName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          typeId: [
            {required: true, validator: valid.checkType, trigger: 'change'}
          ],
          gymPhone: [
            {required: true, validator: valid.checkPhone, trigger: 'blur'}
          ],
        },
        //教练关联课程
        classVisible: false,
        coachVisible: false,
        //添加教练
        coachTypeData: [],
        addCoachVisible: false,
        addCoach: {
          coachName: '',
          typeId: '',
          coachPath: '',
          honor: '',
          isHot: false,
          isRecommend: false,
          phone: '',
          cardNo: '',
          cardPhoto: '',
        },
        addCoachRules: {
          coachName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          typeId: [
            {required: true, validator: valid.checkType, trigger: 'change'}
          ],
          phone: [
            {required: true, validator: valid.checkPhone, trigger: 'blur'}
          ],
          cardNo: [
            {required: true, validator: valid.checkCardNo, trigger: 'blur'}
          ],
        },
        //编辑教练
        editCoachVisible: false,
        editCoach: {
          coachName: '',
          typeId: '',
          coachPath: '',
          honor: '',
          isHot: false,
          isRecommend: false,
          phone: '',
          cardNo: '',
          cardPhoto: '',
        },
        editCoachRules: {
          coachName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          typeId: [
            {required: true, validator: valid.checkType, trigger: 'change'}
          ],
          phone: [
            {required: true, validator: valid.checkPhone, trigger: 'blur'}
          ],
          cardNo: [
            {required: true, validator: valid.checkCardNo, trigger: 'blur'}
          ],
        },
        //添加课程
        addClassVisible: false,
        editClassVisible: false,
        pdisabled: true,
        epdisabled: true,
        disabled: true,
        edisabled: true,
        videoList: [],
        classTypeData: [],//课程分类
        kindData: [
          {
            id: 0,
            value: '线上课程'
          },
          {
            id: 1,
            value: '线下课程'
          }],
        freeData: [{
          type: false,
          value: '否'
        },
          {
            type: true,
            value: '是'
          }],
        addClass: {
          className: '',
          classInfo: '',
          classVideoUrl: '',
          classVideoTime: 0,
          classVideoSize: 0,
          classKind: 1,
          typeId: '',
          isFree: true,
          classPrice: 0
        },
        addGymAuto:null,
        editClass: {
          id: '',
          className: '',
          classInfo: '',
          classVideoUrl: '',
          classVideoTime: 0,
          classVideoSize: 0,
          classKind: 0,
          typeId: '',
          isFree: true,
          classPrice: ''
        },
        addClassRules: {
          className: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          typeId: [
            {required: true, validator: valid.checkType, trigger: 'change'}
          ],
        },
        editClassRules: {
          className: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
        },
        //添加环境
        addEnvirVisible: false,
        addEnvironment: {
          gymId: '',
          environmentName: '',
          environmentPath: '',
        },
        addEnvirRules: {
          environmentName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
        },
        //编辑环境
        editEnvirVisible: false,
        editEnvironment: {
          gymId: '',
          environmentName: '',
          environmentPath: '',
        },
        editEnvirRules: {
          environmentName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
        },
        //添加器械
        instrTypeData: [],
        addInstrVisible: false,
        addInstrument: {
          gymId: '',
          equipmentName: '',
          equipmentPath: '',
          equipmentTypeId: '',
        },
        addInstrRules: {
          equipmentName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          equipmentTypeId: [
            {required: true, validator: valid.checkType, trigger: 'blur'}
          ],
        },
        //编辑器械

        editInstrVisible: false,
        editInstrument: {
          id: 0,
          gymId: '',
          equipmentName: '',
          equipmentPath: '',
          equipmentTypeId: '',
        },
        editInstrRules: {
          equipmentName: [
            {required: true, validator: valid.checkName, trigger: 'blur'}
          ],
          equipmentTypeId: [
            {required: true, validator: valid.checkType, trigger: 'blur'}
          ],
        },
      }
    },
    filters: {
      time(value) {
        var date = new Date(value),
          y = date.getFullYear(),
          m = date.getMonth() + 1,
          d = date.getDate(),
          h = date.getHours(),
          i = date.getMinutes(),
          s = date.getSeconds();
        if (m < 10) {
          m = '0' + m;
        }
        if (d < 10) {
          d = '0' + d;
        }
        if (h < 10) {
          h = '0' + h;
        }
        if (i < 10) {
          i = '0' + i;
        }
        if (s < 10) {
          s = '0' + s;
        }
        //  获取时间格式 2017-01-03 10:13:48
        var t = y + '-' + m + '-' + d + '    ' + h + ':' + i + ':' + s;
        //  获取时间格式 2017-01-03
        //	var t = y + '-' + m + '-' + d;
        return t;
      }
    },
    created(){
    	this.addGymAuto = sessionStorage.getItem('addGymStatus');
    },
    mounted() {
      this.$nextTick(() => {
        this.token = sessionStorage.getItem('token');
        this.getData();
      });
    },

    methods: {
      handleAreaChange(value) {
        var province, city, area;
        province = CodeToText[value[0]];
        city = CodeToText[value[1]]
        area = CodeToText[value[2]]
        if (province == '全部') {
          province = '';
          city = '';
          area = '';
        }
        if (city == '市辖区') {
         	 city = '';
          if(area == '全部') {
         	 	area = '';
        	}
        }else if(city == '全部'){
        	city = '';
        	area = '';
        }

        this.listQuery.city = province + city + area
      },
      handleAddAreaChange(value) {
        this.addForm.province = CodeToText[value[0]];
        this.addForm.city = CodeToText[value[1]];
        this.addForm.area = CodeToText[value[2]];
        if (this.addForm.city == '市辖区' || this.addForm.city == '全部') {
          this.addForm.city = this.addForm.province;
        }
        if (this.addForm.area == '全部') {
          this.addForm.area = '';
        }
      },
      handleEditAreaChange(value) {
        this.editForm.province = CodeToText[value[0]];
        this.editForm.city = CodeToText[value[1]];
        this.editForm.area = CodeToText[value[2]];
        if (this.editForm.city == '市辖区' || this.editForm.city == '全部') {
          this.editForm.city = this.editForm.province;
        }
        if (this.editForm.area == '全部') {
          this.editForm.area = '';
        }
      },
      uploadUrl() {
        return this.action
      },
      uploadHeaders() {
        var headers = {'Authorization': this.token}
        return headers
      },
      uploadVUrl() {
        return this.actionV
      },
      getType() {
        this.$axios({
          url: this.path + 'resource/gym/type/list',
          method: 'get',
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            this.typeData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getBrand() {
//      this.$axios({
//        url: this.path + 'resource/brand/list',
//        method: 'get',
//        transformRequest: [function (params) {
//          let ret = ''
//          for (let it in params) {
//            ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
//          }
//          return ret
//        }],
//        headers: {
//          'Content-Type': 'application/x-www-form-urlencoded',
//          'Authorization': this.token,
//        }
//      })
//        .then((res) => {
//          this.brandData = res.data;
//        })
//        .catch((err) => {
//          console.log(err);
//        })
      },
      getTotal() {
        this.$axios({
          url: this.path + 'resource/gym/count',
          method: 'get',
          params: this.listQuery,
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            this.total = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      getData() {
        global_.$options.exportSession(this.getData);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'resource/gym/list',
          method: 'get',
          params: this.listQuery,
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            if (res.data != null) {
              this.getTotal();
              this.getType();
              this.getBrand();
              this.tableData = res.data;
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
      handleCityFilter() {
        global_.$options.exportSession(this.handleCityFilter);
        this.listLoading = true;
        this.$axios({
          url: this.path + 'resource/gym/findCity',
          method: 'get',
          params: this.listQuery,
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            if (res.data != null) {
              this.tableData = res.data;
              this.listLoading = false;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getData();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getData();
      },
      handleSelect(row) {
        global_.$options.exportSession(this.handleSelect);
        this.detailsVisible = true;
        this.gymObj = row;
        this.gymId = row.id;
        this.selectDetails(this.gymId);
        this.selectCoach(this.gymId);
        this.selectClass(this.gymId);
        this.selectInstrument(this.gymId);
        this.selectEnvironment(this.gymId);
      },
      //查看
      selectDetails(gid) {
        global_.$options.exportSession(this.selectDetails);
        this.$axios({
          url: this.path + 'resource/gym/' + gid,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.detailsData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectCoachTotal(gid) {
        this.$axios({
          url: this.path + 'resource/coach/count?gymId=' + gid,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.coachTotal = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeCoach(val) {
        this.listCoach.limit = val;
        this.selectCoach(this.gymId);
      },
      handleCurrentCoach(val) {
        this.listCoach.page = val;
        this.selectCoach(this.gymId);
      },
      selectCoach(gid) {
        global_.$options.exportSession(this.selectCoach);
        this.$axios({
          url: this.path + 'resource/coach/list?gymId=' + gid,
          method: 'get',
          params: this.listCoach,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.selectCoachTotal(gid)
              this.coachData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectClassTotal(gid) {
        this.$axios({
          url: this.path + 'resource/class/count?gymId=' + gid,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.classTotal = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeClass(val) {
        this.listClass.limit = val;
        this.selectClass(this.gymId);
      },
      handleCurrentClass(val) {
        this.listClass.page = val;
        this.selectClass(this.gymId);
      },
      selectClass(gid) {
        global_.$options.exportSession(this.selectClass);
        this.$axios({
          url: this.path + 'resource/class/list?gymId=' + gid,
          method: 'get',
          params: this.listClass,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.selectClassTotal(gid)
              this.classData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectInstrumentTotal(gid) {
        this.$axios({
          url: this.path + 'resource/gym/equipment/count?gymId=' + gid,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
            	this.$nextTick(() => {
              	this.instrumentTotal = res.data;
             	});
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      handleSizeInstrument(val) {
        this.listInstrument.limit = val;
        this.selectInstrument(this.gymId);
      },
      handleCurrentInstrument(val) {
        this.listInstrument.page = val;
        this.selectInstrument(this.gymId);
      },
      selectInstrument(gid) {
        global_.$options.exportSession(this.selectInstrument);
        this.$axios({
          url: this.path + 'resource/gym/equipment/list?gymId=' + gid,
          method: 'get',
          params: this.listInstrument,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
            	this.$nextTick(() => {
	              this.selectInstrumentTotal(gid);
	              this.instrumentData = res.data;
              });
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      selectEnvironmentTotal(gid) {
        this.$axios({
          url: this.path + 'resource/gym/environ/count?gymId=' + gid,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.environmentTotal = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },


      handleSizeEnvir(val) {
        this.listEnvir.limit = val;
        this.selectEnvironment(this.gymId);
      },
      handleCurrentEnvir(val) {
        this.listEnvir.page = val;
        this.selectEnvironment(this.gymId);
      },
      selectEnvironment(gid) {
        global_.$options.exportSession(this.selectEnvironment);
        this.$axios({
          url: this.path + 'resource/gym/environ/list?gymId=' + gid,
          method: 'get',
          params: this.listEnvir,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.selectEnvironmentTotal(gid);
              this.environmentData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },

      handleAdd() {
        global_.$options.exportSession(this.handleAdd);
        this.getType();
        this.addFormVisible = true;
      },
      //查询教练课程列表
      handleCoachClass(row) {
        global_.$options.exportSession(this.handleCoachClass);
        this.cocahId = row.id;
        this.checkedClass = [];
        this.selectCoachClass(this.cocahId);
        this.classVisible = true;
      },
      selectCoachClass(coachId) {
        global_.$options.exportSession(this.selectCoachClass);
        this.$axios({
          url: this.path + 'resource/coach/class?coachId=' + coachId,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.coachClassData = res.data;
              this.coachClassData.forEach((data, index) => {
                this.checkedClass.push(data.id);
              })
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      submitCocahClass() {
        global_.$options.exportSession(this.submitCocahClass);
        if(this.checkedClass == '' || this.checkedClass == null){
          this.$message({
            message: '关联课程不能为空',
            type: 'error'
          });
        } else {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$axios({
              url: this.path + 'resource/coach/add/class?coachId=' + this.cocahId + '&classId=' + this.checkedClass,
              method: 'put',
              transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
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
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.classVisible = false;
                this.selectCoach(this.gymId);
              })
              .catch((err) => {
                console.log(err);
              })
          })
        }
      },
      //查询课程教练列表
      handleClassCoach(row) {
        global_.$options.exportSession(this.handleClassCoach);
        this.classId = row.id;
        this.checkedCoach = [];
        this.selectClassCoach(this.classId);
        this.coachVisible = true;
      },
      selectClassCoach(classId) {
        global_.$options.exportSession(this.selectClassCoach);
        this.$axios({
          url: this.path + 'resource/class/coach?classId=' + classId,
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.classCoachData = res.data;
              this.classCoachData.forEach((data, index) => {
                this.checkedCoach.push(data.id);
              })
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      submitClassCocah() {
        global_.$options.exportSession(this.submitClassCocah);
        if(this.checkedCoach == '' || this.checkedCoach == null){
          this.$message({
            message: '关联教练不能为空',
            type: 'error'
          });
        } else {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.$axios({
              url: this.path + 'resource/class/add/coach?classId=' + this.classId + '&coachId=' + this.checkedCoach,
              method: 'put',
              transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
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
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.coachVisible = false;
                this.selectClass(this.gymId);
              })
              .catch((err) => {
                console.log(err);
              })
          })
        }
      },
      //添加
      addSubmitForm() {
        var longitude = document.getElementById("Lng").value;
        var latitude = document.getElementById("Lat").value;
        global_.$options.exportSession(this.addSubmitForm);
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/gym/add',
                method: 'put',
                data: {
                  gymName: this.addForm.gymName,
                  gymPath: this.addForm.gymPath,
                  gymInfo: this.addForm.gymInfo,
                  typeId: this.addForm.typeId,
                  gymPhone: this.addForm.gymPhone,
                  province: this.addForm.province,
                  city: this.addForm.city,
                  area: this.addForm.area,
                  address: this.addForm.address,
                  longitude: longitude,
                  latitude: latitude,
                  isChain: this.addForm.isChain,
                  brandId: this.addForm.brandId,
                  status: this.addForm.status
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.addForm.province = '',
                    this.addForm.city = '',
                    this.addForm.area = '',
                    this.addForm.isChain = 0,
                    this.addForm.status = 1,
                    this.getData();
                  } else {
                    this.$message({
                      message: '提交失败',
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
                message: '已取消上传'
              });
              this.addFormVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //下架
      handleSoldOut(row) {
        global_.$options.exportSession(this.handleSoldOut);
        this.$confirm('确认要下架该场馆吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/gym/disable/' + row.id,
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      //上架
      handleSoldIn(row) {
        global_.$options.exportSession(this.handleSoldIn);
        this.$confirm('确认要上架该场馆吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/gym/enable/' + row.id,
            method: 'get',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: res.data.message,
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      //编辑基本信息
      handleEditBase(row){
				global_.$options.exportSession(this.handleEditBase);
				this.regionEdit = []
				this.editForm = Object.assign({}, row);
				if(row.city != ''){
          if(row.city === row.province && row.area == ''){
            row.city = '全部'
          }else if(row.city === row.province && row.area != ''){
            row.city = '市辖区'
          }
          if(row.area == ''){
            row.area = '全部'
          }
          this.regionEdit.push(TextToCode[row.province].code)
          this.regionEdit.push(TextToCode[row.province][row.city].code)
          this.regionEdit.push(TextToCode[row.province][row.city][row.area].code)
        }
				this.editFormVisible = true;
			},
      editSubmitForm() {
        var longitude = document.getElementById("editLng").value;
        var latitude = document.getElementById("editLat").value;
        global_.$options.exportSession(this.editSubmitForm);
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.editLoading = true;
              this.$axios({
                url: this.path + 'resource/gym/update',
                method: 'post',
                data: {
                  id: this.editForm.id,
                  gymName: this.editForm.gymName,
                  gymPath: this.editForm.gymPath,
                  gymInfo: this.editForm.gymInfo,
                  typeId: this.editForm.typeId,
                  gymPhone: this.editForm.gymPhone,
                  province: this.editForm.province,
                  city: this.editForm.city,
                  area: this.editForm.area,
                  address: this.editForm.address,
                  longitude: longitude,
                  latitude: latitude,
                  isChain: this.editForm.isChain,
                  brandId: this.editForm.brandId,
                  status: this.editForm.status
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editForm'].resetFields();
                    this.editFormVisible = false;
                    this.detailsVisible = false;
//                  this.selectDetails(this.gymId);
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
                message: '已取消编辑'
              });
              this.detailsVisible = false;
              this.editFormVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getCoachType() {
        this.$axios({
          url: this.path + 'resource/coach/type/list',
          method: 'get',
          transformRequest: [function (params) {
            let ret = ''
            for (let it in params) {
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
            this.coachTypeData = res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //添加教练
      handleAddCoach() {
        global_.$options.exportSession(this.handleAddCoach);
        this.getCoachType();
        this.addCoachVisible = true;
        this.addCoach.gymId = this.gymId
      },
      addSubmitCoach() {
        global_.$options.exportSession(this.addSubmitCoach);
        this.$refs.addCoach.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/coach/add',
                method: 'put',
                data: {
                  gymId: this.addCoach.gymId,
                  coachName: this.addCoach.coachName,
                  typeId: this.addCoach.typeId,
                  coachPath: this.addCoach.coachPath,
                  honor: this.addCoach.honor,
                  isHot: this.addCoach.isHot,
                  isRecommend: this.addCoach.isRecommend,
                  phone: this.addCoach.phone,
                  cardNo: this.addCoach.cardNo,
                  cardPhoto: this.addCoach.cardPhoto,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addCoach'].resetFields();
                    this.addCoachVisible = false;
                    this.selectCoach(this.gymId);
                  } else {
                    this.$message({
                      message: '提交失败',
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
              this.addCoachVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑教练
      handleEditCoach(row) {
        global_.$options.exportSession(this.handleEditCoach);
        this.getCoachType();
        this.editCoachVisible = true;
        this.editCoach = Object.assign({}, row);
        this.editCoach.gymId = this.gymId;
      },
      editSubmitCoach() {
        global_.$options.exportSession(this.editSubmitCoach);
        this.$refs.editCoach.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/coach/update',
                method: 'post',
                data: {
                  id: this.editCoach.id,
                  gymId: this.editCoach.gymId,
                  coachName: this.editCoach.coachName,
                  typeId: this.editCoach.typeId,
                  coachPath: this.editCoach.coachPath,
                  honor: this.editCoach.honor,
                  isHot: this.editCoach.isHot,
                  isRecommend: this.editCoach.isRecommend,
                  phone: this.editCoach.phone,
                  cardNo: this.editCoach.cardNo,
                  cardPhoto: this.editCoach.cardPhoto,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editCoach'].resetFields();
                    this.editCoachVisible = false;
                    this.selectCoach(this.gymId);
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
                message: '已取消编辑'
              });
              this.editCoachVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //解雇教练
      handleRemoveCoach(row) {
        global_.$options.exportSession(this.handleRemoveCoach);
        this.$confirm('确认要删除吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/coach/delete/' + row.id,
            method: 'delete',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.selectCoach(this.gymId);
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      //添加课程
      //课程分类
      getClassType() {
        this.$axios({
          url: this.path + 'resource/class/types',
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.classTypeData = res.data
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      FreeChange() {
        var free = this.addClass.isFree;
        if (free == true) {
          this.addClass.classPrice = 0;
          this.pdisabled = true;
        } else {
          this.addClass.classPrice = '';
          this.pdisabled = false;
        }

      },
      eFreeChange() {
        var efree = this.editClass.isFree;
        if (efree == true) {
          this.editClass.classPrice = 0;
          this.epdisabled = true;
        } else {
          this.editClass.classPrice = this.editClass.classPrice;
          this.epdisabled = false;
        }
      },
      KindChange() {
        var kind = this.addClass.classKind;
        if (kind == 1) {
          this.addClass.classVideoTime = 0;
          this.addClass.classVideoSize = 0;
          this.disabled = true;
        } else {
          this.addClass.classVideoTime = '';
          this.addClass.classVideoSize = '';
          this.disabled = false;
        }

      },
      eKindChange() {
        var ekind = this.editClass.classKind;
        if (ekind == 1) {
          this.editClass.classVideoTime = 0;
          this.editClass.classVideoSize = 0;
          this.edisabled = true;
        } else {
          this.editClass.classVideoTime = this.editClass.classVideoTime;
          this.editClass.classVideoSize = this.editClass.classVideoSize;
          this.edisabled = false;
        }
      },
      handleAddClass() {
        global_.$options.exportSession(this.handleAddClass);
        this.addClassVisible = true;
        this.getClassType();
        this.addClass.gymId = this.gymId;
        this.videoList = [];
      },

      addSubmitClass() {
        global_.$options.exportSession(this.addSubmitClass);
        this.$refs.addClass.validate((valid) => {
          if((this.addClass.isFree == false)&&(this.addClass.classPrice <= 0 || this.addClass.classPrice == null)){
              this.$message({
                message: '课程售价必须大于0',
                type: 'error'
              });
          }else{
            if (valid) {
              this.$confirm('您确定要提交吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$axios({
                  url: this.path + 'resource/class/add',
                  method: 'put',
                  data: {
                    gymId: this.addClass.gymId,
                    className: this.addClass.className,
                    classInfo: this.addClass.classInfo,
                    classVideoUrl: this.addClass.classVideoUrl,
                    classVideoTime: this.addClass.classVideoTime,
                    classVideoSize: this.addClass.classVideoSize,
                    classKind: this.addClass.classKind,
                    typeId: this.addClass.typeId,
                    isFree: this.addClass.isFree,
                    classPrice: this.addClass.classPrice,
                  },
                  transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
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
                    if (res.data === 1) {
                      this.$message({
                        message: '提交成功',
                        type: 'success'
                      });
                      this.$refs['addClass'].resetFields();
                      this.addClassVisible = false;
                      this.selectClass(this.gymId);
                    } else {
                      this.$message({
                        message: '提交失败',
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
                this.addClassVisible = false;
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          }

        });
      },
      //编辑k课程
      handleEditClass(row) {
        global_.$options.exportSession(this.handleEditClass);
        this.eFreeChange();
        this.eKindChange();
        this.editClassVisible = true;
        this.editClass = Object.assign({}, row);
        this.editClass.gymId = this.gymId;
        this.videoList = [];
       if(row.classVideoUrl != null && row.classVideoUrl !=''){
        	var sname = row.classVideoUrl.substring(row.classVideoUrl.lastIndexOf('/') + 1)
        	var name = {"name": sname};
        	this.videoList.push(name)
        }else{
        	this.videoList= []
        }
      },
		addClassVideo(file, fileList) {
        global_.$options.exportSession(this.addClassVideo);
        this.addClass.classVideoUrl = file;  //获取上传的资源地址
        var sname = fileList.name//截取文件名
        var name = {"name": sname};
        this.videoList.push(name)//保存文件名到数组
        var args = this.videoList.pop();//把最新的文件名放到一个新数组
        this.videoList = new Array(args)//把新数组里的文件名显示出来
      },
      editClassVideo(file, fileList) {
        global_.$options.exportSession(this.editClassVideo);
        this.editClass.classVideoUrl = file;  //获取上传的资源地址
        var sname = fileList.response.name//截取文件名
        var name = {"name": sname};
        this.videoList.push(name)//保存文件名到数组
        var args = this.videoList.pop();//把最新的文件名放到一个新数组
        this.videoList = new Array(args)//把新数组里的文件名显示出来
      },
      editSubmitClass() {
        global_.$options.exportSession(this.editSubmitClass);
        this.$refs.editClass.validate((valid) => {
          if((this.editClass.isFree == false)&&(this.editClass.classPrice <= 0 || this.editClass.classPrice == null)){
            this.$message({
              message: '课程售价必须大于0',
              type: 'error'
            });
          }else{
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/class/update',
                method: 'post',
                data: {
                  id: this.editClass.id,
                  gymId: this.editClass.gymId,
                  className: this.editClass.className,
                  classInfo: this.editClass.classInfo,
                  classVideoUrl: this.editClass.classVideoUrl,
                  classVideoTime: this.editClass.classVideoTime,
                  classVideoSize: this.editClass.classVideoSize,
                  classKind: this.editClass.classKind,
                  typeId: this.editClass.typeId,
                  isFree: this.editClass.isFree,
                  classPrice: this.editClass.classPrice,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editClass'].resetFields();
                    this.editClassVisible = false;
                    this.selectClass(this.gymId);
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
                message: '已取消编辑'
              });
              this.editClassVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        }
        });
      },
      //删除课程
      handleRemoveClass(row) {
        global_.$options.exportSession(this.handleRemoveClass);
        this.$confirm('确认要下架该课程吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/class/delete/' + row.id,
            method: 'delete',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.selectClass(this.gymId);
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },

      //查询器械分类
      getInstrType() {
        this.$axios({
          url: this.path + 'resource/gym/equipment/type/list',
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': this.token,
          }
        })
          .then((res) => {
            if (res.data != null) {
              this.instrTypeData = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      },
      //添加器械
      handleAddInstrument() {
        global_.$options.exportSession(this.handleAddInstrument);
        this.getInstrType();
        this.addInstrVisible = true;
        this.addInstrument.gymId = this.gymId
      },
      addSubmitInstr() {
        global_.$options.exportSession(this.addSubmitInstr);
        this.$refs.addInstrument.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/gym/equipment/add',
                method: 'put',
                data: {
                  gymId: this.addInstrument.gymId,
                  equipmentName: this.addInstrument.equipmentName,
                  equipmentPath: this.addInstrument.equipmentPath,
                  equipmentTypeId: this.addInstrument.equipmentTypeId,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addInstrument'].resetFields();
                    this.addInstrVisible = false;
                    this.selectInstrument(this.gymId);
                  } else {
                    this.$message({
                      message: '提交失败',
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
              this.addInstrVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑器械
      handleEditInstrument(row) {
        global_.$options.exportSession(this.handleEditInstrument);
        this.getInstrType();
        this.editInstrVisible = true;
        this.editInstrument = Object.assign({}, row);
        this.editInstrument.gymId = this.gymId;
      },
      editSubmitInstr() {
        global_.$options.exportSession(this.editSubmitInstr);
        this.$refs.editInstrument.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/gym/equipment/update',
                method: 'post',
                data: {
                  id: this.editInstrument.id,
                  gymId: this.editInstrument.gymId,
                  equipmentName: this.editInstrument.equipmentName,
                  equipmentPath: this.editInstrument.equipmentPath,
                  equipmentTypeId: this.editInstrument.equipmentTypeId,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editInstrument'].resetFields();
                    this.editInstrVisible = false;
                    this.selectInstrument(this.gymId);
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
                message: '已取消编辑'
              });
              this.editInstrVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //删除器械
      handleDeleteInstrument(row) {
        global_.$options.exportSession(this.handleDeleteInstrument);
        this.$confirm('确认要删除吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/gym/equipment/delete/' + row.id,
            method: 'delete',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.selectInstrument(this.gymId);
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },
      //添加环境
      handleAddEnvironment() {
        global_.$options.exportSession(this.handleAddEnvironment);
        this.addEnvirVisible = true;
        this.addEnvironment.gymId = this.gymId
      },
      addSubmitEnvir() {
        global_.$options.exportSession(this.addSubmitEnvir);
        this.$refs.addEnvironment.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/gym/environ/add',
                method: 'put',
                data: {
                  gymId: this.addEnvironment.gymId,
                  environmentName: this.addEnvironment.environmentName,
                  environmentPath: this.addEnvironment.environmentPath,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addEnvironment'].resetFields();
                    this.addEnvirVisible = false;
                    this.selectEnvironment(this.gymId);
                  } else {
                    this.$message({
                      message: '提交失败',
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
              this.addEnvirVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //编辑环境
      handleEditEnvironment(row) {
        global_.$options.exportSession(this.handleEditEnvironment);
        this.editEnvirVisible = true;
        this.editEnvironment = Object.assign({}, row);
        this.editEnvironment.gymId = this.gymId;
      },
      editSubmitEnvir() {
        global_.$options.exportSession(this.editSubmitEnvir);
        this.$refs.editEnvironment.validate((valid) => {
          if (valid) {
            this.$confirm('您确定要提交吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios({
                url: this.path + 'resource/gym/environ/update',
                method: 'post',
                data: {
                  id: this.editEnvironment.id,
                  gymId: this.editEnvironment.gymId,
                  environmentName: this.editEnvironment.environmentName,
                  environmentPath: this.editEnvironment.environmentPath,
                },
                transformRequest: [function (data) {
                  let ret = ''
                  for (let it in data) {
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
                  if (res.data === 1) {
                    this.$message({
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['editEnvironment'].resetFields();
                    this.editEnvirVisible = false;
                    this.selectEnvironment(this.gymId);
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
                message: '已取消编辑'
              });
              this.editEnvirVisible = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleDeleteEnvironment(row) {
        global_.$options.exportSession(this.handleDeleteEnvironment);
        this.$confirm('确认要删除吗？', '提示', {type: 'warning'}).then(() => {
          this.$axios({
            url: this.path + 'resource/gym/environ/delete/' + row.id,
            method: 'delete',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': this.token,

            }
          }).then((res) => {
            if (res.data === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.selectEnvironment(this.gymId);
            } else if (res.data == 0) {
              this.$message({
                message: '操作失败',
                type: 'error'
              });
            }
          }).catch((err) => {
            console.log(err);
          })
        })
      },

      //上传封面
      handleAvatarSuccess(res, file) {
        this.addForm.gymPath = res;
      },
      handleAvatarEditSuccess(res, file) {
        this.editForm.gymPath = res;
      },
      //上传教练
      addCoachImg(res, file) {
        this.addCoach.coachPath = res;
      },
      addCoachCardImg(res, file) {
        this.addCoach.cardPhoto = res;
      },
      //编辑教练
      editCoachImg(res, file) {
        this.editCoach.coachPath = res;
      },
      editCoachCardImg(res, file) {
        this.editCoach.cardPhoto = res;
      },
      //上传环境图片
      addEnvirImg(res, file) {
        this.addEnvironment.environmentPath = res;
      },
      //编辑环境图片
      editEnvirImg(res, file) {
        this.editEnvironment.environmentPath = res;
      },
      //上传器械图片
      addInstrImg(res, file) {
        this.addInstrument.equipmentPath = res;
      },
      //编辑器械图片
      editInstrImg(res, file) {
        this.editInstrument.equipmentPath = res;
      },
     beforeAvatarUpload(file) {
				let supportedTypes = ['image/jpg', 'image/jpeg', 'image/png','image/gif','image/bmp'];
				const isJPG = supportedTypes.indexOf(file.type)
        const isLt2M = file.size / 1024 / 1024 < 3;
				if (isJPG < 0) {
					this.$message.error('上传头像图片格式错误!');
       }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 3MB!');
        }
        return isJPG && isLt2M;
     },
     beforeVideoUpload(file){
        let supportedTypes = ['video/mp4', 'video/3gp', 'video/flv','video/avi','video/mp3'];
				const isVideo = supportedTypes.indexOf(file.type)
				if (isVideo < 0) {
					this.$message.error('上传视频格式错误!');
					return false;
				}
      },
      getMap() {
        this.$refs.mapChild.getMapChild();
      },
      getEditMap() {
        this.$refs.mapEditChild.getEditMapChild(this.editForm.longitude, this.editForm.latitude);
      },
    },
  }


</script>
<style type="text/css" scoped="scoped">
  #map-container {
    width: 800px;
    height: 500px;
    display: block;
    margin: 20px auto;
  }

  #map-editContainer {
    width: 800px;
    height: 500px;
    display: block;
    margin: 20px auto;
  }

  .block {
    float: right;
    margin-top: 25px;
  }

  .plugins-tips .el-form-item {
    margin-bottom: 0;
  }

  .btn-box {
    margin-bottom: 20px;
  }

  .details-title {
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    height: 50px;
    margin-bottom: 20px;
    color: #1f2d3d;
  }

  .details-content {
    font-size: 14px;
    line-height: 1.5;
    padding: 0 5rem;
  }

  .gyminfo {
    width: 230px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .el-input--large .el-input__inner {
    height: 36px;
    font-size: 14px;
  }

  .amap-sug-result {
    position: absolute !important;
    left: 29.8% !important;
    z-index: 10000;

  }
  .anchorBL {
    display:none
  }
</style>
