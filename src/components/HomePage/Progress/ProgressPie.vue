
<template>
  <div 
  class="w-[140px] h-[140px] sm:w-40 sm-h-40">
    <Pie 
    :data="dataPie" :options="options" />
  </div>
</template>


<script setup>
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Pie } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, ref, watch } from 'vue'
import { translate } from '@/lang'
import { lang } from '@/constants.js'

const props = defineProps({
  label: {
    type: Array,
    required: true
  },
  count: {
    type: Array,
    required: true
  }
})


const computedFlagLang = computed( () => lang.value)

const dataPie = ref(dataInfo())

watch(computedFlagLang, _ => {
  dataPie.value = dataInfo()
})

function dataInfo() {
  return {
  labels: props.label.map(el => translate(el)),
  datasets: [
    {
      backgroundColor: ['#06b6d4', '#4ade80', '#eab308'],
      data: props.count
    }
  ]
}
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.parsed.toFixed(2) + '%'
          return label;
        }
      }
    },
    // Используем плагин datalabels для отображения данных на диаграмме
    datalabels: {
      color: '#fff', // цвет текста
      anchor: 'end',
      align: 'start',
      offset: 10,
      formatter: (value) => {
        return value + '%';
      },
      font: {
        size: 16, // размер шрифта
        weight: 'bold' // толщина шрифта
      }
    }
  }
}

ChartJS.register(ArcElement, Tooltip, ChartDataLabels)
</script>



