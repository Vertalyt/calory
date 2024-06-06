<template>
  <template v-for="el in els" :key="el.idType">
    <RadioBMR 
    @click="clickWrapper"
    :idValue="el.idType" :text="translate(el.val)">
    <input
      :id="el.idType"
      type="radio"
      :value="el.idType"
      :name="nameRatio"
      v-model="valueRadio"
      required
      :checked="isChecked === el.idType"
      class="w-16 h-16 m-1"
    />
  </RadioBMR>
  
  </template>


</template>

<script setup>
import { ref, watch } from 'vue'
import RadioBMR from "@/components/BMR/RadioBMR.vue";
import { translate } from '@/lang'

const emit = defineEmits(['updateRadio'])

defineProps({
  els: {
    type: Array,
    required: true
  },
  nameRatio:{
    type: String,
    required: true
  },
  isChecked: {
    type: String,
    required: false
  }
  
})


const valueRadio = ref('')

watch(valueRadio, val => {
  emit('updateRadio', val)
}  )

const clickWrapper = () => {
  emit('updateRadio', valueRadio.value)
}


</script>

