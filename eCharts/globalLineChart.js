/* eslint-disable */
import * as echarts from 'echarts';
import lodash from 'lodash';
import { computedIntervalData } from 'common/js/num';

function mergeLegend(legend = {}) {
  const initLegend = {
    textStyle: {
      color: '#000',
      fontSize: 16,
    },
    itemWidth: 6,
    icon: 'rect'
  };
  return lodash.merge({}, initLegend, legend);
}

function mergeToolTip(tooltip = {}) {
  const initTooltip = {
    trigger: 'axis',
    axisPointer: {
      type: 'line'
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
      color: '#000',
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
    updateXAxis = xAxis[0];
  } else {
    updateXAxis = xAxis;
  }
  return [
    lodash.merge({}, initXAxis, updateXAxis)
  ];
}

function mergeYAxis(data = [], yAxis) {
  let min;
  let max;
  let interval;
  const list = [];
  if (data.length) {
    data.forEach(i => {
      list.push(i.data);
    });
    const intervalObj = computedIntervalData({ data: list.flat() });
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
        color: '#000',
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
    updateYAxis = yAxis[0];
  } else {
    updateYAxis = yAxis;
  }
  return [
    lodash.merge({}, initYAxis[0], updateYAxis)
  ];
}

function mergeSeries(series = []) {
  const initSeries = {
    type: 'line',
  };
  let lastSeries = [];
  series.forEach(item => {
    lastSeries.push(lodash.merge({}, initSeries, item));
  });
  if (!lastSeries.length) {
    lastSeries = [initSeries];
  }
  return lastSeries;
}

export default class GlobalLineChart {
  constructor({
    dom, data = [], tooltip, legend, grid, xAxis, yAxis, series, color, clickEvent, ...rest
  }) {
    // 销毁重新绘制
    if (document.getElementById(dom)) {
      document.getElementById(dom).removeAttribute('_echarts_instance_');
    }
    const _legend = mergeLegend(legend);
    const _tooltip = mergeToolTip(tooltip);
    const _grid = mergeGrid(grid);
    const _xAxis = mergeXAxis(xAxis);
    const _yAxis = mergeYAxis(series, yAxis);
    const _series = mergeSeries(series);
    this.option = {};
    this.clickEvent = clickEvent || (() => {});
    this.init(dom, color, _legend, _tooltip, _grid, _xAxis, _yAxis, _series, rest);
  }

  init(dom, color, legend, tooltip, grid, xAxis, yAxis, series, rest) {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById(dom));
    // 绘制图表
    this.option = {
      color: color || [
        '#46A0FF', 'rgba(122,201,132,1)', '#63E587', '#FA885D', '#7BF0EB'
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
    this.myChart.on('click', (params) => {
      this.clickEvent(params);
    });
  }
}
