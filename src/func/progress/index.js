import { parseDate, addDate, binarySearch, getUserDateObject  } from '@/functions.js'

// Функция для нахождения даты неделю назад
export function findStartDateSevenDaysAgo() {
    const currentDate = new Date();
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const startMillisecondsSearchDate = currentDate.getTime() - 6 * millisecondsPerDay;
    return new Date(startMillisecondsSearchDate);
}

        
  // собираю/ суммирую записи за прошлых 6 дней + сегодня
function calorieCountingPerSevenDayAgo({ activities, startDay }) {
 
    let weekProgress = Array.from({ length: 7 }, () => ({ data: "", energ_Kcal: 0, totalKcal: 0 }));
    // заполняю массив датами за 7 дней
    weekProgress = addDate(weekProgress, startDay)

    // записываю сумму значений сьеденых калорий и граничную цифру
    activities.forEach((entry) => {
      const date = parseDate(entry.date);
      const targetDay = weekProgress.find(
        (day) => day.data === date.toISOString().slice(0, 10)
      );
      if (targetDay) {
        targetDay.energ_Kcal += parseFloat(entry.energ_Kcal);
        targetDay.totalKcal = parseFloat(entry.totalKcal);
      }
    
    });
    return weekProgress;
  }
  
  export function foundStartDate() {
    let startSSearchDate;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // Поскольку месяцы начинаются с 0, добавляем 1
    let day = date.getDate();
    // Получить день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
    let numberDateForWeek = date.getDay();
  
    // Если сегодня воскресенье (0), сдвигаем на 6 дней назад для того, чтобы начало недели было в понедельник
    if (numberDateForWeek === 0) {
      numberDateForWeek = 6;
    } else {
      numberDateForWeek--;
    }
  
    const newMonth = month < 10 ? "0" + month : month;
  
    if (day < numberDateForWeek) {
      // узнаю количество дней в предыдущем месяце
      if (month === 1) {
        year--;
        month = 12;
      } else {
        month--;
      }
      const countDayPrevMonth = daysInMonth(month, year);
      // считаю число начала поиска
      day = countDayPrevMonth - (numberDateForWeek - day);
      // проверяю добавлять ли вначале 0 дню
      day = day < 10 ? "0" + day : day;
      startSSearchDate = `${year}-${month < 10 ? "0" + month : month}-${day}`;
    } else {
      // считаю число начала поиска
      let newDay = day - numberDateForWeek;
      // проверяю добавлять ли вначале 0 дню
      newDay = newDay < 10 ? "0" + newDay : newDay;
      startSSearchDate = `${year}-${newMonth}-${newDay}`;
    }
    return startSSearchDate;
  }
  
  // Функция для получения количества дней в месяце
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }


export async function isCheatDayPossible(data) {
          // получаю данные за последние 6 дней + сегодня
          const sevenDayAgo = findStartDateSevenDaysAgo()
          const activitiesWeekAgo =  binarySearch(data, sevenDayAgo);

          const summaryDay = calorieCountingPerSevenDayAgo({
            activities: activitiesWeekAgo,
            startDay: sevenDayAgo
        })
        const currentDate = new Date();
        const targetDateString = currentDate.toISOString().split("T")[0];

        const cheatDaysCount = summaryDay.filter(el => el.totalKcal > 0 && el.data !==  targetDateString).length
       
        if(cheatDaysCount >= 6) {
        return await impossibleCheckMealDay(cheatDaysCount >= 6)
       } else {
        return 1
       }
      }


const impossibleCheckMealDay = async (check) => {
// 1 - не набрано 6 дней диеты
// 2 - активация разрешена
// 3 - не прошло 6 дней после последней активации 

  // получаю если есть, дату последнего чит мила
  const userCheckMealData = await getUserDateObject("checkMeal");

  // если нету, 
  if (!userCheckMealData) {
    // проверяю доступно ди Чит мил, 
    return check ? 2 : 1;

  } else {
    // если есть, извлекаю ее и перевожу в формат числовой отметки и сравниваю,
    const dateWeek = findStartDateSevenDaysAgo();
    const cheCMealDate = new Date(userCheckMealData.data);

    // если она старше недельной отметки, и check говорит что 6 дней было то разрешаем
    return (dateWeek.getTime() >= cheCMealDate.getTime() && check) ? 2 : 3;
  }

};