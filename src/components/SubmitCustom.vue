
<template>
      <button 
      :type="isType"
      class="flex items-center gap-2 h-16 min-w-12 px-3 text-white text-xl font-semibold rounded-md shadow-lg focus:outline-none"
      :class="[colorBtn, isDisabledClass]"
      @click="$emit('isSubmit')"
      :disabled="isDisabled"
      >
      <slot></slot>
        {{ text }}
      </button>
</template>


<script setup>
import { bgGreen, bgGray, bgCyan, bgRed } from '../constants'


defineEmits({
  isSubmit: null
});
const props = defineProps({
  text: {
    required: true,
    type: String
  },
  color: {
    required: false,
    type: String,
    default:'none'
  },
  isType: {
    required: false,
    type: String,
    default: 'button'
  },
  isDisabled: {
    required: false,
    type: Boolean,
    default: false
  }
})

const colorsBtn={
  'cyan' : bgCyan,
  'gray' : bgGray,
  'green' : bgGreen,
  'red' : bgRed,
  'none' : 'none'
}

const colorBtn = colorsBtn[props.color]
const isDisabledClass = 'disabled:peer-focus disabled:peer-hover disabled:opacity-50 disabled:cursor-not-allowed'
</script>

