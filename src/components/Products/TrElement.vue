
<template>
          <div class="flex flex-col items-center">
            <span :class="['text-xs border rounded-full w-8 text-center', bgColor]">{{ el }}</span>
            <span class="text-xs">{{ count }}</span>
          </div>
</template>


<script setup>

defineProps({
  bgColor: {
    type: String,
    required: true
  },
  el: {
    type: String,
    required: true
  },
  count: {
    type: [String, Number],
    required: true
  }
})
</script>

