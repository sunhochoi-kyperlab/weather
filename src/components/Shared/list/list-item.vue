<template>
  <div class='list-item' :class='{fixed: fixed}' @click="handleClick" @touchstart='down' @mousedown='down' @touchend='up' @mouseup='up' @mouseleave='up' @mousecancel='up' @touchcancel='up' @mousemove='move' @touchmove='move' >
    <slot></slot>
  </div>
</template>

<script>

var vertiThreshold = 40
var horiThreshold = 140
export default {
  name: 'list-item',
  vertiThreshold: vertiThreshold,   // static variable to make scroll
  horiThreshold: horiThreshold,   // static variable to make scroll
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    clickPropagation: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick (e) {
      if (this.isOut) {       // 추후 slide left를 이용한 삭제 기능 구현시 deltaX 값이 달라질 수 있기 때문에 click핸들러에서 한번 더 체크해서 click을 결정.
        return
      }
      this.clickDownPoint = undefined
      this.$emit('click', e)
      var comps = this.$el.querySelectorAll('input, select, button')
      if (comps.length === 1 && this.clickPropagation === true) {
        for (var i = 0; i < comps.length; i++) {
          var ev = document.createEvent('MouseEvents')
          var target = comps[i]
          ev.initMouseEvent('click', false, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null)
          ev._constructed = true
          target.dispatchEvent(ev)
        }
      }
    },
    down (e) {
      e = e.touches ? e.touches[0] : e
      this.isOut = false
      let el = e.target
      this.clickDownPoint = {
        x: e.clientX,
        y: e.clientY
      }
      do {
        if (el === this.$el) {
          break
        }
        if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT') {
          return
        }
        el = el.parentElement
      } while (el.parentElement)
      this.$el.classList.add('active')
    },
    up (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      this.$el.classList.remove('active')
    },
    move (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      if (this.clickDownPoint) {
        var deltaX = Math.abs(e.clientX - this.clickDownPoint.x)
        var deltaY = Math.abs(e.clientY - this.clickDownPoint.y)

        if (deltaX > horiThreshold || deltaY > vertiThreshold) {
          this.$el.classList.remove('active')
          this.isOut = true
        }
      }
    },
    checkFixed () {
      if (this.fixed) {
        var listEl = this.$el.parentNode.parentNode
        var fixedItems = listEl.firstChild.querySelectorAll('.fixed')
        if (fixedItems.length > 1) {
          throw new Error('Property \'fixed\' can only one in each list')
        }
        var dummyTop = this.$el.cloneNode(false)
        dummyTop.classList.remove('fixed')
        dummyTop.classList.add('odd')
        dummyTop.style.backgroundColor = 'transparent'
        listEl.firstChild.insertBefore(dummyTop, listEl.firstChild.firstChild)
        this.$el.classList.add('odd')
        listEl.appendChild(this.$el)
      }
    }
  },
  mounted () {
    this.checkFixed()
    this.$on('jog-click', () => {
      const focusControlComponent = this.$el.querySelector('[data-type="focus-control-able"]')
      if (focusControlComponent) {
        const jogClickEvent = new CustomEvent('jog-click', {
          'detail': {}
        })
        focusControlComponent.dispatchEvent(jogClickEvent)
      }
    })
  }
}
</script>