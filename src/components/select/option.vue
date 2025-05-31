<template>
  <li class="ui-select__menu-item"
      :class="{
        'is-selected': selected,
        'is-disabled': disabled,
        'is-hover': hover,
        'is-focus': focus
      }"
      @click.stop="handleClick"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur">
    <slot>{{ label }}</slot>
  </li>
</template>

<script>
import emitter from '../../mixins/emitter'

export default {
  name: 'UiOption',
  mixins: [emitter],
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    created: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: false,
      hover: false,
      focus: false,
      index: -1
    }
  },
  computed: {
    parent() {
      let parent = this.$parent
      while (parent) {
        if (parent.$options.name === 'UiSelect') {
          return parent
        }
        parent = parent.$parent
      }
      return null
    },
    isSelected() {
      if (!this.parent) return false
      if (this.parent.multiple) {
        return this.parent.value.indexOf(this.value) > -1
      }
      return this.parent.value === this.value
    }
  },
  watch: {
    isSelected(val) {
      this.selected = val
    }
  },
  created() {
    this.parent && this.parent.options.push(this)
  },
  beforeDestroy() {
    const index = this.parent.options.indexOf(this)
    if (index > -1) {
      this.parent.options.splice(index, 1)
    }
  },
  methods: {
    handleClick() {
      if (this.disabled) return
      this.dispatch('UiSelect', 'select-option', this)
    },
    handleMouseEnter() {
      this.hover = true
      this.dispatch('UiSelect', 'hover-option', this)
    },
    handleMouseLeave() {
      this.hover = false
    },
    handleFocus() {
      this.focus = true
    },
    handleBlur() {
      this.focus = false
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-select__menu-item {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #606266;
  height: 32px;
  line-height: 32px;
  padding: 0 16px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #F5F7FA;
  }

  &.is-selected {
    color: #409EFF;
    font-weight: 500;
  }

  &.is-disabled {
    color: #C0C4CC;
    cursor: not-allowed;

    &:hover {
      background-color: #FFFFFF;
    }
  }

  &.is-hover,
  &.is-focus {
    background-color: #F5F7FA;
  }

  &.is-created {
    color: #409EFF;
  }
}
</style> 