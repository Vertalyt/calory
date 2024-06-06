<template>
  <form>
    <div class="flex flex-col gap-3 w-80 mx-auto mt-5">
      <div class="mb-4">
        <input type="text" 
        class="h-12"
        :placeholder="translate('description')" 
        v-model="nameProduct"
        />
      </div>

      <div
        v-for="el in elements"
        :key="el.id"
        class="border bg-gray-200 rounded-xl px-3 py-3"
      >
        <h3 class="text-center">{{ translate(el.name) }}</h3>
        <input
          type="number"
          :placeholder="translate(el.placeholder)"
          v-model="el.nameConstant.value"
        />

      </div>
      <SubmitCustom
        :text="translate('Add')"
        :color="'cyan'"
        class="mx-auto"
        :isDisabled="!isDisabledFlag"
        @click="add"
      >
      </SubmitCustom>

    </div>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";


import { writeToFile } from '@/functions.js'
import { addProductUser, langFlags } from '@/constants.js'
import { translate } from '@/lang'

import SubmitCustom from "@/components/SubmitCustom.vue";


// переменные для хранения значений с инпутов
const nameProduct = ref('')
const protein = ref(null);
const lipid = ref(null);
const carbohydrt = ref(null);
const energy = ref(null);

// массив для построения всех однотипных инпутов
const elements = [
  {
    id: 1,
    name: 'Caloric',
    placeholder: 'kcal_100',
    nameConstant: energy,
  },
  {
    id: 2,
    name: 'Carbohydrates',
    placeholder: 'g_100',
    nameConstant: carbohydrt,
  },
  {
    id: 3,
    name: 'Protein',
    placeholder: 'g_100',
    nameConstant: protein,
  },
  {
    id: 4,
    name: 'Lipid',
    placeholder: 'g_100',
    nameConstant: lipid,
  },
];

const isDisabledFlag = computed(() => {
  return (
    nameProduct.value !== '' &&
    energy.value !== null &&
    protein.value !== null &&
    lipid.value !== null &&
    carbohydrt.value !== null
  );
});

const add = async () => {
  const currentDate = new Date(); // Получаем текущую дату и время
  const currentDateString = currentDate.toISOString();

  const id = `${nameProduct.value}_${currentDateString}`

  const desc = {}
// Перебираем языковые флаги и копируем описание для каждого языка
for (const langFlag of langFlags) {
    desc[langFlag] = nameProduct.value;
}

  const date = [{
        "NDB_No": id,
        "desc": desc,
        "energ_Kcal": energy.value,
        "protein": protein.value,
        "lipid": lipid.value,
        "carbohydrt": carbohydrt.value
    }]

  const result = await writeToFile(date, addProductUser)
 if(result) {
  window.location.href ='/add-eat-product'
 }
};
</script>

