<template lang="pug">
  .field
    .field.is-grouped
      label サイズ
      .field.has-addons
        button.button(
          :class="val.ratio ? 'is-success' : ''"
          :title="'縦横比固定：' + (val.ratio ? 'オン' : 'オフ')"
          @click="toggleRatio")
          b-icon(:icon="val.ratio ? 'link-variant' : 'link-variant-off'")
        button.button(
          title="キャンバスサイズに合わせる"
          @click="onClickExpand")
          b-icon(icon="arrow-expand-all")
        button.button(
          v-if="val.srcWidth || val.srcHeight"
          title="実サイズに合わせる"
          @click="onClickCollapse")
          b-icon(icon="arrow-collapse-all")
    .field.is-horizontal
      .field-body.field-sub
        .field.is-grouped.is-narrow
          label 幅
          .field
            p.control.has-icons-left
              input.input(
                type="number"
                min="0"
                max="9999"
                v-model.number="sizeWidth")
              b-icon.is-left(icon="arrow-expand-horizontal")
        .field.is-grouped.is-narrow
          label 高さ
          .field
            p.control.has-icons-left
              input.input(
                type="number"
                min="0"
                max="9999"
                v-model.number="sizeHeight")
              b-icon.is-left(icon="arrow-expand-vertical")
</template>

<script>
function _sizeData(data, maxWidth, maxHeight) {
  let width = maxWidth
  if (data && typeof data.width !== 'undefined') {
    width = data.width
  }

  let srcWidth = 0
  if (data && typeof data.srcWidth !== 'undefined') {
    srcWidth = data.srcWidth
  }

  let height = maxHeight
  if (data && typeof data.height !== 'undefined') {
    height = data.height
  }

  let srcHeight = 0
  if (data && typeof data.srcHeight !== 'undefined') {
    srcHeight = data.srcHeight
  }

  let ratio = null
  if (data && typeof data.ratio !== 'undefined') {
    ratio = data.ratio
  }

  return {
    width: width,
    srcWidth: srcWidth,
    height: height,
    srcHeight: srcHeight,
    ratio: ratio
  }
}

export default {
  name: 'Size',
  props: ['value', 'maxWidth', 'maxHeight'],
  data() {
    return {
      val: _sizeData(this.value, this.maxWidth, this.maxHeight)
    }
  },
  computed: {
    sizeWidth: {
      get() {
        return this.val.width
      },
      set(newVal) {
        this.val.width = newVal
        if (this.val.ratio) {
          this.val.height = Math.floor(newVal / this.val.ratio)
        }
        this.$emit('input', this.val)
      }
    },
    sizeHeight: {
      get() {
        return this.val.height
      },
      set(newVal) {
        this.val.height = newVal
        if (this.val.ratio) {
          this.val.width = Math.floor(newVal * this.val.ratio)
        }
        this.$emit('input', this.val)
      }
    }
  },
  watch: {
    value(newVal) {
      this.val = _sizeData(newVal, this.maxWidth, this.maxHeight)
    }
  },
  methods: {
    toggleRatio() {
      if (this.val.ratio) {
        this.val.ratio = null
      } else if (this.val.width === 0 || this.val.height === 0) {
        this.val.ratio = 1.0
      } else {
        this.val.ratio = this.val.width / this.val.height
      }
      this.$emit('input', this.val)
    },
    onClickExpand() {
      if (this.val.ratio) {
        const baseH = 1
        const baseW = baseH * this.val.ratio
        const ratioX = this.maxWidth / baseW
        const ratioY = this.maxHeight / baseH
        const ratio = Math.min(ratioX, ratioY)
        this.val.width = Math.floor(baseW * ratio)
        this.val.height = Math.floor(baseH * ratio)
      } else {
        this.val.width = this.maxWidth
        this.val.height = this.maxHeight
      }
      this.$emit('input', this.val)
    },
    onClickCollapse() {
      this.val.width = this.val.srcWidth
      this.val.height = this.val.srcHeight
      if (this.val.ratio) {
        this.val.ratio = this.val.width / this.val.height
      }
      this.$emit('input', this.val)
    }
  },
  createDefault(src = null) {
    return _sizeData(src)
  }
}
</script>
