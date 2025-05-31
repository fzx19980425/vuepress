<template>
  <div class="ui-select__group">
    <div class="ui-select__group-title" :class="{ 'is-disabled': disabled }">{{ label }}</div>
    <ul class="ui-select__group-list">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UiOptionGroup',
  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-select__group {
  &-title {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #909399;
    height: 32px;
    line-height: 32px;
    padding: 0 16px;

    &.is-disabled {
      color: #C0C4CC;
    }
  }

  &-list {
    margin: 0;
    padding: 0;
    list-style: none;

    .ui-select__menu-item {
      padding-left: 32px;
    }
  }
}
</style> 