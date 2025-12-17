import { FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const STAT_CARD_VARIANTS = {
  default: {
    icon: FileText,
    border: 'border-l-primary',
    iconBg: 'bg-primary/10 text-primary',
  },
  success: {
    icon: CheckCircle2,
    border: 'border-l-success',
    iconBg: 'bg-success/10 text-success',
  },
  warning: {
    icon: Clock,
    border: 'border-l-warning',
    iconBg: 'bg-warning/10 text-warning',
  },
  accent: {
    icon: AlertTriangle,
    border: 'border-l-accent',
    iconBg: 'bg-accent/10 text-accent',
  },
} as const;

export type StatCardVariant = keyof typeof STAT_CARD_VARIANTS;

export type ChangeType = 'positive' | 'negative' | 'neutral';

export const CHANGE_COLORS: Record<ChangeType, string> = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
};
