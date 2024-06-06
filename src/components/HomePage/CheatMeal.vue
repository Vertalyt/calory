
<template>
  <div>
    <div 
    class="flex items-center justify-center rounded-full w-16 h-16 cursor-pointer"
    :class="colorsBTN"
    >
      <StarSVG 
      class="h-8 w-8 text-blue-100 "
      />
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import StarSVG from '../../assets/SVG/StarSVG.vue';

const props = defineProps({
  isDisabled: {
    required: false,
    type: Boolean,
    default: false
  },
})

const colorsBTN = computed( () => {
  if(props.isDisabled) {
    return 'bg-cyan-500 hover:bg-cyan-600'
  } else {
    return 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
  }
} ) 



</script>

