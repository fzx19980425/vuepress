<template>
  <label class="ui-radio" :class="[
    { 'is-checked': model === label },
    { 'is-disabled': isDisabled }
  ]" @click.stop="handleClick">
    <span class="ui-radio__input" :class="{
      'is-checked': model === label,
      'is-disabled': isDisabled
    }">
      <span class="ui-radio__inner"></span>
      <input
        class="ui-radio__original"
        type="radio"
        :value="label"
        :disabled="isDisabled"
        @change="handleChange"
      >
    </span>
    <span class="ui-radio__label" @keydown.stop>
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'UiRadio',
  mixins: [emitter],
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
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
.ui-radio {
  color: #606266;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  outline: none;
  font-size: 14px;
  user-select: none;
  margin-right: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;

    .ui-radio__inner {
      border: 1px solid #DCDFE6;
      border-radius: 100%;
      width: 16px;
      height: 16px;
      background-color: #FFFFFF;
      position: relative;
      cursor: pointer;
      display: inline-block;
      box-sizing: border-box;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: #409EFF;
      }

      &::after {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background-color: #FFFFFF;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.15s ease-in;
      }
    }

    .ui-radio__original {
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
      .ui-radio__inner {
        border-color: #409EFF;
        background: #409EFF;

        &::after {
          transform: translate(-50%, -50%) scale(1);
        }
      }
    }

    &.is-disabled {
      cursor: not-allowed;

      .ui-radio__inner {
        background-color: #F5F7FA;
        border-color: #E4E7ED;
        cursor: not-allowed;

        &::after {
          cursor: not-allowed;
          background-color: #C0C4CC;
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
  }

  &.is-disabled {
    cursor: not-allowed;

    .ui-radio__label {
      color: #C0C4CC;
    }
  }

  &.is-checked {
    .ui-radio__label {
      color: #409EFF;
    }
  }
}
</style> 