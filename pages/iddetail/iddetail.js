

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
	onShareAppMessage: function () {
		return {
		  title: '惠民服务云-我的',
		  path: '/pages/iddetail/iddetail'
		}
	},
	/**
	* 页面名称
	*/
	name: "iddetail",
	/**
	* 页面的初始数据
	*/
	data: {
	  windowWidth: 0,
	  windowHeight: 0,
	  idNumber: '',
	  remindDetail: {},
	  headerImage: ['/static/images/idCardNan.jpg', '/static/images/idCardNv.jpg'],
	  statisticsList: []
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

	  if(options['idNumber'] && options['idNumber']){
	  	  that.setData({
	  	  	 idNumber: options['idNumber']
	  	  });
	  }
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
		that.getUserInfoById();
		that.getStatistics();
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
		 	if(headImg.indexOf(".jpg")>0){
		    	img = headImg;
		 	}else{
		 		img = "data:image/jpg;base64," + headImg;
		 	}
		 }
		 return img;
	},
	onShowRecord: function(e){
		var that = this,
		    remindDetail = that.data.remindDetail;

		    wx.navigateTo({
	           url: '../record/record?name=' + remindDetail.name + '&idNumber=' + remindDetail.idNumber + '&juweihui=' + remindDetail.juweihui
	        });
	},
	getUserInfoById: function(){
		var that = this, idNumber = that.data.idNumber;
			app.getUserInfoById({
				idNumber: idNumber
			},{
				success: function(res){
					var data = res.data;
					if(data){
						data.registerTime = app.getFormatTime(new Date(data.registerTime).getTime(), 'yyyy-MM-dd hh:mm:ss'); 
				        data.idNumber = data.idNumber;
				        data.headImage = that.getSexHeadImg(data.sex, data.headImage);
				        that.setData({
				        	remindDetail: data
				        });
					}
				},
				error: function(res){
					app.showFailMsg(res.msg);
				}
			});
	},
	getStatistics: function(){
		 var that = this,
		 	 totalAmount = 0,
		 	 idNumber = that.data.idNumber;

			 app.getStatistics({
			 	idNumber: idNumber
			 },{
			 	success: function(res){
			 		var data = res.data;
			 		if(data && data.length){
			 			for(var i = 0, len = data.length; i < len; i++ ){
			 				var item = data[i], list = item.list || [];
			 				if(list.length){	
				 				for(var j = 0; j < list.length; j++){
				 					var listItem = list[j];
				 					listItem.date = app.getFormatTime(new Date(listItem.date).getTime(), 'yyyy-MM-dd hh:mm:ss');
				 					totalAmount+= listItem.amount;
				 				}
				 			    item.totalAmount=totalAmount;
			 				}
			 			}
			 			that.setData({
			 				statisticsList: data
			 			});
			 		}else{
			 			that.setData({
			 				statisticsList: []
			 			});
			 		}
			 	},
			 	error: function(res){
			 		app.showFailMsg(res.msg);
			 	}
			 });
	}



});