$(document).ready(function() {
    /*
#########################################################################
# File Name: ireport.js
# Author: DRUNK
# mail: zhangshuangfu@ccssoft.com.cn
# Created Time: Fri 08 May 2015 07:31:18 PM PDT
#########################################################################
*/
    //初始化一级菜单的报表分类
    function load_classify(flag) {

        //一级分类的所有项
        var url = "/query?sql=select id as ID,name as NAME,info as INFO from classify";
        var opts_list = ajaxRequest(url);
        //alert(opts_list);
        //遍历opts_list，获取所有的一级菜单对象
        var opts_json = eval(opts_list);
        var opts_data = []; //存储data,用于存放下拉列表中，格式：var data = [{ id: 0, text: 'enhancement' }]
        for (var i = 0; i < opts_json.length; i++) {
            var ar = {};
            ar['id'] = opts_json[i].ID;
            ar['text'] = opts_json[i].NAME;
            opts_data.push(ar);
        }

        if (flag == "nav") {
            //渲染一级分类的列表
            $("#classify_filter").empty();
            $("#classify_filter").select2({
                placeholder: "请选择分类",
                data: opts_data,
                allowClear: true
            });
        } else if (flag == "del") {
            $("#delete_classify_filter").empty();
            $("#delete_classify_filter").select2({
                placeholder: "请选择分类",
                data: opts_data,
                allowClear: true
            });
        } else if (flag == "modify") {
            $("#modify_classify_filter").empty();
            $("#modify_classify_filter").select2({
                placeholder: "请选择分类",
                data: opts_data,
                allowClear: true
            });
        } else if (flag == "report_type") {
            $("#report_type").empty();
            $("#report_type").select2({
                placeholder: "请选择分类",
                data: opts_data,
                allowClear: true
            });

        }
        // $('.selectpicker').selectpicker('refresh');
    }
    // 开始load一级菜单
    load_classify("nav");
    //load_classify("del");
    //
    
    //获取报表列表
    $('#classify_filter').on("change click",
    function() {
        var select_value = $(this).val();
        $(".classify_msg").html(""); //提示栏信息清空
        console.log(select_value);
        var url = "/query?sql=select id AS ID,name AS NAME from report where class_id =" + select_value +" ORDER BY NAME";
        var report_list = ajaxRequest(url);
        report_list = eval(report_list);
         $("#report_list").html("");
        //var report_data = []; //存储data,用于存放下拉列表中，格式：var data = [{ id: 0, text: 'enhancement' }]
        //<h4><a href='javascript:void(0)'><i class='glyphicon glyphicon-user'></i>&nbsp;划小单元</a></h4>
        for (var i = 0; i < report_list.length; i++) {
            //var ar = {};
            //ar['id'] = report_list[i].ID;
            //ar['text'] = report_list[i].NAME;
            $("#report_list").append("<h4><a id='"+report_list[i].ID+"' class='report_link' href='#'><i class='glyphicon glyphicon-user'></i>&nbsp;"+report_list[i].NAME+"</a></h4>");
            //opts_data.push(ar);
        }
    });

    //获取报表详情
    $(document).on("change click", ".report_link",
    function() {
      var id = $(this).attr("id");
      var url = "/query?sql=select isql as sql from report where id =" + id;
      var sql = ajaxRequest(url)[0].SQL;
      console.log(sql);
      var columns = get_columns(sql);
      //向后台请求数据
      console.log(columns);
      load_data("/query?sql=" + sql, columns);
    });
    //清空信息栏
    $(".ireport_msg").bind("click",
    function() {
        $(".classify_msg").html(""); //提示栏信息清空
    });

    //////////////////////////////一级菜单的增删改查
    //触发添加一级菜单按钮
    $("#link_add_classify").bind("click",
    function() {
        $('#modal_add_classify').modal('toggle');
    });
    //触发删除一级菜单按钮
    $("#link_delete_classify").bind("click",
    function() {
        load_classify("del");
        load_classify("nav");
        $('#modal_delete_classify').modal('toggle');
    });
    //触发修改一级菜单按钮
    $("#link_modify_classify").bind("click",
    function() {
        load_classify("modify");
        modify_classify_filter_change();
        $('#modal_modify_classify').modal('toggle');
    });
    //添加一级菜单(提交)
    $("#btn_add_classify").bind("click",
    function() {
        var add_classify_name = $("#add_classify_name").val();
        var add_classify_info = $("#add_classify_info").val();
        var url = "/addMainClassify?name=" + add_classify_name + "&info=" + add_classify_info;
        var ret = ajaxRequest(url);
        if (ret == -1) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>添加失败，此条数据已存在！</div>");
        } else if (ret == -2) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>删除失败，请联系管理员！</div>");
        } else {
            $(".classify_msg").html("<div class='alert alert-success' role='alert'>添加成功！</div>");
            $("#add_classify_name").val("");
            $("#add_classify_info").val("");
            load_classify("nav");
        }
    });

    //删除一级菜单
    $("#btn_delete_classify").bind("click",
    function() {
        var select_value = $("#delete_classify_filter").val();
        var url = "/deleteMainClassify?id=" + select_value;
        var ret = ajaxRequest(url);
        //alert(ret);
        if (ret == -1) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>删除失败，请稍后再试！</div>");
        } else if (ret == -2) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>删除失败，请联系管理员！</div>");
        } else {
            $(".classify_msg").html("<div class='alert alert-success' role='alert'>删除成功！</div>");
            load_classify("del");
        }
    });

    //修改一级菜单
    $('#modify_classify_filter').on("change",
    function() {
        modify_classify_filter_change();
    });
    //单独封装一个动态变化的函数，因为打开对话框，需要初始化这个函数
    function modify_classify_filter_change() {
        var select_value = $("#modify_classify_filter").val();
        //select name,info from classify where id = 
        var url = "/query?sql=select name,info from classify where id = " + select_value;
        var opts = ajaxRequest(url);

        //遍历opts_list，获取所有的一级菜单对象
        var opts_json = eval(opts);
        if (opts_json.length > 0) {
            $("#modify_classify_name").val(opts_json[0].NAME);
            $("#modify_classify_info").val(opts_json[0].INFO);
        }
        //alert(opts_json[0].NAME+opts_json[0].INFO);
    }

    //确定修改一级菜单
    $("#btn_modify_classify").bind("click",
    function() {
        var id = $("#modify_classify_filter").val();
        var name = $("#modify_classify_name").val();
        var info = $("#modify_classify_info").val();
        var url = "/modifyMainClassify?name=" + name + "&info=" + info + "&id=" + id;
        //alert(url);
        ////console.log(url);
        var ret = ajaxRequest(url);
        //alert(ret);
        if (ret == -1) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>修改失败，请稍后再试！</div>");
        } else if (ret == -2) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>删除失败，请联系管理员！</div>");
        } else {
            $(".classify_msg").html("<div class='alert alert-success' role='alert'>修改成功！</div>");
        }
    });

    //向后台请求get类型的request，需要自己拼装URL,返回json data数据
    function ajaxRequest(url) {
        var ret;
        $.ajax({
            url: url,
            cache: false,
            dataType: 'json',
            async: false,
            //默认为true，改为false  则为同步请求
            success: function(data) { //成功返回数据
                ret = data;
            },
            error: function() {
                ret = -2;
                //alert("服务器出现异常！");
            }
        });
        return ret;
    }

    //////////////////////////二级菜单的增删改查
    //触发添加报表菜单按钮
    $("#link_add_classify_children").bind("click",
    function() {
        $("#table_count").select2();
        init_table();
        init_select_orderby_groppby();
        load_classify("report_type");
        $('#modal_add_classify_children').modal('toggle');
    });
    //定义全局计数器
    //定义一个计数器
    $("#table_count").bind("click change",
    function() {
        init_table();
    });
    //清空选择、排序、分组内的数据
    function init_select_orderby_groppby() {
        $("#selected_columns_div").html("");
        $("orderby_columns_div").html("");
    }
    function init_table() {
        //清空表数据
        init_select_orderby_groppby();
        $("#table_list").html("");
        //定义一个表
        var counter = $("#table_count").val();
        var html = "";
        /*
    if(counter == 1){
      //一个表
      html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='select_column_class tmp_class' style='width: 30%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_1' style='width: 40%;'></select></h4>";
    }else if(counter == 2){
      html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='select_column_class tmp_class' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_1' style='width: 30%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_1' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 25%;'></select></h4>";
      html += "<h4 id=h_2'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_2' class='select_column_class tmp_class' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_2' style='width: 30%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_2' class='tmp_left_join_class tmp_jion_class   tmp_class' style='width: 25%;'></select></h4>";
    }else{ //大于三个表，只要前一个表加上右练级字段即可
    //判断需要是否需要添加 左 或 右 连接的字段 ，暂时不做这块了，我将要离职，希望你能完成
    //逻辑对，也添加成功，但是添加后，select2不可用
      //var table_html=$("#table_list").html();
      ////console.log(table_html);
      //var table_html2= table_html.substring(0,table_html.length-5);
      ////console.log("=================");
      ////console.log(table_html2);
      //$("#table_list").apend(table_html2+"右连接字段：<select id = 'column_lright_" + counter + "' class='tmp_class' style='width: 30%;'></select></h4>");
      html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='tmp_class select_column_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_1' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_1' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4>";
      html += "<h4 id=h_2'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_2' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_2' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_2' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_2' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4></h4>";
      for(var i=3;i<counter;i++){
        html += "<h4 id=h_"+i+"'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_"+i+"' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_"+i+"' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_"+i+"' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_"+i+"' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4></h4>";
      }
      html += "<h4 id=h_"+counter+"'>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_"+counter+"' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_"+counter+"' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_" + counter + "' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4>";
    }
    */
        if (counter == 1) {
            //一个表
            html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-info'>表名:</span><select class='tmp_table' id = 'table_1' style='width: 40%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='select_column_class tmp_class' style='width: 30%;'></select>&nbsp;&nbsp;</h4>";
        } else if (counter == 2) {
            html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-info'>表1:</span><select class='tmp_table' id = 'table_1' style='width: 30%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='select_column_class tmp_class' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_1' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 25%;'></select></h4>";
            html += "<h4 id=h_2'>&nbsp;&nbsp;<span class='label label-info'>表2:</span><select class='tmp_table' id = 'table_2' style='width: 30%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_2' class='select_column_class tmp_class' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_2' class='tmp_left_join_class tmp_jion_class   tmp_class' style='width: 25%;'></select></h4>";
        } else { //大于三个表，只要前一个表加上右练级字段即可
            //判断需要是否需要添加 左 或 右 连接的字段 ，暂时不做这块了，我将要离职，希望你能完成
            //逻辑对，也添加成功，但是添加后，select2不可用
            //var table_html=$("#table_list").html();
            ////console.log(table_html);
            //var table_html2= table_html.substring(0,table_html.length-5);
            ////console.log("=================");
            ////console.log(table_html2);
            //$("#table_list").apend(table_html2+"右连接字段：<select id = 'column_lright_" + counter + "' class='tmp_class' style='width: 30%;'></select></h4>");
            html += "<h4 id=h_1'>&nbsp;&nbsp;<span class='label label-info'>表1:</span><select class='tmp_table' id = 'table_1' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_1' class='tmp_class select_column_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_1' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4>";
            html += "<h4 id=h_2'>&nbsp;&nbsp;<span class='label label-info'>表2:</span><select class='tmp_table' id = 'table_2' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_2' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_2' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_2' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4></h4>";
            for (var i = 3; i < counter; i++) {
                html += "<h4 id=h_" + i + "'>&nbsp;&nbsp;<span class='label label-info'>表" + i + ":</span><select class='tmp_table' id = 'table_" + i + "' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_" + i + "' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_" + i + "' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>右连接字段:</span><select id = 'column_right_" + i + "' class='tmp_right_jion_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4></h4>";
            }
            html += "<h4 id=h_" + counter + "'>&nbsp;&nbsp;<span class='label label-info'>表" + counter + ":</span><select class='tmp_table' id = 'table_" + counter + "' style='width: 25%;'></select>&nbsp;&nbsp;<span class='label label-success lable_select'>选择字段:</span><select id = 'column_select_" + counter + "' class='select_column_class tmp_class' style='width: 16%;'></select>&nbsp;&nbsp;<span class='label label-info'>左连接字段:</span><select id = 'column_left_" + counter + "' class='tmp_left_join_class tmp_jion_class  tmp_class' style='width: 16%;'></select></h4>";
        }

        $("#table_list").html(html);
        //获取所有表
        var url = "/query?sql=select table_name from user_tables order by table_name";
        var table_list = ajaxRequest(url);
        //将table_list转换为 table_json对象
        var table_json = eval(table_list);
        var table_data = []; //存储data,用于存放下拉列表中，格式：var data = [{ id: 0, text: 'enhancement' }]
        for (var i = 0; i < table_json.length; i++) {
            var ar = {};
            ar['id'] = table_json[i].TABLE_NAME;
            ar['text'] = table_json[i].TABLE_NAME;
            table_data.push(ar);
        }
        for (var i = 1; i <= counter; i++) {
            var id = '#table_' + i;
            //console.log(id); 
            $(id).select2({
                placeholder: "请选择表",
                data: table_data,
                allowClear: true
            });
        }

        $(".tmp_class").select2({});
    }

    //表选择事件
    $(document).on("change click", ".tmp_table",
    function() {
        //清空选择、排序、分组内的数据
        init_select_orderby_groppby();
        //获取所有表
        var table_name = $(this).val();
        //查询 某个表的字段名和注释，无注释用字段名
        //select tcl.COLUMN_NAME as column_name,tcc.comments,nvl(tcc.comments,tcl.COLUMN_NAME) as column_comment from user_tab_columns tcl ,user_col_comments tcc where tcl.TABLE_NAME = tcc.table_name and tcl.COLUMN_NAME = tcc.column_name and tcl.table_name='ASSETPROJECT'
        var url = "/query?sql=select tcl.COLUMN_NAME as column_name,tcc.comments,nvl(tcc.comments,tcl.COLUMN_NAME) as column_comment from user_tab_columns tcl ,user_col_comments tcc where tcl.TABLE_NAME = tcc.table_name and tcl.COLUMN_NAME = tcc.column_name and tcl.table_name='" + table_name + "' order by column_name";

        ////console.log(url);
        var column_list = ajaxRequest(url);
        //将table_list转换为 table_json对象
        var column_json = eval(column_list);
        var column_data = []; //存储data,用于存放下拉列表中，格式：var data = [{ id: 0, text: 'enhancement' }]
        for (var i = 0; i < column_json.length; i++) {
            var ar = {};
            ar['id'] = column_json[i].COLUMN_NAME;
            ar['text'] = column_json[i].COLUMN_COMMENT;
            column_data.push(ar);
        }

        //console.log(column_data);
        $(this).siblings(".tmp_class").empty();
        $(this).siblings(".tmp_class").select2({
            placeholder: "请选择关联的字段",
            data: column_data,
            allowClear: true
        });
    });

    //去除警告信息
    $(document).on("change click", ".tmp_class",
    function() {
        $(".classify_msg").html("");
    });

    //获取 selected 的字段
    function get_selected_columns() {
        var columns = "";
        $(".select_column").each(function() {
            var id = $(this).attr("id");
            columns += id + ",";
        });
        if (columns == "") { //若未选择字段，则默认选择所有字段
            columns = "*";
        }else{
          columns = columns.substring(0,columns.length-1);
        }
        return columns;
    }
    
    //获取过滤字段
    function get_where_columns() {
        var columns = "";
        $(".where_column").each(function() {
            var id = $(this).attr("id");
            columns += id + "=?,";
        });
        if (columns != "") { //若未选择字段，则默认选择所有字段
          columns = " WHERE " +columns.substring(0,columns.length-1);
        }
        return columns;
    }
    
    //获取分组字段
    function get_groupby_columns(){
      //暂时不支持
    }
    //获取排序字段
    function get_orderby_columns(){
      var columns = "";
        $(".orderby_column").each(function() {
            var id = $(this).attr("id");
            columns += id + ",";
        });
        if (columns != "") { //若未选择字段，则默认选择所有字段
          columns = columns.substring(0,columns.length-1);
            columns = " ORDER BY "+columns;
        }
        return columns;
    }
    //生成SQL
    $(document).on("click", "#btn_analyze_sql",
    function() {
        $(".classify_msg").html("");
        //遍历每个tmp_class，选择的字段
        var flag = true;
        var select_columns = "SELECT " + get_selected_columns() + " FROM ";
        $(".tmp_jion_class").each(function() {
            if (null == $(this).val()) {
                $(".classify_msg").html("<div class='alert alert-danger' role='alert'>请选择左右连接的的字段！！</div>");
                flag = false;
            }
        });
        //若字段为空，则返回。
        if (flag == false) {
            return false;
        }

        //表list，用于装载表名字，表左或右的连接字段ID
        var table_jion_list = []
        //判断表个数
        var counter = $("#table_count").val();
        if (counter == 1) //如果是一个表，则只装载，table_name一个字段，其值为表名字。[{table_name:student}]
        {
            $(".tmp_table").each(function() {
                var ar = {};
                ar['table_name'] = $(this).val();
                table_jion_list.push(ar);
            });
        } else if (counter == 2) //如果是2个表，则装载两个字段：[{table_name:student,jion_id:1},{table_name:score,jion_id:3}]
        {
            $(".tmp_table").each(function() {
                var ar = {};
                ar['table_name'] = $(this).val();
                ar['jion_id'] = $(this).siblings(".tmp_jion_class").val();
                table_jion_list.push(ar);

            });
        } else { //如果是3个以上的表，数据例子：[{table_name:student,jion_id:1},{table_name:student,left_jion_id:1,right_jion_id:1},....,{table_name:student,jion_id:1}]
            var flag = 1;
            $(".tmp_table").each(function() {
                if (flag == 1) { //装载第一个表：{table_name:student,jion_id:1}
                    var ar = {};
                    ar['table_name'] = $(this).val();
                    ar['jion_id'] = $(this).siblings(".tmp_jion_class").val();
                    table_jion_list.push(ar);
                } else if (flag < counter) { //装载第2至倒数第二个表，{table_name:student,left_jion_id:1,right_jion_id:1}
                    var ar = {};
                    ar['table_name'] = $(this).val();
                    ar['left_jion_id'] = $(this).siblings(".tmp_left_join_class").val();
                    ar['right_jion_id'] = $(this).siblings(".tmp_right_jion_class").val();
                    table_jion_list.push(ar);
                } else { ////装载最后一个表：{table_name:student,jion_id:1}
                    var ar = {};
                    ar['table_name'] = $(this).val();
                    ar['jion_id'] = $(this).siblings(".tmp_jion_class").val();
                    table_jion_list.push(ar);
                }
                flag += 1;
            });
        }
        console.log(table_jion_list);
        var sql = "";
        if (counter == 1) { //一张表情况下的sql语句；
            sql = select_columns + table_jion_list[0].table_name;
        } else if (counter == 2) { //两张表情况下的SQL语句
            sql = select_columns + table_jion_list[0].table_name + " , " + table_jion_list[1].table_name + " WHERE " + table_jion_list[0].table_name + "." + table_jion_list[0].jion_id + " = " + table_jion_list[1].table_name + "." + table_jion_list[1].jion_id;
        } else { //多余3张表情况下的sql语句
            sql = select_columns;
            //遍历所有的表
            for (var i = 0; i < table_jion_list.length; i++) {
                sql += table_jion_list[i].table_name + ",";
            }
            sql = sql.substring(0,sql.length-1);
            sql += " WHERE " + table_jion_list[0].table_name + "." + table_jion_list[0].jion_id + " = "
            //遍历所有管理的字段
            //遍历所有的表
            for (var i = 1; i < table_jion_list.length - 1; i++) {
                sql += table_jion_list[i].table_name + "." + table_jion_list[i].left_jion_id + " AND " + table_jion_list[i].table_name + "." + table_jion_list[i].right_jion_id + " = ";
            }
            //最后一个表的右连接
            sql += table_jion_list[counter - 1].table_name + "." + table_jion_list[counter - 1].jion_id;
        }

        //分析后的SQL展现在文本框内
        sql = sql + " "+ get_where_columns();
        sql = sql + " "+ get_orderby_columns();
        //console.log(sql);
        //把字段别名中^ 替换为'
        sql = sql.replace(/\^+/g, '"');
        $("#sql_text").text(sql);
        /*
    for (var i = 0; i < table_jion_list.length-1; i++) {
      if (i == 0){
        console.log("table_name:"+table_jion_list[i].table_name+",jion_id:"+table_jion_list[i].jion_id);
      }
      else(if)
       
    }
    */
        /*
    //遍历所有表，无需判断是否为空，子都不为空，则表不可能为空
    var jion_data = []; //存储data,var data = [{ table_name: 0, left_jion_column: 'ID',right_jion_column:'ID2' }]
    $(".tmp_jion_class").each(function(){
      if(null == $(this).val()){
        $(".classify_msg").html("<div class='alert alert-danger' role='alert'>请选择左右连接的的字段！！</div>");
        flag = false; 
      }
    });
    var jion_data = []; //存储data,用于存放下拉列表中，格式：var data = [{ id: 0, text: 'enhancement' }]
    for (var i = 0; i < opts_json.length; i++) {
      var ar = {};
      ar['id'] = opts_json[i].ID;
      ar['text'] = opts_json[i].NAME;
      opts_data.push(ar);
    }
    */

    });
    
    //验证SQL
    //定义验证SQL的全局变量
    var verfiy_sql_status = false;
    $(document).on("click", "#btn_verify_sql",
    function() {
      var sql = $("#sql_text").text();
      if("" == sql){
        $(".classify_msg").html("<div class='alert alert-warning' role='alert'>尚未生成SQL语句！！！</div>");
      }else if(sql.indexOf(" WHERE ")>0){
        sql = sql.replace(" WHERE "," WHERE 1=0 AND ");
      }else if(sql.indexOf(" ORDER BY ")>0){
        sql = sql.replace(" ORDER BY "," WHERE 1=0 ORDER BY ");
      }else{
        sql = sql + " WHERE 1=0";
      }
      console.log(sql);
      //若带条件，请自行拼接sql或。。。。。
      var url = "/query?sql="+sql;
      var ret = ajaxRequest(url);
      if("" != ret)
      {
        $(".classify_msg").html("<div class='alert alert-danger' role='alert'>SQL验证失败</div>");
      }else{
        $(".classify_msg").html("<div class='alert alert-success' role='alert'>验证通过</div>");
      }
    });
    
    //添加报表
    $("#btn_add_sql").bind("click",function(){
      var report_type = $("#report_type").val();
      var report_name = $("#report_name").val();
      var sql = $("#sql_text").text();
      if(""==report_type){
        $(".classify_msg").html("<div class='alert alert-danger' role='alert'>请选择报表类型！！</div>");
        return false;
      }
      if(""==sql){
        $(".classify_msg").html("<div class='alert alert-danger' role='alert'>请点击【生成SQL】，【验证SQL】</div>");
        return false;
      }
      if(""== report_name){
        $(".classify_msg").html("<div class='alert alert-danger' role='alert'>请输入报表名称！</div>");
        return false;
      }
      console.log("report_id:"+report_type+",name:"+report_name+",sql="+sql);
      var url = "/addReport?id="+report_type+"&name=" + report_name + "&sql=" + sql;
        var ret = ajaxRequest(url);
        var msg =  "【"+$("#report_type").find("option:selected").text()+"】->【"+report_name+"】";
        if (ret == -1) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>添加失败，此"+msg+",报表已存在！</div>");
        } else if (ret == -2) {
            $(".classify_msg").html("<div class='alert alert-danger' role='alert'>服务器异常，请联系管理员！</div>");
        } else {
            $(".classify_msg").html("<div class='alert alert-success' role='alert'>"+msg+"，报表添加成功！</div>");
            $("#report_name").val("");
        }
    });

    //定义全局变量，标识当前选择
    var select_or_groupby_or_orderby = "选择";
    //选择、分组、排序按钮
    $(document).on("click", ".select_btn",
    function() {
        $(".select_btn").addClass("btn-info");
        $(this).removeClass("btn-info");
        $(this).addClass("btn-success");
        select_or_groupby_or_orderby = $(this).text();
        $(".lable_select").text(select_or_groupby_or_orderby + "字段:");
        console.log(select_or_groupby_or_orderby);
    });

    // 添加选择字段
    $(document).on("change click", ".select_column_class",
    function() {
        //alert($(this).val());
        //清空信息栏
        $(".classify_msg").html("");
        if ("选择" == select_or_groupby_or_orderby) {
            var comment = $(this).find("option:selected").text();
            var column_name = $(this).siblings(".tmp_table").val() + "." + $(this).val() + " AS ^" + comment + "^";
            //alert(column_name);
            var flag = false;
            $(".select_column").each(function() {
                var id = $(this).attr("id");
                if (id == column_name) {
                    flag = true;
                }
            });
            if (flag) {
                $(".classify_msg").html("<div class='alert alert-warning' role='alert'>此字段已添加！！</div>");
                return false;
            }
            $("#selected_columns_div").append("<div id='" + column_name + "' class ='col-md-1 select_column' role='alert'><span class='col-md-10 selected_columns_span' title='表.字段 AS 别名:" + column_name + "'>" + $(this).find("option:selected").text() + "</span><i class='glyphicon glyphicon-remove close-selected-colum'></i></div>");
        } else if ("分组" == select_or_groupby_or_orderby) {
            //暂时不支持分组
        } else if("过滤" == select_or_groupby_or_orderby) {
          var where_column = $(this).siblings(".tmp_table").val() + "." + $(this).val();
            var flag = false;
            $(".where_column").each(function() {
                var id = $(this).attr("id");
                if (id == where_column) {
                    flag = true;
                }
            });
            if (flag) {
                $(".classify_msg").html("<div class='alert alert-warning' role='alert'>此排序字段已添加！！</div>");
                return false;
            }
            $("#where_columns_div").append("<div id='" + where_column + "' class ='col-md-1 where_column' role='alert'><span class='col-md-10 selected_columns_span' title='" + where_column + "'>" + $(this).find("option:selected").text() + "</span><i class='glyphicon glyphicon-remove close-selected-colum'></i></div>");
        } else if ("排序" == select_or_groupby_or_orderby) {
            var orderby_column = $(this).siblings(".tmp_table").val() + "." + $(this).val();
            var flag = false;
            $(".orderby_column").each(function() {
                var id = $(this).attr("id");
                if (id == orderby_column) {
                    flag = true;
                }
            });
            if (flag) {
                $(".classify_msg").html("<div class='alert alert-warning' role='alert'>此排序字段已添加！！</div>");
                return false;
            }
            $("#orderby_columns_div").append("<div id='" + orderby_column + "' class ='col-md-1 orderby_column' role='alert'><span class='col-md-10 selected_columns_span' title='" + orderby_column + "'>" + $(this).find("option:selected").text() + "</span><i class='glyphicon glyphicon-remove close-selected-colum'></i></div>");
        }

    });

    //删除已选择的字段
    $(document).on("change click", ".close-selected-colum",
    function() {
        $(this).parent().remove();
    });

    //统计分析
    var sql = "";
    $("#analyze").bind("click",
    function() {
        sql = $("#sql").val();
        var columns = get_columns(sql);
        //向后台请求数据
        load_data("/query?sql=" + sql, columns);
    });

    //解析SQL并获取字段列表，返回一个数组
    function get_columns(sql) {
        $("#selected_columns_div").html("");
        var flag = sql.toUpperCase().indexOf(" FROM ");
        var cls = sql.substring(0, flag).replace(/\ +/g, "");
        cls = cls.substr(6, cls.length);
        //alert(cls);
        return cls.split(",");
    }

    //填充table数据
    function load_data(url, columns) {
        var items = [];
        $.each(columns,
        function(n, value) {
            var ar = {
                'align': 'left',
                'valign': 'middle',
                'sortable': true
            };
            ar['field'] = value;
            ar['title'] = value;
            items.push(ar);
        });
        $('#table-javascript').bootstrapTable({
            method: 'get',
            url: url,
            cache: false,
            height: 600,
            striped: true,
            pagination: true,
            pageSize: 50,
            pageList: [10, 25, 50, 100, 200],
            search: true,
            showColumns: true,
            search: false,
            //不显示 搜索框
            showColumns: false,
            showRefresh: true,
            minimumCountColumns: 2,
            clickToSelect: true,
            columns: items
            /*[
      
      {
        field: 'state',
        checkbox: true
      },
      
      {
        field: 'CODE',
        title: 'CODE',
        align: 'left',
        valign: 'middle',
        sortable: true
      },
      {
        field: 'NAME',
        title: 'NAME',
        align: 'left',
        valign: 'middle',
        sortable: true
    },
    {
      field: 'TABLE_ID',
      title: 'TABLE_ID',
      align: 'left',
      valign: 'middle',
      sortable: true
    },
    {
      field: 'DATA_TYPE_ID',
      title: 'DATA_TYPE_ID',
      align: 'left',
      valign: 'middle',
      sortable: true
    }]*/
        });
    }
    //end
    var pv = [],
    ip = [],
    t;
    for (var i = 0; i < 61; i++) {
        t = Math.floor(Math.random() * (30 + ((i % 12) * 5))) + 10;
        pv.push(t);
        t = Math.floor(t * 0.5);
        t = t - Math.floor((Math.random() * t) / 2);
        ip.push(t);
    }

    var data = [{
        name: 'PV',
        value: pv,
        color: '#0d8ecf',
        line_width: 2
    },
    {
        name: 'IP',
        value: ip,
        color: '#ef7707',
        line_width: 2
    }];

    var labels = ["2012-08-01", "2012-08-02", "2012-08-03", "2012-08-04", "2012-08-05", "2012-08-06"];
    var line = new iChart.LineBasic2D({
        render: 'canvasDiv',
        data: data,
        align: 'center',
        title: 'ichartjs官方网站最近5天流量趋势',
        subtitle: '平均每个人访问2-3个页面(访问量单位：万)',
        footnote: '数据来源：模拟数据',
        width: 800,
        height: 400,
        tip: {
            enable: true,
            shadow: true
        },
        legend: {
            enable: true,
            row: 1,
            //设置在一行上显示，与column配合使用
            column: 'max',
            valign: 'top',
            sign: 'bar',
            background_color: null,
            //设置透明背景
            offsetx: -80,
            //设置x轴偏移，满足位置需要
            border: true
        },
        crosshair: {
            enable: true,
            line_color: '#62bce9'
        },
        sub_option: {
            label: false,
            point_hollow: false
        },
        coordinate: {
            width: 640,
            height: 240,
            axis: {
                color: '#9f9f9f',
                width: [0, 0, 2, 2]
            },
            grids: {
                vertical: {
                    way: 'share_alike',
                    value: 5
                }
            },
            scale: [{ //定义纵坐标的
                position: 'left',
                start_scale: 0,
                end_scale: 100,
                scale_space: 10,
                scale_size: 2,
                scale_color: '#9f9f9f'
            },
            {
                position: 'bottom',
                labels: labels
            }]
        }
    });

    //开始画图
    line.draw();

});