<script setup>
import ProgressDay from "@/components/HomePage/Progress/ProgressDay.vue";
import HeaderTooltip from "./HeaderTooltip.vue";

import { ref} from "vue";

import { addDate, calorieCountingPerDay } from "@/functions.js";


const props = defineProps({
  startWeek: {
    type: String,
    required: true,
  },
  activities: {
    type: Array,
    required: true,
  },
  remainingCalories: {
    type: [Number],
    required: true,
  },
});

const weekProgress = ref([
  { status: "grey", day: "Mon", data: "", energ_Kcal: 0 },
  { status: "grey", day: "Tue", data: "", energ_Kcal: 0 },
  { status: "grey", day: "Wed", data: "", energ_Kcal: 0 },
  { status: "grey", day: "Thu", data: "", energ_Kcal: 0 },
  { status: "gray", day: "Fri", data: "", energ_Kcal: 0 },
  { status: "gray", day: "Sat", data: "", energ_Kcal: 0 },
  { status: "gray", day: "Sun", data: "", energ_Kcal: 0 },
]);



const isTooltip = ref(false);
const statusTextTooltip = ref("");

let interval;
const isOpenTooltip = (status) => {
  statusTextTooltip.value = status;
  isTooltip.value = true;

  if (interval) {
    clearTimeout(interval);
  }

  interval = setTimeout(() => {
    isTooltip.value = false;
  }, 2000);
};

// Начальная дата текущей недели
const startOfWeek = ref(new Date(props.startWeek));

// Добавляем дату в массив для каждого дня недели
weekProgress.value = addDate(weekProgress.value, startOfWeek.value);

weekProgress.value = calorieCountingPerDay({
  activities: props.activities,
  startOfWeek: startOfWeek.value,
  weekProgress: weekProgress.value,
});

weekProgress.value = weekProgress.value.map(el => {
  const calory =  el.totalKcal ? el.totalKcal : props.remainingCalories
  return {
    ...el,
  status: el.energ_Kcal === 0 ? 'gray' : 
  (el.energ_Kcal < calory ? 'green' : 'red')
  }
});

</script>

<template>
  <div class="flex justify-around w-64 relative">
    <div v-for="({ status, day }, idx) in weekProgress">
      <ProgressDay
        :key="idx"
        :status="status"
        :day="day"
        :isTooltip="isTooltip"
        @tooltip="isOpenTooltip"
      />
    </div>

    <HeaderTooltip v-if="isTooltip" :status="statusTextTooltip" />
  </div>
</template>
