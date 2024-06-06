<template>
  <div class="flex flex-col gap-2" @click.stop>
    <h3 class="font-bold text-lg mx-auto">
      {{ getDescription(product.desc) }}
    </h3>
    <span>{{ translate("Weight_g") }}</span>
    <input type="number" v-model="gram" />
    <div class="flex justify-between text-sm">
      {{ translate("kcal") }}:

      <span>{{ countCalory }}</span>
    </div>
    <div class="flex justify-between text-sm">
      {{ translate("remainder") }}:
      <span>{{ constRemainingCalories - countCalory }}</span>
    </div>

    <div class="flex gap-x-2 justify-center">
      <TrElement :bgColor="bgCyan" :el="translate('P')" :count="protein" />
      <TrElement :bgColor="bgLightGreen" :el="translate('L')" :count="lipid" />
      <TrElement :bgColor="bgYellow" :el="translate('C')" :count="carbohydrt" />


    </div>

    <SubmitCustom @click="add" :text="translate('Add')" :color="'cyan'">
    </SubmitCustom>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import SubmitCustom from "../SubmitCustom.vue";
import TrElement from "./TrElement.vue";

import { getUserDateObject, writeToFile, readToFile } from "@/functions";
import {
  bgCyan,
  bgLightGreen,
  bgYellow,
  foodsEatenDate,
  constRemainingCalories,
  infoComponents,
  remainingCalories,
} from "@/constants.js";
import { getDescription, translate } from "@/lang";

const emit = defineEmits({
  "modal-close": null,
});
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const gram = ref(null);

const countCalory = computed(() =>
  ((gram.value / 100) * props.product.energ_Kcal).toFixed(2)
);

const protein = computed(
  () => ((props.product.protein / 100) * gram.value).toFixed(2) || 0
);
const lipid = computed(
  () => ((props.product.lipid / 100) * gram.value).toFixed(2) || 0
);
const carbohydrt = computed(
  () => ((props.product.carbohydrt / 100) * gram.value).toFixed(2) || 0
);

onMounted(async () => {
  // есть ли запись о норме калорий
  const userInfo = await getUserDateObject("userCalory");
  if (userInfo === null) {
    router.push("/bmr");
  } else {
    // получаю данные о сьеденных калориях
    const data = await readToFile(foodsEatenDate);
    if (data) {
     // если есть, записываю в общий массив
      infoComponents.value = data;
      // высчитываю калории за сегодня
      const caloriesEaten = countCalorie(data);
      remainingCalories.value = userInfo.calory;
      // высчитываю разницу
      constRemainingCalories.value = userInfo.calory - caloriesEaten;
    } else {
      constRemainingCalories.value = userInfo.calory
    }
  }
});

function countCalorie(data) {
  let count = 0;
  data.forEach((el) => {
    const day = el.date;
    const dayWithTime = day.split(",")[0];
    const nowDay = new Date();
    const nowDayWithTime = nowDay.toISOString().split("T")[0];
    if (dayWithTime === nowDayWithTime) {
      count += Number(el.energ_Kcal);
    }
  });

  return Math.round(count);
}

const add = async () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0"); // получаем часы местного времени
  const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // получаем минуты местного времени

  const currentDateString = `${year}-${month}-${day}, ${hours}:${minutes}`;
  const random = Math.floor(Math.random() * 10000);
  const id = `${currentDate.getTime()}_${random}`;

  const addEatDate = {
    id: id,
    desc: props.product.desc,
    gram: gram.value,
    energ_Kcal: countCalory.value,
    protein: protein.value,
    lipid: lipid.value,
    carbohydrt: carbohydrt.value,
    date: currentDateString,
    totalKcal: constRemainingCalories.value,
  };

  try {
    await writeToFile([addEatDate], foodsEatenDate, true);
    // обновляю список продуктов
    infoComponents.value = await readToFile(foodsEatenDate);
    emit("modal-close");
  } catch (error) {
    console.log(error);
    emit("modal-close");
  }
};
</script>
