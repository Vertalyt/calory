<template>
  <div class="flex flex-col justify-center items-center gap-4 mb-3">


    <span class="text-5xl tracking-wider"
      >{{ countEatenKcal }} /
      <RouterLink 
      class="text-blue-400 "
      to="/bmr"> {{ calory }}</RouterLink>
      </span
    >
    

    <ProgressLine 
    :progress="progress" 
    :cheatMeal="cheatMeal"
    />

    <div 
    class="flex w-80 md:w-[450px] justify-around">

      <template
      v-for="date in calculateComponents"
      :key="date.name"
    >
      <template
      v-if="date.id !== 'energ_Kcal'"
      >
        <ProgressBlock 
      :date="date" />
      </template>


    </template>
    </div>
    <ProgressPie 
    v-if="computedData.length"
    :label="computedLabel"
    :count="computedData"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import ProgressLine from "@/components/HomePage/Progress/ProgressLine.vue";
import ProgressPie from "@/components/HomePage/Progress/ProgressPie.vue";
import ProgressBlock from "@/components/HomePage/Progress/ProgressBlock.vue";

import { useComponents } from '@/composables/updateComponents.js'
import { constRemainingCalories, remainingCalories } from '@/constants.js'


const props = defineProps({
  calory: {
    type: Number,
    required: true,
  },

  components: {
    type: Array,
    required: true,
  },
  cheatMeal: {
    type: Boolean,
    required: true,
  }
})


const computedComponents = computed( () => props.components)
const calculateComponents = useComponents(computedComponents)


const countEatenKcal = ref()


const progress = computed(() => {
  const filteredElement = calculateComponents.value.find(el => el.id === 'energ_Kcal');
  countEatenKcal.value = filteredElement ? parseFloat(filteredElement.count).toFixed(0) : 0;

  return countEatenKcal.value * 100 / remainingCalories.value
});

watch(countEatenKcal, val => {
  constRemainingCalories.value =  remainingCalories.value - val
}, { immediate: true }  )


const computedLabel = computed(() => calculateComponents.value.filter(el => el.id !== 'energ_Kcal').map(el => el.name))


const computedData = computed(() => {
const count = calculateComponents.value.filter(el => el.id !== 'energ_Kcal').map(el => {
  if(el.count !== 0) {
    return parseFloat(el.count)
  } else {
    return false
  }
}).filter(Boolean)

if (count.length === 0) {
    return []; // Возвращаем пустой массив, если нет чисел для вычисления
  }
let sum = 0;
for (let i = 0; i < count.length; i++) {
  
  sum += parseFloat(count[i]);
}
    return count.map(el => (Math.round(((parseFloat(el) / sum) * 100))))
})

</script>
