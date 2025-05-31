<template>
  <div class="ui-select" :class="[
    size ? 'ui-select--' + size : '',
    { 'is-disabled': disabled },
    { 'is-focus': visible },
    { 'is-top': placement === 'top' },
    { 'is-loading': loading }
  ]" @click.stop="toggleMenu">
    <div class="ui-select__tags" v-if="multiple" ref="tags">
      <span v-for="(item, index) in selected" :key="index"
            class="ui-tag ui-tag--info ui-tag--small"
            :closable="!disabled"
            @click.stop="deleteTag(index)">
        <span class="ui-tag__text">{{ item.label }}</span>
        <ui-icon name="close" class="ui-tag__close" v-if="!disabled" @click.stop="deleteTag(index)"></ui-icon>
      </span>
      <input type="text"
             class="ui-select__input"
             :disabled="disabled"
             :readonly="readonly"
             :value="inputValue"
             :placeholder="placeholder"
             @input="handleInput"
             @keydown.delete.stop="handleDelete"
             @keydown.enter.prevent="handleEnter"
             @keydown.esc.stop.prevent="visible = false"
             @keydown.up.prevent="navigateOptions('prev')"
             @keydown.down.prevent="navigateOptions('next')"
             ref="input">
    </div>
    <ui-input
      v-else
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="!filterable"
      :value="filterable ? inputValue : selectedLabel"
      :size="size"
      @click.native.stop="toggleMenu"
      @input="handleInput"
      @change="handleChange"
      @keydown.native.delete.stop="handleDelete"
      @keydown.native.enter.prevent="handleEnter"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.down.prevent="navigateOptions('next')"
      ref="input">
      <!-- Loading prefix icon -->
      <template v-if="loading" slot="prefix">
        <ui-icon name="loading" class="is-loading"></ui-icon>
      </template>
    </ui-input>
    <!-- Suffix icon handled directly in UiSelect -->
    <ui-icon
      :name="suffixIconName"
      :class="[ 'ui-select__suffix-icon', { 'is-reverse': visible }, { 'is-clearable': clearable && selectedLabel && !disabled } ]"
      @click.stop="handleSuffixIconClick">
    </ui-icon>
    <div class="ui-select__popper" v-show="visible" ref="popper" :style="popperStyle">
      <div v-if="loading" class="ui-select__loading">
        <ui-icon name="loading" class="is-loading"></ui-icon>
        <span>加载中...</span>
      </div>
      <template v-else>
        <slot></slot>
        <ul v-if="!$slots.default" class="ui-select__menu">
          <li v-for="(item, index) in filteredOptions"
              :key="index"
              :class="[
                'ui-select__menu-item',
                { 'is-selected': isSelected(item) },
                { 'is-disabled': item.disabled },
                { 'is-hover': hoverIndex === index }
              ]"
              @click.stop="selectOption(item)"
              @mouseenter="hoverIndex = index">
            {{ item.label }}
          </li>
          <li v-if="filteredOptions.length === 0" class="ui-select__menu-item is-disabled">
            {{ noDataText }}
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import emitter from '../../mixins/emitter'
import UiInput from '../input/input.vue'
import debounce from 'lodash/debounce'

export default {
  name: 'UiSelect',
  components: {
    UiInput
  },
  mixins: [emitter],
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: Boolean,
    readonly: Boolean,
    size: String,
    multiple: Boolean,
    filterable: Boolean,
    clearable: Boolean,
    loading: Boolean,
    remote: Boolean,
    remoteMethod: Function,
    noDataText: {
      type: String,
      default: '无数据'
    },
    name: String,
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      selected: [],
      inputValue: '',
      hoverIndex: -1,
      placement: 'bottom',
      popperStyle: {
        position: 'fixed',
        zIndex: '2000'
      }
    }
  },
  computed: {
    selectedLabel() {
      if (this.multiple) return ''
      const selected = this.selected[0]
      return selected ? selected.label : ''
    },
    filteredOptions() {
      if (!this.filterable || !this.inputValue) {
        return this.options
      }
      const inputValue = this.inputValue.toLowerCase()
      return this.options.filter(option => {
        return option.label.toLowerCase().indexOf(inputValue) > -1
      })
    },
    suffixIconName() {
      console.log('suffixIconName computed', {
        clearable: this.clearable,
        selectedLabel: this.selectedLabel,
        disabled: this.disabled,
        name: (this.clearable && this.selectedLabel && !this.disabled) ? 'close' : 'arrow-down'
      });
      if (this.clearable && this.selectedLabel && !this.disabled) {
        return 'close';
      } else {
        return 'arrow-down';
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.setSelected()
      }
    },
    options: {
      immediate: true,
      handler() {
        this.setSelected()
      }
    },
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.updatePopperPlacement()
          this.scrollToOption()
        })
      } else {
        this.inputValue = ''
        this.hoverIndex = -1
      }
    }
  },
  created() {
    if (this.remote && this.remoteMethod) {
      this.debouncedRemoteMethod = debounce(this.remoteMethod, 300)
    }
  },
  mounted() {
    document.addEventListener('click', this.handleDocumentClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
  },
  methods: {
    setSelected() {
      if (this.multiple) {
        this.selected = this.options.filter(option => {
          return this.value.indexOf(option.value) > -1
        })
      } else {
        this.selected = this.options.filter(option => {
          return option.value === this.value
        })
      }
    },
    isSelected(option) {
      if (this.multiple) {
        return this.value.indexOf(option.value) > -1
      }
      return option.value === this.value
    },
    selectOption(option) {
      if (option.disabled) return
      if (this.multiple) {
        const index = this.value.indexOf(option.value)
        if (index > -1) {
          const newValue = [...this.value]
          newValue.splice(index, 1)
          this.$emit('input', newValue)
        } else {
          this.$emit('input', [...this.value, option.value])
        }
      } else {
        this.$emit('input', option.value)
        this.visible = false
      }
      this.$emit('change', this.multiple ? this.value : option.value)
    },
    deleteTag(index) {
      const newValue = [...this.value]
      newValue.splice(index, 1)
      this.$emit('input', newValue)
      this.$emit('change', newValue)
    },
    handleInput(e) {
      const value = e.target.value
      this.inputValue = value
      if (this.filterable) {
        this.visible = true
        if (this.remote && this.remoteMethod) {
          this.debouncedRemoteMethod(value)
        }
      }
    },
    handleChange(e) {
      this.$emit('change', this.value)
    },
    handleDelete() {
      if (this.multiple && this.value.length > 0) {
        const newValue = [...this.value]
        newValue.pop()
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    },
    handleEnter() {
      if (this.hoverIndex > -1) {
        this.selectOption(this.filteredOptions[this.hoverIndex])
      }
    },
    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true
        return
      }
      const options = this.filteredOptions
      if (options.length === 0) return
      if (direction === 'next') {
        this.hoverIndex = this.hoverIndex < options.length - 1 ? this.hoverIndex + 1 : 0
      } else {
        this.hoverIndex = this.hoverIndex > 0 ? this.hoverIndex - 1 : options.length - 1
      }
      this.scrollToOption()
    },
    scrollToOption() {
      this.$nextTick(() => {
        const menu = this.$refs.popper.querySelector('.ui-select__menu')
        if (!menu) return
        const hoverOption = menu.querySelector('.is-hover')
        if (hoverOption) {
          const menuScrollTop = menu.scrollTop
          const menuHeight = menu.offsetHeight
          const hoverOptionTop = hoverOption.offsetTop
          const hoverOptionHeight = hoverOption.offsetHeight
          if (hoverOptionTop < menuScrollTop) {
            menu.scrollTop = hoverOptionTop
          } else if (hoverOptionTop + hoverOptionHeight > menuScrollTop + menuHeight) {
            menu.scrollTop = hoverOptionTop + hoverOptionHeight - menuHeight
          }
        }
      })
    },
    toggleMenu() {
      if (this.disabled || this.readonly) return
      this.visible = !this.visible
      if (this.visible) {
        this.$nextTick(() => {
          if (this.filterable) {
            this.$refs.input.focus()
          }
        })
      }
    },
    handleDocumentClick(e) {
      if (this.$refs.popper && this.$el) {
        if (!this.$refs.popper.contains(e.target) && !this.$el.contains(e.target)) {
          this.visible = false
        }
      }
    },
    updatePopperPlacement() {
      // Get the correct input element based on multiple mode
      const targetElement = this.multiple ? this.$el : this.$refs.input.$el;

      if (!targetElement) return; // Add a check just in case

      const targetRect = targetElement.getBoundingClientRect();
      const popperEl = this.$refs.popper;
      if (!popperEl) return;

      // 设置面板宽度与输入框一致
      popperEl.style.width = targetRect.width + 'px';

      // 计算面板位置
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - targetRect.bottom;
      const spaceAbove = targetRect.top;
      const popperHeight = popperEl.offsetHeight;

      if (spaceBelow < popperHeight && spaceAbove > spaceBelow) {
        // 空间不足，向上弹出
        this.placement = 'top';
        popperEl.style.top = targetRect.top - popperHeight - 8 + 'px'; // 8px 为间距
        popperEl.style.left = targetRect.left + 'px';
      } else {
        // 向下弹出
        this.placement = 'bottom';
        popperEl.style.top = targetRect.bottom + 8 + 'px'; // 8px 为间距
        popperEl.style.left = targetRect.left + 'px';
      }
    },
    handleClear() {
      // 内部清除逻辑，外部通过 suffixIconName 判断是否显示清除图标
      this.$emit('input', this.multiple ? [] : '');
      this.$emit('change', this.multiple ? [] : '');
      this.$emit('clear');
      if (!this.multiple) {
        this.visible = false;
      }
    },
    handleSuffixIconClick(e) {
      // 如果当前显示的是清除图标，则执行清除操作
      if (this.suffixIconName === 'close') {
        e.stopPropagation(); // 阻止事件冒泡，避免触发 toggleMenu
        this.handleClear();
      } else {
        // 如果当前显示的是箭头图标，则执行切换菜单的操作
        this.toggleMenu(e); // 调用 toggleMenu 方法
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-select {
  position: relative;
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  width: 220px;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &.is-focus {
    .ui-input__inner {
      border-color: #409EFF;
    }
  }

  &.is-loading {
    .ui-input__inner {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath fill='%23C0C4CC' d='M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0l135.744 135.744a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0l135.744 135.744a32 32 0 0 1-45.248 45.248L647.744 692.544a32 32 0 0 1 0-45.248zM828.8 195.2a32 32 0 0 1 0 45.248L692.544 376.192a32 32 0 0 1-45.248-45.248L783.552 195.2a32 32 0 0 1 45.248 0zm-452.544 452.544a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248L331.008 692.544a32 32 0 0 1 45.248 0z'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 16px;
    }
  }

  &--large {
    width: 240px;
    .ui-select__suffix-icon {
      right: 8px;
      font-size: 16px;
    }
    .ui-select__tags {
      padding: 0 34px 0 12px;
    }
    ::v-deep .ui-input__inner,
    .ui-select__tags {
      padding: 0 34px 0 12px;
    }
  }

  &--default {
    width: 220px;  // 修改为与默认尺寸一致
    .ui-select__suffix-icon {
      right: 6px;
      font-size: 14px;
    }
    .ui-select__tags {
      padding: 0 28px 0 8px;
    }
    ::v-deep .ui-input__inner,
    .ui-select__tags {
      padding: 0 28px 0 8px;
    }
  }

  &--small {
    width: 180px;
    .ui-select__suffix-icon {
      right: 4px;
      font-size: 12px;
    }
    .ui-select__tags {
      padding: 0 22px 0 6px;
    }
    ::v-deep .ui-input__inner,
    .ui-select__tags {
      padding: 0 22px 0 6px;
    }
  }

  &--mini {
    width: 160px;
    .ui-select__suffix-icon {
      right: 3px;
      font-size: 12px;
    }
    .ui-select__tags {
      padding: 0 20px 0 4px;
    }
    ::v-deep .ui-input__inner,
    .ui-select__tags {
      padding: 0 20px 0 4px;
    }
  }

  &__clear {
    font-size: 16px;
    color: #C0C4CC;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-right: 8px;

    &:hover {
      color: #909399;
    }
  }

  &__arrow {
    font-size: 16px;
    color: #C0C4CC;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-right: 8px;

    &.is-reverse {
      transform: rotate(180deg);
    }
  }

  &__loading {
    padding: 12px 0;
    text-align: center;
    color: #909399;
    font-size: 14px;

    .ui-icon {
      margin-right: 8px;
      animation: rotating 2s linear infinite;
    }
  }

  &__tags {
    border-radius: 4px;
    width: 100%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #C0C4CC;
    }
  }

  &__popper {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &__menu-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.ui-select__tags {
  min-height: 32px;
  padding: 0 12px;
  background-color: #FFFFFF;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #C0C4CC;
  }

  .ui-tag {
    margin: 2px 0;
    max-width: calc(100% - 8px);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
  }

  .ui-select__input {
    flex: 1;
    min-width: 60px;
    height: 20px;
    line-height: 20px;
    padding: 0;
    margin: 2px 0;
    border: none;
    outline: none;
    font-size: 14px;
    color: #606266;
    background-color: transparent;

    &::placeholder {
      color: #C0C4CC;
    }
  }
}

.ui-select__popper {
  position: absolute;
  top: 100%;
  z-index: 2000;
  background: #FFFFFF;
  border: 1px solid #E4E7ED;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  width: 100%;
  max-height: 274px;
  overflow-y: auto;

  &.is-top {
    top: auto;
    bottom: 100%;
    margin-top: 0;
    margin-bottom: 4px;
  }
}

.ui-select__menu {
  margin: 0;
  padding: 4px 0;
  list-style: none;

  &-item {
    font-size: 14px;
    padding: 0 16px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 32px;
    line-height: 32px;
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

    &.is-hover {
      background-color: #F5F7FA;
    }
  }
}

.ui-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  line-height: 1;
  padding: 0 8px;
  font-size: 12px;
  color: #409EFF;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: #ECF5FF;
  border: 1px solid #D9ECFF;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #D9ECFF;
  }

  &__text {
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    color: #409EFF;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: #409EFF;
      color: #FFFFFF;
    }
  }

  &--small {
    height: 20px;
    line-height: 18px;
    padding: 0 6px;
    font-size: 12px;

    .ui-tag__close {
      width: 14px;
      height: 14px;
      margin-left: 2px;
    }
  }

  &--info {
    background-color: #F4F4F5;
    border-color: #E9E9EB;
    color: #909399;

    .ui-tag__close {
      color: #909399;

      &:hover {
        background-color: #909399;
        color: #FFFFFF;
      }
    }
  }
}

// New style for suffix icon directly in UiSelect
.ui-select__suffix-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px; /* Adjust as needed for padding */
  color: #C0C4CC; /* Default color */
  font-size: 14px; /* Adjust size as needed */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2; /* Ensure it's above the input */

  &.is-reverse {
    transform: translateY(-50%) rotate(180deg);
  }

  &.is-clearable {
    &:hover {
      color: #909399; /* Hover color for clear icon */
    }
  }
}

// Ensure text doesn't overflow into icon area
.ui-input__inner {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style> 