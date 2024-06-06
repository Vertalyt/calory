
<template>
  <div>
    <h3 class="font-bold text-xl mb-5">Чіт день</h3>
    <div v-if="cheatSituation === 1">
      <p class="text-md">
        Треба щоб пройшло принаймі 6 днів гарних результатів для активація дня
        спокою.
      </p>
    </div>
    <div class="flex flex-col items-center gap-5" v-if="cheatSituation === 2">
      <p class="text-md">
        Можна активувати день Чит мілу. У цей день можна відпочити і не рахувати
        калорії. Можливо тільки якщо до цього 6 днів підрят ви винонували норму.
      </p>
      <SubmitCustom class="px-7" @click.stop="emit('confirm')" :text="translate('Yes')" :color="'cyan'"> </SubmitCustom>
    </div>
    <div v-if="cheatSituation === 3">
      <p class="text-md">
        Після останьої активації Чіт Мілу, не пройшло ще 6 днів діети.
      </p>
    </div>


  </div>
</template>


<script setup>
import { translate } from '@/lang'
import SubmitCustom from '@/components/SubmitCustom.vue';

defineProps({
  cheatSituation: {
    type: Number,
    required: true
  }
})

const emit = defineEmits({
  'confirm': null
})
</script>



