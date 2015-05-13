$(document).ready(function() {
  
  //统计分析
  var sql="";
  $("#analyze").bind("click",function(){
    sql = $("#sql").val();
    var columns = get_columns(sql);
    //向后台请求数据
    load_data("/query?sql="+sql,columns);
  });
  
  //解析SQL并获取字段列表，返回一个数组
  function get_columns(sql){
    var flag= sql.toUpperCase().indexOf(" FROM ");
    var cls=sql.substring(0,flag).replace(/\ +/g,"");
    cls = cls.substr(6,cls.length);
    //alert(cls);
    return cls.split(",");
  }
  
  //填充table数据
  function load_data(url,columns){
      var items = [];
      $.each(columns,function(n,value) {
        var ar = {
          'align':'left',
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
      search: false, //不显示 搜索框
 
                showColumns: false, //不显示下拉框（选择显示的列）
 
                sidePagination: "server", //服务端请求
 
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