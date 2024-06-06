import { ref } from 'vue'

export const bgGreen = 'bg-green-600 focus:bg-green-700/80 hover:bg-green-700/80';
export const bgLightGreen = 'bg-green-400 focus:bg-green-500/80 hover:bg-green-500/80';
export const bgGray = 'bg-gray-200 focus:bg-gray-400 hover:bg-gray-400';
export const bgRed = 'bg-red-400 focus:bg-red-500 hover:bg-red-500';
export const bgCyan = 'bg-cyan-500 shadow-cyan-500/50 focus:bg-cyan-600 hover:bg-cyan-600';
export const bgYellow = 'bg-yellow-500 shadow-yellow-500/50 hover:bg-yellow-600';
export const textGray = 'text-gray-700';
export const textGreen = 'text-green-700';
export const hoverTextGreen = 'hover:text-green-800 cursor-pointer';

export const foodsEatenDate = 'foodsEatenDate.json'
export const addProductUser = 'addProductUser.json'
export const addProductDefault = 'addProductDefault.json'

export const calory = ref(0)
export const isWeek = ref(false)
export const constRemainingCalories = ref(0)
export const remainingCalories = ref(calory.value);

// массив содержащий продукты сьеденные пользователем
export const infoComponents = ref([]);

// расчетный год записей
export const countArrEatProduct = 7200;

export const lang = ref('');

export const langFlags = ['ua', 'ru', 'en', 'pl', 'kk'];

export const versionKeyListProduct = 'versionProductList'
export const versionValueListProduct = 1.01
