$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义美化事件过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义查询数据对象q，请求数据的时候，把参数对象提交到服务器
    var q = {
            pagenum: 1, //页码值，默认请求第一页数据
            pagesize: 2, //每页显示几条数据，默认显示2条
            cate_id: '', //文章分类id，默认为空
            state: '' //文章发布状态
        }
        // console.log(q);
    initTable()
    initCate()

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {

                    return layer.msg('获取失败')
                }
                console.log(res);
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    //调用渲染分页方法
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()

            }
        })
    }
    //为筛选表单按钮绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            //为查询参数对象q中对应属性赋值
        q.cate_id = cate_id
        q.state = state
            //根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法

    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到

            limit: q.pagesize, //每页显示
            curr: q.pagenum, //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时，触发jump回调
            jump: function(obj, first) {
                console.log(obj.curr);
                //把最新页码赋值到q
                q.pagenum = obj.curr
                    //把最新条目数，赋值给pagesize
                q.pagesize = obj.limit
                    //根据最新的q获取对应的数据列表，并渲染表格

                if (first) {
                    initTable()
                }
            }
        });
    }
    //通过代理方法，给删除按钮绑定点击事件
    $('tbody').on('click', 'btn-delete', function() {
        var len = $('.btn-delete').lenght
        var id = $(this).attr('date-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})