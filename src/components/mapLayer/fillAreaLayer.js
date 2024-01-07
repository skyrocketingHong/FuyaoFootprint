import * as echarts from 'echarts/lib/echarts';

class FillAreaLayer {
  constructor(chart, areaName, names, geoData, pieData, mapData) {
    this.chart = chart;
    this.areaName = areaName;
    this.names = names;
    this.mapName = this.getMapName();
    this.geoData = geoData;
    this.pieData = pieData;
    this.mapData = mapData;

    // 检测日夜间模式
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // 设置初始颜色配置
    this.option = this.getOption(isDarkMode);

    // 注册地图，渲染图表
    echarts.registerMap(this.mapName, this.geoData);
    this.render(this.chart, this.option);

    // 监听系统主题变化（可选）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.updateTheme(event.matches);
    });

    const color = ['#79b685', '#a7c69d', '#fee090', '#eee']; // '#305f3e',

    const title = {
      text: "扶摇 skyrocketing 的足迹",
      subtext: '总有一天会填满全部颜色💪',
      sublink: '',
      left: 'left',
      textStyle: {
        fontWeight: 'bolder',
        fontSize: 24,
      },
    };

    const graphic = [
      {
        id: 'world',
        name: this.areaName,
        type: 'text',
        z: 100,
        left: 180,
        top: '40px',
        style: {
          fill: '#3eaf7c',
          text: this.areaName,
          font: '12px Microsoft YaHei',
        },
      },
    ];

    const tooltip = {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: (params) => {
        if (params.data) {
          const seriesName = params.data.tag;
          return `${params.name}<br />${seriesName}`;
        }
        return '';
      },
    };

    const legend = {
      data: ['经常去', '去过几次', '去过一次', '没去过'],
      align: 'left',
      left: 0,
      top: 60,
      icon: 'pin',
    };

    const visualMap = {
      left: 'right',
      min: 0,
      max: 100,
      seriesIndex: '1',
      inRange: {
        color: ['#ebedf0', '#fee090', '#3eaf7c'],
      },
      text: ['High', 'Low'],
      calculable: true,
    };

    const toolbox = {
      show: true,
      left: 300,
      top: 'top',
      itemGap: '30',
      feature: {
        saveAsImage: {},
      },
    };

    const pieSeries = {
      type: 'pie',
      zLevel: 1,
      center: [120, 200],
      radius: ['10%', '15%'],
      tooltip: {
        formatter: (params) => `${params.percent}%`,
      },
      label: {
        normal: {
          show: false,
          position: 'center',
        },
        emphasis: {
          show: true,
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { name: '经常去', value: pieData.uCount },
        { name: '去过几次', value: pieData.aCount },
        { name: '去过一次', value: pieData.oCount },
        { name: '没去过', value: pieData.nCount },
      ],
    };

    const mapSeries = {
      type: 'map',
      name: this.mapName,
      map: this.mapName,
      color: ['transparent'],
      tooltip,
      roam: true,
      scaleLimit: {
        max: 4,
        min: 1,
      },
      itemStyle: {
        emphasis: {
          label: {
            show: true
          }
        },
        areaColor: '#fff',
      },
      data: this.mapData,
    };

    this.option = {
      color,
      title,
      graphic,
      legend,
      tooltip: {},
      visualMap,
      toolbox,
      series: [pieSeries, mapSeries],
    };

    echarts.registerMap(this.mapName, this.geoData);
    this.render(this.chart, this.option);

    this.chart.on('legendselectchanged', (params) => {
      const o = this.option;
      o.series[1].data = this.filterMap(this.mapData, params);
      this.chart.setOption(o);
    });
  }

  // 获取 ECharts 配置
  getOption(isDarkMode) {
    return {
      // ... 其他配置 ...

      // 根据 isDarkMode 设置颜色
      backgroundColor: isDarkMode ? '#fff' : 'white',
      // 其他与颜色相关的配置
    };
  }

  // 更新主题
  updateTheme(isDarkMode) {
    const newOption = this.getOption(isDarkMode);
    this.chart.setOption(newOption);
  }


  getMapName() {
    return this.names[this.names.length - 1];
  }

  filterMap(userData, param) {
    const temp = param.selected;
    const selects = [];
    for (const key in temp) {
      if (temp[key]) {
        selects.push(key);
      }
    }
    return userData.filter((item) => selects.includes(item.tag));
  }

  render(chart, option) {
    chart.setOption(option);
  }

  updatePie(chart, pieData) {
    this.option.series[0].data = [
      { name: '经常去', value: pieData.uCount },
      { name: '去过几次', value: pieData.aCount },
      { name: '去过一次', value: pieData.oCount },
      { name: '没去过', value: pieData.nCount },
    ];
    chart.setOption(this.option);
  }

  updateMap(chart, areaName, names, geoData) {
    this.names = names;
    this.areaName = areaName;
    this.mapName = this.getMapName();

    echarts.registerMap(this.mapName, geoData);
    chart.clear();
    if (this.names.length > this.option.graphic.length) {
      this.option.graphic.push(
        {
          type: 'group',
          left: this.option.graphic[this.option.graphic.length - 1].left + 60,
          top: '40px',
          children: [
            {
              type: 'text',
              style: {
                fill: '#ccc',
                text: '>',
                font: '12px Microsoft YaHei',
              },
            },
            {
              type: 'text',
              id: this.mapName,
              name: this.areaName,
              info: '',
              left: 15,
              z: 100,
              style: {
                fill: '#3eaf7c',
                text: areaName,
                font: '12px Microsoft YaHei',
              },
            },
          ],
        },
      );
    } else {
      this.option.graphic = this.option.graphic.slice(0, this.names.length);
    }

    this.option.series[1].name = this.mapName;
    this.option.series[1].map = this.mapName;
    chart.setOption(this.option);
  }
}

export default FillAreaLayer;
