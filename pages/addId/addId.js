
// 获取全局应用程序实例对象
var app = getApp();


// 创建页面实例对象
Page({
  onShareAppMessage: function () {
    return {
      title: '惠民服务云-添加申请人',
      path: '/pages/addId/addId'
    }
  },
  /**
   * 页面名称
   */
  name: "addId",
  /**
   * 页面的初始数据
   */

  data: {
      idNumber: '',
      status: '',
      isEdit: 0,
      imgPath1:'../../static/images/1.png',
      imgPath2: '../../static/images/2.png',
      imgPath3: '../../static/images/3.png',
      imgPath4: '../../static/images/4.png',
      imgPath5: '../../static/images/5.png',
      imgPath6: '../../static/images/6.png',
      imgPath9: '../../static/images/9.png',
      imgPath10: '../../static/images/9.png',
      imgPath11: '../../static/images/11.png',

      //错误信息弹窗显示
      errorMass1:false, 
      errorMass2: false,
      errorMass3: false,
      errorMass4: false,
      errorMass5: false,
      errorMass6: false,
      errorMass9: false,
      errorMass10: false,
      errorMass11: false,

      //错误信息显示
      errorMassCent1: '',
      errorMassCent2: '',
      errorMassCent3: '',
      errorMassCent4: '',
      errorMassCent5: '',
      errorMassCent6: '',
      errorMassCent9: '',
      errorMassCent10: '',
      errorMassCent11: '',

      //判断 图片是否上传成功
      errorMassimg1: false,
      errorMassimg2: false,
      errorMassimg3: false,
      errorMassimg4: false,
      errorMassimg5: false,
      errorMassimg6: false,
      errorMassimg9: false,
      errorMassimg10: false,
      errorMassimg11: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
      var that = this;
      if(options['idNumber'] || options['status'] || options['isEdit']){
           that.setData({
               idNumber: options['idNumber'],
               status: options['status'],
               isEdit: options['isEdit'] || 0
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
     var that = this, idNumber = that.data.idNumber, isEdit = that.data.isEdit;

     if(isEdit!=0 && idNumber !='') {
          wx.setNavigationBarTitle({
              title: '修改申请人'
          });
          that.showUserMassge(idNumber);
      }
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
  showUserMassge: function (idNumber) {
    var that = this;


    app.getUserInfo({
       idNumber: idNumber
    }, {
      success: function(res){
          var data = res.data;
          if(data){
            var imgPath1 = that.getImageUrl(data.idImageFront, that.data.imgPath1),
                imgPath2 = that.getImageUrl(data.idImageBack, that.data.imgPath2),
                imgPath3 = that.getImageUrl(data.residenceFront, that.data.imgPath3),
                imgPath4 = that.getImageUrl(data.residenceBack, that.data.imgPath4),
                imgPath5 = that.getImageUrl(data.bankCardFront, that.data.imgPath5),
                imgPath6 = that.getImageUrl(data.bankCardBack, that.data.imgPath6),
                imgPath9 = that.getImageUrl(data.faceImage1, that.data.imgPath9),
                imgPath10 = that.getImageUrl(data.faceImage2, that.data.imgPath9),
                imgPath11 = that.getImageUrl(data.landImage, that.data.imgPath11),
                idNumber = data.idNumber;

                that.setData({imgPath1: imgPath1, errorMassimg1: true});
                that.setData({imgPath2: imgPath2, errorMassimg2: true});
                that.setData({imgPath3: imgPath3, errorMassimg3: true});
                that.setData({imgPath4: imgPath4, errorMassimg4: true});
                that.setData({imgPath5: imgPath5, errorMassimg5: true});
                that.setData({imgPath6: imgPath6, errorMassimg6: true});
                that.setData({imgPath9: imgPath9, errorMassimg9: true});
                that.setData({imgPath10: imgPath10, errorMassimg10: true});
                that.setData({imgPath11: imgPath11, errorMassimg11: true});
                that.setData({idNumber: idNumber});
          }
      },
      error: function(res){
          app.showFailMsg(res.msg);
      }
    });

  },
  getImageUrl: function(path, path1){
      return path ? "data:image/jpg;base64,"+ path : path1;
  },
  /**上传图片 */  
  uploadImg:function(e) {
      var  that = this,
           idNumber = that.data.idNumber,
           status = that.data.status,
           id = e.target.dataset.id;

          if(status!="" && status == 1) {
            if (id == 1) {
              app.showFailMsg("该信息禁止修改，请联系工作人员");
              return;
            }

          } else if (status!="" &&  status == 2) {
            if (id == 1) {
              app.showFailMsg("该信息禁止修改，请联系工作人员");
              return;
            }


          } else if (status!="" &&  status == 3) {
            if (id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6  || id == 11) {
              app.showFailMsg("该信息禁止修改，请联系工作人员");
              return;
            }
          }

          if(id != 1 && idNumber == "") {
              app.showFailMsg("请先扫描认证人的身份证正面");
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
          case '1':
            that.setData({ imgPath1: filePaths });
            formData = { type: 1, side: 1, openId: openId };
            break;
          case '2':
            that.setData({ imgPath2:  filePaths });
            formData = { type: 1, side: 2, idNumber: idNumber, openId: openId };
            break;
          case '3':
            that.setData({ imgPath3: filePaths });
            formData = { type: 3, side: 1, idNumber: idNumber, openId: openId };
            break;
          case '4':
            that.setData({ imgPath4: filePaths });
            formData = { type: 3, side: 2, idNumber: idNumber, openId: openId };
            break;
          case '5':
            that.setData({ imgPath5: filePaths });
            formData = { type: 2, side: 1, idNumber: idNumber, openId: openId };
            break;
          case '6':
            that.setData({ imgPath6: filePaths });
            formData = { type: 2, side: 2, idNumber: idNumber, openId: openId };
            break;
          case '9':
            that.setData({ imgPath9: filePaths });
            formData = { type: 4, side: 1, openId: openId, idNumber: idNumber };
            break;
          case '10':
            that.setData({ imgPath10: filePaths });
            formData = { type: 4, side: 2, openId: openId, idNumber: idNumber };
            break;
          case '11':
            that.setData({ imgPath11: filePaths });
            formData = { type: 6, side: 1, openId: openId, idNumber: idNumber };
            break;
          default:
        }
        callback(formData);
  },
  /**上传认证人图片 */
  onAuthenticator: function (id, file, formData) {
      var that = this;
      app.uploadFile(file, formData, null, {
        success: function(res){
            var data = res.data;
            switch (id) {
              case '1':
                that.setData({
                  idNumber: data.idNum,
                  errorMass1: false,
                  errorMassimg1: true,
                  imgPath2: '../../static/images/2.png',
                  imgPath3: '../../static/images/3.png',
                  imgPath4: '../../static/images/4.png',
                  imgPath5: '../../static/images/5.png',
                  imgPath6: '../../static/images/6.png',
                  imgPath9: '../../static/images/9.png',
                  imgPath10: '../../static/images/9.png',
                  imgPath11: '../../static/images/11.png',

                  errorMassimg2: false,
                  errorMassimg3: false,
                  errorMassimg4: false,
                  errorMassimg5: false,
                  errorMassimg6: false,
                  errorMassimg9: false,
                  errorMassimg10: false,
                  errorMassimg11: false,

                  errorMass2: false,
                  errorMass3: false,
                  errorMass4: false,
                  errorMass5: false,
                  errorMass6: false,
                  errorMass9: false,
                  errorMass10: false,
                  errorMass11: false

                });


                break;
              case '2':
                that.setData({
                  errorMass2: false,
                  errorMassimg2: true
                });
                break;
              case '3':
                that.setData({
                  errorMass3: false,
                  errorMassimg3: true
                });
                break;
              case '4':
                that.setData({
                  errorMass4: false,
                  errorMassimg4: true
                });
                break;
              case '5':
                that.setData({
                  errorMass5: false,
                  errorMassimg5: true
                });
                break;
              case '6':
                that.setData({
                  errorMass6: false,
                  errorMassimg6: true
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
              case '11':
                that.setData({
                  errorMass11: false,
                  errorMassimg11: true
                });
                break;
              default:
            }
        },
        error: function(res){
            var data = res.data;
            switch (id) {
              case '1':
                that.setData({
                  idNumber: '',
                  errorMass1: true,
                  errorMassimg1: false,
                  errorMassCent1: res.msg,
                  imgPath2: '../../static/images/2.png',
                  imgPath3: '../../static/images/3.png',
                  imgPath4: '../../static/images/4.png',
                  imgPath5: '../../static/images/5.png',
                  imgPath6: '../../static/images/6.png',

                  imgPath9: '../../static/images/9.png',
                  imgPath10: '../../static/images/9.png',
                  imgPath11: '../../static/images/11.png',

                  errorMassimg2: false,
                  errorMassimg3: false,
                  errorMassimg4: false,
                  errorMassimg5: false,
                  errorMassimg6: false,
                  errorMassimg9: false,
                  errorMassimg10: false,
                  errorMassimg11: false,

                  errorMass2: false,
                  errorMass3: false,
                  errorMass4: false,
                  errorMass5: false,
                  errorMass6: false,
                  errorMass9: false,
                  errorMass10: false,
                  errorMass11: false
                });
                break;
              case '2':
                that.setData({
                  errorMass2: true,
                  errorMassimg2: false,
                  errorMassCent2: res.msg
                });
                break;
              case '3':
                that.setData({
                  errorMass3: true,
                  errorMassimg3: false,
                  errorMassCent3: res.msg
                });
                break;
              case '4':
                that.setData({
                  errorMass4: true,
                  errorMassimg4: false,
                  errorMassCent4: res.msg
                });
                break;
              case '5':

                that.setData({
                  errorMass5: true,
                  errorMassCent5: res.msg,
                  errorMassimg5: false,
                });

                break;
              case '6':
                that.setData({
                  errorMass6: true,
                  errorMassimg6: false,
                  errorMassCent6: res.msg
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
              case '11':
                that.setData({
                  errorMass11: true,
                  errorMassimg11: false,
                  errorMassCent11: res.msg
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
        errorMassimg1 = data.errorMassimg1, errorMassimg2 = data.errorMassimg2,
        errorMassimg9 = data.errorMassimg9, errorMassimg10 = data.errorMassimg10;

        if(!errorMassimg1){
            errorMsg =  "请先上传认证人身份证正面";
        }else if(!errorMassimg2){
            errorMsg =  "请先上传身份证反面";
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
          app.showFailMsg("请先上传认证人正面");
          return;
        }
        wx.navigateTo({
           url: '../phone/phone?flag=0&idNumber=' + idNumber
        });
    }
  }
});