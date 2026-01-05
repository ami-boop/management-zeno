export const API_VERSION = 'v1'

export const API_URL = `https://api-ag7er5qhga-ew.a.run.app/${API_VERSION}`

export const GRADES = [
    { key: 'alef', hebrew: 'א׳' },
    { key: 'bet', hebrew: 'ב׳' },
    { key: 'gimel', hebrew: 'ג׳' },
    { key: 'dalet', hebrew: 'ד׳' },
    { key: 'he', hebrew: 'ה׳' },
    { key: 'vav', hebrew: 'ו׳' },
    { key: 'zayin', hebrew: 'ז׳' },
    { key: 'het', hebrew: 'ח׳' },
    { key: 'tet', hebrew: 'ט׳' },
    { key: 'yud', hebrew: 'י׳' },
    { key: 'yud_alef', hebrew: 'יא׳' },
    { key: 'yud_bet', hebrew: 'יב׳' },
  ]

export const PROFILES = [
    { key: 'physics_computers', label: 'פיזיקה-מחשבים' },
    { key: 'chemistry_biology', label: 'כימיה-ביולוגיה' },
    { key: 'theatron', label: 'תיאטרון' },
    { key: 'art_design', label: 'יצוב אמנות' },
]

export const cacheTTL = {
    students: 60 * 60 * 3,
    routes: 60 * 60 * 3
}

export const DAY_KEYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

export const EXAMPLE_ROUTES = [
    { id: 'ROUTE-A', name: 'Route A' },
    { id: 'ROUTE-B', name: 'Route B' },
    { id: 'ROUTE-C', name: 'Route C' },
    { id: 'ROUTE-D', name: 'Route D' },
    { id: 'ROUTE-E', name: 'Route E' },
]