<template lang="pug">
  .field.is-grouped.is-wrap
    .field
      label フォント
      .field.has-addons
        b-select(v-model="fontFace")
          option(disabled value="")
          option(
            v-for="(font, index) in fontList"
            :key="index"
            :value="font"
            ) {{ font.name }}
        p.control
          button.button(
            @click="onClickBold"
            :class="val.bold ? 'is-success' : ''")
            b-icon(icon="format-bold")
        p.control
          button.button(
            @click="onClickItalic"
            :class="val.italic ? 'is-success' : ''")
            b-icon(icon="format-italic")
    .field
      label サイズ
      p.control
        input.input(
          type="number"
          min="0"
          max="999"
          v-model.number="fontSize")
    .field
      label 配置
      .field.is-horizontal
        .field-body.field-sub
          .field.is-grouped.is-narrow
            label X
            b-select(v-model="fontAlign")
              option(disabled value="")
              option(value="start") start
              option(value="end") end
              option(value="left") left
              option(value="right") right
              option(value="center") center
          .field.is-grouped.is-narrow
            label Y
            b-select(v-model="fontBaseline")
              option(disabled value="")
              option(value="top") top
              option(value="hanging") hanging
              option(value="middle") middle
              option(value="alphabetic") alphabetic
              option(value="ideographic") ideographic
              option(value="bottom") bottom
</template>

<script>
const _fontList = [
  { name: 'arial', css: '"arial"' },
  { name: 'arial black', css: '"arial black"' },
  { name: 'arial narrow', css: '"arial narrow"' },
  { name: 'arial unicode ms', css: '"arial unicode ms"' },
  { name: 'Comic Sans MS', css: '"Comic Sans MS"' },
  { name: 'Courier', css: '"Courier"' },
  { name: 'Courier New', css: '"Courier New"' },
  { name: 'fantasy', css: '"fantasy"' },
  { name: 'Georgia', css: '"Georgia"' },
  { name: 'Impact', css: '"Impact"' },
  { name: 'Meiryo UI', css: '"Meiryo UI"' },
  { name: 'Microsoft Sans Serif', css: '"Microsoft Sans Serif"' },
  { name: 'MS UI Gothic', css: '"MS UI Gothic"' },
  { name: 'monospace', css: '"monospace"' },
  { name: 'Osaka', css: '"Osaka"' },
  { name: 'Osaka－等幅', css: '"Osaka－等幅","Osaka-Mono"' },
  { name: 'sans-serif', css: '"sans-serif"' },
  { name: 'serif', css: '"serif"' },
  { name: 'Tahoma', css: '"Tahoma"' },
  { name: 'Times New Roman', css: '"Times New Roman"' },
  { name: 'Verdana', css: '"Verdana"' },
  { name: 'ＭＳ Ｐゴシック', css: '"ＭＳ Ｐゴシック","MS PGothic"' },
  { name: 'ＭＳ ゴシック', css: '"ＭＳ ゴシック","MS Gothic"' },
  { name: 'ＭＳ Ｐ明朝', css: '"ＭＳ Ｐ明朝","MS PMincho"' },
  { name: 'ＭＳ 明朝', css: '"ＭＳ 明朝","MS Mincho"' },
  {
    name: 'ヒラギノ角ゴ Pro W3',
    css: '"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro"'
  },
  {
    name: 'ヒラギノ角ゴ ProN W3',
    css: '"ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN"'
  },
  {
    name: 'ヒラギノ角ゴ Pro W6',
    css: '"ヒラギノ角ゴ Pro W6","HiraKakuPro-W6"'
  },
  {
    name: 'ヒラギノ角ゴ ProN W6',
    css: '"ヒラギノ角ゴ ProN W6","HiraKakuProN-W6"'
  },
  {
    name: 'ヒラギノ角ゴ Std W8',
    css: '"ヒラギノ角ゴ Std W8","Hiragino Kaku Gothic Std"'
  },
  {
    name: 'ヒラギノ角ゴ StdN W8',
    css: '"ヒラギノ角ゴ StdN W8","Hiragino Kaku Gothic StdN"'
  },
  {
    name: 'ヒラギノ丸ゴ Pro W4',
    css: '"ヒラギノ丸ゴ Pro W4","Hiragino Maru Gothic Pro"'
  },
  {
    name: 'ヒラギノ丸ゴ ProN W4',
    css: '"ヒラギノ丸ゴ ProN W4","Hiragino Maru Gothic ProN"'
  },
  {
    name: 'ヒラギノ明朝 Pro W3',
    css: '"ヒラギノ明朝 Pro W3","Hiragino Mincho Pro"'
  },
  {
    name: 'ヒラギノ明朝 ProN W3',
    css: '"ヒラギノ明朝 ProN W3","Hiragino Mincho ProN"'
  },
  {
    name: 'ヒラギノ明朝 Pro W6',
    css: '"ヒラギノ明朝 Pro W6","HiraMinPro-W6"'
  },
  {
    name: 'ヒラギノ明朝 ProN W6',
    css: '"ヒラギノ明朝 ProN W6","HiraMinProN-W6"'
  },
  { name: 'メイリオ', css: '"メイリオ","Meiryo"' },
  {
    name: '游ゴシック',
    css: '"游ゴシック","Yu Gothic","游ゴシック体","YuGothic"'
  },
  { name: '游明朝', css: '"游明朝","Yu Mincho","游明朝体","YuMincho"' },
  {
    name: 'M PLUS 1p',
    css: '"M PLUS 1p"',
    href: 'https://fonts.googleapis.com/css?family=M+PLUS+1p'
  },
  {
    name: 'M PLUS Rounded 1c',
    css: '"M PLUS Rounded 1c"',
    href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c'
  },
  {
    name: 'はんなり明朝',
    css: '"Hannari"',
    href: 'https://fonts.googleapis.com/earlyaccess/hannari.css'
  },
  {
    name: 'こころ明朝',
    css: 'Kokoro',
    href: 'https://fonts.googleapis.com/earlyaccess/kokoro.css'
  },
  {
    name: 'さわらび明朝',
    css: '"Sawarabi Mincho"',
    href: 'https://fonts.googleapis.com/css?family=Sawarabi+Mincho'
  },
  {
    name: 'さわらびゴシック',
    css: '"Sawarabi Gothic"',
    href: 'https://fonts.googleapis.com/css?family=Sawarabi+Gothic'
  },
  {
    name: 'ニクキュウ',
    css: '"Nikukyu"',
    href: 'https://fonts.googleapis.com/earlyaccess/nikukyu.css'
  },
  {
    name: 'ニコモジ',
    css: '"Nico Moji"',
    href: 'https://fonts.googleapis.com/earlyaccess/nicomoji.css'
  },
  {
    name: 'Noto Sans JP',
    css: '"Noto Sans JP"',
    href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP'
  }
]

function _fontData(data) {
  let face = ''
  if (data && typeof data.face !== 'undefined') {
    face = data.face
  }

  let bold = false
  if (data && typeof data.bold !== 'undefined') {
    bold = data.bold
  }

  let italic = false
  if (data && typeof data.italic !== 'undefined') {
    italic = data.italic
  }

  let size = 50
  if (data && typeof data.size !== 'undefined') {
    size = data.size
  }

  let align = 'left'
  if (data && typeof data.align !== 'undefined') {
    align = data.align
  }

  let baseline = 'top'
  if (data && typeof data.baseline !== 'undefined') {
    baseline = data.baseline
  }

  return {
    face: face,
    bold: bold,
    italic: italic,
    size: size,
    align: align,
    baseline: baseline
  }
}

export default {
  name: 'Font',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      val: _fontData(this.value)
    }
  },
  computed: {
    fontList() {
      return _fontList
    },
    fontFace: {
      get() {
        return this.val.face
      },
      set(newVal) {
        this.val.face = newVal
        this.$emit('input', this.val)
      }
    },
    fontSize: {
      get() {
        return this.val.size
      },
      set(newVal) {
        this.val.size = newVal
        this.$emit('input', this.val)
      }
    },
    fontAlign: {
      get() {
        return this.val.align
      },
      set(newVal) {
        this.val.align = newVal
        this.$emit('input', this.val)
      }
    },
    fontBaseline: {
      get() {
        return this.val.baseline
      },
      set(newVal) {
        this.val.baseline = newVal
        this.$emit('input', this.val)
      }
    }
  },
  watch: {
    value(newVal) {
      this.val = _fontData(newVal)
    }
  },
  methods: {
    onClickBold() {
      this.val.bold = !this.val.bold
      this.$emit('input', this.val)
    },
    onClickItalic() {
      this.val.italic = !this.val.italic
      this.$emit('input', this.val)
    }
  },
  createDefault(src) {
    return _fontData(src)
  }
}
</script>
