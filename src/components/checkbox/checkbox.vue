<template>
  <label class="ui-checkbox" :class="[
    { 'is-checked': isChecked },
    { 'is-disabled': isDisabled },
    { 'is-indeterminate': indeterminate }
  ]" @click.stop="handleClick">
    <span class="ui-checkbox__input" :class="{
      'is-checked': isChecked,
      'is-disabled': isDisabled,
      'is-indeterminate': indeterminate
    }">
      <span class="ui-checkbox__inner"></span>
      <input
        class="ui-checkbox__original"
        type="checkbox"
        :value="label"
        :disabled="isDisabled"
        :checked="isChecked"
        @change="handleChange"
      >
    </span>
    <span class="ui-checkbox__label" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'UiCheckbox',
  mixins: [emitter],
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    indeterminate: Boolean,
    name: String,
    border: Boolean,
    size: String
  },
  inject: {
    checkboxGroup: {
      default: ''
    }
  },
  data() {
    return {
      selfModel: false,
      focus: false
    }
  },
  computed: {
    model: {
      get() {
        if (this.isGroup) {
          return this.checkboxGroup.innerValue || []
        }
        return this.value !== undefined ? this.value : this.selfModel
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
          this.selfModel = val
        }
      }
    },
    isChecked() {
      if (this.isGroup) {
        return (this.checkboxGroup.innerValue || []).indexOf(this.label) > -1
      }
      return this.model === true || (Array.isArray(this.model) && this.model.indexOf(this.label) > -1)
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
    }
  },
  methods: {
    handleClick(e) {
      if (this.isDisabled) return
      e.preventDefault()
      const checked = !this.isChecked
      this.handleChange({ target: { checked } })
    },
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
        this.$emit('input', checked)
        this.$emit('change', checked)
        this.selfModel = checked
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-checkbox {
  color: #606266;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  margin-right: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    position: relative;
    vertical-align: middle;

    .ui-checkbox__inner {
      display: inline-block;
      position: relative;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      background-color: #FFFFFF;
      z-index: 1;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: #409EFF;
      }

      &::after {
        box-sizing: content-box;
        content: "";
        border: 2px solid #FFFFFF;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        transition: transform 0.15s ease-in 0.05s;
        transform-origin: center;
      }
    }

    .ui-checkbox__original {
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

    &.is-checked {
      .ui-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;

        &::after {
          transform: rotate(45deg) scaleY(1);
        }
      }
    }

    &.is-indeterminate {
      .ui-checkbox__inner {
        background-color: #409EFF;
        border-color: #409EFF;

        &::after {
          content: '';
          position: absolute;
          display: block;
          background-color: #FFFFFF;
          height: 1px;
          width: 8px;
          left: 2px;
          right: 4px;
          top: 6px;
          transform: none;
        }
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      .ui-checkbox__inner {
        background-color: #F5F7FA;
        border-color: #E4E7ED;
        cursor: not-allowed;

        &::after {
          cursor: not-allowed;
          border-color: #C0C4CC;
        }

        &:hover {
          border-color: #E4E7ED;
        }
      }
    }
  }

  &__label {
    font-size: 14px;
    padding-left: 8px;
    line-height: 1;
  }

  &.is-disabled {
    cursor: not-allowed;

    .ui-checkbox__label {
      color: #C0C4CC;
    }
  }

  &.is-checked {
    .ui-checkbox__label {
      color: #409EFF;
    }
  }
}
</style> 