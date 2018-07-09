var WxParse = require('../../libs/wxParse/wxParse.js');
// 获取全局应用程序实例对象
var app = getApp();

Page({
  onShareAppMessage: function() {
      return {
          title: '子义健康-资讯',
          path: '/pages/InfoDetail/InfoDetail'
      }
  },
  /**
   * 页面名称
   */
  name: "InfoDetail",
  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 300,
    windowHeight: 400,
    newsId:'',
    datail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, newsId = options['id'] || '';

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
           windowWidth: res.windowWidth,
           windowHeight: res.windowHeight
        });
      }
    });

    if(newsId){
        that.setData({
          newsId: newsId
        });
        that.getDetailById(newsId);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  /**获取当前时间 */
  getNowTime:function(datetime) {
    var date = new Date(datetime);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return (year + '年' + month + '月' + day + '日 ' + hour+':'+ minute)
  },
 /**
 * 展示详情
 */
  getDetailById:function(newsId) {
    var that = this;

        app.getDetailById({
          id: newsId
        },{
           success: function(res){
              var data = res.data;
              data.createDate = that.getNowTime(data.createDate);
              WxParse.wxParse('content', 'html', data.content, that, 5);
              that.setData({
                datail: data
              });
           },
           error: function(res){
           }
        });

   
  }
})