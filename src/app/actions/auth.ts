'use server'

import { cookies } from 'next/headers'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { validateEmail, validatePassword } from '@/lib/validation'

export interface LoginFormState {
	error?: string
	success?: boolean
}

export async function loginAction(
	prevState: LoginFormState,
	formData: FormData
): Promise<LoginFormState> {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	// validate input data
	if (!validateEmail(email)) {
		return { error: 'invalidEmail' }
	}

	if (!validatePassword(password)) {
		return { error: 'shortPassword' }
	}

	try {
		const sanitizedEmail = email
		const sanitizedPassword = password

		const userCredential = await signInWithEmailAndPassword(
			auth,
			sanitizedEmail,
			sanitizedPassword
		)

		const user = userCredential.user
		const idToken = await user.getIdToken(true)

		// check user role
		const userCheckRes = await fetch(
			'https://verifyadminrole-ag7er5qhga-ew.a.run.app',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`,
				},
			}
		)

		const userCheckResult = await userCheckRes.json()

		if (!userCheckRes.ok) {
			if (userCheckResult.accessDenied) {
				await auth.signOut()
				return { error: 'accessDenied' }
			}
			return { error: 'genericError' }
		}

		const setTokenRes = await fetch(
			'https://settoken-ag7er5qhga-ew.a.run.app',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`,
				},
			}
		)

		if (!setTokenRes.ok) {
			return { error: 'Failed to create session' }
		}

		const tokenResult = await setTokenRes.json()

		const cookieStore = await cookies()
		if (tokenResult.sessionCookie) {
			cookieStore.set('managementSessionCookie', tokenResult.sessionCookie, {
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				maxAge: Math.floor(tokenResult.expiresIn / 1000),
				path: '/',
			})
		}

		return { success: true }
	} catch (error: any) {
		switch (error.code) {
			case 'auth/user-not-found':
				return { error: 'userNotFound' }
			case 'auth/wrong-password':
				return { error: 'wrongPassword' }
			case 'auth/invalid-credential':
				return { error: 'invalidCredential' }
			case 'auth/invalid-email':
				return { error: 'invalidEmail' }
			case 'auth/too-many-requests':
				return { error: 'tooManyRequests' }
			case 'auth/user-disabled':
				return { error: 'userDisabled' }
			default:
				return { error: 'genericError' }
		}
	}
}
