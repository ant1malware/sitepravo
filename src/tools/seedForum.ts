import { listSections, createSection, listTopics, createTopic, updateTopic } from '../store/forumRemote';

export type SeedResult = { createdSections: number; createdTopics: number };

// Idempotent seed with starter topics (RU content)
const SECTIONS: Array<{ title: string; description: string; icon?: string; topics: Array<{ title: string; content: string }> }> = [
  { title: 'Îáúÿâëåíèÿ', description: 'Íîâîñòè, ðåëèçû, TL;DR, äîðîæíàÿ êàðòà', icon: '??', topics: [
    { title: 'Äîáðî ïîæàëîâàòü!', content: 'Ýòîò ðàçäåë äëÿ âàæíûõ îáúÿâëåíèé: ðåëèçû, TL;DR è ïëàíû.' },
    { title: 'Äîðîæíàÿ êàðòà', content: 'Îáðèñîâûâàåì áëèæàéøèå öåëè è ïðèîðèòåòû.' },
  ]},
  { title: 'Ïðàâèëà è FAQ', description: 'Ïðàâèëà ïîâåäåíèÿ è îòâåòû íà ÷àñòî çàäàâàåìûå âîïðîñû', icon: '??', topics: [
    { title: 'Ïðàâèëà ôîðóìà', content: 'Áóäüòå âåæëèâû. Íå íàðóøàéòå çàêîí. Óâàæàéòå ñîáåñåäíèêîâ.' },
    { title: 'FAQ: êàê íà÷àòü', content: 'Ðåãèñòðàöèÿ, âõîä, ðîëè è áàçîâûå âîçìîæíîñòè ôîðóìà.' },
    { title: 'Êàê çàäàâàòü âîïðîñû', content: 'Ïîêàæèòå, ÷òî óæå ïðîáîâàëè; äàâàéòå êîä, ñêðèíøîòû, ññûëêè.' },
  ]},
  { title: 'Îáùèé', description: 'Îáñóæäåíèÿ ïî ëþáûì òåìàì', icon: '??', topics: [
    { title: 'Ïðèâåò! Ïðåäñòàâüòåñü', content: 'Ïàðà ñëîâ î ñåáå — ÷åì çàíèìàåòåñü è ïî÷åìó âû çäåñü.' },
    { title: 'Èäåè è ïðåäëîæåíèÿ', content: '×òî óëó÷øèòü â ôîðóìå è ïðîäóêòå? Äåëèòåñü ìûñëÿìè.' },
  ]},
  { title: 'Âîïðîñû è ïîìîùü', description: 'Q&A, ëó÷øèå îòâåòû, ïîìîùü äðóã äðóãó', icon: '?', topics: [
    { title: 'Êàê ïîëó÷èòü ïîìîùü ýôôåêòèâíî', content: 'Îïèñûâàåì êîíòåêñò, îæèäàåìîå è ôàêòè÷åñêîå ïîâåäåíèå; ïðèëîæèòå ëîãè.' },
  ]},
  { title: 'Ãàéäû', description: 'Ïîøàãîâûå èíñòðóêöèè, òóòîðèàëû è ïîëåçíûå ìàòåðèàëû', icon: '??', topics: [
    { title: 'Êàê îôîðìèòü ãàéä', content: 'Ñòðóêòóðà: öåëü, øàãè, ïðèìåðû, ññûëêè, èòîã.' },
    { title: 'Ãàéä: îôîðìëåíèå âîïðîñà', content: 'Çàãîëîâîê ïî ñóùåñòâó, ñóòü ïðîáëåìû, ÷òî ïðîáîâàëè, êîä/ñêðèíøîòû.' },
    { title: 'Ïîëåçíûå ññûëêè', content: 'Ïîäáîðêà ðåñóðñîâ: äîêóìåíòàöèÿ, ôîðóìû, ÷àòû, âèäåî.' },
  ]},
  { title: 'Øîóêåéñ', description: 'Äåìîíñòðàöèÿ ïðîåêòîâ è ðåçóëüòàòîâ', icon: '??', topics: [
    { title: 'Ïîêàæèòå âàø ïðîåêò', content: 'Ñêðèíøîòû, êðàòêîå îïèñàíèå, òåõíîëîãèè è ññûëêà.' },
    { title: '?? Ãàëåðåÿ ïðîåêòîâ ñîîáùåñòâà', content: 'Ïîäáîðêà ëó÷øèõ ðàáîò ó÷àñòíèêîâ ñ êðàòêèìè îïèñàíèÿìè.' },
  ]},
  { title: 'Îôôòîï', description: 'Íåôîðìàëüíûå òåìû è ðàçãîâîðû', icon: '??', topics: [
    { title: 'Êîôå-áðåéê', content: 'Ìóçûêà, ôèëüìû, îôôòîï — áåç ïîëèòèêè è õîëèâàðîâ.' },
  ]},
  { title: 'Workshop', description: 'Ïðîåêòû ñîîáùåñòâà: öåëè, ïðîãðåññ, ðåâüþ', icon: '???', topics: [
    { title: '[WIP] Ñòàðòóþ ïðîåêò', content: '# Ïðîåêò: Íàçâàíèå\n\n## Öåëè\n- ...\n\n## Òåõíîëîãèè\n- ...\n\n## Ïðîãðåññ\n- [ ] Øàã 1\n- [ ] Øàã 2\n\n## Ññûëêà\n- https://example.com' },
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

        vip = await createTopic({ sectionId: ann.id, title: 'VIP:  ', content: '  VIP ,    Форум: раздел "Инвайты"\n\n VIP:\n-  VIP  \n-   \n-     \n-   ' });
  try {
    const sections = await listSections();
    const ann = (sections||[]).find(s => (s.title||'').toLowerCase() === 'îáúÿâëåíèÿ');
    if (ann) {
      const topics = await listTopics(ann.id);
      let vip = topics.find(t => /vip/i.test(String(t.title||'')));
      if (!vip) {
        vip = await createTopic({ sectionId: ann.id, title: 'VIP: êàê ïîëó÷èòü', content: '×òîáû ïîëó÷èòü VIP ñòàòóñ, íàïèøèòå ìíå â Telegram: https://t.me/pavel\n\nÏðåèìóùåñòâà VIP:\n- Îòìåòêà VIP â ïðîôèëå\n- Ïðèîðèòåò îáðàòíîé ñâÿçè\n- Óâåëè÷åííûå ëèìèòû â íåêîòîðûõ ðàçäåëàõ\n- Âèçóàëüíûå óëó÷øåíèÿ ôîðóìà' });
      }
      if (vip && !vip.pinned) { try { await updateTopic(vip.id, { pinned: true }); } catch {} }
    }
  } catch {}

  return { createdSections, createdTopics };
}
