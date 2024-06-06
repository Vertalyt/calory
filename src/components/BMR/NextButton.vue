<template>
  <div
    :isDIsabled="isDisabled"
    @click.stop ="isClick"
    :class="['flex items-center  gap-2 h-16 px-3 text-white text-2xl font-semibold rounded-md shadow-lg focus:outline-none cursor-pointer', color]"
  >
    {{ translate('Next') }}
  </div>
</template>

<script setup>
import { computed }  from 'vue'
import { bgCyan } from '../../constants'
import { translate } from '@/lang'

const props = defineProps({
  isDisabled: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits({
  isSubmit: null
});

const color = computed(() => props.isDisabled === false ? 'bg-gray-400' :  bgCyan )

const isClick = () => {
  if(props.isDisabled === true) {
    emit('isSubmit')
  }
}



</script>

