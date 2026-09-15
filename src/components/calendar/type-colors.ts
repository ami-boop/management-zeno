export const TYPE_COLORS: Record<string, { badge: string; dot: string; bg: string; border: string }> = {
	holiday: { badge: 'bg-zeno-sage-soft text-zeno-sage border border-zeno-line', dot: 'bg-zeno-sage', bg: 'bg-zeno-sage', border: 'border-zeno-sage' },
	exam_day: { badge: 'bg-zeno-paper-soft text-zeno-ink-soft border border-zeno-line-strong', dot: 'bg-zeno-ink-soft', bg: 'bg-zeno-ink-soft', border: 'border-zeno-ink-soft' },
	half_day: { badge: 'bg-zeno-cream text-zeno-amber-ink border border-zeno-line-strong', dot: 'bg-zeno-amber', bg: 'bg-zeno-amber', border: 'border-zeno-amber' },
	no_transport: { badge: 'bg-zeno-danger-soft text-zeno-danger border border-zeno-line', dot: 'bg-zeno-danger', bg: 'bg-zeno-danger', border: 'border-zeno-danger' },
	special_schedule: { badge: 'bg-zeno-night text-white border border-zeno-night', dot: 'bg-zeno-night', bg: 'bg-zeno-night', border: 'border-zeno-night' },
}
