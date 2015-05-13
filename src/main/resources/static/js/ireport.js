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
    var obj = eval(opts_list);
    var opts = ""; //定义option拼接的字符串
    for (var i = 0; i < obj.length; i++) {
      opts += "<option value='"+obj[i].ID+"'>"+obj[i].NAME+"</option>";
    }
    if(flag == "nav"){
      //管理的group选项，有对一级菜单的增删改查
      var group_manager = "<optgroup label='管理' data-subtext='分类'><option value='add_classify'>添加</option><option value='delete_classify'>删除</option><option value='modify_classify'>修改</option></optgroup>";
      $("#classify_filter").html(opts + group_manager);
    }
    else if(flag == "del"){
      $("#delete_classify_filter").html(opts);
    }
    

  }
  
  // 开始load一级菜单
  load_classify("nav");

  //一级分类的change事件
  $('#classify_filter').on("change click",
  function() {
    var select_value = $(this).val();

    $(".classify_msg").html(""); //提示栏信息清空
    switch (select_value) {
    case("add_classify"):
      //add_classify，添加一级菜单
      $('#modal_add_classify').modal('toggle');
      break;
    case ("delete_classify"):
      //初始化一级菜单
      load_classify("del");
      $('#modal_delete_classify').modal('toggle');
      break;
    case ("modify_classify"):
      //modify_classify，修改一级菜单
      $('#modal_modify_classify').modal('toggle');
      break;
    }
  });

  //清空信息栏
  $(".ireport_msg").bind("click",
  function() {
    $(".classify_msg").html(""); //提示栏信息清空
  });

  //添加一级菜单
  $("#btn_add_classify").bind("click",
  function() {
    var add_classify_name = $("#add_classify_name").val();
    var add_classify_info = $("#add_classify_info").val();
    var url = "/addMainClassify?name=" + add_classify_name + "&info=" + add_classify_info;
    var ret = ajaxRequest(url);
    if (ret == -1) {
      $(".classify_msg").html("<div class='alert alert-danger' role='alert'>添加失败，此条数据已存在！</div>");
    } else {
      $(".classify_msg").html("<div class='alert alert-success' role='alert'>添加成功！</div>");
      $("#add_classify_name").val("");
      $("#add_classify_info").val("");
    }
  });

  //删除一级菜单
  $("#btn_delete_classify").bind("click",
  function() {
    var add_classify_name = $("#add_classify_name").val();
    var add_classify_info = $("#add_classify_info").val();
    var url = "/addMainClassify?name=" + add_classify_name + "&info=" + add_classify_info;
    var ret = ajaxRequest(url);
    if (ret == -1) {
      $(".classify_msg").html("<div class='alert alert-danger' role='alert'>添加失败，此条数据已存在！</div>");
    } else {
      $(".classify_msg").html("<div class='alert alert-success' role='alert'>添加成功！</div>");
      $("#add_classify_name").val("");
      $("#add_classify_info").val("");
    }
  });

  //修改一级菜单
  function modify_classify() {

}

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
        ret = "服务器出现异常！";
        alert("服务器出现异常！");
      }
    });
    return ret;
  }

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
      height: $(window).height() - 150,
      striped: true,
      pagination: true,
      pageSize: 50,
      pageList: [10, 25, 50, 100, 200],
      search: true,
      showColumns: true,
      search: false,
      //不显示 搜索框
      showColumns: false,
      //不显示下拉框（选择显示的列）
      sidePagination: "server",
      //服务端请求
      queryParams: queryParams,
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