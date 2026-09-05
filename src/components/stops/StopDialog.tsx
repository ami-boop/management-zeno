'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createStop, updateStop } from '@/app/actions/stops'
import type { StopDetail, StopFormValues } from '@/lib/api-contracts'

interface StopDialogProps {
	open: boolean
	stop: StopDetail | null
	onClose: () => void
	onCreated: (stopId: string, values: StopFormValues) => void
	onEdited: (stopId: string, values: StopFormValues) => void
}

const inputClass =
	'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

function parseCoord(value: string, min: number, max: number): number | null | 'invalid' {
	if (!value.trim()) return null
	const parsed = Number(value)
	if (!Number.isFinite(parsed) || parsed < min || parsed > max) return 'invalid'
	return parsed
}

export default function StopDialog({ open, stop, onClose, onCreated, onEdited }: StopDialogProps) {
	const t = useTranslations('Stops')
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [lat, setLat] = useState('')
	const [lng, setLng] = useState('')
	const [notes, setNotes] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!open) return
		setName(stop?.name ?? '')
		setAddress(stop?.address ?? '')
		setLat(stop?.lat != null ? String(stop.lat) : '')
		setLng(stop?.lng != null ? String(stop.lng) : '')
		setNotes(stop?.notes ?? '')
		setError(null)
	}, [open, stop])

	async function handleSave() {
		if (!name.trim()) {
			setError(t('errors.nameRequired'))
			return
		}
		const parsedLat = parseCoord(lat, -90, 90)
		if (parsedLat === 'invalid') {
			setError(t('errors.latInvalid'))
			return
		}
		const parsedLng = parseCoord(lng, -180, 180)
		if (parsedLng === 'invalid') {
			setError(t('errors.lngInvalid'))
			return
		}
		setSaving(true)
		setError(null)
		const body = {
			name: name.trim(),
			address: address.trim() || null,
			lat: parsedLat === null ? null : parsedLat,
			lng: parsedLng === null ? null : parsedLng,
			notes: notes.trim() || null,
		}
		if (stop) {
			const result = await updateStop(stop.stopId, body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			onEdited(stop.stopId, body)
		} else {
			const result = await createStop(body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			if (result.stopId) onCreated(result.stopId, body)
		}
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={value => !value && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{stop ? t('dialog.editTitle') : t('dialog.createTitle')}</DialogTitle>
					<DialogDescription>{t('dialog.description')}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.name')} *</span>
						<input
							className={inputClass}
							value={name}
							onChange={event => setName(event.target.value)}
						/>
					</label>
					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.address')}</span>
						<input
							className={inputClass}
							value={address}
							onChange={event => setAddress(event.target.value)}
						/>
					</label>
					<div className='grid grid-cols-2 gap-3'>
						<label className='grid gap-1'>
							<span className='text-xs font-medium text-gray-500'>{t('fields.lat')}</span>
							<input
								className={inputClass}
								inputMode='decimal'
								value={lat}
								onChange={event => setLat(event.target.value)}
							/>
						</label>
						<label className='grid gap-1'>
							<span className='text-xs font-medium text-gray-500'>{t('fields.lng')}</span>
							<input
								className={inputClass}
								inputMode='decimal'
								value={lng}
								onChange={event => setLng(event.target.value)}
							/>
						</label>
					</div>
					<label className='grid gap-1'>
						<span className='text-xs font-medium text-gray-500'>{t('fields.notes')}</span>
						<textarea
							className={inputClass}
							rows={2}
							value={notes}
							onChange={event => setNotes(event.target.value)}
						/>
					</label>
					{error && <p className='text-sm text-red-600'>{error}</p>}
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={onClose} disabled={saving}>
						{t('actions.cancel')}
					</Button>
					<Button onClick={handleSave} disabled={saving}>
						{saving && <Loader2 className='h-4 w-4 animate-spin' />}
						{t('actions.save')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
