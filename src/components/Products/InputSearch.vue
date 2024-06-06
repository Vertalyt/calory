
<template>
<div 
@click="setFocus"
class="w-full relative">
  <SearchSVG 
  class="w-5 h-5 absolute"
  :class="textGreen"
/>
  <i class="fa fa-address-book-o" aria-hidden="true"></i>
  <input 
  type="text" 
  ref="inputRef"
  :value="props.modelValue"
  :placeholder="placeholder"
  @input="emit('update:modelValue', $event.target.value)"
  >
</div>
</template>


<script setup>
import SearchSVG from '../../assets/SVG/SearchSVG.vue';
import { textGreen } from '@/constants.js'

import { ref } from 'vue';

const inputRef = ref(null);

const setFocus = () => {
  inputRef.value.focus();
}

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: false
  }
})
</script>

<style scoped>

i.fa {
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  margin-right: -26px;
  position: relative;
  z-index: 1;
  float: left;
}

i.fa + input {
  padding-left: 26px;
}
</style>

