
<template>
  <div class="w-80 mx-auto">
    <InputSearch 
      :placeholder="placeholder"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      />
  </div>

 <table 
 v-if="foodsEaten.length"
 class="mx-auto m-2">
  <thead>
  <td 
  @click.stop ="emit('sort-arr')"
  class="flex items-center border-0" :class="[styleHead, { 'p-0 hover:bg-gray-500' : !isClose }]"> 
    <CloseSVG 
    v-if="isClose"
    @click.stop="emit('rebut')"
    class="ml-2 w-9 h-9 text-red-700 hover:text-red-900 cursor-pointer "
    />
    <div class="flex justify-between items-center w-full h-full px-1" :class="{ 'p-0 hover:bg-gray-500' : isClose }">
      
      <button 
      class="px-2"
    >
    {{ translate('Date') }}
  </button>
    <ArrowDown 
    v-if="isSort"
    class="h-6" />
    <ArrowUp 
    v-if="!isSort"
    class="h-6" />
    </div>
  </td>


  <td v-if="ollDate" :class="[styleHead, style]"> {{ translate('Name') }}</td>
  <td v-if="ollDate" :class="[styleHead, style]"> {{ translate('Gram') }}</td>
  <td :class="[styleHead, style]">{{ translate('Calories') }} </td>
  <td :class="[styleHead, style]"> {{ translate('Protein') }} </td>
  <td :class="[styleHead, style]"> {{ translate('Lipid') }} </td>
  <td :class="[styleHead, style]"> {{ translate('Carbohydrates') }} </td>
  <td v-if="!infoData" :class="[styleHead, style]"> <DelSVG class="w-6 h-6 mx-auto" /> </td>
  </thead>

  <tr 
  v-for="product in foodsEaten"
  class="bg-gray-300/80 border-y-4"
  :key="getDescription(product.desc) + '_' + product.date"
  >
  <td class="flex gap-3 whitespace-nowrap" :class="style"> 
    {{ product.date }} 

    <InfoSVG 
    v-if="infoData"
    @click="emit('see-data', product.date)"
    class="w-6 h-6 text-green-600 hover:text-green-700 cursor-pointer " />
  </td>
  <td v-if="ollDate" class="whitespace-nowrap" :class="style"> {{ getDescription(product.desc) }} </td>
  <td v-if="ollDate" :class="style"> {{ product.gram }} </td>
  <td :class="[style, getClass(product)]"> {{ product.energ_Kcal  }} </td>
  <td :class="style"> {{ product.protein }} </td>
  <td :class="style"> {{ product.lipid }} </td>
  <td :class="style"> {{ product.carbohydrt }} </td>
  <td v-if="!infoData" @click="emit('del-record', product.id)"
  :class="[style]"> <DelSVG class="w-6 h-6 mx-auto text-red-600 cursor-pointer " /> </td>
  </tr>

 </table>

 <div v-else
 class="w-80 mx-auto p-3"
 >
  <span class="font-bold text-gray-700/90 "> {{ translate('MissingData') }} </span>
 </div>

</template>


<script setup>
import ArrowDown from '../../assets/SVG/ArrowDown.vue'
import ArrowUp from '../../assets/SVG/ArrowUp.vue'
import InputSearch from '../../components/Products/InputSearch.vue'

import { getDescription, translate } from '@/lang'

import InfoSVG from '../../assets/SVG/InfoSVG.vue'
import CloseSVG from '../../assets/SVG/CloseSVG.vue'
import DelSVG from '../../assets/SVG/DelSVG.vue'

const emit = defineEmits(['update:modelValue', 'sort-arr', 'see-data', 'rebut', 'del-record'] 
)

const props = defineProps({
foodsEaten: {
  required: true,
  type: Object
},
isSort: {
  required: true,
  type: Boolean
},
ollDate: {
  required: false,
  type: Boolean,
  default: true
},
modelValue: {
  type: String,
  required: true
},
placeholder: {
  type: String,
  required: false,
  default: ''
}, 
infoData: {
  required: false,
  type: Boolean,
  default: false
},
isClose: {
  required: false,
  type: Boolean,
  default: false
},
remainingCalories: {
  required: false,
  type: Number,
  default: null
},
})

const style = 'border-2 px-5 py-1'
const styleHead = 'font-bold bg-gray-400 h-12'

function getClass(product) {
// Проверяем, та ли таблица
if (props.infoData === false) {
  return '';
} else {
  const OllTotal = product.totalKcal !== undefined ? product.totalKcal : props.remainingCalories;
  // Возвращаем 'text-red-500' для условия energ_Kcal > OllTotal, иначе возвращаем 'text-green-600'
  return product.energ_Kcal > OllTotal ? 'text-red-500' : 'text-green-600';
}
}



</script>