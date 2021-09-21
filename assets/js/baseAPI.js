$.ajaxPrefilter(function(options) {

    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);
    //统一为有权限的请求头设置headers

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token
            localStorage.removeItem('token')
                //跳转回登录界面
            location.href = '/login.html'
        }
    }
})