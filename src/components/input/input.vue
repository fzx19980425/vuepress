<template>
  <div class="ui-input" :class="[
    `ui-input--${size}`,
    {
      'is-disabled': disabled,
      'is-clearable': clearable,
      'is-prefix': prefixIcon,
      'is-suffix': suffixIcon
    }
  ]">
    <!-- 前缀图标 -->
    <ui-icon v-if="prefixIcon" :name="prefixIcon" class="ui-input__prefix-icon"></ui-icon>
    
    <!-- 输入框 -->
    <input
      ref="input"
      class="ui-input__inner"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    >
    
    <!-- 清除按钮 -->
    <ui-icon
      v-if="clearable && value"
      name="close"
      class="ui-input__clear-icon"
      @click.stop="handleClear($event)"
    ></ui-icon>
    
    <!-- 后缀图标 -->
    <ui-icon 
      v-if="suffixIcon" 
      :name="suffixIcon" 
      class="ui-input__suffix-icon"
      @click.stop="handleSuffixIconClick($event)"
    ></ui-icon>
  </div>
</template>

<script>
import UiIcon from '../icon/icon.vue'

export default {
  name: 'UiInput',
  components: {
    UiIcon
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String,
      default: 'default',
      validator: value => ['large', 'default', 'small', 'mini'].includes(value)
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleChange(event) {
      this.$emit('change', event.target.value)
    },
    handleClear(event) {
      event.stopPropagation()
      this.$emit('input', '')
      this.$emit('clear', event)
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    },
    handleSuffixIconClick(event) {
      event.stopPropagation()
      if (this.suffixIcon === 'close') {
        this.handleClear(event)
      }
      this.$emit('suffix-icon-click', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-input {
  position: relative;
  display: inline-block;
  width: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  
  &__inner {
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    height: 32px;
    line-height: 32px;
    outline: none;
    padding: 0 15px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;

    &::placeholder {
      color: #C0C4CC;
    }

    &:hover {
      border-color: #C0C4CC;
    }

    &:focus {
      border-color: #409EFF;
    }
  }

  // 尺寸
  &--large {
    .ui-input__inner {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 0 16px;
    }
  }

  &--default {
    .ui-input__inner {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      padding: 0 15px;
    }
  }

  &--small {
    .ui-input__inner {
      height: 24px;
      line-height: 24px;
      font-size: 13px;
      padding: 0 12px;
    }
  }

  &--mini {
    .ui-input__inner {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      padding: 0 8px;
    }
  }

  // 禁用状态
  &.is-disabled {
    .ui-input__inner {
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      color: #C0C4CC;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  // 可清空
  &.is-clearable {
    .ui-input__inner {
      padding-right: 32px;
    }
  }

  // 带图标
  &.is-prefix {
    .ui-input__inner {
      padding-left: 32px;
    }
  }

  &.is-suffix {
    .ui-input__inner {
      padding-right: 32px;
    }
  }

  // 图标
  &__prefix-icon,
  &__suffix-icon,
  &__clear-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #C0C4CC;
    font-size: 14px;
    cursor: pointer;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
  }

  &__prefix-icon {
    left: 8px;
  }

  &__suffix-icon {
    right: 8px;
    cursor: pointer;
    
    &:hover {
      color: #909399;
    }
  }

  &__clear-icon {
    right: 8px;

    &:hover {
      color: #909399;
    }
  }

  // 当输入框获得焦点时显示清空图标（如果有内容）
  &:hover,
  &:focus-within {
    .ui-input__clear-icon.is-visible {
      opacity: 1;
      visibility: visible;
    }
  }

  // 禁用状态下隐藏清空图标
  &.is-disabled {
    .ui-input__clear-icon {
      display: none;
    }
  }
}
</style> 