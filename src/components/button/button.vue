<template>
  <button
    :class="[
      'ui-button',
      type ? `ui-button--${type}` : '',
      size ? `ui-button--${size}` : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-round': round,
        'is-circle': circle,
        'is-plain': plain
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <i v-if="loading" class="loading"></i>
    <i v-if="icon && !loading" :class="icon"></i>
    <span v-if="$slots.default" class="ui-button__text">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  
  props: {
    type: {
      type: String,
      default: '',
      validator: value => {
        return ['','primary', 'success', 'warning', 'danger', 'info', 'text'].includes(value)
      }
    },
    size: {
      type: String,
      default: '',
      validator: value => {
        return ['','large', 'default', 'small', 'mini'].includes(value)
      }
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style lang="scss">
.ui-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFFFFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  border-radius: 4px;
  padding: 8px 20px;
  
  & + & {
    margin-left: 10px;
  }
  
  &:hover,
  &:focus {
    color: #409EFF;
    border-color: #C6E2FF;
    background-color: #ECF5FF;
  }
  
  &:active {
    color: #3A8EE6;
    border-color: #3A8EE6;
    outline: none;
  }
  
  &::-moz-focus-inner {
    border: 0;
  }
  
  & [class*="icon"] + &__text {
    margin-left: 8px;
  }
  
  &--primary {
    color: #FFFFFF;
    background-color: #409EFF;
    border-color: #409EFF;
    
    &:hover,
    &:focus {
      background: #66B1FF;
      border-color: #66B1FF;
      color: #FFFFFF;
    }
    
    &:active {
      background: #3A8EE6;
      border-color: #3A8EE6;
      color: #FFFFFF;
    }
  }
  
  &--success {
    color: #FFFFFF;
    background-color: #67C23A;
    border-color: #67C23A;
    
    &:hover,
    &:focus {
      background: #85CE61;
      border-color: #85CE61;
      color: #FFFFFF;
    }
    
    &:active {
      background: #5DAF34;
      border-color: #5DAF34;
      color: #FFFFFF;
    }
  }
  
  &--warning {
    color: #FFFFFF;
    background-color: #E6A23C;
    border-color: #E6A23C;
    
    &:hover,
    &:focus {
      background: #EBB563;
      border-color: #EBB563;
      color: #FFFFFF;
    }
    
    &:active {
      background: #CF9236;
      border-color: #CF9236;
      color: #FFFFFF;
    }
  }
  
  &--danger {
    color: #FFFFFF;
    background-color: #F56C6C;
    border-color: #F56C6C;
    
    &:hover,
    &:focus {
      background: #F78989;
      border-color: #F78989;
      color: #FFFFFF;
    }
    
    &:active {
      background: #DD6161;
      border-color: #DD6161;
      color: #FFFFFF;
    }
  }
  
  &--info {
    color: #FFFFFF;
    background-color: #909399;
    border-color: #909399;
    
    &:hover,
    &:focus {
      background: #A6A9AD;
      border-color: #A6A9AD;
      color: #FFFFFF;
    }
    
    &:active {
      background: #82848A;
      border-color: #82848A;
      color: #FFFFFF;
    }
  }
  
  &--text {
    border-color: transparent;
    color: #409EFF;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    
    &:hover,
    &:focus {
      color: #66B1FF;
      border-color: transparent;
      background-color: transparent;
    }
    
    &:active {
      color: #3A8EE6;
      border-color: transparent;
      background-color: transparent;
    }
  }
  
  &--large {
    height: 40px;
    padding: 8px 20px;
    font-size: 16px;
    border-radius: 4px;
  }
  
  &--default {
    padding: 4px 16px;
    font-size: 14px;
    border-radius: 4px;
  }
  
  &--small {
    height: 24px;
    padding: 2px 12px;
    font-size: 13px;
    border-radius: 3px;
  }
  
  &--mini {
    height: 20px;
    padding: 1px 8px;
    font-size: 12px;
    border-radius: 3px;
  }
  
  &.is-disabled {
    &.ui-button--primary,
    &.ui-button--success,
    &.ui-button--warning,
    &.ui-button--danger,
    &.ui-button--info {
      opacity: 0.6;
      cursor: not-allowed;
      background-color: #409EFF;
      border-color: #409EFF;
    }

    &.ui-button--text {
      color: #C0C4CC;
      cursor: not-allowed;
    }

    &:hover,
    &:focus {
      cursor: not-allowed;
    }
  }
  
  &.is-loading {
    position: relative;
    pointer-events: none;
    
    &:before {
      pointer-events: none;
      content: '';
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: inherit;
      background-color: rgba(255, 255, 255, 0.35);
    }
  }
  
  &.is-round {
    border-radius: 20px;
    padding: 8px 20px;
  }
  
  &.is-circle {
    border-radius: 50%;
    padding: 8px;
    width: 32px;
    height: 32px;
    
    span {
      display: inline-block;
      width: 0;
      overflow: hidden;
    }
  }
  
  &.is-plain {
    &:hover,
    &:focus {
      background: #FFFFFF;
      border-color: #409EFF;
      color: #409EFF;
    }
    
    &.ui-button--primary {
      color: #409EFF;
      background: #ECF5FF;
      border-color: #B3D8FF;

      &:hover,
      &:focus {
        background: #409EFF;
        border-color: #409EFF;
        color: #FFFFFF;
      }

      &:active {
        background: #3A8EE6;
        border-color: #3A8EE6;
        color: #FFFFFF;
      }
    }

    &.ui-button--success {
      color: #67C23A;
      background: #F0F9EB;
      border-color: #E1F3D8;

      &:hover,
      &:focus {
        background: #67C23A;
        border-color: #67C23A;
        color: #FFFFFF;
      }

      &:active {
        background: #5DAF34;
        border-color: #5DAF34;
        color: #FFFFFF;
      }
    }

    &.ui-button--warning {
      color: #E6A23C;
      background: #FCF6ED;
      border-color: #FAECD8;

      &:hover,
      &:focus {
        background: #E6A23C;
        border-color: #E6A23C;
        color: #FFFFFF;
      }

      &:active {
        background: #CF9236;
        border-color: #CF9236;
        color: #FFFFFF;
      }
    }

    &.ui-button--danger {
      color: #F56C6C;
      background: #FEF0F0;
      border-color: #FDE2E2;

      &:hover,
      &:focus {
        background: #F56C6C;
        border-color: #F56C6C;
        color: #FFFFFF;
      }

      &:active {
        background: #DD6161;
        border-color: #DD6161;
        color: #FFFFFF;
      }
    }

    &.ui-button--info {
      color: #909399;
      background: #F4F4F5;
      border-color: #E9E9EB;

      &:hover,
      &:focus {
        background: #909399;
        border-color: #909399;
        color: #FFFFFF;
      }

      &:active {
        background: #82848A;
        border-color: #82848A;
        color: #FFFFFF;
      }
    }
  }
}
</style> 