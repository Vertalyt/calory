
<template>
<div class="w-72 bg-gray-200 h-8 rounded-xl overflow-hidden relative ">
  <div
    :style="'width:' + progress + '%'"
    class="h-full"
    :class="colorLine"
  >
  </div>
    <span :class="['absolute top-0 right-[45%] z-10 font-medium text-xl', textGray]" >{{ countRemainingCalories }}</span>
  </div>
 
</template>


<script setup>
import { computed } from 'vue'
import { textGray, constRemainingCalories } from '@/constants'



const props = defineProps({
  progress: {
    type: Number,
    required: true
  },
  cheatMeal: {
    type: Boolean,
    required: true
  }
})
const colorLine = computed(() =>  {
  if(props.cheatMeal) {
    return 'bg-cyan-400'
  } else {
    return constRemainingCalories.value > 0 ? 'bg-green-400' : 'bg-red-400'
  }
})

const countRemainingCalories = computed( () => props.cheatMeal ? '' : constRemainingCalories.value )
</script>

