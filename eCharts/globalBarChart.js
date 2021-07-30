import * as echarts from 'echarts';
import lodash from 'lodash';
import { computedIntervalData } from 'common/js/num';

function mergeLegend(legend = {}) {
  const initLegend = {
    textStyle: {
      color: '#FFF',
      fontSize: 16
    }
  };
  return lodash.merge({}, initLegend, legend);
}

function mergeToolTip(tooltip = {}) {
  const initTooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true,
    textStyle: {
      fontSize: 16
    }
  };
  return lodash.merge({}, initTooltip, tooltip);
}

function mergeGrid(grid) {
  const initGrid = {
    containLabel: true
  };
  return lodash.merge({}, initGrid, grid);
}

function mergeXAxis(xAxis) {
  const initXAxis = {
    type: 'category',
    axisLabel: {
      color: '#fff',
      fontSize: 16
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  };

  let updateXAxis;
  if (Array.isArray(xAxis)) {
    [updateXAxis] = xAxis;
  } else {
    updateXAxis = xAxis;
  }
  return [lodash.merge({}, initXAxis, updateXAxis)];
}

function mergeYAxis(series = [], yAxis) {
  let min;
  let max;
  let interval;
  if (series.length) {
    const data = [];
    series.forEach(first => {
      first.data.forEach(item => {
        data.push(item);
      });
    });
    const intervalObj = computedIntervalData({ data });
    min = intervalObj.min;
    max = intervalObj.max;
    interval = intervalObj.interval;
  }
  const initYAxis = [
    {
      type: 'value',
      scale: true,
      min,
      max,
      interval,
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#fff',
        fontSize: 16
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    }
  ];

  let updateYAxis;
  if (Array.isArray(yAxis)) {
    [updateYAxis] = yAxis;
  } else {
    updateYAxis = yAxis;
  }
  if (updateYAxis && updateYAxis.valueData) {
    const intervalObj = computedIntervalData({ data: updateYAxis.valueData });
    initYAxis.min = intervalObj.min;
    initYAxis.max = intervalObj.max;
    initYAxis.interval = intervalObj.interval;
  }
  return [lodash.merge({}, initYAxis[0], updateYAxis)];
}

function mergeSeries(series = []) {
  const initSeries = {
    type: 'bar',
    barWidth: '16',
    itemStyle: {
      barBorderRadius: [16, 16, 0, 0]
    },
    showBackground: true,
    backgroundStyle: {
      color: 'rgba(51,147,198,0)',
      borderWidth: 1,
      borderColor: 'rgba(51,147,198,0.2)',
      barBorderRadius: [16, 16, 0, 0]
    }
  };
  let lastSeries = [];
  series.forEach(item => {
    let color1;
    let color2;
    if (item.colorList) {
      [color1, color2] = item.colorList;
    }
    initSeries.color = {
      x: 0,
      y: 1,
      x2: 0,
      y2: 0,
      type: 'linear',
      global: false,
      colorStops: [
        {
          offset: 0,
          color: color1 || '#265CD4'
        },
        {
          offset: 1,
          color: color2 || '#33ADF1'
        }
      ]
    };
    lastSeries.push(lodash.merge({}, initSeries, item));
  });
  if (!lastSeries.length) {
    lastSeries = [initSeries];
  }
  return lastSeries;
}

// 圆角柱状图
export class GlobalCircleBarChart {
  constructor({
    dom,
    tooltip,
    legend,
    grid,
    xAxis,
    yAxis,
    series,
    color,
    clickEvent,
    extendSign,
    ...rest
  }) {
    // 销毁重新绘制
    if (document.getElementById(dom)) {
      document.getElementById(dom).removeAttribute('_echarts_instance_');
    }
    const _legend = mergeLegend(legend);
    const _tooltip = mergeToolTip(tooltip);
    const _grid = mergeGrid(grid);
    const _xAxis = mergeXAxis(xAxis);
    const _yAxis = mergeYAxis(series || [], yAxis);
    const _series = mergeSeries(series);
    this.option = {};
    this.clickEvent = clickEvent || (() => {});
    if (!extendSign) {
      this.init(dom, color, _legend, _tooltip, _grid, _xAxis, _yAxis, _series, rest);
    }
  }

  init(dom, color, legend, tooltip, grid, xAxis, yAxis, series, rest) {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById(dom));
    // 绘制图表
    this.option = {
      color: color || [
        '#46A0FF',
        '#FFC64C',
        '#63E587',
        '#FA885D',
        '#7BF0EB',
        '#F277E1',
        '#FF7B7B',
        '#728EFE',
        '#E1EC9E',
        '#8F2EFF',
        '#8DEEFF',
        '#7C69F2',
        '#CCF6B5',
        '#EE8989',
        '#84B2FF',
        '#80E5C4'
      ],
      legend,
      tooltip,
      grid,
      xAxis,
      yAxis,
      series,
      ...rest
    };
    this.myChart.setOption(this.option);
    window.addEventListener('resize', () => this.myChart.resize(), false);
    this.myChart.on('click', params => {
      this.clickEvent(params);
    });
  }
}

export class GlobalBarLineChart extends GlobalCircleBarChart {
  constructor(props = {}) {
    const {
      dom, tooltip, legend, grid, xAxis, yAxis, series, color, ...rest
    } = props;
    /* eslint no-param-reassign: "error" */
    props.extendSign = true;
    super(props);
    const _legend = GlobalBarLineChart.mergeLegend(legend);
    const _tooltip = mergeToolTip(tooltip);
    const _grid = mergeGrid(grid);
    const _xAxis = mergeXAxis(xAxis);
    const _yAxis = GlobalBarLineChart.mergeYAxis(yAxis);
    const _series = GlobalBarLineChart.mergeSeries(series);
    this.init(dom, color, _legend, _tooltip, _grid, _xAxis, _yAxis, _series, rest);
  }

  static mergeSeries(series = []) {
    const handleBarSeries = seriesParams => {
      const initBarSeries = {
        type: 'bar',
        barWidth: '16',
        itemStyle: {
          barBorderRadius: [16, 16, 0, 0]
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(51,147,198,0)',
          borderWidth: 1,
          borderColor: 'rgba(51,147,198,0.2)',
          barBorderRadius: [16, 16, 0, 0]
        }
      };
      let color1;
      let color2;
      if (seriesParams.colorList) {
        [color1, color2] = seriesParams.colorList;
      }
      initBarSeries.color = {
        x: 0,
        y: 1,
        x2: 0,
        y2: 0,
        type: 'linear',
        global: false,
        colorStops: [
          {
            offset: 0,
            color: color1 || '#265CD4'
          },
          {
            offset: 1,
            color: color2 || '#33ADF1'
          }
        ]
      };
      return lodash.merge({}, initBarSeries, seriesParams);
    };
    const handleLineSeries = seriesParams => {
      const initLineSeries = {
        type: 'line',
        color: 'rgba(229,182,52,1)'
      };
      return lodash.merge({}, initLineSeries, seriesParams);
    };

    const lastSeries = [];
    series.forEach((item, index) => {
      let yAxisIndex = 0;
      if (index) {
        yAxisIndex = 1;
      }
      if (item.type === 'bar') {
        lastSeries.push(handleBarSeries({ yAxisIndex, ...item }));
      } else if (item.type === 'line') {
        lastSeries.push(handleLineSeries({ yAxisIndex, ...item }));
      }
    });
    return lastSeries;
  }

  static mergeYAxis(yAxis = []) {
    const initYAxis = [
      {
        type: 'value',
        scale: true,
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(26,52,103,0.5)'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      {
        type: 'value',
        scale: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#fff',
          fontSize: 16
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      }
    ];
    const lastYAxis = [];
    if (yAxis.length) {
      if (yAxis[0].valueData) {
        const intervalObj = computedIntervalData({ data: yAxis[0].valueData });
        initYAxis[0].min = intervalObj.min;
        initYAxis[0].max = intervalObj.max;
        initYAxis[0].interval = intervalObj.interval;
      }
      lastYAxis.push(lodash.merge({}, initYAxis[0], yAxis[0]));
      if (yAxis[1]) {
        const intervalObj = computedIntervalData({ data: yAxis[1].valueData });
        initYAxis[1].min = intervalObj.min;
        initYAxis[1].max = intervalObj.max;
        initYAxis[1].interval = intervalObj.interval;
        lastYAxis.push(lodash.merge({}, initYAxis[1], yAxis[1]));
      }
    }
    return lastYAxis;
  }

  static mergeLegend(legend = {}) {
    const initLegend = {
      textStyle: {
        color: '#FFF',
        fontSize: 16
      },
      itemWidth: 6,
      icon: 'rect'
    };
    return lodash.merge({}, initLegend, legend);
  }
}
