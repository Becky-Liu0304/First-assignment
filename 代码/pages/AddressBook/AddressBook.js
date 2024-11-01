// pages/AddressBook/AddressBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listMain: [],
    newContact:{
      id:'',
      name:'',
      phone:''
    }
  },


  onAddContact: function(e) {
    const { newContact } = this.data;
    const { name, phone } = e.detail.value;
    let method = '';
    console.log(newContact);
    if(newContact != null && newContact.id != ''){
      method = 'update';
    }else{
      method = 'save';
    }

    // 调用后端接口保存数据
    wx.request({
      url: 'http://localhost:9131/contacts/'+method, // 替换为你的接口
      method: 'POST',
      data: {
        id:method == 'save'?null:newContact.id,
        name: name,
        phone: phone
      },
      success: (res) => {
        if (res.data.code == 200) {
          // 假设返回的格式是 { success: true }
          if (res.data.code == 200) {
            // 将数据添加到 dataList
            this.fetchList();
            this.setData({
              newContact:{id:'',name:'',phone:''}
            });
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            });

          } else {
            wx.showToast({
              title: '提交失败',
              icon: 'none'
            });
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchList();
  },

  fetchList(){
    wx.request({
      url: 'http://localhost:9131/contacts/listPage', // 替换为你的接口
      method: 'POST',
      data: {
        pageNum: 1,
        pageSize: 20
      },
      success: (res) => {
        console.log(res.data.data);
        this.setData({
          listMain: res.data.data
        });
      }
      });
  },


  deleteContact: function(event) {
    const id = event.currentTarget.dataset.id;
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除该联系人吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `http://localhost:9131/contacts/del/${id}`, // 替换为删除接口
            method: 'GET',
            success(response) {
              if (response.statusCode === 200) {
                that.setData({
                  listMain: that.data.listMain.filter(item => item.id !== id)
                });
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
              } else {
                console.error('删除失败', response);
              }
            },
            fail(err) {
              console.error('请求错误', err);
            }
          });
        }
      }
    });
  },

  editContact: function(event) {
    const id = event.currentTarget.dataset.id; // 获取整行数据
    wx.request({
      url: `http://localhost:9131/contacts/getById/${id}`,
      method: 'GET',
      success: (response) => { // 使用箭头函数
        console.log(response.data);
        this.setData({
          newContact: response.data.data
        });
      },
      fail: (error) => { // 可选：也可以对失败的情况使用箭头函数
        console.error('请求失败', error);
      }
    });
  
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})