
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        var that = this,
            categoryId = that.data.categoryId,
            categoryName = that.data.categoryName;
        return {
            title: '惠民服务云-分类模板',
            path: '/pages/temp/temp?categoryId='+ categoryId +'&categoryName=' + categoryName
        }
    },
    /**
     * 页面名称
     */
    name: "temp",
    /**
     * 页面的初始数据
     */
    dataList: [],
    data: {
        windowWidth: 0,
        windowHeight: 0,
        categoryId: 0,
        categoryName: '',
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

        if((option['categoryId']) || option['categoryName']){
          wx.setNavigationBarTitle({
              title: option['categoryName']
          });
          that.setData({
             categoryId: option['categoryId'],
             categoryName: option['categoryName']
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

         that.getByCategory(1);

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
        // Do something when page reach bottom.
        var that = this,
            data = that.data,
            current = data.currentPage,
            pageNum = data.pageNum;

          current++;
          if(current <= pageNum){
              that.getByCategory(current);
          }else{
             return;
          }
    },
    /**
    * 获取分类帖子列表
    **/
    getByCategory: function(current){
        var that = this, categoryId = that.data.categoryId;

        if(current==1){
            that.dataList = [];
        }

        app.findByCategory({
           categoryId: categoryId,
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
                          dataList: that.dataList
                      });
                  }else{
                      that.setData({
                          dataList: that.dataList
                      });
                  }
                }
            },
            error: function(res){

            }
        });

        
    }
});
