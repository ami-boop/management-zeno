// Enhanced XSS patterns to block (for passwords and general fields)
const XSS_PATTERNS = [
	// Script injection
	/<script[^>]*>/i,
	/<\/script>/i,
	/javascript:/i,
	/vbscript:/i,
	/data:/i,
	
	// Event handlers
	/on\w+\s*=/i,
	/\bon\w+\s*\(/i,
	
	// Function calls
	/\beval\s*\(/i,
	/\balert\s*\(/i,
	/\bprompt\s*\(/i,
	/\bconfirm\s*\(/i,
	/\bsetTimeout\s*\(/i,
	/\bsetInterval\s*\(/i,
	
	// DOM manipulation
	/document\.(write|writeln|cookie)/i,
	/window\.(location|open)/i,
	/innerHTML/i,
	/outerHTML/i,
	
	// CSS expression
	/expression\s*\(/i,
	/url\s*\(/i,
	
	// SQL injection (basic)
	/union\s+select/i,
	/drop\s+table/i,
	
	// Encoded variants
	/%3[cC]script/i, // <script
	/%6[aA]avascript/i, // javascript
	/\\u003[cC]/i, // Unicode <
	/\\x3[cC]/i, // Hex <
]

// Dangerous characters to block
const DANGEROUS_CHARS = /[<>"'`\\]/

// Unicode security patterns
const UNICODE_SECURITY_PATTERNS = [
	// Zero-width characters
	/[\u200B-\u200D\uFEFF]/,
	// Right-to-left override
	/[\u202A-\u202E]/,
	// Homograph attack characters (common confusables)
	/[\u0430\u043E\u0440\u0435\u0445\u0441]/g, // Cyrillic lookalikes
	// Control characters beyond ASCII
	/[\u0000-\u001F\u007F-\u009F]/,
]

/**
 * Securely validates an email address.
 * @param email - The email to validate.
 * @returns true if the email is valid and secure.
 */
export const validateEmail = (email: string): boolean => {
	// Check for null or undefined values
	if (!email || typeof email !== 'string') return false

	// Remove leading and trailing whitespace
	const trimmedEmail = email.trim()

	// Check length (RFC 5321)
	if (trimmedEmail.length > 254) return false

	// Basic email regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(trimmedEmail)) return false

	// Check for double dots
	if (trimmedEmail.includes('..')) return false

	// Check for dots at the beginning or end
	if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) return false

	// Check for spaces
	if (trimmedEmail.includes(' ')) return false

	// Check for null bytes
	if (trimmedEmail.includes('\0')) return false

	// Check for control characters and Unicode security issues
	if (/[\x00-\x1F\x7F-\x9F]/.test(trimmedEmail)) return false
	
	// Check for Unicode security patterns
	if (UNICODE_SECURITY_PATTERNS.some(pattern => pattern.test(trimmedEmail))) return false
	
	// Check for suspicious Unicode normalization
	if (trimmedEmail !== trimmedEmail.normalize('NFC')) return false

	return true
}

/**
 * Validates a password with XSS protection.
 * @param password - The password to validate.
 * @returns true if the password is valid and secure.
 */
export const validatePassword = (password: string): boolean => {
	// Check for null or undefined values
	if (!password || typeof password !== 'string') return false

	// Check password length (min 6, max 128 characters)
	if (password.length < 6) return false
	if (password.length > 128) return false

	// Check for null bytes
	if (password.includes('\0')) return false

	// Check for control characters and Unicode security issues
	if (/[\x00-\x1F\x7F-\x9F]/.test(password)) return false
	
	// Check for Unicode security patterns
	if (UNICODE_SECURITY_PATTERNS.some(pattern => pattern.test(password))) return false
	
	// Check for suspicious Unicode normalization
	if (password !== password.normalize('NFC')) return false

	// Check for XSS patterns
	if (XSS_PATTERNS.some(pattern => pattern.test(password))) return false

	// Check for dangerous characters
	if (DANGEROUS_CHARS.test(password)) return false

	return true
}

/**
 * Sanitizes input data with XSS protection.
 * @param input - The string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
	if (!input || typeof input !== 'string') return ''

	// Remove leading and trailing whitespace
	let sanitized = input.trim()

	// Remove null bytes
	sanitized = sanitized.replace(/\0/g, '')

	// Remove control characters and extended Unicode control chars
	sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
	
	// Remove Unicode security patterns
	UNICODE_SECURITY_PATTERNS.forEach(pattern => {
		sanitized = sanitized.replace(pattern, '')
	})
	
	// Normalize Unicode
	sanitized = sanitized.normalize('NFC')

	// Remove XSS patterns
	XSS_PATTERNS.forEach(pattern => {
		sanitized = sanitized.replace(pattern, '')
	})

	// Limit length
	if (sanitized.length > 1000) {
		sanitized = sanitized.substring(0, 1000)
	}

	return sanitized
}
