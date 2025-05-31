<template>
  <div class="ui-checkbox-group" :class="[
    size ? 'ui-checkbox-group--' + size : ''
  ]" role="group">
    <slot :size="size"></slot>
  </div>
</template>

<script>
import Emitter from '@/mixins/emitter';

export default {
  name: 'UiCheckboxGroup',
  componentName: 'UiCheckboxGroup',
  mixins: [Emitter],
  provide() {
    return {
      checkboxGroup: this
    }
  },
  props: {
    value: {
      type: [Array, String, Number, Boolean],
      required: true,
      default: () => [],
      validator(value) {
        return true
      }
    },
    disabled: Boolean,
    min: Number,
    max: Number,
    textColor: String,
    fill: String,
    size: {
      type: String,
      default: 'medium',
      validator: function(value) {
        return ['medium', 'small', 'large'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      innerValue: Array.isArray(this.value) ? this.value : (this.value !== undefined && this.value !== null ? [this.value] : [])
    }
  },
  watch: {
    value: {
      handler(value) {
        if (!Array.isArray(value)) {
          const newValue = value !== undefined && value !== null ? [value] : []
          this.innerValue = newValue
          this.$emit('input', newValue)
          return
        }
        this.innerValue = value
        this.dispatch('UiFormItem', 'form-change', [value])
      },
      immediate: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value);
    },
    validateMinMax(value) {
      if (this.min !== undefined && value.length < this.min) {
        console.warn(`[UiCheckboxGroup] 选中的数量不能小于 ${this.min}`)
      }
      if (this.max !== undefined && value.length > this.max) {
        console.warn(`[UiCheckboxGroup] 选中的数量不能大于 ${this.max}`)
      }
    }
  },
  created() {
    if (!Array.isArray(this.value)) {
      const newValue = this.value !== undefined && this.value !== null ? [this.value] : []
      this.innerValue = newValue
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-checkbox-group {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-size: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &--medium {
    :deep(.ui-checkbox-button) {
      .ui-checkbox-button__inner {
        height: 36px;
        line-height: 34px;
        font-size: 14px;
        padding: 0 20px;
      }
    }
  }

  &--small {
    :deep(.ui-checkbox-button) {
      .ui-checkbox-button__inner {
        height: 28px;
        line-height: 26px;
        font-size: 12px;
        padding: 0 12px;
      }
    }
  }

  &--large {
    :deep(.ui-checkbox-button) {
      .ui-checkbox-button__inner {
        height: 40px;
        line-height: 38px;
        font-size: 16px;
        padding: 0 24px;
      }
    }
  }
}
</style> 