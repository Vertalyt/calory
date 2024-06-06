
<template>


  <div class="flex justify-center relative">

  <div class="flex flex-col justify-center content-center items-center gap-3 w-full sm:w-96 "> 

  <div class="flex items-center w-full justify-between">
    <RouterLink to="/add-product">
   <SubmitCustom 
   class="m-3 px-4 text-lg"
   :text="translate('AddProduct')"
   color="green"
   >
  <PlusSVG  />
  </SubmitCustom>
  </RouterLink>
  
  <RefreshSVG 
  class="w-8 h-8"
  :class="[textGreen, hoverTextGreen]"
  @click="isModalRefreshList = true"
  />
    </div>

  <InputSearch 
  :modelValue="searchProduct"
  @update:modelValue="newValue => searchProduct = newValue"
  />

  <TableProducts 
  :products="listProduct"
  @add-product="addProduct"
  @id-del-product="delProduct"
  />

  </div>

  <Modal 
  v-if="isModal"
  @close="isModal = false"
  >
  <AddEatProduct 
  :product="dateProduct"
  @modal-close="isModal = false"
  />
  </Modal>


  <Modal v-if="isModalRefreshList" @close="isModalRefreshList = false">
      <IsCheck @modal-close="isModalRefreshList = false" @confirm="refreshList" >
        <h3 class="my-2  font-bold">{{ translate('UpdateProducts') }}</h3>
        <h3 class="mb-4">{{ translate('AddedProductsNotBeDeleted') }}</h3>
      </IsCheck>
  </Modal>

  </div>

  </template>


<script setup>
import { ref, watch, onMounted } from 'vue'


import TableProducts from '../components/Products/TableProducts.vue'
import Modal from '../components/Products/Modal.vue';
import AddEatProduct from '../components/Products/AddEatProduct.vue'
import InputSearch from '../components/Products/InputSearch.vue'
import IsCheck from '../components/IsCheck.vue';

import RefreshSVG from '../assets/SVG/RefreshSVG.vue';
import PlusSVG from '../assets/SVG/PlusSVG.vue';

import { addProductUser, addProductDefault, textGreen, hoverTextGreen, lang, versionKeyListProduct, versionValueListProduct } from '@/constants.js'
import { readToFile, writeToFile, sortByLanguage, updateVersionProductList, getUserDateObject } from '@/functions.js'
import { translate } from '@/lang'

import products from '../JsonDate/dateAbbrev2.json'

import SubmitCustom from "@/components/SubmitCustom.vue";


const isModal = ref(false)

const listProduct = ref(products)

const customListProduct = ref([])
const defaultListProduct = ref([])


onMounted(async () => {
  // Запрашиваем базовый список продуктов с устройства
  defaultListProduct.value = await readToFile(addProductDefault)

  // Если базового списка нет, загружаем его на устройство и записываем значения дефолтного
  if (!defaultListProduct.value) {
    defaultListProduct.value = products
    await writeToFile(products, addProductDefault, false)
    await updateVersionProductList()
  } else {
    // Получаем идентификатор версии продуктового сохраненного списка
    const versionInfo = await getUserDateObject(versionKeyListProduct);
    // Если идентификатора нет или версия на устройстве меньше, чем пришедшее с приложения, переписываем массив на устройстве
    if (!versionInfo || Number(versionInfo.version) < versionValueListProduct) { 
      // Записываем идентификатор версии списка продуктов и список продуктов
      await updateVersionProductList()
      listProduct.value = products
    } else {
      // Иначе заменяем свой дефолтный на загруженный
      listProduct.value = defaultListProduct.value
    }
  }

  // Получаем список добавленных продуктов пользователем
  const data = await readToFile(addProductUser)
  if (data && data.length > 0) {
    customListProduct.value = data
    listProduct.value = listProduct.value.concat(...data)

    // Сортируем по алфавиту
    listProduct.value = listProduct.value.sort(sortByLanguage(lang.value))
  }
})


// const calculateComponents = useComponents(computedComponents)

// продукт для добавления
const dateProduct = ref()
const addProduct = (product) => {
  isModal.value = true
  dateProduct.value = product
}

const searchProduct = ref('')

watch(searchProduct, val => {

  if(customListProduct.value.length) {
        listProduct.value = products.concat(...customListProduct.value)
    .filter(p => p.desc[lang.value].toLowerCase().includes(val.toLowerCase())).sort(sortByLanguage(lang.value))
  } else {
    listProduct.value = products.filter(p => p.desc[lang.value].toLowerCase().includes(val.toLowerCase()))
  }
})


const delProduct = async (id) => {
  if(id.includes('_')) {
    customListProduct.value = removeFromArray(customListProduct.value, id)
    // после фильтрации
        try {
          await writeToFile(customListProduct.value, addProductUser, false)
          listProduct.value = [...defaultListProduct.value, ...customListProduct.value];
        } catch (error) {
            alert(error)
        }
            } else {
              defaultListProduct.value = removeFromArray(defaultListProduct.value, id)
              // после фильтрации
              try {
                await writeToFile(defaultListProduct.value, addProductDefault, false)
                listProduct.value = [...defaultListProduct.value, ...customListProduct.value];
                  } catch (error) {
                      alert(error)
                  }
            }
            searchProduct.value = ''

}

function removeFromArray(arr, id) {
  return arr.filter( el => el.NDB_No !==  id)
}

const isModalRefreshList = ref(false)

const refreshList = async () => {
  isModalRefreshList.value = false
  try {
    defaultListProduct.value = products
    listProduct.value = [...customListProduct.value, ...defaultListProduct.value]
    await writeToFile(products, addProductDefault, false)
  } catch (error) {
    alert(error)
  }
}

</script>

