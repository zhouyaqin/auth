
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  onShareAppMessage: function () {
    return {
      title: '惠民服务云-人工认证',
      path: '/pages/distfeedback/distfeedback'
    }
  },
  /**
   * 页面名称
   */
  name: "distfeedback",
  /**
   * 页面的初始数据
   */

  data: {
      windowWidth: '',
      windowHeight: '',
      userInfo: {},
      position: {},
      isDisabled: true,
      uploadImg: [],
      isVideo: true,
      imgId: "",
      imgPath: '/static/images/dist_02.png',
      videoPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
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
      var that = this,
          userInfo = wx.getStorageSync("userInfo")||{},
          position = wx.getStorageSync("position")||{};
          that.setData({
            userInfo: userInfo,
            position: position
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
  /**
   * 提交保存反馈数据
   *
   ***/
  onSubmitData: function(){
    var that = this,
        data = that.data,
        userInfo = data.userInfo,
        position = data.position,
        file = data.videoPath,
        imgId = data.imgId,
        params = {
          id: parseInt(imgId),
          longitude: position.location[0],
          latitude: position.location[1],
          location: position.address,
          openId: userInfo.openId||''
        };

        if(imgId==""){
          app.showFailMsg("请上传验证人图片");
          return;
       }

       if(!file || file==""){
          app.showFailMsg("请上传验证人视频");
          return;
       }

       app.faceIdentifyHelp(file, params, "video" ,{
          success: function(res){
             app.onShowModal({
                content: res.msg,
                confirmColor: "#6fabdd",
                cancelColor: "#dde3e8",
                showCancel: false,
             }, function(res){
                wx.navigateBack({
                  delta: -1
                });
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
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            var filePath = res.tempFilePaths[0];
            var formData = { type: 5 };

            if (filePath != "") {
                that.setData({
                  imgPath: filePath,
                  uploadImg: res.tempFilePaths
                });

                app.uploadFile(filePath, formData, "file", {
                    success: function(rs){
                         that.setData({
                            imgId: rs.data,
                            isDisabled: false
                         });
                         app.showFailMsg("图片上传成功，请继续上传视频！");
                    },
                    error: function(rs){
                        app.showFailMsg(rs.msg);
                        that.setData({
                          isDisabled: true
                        });
                        return;
                    },
                    fail: function(){
                        that.setData({
                          isDisabled: true
                        });
                        return;
                    }
                });
            }
          }
        });
    },
    uploadVideo: function() {
        var that = this,
            imgId = that.data.imgId;
          if(imgId && imgId!=""){
            wx.chooseVideo({
                sourceType: ['camera'],
                maxDuration: 5,
                compressed: true,
                camera: 'back',
                success: function(res) {
                    that.setData({
                        videoPath: res.tempFilePath,
                        isVideo: false
                    });
                    that.onSubmitData();
                }
            })
          }else{
            app.showFailMsg("请先上传验证人图片");
          }

    }
});