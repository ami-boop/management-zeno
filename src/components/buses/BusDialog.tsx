'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import DialogSaveFooter from '@/components/DialogSaveFooter'
import FormField, { fieldInputClassName } from '@/components/FormField'
import { createBus, updateBus } from '@/app/actions/buses'
import type { FleetBus } from '@/lib/api-contracts'

export interface BusFormValues {
	licensePlate: string
	capacity: number
	driverName: string | null
	driverPhone: string | null
	notes: string | null
}

interface BusDialogProps {
	open: boolean
	bus: FleetBus | null
	onClose: () => void
	onCreated: (busId: string, values: BusFormValues) => void
	onEdited: (busId: string, values: BusFormValues) => void
}

const inputClass = fieldInputClassName

export default function BusDialog({ open, bus, onClose, onCreated, onEdited }: BusDialogProps) {
	const t = useTranslations('Fleet')
	const [licensePlate, setLicensePlate] = useState('')
	const [capacity, setCapacity] = useState('')
	const [driverName, setDriverName] = useState('')
	const [driverPhone, setDriverPhone] = useState('')
	const [notes, setNotes] = useState('')
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!open) return
		setLicensePlate(bus?.licensePlate ?? '')
		setCapacity(bus?.capacity ? String(bus.capacity) : '')
		setDriverName(bus?.driverName ?? '')
		setDriverPhone(bus?.driverPhone ?? '')
		setNotes(bus?.notes ?? '')
		setError(null)
	}, [open, bus])

	async function handleSave() {
		const parsedCapacity = Number(capacity)
		if (!licensePlate.trim()) {
			setError(t('errors.licensePlateRequired'))
			return
		}
		if (!Number.isInteger(parsedCapacity) || parsedCapacity <= 0) {
			setError(t('errors.capacityInvalid'))
			return
		}
		setSaving(true)
		setError(null)
		const body = {
			licensePlate: licensePlate.trim(),
			capacity: parsedCapacity,
			driverName: driverName.trim() || null,
			driverPhone: driverPhone.trim() || null,
			notes: notes.trim() || null,
		}
		if (bus) {
			const result = await updateBus(bus.busId, body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			onEdited(bus.busId, body)
		} else {
			const result = await createBus(body)
			setSaving(false)
			if (!result.ok) {
				setError(t('errors.saveFailed'))
				return
			}
			if (result.busId) onCreated(result.busId, body)
		}
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={value => !value && onClose()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{bus ? t('dialog.editTitle') : t('dialog.createTitle')}</DialogTitle>
					<DialogDescription>{t('dialog.description')}</DialogDescription>
				</DialogHeader>
				<div className='grid gap-3'>
					<FormField label={t('fields.licensePlate')} required>
						<input
							className={inputClass}
							value={licensePlate}
							onChange={event => setLicensePlate(event.target.value)}
						/>
					</FormField>
					<FormField label={t('fields.capacity')} required>
						<input
							className={inputClass}
							type='number'
							min={1}
							value={capacity}
							onChange={event => setCapacity(event.target.value)}
						/>
					</FormField>
					<FormField label={t('fields.driverName')}>
						<input
							className={inputClass}
							value={driverName}
							onChange={event => setDriverName(event.target.value)}
						/>
					</FormField>
					<FormField label={t('fields.driverPhone')}>
						<input
							className={inputClass}
							value={driverPhone}
							onChange={event => setDriverPhone(event.target.value)}
						/>
					</FormField>
					<FormField label={t('fields.notes')}>
						<textarea
							className={inputClass}
							rows={2}
							value={notes}
							onChange={event => setNotes(event.target.value)}
						/>
					</FormField>
					{error && <p className='text-sm text-red-600'>{error}</p>}
				</div>
				<DialogSaveFooter
					onCancel={onClose}
					onSave={() => void handleSave()}
					saving={saving}
					cancelLabel={t('actions.cancel')}
					saveLabel={t('actions.save')}
				/>
			</DialogContent>
		</Dialog>
	)
}
