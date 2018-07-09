

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
	onShareAppMessage: function () {
		return {
		  title: '惠民服务云-我的',
		  path: '/pages/identity/identity'
		}
	},
	/**
	* 页面名称
	*/
	name: "identity",
	/**
	* 页面的初始数据
	*/
	remindList: [],
	data: {
	  windowWidth: 0,
	  windowHeight: 0,
	  startX: 0, //开始坐标
	  startY: 0,
	  remindList: [],
	  imgPath: '../../static/images/512.png',
	  name: "",
	  idNumber: "",
	  headerImage: ['/static/images/idCardNan.jpg', '/static/images/idCardNv.jpg'],
	  latitude: '', //当前的经纬度
	  longitude: '',
	  content:'',
	  location:'',
	  pageNum: 0,
	  currentPage: 1,
	  totalPage: 0
	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function onLoad(options) {
	  var that = this;
	  wx.getSystemInfo({
	        success: function(res) {
	            that.setData({
	                windowWidth: res.windowWidth,
	                windowHeight: res.windowHeight
	            });
	        }
	    });
	},

	/**
	* 生命周期函数--监听页面初次渲染完成
	*/
	onReady: function onReady() {

	},

	/**
	* 生命周期函数--监听页面显示
	*/
	onShow: function onShow() {
		var that = this;
		that.remindList = [];
		that.getRegisterRecords(1);
	},


	/**
	* 生命周期函数--监听页面隐藏
	*/
	onHide: function onHide() {

	},


	/**
	* 生命周期函数--监听页面卸载
	*/
	onUnload: function onUnload() {},


	/**
	* 页面相关事件处理函数--监听用户下拉动作
	*/
	onPullDownRefresh: function onPullDownRefresh() {
	 wx.stopPullDownRefresh();
	},
	/*
	* 页面上拉触底事件的处理函数
	*/
	onReachBottom: function() {
	  var that = this,
	      data = that.data,
	      current = data.currentPage,
	      pageNum = data.pageNum;
		  current++;
		  if(current <= pageNum){
		      that.getRegisterRecords(current);
		  }else{
		      return;
		  }
	},

	/**
	* 认证人列表
	**/
	getRegisterRecords: function(current){
	 var that = this,
	 	 content = that.data.content,
	 	 userInfo = wx.getStorageSync("userInfo");

	     if(current==1){
	     	that.remindList = [];
	     }

	     app.getRegisterRecords({
	     	 current: current || 1,
	     	 content: content || '',
	     	 openId: userInfo.openId || ''
	     },{
	     	success: function(res){
	     		var data = res.data;
	     		if(data){
	     			var list = data.list;
					    if(list && list.length > 0) {
					          for(var i = 0; i< list.length; i++) {
					            var item = list[i];
					                item.isTouchMove = false;
					                item.registerTime = app.getFormatTime(new Date(item.registerTime).getTime(), 'yyyy-MM-dd hh:mm:ss'); 
					                item.name = app.HandleName(item.name);
					                item.idNumber = item.idNumber;
					                item.idNumberText = app.HandleIdCard(item.idNumber);
					                // item.location = app.splitContent(item.location, 15);
					                item.headImage = that.getSexHeadImg(item.sex, item.headImage);
					                item.titleResult = item.status==1?'审核中':item.status==2?'审核失败':item.status==3?'认证成功':'未认证';
					                that.remindList.push(item);
					          }
					          that.setData({
					            remindList: that.remindList,
					            pageNum: data.pages,
					            currentPage: data.current,
					            totalPage: data.total
					         });
					    }else{
					    	that.setData({
					    		remindList: that.remindList,
					    	});
					    }
	     		}
	     	},
	     	error: function(res){

	     	}
	     });

	    
	},
	getSexHeadImg: function(sex, headImg){
		 var that = this, img = '', headerImage = that.data.headerImage;
		 if(headImg == '' || !headImg){
		    if (sex == '男') {
		      img = headerImage[0];
		    }else{
		      img = headerImage[1];
		    }
		 }else{
		    img = "data:image/jpg;base64," + headImg;
		 }
		 return img;
	},
	/**搜索框 */
	onInputKeyContent: function (e) {
		var that = this,
		    content = e.detail.value;
		    that.setData({
		      content: content
		    });
	},
	onSearchUser: function(){
		var that = this;
		that.getRegisterRecords(1);
	},
	// 删除认证信息
	deleteRegisterRecord: function(e){
		 var that = this,
		 	 userInfo = wx.getStorageSync("userInfo"),
		 	 openId = userInfo.openId || "",
		     id = e.currentTarget.dataset.id;

		     if(id) {
		       app.onShowModal({
		         content: '确定删除该信息'
		       }, function() {
		       		app.deleteRegisterRecord({
		       			idNumber: id,
		       			openId: openId
		       		},{
		       			success: function(res){
		       				that.getRegisterRecords(1);
		       			},
		       			error: function(res){

		       			}
		       		});
		       });
		     }  
	},
	// 编辑申请人
	editRegisterRecord: function(e){
		var that = this,
			idNumber = e.target.dataset.id,
			status = e.target.dataset.status;
			if(idNumber!=""){
				wx.navigateTo({
					url: '../addId/addId?isEdit=1&idNumber=' + idNumber + '&status=' + status
				});
			}
	},
	/***跳转认证 */
	authentication:function(e) {
		var status = e.currentTarget.dataset.status,
			veriAuthCode = wx.getStorageSync("isVeriAuthCode") || [],
		    name = e.currentTarget.dataset.name,
		    isChild  = e.currentTarget.dataset.ischild,
		    juweihui = e.currentTarget.dataset.juweihui,
		    idNumber = e.currentTarget.dataset.number;

		    if(status == -1 && isChild==1){
		    	wx.navigateTo({
		    		url: '../family/family?idNumber=' + idNumber
		    	});
		    }
		    if(status==1) {
		      app.showFailMsg('资料审核中，请耐心等待...');
		    }
		    if (status == 2) {
		      app.showFailMsg('审核失败，请重新提交资料。');
		    }
		    if(status == 3) {
		    	if(veriAuthCode.length){
		    		for(var i = 0, len = veriAuthCode.length; i < len; i++){
			    		if(idNumber == veriAuthCode[i]){
							wx.navigateTo({
					        	url: '../iddetail/iddetail?idNumber=' + idNumber
					    	});
				    	}
			    	}
		    	}else{
		    		wx.navigateTo({
				        url: '../phone/phone?flag=1&idNumber=' + idNumber
				    });
		    	}
		    }
	},
	//手指触摸动作开始 记录起点X坐标
	touchstart: function (e) {
		var that = this;
		//开始触摸时 重置所有删除
		that.data.remindList.forEach(function (v, i) {
		  if(v.isTouchMove)//只操作为true的
		    v.isTouchMove = false;
		  });
		  that.setData({
		   startX: e.changedTouches[0].clientX,
		   startY: e.changedTouches[0].clientY,
		   remindList: that.data.remindList
		  });
	},
	//滑动事件处理
	touchmove: function (e) {
		var that = this,
		    index = e.currentTarget.dataset.index,//当前索引
		    startX = that.data.startX,//开始X坐标
		    startY = that.data.startY,//开始Y坐标
		    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
		    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
		    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY }); //获取滑动角度

		    that.data.remindList.forEach(function (v, i) {
		       v.isTouchMove = false
		       //滑动超过30度角 return
		       if (Math.abs(angle) > 30) return;
		       if (i == index) {
		          if (touchMoveX > startX) //右滑
		            v.isTouchMove = false
		          else //左滑
		            v.isTouchMove = true
		       }
		    })
		    //更新数据
		    that.setData({
		      remindList: that.data.remindList
		    })
	},
	/**
	* 计算滑动角度
	* @param {Object} start 起点坐标
	* @param {Object} end 终点坐标
	*/
	angle: function (start, end) {
		var _X = end.X - start.X,
		    _Y = end.Y - start.Y
		    //返回角度 /Math.atan()返回数字的反正切值
		    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
	}


});