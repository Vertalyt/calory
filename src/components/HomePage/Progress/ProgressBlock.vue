
<template>
      <div 
      class="flex flex-col py-2 px-2 min-w-20 text-white text-xs md:text-sm font-semibold rounded-md shadow-lg focus:outline-none"
      :class="date.color"
      >
        <span >{{ translate(nameBlock) }}</span>
        <span >{{ date.count }}</span>
      </div>
</template>


<script setup>
import { computed, watch, ref } from 'vue'
import { translate } from '@/lang'
import { lang } from '@/constants.js'

const props = defineProps({
  date: {
    type: Object,
    required: true
  }

})

const computedData = computed( () => props.date.name )
const computedLang = computed( () => lang.value )

const nameBlock = ref()

watch(computedLang, _ => {
  nameBlock.value = computedData.value
}, { immediate: true })

</script>


