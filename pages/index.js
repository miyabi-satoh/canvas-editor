import { Sketch } from 'vue-color'
import Dragable from 'vuedraggable'
import Font from '~/components/Font'
import Size from '~/components/Size'

function Color2CSS(color) {
  if (!color) {
    return '#000'
  } else if (color.a < 1) {
    return (
      'rgba(' +
      color.rgba.r +
      ',' +
      color.rgba.g +
      ',' +
      color.rgba.b +
      ',' +
      color.a +
      ')'
    )
  } else {
    return color.hex
  }
}

class Border {
  constructor(w = 0, c = null) {
    this.width = w
    this.color = { hex: '#000' }
    this.colorPicker = false
  }
}

class Shadow {
  constructor() {
    this.color = { hex: '#000' }
    this.colorPicker = false
    this.x = 0
    this.y = 0
    this.blur = 0
    this.isEnable = false
  }
}

class Layer {
  constructor(id, src = null) {
    this.id = id
    this.name = 'レイヤー' + id
    this.image = new Image()
    this.colorPicker = false
    if (src) {
      this.type = src.type
      this.x = src.x
      this.y = src.y
      this.size = Size.createDefault(src.size)
      this.shadow = JSON.parse(JSON.stringify(src.shadow))
      this.border = JSON.parse(JSON.stringify(src.border))
      this.color = JSON.parse(JSON.stringify(src.color))
      this.font = Font.createDefault(src.font)
      this.text = src.text
    } else {
      this.type = 0
      this.x = 0
      this.y = 0
      this.size = Size.createDefault()
      this.shadow = new Shadow()
      this.border = new Border()
      this.color = { hex: '#000' }
      this.font = Font.createDefault()
      this.text = ''
    }
  }

  get isRect() {
    return this.type === 0
  }

  get isCircle() {
    return this.type === 1
  }

  get isImage() {
    return this.type === 2
  }

  get isText() {
    return this.type === 3
  }

  get width() {
    return this.isText ? 0 : this.size.width
  }

  set width(val) {
    this.size.width = val
  }

  get height() {
    return this.isText ? 0 : this.size.height
  }

  set height(val) {
    this.size.height = val
  }

  get icon() {
    if (this.isCircle) {
      return this.border.width > 0 ? 'circle-outline' : 'circle'
    }
    if (this.isImage) {
      return 'image'
    }
    if (this.isText) {
      return 'format-color-text'
    }
    return this.border.width > 0 ? 'square-outline' : 'square'
  }

  get style() {
    if (this.isImage) {
      return {}
    }
    if (this.isText) {
      if (this.border.width > 0) {
        return { color: Color2CSS(this.border.color) }
      }
      return { color: Color2CSS(this.color) }
    }
    if (this.border.width > 0) {
      return {
        color: Color2CSS(this.border.color),
        backgroundColor: Color2CSS(this.color)
      }
    }
    return { color: Color2CSS(this.color) }
  }

  static get TypeNames() {
    return ['矩形', '円・楕円', '画像', 'テキスト']
  }

  get typeName() {
    return Layer.TypeNames[this.type]
  }

  get typeIcon() {
    if (this.isCircle) {
      return 'circle'
    }
    if (this.isImage) {
      return 'image'
    }
    if (this.isText) {
      return 'format-color-text'
    }
    return 'square'
  }

  render(context) {
    context.lineWidth = this.border.width
    context.strokeStyle = Color2CSS(this.border.color)
    context.fillStyle = Color2CSS(this.color)
    if (this.shadow.isEnable) {
      context.shadowColor = Color2CSS(this.shadow.color)
      context.shadowBlur = this.shadow.blur
      context.shadowOffsetX = this.shadow.x
      context.shadowOffsetY = this.shadow.y
    }
    switch (this.type) {
      case 1: {
        const radius = (this.width - this.border.width) / 2
        const radiusY = (this.height - this.border.width) / 2
        const centerX = this.x + radius + this.border.width / 2
        const centerY = this.y + radius + this.border.width / 2
        context.beginPath()
        context.scale(1, radiusY / radius)
        context.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
        context.fill()
        if (this.border.width > 0) {
          context.stroke()
        }
        break
      }
      case 2:
        if (this.image.src) {
          context.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
        break
      case 3:
        if (this.text) {
          if (this.font) {
            let font = ''
            if (this.font.italic) {
              font += 'italic '
            }
            if (this.font.bold) {
              font += 'bold '
            }
            font += this.font.size + 'px '
            if (this.font.face) {
              font += this.font.face.css
            }

            context.font = font
            context.textAlign = this.font.align
            context.textBaseline = this.font.baseline
          }
          context.fillText(this.text, this.x, this.y)
          if (this.border.width > 0) {
            context.strokeText(this.text, this.x, this.y)
          }
        }
        break
      default:
        context.fillRect(this.x, this.y, this.width, this.height)
        if (this.border.width > 0) {
          context.strokeRect(
            this.x + this.border.width / 2,
            this.y + this.border.width / 2,
            this.width - this.border.width,
            this.height - this.border.width
          )
        }
    }
  }
}

export default {
  components: {
    Sketch,
    Dragable,
    Font,
    Size
  },
  data() {
    return {
      canvasWidth: 1200,
      canvasHeight: 630,
      layers: [],
      indexLayers: -1,
      maxId: 0,
      canvasData: null,
      blobUrl: null,
      uploadedFile: null,
      linkElements: [],
      updateTimer: null
    }
  },
  computed: {
    LayerTypeNames() {
      return Layer.TypeNames
    },
    currentLayer() {
      if (typeof this.layers[this.indexLayers] !== 'undefined') {
        return this.layers[this.indexLayers]
      }
      return null
    }
  },
  watch: {
    canvasWidth(newVal) {
      this.updateCanvas()
    },
    canvasHeight(newVal) {
      this.updateCanvas()
    },
    layers: {
      deep: true,
      handler: function(to, from) {
        this.updateCanvas()
      }
    },
    uploadedFile(to, from) {
      const reader = new FileReader()
      reader.onload = e => {
        this.currentLayer.image.src = this.currentLayer.imageSrc =
          e.target.result
      }
      reader.readAsDataURL(to)
    }
  },
  mounted() {
    this.updateCanvas()
  },
  methods: {
    toggleColorPicker(obj) {
      const b = obj.colorPicker
      this.currentLayer.colorPicker = false
      this.currentLayer.border.colorPicker = false
      this.currentLayer.shadow.colorPicker = false
      obj.colorPicker = !b
    },
    Color2CSS(color) {
      return Color2CSS(color)
    },
    onClick() {
      if (this.currentLayer) {
        this.currentLayer.colorPicker = false
        this.currentLayer.border.colorPicker = false
        this.currentLayer.shadow.colorPicker = false
      }
    },
    onLoadImage(layer) {
      layer.size.srcWidth = layer.image.naturalWidth
      layer.size.srcHeight = layer.image.naturalHeight
      const ratioX = this.canvasWidth / layer.image.naturalWidth
      const ratioY = this.canvasHeight / layer.image.naturalHeight
      const ratio = Math.min(ratioX, ratioY)
      layer.width = Math.floor(layer.image.naturalWidth * ratio)
      layer.height = Math.floor(layer.image.naturalHeight * ratio)
      layer.size = Size.createDefault(layer.size)
      this.updateCanvas()
    },
    onClickDownload() {
      if (this.blobUrl) {
        URL.revokeObjectURL(this.blobUrl)
      }
      this.blobUrl = this.Base64toBlob(this.canvasData)
      const url = URL.createObjectURL(this.blobUrl)
      const a = document.createElement('a')
      a.download = 'CanvasData.png'
      a.href = url
      a.click()
    },
    onClickAdd() {
      this.maxId++
      const layer = new Layer(this.maxId)
      layer.width = this.canvasWidth
      layer.height = this.canvasHeight
      layer.image.onload = () => {
        this.onLoadImage(layer)
      }
      this.layers.push(layer)
      this.indexLayers = this.layers.length - 1
    },
    onClickEdit(index) {
      if (this.currentLayer) {
        this.currentLayer.colorPicker = false
        this.currentLayer.border.colorPicker = false
        this.currentLayer.shadow.colorPicker = false
      }
      this.indexLayers = index
    },
    onClickCopy(index) {
      this.maxId++
      const copy = new Layer(this.maxId, this.layers[index])
      copy.image.onload = () => {
        this.onLoadImage(copy)
      }
      copy.image.src = this.layers[index].image.src
      this.layers.push(copy)
      this.indexLayers = this.layers.length - 1
    },
    onClickRemove(index) {
      if (this.indexLayers === index) {
        this.indexLayers = -1
      }

      this.layers.splice(index, 1)
    },
    onClickLeft() {
      this.currentLayer.x = 0
      this.currentLayer.font.align = 'left'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    onClickCenter() {
      this.currentLayer.x = (this.canvasWidth - this.currentLayer.width) / 2
      this.currentLayer.font.align = 'center'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    onClickRight() {
      this.currentLayer.x = this.canvasWidth - this.currentLayer.width
      this.currentLayer.font.align = 'right'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    onClickTop() {
      this.currentLayer.y = 0
      this.currentLayer.font.baseline = 'top'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    onClickMiddle() {
      this.currentLayer.y = (this.canvasHeight - this.currentLayer.height) / 2
      this.currentLayer.font.baseline = 'middle'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    onClickBottom() {
      this.currentLayer.y = this.canvasHeight - this.currentLayer.height
      this.currentLayer.font.baseline = 'bottom'
      this.currentLayer.font = Font.createDefault(this.currentLayer.font)
    },
    updateCanvas() {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer)
        this.updateTimer = null
      }

      this.updateTimer = setTimeout(() => {
        // 使用するWebフォントを列挙する
        const usingFonts = []
        this.layers.forEach(layer => {
          if (layer.isText && layer.font && layer.font.face.href) {
            usingFonts.push(layer.font.face.href)
          }
        })
        // 使うものを残し、使わないものを削除する
        const newLinkElements = []
        this.linkElements.forEach(e => {
          const isFound = usingFonts.find(href => {
            return href === e.href
          })
          if (isFound) {
            newLinkElements.push(e)
          } else {
            const head = document.getElementsByTagName('head')[0]
            head.removeChild(e)
          }
        })
        // 追加されたものをロードする
        usingFonts.forEach(href => {
          const isFound = newLinkElements.find(e => {
            return e.href === href
          })
          if (!isFound) {
            const e = document.createElement('link')
            e.rel = 'stylesheet'
            e.href = href
            const head = document.getElementsByTagName('head')[0]
            head.appendChild(e)
            newLinkElements.push(e)
          }
        })
        this.linkElements = newLinkElements

        const cv = document.getElementById('canvas')
        const ctx = cv.getContext('2d')
        ctx.clearRect(0, 0, cv.width, cv.height)
        this.layers.forEach(layer => {
          ctx.save()
          layer.render(ctx)
          ctx.restore()
        })
        this.canvasData = cv.toDataURL('image/png')
        this.updateTimer = null
      }, 500)
    },
    Base64toBlob(base64) {
      const b64 = atob(base64.split(',')[1])
      const u8 = Uint8Array.from(b64.split(''), e => e.charCodeAt())
      return new Blob([u8], { type: 'image/png' })
    }
  }
}
