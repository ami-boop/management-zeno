import { validateEmail, validatePassword } from '@/lib/validation'

export default function inputValidation(email: string, password: string) {
	// validate input data
	if (!validateEmail(email)) {
		return { error: 'invalidEmail' }
	}

	if (!validatePassword(password)) {
		return { error: 'shortPassword' }
	}

	return { sanitizedEmail: email, sanitizedPassword: password }
}
