
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '人脸识别',
            path: '/pages/face/face'
        }
    },
    /**
     * 页面名称
     */
    name: "face",
    /**
     * 页面的初始数据
     */

    data: {
        idNumber: "",
        name:'',
        juweihui:'',
        recordList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var that = this;

        if (options['name'] != "" && options['idNumber'] !=""){
            that.setData({
                idNumber: options['idNumber'] || "",
                name: options['name'] || "",
                juweihui: options['juweihui'] || ""
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
       this.getRecogRecords();
    },
    getRecordInfo: function (e) {
      var that = this,
          id = e.currentTarget.id,
          recordList = that.data.recordList,
          name = that.data.name,
          idNumber = that.data.idNumber,
          juweihui = that.data.juweihui;

          for (var i = 0, len = recordList.length; i < len; i++) {
            if (id == recordList[i].id) {
                var item = recordList[i];
                wx.navigateTo({
                    url: '../authInfo/authInfo?name=' + name + '&id=' + id + '&juweihui=' + juweihui
                });
            }
          }
    },
    getRecogRecords: function () {
      var that = this,
          idNumber = that.data.idNumber;

        app.getRecogRecords({
            idNumber: idNumber
        },{
          success: function(res){
              var data = res.data, recordList = [];
              if(data){
                 var list = res.data;
                     if (list && list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            var item = list[i];
                            item.registerTime = app.getFormatTime(new Date(item.registerTime).getTime(), 'yyyy-MM-dd hh:mm:ss');
                            recordList.push(item);
                        }
                        that.setData({
                          recordList: recordList
                        })
                      }
              }
          },
          error: function(res){

          }
        });

    },

    //onLogout: app.isLogout,
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


    
    
    
   
});
