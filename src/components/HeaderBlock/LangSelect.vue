
<template>
  <div>
   <select 
   class="border-none outline-none rounded-xl px-2 uppercase bg-cyan-800/70 font-bold h-16"
   :class="bgCyan"
   v-model="langFlag"
   >
    <option
    v-for="l in langFlags"
    :key="l"
    :value="l"
    >{{ l }}</option>
   </select>
  </div>
</template>


<script setup>
import { langFlags, lang, bgCyan } from '@/constants.js'
import { ref, watch } from 'vue'
import { Preferences } from '@capacitor/preferences';

const langFlag = ref(lang)

watch(langFlag, val => {
  lang.value = val
  setUserLang(val)
})

// Сохраняем данные
function setUserLang(val) {
  try {
    Preferences.set({
      key: 'userLang',
      value: JSON.stringify({
        userLang: val
      })
    });
} catch (error) {
    alert(error);
  }
}
</script>


