# time/ — единый модуль времени (Intl-реализация, браузер)

Контракт и план: `Zeno/Планирование/План закрытия открытых вопросов.md` (пункт 1).
Канонические векторы: `vectors.json` (копия мастера из `Zeno-functions/.../time/`).

`schedule-times.ts` (`todayInIsrael`, timeline) — schedule-домен, не время:
реэкспортит отсюда, сам ничего зонного не считает. ESLint-гард (`eslint.config.mjs`)
запрещает `dayjs/plugin/timezone` и голый `toLocaleTimeString` вне этой папки.

Близнецы: `Zeno-functions/.../time/`, `zeno/src/lib/time/`,
`zeno-app/src/lib/time/`. Конвенция неоднозначности: fold → первое вхождение,
gap → сдвиг вперёд. Тесты: `__tests__/vectors.test.ts`.
