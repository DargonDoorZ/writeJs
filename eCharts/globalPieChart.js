import * as echarts from 'echarts'
import lodash from 'lodash'

const initLegend = {
  textStyle: {
    color: '#fff',
    fontSize: 16
  }
}
const initTooltip = {
  trigger: 'item',
  formatter: '{d}%',
  textStyle: {
    color: 'white',
    fontSize: 16
  }
}

const initSeries = (data, series = [{}]) => {
  let seriesItem = {}
  const initSeriesOption = {
    type: 'pie',
    radius: ['50%', '70%'],
    center: ['50%', '50%'],
    startAngle: 90, // 起始角度
    clockwise: true, // 饼图的扇区是否是顺时针排布
    legendHoverLink: false,
    data,
    itemStyle: {
      // borderWidth: 3,
      // borderColor: 'rgba(19,39,78,0.5)'
    },
    label: {
      show: false
    },
    emphasis: {
      show: false
    },
    labelLine: {
      normal: {
        show: false
      }
    }
  }
  seriesItem = lodash.merge({}, initSeriesOption, series[0])
  return [seriesItem]
}

export default class GlobalPieChart {
  // highlightEvent: 鼠标移入高亮的回调事件
  // speed: 自动轮播速度
  // clickEvent: 点击事件回调
  // data = [{name: "化学药", value: 18}, {name: "体外诊断", value: 12}]
  constructor({ dom, tooltip, legend, series, data, color, highlightEvent, allLegendUnselect, speed, clickEvent, ...rest }) {
    // 销毁重新绘制
    if (document.getElementById(dom)) {
      document.getElementById(dom).removeAttribute('_echarts_instance_')
    }
    // 浮框
    const mergeLegend = lodash.merge({}, initLegend, legend)
    const mergeTooltip = lodash.merge({}, initTooltip, tooltip)
    this._series = initSeries(data, series)
    this.myChart = null
    this.clickEvent = clickEvent
    this.option = {}
    this.highlightEvent = highlightEvent || (() => {})
    this.allLegendUnselect = allLegendUnselect || (() => {})
    this._currentItem = {}
    this._currentIndex = -1
    this._autoSetInterval = null
    this._speed = speed || 3000
    this._legendSelected = null
    this.initChart(dom, color, mergeTooltip, mergeLegend, rest)
  }

  initChart(dom, color, tooltip, legend, rest) {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById(dom))
    this.myChart.off('mouseover')
    this.myChart.off('mouseout')
    this.myChart.off('click')
    // 绘制图表
    this.option = {
      tooltip,
      legend,
      series: this._series,
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
      ...rest
    }
    this.myChart.setOption(this.option, {
      notMerge: true
    })
    this.autoLoop()
    this.pieEvent()
    window.addEventListener('resize', () => this.myChart.resize(), false)
  }

  pieEvent() {
    // pie实例化
    this.myChart.on('mouseover', params => {
      if (params.dataIndex !== this._currentIndex) {
        this.myChart.dispatchAction({
          type: 'downplay',
          dataIndex: this._currentIndex
        })
      }
      this._currentItem = params || {}
      this.highlightEvent(this._currentItem)
      clearInterval(this._autoSetInterval)
    })

    this.myChart.on('mouseout', () => {
      clearInterval(this._autoSetInterval)
      this.autoLoop()
    })

    this.myChart.on('click', params => {
      this.clickEvent(params)
    })

    this.myChart.on('legendselectchanged', params => {
      this._legendSelected = params.selected
      this.autoLoop()
      const selected = Object.keys(params.selected).some(key => params.selected[key])
      if (!selected) {
        this.allLegendUnselect(params)
      }
    })
  }

  autoLoop() {
    this.autoHighligth()
    clearInterval(this._autoSetInterval)
    let selectedLen = this._series[0].data.length
    if (this._legendSelected) {
      const selectedList = Object.keys(this._legendSelected).filter(key => this._legendSelected[key])
      selectedLen = selectedList.length
    }
    if (selectedLen > 1) {
      this._autoSetInterval = setInterval(this.autoHighligth.bind(this), this._speed)
    }
  }

  autoHighligth() {
    // 取消之前高亮的图形
    this.myChart.dispatchAction({
      type: 'downplay',
      dataIndex: this._currentIndex
    })
    this.checkHighlight()
    this.highlightEvent(this._currentItem)
    // 高亮当前图形
    this.myChart.dispatchAction({
      type: 'highlight',
      dataIndex: this._currentIndex
    })
  }

  checkHighlight() {
    const { data } = this._series[0]
    const dataLen = data.length
    if (!dataLen) {
      return
    }
    this._currentIndex = (this._currentIndex + 1) % dataLen
    this._currentItem = data[this._currentIndex] || {}
    while (
      this._legendSelected &&
      !this._legendSelected[this._currentItem.name] &&
      Object.values(this._legendSelected).some(m => m === true)
    ) {
      this._currentIndex = (this._currentIndex + 1) % dataLen
      this._currentItem = data[this._currentIndex] || {}
    }
  }
}
