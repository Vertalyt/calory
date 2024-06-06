
<template>
  <div class="flex flex-col justify-center items-center">
    <div 
    @click="emit('tooltip', status)"
    class="w-6 h-6 rounded-full bg-gray-700/80">
      <Check 
      class="w-6 h-6" 
      :class="statusColor"
      />
    </div>
    <p class="text-gray-50 font-bold" style="text-shadow: 0 0 8px black;">{{ dayRef }}</p>


  </div>
</template>


<script setup>
import Check from '@/assets/SVG/Check.vue';
import { computed, watch, ref} from "vue";
import { lang } from '@/constants.js'
import { translate } from '@/lang'


const emit = defineEmits({
  tooltip: null
})

const props = defineProps({
  status: {
    type: String,
    required: false,
    default: 'gray'
  },
  day: {
    type: String,
    required: true,
  },
})

const colorDay = {
  'gray' : 'text-gray-200',
  'green' : 'text-green-400',
  'red' : 'text-red-400',
}

const statusColor = colorDay[props.status]

const computedLang = computed( () => lang.value )
const computedData = computed( () => props.day )

const dayRef = ref()

watch(computedLang, _ => {
  dayRef.value = translate(props.day)
}, { immediate: true })



</script>
