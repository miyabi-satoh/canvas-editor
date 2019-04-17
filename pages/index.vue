<template lang="pug">
  section.section.is-size-7-touch(@click="onClick")
    canvas#canvas(
      :width="canvasWidth"
      :height="canvasHeight"
      )
    .columns
      .column
        .row
          .field.is-grouped
            label キャンバスサイズ
            p.control.has-icons-left
              input.input(type="number" min="0" max="9999" v-model.number="canvasWidth")
              b-icon.is-left(icon="arrow-expand-horizontal")
            p.control.has-icons-left
              input.input(type="number" min="0" max="9999" v-model.number="canvasHeight")
              b-icon.is-left(icon="arrow-expand-vertical")
        .preview
          img(:src="canvasData")
        .columns.is-mobile
          .column
            button.button.is-link(@click="onClickAdd")
              b-icon(icon="library-plus")
              span レイヤー追加
          .column.has-text-right
            button.button.is-link(@click="onClickDownload")
              b-icon(icon="download")
              span ダウンロード
        .columns
          .column
            Dragable.layers(v-model="layers")
              .row.is-flex(
                v-for="(layer, index) in layers"
                :key="layer.id"
                )
                span {{ layer.name }}：
                b-icon.symbol(
                  :icon="layer.icon"
                  :style="layer.style"
                  )
                span.expandable {{ layer.typeName }}
                button.button.fixed-item(
                  title="編集"
                  @click="onClickEdit(index)"
                  )
                  b-icon(icon="square-edit-outline")
                button.button.fixed-item(
                  title="コピーを作成"
                  @click="onClickCopy(index)"
                  )
                  b-icon(icon="content-duplicate")
                button.button.fixed-item(
                  title="削除"
                  @click="onClickRemove(index)"
                  )
                  b-icon(icon="delete")
      .column
        .layer-config(v-if="currentLayer")
          .field.is-horizontal
            .field-body
              .field
                label 名前
                p.control.is-expanded
                  input.input(v-model="currentLayer.name")
              .field
                label 種類
                b-select(v-model="currentLayer.type" :icon="currentLayer.typeIcon")
                  option(disabled value="")
                  option(
                    v-for="(name, index) in LayerTypeNames"
                    :key="index"
                    :value="index"
                    ) {{ name }}
          .field
            label 位置
            .field.is-horizontal
              .field-body.field-sub
                .field.is-grouped.is-narrow
                  label X
                  .field
                    p.control
                      input.input(
                        type="number"
                        min="-9999"
                        max="9999"
                        v-model.number="currentLayer.x")
                    .field.has-addons
                      button.button(@click="onClickLeft")
                        b-icon(icon="format-horizontal-align-left")
                      button.button(@click="onClickCenter")
                        b-icon(icon="format-horizontal-align-center")
                      button.button(@click="onClickRight")
                        b-icon(icon="format-horizontal-align-right")
                .field.is-grouped
                  label Y
                  .field
                    p.control
                      input.input(
                        type="number"
                        min="-9999"
                        max="9999"
                        v-model.number="currentLayer.y")
                    .field.has-addons
                      button.button(@click="onClickTop")
                        b-icon(icon="format-vertical-align-top")
                      button.button(@click="onClickMiddle")
                        b-icon(icon="format-vertical-align-center")
                      button.button(@click="onClickBottom")
                        b-icon(icon="format-vertical-align-bottom")
          Size(
            v-if="!currentLayer.isText"
            v-model="currentLayer.size"
            :max-width="canvasWidth"
            :max-height="canvasHeight")
          Font(
            v-if="currentLayer.isText"
            v-model="currentLayer.font")
          .field.is-horizontal(v-if="!currentLayer.isImage")
            .field-body
              .field.is-narrow
                label 色
                p.control.field-sub
                  button.button(
                    @click.stop="toggleColorPicker(currentLayer)")
                    span.color-sample(
                      :style="{ backgroundColor: Color2CSS(currentLayer.color) }")
              .field.is-narrow
                label 枠線
                .field.field-sub.has-addons
                  p.control
                    input.input(
                      type="number"
                      min="0"
                      max="9999"
                      v-model.number="currentLayer.border.width")
                  p.control
                    button.button(
                      @click.stop="toggleColorPicker(currentLayer.border)")
                      span.color-sample(
                        :style="{ backgroundColor: Color2CSS(currentLayer.border.color) }")
          .columns(v-if="currentLayer.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.color")
          .columns(v-if="currentLayer.border.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.border.color")
          .field.is-marginless
            .field.is-grouped
              label シャドウ
              p.control
                b-switch(v-model="currentLayer.shadow.isEnable")
            .field.is-horizontal
              .field-body.field-sub.is-wrap
                .field.is-grouped.is-narrow
                  label ぼかし
                  p.control
                    input.input(
                      :disabled="!currentLayer.shadow.isEnable"
                      type="number"
                      min="0"
                      max="999"
                      v-model.number="currentLayer.shadow.blur")
                .field.is-grouped.is-narrow
                  p.control
                    button.button(
                      :disabled="!currentLayer.shadow.isEnable"
                      @click.stop="toggleColorPicker(currentLayer.shadow)")
                      span.color-sample(
                        :style="{ backgroundColor: Color2CSS(currentLayer.shadow.color) }")
                .field.is-grouped.is-narrow
                  .field.is-grouped.is-narrow
                    label X
                    p.control
                      input.input(
                        :disabled="!currentLayer.shadow.isEnable"
                        type="number"
                        min="-999"
                        max="999"
                        v-model.number="currentLayer.shadow.x")
                  .field.is-grouped.is-narrow
                    label Y
                    p.control
                      input.input(
                        :disabled="!currentLayer.shadow.isEnable"
                        type="number"
                        min="-999"
                        max="999"
                        v-model.number="currentLayer.shadow.y")
          .columns(v-if="currentLayer.shadow.colorPicker")
            .column.has-text-centered
              .color-picker(@click.stop)
                Sketch(v-model="currentLayer.shadow.color")
          .field(v-if="currentLayer.isText")
            label テキスト
            p.control
              input.input(v-model="currentLayer.text")
          .field(v-if="currentLayer.isImage")
            b-upload(
              v-model="uploadedFile"
              accept="image/*"
              drag-drop
              )
              .content.has-text-centered
                p
                  b-icon(
                    icon="upload"
                    size="is-large"
                  )
                p.is-size-7
                  | 画像ファイルをドロップ
                  br
                  | または、クリックしてファイルを選択
</template>

<script src="./index.js"></script>
<style lang="scss" src="./index.scss"></style>
