import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../Form';
import inputValidation from '@/app/actions/inputValidation';
import { validateEmail, validatePassword } from '@/lib/validation';
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- MOCKS ---

// Mock next-intl globally (assuming it's in jest.setup.js)

// Mock next/navigation to control router
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

// Mock server actions and validation
jest.mock('@/app/actions/inputValidation', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/lib/validation', () => ({
  validateEmail: jest.fn(() => true),
  validatePassword: jest.fn(() => true),
}));

// Mock Firebase auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(), // Also mock getAuth if it's used in @/lib/firebase
}));

// Mock Child Components
jest.mock('../Header', () => ({ __esModule: true, default: () => <div>MockedLoginHeader</div> }));
jest.mock('../EmailField', () => ({ __esModule: true, default: ({ value, onChange }: any) => <input value={value} onChange={onChange} placeholder="MockedUsernameField" /> }));
jest.mock('../PasswordField', () => ({ __esModule: true, default: ({ value, onChange }: any) => <input type="password" value={value} onChange={onChange} placeholder="MockedPasswordField" /> }));
jest.mock('../SubmitButton', () => ({ __esModule: true, default: ({ isSubmitting, isDisabled }: any) => <button type="submit" disabled={isSubmitting || isDisabled}>{isSubmitting ? 'Submitting...' : 'Mocked Submit'}</button> }));

// --- TESTS ---

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it('should submit the form with valid data and redirect on success', async () => {
    const user = userEvent.setup();

    // --- Arrange: Setup mock return values ---
    (inputValidation as jest.Mock).mockResolvedValue({
      sanitizedEmail: 'test@example.com',
      sanitizedPassword: 'password123',
    });
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { getIdToken: jest.fn().mockResolvedValue('test-token') },
    });

    render(<Form />);

    // --- Act: Simulate user input and form submission ---
    const emailInput = screen.getByPlaceholderText('MockedUsernameField');
    const passwordInput = screen.getByPlaceholderText('MockedPasswordField');
    const submitButton = screen.getByRole('button', { name: 'Mocked Submit' });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // --- Assert: Check if functions were called (redirect happens on server) ---
    await waitFor(() => {
      expect(validateEmail).toHaveBeenCalledWith('test@example.com');
      expect(validatePassword).toHaveBeenCalledWith('password123');
      expect(inputValidation).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({ method: 'POST' }));
    });
  });

  it('handles error correctly', async () => {
    (inputValidation as jest.Mock).mockResolvedValue(new Error('Error for test'));
    const user = userEvent.setup();
    render(<Form />);
    const submitButton = screen.getByRole('button', { name: 'Mocked Submit' });

    await user.click(submitButton)

    waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('errors.genericError')
    })
  })
});
