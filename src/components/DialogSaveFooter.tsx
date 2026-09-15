'use client'

import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'

interface DialogSaveFooterProps {
	onCancel: () => void
	onSave: () => void
	saving: boolean
	cancelLabel: ReactNode
	saveLabel: ReactNode
}

/** Cancel + save buttons with a spinner, shared by the entity dialogs. */
export default function DialogSaveFooter({
	onCancel,
	onSave,
	saving,
	cancelLabel,
	saveLabel,
}: DialogSaveFooterProps) {
	return (
		<DialogFooter>
			<Button variant='outline' onClick={onCancel} disabled={saving}>
				{cancelLabel}
			</Button>
			<Button onClick={onSave} disabled={saving}>
				{saving && <Loader2 className='h-4 w-4 animate-spin' />}
				{saveLabel}
			</Button>
		</DialogFooter>
	)
}
