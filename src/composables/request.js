import { getAuth } from "firebase/auth";

import { getDatabase, ref, set, onValue } from "firebase/database";

import { connectDb } from '@/constants.js'

export async function addDateForUsersLists(data) {
  const authStatus = getUid();
  if (authStatus) {
    addData(data);
  }
}

async function addData(data) {
  try {
    const db = getDatabase();
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const dataRef = ref(db, `data/${timestamp}`);
    await set(dataRef, data);
  } catch (error) {
    console.log(error);
  }
}

export function getUid() {
  const auth = getAuth();
  return !!auth;
}


export async function isConnected() {
  connectDb.value = false;
  
  try {
    // Проверяем наличие интернет-соединения с помощью запроса
    const online = await isOnline();
    if (online) {
      const db = getDatabase();
      const connectedRef = ref(db, ".info/connected");

      onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          connectDb.value = true;
        }
      }, (error) => {
        console.error("Ошибка при проверке соединения с Firebase:", error);
      });
    } else {
      console.warn("Нет интернет-соединения.");
    }
  } catch (error) {
    console.error("Ошибка при проверке соединения:", error);
  }
}

async function isOnline() {
  try {
    await fetch('https://www.google.com', { mode: 'no-cors' });
    return true;
  } catch (error) {
    return false;
  }
}
