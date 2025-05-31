<template>
  <svg v-if="!isExternal" :class="svgClass" :style="iconStyle" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
  <i v-else :style="[styleExternalIcon, iconStyle]" class="svg-external-icon" v-on="$listeners"></i>
</template>

<script>
export default {
  name: 'UiIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    isExternal() {
      return /^(https?:|mailto:|tel:)/.test(this.name)
    },
    iconName() {
      return `#icon-${this.name}`
    },
    svgClass() {
      return ['svg-icon', this.className].filter(Boolean).join(' ')
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.name}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.name}) no-repeat 50% 50%`
      }
    },
    iconStyle() {
      if (this.size) {
        const size = typeof this.size === 'number' ? `${this.size}px` : this.size
        return {
          width: size,
          height: size
        }
      }
      return {}
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  -webkit-mask-size: cover !important;
  display: inline-block;
  vertical-align: -0.15em;
}

/* Added base style for the component */
.ui-icon {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; /* Added font family */
}
</style>
