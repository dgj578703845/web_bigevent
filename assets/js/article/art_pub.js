$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()
        //定义文章加载分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                console.log(res.data);
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //定义文章发布状态
    var art_state = '已发布'

    //为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //为表单绑定submit提交时间
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            //基于form表单快速创建formdata对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })


    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            conentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }

})