<template>

  <div>
    <div class="flex gap-5 w-80 mx-auto my-4">
      <SubmitCustom
        v-if="tableType === 'date'"
        @click="tableType = 'product'"
        class="px-6"
        :text="translate('byProduct')"
        :color="'cyan'"
      >
      </SubmitCustom>
      <SubmitCustom
        v-if="tableType === 'product'"
        @click="tableType = 'date'"
        class="px-6"
        :text="translate('byDate')"
        :color="'cyan'"
      >
      </SubmitCustom>
    </div>

    <template v-if="tableType === 'product'">
      <HistoryTable
        v-if="foodsEaten"
        :foodsEaten="foodsEaten"
        :isSort="isSort"
        :modelValue="searchProduct"
        :isClose="isClose"
        :placeholder="translate('byDescription')"
        @sort-arr="isSort = !isSort"
        @update:modelValue="(newValue) => (searchProduct = newValue)"
        @rebut="rebut"
        @del-record="delRecordProductEaten"
      />
    </template>

    <HistoryTable
      v-if="resultArray && tableType === 'date' && remainingCalories"
      :foodsEaten="resultArray"
      :remainingCalories="remainingCalories"
      :isSort="isSort"
      :ollDate="false"
      :infoData="true"
      :modelValue="searchForData"
      :placeholder="translate('bySearchDate')"
      @update:modelValue="(newValue) => (searchForData = newValue)"
      @sort-arr="isSortArrDate = !isSortArrDate"
      @see-data="seeData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import {
  readToFile,
  sortByDay,
  binarySearch,
  findDateNDaysAgo,
  getUserDateObject,
  writeToFile,
} from "../functions.js";
import { foodsEatenDate, lang } from "@/constants.js";

import HistoryTable from "../components/history/HistoryTable.vue";

import SubmitCustom from "@/components/SubmitCustom.vue";


import { translate } from "@/lang";

// не изменяемый список всех данных по дате
const dataOllResult = ref();
// переменная где храню отфильтрованные значения для таблицы по датам при поиске
const resultArray = ref();

// изменяемый (фильтруемый список) при поиске
const foodsEaten = ref([]);

// не изменяемый список всех продуктов
const listProduct = ref([]);

// список обрезанный за месяц, его использую для восстановления данных после поиска
const listProductOfWeek = ref([]);

// рассчитанное количество калорий
const remainingCalories = ref(null);
onMounted(async () => {
  const userInfo = await getUserDateObject("userCalory");
  if (userInfo === null) {
    router.push("/bmr");
  }
  remainingCalories.value = userInfo.calory;

  listProduct.value = await readToFile(foodsEatenDate);
  if (listProduct.value.length > 0) {
    const currentDate = new Date();
    // Находим дату начала предыдущей недели
    const startOfPreviousWeek = findDateNDaysAgo(31);

    // Находим элементы массива, соответствующие периоду с начала предыдущей недели до текущей даты
    const foodsSinceStartOfPreviousWeek = binarySearch(
      listProduct.value,
      startOfPreviousWeek
    );

    // Находим элементы массива, соответствующие периоду с начала предыдущей недели до текущей даты
    const foodsSinceStartOfCurrentWeek = binarySearch(
      foodsSinceStartOfPreviousWeek,
      currentDate,
      true
    );

    if (foodsSinceStartOfCurrentWeek.length === 0) {
      foodsEaten.value = foodsSinceStartOfPreviousWeek;
      listProductOfWeek.value = foodsSinceStartOfPreviousWeek;
      // суммирую все значения для таблицы по дням
      resultArray.value = sortByDay(foodsSinceStartOfPreviousWeek);
    } else {
      // записываю все значения для таблицы по продукту
      foodsEaten.value = foodsSinceStartOfPreviousWeek;
      listProductOfWeek.value = foodsSinceStartOfPreviousWeek;
    }
    // суммирую все значения для таблицы по дням за весь период
    resultArray.value = sortByDay(foodsEaten.value);
    dataOllResult.value = resultArray.value;
  }
});

const isSort = ref(true);
const isSortArrDate = ref(true);

function sort(check, foodsEaten) {
  if (check === true) {
    return (foodsEaten = foodsEaten
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)));
  } else {
    // Отсортировать по дате от старой к новой
    return (foodsEaten = foodsEaten
      .slice()
      .sort((a, b) => new Date(a.date) - new Date(b.date)));
  }
}
watch(isSort, (val) => {
  foodsEaten.value = sort(val, foodsEaten.value);
});

watch(isSortArrDate, (val) => {
  resultArray.value = sort(val, resultArray.value);
});

const searchProduct = ref("");
watch(searchProduct, (val) => {
  foodsEaten.value = listProductOfWeek.value.filter((p) => {
    return p.desc[lang.value].toLowerCase().includes(val.toLowerCase());
  });
});

const searchForData = ref("");
watch(searchForData, (val) => {
  resultArray.value = dataOllResult.value.filter((p) => p.date.includes(val));
});

const isClose = ref(false);
const seeData = (data) => {
  foodsEaten.value = listProduct.value.filter((p) => p.date.includes(data));
  tableType.value = "product";
  isClose.value = true;
};

const rebut = () => {
  foodsEaten.value = listProductOfWeek.value;
  isClose.value = false;
};

const tableType = ref("product");

const delRecordProductEaten = async (id) => {
  const newFood = foodsEaten.value.filter((el) => el.id !== id);
  try {
    const result = await writeToFile(newFood, foodsEatenDate, false);
    if (result) {
      listProduct.value = newFood;
      listProductOfWeek.value = newFood;
      foodsEaten.value = newFood;
    }
  } catch (error) {
    alert(error);
  }
};
</script>
