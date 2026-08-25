import { readFileSync, writeFileSync } from 'fs'

const template = readFileSync('src/service-worker.template.js', 'utf8')

const config = {
	__FIREBASE_API_KEY__: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	__FIREBASE_AUTH_DOMAIN__: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	__FIREBASE_PROJECT_ID__: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

for (const [placeholder, value] of Object.entries(config)) {
	if (!value) {
		console.error(`Missing env for ${placeholder}`)
		process.exit(1)
	}
}

let output = template
for (const [placeholder, value] of Object.entries(config)) {
	output = output.replaceAll(placeholder, value)
}

writeFileSync('public/service-worker.js', output)
console.log('service-worker.js generated')
