
<template>
    <div
      class="absolute top-12 left-0 bg-gray-300 py-2 px-4 rounded-xl"
    >
      <span>{{ textVariantTooltip[props.status] }}</span>
    </div>
</template>

<script setup>
import { translate } from '@/lang'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const textVariantTooltip = {
 'gray': translate('WorksGreat'),
 'green': translate('WorksGreat'),
 'red': translate('getRid'),
}


</script>

