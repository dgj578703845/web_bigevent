$(function() {
    //
    //点击注册账号的链接
    $('#link-reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        //点击登录账号的链接
    $('#link-login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            //先拿到确认密码输入内容
            var pwd = $('.reg-box [name=password]').val()
                //拿到密码框中内容
                //进行等于判断
            if (pwd !== value) {
                return '两次密码不一致'
            }
            //如果失败，return一个提示消息 

        }
    })

    //监听注册表的提交事件
    $('#form-reg').on('submit', function(e) {
            e.preventDefault()
            var data = {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            }
            $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    // return console.log();
                    return layer.msg(res.message)
                }
                // console.log('注册成功');
                layer.msg('注册成功')
                $('#link-login').click()
            })
        })
        //监听登录表单的提交事件
    $('#form-login').submit(function(e) {
        e.preventDefault()
        $.ajax({
                url: '/api/login',
                method: 'post',
                //快速获取表单数据
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('登录成功');
                    // console.log(res.token);
                    //将成功登录得到的token字符串，保存到localstorage
                    localStorage.setItem('token', res.token)
                    location.href = '/index.html'
                }
            }

        )
    })
})