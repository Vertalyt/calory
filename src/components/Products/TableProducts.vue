<template>
  <div class="h-screen w-full pb-5">
    <Modal v-if="isModalDel" @close="closeModal">
      <IsCheck @modal-close="closeModal" @confirm="deleteProduct" >
        <h3 class="my-2  font-bold">{{ translate('Remove') }}</h3>
        <h3 class="mb-4">{{ translate('Are_you_sure') }}</h3>
      </IsCheck>
    </Modal>

    <table class="w-full border overflow-hidden">
      <tr
        v-for="product in products"
        :key="`tr_${product.NDB_No}_${getDescription(product.desc)}`"
        :id="`tr_${product.NDB_No}`"
        class="flex w-full items-center relative"
        @click="addProduct(product)"
      >

        <div
          class="swipeable-wrapper bg-gray-300/100 border-y-4 cursor-pointer swipeable-row w-full"
        >
          <div class="flex justify-between px-2 pt-2 pb-1 gap-3">
            <h3 :class="['font-semibold', textGray]">{{ getDescription(product.desc) }}</h3>
            <div>
              <span :class="['text-xs mr-2', textGray]"> {{ translate('kcal/100g') }}</span
              ><span :class="['font-bold', textGray]">{{
                product.energ_Kcal
              }}</span>
            </div>
          </div>

          <div class="flex justify-between my-1 mx-2">

            <CloseSVG 
            @click.stop="openModal(product.NDB_No)"
            class="w-10 h-10 text-red-800/60 hover:text-red-900/60 m-2" />
            
            <div class="flex gap-x-2">
              <TrElement :bgColor="bgCyan":el="translate('P')" :count="product.protein"/>
              <TrElement :bgColor="bgLightGreen" :el="translate('L')" :count="product.lipid" />
              <TrElement :bgColor="bgYellow" :el="translate('C')" :count="product.carbohydrt" />
            </div>
          </div>
        </div>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { bgCyan, bgLightGreen, bgYellow, textGray } from "@/constants.js";

import TrElement from "./TrElement.vue";
import CloseSVG from "../../assets/SVG/CloseSVG.vue";

import Modal from "../../components/Products/Modal.vue";
import IsCheck from "../../components/IsCheck.vue";

import { getDescription, translate } from '@/lang'
defineProps({
  products: {
    type: Array,
    required: true,
  },
});

// v-touch:swipe="swipeHandler(`tr_${product.NDB_No}_${product.desc}`)"
//           v-touch-options="{swipeTolerance: 15}"

const emit = defineEmits({
  "add-product": Object,
  "id-del-product": [String, Number],
});

const addProduct = (product) => {
  emit("add-product", product);
};

const isModalDel = ref(false);
const idDel = ref(null);

const openModal = (id) => {
  idDel.value = id;
  isModalDel.value = true;
};

const closeModal = () => {
  isModalDel.value = false;
};

const deleteProduct = () => {
  emit("id-del-product", idDel.value);
  closeModal();
};


</script>

<style scoped>
.swipeable-row {
  transition: transform 0.3s ease;
}

.swipe-right {
  transform: translateX(30px); /* Измените значение смещения, чтобы элемент уезжал на нужное расстояние */
}

</style>
