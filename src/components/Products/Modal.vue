<template>
      <div class="modalWrapper flex justify-center items-center w-full min-h-screen h-max z-30 bg-gray-400/50" @click.stop="isClose" @keyup.esc="isClose">
      </div>
       <div class="modalContent fixed flex flex-col z-50 m-5 min-w-72 h-fit">
        <div class="flex justify-end h-12" >
          <CloseSVG class="w-12 h-12 text-gray-400 hover:text-gray-300 cursor-pointer" @click.stop="isClose"/>
        </div>
        <div class="w-full">
          <slot @click.stop />
        </div>

        </div>
</template>

<script setup>
import CloseSVG from '../../assets/SVG/CloseSVG.vue';

const emit = defineEmits({
  close: null
});

const isClose = () => {
  emit('close');
};
</script>

<style scoped>
.modalWrapper {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.modalContent {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

</style>
