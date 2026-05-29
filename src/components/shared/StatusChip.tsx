type Variant = 'normal' | 'warning' | 'critical';

const styles: Record<Variant, string> = {
  normal: 'bg-green-500/15 text-green-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  critical: 'bg-red-500/15 text-red-400',
};

export default function StatusChip({ variant, label }: { variant: Variant; label: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  );
}
