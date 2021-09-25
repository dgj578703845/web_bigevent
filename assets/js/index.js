$(function() {
        getUserInfo()
            //退出操作
        var layer = layui.layer
        $('#btn-logout').on('click', function() {
            // console.log('ok ');
            //提示用户是否确认退出
            layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function(index) {
                //do something
                //清空本地存储的token
                localStorage.removeItem('token')
                    //跳转回登录页面
                location.href = '/login.html'
                layer.close(index);
            })
        })
    })
    //获取用户信息
function getUserInfo() {
    $.ajax({
            method: 'get',
            url: '/my/userinfo',
            // headers: { Authorization: localStorage.getItem('token') || '' },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('失败了');
                    // layui.layer.msg('获取失败'),
                }
                // layui.layer.msg('获取成功')
                // console.log(res);
                //调用renderAvatar渲染用户头像
                renderAvatar(res.data)
                    //不论成功还是失败，都调用complete函数

            },
            // complete: function(res) {
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份验证失败！') {
            //         //强制清空token
            //         localStorage.removeItem('token')
            //             //跳转回登录界面
            //         location.href = '/login.html'
            //     }
            // }
        }


    )
}
//渲染头像
function renderAvatar(user) {
    //获取名称
    var name = user.nickname || user.username
        //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //渲染用户头像
        //如果user_pic有值
    if (user.user_pic !== null) {
        //渲染文件图像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文字头像
        $('.layui-nav-img').hide()

        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}