import { Preferences } from "@capacitor/preferences";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { countArrEatProduct, versionValueListProduct, versionKeyListProduct } from './constants.js'

// запись
export async function writeToFile(data, path, add = true) {

  let date = [...data];
  if (add) {
    let oldDate = await readToFile(path); // Получаем старые данные
    if (oldDate) {
        if (oldDate.length > countArrEatProduct) {       // если массив записей больше чем разрешено
            oldDate.pop(); // Удаляем последнюю запись из oldDate
        }

        date = [...date, ...oldDate]; // Добавляем оставшиеся записи из oldDate в date
    }
  }
  const jsonData = JSON.stringify(date); // Преобразуем в JSON
  try {
    await Filesystem.writeFile({
      path: `secret/${path}`,
      data: jsonData,
      encoding: Encoding.UTF8,
      directory: Directory.Library,
      recursive: true, // Создаем каталог рекурсивно, если он не существует
    });
    return true; // Успешная запись
  } catch (error) {
    alert(error); // Ошибка записи файла
    return false; // Возвращаем false в случае ошибки
  }
}

// чтение
export async function readToFile(path) {
  try {
    const contents = await Filesystem.readFile({
      path: `secret/${path}`,
      directory: Directory.Library,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(contents.data);
  } catch (error) {
    return undefined;
  }
}

// удаление
export async function delRecord(path) {
  try {
    await Filesystem.deleteFile({
      path: `secret/${path}`,
      directory: Directory.Data,
    });
  } catch (error) {
    return undefined;
  }
}

export async function getUserDateObject(key) {
  const ret = await Preferences.get({ key });
  return JSON.parse(ret.value);
}

export async function setUserDateObject(key, data) {
    Preferences.set({
    key: key,
    value: JSON.stringify({
      data
    })
  });
}


export function binarySearch(arr, target, revers = false) {
  let result = [];
  let left = 0;
  let right = arr.length - 1;
  let closestIndex = -1;
  let count = 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midValue = arr[mid];
    const midOldDate = new Date(midValue.date);

    const targetDate = dataFormat(target);
    const midDate = dataFormat(midOldDate);

    count++;
    if ( midDate >= targetDate) {
      closestIndex = mid;

      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  if (closestIndex !== -1) {
    if(revers === true) {
      result = arr.slice(closestIndex + 1 , arr.length );
    } else {
      result = arr.slice(0, closestIndex + 1);
    }


    count++;
  }
  return result;
}

function dataFormat(targetData) {
  const targetDateString = targetData.toISOString().split("T")[0];
  return new Date(targetDateString).getTime();
}

// Добавляем дату в массив для каждого дня недели
export function addDate(weekProgress, startOfWeek) {
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    
    weekProgress[i].data = date.toISOString().slice(0, 10);
  }
  return weekProgress;
}

// Группируем данные по дням недели и суммируем калории
export function calorieCountingPerDay({
  activities,
  startOfWeek,
  weekProgress,
}) {
  activities.forEach((entry) => {
    const date = parseDate(entry.date);

    if (date >= startOfWeek) {
      const dayOfWeek = Math.floor(
        (date - startOfWeek) / (1000 * 60 * 60 * 24)
      );
      const key = new Date(startOfWeek);
      key.setDate(key.getDate() + dayOfWeek);

      const targetDay = weekProgress.find(
        (day) => day.data === key.toISOString().slice(0, 10)
      );
      if (targetDay) {
        targetDay.energ_Kcal += parseFloat(entry.energ_Kcal);
      }
    }
  });
  return weekProgress;
}

// собираю/ суммирую записи за прошлых 6 дней + сегодня
export function calorieCountingPerSevenDayAgo({ activities, startDay }) {
  let weekProgress = [
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
    { data: "", energ_Kcal: 0 },
  ];

  weekProgress = addDate(weekProgress, startDay)

  activities.forEach((entry) => {
    const date = parseDate(entry.date);
    const targetDay = weekProgress.find(
      (day) => day.data === date.toISOString().slice(0, 10)
    );
    if (targetDay) {
      targetDay.energ_Kcal += parseFloat(entry.energ_Kcal);
    }
  
  });
  return weekProgress;
}

// Функция для преобразования строки с датой в объект Date
export function parseDate(dateStr) {
  const [datePart] = dateStr.split(', ');

  return new Date(datePart);
}

export function sortByDay(foodsEaten) {
  const groupedData = {};
foodsEaten.forEach(item => {
    const date = item.date.split(',')[0];
    if (!groupedData[date]) {
        groupedData[date] = {
            carbohydrt: 0,
            protein: 0,
            lipid: 0,
            energ_Kcal: 0
        };
    }
    groupedData[date].carbohydrt += parseFloat(item.carbohydrt);
    groupedData[date].protein += parseFloat(item.protein);
    groupedData[date].lipid += parseFloat(item.lipid);
    groupedData[date].energ_Kcal += parseFloat(item.energ_Kcal);
});

const resultArray = Object.entries(groupedData).map(([date, values]) => ({
  date,
  carbohydrt: values.carbohydrt.toFixed(2),
  protein: values.protein.toFixed(2),
  lipid: values.lipid.toFixed(2),
  energ_Kcal: values.energ_Kcal.toFixed(2)
}));

return resultArray
}

export function findDateNDaysAgo(n) {
  // Получаем текущую дату
  const currentDate = new Date();

  // Получаем время в миллисекундах для текущей даты
  const currentTime = currentDate.getTime();

  // Получаем время в миллисекундах для n дней назад
  const nDaysAgoTime = currentTime - (n * 24 * 60 * 60 * 1000);

  // Создаем новый объект Date для даты n дней назад
  const nDaysAgoDate = new Date(nDaysAgoTime);

  // Устанавливаем время в полночь (без времени)
  nDaysAgoDate.setHours(0, 0, 0, 0);

  // Возвращаем дату n дней назад
  return nDaysAgoDate;
}

// Функция для сортировки по значению desc в зависимости от выбранного языка
export function sortByLanguage(lang) {
  return function(a, b) {
      return a.desc[lang].localeCompare(b.desc[lang]);
  };
}

export async function updateVersionProductList() {
  await Preferences.set({
    key: versionKeyListProduct,
    value: JSON.stringify({
      version: versionValueListProduct
    })
  });
}
