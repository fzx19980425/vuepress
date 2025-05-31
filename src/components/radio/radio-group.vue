<template>
  <div class="ui-radio-group" :class="[
    size ? 'ui-radio-group--' + size : ''
  ]" role="radiogroup">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'UiRadioGroup',
  provide() {
    return {
      radioGroup: this
    }
  },
  props: {
    value: {},
    disabled: Boolean,
    textColor: String,
    fill: String,
    size: {
      type: String,
      default: '',
      validator: value => ['', 'medium', 'small', 'mini'].includes(value)
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-radio-group {
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  font-size: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  &--medium {
    .ui-radio {
      margin-right: 20px;
      font-size: 14px;
    }
  }

  &--small {
    .ui-radio {
      margin-right: 15px;
      font-size: 12px;
    }
  }

  &--mini {
    .ui-radio {
      margin-right: 10px;
      font-size: 12px;
    }
  }
}
</style> 