import { listSections, createSection, listTopics, createTopic, updateTopic } from '../store/forumRemote';

export type SeedResult = { createdSections: number; createdTopics: number };

// Idempotent seed with starter topics (RU content)
const SECTIONS: Array<{ title: string; description: string; icon?: string; topics: Array<{ title: string; content: string }> }> = [
  { title: 'Объявления', description: 'Новости, релизы, TL;DR, дорожная карта', icon: '??', topics: [
    { title: 'Добро пожаловать!', content: 'Этот раздел для важных объявлений: релизы, TL;DR и планы.' },
    { title: 'Дорожная карта', content: 'Обрисовываем ближайшие цели и приоритеты.' },
  ]},
  { title: 'Правила и FAQ', description: 'Правила поведения и ответы на часто задаваемые вопросы', icon: '??', topics: [
    { title: 'Правила форума', content: 'Будьте вежливы. Не нарушайте закон. Уважайте собеседников.' },
    { title: 'FAQ: как начать', content: 'Регистрация, вход, роли и базовые возможности форума.' },
    { title: 'Как задавать вопросы', content: 'Покажите, что уже пробовали; давайте код, скриншоты, ссылки.' },
  ]},
  { title: 'Общий', description: 'Обсуждения по любым темам', icon: '??', topics: [
    { title: 'Привет! Представьтесь', content: 'Пара слов о себе — чем занимаетесь и почему вы здесь.' },
    { title: 'Идеи и предложения', content: 'Что улучшить в форуме и продукте? Делитесь мыслями.' },
  ]},
  { title: 'Вопросы и помощь', description: 'Q&A, лучшие ответы, помощь друг другу', icon: '?', topics: [
    { title: 'Как получить помощь эффективно', content: 'Описываем контекст, ожидаемое и фактическое поведение; приложите логи.' },
  ]},
  { title: 'Гайды', description: 'Пошаговые инструкции, туториалы и полезные материалы', icon: '??', topics: [
    { title: 'Как оформить гайд', content: 'Структура: цель, шаги, примеры, ссылки, итог.' },
    { title: 'Гайд: оформление вопроса', content: 'Заголовок по существу, суть проблемы, что пробовали, код/скриншоты.' },
    { title: 'Полезные ссылки', content: 'Подборка ресурсов: документация, форумы, чаты, видео.' },
  ]},
  { title: 'Шоукейс', description: 'Демонстрация проектов и результатов', icon: '??', topics: [
    { title: 'Покажите ваш проект', content: 'Скриншоты, краткое описание, технологии и ссылка.' },
    { title: '?? Галерея проектов сообщества', content: 'Подборка лучших работ участников с краткими описаниями.' },
  ]},
  { title: 'Оффтоп', description: 'Неформальные темы и разговоры', icon: '??', topics: [
    { title: 'Кофе-брейк', content: 'Музыка, фильмы, оффтоп — без политики и холиваров.' },
  ]},
  { title: 'Workshop', description: 'Проекты сообщества: цели, прогресс, ревью', icon: '???', topics: [
    { title: '[WIP] Стартую проект', content: '# Проект: Название\n\n## Цели\n- ...\n\n## Технологии\n- ...\n\n## Прогресс\n- [ ] Шаг 1\n- [ ] Шаг 2\n\n## Ссылка\n- https://example.com' },
  ]},
];

export async function seedForum(): Promise<SeedResult> {
  const existing = await listSections();
  let createdSections = 0, createdTopics = 0;
  for (const s of SECTIONS) {
    let sec = (existing || []).find(x => (x.title || '').toLowerCase() === s.title.toLowerCase());
    if (!sec) {
      try { sec = await createSection({ title: s.title, description: s.description, icon: s.icon }); createdSections++; } catch {}
    }
    if (!sec) continue;
    try {
      const topics = await listTopics(sec.id);
      const titles = new Set((topics||[]).map(t => (t.title||'').toLowerCase()));
      for (const t of s.topics) {
        if (!titles.has(t.title.toLowerCase())) {
          try { await createTopic({ sectionId: sec.id, title: t.title, content: t.content }); createdTopics++; } catch {}
        }
      }
    } catch {}
  }

  // Ensure pinned VIP info topic in «Объявления»
  try {
    const sections = await listSections();
    const ann = (sections||[]).find(s => (s.title||'').toLowerCase() === 'объявления');
    if (ann) {
      const topics = await listTopics(ann.id);
      let vip = topics.find(t => /vip/i.test(String(t.title||'')));
      if (!vip) {
        vip = await createTopic({ sectionId: ann.id, title: 'VIP: как получить', content: 'Чтобы получить VIP статус, напишите мне в Telegram: https://t.me/pavel\n\nПреимущества VIP:\n- Отметка VIP в профиле\n- Приоритет обратной связи\n- Увеличенные лимиты в некоторых разделах\n- Визуальные улучшения форума' });
      }
      if (vip && !vip.pinned) { try { await updateTopic(vip.id, { pinned: true }); } catch {} }
    }
  } catch {}

  return { createdSections, createdTopics };
}
