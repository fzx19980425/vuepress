<template>
  <label class="ui-radio-button" :class="[
    buttonSize ? 'ui-radio-button--' + buttonSize : '',
    { 'is-active': model === label },
    { 'is-disabled': isDisabled }
  ]" @click.stop="handleClick">
    <input
      class="ui-radio-button__original"
      type="radio"
      :value="label"
      :disabled="isDisabled"
      :checked="model === label"
      @change="handleChange"
    >
    <span class="ui-radio-button__inner" :style="model === label ? activeStyle : null">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'UiRadioButton',
  mixins: [emitter],
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    size: String
  },
  inject: {
    radioGroup: {
      default: ''
    }
  },
  computed: {
    model: {
      get() {
        return this.isGroup ? this.radioGroup.value : this.value
      },
      set(val) {
        if (this.isDisabled) return
        if (this.isGroup) {
          this.dispatch('UiRadioGroup', 'input', val)
        } else {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    buttonSize() {
      return this.radioGroup.size || this.size
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name === 'UiRadioGroup') {
          this._radioGroup = parent
          return true
        }
        parent = parent.$parent
      }
      return false
    },
    isDisabled() {
      return this.isGroup
        ? this.radioGroup.disabled || this.disabled
        : this.disabled
    },
    activeStyle() {
      return {
        backgroundColor: this.radioGroup.fill || '#409eff',
        borderColor: this.radioGroup.fill || '#409eff',
        boxShadow: this.radioGroup.fill ? `-1px 0 0 0 ${this.radioGroup.fill}` : '-1px 0 0 0 #409eff',
        color: this.radioGroup.textColor || '#ffffff'
      }
    }
  },
  methods: {
    handleClick(e) {
      if (this.isDisabled) return
      e.preventDefault()
      this.handleChange()
    },
    handleChange() {
      if (this.isDisabled) return
      const value = this.label
      if (this.isGroup) {
        this.dispatch('UiRadioGroup', 'input', value)
        this.$nextTick(() => {
          this.dispatch('UiRadioGroup', 'handleChange', value)
        })
      } else {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-radio-button {
  position: relative;
  display: inline-block;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &__original {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
  }

  &__inner {
    display: inline-block;
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-left: 0;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    height: 32px;
    line-height: 30px;
    padding: 0 16px;
    font-size: 14px;
    border-radius: 0;

    &:hover {
      color: #409EFF;
    }

    & [class*=""] {
      line-height: 0.9;

      & + span {
        margin-left: 5px;
      }
    }
  }

  &:first-child {
    .ui-radio-button__inner {
      border-left: 1px solid #DCDFE6;
      border-radius: 4px 0 0 4px;
      box-shadow: none !important;
    }
  }

  &:last-child {
    .ui-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }

  &:first-child:last-child {
    .ui-radio-button__inner {
      border-radius: 4px;
    }
  }

  &.is-active {
    .ui-radio-button__inner {
      color: #FFFFFF;
      background-color: #409EFF;
      border-color: #409EFF;
      box-shadow: -1px 0 0 0 #409EFF;
    }
  }

  &.is-disabled {
    .ui-radio-button__inner {
      color: #C0C4CC;
      cursor: not-allowed;
      background-image: none;
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      box-shadow: none;
    }
  }

  &--medium {
    .ui-radio-button__inner {
      height: 36px;
      line-height: 34px;
      padding: 0 20px;
      font-size: 14px;
    }
  }

  &--small {
    .ui-radio-button__inner {
      height: 28px;
      line-height: 26px;
      padding: 0 12px;
      font-size: 12px;
    }
  }

  &--mini {
    .ui-radio-button__inner {
      height: 24px;
      line-height: 1;
      padding: 0 8px;
      font-size: 12px;
    }
  }
}
</style> 