import { langFlags, lang } from '@/constants.js'
import ua from './ua.json'
import ru from './ru.json'
import en from './en.json'
import pl from './pl.json'
import kk from './kk.json'

const languages = {
    'ua': ua,
    'ru': ru,
    'en': en,
    'pl': pl,
    'kk': kk,
}

 // Функция для получения описания на определенном языке
 export function getDescription(desc) {
    if (langFlags.includes(lang.value) && typeof desc === 'object') {
        return desc[lang.value];
    } else {
        return desc;
    }
}


export function translate(key) {
    const flag = lang.value
    return languages[flag][key]
}