<template>
  <div class="pieEchart" ref="main" :style="{ width, height }"></div>
</template>

<script>
import * as Echarts from 'echarts'

export default {
  name: 'PieEchart',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    LabelFontSize: {
      type: String,
      default: '22'
    },
    colorList: {
      type: Array,
      default: () => ['#5B8FF9', '#63DAAB', '#657798', '#FDB36A', '#FD866A', '#9E87FF', '#58D5FF']
    },
    data: {
      type: Array,
      required: true
    },
    interval: {
      type: Number,
      required: false,
      default: 2200
    },
    unit: {
      type: String,
      default: '个'
    }
  },
  data() {
    return {
      myEchart: null,
      // 轮播逻辑
      timer: null,
      currentIndex: -1,
      currentItem: {
        name: '',
        value: ''
      },
      selectedLengend: null,
      len: 0,
      currDataList: null
    }
  },
  created() {},
  computed: {
    option() {
      const { colorList, data, unit } = this
      const normalOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br /> 数量占比： {d}%'
        },
        legend: {
          orient: 'vertical',
          right: 14,
          top: 'center',
          icon: 'circle'
        },
        color: colorList,
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['36%', '58%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              formatter: `{b}\n {c}${unit}`
            },
            emphasis: {
              label: {
                show: true,
                fontSize: this.LabelFontSize,
                fontWeight: 'bold'
              }
            },
            data
          }
        ]
      }
      return normalOption
    }
  },
  watch: {
    option() {
      this.initEchart()
      this.initPieEvent()
      this.autoSwipe()
    }
  },
  mounted() {
    this.initEchart()
    this.initPieEvent()
    this.autoSwipe()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    initEchart() {
      this.clearInstance()
      const chartDom = this.$refs.main
      this.myEchart = Echarts.init(chartDom, null, { renderer: 'svg' })
      if (this.option) {
        this.myEchart.setOption(this.option)
      }
      window.addEventListener('resize', () => {
        this.echartResize()
      })
    },
    initPieEvent() {
      if (!this.myEchart) {
        return
      }
      this.myEchart.on('mouseover', e => {
        const { currDataList, currentIndex } = this
        // 判断当前高亮是否是为悬浮的dataIndex
        const { dataIndex } = e
        if (currentIndex !== -1 && dataIndex !== currDataList[currentIndex].dataIndex) {
          // 取消轮播当前的高亮
          this.downplay(this.currentIndex)
        }
        // 改变当前项为 悬浮项
        this.currentItem.name = e.name
        this.currentItem.value = e.value
        // 下次轮播从当前高亮项开始downplay
        this.currentIndex = dataIndex
        // 直接清除定时器
        this.clearTimer()
      })
      this.myEchart.on('mouseout', () => {
        this.autoSwipe() // 鼠标离开，重新启动高亮
      })
      this.myEchart.on('legendselectchanged', e => {
        // 图表项，切换展示与否
        this.selectedLengend = e.selected
        // 重新开始轮播
        this.autoSwipe()
      })
      this.myEchart.on('click', e => {
        this.$emit('clickItem', e) // 外部扩展事件
      })
    },
    highLight(index) {
      this.myEchart.dispatchAction({
        type: 'highlight',
        dataIndex: this.currDataList[index].dataIndex
      })
    },
    downplay(index) {
      if (index === -1 || this.len === 0) {
        return
      }
      this.myEchart.dispatchAction({
        type: 'downplay',
        dataIndex: this.currDataList[index].dataIndex
      })
    },
    mainAction() {
      const { series } = this.myEchart.getOption()
      this.currDataList = series[0].data.map((item, index) => ({
        ...item,
        dataIndex: index
      })) // 给每一项数据增加 dataIndex 后续 会用到
      if (this.selectedLengend) {
        // 如果存在 选中不选中图表的信息则需要重新过滤轮播
        this.currDataList = this.currDataList.filter(item => this.selectedLengend[item.name])
      }
      this.len = this.currDataList.length
      this.downplay(this.currentIndex % this.len)
      if (this.len > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.len
        if (this.len === 1) {
          this.clearTimer()
        } else {
          this.highLight(this.currentIndex)
        }
        this.currentItem.name = this.currDataList[this.currentIndex].name
        this.currentItem.value = this.currDataList[this.currentIndex].value
      } else {
        this.currentIndex = -1 // 取消所有数据展示 ， 重置为-1
        this.currentItem.name = ''
        this.currentItem.value = ''
        this.clearTimer()
      }
    },
    autoSwipe() {
      this.mainAction()
      this.clearTimer()
      this.timer = setInterval(this.mainAction, this.interval)
    },
    clearInstance() {
      if (!this.myEchart) {
        return
      }
      this.myEchart.off('mouseover')
      this.myEchart.off('mouseout')
      this.myEchart.off('click')
      this.myEchart.clear()
      this.myEchart = null
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    echartResize() {
      if (this.myEchart) {
        this.myEchart.resize()
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
