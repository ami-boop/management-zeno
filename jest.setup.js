import '@testing-library/jest-dom'
import { signInWithEmailAndPassword } from 'firebase/auth/web-extension'

// MSW временно отключен
// import { server } from './src/mocks/server'
// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(() => key => key),
  useLocale: jest.fn(() => 'en'),
}))

jest.mock('use-intl', () => ({
  useTranslations: jest.fn(() => key => key)
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Firebase
jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn()
}))

jest.mock('@/lib/firebase', () => ({
  auth: {},
}))

global.fetch = jest.fn()
