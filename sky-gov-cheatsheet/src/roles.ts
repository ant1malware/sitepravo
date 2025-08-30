export interface Role {
  id: string;
  role: string;
  salary: string;
  duties: string[];
  source: string;
}

export const rolesData: Role[] = [
  {
    id: "guard",
    role: "Охранник (1)",
    salary: "18.000 руб.",
    duties: [
      "Стоять на постах A1–E2, контролировать поток в здание и безопасность сотрудников",
      "Сопровождать сотрудников (с должности Адвокат) и охранять кабинеты",
      "Докладывать по регламенту (заступил/продолжаю/закончил пост; начал/веду/закончил охрану)"
    ],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "chief-guard",
    role: "Начальник охраны (2)",
    salary: "20.000 руб.",
    duties: [
      "Распределяет посты и смены охраны",
      "Контролирует соблюдение уставной формы и дисциплины связи"
    ],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "lawyer",
    role: "Адвокат (3)",
    salary: "23.000 руб.",
    duties: [
      "Юридическая помощь заключённым; дежурство в комнате свиданий",
      "Доклады: начало/продолжаю/закончил помощь; дежурство в КС",
      "Задания для зачёта: консультации, УДО и др. (см. критерии/отчёт)"
    ],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "inspector",
    role: "Инспектор (4)",
    salary: "26.000 руб.",
    duties: [
      "Контроль собеседований; выездные проверки постов ГАИ/УМВД",
      "Дежурство за стойкой регистрации; ведение отчётности",
      "Участвует в государственных проверках (см. правила)"
    ],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "advisor",
    role: "Советник (5)",
    salary: "29.000 руб.",
    duties: ["Участие и координация проверок; методическая помощь отделам"],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "deputy-minister",
    role: "Заместитель министра (6)",
    salary: "32.000 руб.",
    duties: [
      "Снятие судимостей гражданам (право с этой должности)",
      "Организация и приём отчётности подразделений"
    ],
    source: "https://forum.amazing-online.com/threads/uchebnye-materialy-dlja-sotrudnikov-pravitelstvennogo-apparata.1065800/",
  },
  {
    id: "minister",
    role: "Министр (7)",
    salary: "35.000 руб.",
    duties: [
      "Организует государственные проверки (инициатор)",
      "Распоряжения в пределах департамента"
    ],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "admin-chief",
    role: "Глава администрации (8)",
    salary: "38.000 руб.",
    duties: ["Операционное управление правительственным аппаратом"],
    source: "https://forum.amazing-online.com/threads/informacionnyj-razdel-organizacii-pravitelstvo.1027737/",
  },
  {
    id: "vice-governor",
    role: "Вице-губернатор (9)",
    salary: "41.000 руб.",
    duties: ["Высшее руководство, указы, взаимодействие с ФСБ/ВЧ/ЕСС/МВД"],
    source: "https://forum.amazing-online.com/threads/ugolovnyj-kodeks.1027637/",
  },
  {
    id: "governor",
    role: "Губернатор (10)",
    salary: "45.000 руб.",
    duties: [
      "Общее руководство; указы/постановления; награждения по итогам проверок"
    ],
    source: "https://forum.amazing-online.com/threads/ukazy-postanovlenija-rasporjazhenija-gubernatora-nizhegorodskoj-oblasti.1027740/",
  },
];
