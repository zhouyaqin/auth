
const lunar = require('../../utils/lunar.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-首页',
            path: '/pages/index/index'
        }
    },
    /**
     * 页面名称
     */
    name: "index",
    /**
     * 页面的初始数据
     */
    dataList: [],
    data: {
        windowWidth: 0,
        windowHeight: 0,
        classifyGroup: [],
        banner: [],
        dataList: [],
        pageNum: 0,
        currentPage: 1,
        totalPage: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });
        that.getBanner();
        that.getCategoryByRegion();
        that.findNewestInfo(1);
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
    },
    
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function onHide() {

    },
    /*
     * 页面滚动触发事件的处理函数
     */
    onPageScroll: function(e) {

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
        // Do something when page reach bottom.
        var that = this,
            data = that.data,
            current = data.currentPage,
            pageNum = data.pageNum;
        current++;
        if(current <= pageNum){
            that.findNewestInfo(current);
        }else{
            return;
        }
    },
    getBanner: function(){
       var that = this;
       app.getBanner({},{
          success: function(res){
              var data = res.data, banner = [];
              if(data){
                  for(var i = 0, len = data.length; i < len; i++){
                      var item = data[i], 
                          imgs = {
                             image: item.image,
                             action: item.action
                          };
                      banner.push(imgs);
                  }
                  that.setData({
                     banner: banner
                  });
              }
          },
          error: function(res){

          }
       });
    },
    /**
      * 获取根据所在区域获取帖子类别
      */
     getCategoryByRegion: function(){
        var that = this,
            classifyGroup = [];

        app.getCategory({},{
            success: function(res){
                var data = res.data;
                if(data.length){
                     var classifyList = app.sliceArray(data, 8);
                     for(var i = 0; i < classifyList.length; i++ ){
                        var item = {
                               classifyList: classifyList[i]
                            }
                        classifyGroup.push(item);
                     }

                     that.setData({
                        classifyGroup: classifyGroup
                     });
                  }
            }
        });
          
     },
     findNewestInfo: function(current){
        var that = this,
            userInfo = wx.getStorageSync('userInfo'),
            openId = userInfo.openId || "";

            if(current==1){
                that.dataList = [];
            }

            app.findNewestInfo({
                current: current
            },{
                success: function(res){
                    var data = res.data;
                    if(data){
                        var list = data.list;
                        if(list && list.length){
                            for(var i = 0, len = list.length; i < len; i++){
                                var item = list[i];
                                item.title = app.splitContent(item.title, 15);
                                item.summary = app.splitContent(item.summary, 30);
                                item.createDate = app.getFormatTime(new Date(item.createDate).getTime(), 'yyyy-MM-dd hh:mm:ss');
                                that.dataList.push(item);
                            }
                            that.setData({
                                dataList: that.dataList,
                                pageNum: data.pages,
                                currentPage: data.current,
                                totalPage: data.total
                            });
                        }else{
                            that.setData({
                                dataList: that.dataList,
                                pageNum: 1,
                                currentPage: 1,
                                totalPage: 1
                            });
                        }
                    }
                },
                error: function(res){

                }
            });
     }
});
