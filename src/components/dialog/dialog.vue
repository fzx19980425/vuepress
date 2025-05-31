<template>
  <transition name="ui-dialog-fade">
    <div v-show="visible" class="ui-dialog__wrapper" @click.self="handleWrapperClick">
      <div class="ui-dialog" 
           :class="[
             `ui-dialog--${size}`,
             { 'is-center': center }
           ]"
           :style="dialogStyle">
        <!-- 头部 -->
        <div class="ui-dialog__header">
          <slot name="title">
            <span class="ui-dialog__title">{{ title }}</span>
          </slot>
          <button v-if="showClose" 
                  class="ui-dialog__headerbtn"
                  @click="handleClose">
            <ui-icon name="close"></ui-icon>
          </button>
        </div>

        <!-- 内容 -->
        <div class="ui-dialog__body">
          <slot></slot>
        </div>

        <!-- 底部 -->
        <div v-if="$slots.footer" class="ui-dialog__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'UiDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    size: {
      type: String,
      default: 'default',
      validator: value => ['large', 'default', 'small', 'mini'].includes(value)
    },
    center: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: null
    }
  },
  computed: {
    dialogStyle() {
      return {
        width: this.width
      }
    }
  },
  methods: {
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleClose()
      }
    },
    handleClose() {
      if (this.beforeClose) {
        this.beforeClose(() => {
          this.$emit('update:visible', false)
        })
      } else {
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ui-dialog__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.ui-dialog {
  position: relative;
  margin: 15vh auto 50px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  width: 50%;

  &--large {
    width: 70%;
  }

  &--small {
    width: 30%;
  }

  &--mini {
    width: 20%;
  }

  &.is-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 32px);
    max-width: calc(100% - 32px);

    .ui-dialog__body {
      text-align: center;
    }
  }

  &__header {
    padding: 24px;
    padding-bottom: 16px;
  }

  &__title {
    line-height: 32px;
    font-size: 18px;
    font-weight: 500;
    color: #303133;
  }

  &__headerbtn {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    .close {
      color: #909399;
    }

    &:focus, &:hover {
      .close {
        color: #409EFF;
      }
    }
  }

  &__body {
    padding: 24px;
    color: #606266;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-all;
  }

  &__footer {
    padding: 20px 24px 20px;
    text-align: right;
    box-sizing: border-box;
  }
}

// 动画
.ui-dialog-fade-enter-active {
  animation: ui-dialog-fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ui-dialog-fade-leave-active {
  animation: ui-dialog-fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes ui-dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes ui-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style> 