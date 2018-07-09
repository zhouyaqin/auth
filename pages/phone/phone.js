
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
    onShareAppMessage: function() {
        return {
            title: '同城帮-手机验证',
            path: '/pages/phone/phone'
        }
    },
    /**
     * 页面名称
     */
    name: "phone",
    /**
     * 页面的初始数据
     */

    data: {
        isSubmit: true,
        isDisabled: true,
        flag: 0,
        codeText: '获取验证码',
        idNumber: '',
        telephone: '',
        code: '',  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function onLoad(options) {
        var that = this;

        if(options['flag'] || options['idNumber']){
            var flag = options['flag'] || 0,
                idNumber = options['idNumber'] || '';
            that.setData({
                flag: flag,
                idNumber: idNumber
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
    onShowData: function(){
        var that = this,
            isVeriAuthCode = wx.getStorageSync("isVeriAuthCode") || [],
            telephone = that.data.telephone,
            idNumber = that.data.idNumber,
            code = that.data.code;

         that.veriAuthCode(telephone, code, function(){
            isVeriAuthCode.push(idNumber);
            wx.setStorageSync("isVeriAuthCode", isVeriAuthCode)
            wx.redirectTo({
                url: '../iddetail/iddetail?idNumber=' + idNumber
            });
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
    onSubmitData: function(){
        var that = this, userInfo = wx.getStorageSync('userInfo'),
            data = that.data,
            openId = userInfo.openId || "",
            idNumber = data.idNumber,
            telephone = data.telephone,
            code = data.code;

            if(!app.checkPhone(telephone)){
                return;
            }

            app.submitInfo({
                idNumber: idNumber,
                telephone: telephone,
                code: code,
                openId: openId
            },{
                success: function(res){
                    app.onShowModal({
                        content: res.msg,
                        showCancel: false,
                    }, function(){
                        wx.switchTab({
                           url: '../identity/identity'
                        });
                    });
                },
                error: function(res){
                    app.showFailMsg(res.msg);
                }
            });

    }
});
