
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-消息',
            path: '/pages/system/system'
        }
    },
    /**
     * 页面名称
     */
    name: "news",
    /**
     * 页面的初始数据
     */
    data: {
        messageList: [{
            icon: '/static/images/icon/14.png',
            title: '意见反馈'
        },{
            icon: '/static/images/icon/13.png',
            title: '系统消息'
        }]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad() {
        var that = this;
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
        this.getMessage();
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
    },
    // 获取信息
    getMessage: function(){
        var that = this,
            userInfo = wx.getStorageSync("userInfo"),
            openId = userInfo.openId || "",
            messageList = [{
                icon: '/static/images/icon/14.png',
                title: '意见反馈'
            },{
                icon: '/static/images/icon/13.png',
                title: '系统消息'
            }];

        app.getMessage({
            openId: openId
        },{
            success: function(res){
                var data = res.data;
                    if(data && data.length){
                        for(var i = 0, len = data.length; i < len; i++){
                            var item = data[i];
                            item.content = app.splitContent(item.content, 30);
                            item.createTime = app.getFormatTime(new Date(item.createTime).getTime(), 'hh:mm');
                            messageList[i].content = item.content;
                            messageList[i].createTime = item.createTime;
                        }
                         that.setData({
                            messageList: messageList
                        });
                    }   
            },
            error: function(res){

            }
        });

        
    },
});
