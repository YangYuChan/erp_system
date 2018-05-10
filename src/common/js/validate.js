let pwd;
let worth;
let money;
export default {
	checkTitle:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写标题'));
		} else if  (value.length > 26)  {
	        return callback(new Error('标题不能超过26个字'));
	    }else {
			callback()
		}
	},
	checkName:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写名称'));
		} else {
			callback()
		}
	},
	checkClassName:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写课程名称'));
		} else {
			callback()
		}
	},
	checkPPrice:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写售价'));
		} else if(value <= 0) {
			return callback(new Error('课程售价必须大于0'));
		}else{
			callback()
		}
	},
	checkPhone: function(rule, value, callback) {
		var reg = /(^\d{11}$)/,
			reg2 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
		if(value.indexOf('-') > 0){
			if(!reg2.test(value)){
	    		return callback(new Error('固定电话格式不正确'));
	    	}else{
	    		callback()
	    	}
		}else{
			if(!reg.test(value))  {
	        return callback(new Error('手机号必须是11位'));
		    }else {
				callback()
			}
		}
	},
	checkCardNo: function(rule, value, callback) {
		var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if(!reg.test(value)){
			return callback(new Error('身份证号码格式不正确'));
		}else if(value.length > 18)  {
	        return callback(new Error('身份证号码不能大于18位'));
	    } else {
			callback()
		}
	},
	checkType: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请选择类型'));
		} else {
			callback()
		}
	},
	checkNum: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入数字'));
		} else {
			callback()
		}
	},
	checkAuth: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入作者'));
		} else {
			callback()
		}
	},
	checkContext: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入内容'));
		} else {
			callback()
		}
	},
	checkAuthor: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入作者'));
		} else {
			callback()
		}
	},
	checkBrand: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入商家品牌名称'));
		} else {
			callback()
		}
	},
	checkRealName: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请输入真实姓名'));
		} else {
			callback()
		}
	},

	checkRegPassword: function(rule, value, callback) {
		pwd = value;
		if(!value) {
			return callback(new Error('请输入密码'));
		} else {
			callback()
		}
	},
	checkRegPasswordBean: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请确认密码'));
		}else if(value != pwd){
			return callback(new Error('两次密码不一致，请重新输入'));
		}else {
			callback()
		}
	},
	//验证身份证 生日
	cardNo: function(rule, value, callback) {
		var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if(value) {
      if (!reg.test(value)) {
        return callback(new Error('身份证号码格式不正确'));
      } else if (value.length > 18) {
        return callback(new Error('身份证号码不能大于18位'));
      } else {
        var year = value.slice(6, 10);
        var month = value.slice(10, 12);
        var date = value.slice(12, 14);
        if (year > 2018 || year < 1918) {
          return callback(new Error('身份证号码格式不正确'));
        } else if (month > 12) {
          return callback(new Error('身份证号码格式不正确'));
        } else if (date > 31) {
          return callback(new Error('身份证号码格式不正确'));
        } else {
          callback()
        }
      }
    }else{
      callback()
    }
	},
	checkUserPhone: function(rule, value, callback) {
		var reg = /(^\d{11}$)/
		if(!reg.test(value))  {
	        return callback(new Error('手机号必须是11位'));
		}else {
				callback()
		}
	},
  checkGiveMoney: function(rule, value, callback) {
    worth = value;
    if(!value) {
      return callback(new Error('请输入充值金额'));
    } else if(value < money) {
      return callback(new Error('充值金额必须大于实收金额'));
    }else{
      callback()
    }
	},
	checkMoney: function(rule, value, callback) {
	  money = value;
		if(!value) {
			return callback(new Error('请输入实收金额'));
		} else if(value > worth) {
			return callback(new Error('实收金额不能大于充值金额'));
		}else{
			callback()
		}
	},
	checkPassword: function(rule, value, callback) {
		var reg=/^[0-9A-Za-z]{6,12}$/;
		if(!value) {
			return callback(new Error('请输入密码'));
		} else if(!reg.test(value)) {
			return callback(new Error('密码由6-12位数字和字母组成'));
		}else{
			callback()
		}
	},
	checkNewPassword: function(rule, value, callback) {
		var reg=/^[0-9A-Za-z]{6,12}$/;
		if(!reg.test(value)) {
			return callback(new Error('密码由6-12位数字和字母组成'));
		}else{
			callback()
		}
	},
  checkValidTime: function(rule, value, callback) {
    if(!value) {
      return callback(new Error('请输入正确的有效时间'));
    } else if(value < 1) {
      return callback(new Error('有效时间必须大于0'));
    }else{
      callback()
    }
  },
}
