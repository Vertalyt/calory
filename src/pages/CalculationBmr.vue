<template>
  <div class="flex flex-col items-center pb-5">
    <form 
    class="w-full"
    action="" @submit.prevent="onSubmit">

    <transition name="slide-fade">
      <div v-if="progress === 3"
      class="border border-gray-400 bg-gray-200/80 m-3 p-5 rounded-2xl"
      >
        <h3 class="text-gray-600 font-bold mx-5">{{ translate('Diet') }}</h3>
        <WrapperElsForm>
          <RadiosBMR
            :els="eatEls"
            nameRatio="eat"
            key="eat"
            @updateRadio="(nevWal) => (eatActivity = nevWal)"
          />
        </WrapperElsForm>

        <SubmitCustom isType="submit" :text="translate('quantify')" :color="'cyan'">
        </SubmitCustom>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="progress === 2"
      class="border border-gray-400 bg-gray-200/80 m-3 p-5 rounded-2xl"
      >
        <h3 class="text-gray-600 font-bold mx-5">{{ translate('ActivityLevel') }}</h3>
        <WrapperElsForm>
          <RadiosBMR
            key="activity"
            :els="activityEls"
            nameRatio="activity"
            @updateRadio="(nevWal) => (valueActivity = nevWal)"
          />
        </WrapperElsForm>

        <NextButton
          :isDisabled="isNextButtonDisabledBlock2 && progress === 2"
          @isSubmit="nextBlock"
          ref="btnTwo"
        />
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="progress === 1"
      class="border border-gray-400 bg-gray-200/80 m-3 p-5 rounded-2xl"
      >
        <WrapperElsForm>
          <RadiosBMR
            key="sex"
            :els="sexEls"
            nameRatio="sex"
            :isChecked="sexRadio"
            @updateRadio="(nevWal) => (sexRadio = nevWal)"
          />
        </WrapperElsForm>

        <WrapperElsForm
        :addPadding="false"
        >
          <LiInput
            idVal="age"
            :val="translate('Age')"
            :modelValue="age"
            @update:modelValue="age = $event.target.value"
          />
          <LiInput
            idVal="weight"
            :val="translate('weight_kg')"
            :modelValue="weight"
            @update:modelValue="weight = $event.target.value"
          />
          <LiInput
            idVal="height"
            :val="translate('height_sm')"
            :modelValue="height"
            @update:modelValue="height = $event.target.value"
          />
        </WrapperElsForm>

        <NextButton
          :isDisabled="isNextButtonDisabledBlock1 && progress === 1"
          @isSubmit="nextBlock"
          ref="btnOne"
        />
      </div>
    </transition>

    </form>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch  } from "vue";
import { useRouter } from 'vue-router'

import WrapperElsForm from "@/components/BMR/WrapperElsForm.vue";
import RadiosBMR from "@/components/BMR/RadiosBMR.vue";
import SubmitCustom from "../components/SubmitCustom.vue";
import LiInput from "@/components/BMR/LiInput.vue";
import NextButton from "../components/BMR/NextButton.vue";
import { Preferences } from '@capacitor/preferences';

import { getUserDateObject } from '../functions.js'
import { calory } from '../constants.js'
import { translate } from '@/lang'

const router = useRouter()

const sexRadio = ref("");
const age = ref("");
const height = ref("");
const weight = ref('')

const valueActivity = ref("");
const eatActivity = ref("");


onMounted( async() => {
  const date = await getUserDateObject('user')
  if(date !== null) {
  sexRadio.value = date.sexRadio
  age.value = date.age
  height.value = date.height
  }
} )

const btnOne = ref()
const btnTwo = ref()
const btnTree = ref()

const progress = ref(1);

// проверка что поставлен чекбокс sexRadio, а также что добавлены age, weight, height и значение двух значное и более.
const isNextButtonDisabledBlock1 = computed(() => {
  return !!sexRadio.value && age.value.length > 1 && weight.value.length > 1 && height.value.length > 1;
});

watch(isNextButtonDisabledBlock1, val => {
  if (val) {
    const btnOneElement = btnOne.value.$el || btnOne.value; // Получаем DOM-элемент кнопки
    btnOneElement.scrollIntoView({ behavior: 'smooth', block: 'end' }); // Прокручиваем до конца элемента
  }
});


const isNextButtonDisabledBlock2 = computed(() => {
  return !!valueActivity.value;
});

watch(isNextButtonDisabledBlock2, val => {
  if (val) {
    const btnOneElement = btnTwo.value.$el || btnTwo.value; // Получаем DOM-элемент кнопки
    btnOneElement.scrollIntoView({ behavior: 'smooth', block: 'end'});
  }
});




const nextBlock = () => {
  if (progress.value !== 3) {
      progress.value++;
  } else {
    progress.value = 1;
  }
};



const sexEls = [
  { idType: "male", val: 'male' },
  { idType: "women", val: 'women' },
];

const activityEls = [
  { idType: "sit", val: 'SedentaryLifestyle', koef: 1.2 },
  { idType: "light", val: 'lightSports', koef: 1.375 },
  { idType: "average", val: 'averageSports', koef: 1.55 },
  { idType: "heavy", val: 'heavySports', koef: 1.725 },
  { idType: "veryHeavy", val: 'veryHeavySports', koef: 1.9 },
];

const eatEls = [
  { idType: "LoseWeight", val: 'LoseWeight' },
  { idType: "WeightSupport", val: 'WeightSupport' },
  { idType: "WeightGain", val: 'WeightGain' },
];

//Для женщин: 655,1 + (9,563 × вес в кг) + (1,85 × рост в см) - (4,676 × возраст в годах);
//Для мужчин: 66,5 + (13,75 × вес в кг) + (5,003 × рост в см) - (6,775 × возраст в годах).

const BMR = ref();

const onSubmit = async () => {
  if (sexRadio.value === "male") {
    BMR.value =
      Math.round(9.99 * parseFloat(weight.value)) +
      6.25 * parseFloat(height.value) -
      4.92 * parseFloat(age.value) +
      5;
  } else {
    BMR.value =
      Math.round(9.99 * parseFloat(weight.value)) +
      6.25 * parseFloat(height.value) -
      4.92 * parseFloat(age.value) -
      161;
  }
  const activityLevel = activityEls.find(
    (el) => el.idType === valueActivity.value
  );

  if (activityLevel) {
    calory.value = Math.round(BMR.value * activityLevel.koef);
  } else {
    calory.value = Math.round(BMR.value);
  }

  if (eatActivity.value === "LoseWeight") {
    calory.value = Math.round(calory.value * 0.85);
  }

  if (eatActivity.value === "WeightGain") {
    calory.value = Math.round(calory.value * 1.15);
  }

  await setUserDateObject()

};


// Сохраняем данные
async function setUserDateObject() {
  try {
    await Preferences.set({
      key: 'user',
      value: JSON.stringify({
        sexRadio: sexRadio.value,
        age: age.value,
        weight: weight.value,
        height: height.value,
        valueActivity: valueActivity.value,
        eatActivity: eatActivity.value,
        BMR: BMR.value,
      })
    });

    await Preferences.set({
      key: 'userCalory',
      value: JSON.stringify({
        calory: calory.value
      })
    });
    router.push('/')
  } catch (error) {
    alert('Ошибка при сохранении данных в SharedPreferences:', error);
  }
}

</script>

<style scoped>
/* Define transition classes */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.7s, transform 0.7s;
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>