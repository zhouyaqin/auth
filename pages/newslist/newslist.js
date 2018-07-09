
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-消息列表',
            path: '/pages/newslist/newslist'
        }
    },
    /**
     * 页面名称
     */
    name: "newslist",
    /**
     * 页面的初始数据
     */
    data: {
        windowWidth: 0,
        windowHeight: 0,
        type: 1,
        isUseTemp: false,
        messageList: [],
        noticeDetail: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var that = this, type = options['type'] || 1, title = type==1?'意见反馈':'系统消息';
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });
        if(type && type!=''){
            that.setData({
                type: type
            });
            wx.setNavigationBarTitle({
              title: title
            });
            that.getMessageByType(type);
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
    getMessageByType: function(){
        var that = this,
            userInfo = wx.getStorageSync("userInfo"),
            openId = userInfo.openId || "",
            type = that.data.type,
            messageList = [];

        app.getMessageByType({
            type: type,
            openId: openId
        },{
            success: function(res){
                var data = res.data;
                    if(data && data.length){
                        for(var i = 0, len = data.length; i < len; i++){
                            var item = data[i];
                            item.icon = item.type==1?'/static/images/icon/14.png':'/static/images/icon/13.png';
                            item.content = app.splitContent(item.content, 30);
                            item.createTime = app.getFormatTime(new Date(item.createTime).getTime(), 'yyyy-MM-dd hh:mm:ss');
                            messageList.push(item);
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
    onMassgeDetail: function(e){
        var that = this,
            type = that.data.type,
            title = type==1?'意见反馈':'系统消息',
            value = e.currentTarget.id;
            if(value!=""){
                var data = value.split(","),
                    noticeDetail = {  
                        title: title,
                        content: data[0],
                        createTime: data[1]
                    }
                    that.setData({
                        isUseTemp: true,
                        noticeDetail: noticeDetail
                    });
            }
    },
    closeNoticeTemp: function(){
        this.setData({
            isUseTemp: false
        });
    }
});
