
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '惠民服务云-更换手机号',
            path: '/pages/uphone/uphone'
        }
    },
    /**
     * 页面名称
     */
    name: "uphone",
    /**
     * 页面的初始数据
     */

    data: {
        isSubmit: true,
        isDisabled: true,
        idNumber: '',
        flag: 0,
        imgPath: '/static/images/dist_02.png',
        codeText: '获取验证码',
        telephone: '',
        code: '',  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
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
    uploadImg: function() {
      var that = this;

        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            var filePath = res.tempFilePaths[0];

            if (filePath != "") {
                that.setData({
                  imgPath: filePath
                });
                that.getUserInfoByFace(filePath);
            }
          }
        });
    },
    // 获取手机号
    getInputPhone: function(e){
        var that = this,
            telephone = e.detail.value;
            if(telephone!="" && telephone.length>=11){
                that.setData({
                    telephone: telephone,
                    isDisabled: false
                });
            }
    },
    // 获取code
    getInputCode: function(e){
        var that = this,
            code = e.detail.value;
            if(code!=""){
                that.setData({
                    code: code,
                    isSubmit: false
                });
            }
    },
    getUserInfoByFace: function(file){
        var that = this;
        app.getUserInfoByFace(file, null, null, {
            success: function(res){
                var data = res.data;
                that.setData({
                    idNumber: data
                });
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        })
    },
    // 获取验证码
    getAuthCode: function(){
        var that = this,
            time = 60,
            telephone = that.data.telephone;

        if(!app.checkPhone(telephone)){
            return;
        }

        setTime();
        function setTime(){
            if(time == 0){
                that.setData({
                    codeText: "获取验证码",
                    isDisabled: false
                });
                time = 60;
                return;
            }else{
                that.setData({
                    codeText: time + "s后重新获取",
                    isDisabled: true
                });
                time--;
            }
            setTimeout(function(){
                setTime();
            }, 1000);
        }

        app.getAuthCode({
            telephone: telephone
        },{
            success: function(res){
                var data = res.data;
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });

    },
    veriAuthCode: function(telephone, code, callback){
        var that = this;
        app.veriAuthCode({
            telephone: telephone,
            code: code
        },{
            success: function(res){
                var data = res.data;
                if(data == 1 || data=='1'){
                    callback && callback();
                }else if(data == 2 || data=='2'){
                     app.showFailMsg("表示验证失败");
                }else if(data == 3 || data=='3'){
                    app.showFailMsg("表示验证码过期");
                }
            },
            error: function(res){
                app.showFailMsg(res.msg);
            }
        });
    },
    // 修改手机号码
    onUpdatePhone: function(){
        var that = this,
            data = that.data,
            telephone = data.telephone,
            idNumber = data.idNumber,
            code = data.code;

            if(!idNumber || idNumber==""){
                app.showFailMsg("请上传验证人照片");
                return;
            }

            if(!app.checkPhone(telephone)){
                return;
            }

            app.changeTelephone({
                telephone: telephone,
                idNumber: idNumber
            },{
                success: function(res){
                    app.onShowModal({
                        content: res.msg,
                        showCancel: false,
                    }, function(){
                        wx.redirectTo({
                            url: '../iddetail/iddetail?idNumber=' + idNumber
                        });
                    });
                },
                error: function(res){
                    app.showFailMsg(res.msg);
                }
            });    
    }
});
