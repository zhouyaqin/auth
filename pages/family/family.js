
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
  onShareAppMessage: function () {
    return {
      title: '惠民服务云-家庭成员',
      path: '/pages/family/family'
    }
  },
  /**
   * 页面名称
   */
  name: "family",
  /**
   * 页面的初始数据
   */

  data: {
      idNumber: '',
      status: '',
      imgPath3: '../../static/images/3.png',
      imgPath4: '../../static/images/4.png',
      imgPath9: '../../static/images/9.png',
      imgPath10: '../../static/images/9.png',

      //错误信息弹窗显示
      errorMass3: false,
      errorMass4: false,
      errorMass9: false,
      errorMass10: false,

      //错误信息显示
      errorMassCent3: '',
      errorMassCent4: '',
      errorMassCent9: '',
      errorMassCent10: '',

      //判断 图片是否上传成功
      errorMassimg3: false,
      errorMassimg4: false,
      errorMassimg9: false,
      errorMassimg10: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
      var that = this, idNumber = options['idNumber'], status = options['status'];
      if(idNumber || status){
           that.setData({
               idNumber: options['idNumber'],
               status: options['status']
           });
      }
      if(idNumber !='') {
          wx.setNavigationBarTitle({
              title: '小孩'
          });
          that.getFamilyMasterInfo(idNumber);
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
  /**显示认证人详情 */
  getFamilyMasterInfo: function (idNumber) {
    var that = this;

    app.getFamilyMasterInfo({
       idNumber: idNumber
    }, {
      success: function(res){
          var data = res.data;
          if(data){
            var imgPath3 = data.residenceImage ? "data:image/jpg;base64," + data.residenceImage : '../../static/images/3.png';
            var option = {
                  imgPath3: imgPath3,
                  errorMassimg3: true
                };
                that.setData(option);
          }
      },
      error: function(res){
          app.showFailMsg(res.msg);
      }
    });

  },
  /**上传图片 */  
  uploadImg:function(e) {
      var  that = this,
           idNumber = that.data.idNumber,
           id = e.target.dataset.id;

          if(idNumber == "" || id==3) {
              return;
          }else{
              that.clooseUploadImg(id);
          }
  },
  /**判断传的哪张图片，并添加参数 */
  onParamsImage: function(id, filePaths, callback) {
    var that = this, userInfo = wx.getStorageSync('userInfo'),
        idNumber = that.data.idNumber,
        openId = userInfo.openId || '',
        formData = {};

        switch (id) {
          case '4':
            that.setData({ imgPath4: filePaths });
            formData = { type: 3, side: 2, idNumber: idNumber, openId: openId };
            break;
          case '9':
            that.setData({ imgPath9: filePaths });
            formData = { type: 7, side: 1, openId: openId, idNumber: idNumber };
            break;
          case '10':
            that.setData({ imgPath10: filePaths });
            formData = { type: 7, side: 2, openId: openId, idNumber: idNumber };
            break;
          default:
        }
        callback(formData);
  },
  /**上传认证人图片 */
  onAuthenticator: function (id, file, formData) {
      var that = this;
      console.log(file, formData, 11111111111111);
      app.uploadFile(file, formData, null, {
        success: function(res){
            var data = res.data;
            switch (id) {
              case '4':
                that.setData({
                  errorMass4: false,
                  errorMassimg4: true
                });
                break;
              case '9':
                that.setData({
                  errorMass9: false,
                  errorMassimg9: true
                });
                break;
              case '10':
                that.setData({
                  errorMass10: false,
                  errorMassimg10: true
                });
                break;
              default:
            }
        },
        error: function(res){
            var data = res.data;
            switch (id) {
              case '4':
                that.setData({
                  errorMass4: true,
                  errorMassimg4: false,
                  errorMassCent4: res.msg
                });
                break;
              case '9':
                that.setData({
                  errorMass9: true,
                  errorMassimg9: false,
                  errorMassCent9: res.msg
                });
                break;
              case '10':
                that.setData({
                  errorMass10: true,
                  errorMassimg10: false,
                  errorMassCent10: res.msg
                });
                break;
              default:

            }
        }
      });

  },
  clooseUploadImg:function(id) {
    var that = this;     
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            var filePaths = res.tempFilePaths[0];
            if(filePaths != "") {
              wx.showLoading({ mask:true });
              that.onParamsImage(id, filePaths, function(formData) {
                  that.onAuthenticator(id, filePaths, formData);
              });
            }
          }
        });
  },
  uploadImgAll:function(callback) {
    var that = this, data = that.data, errorMsg = '',
        errorMassimg4 = data.errorMassimg4,
        errorMassimg9 = data.errorMassimg9, errorMassimg10 = data.errorMassimg10;

        if(!errorMassimg4){
            errorMsg =  "请先上传本人页";
        }else if(!errorMassimg9){
            errorMsg =  "头像正面";
        }else if(!errorMassimg10){
            errorMsg =  "头像正面";
        }else{
            errorMsg = '';
        }
        return errorMsg;
  },
  //保存提交
  onSubmitMass:function() {
    var that = this,
        data = that.data,
        idNumber = data.idNumber,
        errorMsg =  that.uploadImgAll();

        if(errorMsg && errorMsg!=""){
            app.showFailMsg(errorMsg);
        }else{
            if(idNumber == "") {
              return;
            }
            wx.navigateTo({
               url: '../phone/phone?flag=0&idNumber=' + idNumber
            });
        }
  }

});