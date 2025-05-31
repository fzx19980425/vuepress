<template>
  <div class="ui-input-number" :class="[
    size ? 'ui-input-number--' + size : '',
    { 'is-disabled': disabled }
  ]">
    <span class="ui-input-number__decrease" 
          :class="{ 'is-disabled': min !== undefined && value <= min }"
          @click="decrease">
      <ui-icon name="minus"></ui-icon>
    </span>
    <span class="ui-input-number__increase"
          :class="{ 'is-disabled': max !== undefined && value >= max }"
          @click="increase">
      <ui-icon name="plus"></ui-icon>
    </span>
    <ui-input
      :value="displayValue"
      :disabled="disabled"
      :size="size"
      @input="handleInput"
      @change="handleChange"
      @blur="handleBlur"
      ref="input">
    </ui-input>
  </div>
</template>

<script>
import UiInput from '../input/input.vue'

export default {
  name: 'UiInputNumber',
  components: {
    UiInput
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    stepStrictly: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: undefined
    },
    size: String,
    disabled: Boolean,
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentValue: this.value,
      userInput: null
    }
  },
  computed: {
    displayValue() {
      if (this.userInput !== null) {
        return this.userInput
      }
      let currentValue = this.currentValue
      if (typeof currentValue === 'number') {
        if (this.precision !== undefined) {
          currentValue = currentValue.toFixed(this.precision)
        }
      }
      return currentValue
    },
    minDisabled() {
      return this.min !== undefined && this.value <= this.min
    },
    maxDisabled() {
      return this.max !== undefined && this.value >= this.max
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val
        this.userInput = null
      }
    }
  },
  methods: {
    toPrecision(num) {
      if (this.precision !== undefined) {
        return Number(num.toFixed(this.precision))
      }
      return num
    },
    getPrecision(value) {
      if (value === undefined) return 0
      const valueString = value.toString()
      const dotPosition = valueString.indexOf('.')
      let precision = 0
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1
      }
      return precision
    },
    toNumber(val) {
      if (val === '') return undefined
      const number = Number(val)
      return isNaN(number) ? this.currentValue : number
    },
    increase() {
      if (this.disabled || this.maxDisabled) return
      const value = this.value || 0
      const newVal = this.toPrecision(value + this.step)
      this.setCurrentValue(newVal)
    },
    decrease() {
      if (this.disabled || this.minDisabled) return
      const value = this.value || 0
      const newVal = this.toPrecision(value - this.step)
      this.setCurrentValue(newVal)
    },
    setCurrentValue(value) {
      const oldVal = this.currentValue
      if (typeof value === 'undefined') {
        value = this.min
      }
      if (this.stepStrictly) {
        const stepPrecision = this.getPrecision(this.step)
        const precisionFactor = Math.pow(10, stepPrecision)
        value = Math.round(value / this.step) * precisionFactor / precisionFactor
      }
      if (this.min !== undefined) {
        value = Math.max(this.min, value)
      }
      if (this.max !== undefined) {
        value = Math.min(this.max, value)
      }
      this.currentValue = value
      this.userInput = null
      if (oldVal !== value) {
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    handleInput(value) {
      this.userInput = value
    },
    handleChange(value) {
      const newVal = this.toNumber(value)
      if (newVal !== undefined) {
        this.setCurrentValue(newVal)
      }
      this.userInput = null
    },
    handleBlur() {
      this.userInput = null
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-input-number {
  position: relative;
  display: inline-block;
  width: 150px;
  line-height: 32px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &.is-disabled {
    .ui-input-number__decrease,
    .ui-input-number__increase {
      border-color: #E4E7ED;
      color: #C0C4CC;
      cursor: not-allowed;
    }

    .ui-input {
      background-color: #F5F7FA;
      color: #C0C4CC;
      cursor: not-allowed;

      .ui-input__inner {
        cursor: not-allowed;
      }
    }
  }

  &--small {
    width: 130px;
    line-height: 28px;

    .ui-input {
      padding-left: 40px;
      padding-right: 40px;
    }

    .ui-input-number__decrease,
    .ui-input-number__increase {
      width: 32px;
      height: calc(100% - 2px);
      font-size: 12px;
    }
  }

  &--mini {
    width: 110px;
    line-height: 24px;

    .ui-input {
      padding-left: 32px;
      padding-right: 32px;
    }

    .ui-input-number__decrease,
    .ui-input-number__increase {
      width: 24px;
      height: calc(100% - 2px);
      font-size: 12px;
    }
  }

  .ui-input {
    display: block;
    width: 100%;
    text-align: center;
    padding-left: 48px;
    padding-right: 48px;
  }

  &__decrease,
  &__increase {
    position: absolute;
    z-index: 1;
    top: 1px;
    width: 40px;
    height: calc(100% - 2px);
    text-align: center;
    background: #F5F7FA;
    color: #606266;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #DCDFE6;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      color: #409EFF;
    }

    &.is-disabled {
      color: #C0C4CC;
      cursor: not-allowed;
    }

    .ui-icon {
      line-height: 1;
    }
  }

  &__decrease {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 0;
  }

  &__increase {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 0;
  }
}
</style>