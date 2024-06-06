<template>
  <ul
    class="flex flex-col items-stretch sm:flex-row rounded-md text-sm font-medium sm:flex bg-slate-300 border-slate-400 my-4 mx-3"
    :class="{'px-3': addPadding }"
    >
    <slot></slot>
  </ul>
</template>

<script setup>
defineProps({
  addPadding: {
    type: Boolean,
    required: false,
    default: true
  },

})

</script>