import { createRouter, createWebHistory } from 'vue-router'
import { Preferences } from "@capacitor/preferences";
import { lang, langFlags } from '@/constants.js'
import { App as CapacitorApp } from '@capacitor/app';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/TheHome.vue'),
      meta: {
        layout: 'main',
      }
    },
    {
      path: '/bmr',
      name: 'BMR',
      component: () => import('../pages/CalculationBmr.vue'),
      meta: {
        layout: 'main',
      }
    },
    {
      path: '/add-eat-product',
      name: 'AddEat',
      component: () => import('../pages/AddEat.vue'),
      meta: {
        layout: 'main',
      }
    },
    {
      path: '/add-product',
      name: 'AddProduct',
      component: () => import('../pages/AddProduct.vue'),
      meta: {
        layout: 'main',
      }
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../pages/History.vue'),
      meta: {
        layout: 'main',
      }
    },
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

async function langAndroid() {
  return navigator.language || navigator.userLanguage;
}


router.beforeEach(async (to, _, next) => {
 // проверяю андроид ли
  const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
  let defaultAndroidLang = ''
  if (isAndroid) {
  defaultAndroidLang = await  langAndroid()
} 

  // проверяю заполнена ли переменная языка
  if(lang.value === '') {
    // проверяю сохранена ли в сторе переменнная языка
    const localeLang = await defaultLang()
    if(localeLang) {
      lang.value = localeLang.userLang
    } else {
      // если нет, то и есть языковая переменная на Андроиде и она присутствует в дозволенных языках
      if(defaultAndroidLang !== '' && langFlags.includes(defaultAndroidLang) ) {
        lang.value = defaultAndroidLang 
      } else {
        // значение по умолчанию.
        lang.value = 'en'
      }
    }
  }
  next()
})

export default router

async function defaultLang() {
const langDefault = await Preferences.get({ key: 'userLang' });

if(langDefault) {
    return JSON.parse(langDefault.value);
}
}


// Обработка события кнопки "Назад" на Android
CapacitorApp.addListener('backButton', () => {
  const currentRoute = router.currentRoute.value;
  if (currentRoute.fullPath === '/') {
    CapacitorApp.exitApp();
  } else {
    router.back();
  }
});