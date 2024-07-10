
<template>
  <div class="relative">
    <div 
        :class="{ 'hidden': showPopup }"
        class="absolute -left-20 top-8 bg-slate-200 border rounded-lg"
        > 
        <p class="text-sm px-2 py-1">{{ translate(text) }}</p>
    </div>
    <slot />
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { translate } from '@/lang'



const props = defineProps({
  text : {
    required: true,
    type: String
  },
  showPopup : {
    required: true,
    type: Boolean
  }

  
})



</script>



