<template>
  <div class="flex flex-col text-center justify-center items-center">
    <div class="flex flex-col items-center md:flex-row gap-0 md:gap-5">
      <div class="flex items-center gap-5">
        <ProgressWeek
          v-if="startDate && remainingCalories"
          :startWeek="startDate"
          :activities="arrWeekActivities"
          :remainingCalories="remainingCalories"
          class="mt-3"
        />
      </div>
        
      <div class="flex items-center gap-5">
        <div v-if="infoComponents.length > 0" class="flex justify-center my-4">
          <SubmitCustom
            :text="translate('History')"
            color="cyan"
            @isSubmit="openHistory"
          >
            <Calendar class="w-6 h-6" />
          </SubmitCustom>
        </div>
        <CheatMeal
        v-if="infoComponents.length > 0"
        :isDisabled="cheatSituation === 2"
        @click="isModal = true" />
      </div>
    </div>

    <Modal v-if="isModal" @close="isModal = false">
      <CheatMealMessage 
      :cheatSituation="cheatSituation"
      @confirm="addDayCheatMeal"
      />
    </Modal>

    <ProgressCalory
      v-if="userInfo && infoComponents"
      :calory="userInfo.calory"
      :components="infoComponents"
      :cheatMeal="cheatDay"
    />

    <div class="flex justify-center items-center self-center">
      <RouterLink to="/add-eat-product">
        <AddEatClick />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { readToFile, binarySearch, setUserDateObject, getUserDateObject } from "../functions.js";

import {
  isCheatDayPossible,
  foundStartDate,
} from "@/func/progress";
import { foodsEatenDate, remainingCalories, infoComponents } from "@/constants.js";
import { translate } from "@/lang";

import SubmitCustom from "../components/SubmitCustom.vue";
import ProgressCalory from "@/components/HomePage/Progress/ProgressCalory.vue";
import Calendar from "@/assets/SVG/Calendar.vue";
import AddEatClick from "@/assets/SVG/AddEatClick.vue";
import ProgressWeek from "@/components/HomePage/Progress/ProgressWeek.vue";
import CheatMeal from "../components/HomePage/CheatMeal.vue";
import Modal from "@/components/Products/Modal.vue";
import CheatMealMessage from "../components/HomePage/CheatMealMessage.vue";


const router = useRouter();

const userInfo = ref();

const startDate = ref();
const arrWeekActivities = ref([]);

const cheatDay = ref(false)
const cheatSituation = ref(0);

onMounted(async () => {
  userInfo.value = await getUserDateObject("userCalory");
  if (userInfo.value === null) {
    router.push("/bmr");
  } else {
    remainingCalories.value = userInfo.value.calory;
    const data = await readToFile(foodsEatenDate);
    if (data) {
      infoComponents.value = data;
      // получаю данные для прогреса по текущей неделе
      // нахожу дату начала недели
      startDate.value = foundStartDate();
      const updatedDate = new Date(startDate.value);
      arrWeekActivities.value = binarySearch(data, updatedDate);
      // получаю есть ли данные за последние 6 дней + сегодня и был ли чит мил активирован ранее
      cheatSituation.value = await isCheatDayPossible(data);
    }
  }
});

const openHistory = () => {
  router.push("/history");
};

const isModal = ref(false);

const addDayCheatMeal = async () => {
  const data = new Date()
  const targetDateString = data.toISOString().split("T")[0];
 try {
  await setUserDateObject('checkMeal', targetDateString)
 } catch (error) {
  alert(error)
 }
 cheatSituation.value = 3
 isModal.value = false
}

</script>
