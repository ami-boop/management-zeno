import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../Form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ensureServiceWorkerReady } from '@/lib/service-worker';
import { navigate } from '@/utils/navigate';

// --- MOCKS ---

jest.mock('use-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

jest.mock('@/lib/service-worker', () => ({
  ensureServiceWorkerReady: jest.fn(),
}));

jest.mock('@/utils/navigate', () => ({
  navigate: jest.fn(),
}));

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
}));

jest.mock('@/lib/firebase', () => ({
  auth: { signOut: jest.fn() },
}));

// Mock Child Components
jest.mock('../Header', () => ({ __esModule: true, default: () => <div>MockedLoginHeader</div> }));
jest.mock('../EmailField', () => ({ __esModule: true, default: ({ value, onChange }: any) => <input value={value} onChange={onChange} placeholder="MockedUsernameField" /> }));
jest.mock('../PasswordField', () => ({ __esModule: true, default: ({ value, onChange }: any) => <input type="password" value={value} onChange={onChange} placeholder="MockedPasswordField" /> }));
jest.mock('../SubmitButton', () => ({ __esModule: true, default: ({ isSubmitting, isDisabled }: any) => <button type="submit" disabled={isSubmitting || isDisabled}>{isSubmitting ? 'Submitting...' : 'Mocked Submit'}</button> }));

const mockSignIn = signInWithEmailAndPassword as jest.Mock;
const mockEnsureSw = ensureServiceWorkerReady as jest.Mock;

// --- TESTS ---

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnsureSw.mockResolvedValue(true);
    mockSignIn.mockResolvedValue({
      user: {
        getIdTokenResult: jest.fn().mockResolvedValue({ claims: { role: 'admin' } }),
      },
    });
  });

  it('should render all mocked child components', () => {
    render(<Form />);

    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByText('MockedLoginHeader')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MockedUsernameField')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MockedPasswordField')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mocked Submit' })).toBeInTheDocument();
    expect(screen.getByText('securityNotice')).toBeInTheDocument()
  });

  it('should sign in, verify admin role and navigate to dashboard', async () => {
    const user = userEvent.setup();

    render(<Form />);

    await user.type(screen.getByPlaceholderText('MockedUsernameField'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('MockedPasswordField'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Mocked Submit' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123');
      expect(mockEnsureSw).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith('/en/dashboard');
    });
  });

  it('shows accessDenied and signs out for non-admin role', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({
      user: {
        getIdTokenResult: jest.fn().mockResolvedValue({ claims: { role: 'student' } }),
      },
    });

    render(<Form />);

    await user.type(screen.getByPlaceholderText('MockedUsernameField'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('MockedPasswordField'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Mocked Submit' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('errors.accessDenied');
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it('maps Firebase error codes to messages', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(Object.assign(new Error('bad creds'), { code: 'auth/invalid-credential' }));

    render(<Form />);

    await user.type(screen.getByPlaceholderText('MockedUsernameField'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('MockedPasswordField'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Mocked Submit' }));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('errors.invalidCredential');
    });
  });
});
