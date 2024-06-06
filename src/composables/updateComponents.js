import { watch, ref } from "vue";
import { bgCyan, bgGreen, bgYellow } from '@/constants.js'


const compositionData = ref([
  { color: bgCyan, name: 'Protein', count: 0, id: 'protein' },
  { color: bgGreen, name: 'Lipid', count: 0, id: 'lipid' },
  { color: bgYellow, name: 'Carbohydrates', count: 0, id: 'carbohydrt' },
  { color: bgYellow, name: 'Caloric', count: 0, id: 'energ_Kcal' },
]);

export function useComponents(computedComponents) {
  const currentDate = new Date(); // Получаем текущую дату и время
  const currentDateString = currentDate.toISOString().split('T')[0]; // Преобразуем в строку в формате "YYYY-MM-DD"
    watch(computedComponents, (val) => {
        if (val && val.length) {
        // сортировка по текущей даты
        const filteredComponents = val.filter(component => {
          // Преобразуем дату компонента в строку и сравниваем с текущей датой
          let parts = component.date.split(",");
          return parts[0] === currentDateString;
      });

        // Функция для суммирования значений protein, lipid и carbohydrt
        const totalNutrients = filteredComponents.reduce(sumNutrients, { protein: 0, lipid: 0, carbohydrt: 0, energ_Kcal: 0 });       
        for (let index = 0; index < compositionData.value.length; index++) {
          const idEl = compositionData.value[index].id;
          compositionData.value[index].count = totalNutrients[idEl].toFixed(2);
        }
      }
    },{ deep: true, immediate: true });

  return compositionData;
}

const sumNutrients = (accumulator, currentValue) => {
  for (let index = 0; index < compositionData.value.length; index++) {
    const idEl = compositionData.value[index].id;
  accumulator[idEl] += parseFloat(currentValue[idEl]);
  }
  return accumulator;
}


