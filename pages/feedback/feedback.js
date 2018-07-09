const uploadImage = require('../../libs/oss/uploadAliyun.js');

// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-建议反馈',
            path: '/pages/feedback/feedback'
        }
    },
    /**
     * 页面名称
     */
    name: "feedback",
    /**
     * 页面的初始数据
     */
    fileId: [],
    data: {
        id: 0,
        content: '',
        type: 1,
        newsId: 0,
        userId: 0,
        isSubmit: true,
        isChoose: true,
        placeholderText: '请填写建议反馈内容',
        files: []   
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(option) {
        
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
    // 获取建议或举报
    getInputContent: function(e){
        var that = this,
            content = e.detail.value;
            if(content!=""){
                that.setData({
                    content: content,
                    isSubmit: false
                });
            }else{
                that.setData({
                    isSubmit: true
                });
            }
    },
    onFormSubmit: function(){
        var that = this;
        that.submitFeedback();
    },
    /**
     * 举报
     */
    submitFeedback: function(){
        var that = this, userInfo = wx.getStorageSync('userInfo'),
            data = that.data,
            openId = userInfo.openId || "",
            content = data.content,
            image = that.fileId.join(",");

        if(!image || image==""){
            app.showFailMsg("请上传图片");
            return;
        }
        app.submitFeedback({
            openId: openId,
            content: content,
            image: image
        },
        {
            success: function(res){
                app.onShowModal({
                    showCancel: false,
                    content: res.msg
                }, function(){
                    wx.navigateBack({
                      delta: -1
                    })
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    // 提交建议
    addFeedback: function(){
        var that = this,
            data = that.data,
            content = data.content,
            image = that.fileId.join(",");

        if(!image || image==""){
            app.showFailMsg("请上传图片");
            return;
        }
        app.addFeedback({
            content: content,
            image: image
        },{
            success: function(res){
                app.onShowModal({
                    showCancel: false,
                    content: res.msg
                }, function(){
                    wx.navigateBack({
                      delta: -1
                    })
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    /**
     * 查看图片
     */
    imageHandler: function(e) {
        var that = this,
            url = e.currentTarget.id;
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: that.data.files // 需要预览的图片http链接列表
            });
    },
    /*
     * 选择图片
    */
    chooseImage: function (e) {
        var that = this,
            filesArr = that.data.files;

            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    var tempFilePaths = res.tempFilePaths;
                        filesArr = filesArr.concat(tempFilePaths);
                    that.uploadFile({path: filesArr});
                }
            });
    },
    /*
     * 上传文件
     */
    uploadFile: function(data){
        var that = this;

            wx.showLoading();
            uploadImage({
                filePath: data.path[0]
            },
            {
                success: function(res){
                    var paths = 'https://tcboss.zetiantech.com/';
                    wx.hideLoading();

                    paths+= res.fileId + '.jpg';
                    that.fileId.push(paths);
                    that.setData({
                        files: data.path,
                        isChoose: false
                    });
                },
                error: function(res){
                    wx.hideLoading();
                    that.setData({
                        isChoose: true
                    });
                },
                complete: function(res){

                }
            });
    }
});
