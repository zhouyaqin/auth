
App({
    times: 0,
    touchDot: 0,//触摸时的原点
    interval: "",
    flag_hd: true,
    // host: "http://192.168.0.178:8080/faceRecog",
    host: "https://sfrz.ziyimingze.com/huimin/huimin",
    // host: "https://zyjk.ziyimingze.com/healthyapp",
    // imgHost: "https://tcboss.zetiantech.com",
    // host:'https://sfrz.ziyimingze.com/face',
    /**
     * 页面名称
     */
    name: "index",
    /*
     * 首次进入app加载
     */
    onLaunch: function() {
        var that = this, userInfo = wx.getStorageSync("userInfo")||{};
        if(!userInfo.openId || userInfo.openId==""){
            // 微信授权登录
            that.wxLogin(function(code){
                  that.getPosition();
                  that.toLogin(code, function(res){
                     wx.setStorageSync("userInfo", res.data);
                     wx.setStorageSync("isVeriAuthCode", []);
                  }); 
            });
        }
    },
    //绝对路径
    getUrl: function(name) {
        return this.host + "/" + name;
    },
    getUrls: function(name) {
        return this.survivalHost + "/" + name;
    },
    wxLogin: function(callback){
       var that = this;
       // 微信用户授权登录
        wx.login({
            success: function(res) {
                if (res.code) {
                    typeof callback === 'function' && callback(res.code);
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },
    //发送请求
    ajax: function(url, param, type, cb) {
        var that = this,
            token = wx.getStorageSync("userInfo").token || "",
            method = type || 'POST',
            header = {
                'content-type': 'application/x-www-form-urlencoded'
            };

        if (!param) param = {};

        if(token && token!=""){
            header = {
                'content-type': 'application/x-www-form-urlencoded',
                'token': token
            }
        }
        wx.request({
            url:that.getUrl(url),
            data: param,
            method: method,
            header: header,
            success: function(res) {
                var data = res.data;
                  if(typeof data === 'string'){
                      try{
                        data = JSON.parse(data);
                      }catch(e){
                        console.log(e);
                      }
                  }
                  if(data.status == "001"){
                    cb && cb.success && cb.success(data);
                  }else if(data.status == "000"){
                    cb && cb.error && cb.error(data);
                  }
            },
            fail: function(res) {
                wx.hideLoading();
                typeof fail === 'function' && fail(res);
            }
        });
        return;
    },
    imgRequest: function (name, file, formData, fileName, cb) {
        var that = this,
            formData = formData || {},
            header = {
              'content-type': 'multipart/form-data'
            };
            wx.showLoading();
            wx.uploadFile({
                url: that.getUrl(name), 
                filePath: file,
                name: fileName || 'file',
                method: 'POST',
                header: header,
                formData: formData,
                success: function (res) {
                    if (res.statusCode!="200") {
                      that.showFailMsg("识别错误，请重新上传！");
                      return;
                    }else{
                      var data = res.data;
                      if(typeof data === 'string'){
                          try{
                            data = JSON.parse(data);
                          }catch(e){
                            console.log(e);
                          }
                      }
                      if(data.status == "001"){
                        cb && cb.success && cb.success(data);
                      }else {
                        cb && cb.error && cb.error(data);
                      }
                    }
                },
                fail: function (res) {
                   cb && cb.fail && cb.fail(res.data);
                },
                complete: function(){
                    wx.hideLoading();
                }
            })
    },
    // 获取url参数值
    getUrlParams: function(url, name) {
        url = url || location.search;
        var sname = name + "=",
            len = sname.length,
            index = url.indexOf(sname),
            result, lastIndex;
        if (index != -1) {
            index += len;
            lastIndex = url.indexOf("&", index);
            result = lastIndex == -1 ? url.substring(index) : url.substring(index, lastIndex);
        }
        return result;
    },
    /*
     * 验证手机号码
     * @param phone {{ String  }} 手机号码
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkPhone: function(phone) {
        if (!phone || phone=="") {
            this.showFailMsg("请输入手机号码");
            return false;
        } else if (!/^1[34578]\d{9}$/.test(phone)) {
            this.showFailMsg("请输入正确的手机号码");
            return false;
        }
        return true;
    },
    /**
     * 格式化日期时间
     * @param  {[ string ]} datestr 时间字符串
     * @param  {[ string ]} format  时间输出格式
     */
    formatDate: function (datestr, format) {
      var date, dates;
      if (typeof datestr == "string") {
        if (datestr.length == 8) {
          date = new Date(datestr.substring(0, 4), datestr.substring(4, 6) - 1, datestr.substring(6, 8));
        } else if (datestr.length == 10) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10));
        } else if (datestr.length == 16) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10), datestr.substring(11, 13), datestr.substring(14, 16));
        } else if (datestr.length == 19) {
          date = new Date(datestr.substring(0, 4), datestr.substring(5, 7) - 1, datestr.substring(8, 10), datestr.substring(11, 13), datestr.substring(14, 16), datestr.substring(17, 19));
        }
      } else {
        date = datestr;
      }
      dates = {
        'y': date.getFullYear(),
        'M': this.padLeft(date.getMonth() + 1, "0", 2),
        'd': this.padLeft(date.getDate(), "0", 2),
        'h': this.padLeft(date.getHours(), "0", 2),
        'm': this.padLeft(date.getMinutes(), "0", 2),
        's': this.padLeft(date.getSeconds(), "0", 2)
      };
      format = format || "yyyy-MM-dd";
      return format.replace(/y+/, function (str) {
        return dates.y.toString().substr(-str.length);
      }).replace(/M+/, function (str) {
        return dates.M;
      }).replace(/d+/, function (str) {
        return dates.d;
      }).replace(/h+/i, function (str) {
        return dates.h;
      }).replace(/m+/, function (str) {
        return dates.m;
      }).replace(/s+/, function (str) {
        return dates.s;
      });
    },
    /*
     * 毫秒转化日期
     * @param  {[ number|string ]} time  毫秒数或者秒数
     * @param  {{ string }} format 日期格式
     */
    getFormatTime: function (time, format) {
      var that = this;
      var time = (time + '').length == 13 ? parseInt(time) : parseInt(time) * 1e3;
      var dates = toString(new Date(time));
      format = format || "yyyy-MM-dd";
      return format.replace(/y+/, function (str) {
        return dates.y.toString().substr(-str.length);
      }).replace(/M+/, function (str) {
        return dates.M;
      }).replace(/d+/, function (str) {
        return dates.d;
      }).replace(/h+/i, function (str) {
        return dates.h;
      }).replace(/m+/, function (str) {
        return dates.m;
      }).replace(/s+/, function (str) {
        return dates.s;
      });

      function toString(t) {
        return {
          'y': t.getFullYear(),
          'M': that.padLeft(t.getMonth() + 1, "0", 2),
          'd': that.padLeft(t.getDate(), "0", 2),
          'h': that.padLeft(t.getHours(), "0", 2),
          'm': that.padLeft(t.getMinutes(), "0", 2),
          's': that.padLeft(t.getSeconds(), "0", 2)
        };
      };
    },
    /**
     * 格式化字符串添加不足
     * @param  {[ string ]} str     需要格式化的字符串
     * @param  {[ string ]} padText 格式化字符串不足添加的参数
     * @param  {[ number ]} len     当前字符串的最小长度
     */
    padLeft: function (str, padText, len) {
      str = "" + str
      return str.length < len ? new Array((len + 1) - str.length).join(padText) + str : str;
    },
    /*
     * 验证验证码
     * @param code {{ String  }} 验证码
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkCode: function(code) {
        if (!code || !/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(code)) {
            this.showFailMsg("请输入正确验证码");
            return false;
        }
        return true;
    },
    /*
     * 验证邮箱
     * @param email {{ String  }} 邮箱
     * @return {{ boolean }}  成功-true  失败-false
     */
    checkEmail: function(email) {
        if (!email || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)) {
            this.showFailMsg("请输入正确邮箱");
            return false;
        }
        return true;
    },
    /*
     * 身份证验证
     * @param code {{ String  }} 验证码
     * @return {{ boolean }}  成功-true  失败-false
     */
    IdentityCodeValid: function(code) {
        var pass = true;
        if (!code || !/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(code)) {
            this.showFailMsg("无效身份证号码");
            pass = false;
        }
        return pass;
    },
    /**处理姓名替换*号 */
    HandleName: function (name) {
      if (name.length == 2) {
        return name.substr(0, 1) + '*';
      } else {
        var hao = '';
        for (var i = 2; i < name.length; i++) {
          hao += '*'
        }
        return name.substr(0, 1) + hao + name.substr(-1);
      }
    },
    
    /**处理身份证替换*号 */
    HandleIdCard: function (idCard) {
      return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2");
    },
    /*
     * 显示提示信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showFailMsg: function(msg) {
        wx.hideToast();
        wx.showModal({
            title: '提示',
            content: msg,
            confirmColor: "#6fabdd",
            cancelColor: "#dde3e8",
            showCancel: false
        });
    },
    /*
      * 显示提示信息
      * @param msg {{ String  }} 提示信息
      * @return  无
      */
    showTitleMsg: function (title,msg) {
      wx.hideToast();
      wx.showModal({
        title: title,
        content: msg,
        showCancel: false,
        confirmColor:"#6fabdd"
      });
    },

    /*
     * 显示提示信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showTipMsg: function(msg, icon) {
        wx.showToast({
            title: msg || '',
            icon: icon || '',
            duration: 2000,
            mask: true,
            success:function() {
              setTimeout(function () {
                wx.hideLoading();
              }, 2000);
             
            }
        });
    },

    /*
     * 显示加载信息
     * @param msg {{ String  }} 提示信息
     * @return  无
     */
    showLoadingMsg: function(msg, icon, time) {
        wx.showToast({
            title: msg || '',
            icon: icon || "loading",
            mask: true,
            duration: time || 2000
        });
    },
    /*
     * 显示加载信息
     * @param title {{ String  }} 提示信息
     * @return  无
     */
    showLoading: function(title) {
        wx.showLoading({
            title: title || ''
        });
        setTimeout(function() {
            wx.hideLoading()
        }, 2000);
    },
    /*
     * 显示confirm框
     * @param title {{ String  }} 标题
     * @param content {{ String  }} 内容
     * @param callback {{ Object  }} 回调函数
     * @return  无
     */
    onShowModal: function(option, callback, callback1) {
        wx.showModal({
            title: option.title || "温馨提示",
            content: option.content || "",
            showCancel:  option.showCancel || true,
            confirmColor: option.confirmColor || "#ef7100",
            cancelColor: option.cancelColor || "#b0b3ba",
            confirmText: option.confirmText || "确认",
            cancelText: option.cancelText || "取消",
            success: function(res) {
                if (res.confirm) {
                    callback && callback();
                }else if (res.cancel) {
                    callback1 && callback1();
                }
            }
        })
    },
    /*
     * 显示confirm框
     * @param title {{ String  }} 标题
     * @param content {{ String  }} 内容
     * @param confirmColor {{ String  }} 确定按钮颜色
     * @param cancelColor {{ String  }} 取消按钮颜色
     * @param confirmText {{ String  }} 确定按钮文本
     * @param cancelText {{ String  }} 取消按钮文本
     * @param showCancel {{ boolean  }} 是否显示取消按钮
     * @param confirm {{ Object  }} 确定回调函数
     * @param cancel {{ Object  }} 取消回调函数
     * @return  无
     */
    showModalDialog: function(title, content, modal, confirm, cancel){
        var confirmColor = modal.confirmColor || '#6fabdd',
            cancelColor  = modal.cancelColor || '#dde3e8',
            confirmText  = modal.confirmText  || '确定',
            cancelText   = modal.cancelText || '取消',
            showCancel   = modal.showModal || true;
            wx.showModal({
                title: title,
                content: content,
                showCancel: showCancel,
                confirmColor: confirmColor,
                cancelColor: cancelColor,
                confirmText: confirmText,
                cancelText : cancelText,
                success: function(res) {
                    if(res.confirm) {
                        confirm && confirm(res);
                    }else if(res.cancel) {
                        cancel && cancel(res);
                    }
                },
                fail: function(){

                }
            })
    },
    /**
     * 隐藏加载
     */
    hideLoadingMsg: function() {
        wx.hideToast();
    },
    /*
     * 获取当前坐标
     * @param cb {{ Object }}  回调函数
     * @return params {{ Object }} 坐标集合 wgs84 gcj02
     */
    getCurrentLocation: function(cb) {
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                cb && cb.success && cb.success(res);
            },
            fail: function() {
                cb && cb.fail && cb.fail();
            }
        });
    },
    /**
     * 获取定位地址
     */
     getCurrentAddress: function(location, callback){
        wx.request({
            url: 'https://restapi.amap.com/v3/geocode/regeo', //仅为示例，并非真实的接口地址
            data: {
              key: 'ef439c5176157223c87b50c5c9a1218a',
              location: location.join(",")
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function(res) {
                var data = res.data;
                if(data.status == "1"){
                    callback && callback(data);
                }
            }
          });
     },
    /*
     * 获取用户信息
     * @param cb {{ Object }}  回调函数
     * @return params {{ Object }} 用户信息集合
     */
    getUserInfoData: function(cb) {
        wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
              console.log(res);
                cb && cb.success && cb.success(res);
            },
            fail: function(res) {
                cb && cb.fail && cb.fail();
            }
        });
    },
    /* 触摸开始事件
     * 设置方法
     * app.flag_hd = true;
     * clearInterval(app.interval);
     * app.time = 0;
     **/
    touchStartPage: function (event) {
        var that = this;
        that.touchDot = event.touches[0].pageX; // 获取触摸时的原点
        // 使用js计时器记录时间    
        that.interval = setInterval(function () {
          that.time++;
        }, 100);
    },
    // 触摸结束事件
    touchEndPage: function (event, leftBackCall, rightBackCall) {
        var that = this,
            touchDot = that.touchDot,
            time = that.time,
            flag_hd = that.flag_hd,
            touchMove = event.changedTouches[0].pageX;
        // 向左滑动   
        if (touchMove - touchDot <= -40 && time < 10 && flag_hd == true) {
          that.flag_hd = false;
          //执行切换页面的方法
          console.log("向右滑动");
          rightBackCall && rightBackCall();
        }
        // 向右滑动   
        if (touchMove - touchDot >= 40 && time < 10 && flag_hd == true) {
          that.flag_hd = false;
          //执行切换页面的方法
          console.log("向左滑动");
          leftBackCall && leftBackCall();
        }
        clearInterval(that.interval); // 清除setInterval
        that.time = 0;
    },
    // 拆分数组
    sliceArray: function(array, size){
        var result = [];
        for (var i = 0; i < Math.ceil(array.length / size); i++) {
            var start = i * size;
            var end = start + size;
            result.push(array.slice(start, end));
        }
        return result;
    },
    /**
     * 拨打电话
     */
     makePhoneCall: function(telephone){
        var that = this,
            content = "你将要拨打的电话：" + telephone;
            if(!telephone || telephone==""){
               that.showFailMsg("发帖人很懒，不想给手机号");
               return;
            }
            that.onShowModal({
              title: "温馨提示",
              content:  content,
              confirmText: "拨打",
            }, function(){
                wx.makePhoneCall({
                  phoneNumber: telephone
                });
            }); 
    },
    /**
    * 拼接图片
    */
    getImageData: function(imgs){
      var that = this, imgUrls = [], imgFiles = [];
      if(imgs && imgs!=""){
          if(imgs.indexOf(",")>0){
              var imgArr = imgs.split(",");
              for(var i = 0, len = imgArr.length; i < len; i++){
                  var item = imgArr[i],
                      imgPath = that.imgHost + '/'+ item + '.jpg';
                  imgUrls.push(imgPath);
              }
          }else{
              var imgPath = that.imgHost + '/'+ imgs + '.jpg';
              imgUrls.push(imgPath);
          }
      }
      return imgUrls;
    },
    // 打开地图
    openMap: function (latitude, longitude) {
       if((!latitude||latitude=="") || (!longitude||longitude=="")){
         return;
       }
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 12
        });
    },
    // 去空格
    trim: function(str){ 
      return str.replace(/(^\s*)|(\s*$)/g, ""); 
    },
    // 截取限制内容
    splitContent: function(data, core){
       var that = this, content = "";
       if(data && data!=""){
           if(data.length > core){
              content = data.substring(0, core)+'...';
           }else{
              content = data;
           }
       }
       return content;
    },
    /**
     * 用户登录
     */
     toLogin: function(code, callback){
        var that = this;
            that.login({
                code: code
            },
            {
               success: function(res){
                  callback&&callback(res);
               },
               error: function(res){
               }
            });
     },
    // 获取位置
    getPosition: function(callback){
        var that = this;
        that.getCurrentLocation({
            success: function(res){
                var position = wx.getStorageSync('position') || {},
                    location = [res.longitude,res.latitude];
                    position.location = location;
                  that.getCurrentAddress(location, function(rs){
                     var regeocode = rs.regeocode,
                         addressComponent = regeocode.addressComponent,
                         address = regeocode.formatted_address,
                         adcode = addressComponent.adcode,
                         district = addressComponent.district;
                         position.adcode = adcode;
                         position.district = district;
                         position.address = address;
                         callback && callback(position);
                         wx.setStorageSync("position", position);        
                  });
              }
          });
    },
    /**
     * 登录
     * @interface  '/user/login'
     * @param {{ String }} 微信code
     */
    login: function(param, cb){
       this.ajax('UserInfo/login', param, null, cb);
    },
    /**
     * 获取认证列表
     * @interface  '/user/login'
     * @param {{ Int }} current 当前页
     * @param {{ String }} openId
     * @param {{ String }} content 搜索内容
     */
    getRegisterRecords: function(param, cb){
       this.ajax('idRecog/getRegisterRecords.do', param, null, cb)
    },
    /**
     * 拍照认证
     * @interface  '/idRecog/faceIdentify.do'
     * @param {{ String }} openId
     * @param {{ double }} longitude 经度
     * @param {{ double }} latitude 纬度
     * @param {{ String }} location 地址
     */
    faceIdentify: function(param, formData, cb){
       this.imgRequest('idRecog/faceIdentify.do', param, formData, null, cb);
    },
    /**
     * 图片验证
     * @interface  '/idRecog/faceIdentifyHelp.do'
     * @param {{ String }} openId
     * @param {{ String }} id
     * @param {{ double }} longitude 经度
     * @param {{ double }} latitude 纬度
     * @param {{ String }} location 地址
     */
    faceIdentifyHelp: function(param, formData, fileName, cb){
       this.imgRequest('idRecog/faceIdentifyHelp.do', param, formData, fileName, cb);
    },
    /**
     * 图片验证
     * @interface  '/idRecog/uploadFile.do'
     * @param {{ String }} openId
     * @param {{ String }} file
     * @param {{ Int }} type
     */
    uploadFile: function(param, formData, fileName, cb){
       this.imgRequest('idRecog/uploadFile.do', param, formData, fileName, cb);
    },
    /**
     * 上传委托人图片
     * @interface  '/idRecog/saveMandaIdCard.do'
     * @param {{ String }} openId
     */
    saveMandaIdCard: function(param, formData, cb){
       this.imgRequest('idRecog/saveMandaIdCard.do', param, formData, cb);
    },
    /**
     * 提交申请资料
     * @interface  '/idRecog/submitInfo.do'
     * @param {{ String }} openId
     */
    submitInfo: function(param, cb){
        this.ajax('idRecog/submitInfo.do', param, null, cb);
    },
    /**
     * 获取短信接口
     * @interface  '/message/getAuthCode.do'
     * @param {{ String }} phone
     */
    getAuthCode: function(param, cb){
        this.ajax('message/getAuthCode.do', param, null, cb);
    },
    /**
     * 获取短信接口
     * @interface  '/message/veriAuthCode.do'
     * @param {{ String }} phone
     * @param {{ String }} code
     */
    veriAuthCode: function(param, cb){
        this.ajax('message/veriAuthCode.do', param, null, cb);
    },
    /**
     * 获取新闻类别
     * @interface  '/infoCategory/getCategory.do'
     * @param {{ String }} openId
     */
     getCategory: function(param, cb){
         this.ajax('infoCategory/getCategory.do', param, null, cb);
     },
     /**
     * 根据类别获取新闻
     * @interface  '/information/findByCategory.do'
     * @param {{ String }} openId
     */
     findByCategory: function(param, cb){
         this.ajax('information/findByCategory.do', param, null, cb);
     },
     /**
     * 意见反馈
     * @interface  '/information/findByCategory.do'
     * @param {{ String }} openId
     * @param {{ String }} content
     * @param {{ String }} image
     */
     submitFeedback: function(param, cb){
         this.ajax('feedback/submitFeedback.do', param, null, cb);
     },
     /**
     * 获取新闻列表
     * @interface  '/information/findNewestInfo.do'
     * @param {{ String }} current
     */
     findNewestInfo: function(param, cb){
         this.ajax('information/findNewestInfo.do', param, null, cb);
     },
     /**
     * 获取消息列表
     * @interface  '/message/getMessage.do'
     * @param {{ String }} openId
     */
     getMessage: function(param, cb){
         this.ajax('message/getMessage.do', param, null, cb);
     },
     /**
     * 获取认证记录详情
     * @interface  '/idRecog/getRecogRecordById.do'
     * @param {{ String }} id
     */
     getRecogRecordById: function(param, cb){
         this.ajax('idRecog/getRecogRecordById.do', param, null, cb);
     },
     /**
     * 获取认证记录
     * @interface  '/idRecog/getRecogRecords.do'
     * @param {{ String }} idNumber
     * @param {{ Int }} current
     */
     getRecogRecords: function(param, cb){
         this.ajax('idRecog/getRecogRecords.do', param, null, cb);
     },
     /**
     * 获取用户信息
     * @interface  '/idRecog/getRecogRecords.do'
     * @param {{ String }} idNumber
     */
     getUserInfo: function(param, cb){
         this.ajax('idRecog/getUserInfo.do', param, null, cb);
     },
     /**
     * 获取用户信息
     * @interface  '/idRecog/deleteRegisterRecord.do'
     * @param {{ String }} idNumber
     * @param {{ String }} openId
     */
     deleteRegisterRecord: function(param, cb){
         this.ajax('idRecog/deleteRegisterRecord.do', param, null, cb);
     },
     /**
     * 获取用户信息
     * @interface  '/UserInfo/changeTelephone.do'
     * @param {{ String }} idNumber
     * @param {{ String }} telephone
     */
     changeTelephone: function(param, cb){
         this.ajax('UserInfo/changeTelephone.do', param, null, cb);
     },
     /**
     * 补贴统计
     * @interface  '/guaranteeStatistics/getStatistics.do'
     * @param {{ String }} idNumber
     * @param {{ String }} telephone
     */
     getStatistics: function(param, cb){
         this.ajax('guaranteeStatistics/getStatistics.do', param, null, cb);
     },
     /**
     * 补贴统计
     * @interface  '/UserInfo/getFamilyMasterInfo.do'
     * @param {{ String }} idNumber
     */
     getFamilyMasterInfo: function(param, cb){
         this.ajax('UserInfo/getFamilyMasterInfo.do', param, null, cb);
     },
     /**
     * 新闻详情
     * @interface  '/information/getDetailById.do'
     * @param {{ String }} id
     */
     getDetailById: function(param, cb){
         this.ajax('information/getDetailById.do', param, null, cb);
     },
     /**
     * 根据人脸获取用户信息
     * @interface  '/idRecog/getUserInfoByFace.do'
     * @param {{ String }} id
     */
     getUserInfoByFace: function(param, formData, fileName, cb){
       this.imgRequest('idRecog/getUserInfoByFace.do', param, formData, fileName, cb);
     },
     /**
     * 根据idNumber查询用户信息
     * @interface  '/UserInfo/getUserInfoById.do'
     * @param {{ String }} idNumber
     */
     getUserInfoById: function(param, cb){
        this.ajax('UserInfo/getUserInfoById.do', param, null, cb);
     },
     /**
     * 获取户主户口页
     * @interface  '/UserInfo/getFamilyMasterInfo.do'
     * @param {{ String }} idNumber
     */
     getFamilyMasterInfo: function(param, cb){
        this.ajax('UserInfo/getFamilyMasterInfo.do', param, null, cb);
     },
     /**
     * 根据类别查找消息
     * @interface  '/message/getMessageByType.do'
     * @param {{ String }} idNumber
     */
     getMessageByType: function(param, cb){
        this.ajax('message/getMessageByType.do', param, null, cb);
     },
     /**
     * 获取banner
     * @interface  '/banner/getBanner.do'
     * @param {{ String }} idNumber
     */
     getBanner: function(param, cb){
        this.ajax('banner/getBanner.do', param, null, cb);
     }
});
