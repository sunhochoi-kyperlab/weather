<template>
  <div class='list' :class='{"isEmpty": isEmpty}'>
    <div class='scroll-container'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import IScroll from 'obigo-js-ui/features/iscroll'
import spm from './scroll-position-manager'
import listItem from './list-item'
import Events from 'obigo-js-ui/features/events'

export default {
  name: 'list',
  props: {
    hideDummyItem: {
      type: Boolean,
      default: true
    },
    targetElementIndex: {
      type: Number
    },
    listKey: {
      type: String
    }
  },
  data () {
    return {
      isEmpty: false
    }
  },
  methods: {
    getScroll () {
      return this.$scroll
    },
    focusIn2 (index, e) {
      /*
       * 리스트 아이템의 높이는 모두 같다는 전제
       */

       /*
        매개변수 index는 컴포넌트 생성시 반복문에 의해 생성되는 인덱스.
        만약 리스트 아이템이 동적으로 추가되거나, accordiond의 경우, 반복문에 의한 index가 무의미함.
        따라서, 이전에 포커스된 인덱스를 저장해놓고 list의 children엘리먼트들을 대상으로 인덱스를 결정.
       */
      index = this.beforeFocusIndex
      if (e.direction === 'right') {
        let i = index
        while (true) {
          if (this.itemsEl[i] === e.target) {
            index = i
            break
          }
          i++
          if (i > this.itemsEl.length - 1) {
            i = 0
          }
        }
      } else if (e.direction === 'left') {
        let i = index
        while (true) {
          if (this.itemsEl[i] === e.target) {
            index = i
            break
          }
          i--
          if (i < 0) {
            i = this.itemsEl.length - 1
          }
        }
      }
      this.beforeFocusIndex = index
      var itemHeight = this.$scroll.pages[0][0].height         // 만약 iscroll의 pages속성을 없앤다면, 수정되어야 할 부분!!
      var wrapperHeight = this.$scroll.wrapperHeight - (this.hasFixed ? itemHeight : 0)
      var fixedFocusPos = 0
      var remain = itemHeight - ((wrapperHeight - (this.hideDummyItem ? 0 : 78)) % itemHeight)
      var itemsInPage = Math.floor((wrapperHeight - (this.hideDummyItem ? 0 : 78)) / itemHeight) - (remain === itemHeight ? 1 : 0)
      var nowPage = this.$scroll.currentPage.pageY

      if (e.direction === 'right') {
        fixedFocusPos = itemsInPage
        if (index - nowPage > itemsInPage - 1) {
          this.$scroll.goToPage(0, index - fixedFocusPos + 1, 200)
          /*
        } else {
          this.$scroll.goToPage(0, 0, 200)
          */
        }
      } else if (e.direction === 'left') {
        fixedFocusPos = 2
        if (index === nowPage) {
          this.$scroll.goToPage(0, nowPage - 1, 200)
        }
      } else {
        this.$scroll.goToPage(0, 0, 100)
      }
    },
    focusIn (index, direction) {
      /*
       * 리스트 아이템의 높이는 모두 같다는 전제
       */

      var itemHeight = this.$scroll.pages[0][0].height         // 만약 iscroll의 pages속성을 없앤다면, 수정되어야 할 부분!!
      var wrapperHeight = this.$scroll.wrapperHeight - (this.hasFixed ? itemHeight : 0)
      var fixedFocusPos = 0
      var remain = itemHeight - ((wrapperHeight - (this.hideDummyItem ? 0 : 78)) % itemHeight)
      var itemsInPage = Math.floor((wrapperHeight - (this.hideDummyItem ? 0 : 78)) / itemHeight) - (remain === itemHeight ? 1 : 0)
      var nowPage = this.$scroll.currentPage.pageY

      if (direction === 'right') {
        fixedFocusPos = itemsInPage
        if (index - nowPage > itemsInPage - 1) {
          this.$scroll.goToPage(0, index - fixedFocusPos + 1, 200)
        }
      } else if (direction === 'left') {
        fixedFocusPos = 2
        if (index === nowPage) {
          this.$scroll.goToPage(0, nowPage - 1, 200)
        }
      } else {
        this.$scroll.goToPage(0, 0, 100)
      }
    },
    makeScroll: function () {
      if (this.$el.querySelectorAll('.scroll-container > .list-item').length === 0 || this.$slots.default === undefined || this.$slots.default.length === 0) {
        this.isEmpty = true
        return
      }
      this.isEmpty = false
      this.$scroll = new IScroll(this.$el, {
        probeType: 2,
        bounce: true,
        mouseWheel: false,
        scrollbars: true,
        fadeScrollbars: true,
        interactiveScrollbars: false,
        scrollXThreshold: listItem.horiThreshold,
        scrollYThreshold: listItem.vertiThreshold,
        click: true,
        disableMouse: false,
        disablePointer: true,
        disableTouch: false,
        snap: '.list-item',
        deceleration: 0.001,
        dummyItem: !this.hideDummyItem
      })
      this.$scroll.on('scrollEnd', this.scrollEnd)
      this.$scroll.on('scrollStart', this.scrollStart)
      var lastPos = 0
      if (this.$router) { // 팝업의 컴포넌트로 list를 생서할 시 router는 전달되지 않으므로 라우터 검사 후 라우터 사용
        lastPos = spm.get(this.listKey + this.$router.history.current.fullPath)
      }
      if (this.$router && this.$router.isBack === true && lastPos !== undefined) {
        this.$scroll.goToPage(0, lastPos.pageY, 0)    // scrollTo를 사용하면 iscroll의 pages속성을 업데이트하지않아 snap이 적용된 스크롤 동작이 정상적이지 않음.
      } else {
        this.scrollToElement(this.targetElementIndex)
      }
    },
    scrollStart () {
      Events.$emit('list:scrollstart')
    },
    scrollEnd () {
      if (this.listKey !== undefined && this.$router) {
        spm.set(this.listKey + this.$router.history.current.fullPath, this.$scroll.currentPage)
      }
      Events.$emit('list:scrollend')
    },
    refreshScroll: function () {
      if (this.$scroll) {
        this.itemsEl = this.$el.querySelectorAll('.list-item')
        if (this.itemsEl.length === 0 || this.$slots.default === undefined || this.$slots.default.length === 0) {
          this.isEmpty = true
          this.$scroll.destroy()
          this.$scroll = undefined
        } else {
          this.isEmpty = false
          this.$scroll.refresh()
        }
      } else {
        this.makeScroll()
        this.itemsEl = this.$el.querySelectorAll('.list-item')
      }
    },
    scrollToElement: function (index) {
      if (index !== undefined && this.$slots.default[index]) {
        this.$scroll.scrollToElement(this.$slots.default[index].elm, 0)
      }
    },
    prev () {
      this.$scroll && this.$scroll.prev()
    },
    next () {
      this.$scroll && this.$scroll.prev()
    },
    goToIndex (index) {
      this.$scroll && this.$scroll.goToPage(0, index, 200)
    },
    hasFixedItem () {
      if (this.$el.querySelector('.fixed')) {
        this.hasFixed = true
      } else {
        this.hasFixed = false
      }
    }
  },
  updated: function () {
    let nowScrollHeight = this.$el.firstChild.scrollHeight
    if (this.beforeScrollHeight !== nowScrollHeight) {
      this.refreshScroll()
      this.beforeScrollHeight = nowScrollHeight
    }
    if (this.isEmpty === false) {
      this.scrollToElement(this.targetElementIndex)
    }
    this.hasFixedItem()
  },
  mounted: function () {
    this.itemsEl = []
    this.beforeFocusIndex = 0
    this.makeScroll()
    this.beforeScrollHeight = this.$el.firstChild.scrollHeight
    this.$on('updateScroll', this.refreshScroll)  // accordion에서 list item이 동적으로 변경시 updateScroll 이벤트 발생.
    this.hasFixedItem()
    this.itemsEl = this.$el.querySelectorAll('.list-item')
  },
  beforeDestroy: function () {
    if (this.$scroll) {
      this.$scroll.destroy()
      this.$scroll = undefined
    }
  }

}
</script>
<style lang="scss" scoped >
.isEmpty {
  display:flex;
  justify-content:center;
  align-items:center;
}
</style>

