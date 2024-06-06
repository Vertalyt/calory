<template>
  <li
    class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r"
  >
    <div class="flex items-center w-full">
      <input
        type="text"
        :id="idVal"
        class="w-full h-16 text-2xl p-2.5 m-2 border-none border-slate-800 placeholder-slate-400 text-slate-800"
        :placeholder="val"
        pattern="[0-9]{2,3}"
        :title="`${val}. Будь ласка 2-3 цифри`"
        required
        :value="modelValue"
        @input="emit('update:modelValue', $event)"
      />
    </div>
  </li>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);
defineProps({
  modelValue: {
    type: [String],
    required: true,
  },
  idVal: {
    type: String,
    required: true,
  },
  val: {
    type: String,
    required: true,
  },
});
</script>
