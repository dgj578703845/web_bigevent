$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                title: '添加文章分类',
                content: $('#dialog-add').html(),
                area: ['500px', '250px']
            });

        })
        //通过代理形式，给表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            console.log('ok');
            $.ajax({
                method: "post",
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败')
                    }
                    initArtCateList()
                    layer.msg('新增成功')
                    layer.close(indexAdd)
                }
            })
        })
        //代理形式，为btn-edit按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        })

        var id = $(this).attr('data-id').split("-").join("")
            // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function() {
        // console.log('ok');
        var id = $(this).attr('data-id').split("-").join("")
        layer.confirm('确认删除么？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})