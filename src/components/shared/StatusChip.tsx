type Variant = 'normal' | 'warning' | 'critical';

const styles: Record<Variant, string> = {
  normal: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  critical: 'bg-red-100 text-red-700',
};

export default function StatusChip({ variant, label }: { variant: Variant; label: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[variant]}`}>
      {label}
    </span>
  );
}
