# Zeno Design System

Версия: 1.0  
Статус: текущая рабочая система интерфейса  
Источники реализации: `tailwind.config.mjs`, `src/styles/globals.css`, компоненты в `src/components/`

## 1. Назначение

Zeno — спокойный, понятный интерфейс для школьного транспорта и повседневных действий ученика. Система должна помогать быстро ответить на три вопроса:

- Что происходит сегодня?
- Какое действие нужно выполнить сейчас?
- Где найти расписание, профиль или помощь?

Визуальный язык сочетает тёмный сине-графитовый цвет, тёплый янтарный акцент и мягкий шалфейный вторичный цвет. Интерфейс должен ощущаться надёжным, человеческим и собранным, без визуального шума.

## 2. Принципы

### Спокойная иерархия

Один главный фокус на экран. На Dashboard это departure board, на Report — выбор способа поездки и времени, на Profile — данные ученика.

### Ясность перед декоративностью

Сначала показываем статус, время, маршрут и следующий шаг. Анимация, фоновые формы и иллюстративные эффекты не должны конкурировать с содержанием.

### Тёплые акценты для действий

Янтарный используется для выбранного состояния, primary action, важных временных значений и подтверждений. Он не используется как общий фон всего интерфейса.

### Данные должны иметь состояние

Пустые или недоступные данные не маскируются нулями и случайными placeholder-значениями. Используются loading, empty, error и success states с понятным следующим действием.

### Локализация по умолчанию

Любой пользовательский текст проходит через `next-intl`. Поддерживаемые локали: `en`, `ru`, `he`. Layout должен выдерживать RTL для Hebrew.

## 3. Цветовые токены

Токены определены в `tailwind.config.mjs` и доступны через классы `text-zeno-*`, `bg-zeno-*`, `border-zeno-*`.

| Токен | HEX | Назначение |
| --- | --- | --- |
| `zeno-ink` | `#15232d` | Основной текст, primary buttons, dark board |
| `zeno-ink-soft` | `#40515c` | Вторичный текст, labels, supporting copy |
| `zeno-muted` | `#74818a` | Tertiary text, metadata, disabled content |
| `zeno-paper` | `#f5f7f8` | Основной фон страниц |
| `zeno-paper-soft` | `#f8faf9` | Мягкие поверхности и hover background |
| `zeno-amber` | `#f4b860` | Primary accent, selection, CTA, time highlight |
| `zeno-amber-deep` | `#b77a13` | Контрастный amber text на светлом фоне |
| `zeno-amber-ink` | `#795313` | Текст на cream/amber surfaces |
| `zeno-sage` | `#486b58` | Secondary accent, positive state, navigation affordance |
| `zeno-sage-soft` | `#eef3f0` | Sage backgrounds, hover, icon containers |
| `zeno-line` | `#dfe5e8` | Основные borders и dividers |
| `zeno-line-strong` | `#c8d6dc` | Hover borders и усиленные разделители |
| `zeno-cream` | `#fff8e8` | Warning/security surface |
| `zeno-cream-surface` | `#fffdf7` | Мягкий amber surface |
| `zeno-danger` | `#b42318` | Error text and error borders |
| `zeno-danger-soft` | `#fef3f2` | Error backgrounds |

### Цветовые правила

- Основной текст: `text-zeno-ink`.
- Вторичный текст: `text-zeno-ink-soft`.
- Metadata и eyebrow: `text-zeno-muted`.
- Основной фон: `bg-zeno-paper`.
- Белые cards: `bg-white` с `border-zeno-line`.
- Primary action: `zeno-primary` или `bg-zeno-ink text-white`.
- Focus ring: `ring-zeno-amber`.
- Ошибки: `zeno-danger` и `zeno-danger-soft`, не amber.

Не добавлять новые hex-значения в компоненты без расширения токенов в `tailwind.config.mjs`.

## 4. Типографика

### Шрифты

- Основной: `Inter Variable`.
- Для Hebrew fallback: `Noto Sans Hebrew`.
- Display: `Unbounded Variable`, затем `Suez One`, затем основной sans.
- CSS-источник: `src/styles/globals.css`.
- Tailwind aliases: `font-sans` и `font-display`.

### Иерархия

| Роль | Рекомендуемый стиль |
| --- | --- |
| Display hero | `font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight` |
| Page title | `text-3xl sm:text-4xl font-bold tracking-tight` |
| Section title | `text-xl/text-2xl font-bold tracking-tight` |
| Body | `text-sm` или `text-base`, `leading-6` для длинного текста |
| Label | `text-sm font-semibold text-zeno-ink-soft` |
| Kicker/eyebrow | `zeno-kicker` |
| Numeric emphasis | `font-bold tabular-nums` |

`zeno-kicker` автоматически задаёт маленький uppercase label с увеличенным letter spacing. Для времени, счётчиков и расписания использовать `tabular-nums`.

## 5. Геометрия и поверхности

### Радиусы

- `rounded-zeno`: `1.5rem` — стандартный card.
- `rounded-zeno-lg`: `2rem` — крупный hero/departure board.
- `rounded-zeno-sm`: `0.75rem` — компактная поверхность.
- `rounded-2xl`: выборочные интерактивные tiles и secondary surfaces.
- `rounded-xl`: controls, inputs, buttons.
- `rounded-full`: status dots, avatar, pill badges.

### Тени

- `shadow-zeno-card`: мягкая тень стандартной карточки.
- `shadow-zeno-board`: глубокая тень главного departure board.
- `shadow-sm`: только для компактных control surfaces.

### Базовые классы

Определены в `src/styles/globals.css`:

```tsx
<main className="zeno-page">
  <section className="zeno-card p-6">
    <p className="zeno-kicker">Status</p>
    <h2 className="mt-2 text-2xl font-bold tracking-tight text-zeno-ink">
      Today
    </h2>
  </section>
</main>
```

- `zeno-page`: фон страницы и основной цвет текста.
- `zeno-card`: белая карточка с border, radius и мягкой тенью.
- `zeno-kicker`: uppercase metadata label.
- `zeno-focus`: единый keyboard focus treatment.
- `zeno-primary`: тёмная primary button surface с hover/active поведением.

## 6. Компоненты и паттерны

### Header

Реализация: `src/components/Header.tsx`.

- Desktop navigation скрыта на mobile.
- Mobile navigation открывается через `Sheet`.
- Navigation link: `text-zeno-ink-soft`, hover `bg-zeno-sage-soft`.
- Header имеет нижний divider `border-zeno-line`.
- Язык и профиль остаются доступны на desktop и mobile.

### Departure board

Реализация: `src/components/dashboard/TodayTicket.tsx`.

- Используется один крупный dark surface: `bg-zeno-ink`.
- Радиус: `rounded-zeno-lg`.
- Главное время — крупное, `tabular-nums`, белое.
- Amber показывает активный статус, выбранное время и actionable CTA.
- Вторичный текст на dark surface — `text-zeno-line-strong`.

### Cards

Базовый card должен начинаться с `zeno-card`, а не с локальной комбинации цветов и тени.

- Padding: `p-4` для compact, `p-6`/`p-7` для content card.
- Заголовок слева, supporting icon справа допустим.
- Внутренние блоки используют `rounded-2xl` и `bg-zeno-paper-soft`.
- Ссылки и action rows отделяются `border-t border-zeno-line`.

### Quick actions

Реализация: `src/components/dashboard/QuickActions.tsx`.

- Использовать сетку интерактивных cards.
- Icon container: `bg-zeno-sage-soft text-zeno-sage`.
- Hover: `border-zeno-line-strong` и `bg-zeno-paper-soft`.
- Вся card должна быть keyboard-accessible link/button.
- Стрелка `ArrowUpRight` может усиливаться на hover.

### Forms и controls

- Input: `rounded-xl border border-zeno-line px-3 py-3 text-sm`.
- Label: `text-sm font-semibold text-zeno-ink-soft`.
- Focus: amber border или `zeno-focus` с amber ring.
- Primary submit: тёмный фон, белый текст, disabled `bg-zeno-line text-zeno-muted`.
- Selected option: `bg-zeno-ink text-white` с amber icon container.
- Unavailable option: dashed border, paper background, muted text.

### Data states

Реализация общего error state: `src/components/ui/DataErrorState.tsx`.

- Error container использует `role="alert"`.
- Error title — `text-zeno-ink`, eyebrow — `text-zeno-danger`.
- Description должна объяснять проблему без технических деталей.
- Action должен быть конкретным: reload, retry или navigation.
- Empty state не должен выглядеть как ошибка, если отсутствие данных ожидаемо.

### Success state

Для подтверждённых действий используется sage:

- `bg-zeno-sage-soft` для icon container.
- `text-zeno-sage` для icon/status.
- Подтверждённое значение может быть показано на `bg-zeno-ink` с `text-zeno-amber`.

## 7. Motion

Анимация должна поддерживать ориентацию и обратную связь, а не добавлять шум.

- Основная easing curve: `cubic-bezier(0.22, 1, 0.36, 1)`, alias `ease-zeno`.
- Hover/active transitions обычно занимают `180–220ms`.
- Page entrance: короткий fade/translate, примерно `220–450ms`.
- Stagger использовать только для небольших групп.
- Spring допустим для selection indicator и success confirmation.
- Marquee: `.zeno-marquee-track`, 26 секунд, linear.
- Для `prefers-reduced-motion: reduce` отключать marquee и smooth scroll.
- Motion не должна скрывать текст или задерживать доступ к действию.

## 8. Accessibility

- Каждый интерактивный элемент должен быть доступен с клавиатуры.
- Использовать видимый amber focus ring, не убирать `outline` без альтернативы.
- Иконки без текста должны иметь accessible label или быть внутри подписанного control.
- Error и asynchronous feedback должны использовать `role="alert"` там, где это нужно.
- Контраст текста проверять на фактической паре foreground/background.
- Не передавать смысл только через цвет: добавлять текст, иконку или состояние.
- Touch target для основных кнопок и navigation controls — не менее примерно `40px`.
- Поддерживать RTL: не привязывать layout к `left/right`, если подходит logical direction.

## 9. Responsive behavior

- Mobile — основной сценарий для быстрых действий и расписания.
- Desktop может добавлять горизонтальную навигацию и двухколоночные layouts.
- Использовать `sm`, `md`, `lg`, `xl` только для реального изменения композиции.
- Не уменьшать главный CTA до нечитабельного размера на mobile.
- Departure board и forms должны оставаться читаемыми при узкой ширине.
- Для сложных таблиц/маршрутов предпочтительны stacked cards и горизонтально понятная timeline.

## 10. Иконки и иллюстрации

- Основной источник UI icons — `lucide-react`.
- Иконки используют `zeno-sage` для вторичного действия и `zeno-amber` для активного состояния.
- Декоративные waves, particles и mesh допустимы на landing/login, но не должны ухудшать readability.
- Иконка должна быть функционально связана с текстом, а не использоваться как случайная декорация.

## 11. Implementation rules

### Использовать

- `zeno-*` color tokens вместо hardcoded hex и generic gray palette.
- `zeno-card`, `zeno-focus`, `zeno-primary` для повторяющихся паттернов.
- `next-intl` для пользовательского текста.
- `DataErrorState` или эквивалентный state pattern для API ошибок.
- `tabular-nums` для времени и числовых значений.

### Не использовать

- Новые локальные цвета, если существующий token подходит.
- Случайные shadows/radii для одинаковых типов surfaces.
- Нулевые значения как замену отсутствующим данным.
- Анимацию, которая маскирует loading или ошибку.
- Текст напрямую в JSX, если он виден пользователю и должен быть локализован.

## 12. Source map

- `tailwind.config.mjs` — цветовые, font, radius, shadow и easing tokens.
- `src/styles/globals.css` — Tailwind entrypoint, base styles, semantic classes и motion rules.
- `src/components/Header.tsx` — responsive navigation.
- `src/components/dashboard/TodayTicket.tsx` — departure board.
- `src/components/dashboard/RouteCard.tsx` — route summary card.
- `src/components/dashboard/QuickActions.tsx` — action cards.
- `src/components/ui/DataErrorState.tsx` — shared error state.
- `src/components/report/ReportForm.tsx` — form, option selection и time picker.
- `src/components/report/ReportSuccess.tsx` — success state.
- `src/components/schedule/` — day navigation, timeline и schedule surfaces.
- `src/components/profile/` — profile header, contacts, transport и actions.
- `messages/en.json`, `messages/ru.json`, `messages/he.json` — localized copy.

## 13. Definition of done для нового экрана

- Есть один понятный primary focus.
- Все цвета используют Zeno tokens.
- Для карточек, focus и primary CTA используются существующие базовые классы.
- Есть responsive layout для mobile и desktop.
- Есть loading/empty/error/success states по необходимости.
- Все пользовательские строки локализованы в `en`, `ru`, `he`.
- Keyboard focus и contrast проверены.
- Motion учитывает `prefers-reduced-motion`.
- Тесты проверяют ключевые интерактивные и error flows.
