<template>
  <label class="ui-checkbox-button" :class="[
    size ? 'ui-checkbox-button--' + size : '',
    { 'is-checked': isChecked },
    { 'is-disabled': isDisabled },
    { 'is-indeterminate': indeterminate }
  ]">
    <input
      class="ui-checkbox-button__original"
      type="checkbox"
      :value="label"
      :disabled="isDisabled"
      :checked="isChecked"
      @change="handleChange"
    >
    <span class="ui-checkbox-button__inner" :style="isChecked ? activeStyle : null">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'UiCheckboxButton',
  mixins: [emitter],
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    indeterminate: Boolean,
    name: String,
    size: String
  },
  inject: {
    checkboxGroup: {
      default: ''
    }
  },
  computed: {
    model: {
      get() {
        if (this.isGroup) {
          return this.checkboxGroup.innerValue || []
        }
        return this.value !== undefined ? this.value : []
      },
      set(val) {
        if (this.isDisabled) return
        if (this.isGroup) {
          const newValue = [...(this.checkboxGroup.innerValue || [])]
          const index = newValue.indexOf(this.label)
          if (val && index === -1) {
            newValue.push(this.label)
          } else if (!val && index > -1) {
            newValue.splice(index, 1)
          }
          this.checkboxGroup.$emit('input', newValue)
          this.checkboxGroup.$emit('change', newValue)
        } else {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      }
    },
    isChecked() {
      if (this.isGroup) {
        return (this.checkboxGroup.innerValue || []).indexOf(this.label) > -1
      }
      return Array.isArray(this.model) && this.model.indexOf(this.label) > -1
    },
    isGroup() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.componentName === 'UiCheckboxGroup') {
          this._checkboxGroup = parent
          return true
        }
        parent = parent.$parent
      }
      return false
    },
    isDisabled() {
      return this.isGroup
        ? this.checkboxGroup.disabled || this.disabled
        : this.disabled
    },
    activeStyle() {
      return {
        backgroundColor: this.checkboxGroup.fill || '#409eff',
        borderColor: this.checkboxGroup.fill || '#409eff',
        boxShadow: this.checkboxGroup.fill ? `-1px 0 0 0 ${this.checkboxGroup.fill}` : '-1px 0 0 0 #409eff',
        color: this.checkboxGroup.textColor || '#ffffff'
      }
    }
  },
  methods: {
    handleChange(ev) {
      if (this.isDisabled) return
      const checked = ev.target.checked
      if (this.isGroup) {
        const newValue = [...(this.checkboxGroup.innerValue || [])]
        const index = newValue.indexOf(this.label)
        if (checked && index === -1) {
          newValue.push(this.label)
        } else if (!checked && index > -1) {
          newValue.splice(index, 1)
        }
        this.checkboxGroup.$emit('input', newValue)
        this.checkboxGroup.$emit('change', newValue)
      } else {
        const newValue = checked ? [this.label] : []
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-checkbox-button {
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
  }

  &:first-child {
    .ui-checkbox-button__inner {
      border-left: 1px solid #DCDFE6;
      border-radius: 4px 0 0 4px;
    }
  }

  &:last-child {
    .ui-checkbox-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }

  &.is-checked {
    .ui-checkbox-button__inner {
      color: #FFFFFF;
      background-color: #409EFF;
      border-color: #409EFF;
      box-shadow: -1px 0 0 0 #409EFF;
    }
  }

  &.is-disabled {
    cursor: not-allowed;

    .ui-checkbox-button__inner {
      color: #C0C4CC;
      cursor: not-allowed;
      background-color: #F5F7FA;
      border-color: #E4E7ED;
      box-shadow: none;
    }
  }
}
</style> 