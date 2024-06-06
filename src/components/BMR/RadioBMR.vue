
<template>
          <li class="flex items-center w-full border-2 my-3 mx-0 sm:mx-2 rounded-xl border-gray-400/80">
          <div class="flex items-center ps-3 w-full">
              <slot></slot>
            <label
              :for="idValue"
              class="py-3 pl-2 text-2xl font-medium text-gray-900 w-full"
              :title="text"
              >{{ text }}
            </label>
          </div>
        </li>
</template>


<script setup>

const props = defineProps({
  idValue: {
    type:String,
    required: true
  },
  text: {
    type:String,
    required: true
  },

})


</script>

