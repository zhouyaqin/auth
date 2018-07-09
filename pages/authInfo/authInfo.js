
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-认证信息',
            path: '/pages/authInfo/authInfo'
        }
    },
    /**
     * 页面名称
     */
    name: "authInfo",
    /**
     * 页面的初始数据
     */

    data: {
        windowWidth: 0,
        windowHeight: 0,
        authInfo: {
            registerTime: '',
            registerLocation: '',
            headImage: '',
            idNumber: '',
            score:''
        }
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

        that.setData({
            name: options['name'] || '',
            id: options['id'] || '',
            juweihui: options['juweihui'] || '',
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
      this.getRecogRecords()
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
    getRecogRecords: function () {
      var that = this,
          name = that.data.name,
          juweihui = that.data.juweihui,
          id = that.data.id;

        app.getRecogRecordById({
           id: id
        },{
           success: function(res){
              var data = res.data || {};
              if(data){
                  var authInfo = {
                        registerTime: app.getFormatTime(new Date(data.registerTime).getTime(), 'yyyy-MM-dd hh:mm:ss') || '',
                        registerLocation: data.registerLocation || '',
                        headImage: "data:image/jpg;base64," +data.headImage ,
                        score: Math.floor((data.score)*100) || '',
                        name: app.HandleName(name),
                        idNumber: app.HandleIdCard(data.userId),
                        juweihui: '('+juweihui+')'
                      }
                  that.setData({
                     authInfo: authInfo
                  });
              }
           },
           error: function(res){

           }
        });
    }
});
