<template>
  <div class="ui-switch" :class="[
    { 'is-disabled': disabled },
    { 'is-checked': checked }
  ]" @click.prevent="switchValue">
    <span class="ui-switch__label ui-switch__label--left" v-if="inactiveText">
      <slot name="inactive">{{ inactiveText }}</slot>
    </span>
    <span class="ui-switch__core" ref="core" :style="{ 'width': coreWidth + 'px' }">
      <div class="ui-switch__button" :style="{ transform: checked ? 'translateX(' + (coreWidth - 20 - 2) + 'px)' : 'translateX(2px)' }"></div>
    </span>
    <span class="ui-switch__label ui-switch__label--right" v-if="activeText">
      <slot name="active">{{ activeText }}</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'UiSwitch',
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 40
    },
    activeText: String,
    inactiveText: String,
    activeColor: {
      type: String,
      default: '#409EFF'
    },
    inactiveColor: {
      type: String,
      default: '#C0CCDA'
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },
    name: String
  },
  computed: {
    checked() {
      return this.value === this.activeValue
    },
    coreWidth() {
      return this.width || 40
    }
  },
  watch: {
    checked() {
      this.$refs.core.style.borderColor = this.checked ? this.activeColor : this.inactiveColor
      this.$refs.core.style.backgroundColor = this.checked ? this.activeColor : this.inactiveColor
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    switchValue() {
      !this.disabled && this.$emit('input', this.checked ? this.inactiveValue : this.activeValue)
      this.$emit('change', this.checked ? this.inactiveValue : this.activeValue)
    }
  },
  mounted() {
    this.$refs.core.style.borderColor = this.checked ? this.activeColor : this.inactiveColor
    this.$refs.core.style.backgroundColor = this.checked ? this.activeColor : this.inactiveColor
  }
}
</script>

<style lang="scss" scoped>
.ui-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  height: 32px;
  vertical-align: middle;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &__label {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    height: 20px;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    vertical-align: middle;
    color: #303133;

    &--left {
      margin-right: 8px;
    }

    &--right {
      margin-left: 8px;
    }

    &.is-active {
      color: #409EFF;
    }
  }

  &__core {
    margin: 0;
    display: inline-block;
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid #DCDFE6;
    outline: none;
    border-radius: 10px;
    box-sizing: border-box;
    background: #DCDFE6;
    cursor: pointer;
    transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: middle;

    &:after {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      border-radius: 100%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 16px;
      height: 16px;
      background-color: #FFFFFF;
    }
  }

  &.is-checked {
    .ui-switch__label {
      &--left {
        color: #909399;
      }

      &--right {
        color: #409EFF;
      }
    }

    .ui-switch__core {
      border-color: #409EFF;
      background-color: #409EFF;

      &:after {
        left: 100%;
        margin-left: -18px;
      }
    }
  }

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .ui-switch__core {
      cursor: not-allowed;
    }

    .ui-switch__label {
      cursor: not-allowed;
    }
  }
}
</style> 