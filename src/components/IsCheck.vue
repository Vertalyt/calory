
<template>
  <div
  @click.stop ="emit('modal-close')"
  > 
  <div class="flex flex-col justify-center items-center gap-1 w-48">
    <slot></slot>
  </div>

   <div class="flex justify-center gap-10">
    <SubmitCustom @click.stop="emit('confirm')" :text="translate('Yes')" :color="'cyan'"> </SubmitCustom>
   <SubmitCustom @click.stop="emit('modal-close')" :text="translate('No')" :color="'red'"> </SubmitCustom>
   </div>

  </div>
</template>


<script setup>
import SubmitCustom from './SubmitCustom.vue';
import { translate } from '@/lang'

const emit = defineEmits({
  'modal-close': null,
  'confirm': null
});

</script>


