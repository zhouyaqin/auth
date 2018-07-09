

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  onShareAppMessage: function () {
    return {
      title: '惠民服务云-拍照认证',
      path: '/pages/idauth/idauth'
    }
  },
  /**
   * 页面名称
   */
  name: "idauth",
  /**
   * 页面的初始数据
   */
  data: {
      windowWidth: 0,
      windowHeight: 0,
      longitude: 0,
      latitude: 0,
      address: '',
      imgPath: '../../static/images/512.png',
      uploadImg: [],
      isDisabled: true
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
        app.getPosition(function(res){
          if(res.location.length){  
             that.setData({
                longitude: res.location[0],
                latitude: res.location[1],
                address: res.address
             });
          }
        });
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
  /**拍照认证 */
  uploadImgBtn: function () {
    var that = this,
        data = that.data,
        userInfo = wx.getStorageSync('userInfo') || {},
        position = wx.getStorageSync('position') || {},
        longitude = data.longitude || (position.location&&position.location.length>0)? position.location[0]:0,
        latitude = data.latitude || (position.location&&position.location.length>0)? position.location[1]:0,
        location = data.address || position.address,
        imgPath = that.data.imgPath;

	   app.faceIdentify(imgPath, {
	        longitude: longitude,
          latitude: latitude,
          location: location,
          openId: userInfo.openId || ''
	    }, {
	   	 success: function(res){
          wx.switchTab({
            url: '../identity/identity'
          });
	   	 },
	   	 error: function(res){
          app.showFailMsg(res.msg);
	   	 }
	   });
   },
   uploadImg: function() {
      var that = this;
	      wx.chooseImage({
	        count: 1, // 默认9
	        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
	        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
	        success: (res) => {
	          var data = {
	            file: res.tempFilePaths
	          }
	          if (res.tempFilePaths[0] != "") {
	            that.setData({
	              imgPath: res.tempFilePaths[0],
	              uploadImg: res.tempFilePaths,
	              isDisabled: false
	            });
	          }
	        }
	      });
    }
});