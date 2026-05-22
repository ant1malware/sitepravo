export type Recorder = {
  id: string;
  name: string;
  site: string;
  platforms: string[];
  requires?: string;
  pros: string[];
  cons: string[];
  tips?: string[];
};

export const recorders: Recorder[] = [
  {
    id: 'obs',
    name: 'OBS Studio',
    site: 'https://obsproject.com/',
    platforms: ['Windows', 'macOS', 'Linux'],
    pros: [
      'Бесплатный и открытый исходный код',
      'Гибкие сцены и источники, запись + трансляции',
      'Много пресетов и плагинов',
      'Поддержка аппаратного кодирования (NVENC/AMF/QuickSync)',
    ],
    cons: [
      'Относительно сложный старт без гайда',
      'Может требовать тонкой настройки битрейта/кодека',
    ],
    tips: [
      'Формат записи: MP4 (H.264 + AAC), опция "Автозавершение записи при сбоях"',
      'Быстрый старт: Настройки → Вывод → Запись → Качество: Высокое; Кодек: H.264 (NVENC, если доступен)',
      'Горячие клавиши: Настройки → Горячие клавиши → Старт/Стоп записи',
    ],
  },
  {
    id: 'xbox',
    name: 'Xbox Game Bar',
    site: 'ms-gamebar://',
    platforms: ['Windows 10/11'],
    requires: 'Встроено в Windows (Win+G)',
    pros: [
      'Мгновенный старт без установки',
      'Удобно для игр и окон',
      'Минимальные настройки',
    ],
    cons: [
      'Меньше контроля качества/битрейта',
      'Не всегда корректно пишет рабочий стол',
    ],
    tips: [
      'Откройте панель: Win+G; Начать запись: Win+Alt+R',
      'Проверьте пути сохранения: Настройки → Захват',
    ],
  },
  {
    id: 'shadowplay',
    name: 'NVIDIA ShadowPlay',
    site: 'https://www.nvidia.com/en-us/geforce/geforce-experience/shadowplay/',
    platforms: ['Windows'],
    requires: 'Видеокарта NVIDIA + GeForce Experience',
    pros: [
      'Малое влияние на FPS (NVENC)',
      'Инстант‑повторы и оверлей',
      'Хорошее качество без сложной настройки',
    ],
    cons: [
      'Только для карт NVIDIA',
      'Нужна авторизация в GeForce Experience',
    ],
    tips: [
      'Откройте GeForce Experience → Настройки → Оверлей в игре → Запись',
      'Рекомендуемый формат: MP4 (H.264, 1080p, 30–60 fps)',
    ],
  },
  {
    id: 'amd',
    name: 'AMD ReLive (Adrenalin)',
    site: 'https://www.amd.com/en/technologies/software',
    platforms: ['Windows'],
    requires: 'Видеокарта AMD + пакет Adrenalin',
    pros: [
      'Аппаратное кодирование (AMF)',
      'Инстант‑реплей, оверлей',
    ],
    cons: [
      'Только для видеокарт AMD',
    ],
    tips: [
      'Откройте Adrenalin → Захват и трансляция → Запись',
      'Выберите MP4 (H.264) и 1080p 30–60 fps',
    ],
  },
  {
    id: 'bandicam',
    name: 'Bandicam',
    site: 'https://www.bandicam.com/downloads/',
    platforms: ['Windows'],
    pros: [
      'Простой интерфейс, запись области экрана',
      'Поддержка веб‑камеры и наложений',
    ],
    cons: [
      'Платная лицензия, водяной знак в пробной версии',
    ],
    tips: [
      'Вывод MP4 (H.264 + AAC), фиксированные горячие клавиши (F12 по умолчанию)',
    ],
  },
  {
    id: 'camtasia',
    name: 'Camtasia',
    site: 'https://www.techsmith.com/download/camtasia/',
    platforms: ['Windows', 'macOS'],
    pros: [
      'Встроенный редактор видео',
      'Хорош для обучающих роликов',
    ],
    cons: [
      'Платная, тяжелее по ресурсам',
    ],
    tips: [
      'Запись в высоком качестве, монтаж и экспорт в MP4',
    ],
  },
  {
    id: 'sharex',
    name: 'ShareX (Видео/GIF)',
    site: 'https://getsharex.com/',
    platforms: ['Windows'],
    pros: [
      'Легкая запись области экрана',
      'Быстрые GIF/отрывки, автоматическая загрузка',
      'Бесплатно',
    ],
    cons: [
      'Не так стабильно для длинных записей',
      'Нужно установить кодеки (FFmpeg) для видео',
    ],
    tips: [
      'Настройки → Захват экрана → Установить FFmpeg внутри ShareX',
      'Формат MP4 для длинных видео, GIF для коротких',
    ],
  },
];

export function getRecorder(id: string) {
  return recorders.find(r => r.id === id);
}

