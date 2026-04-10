import { Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <p className="font-headline font-black text-3xl uppercase text-on-surface-variant mb-4">
        {title}
      </p>
      {description && <p className="text-on-surface-variant mb-8">{description}</p>}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-fixed px-8 py-4 font-black uppercase"
        >
          <Plus className="w-5 h-5" /> {actionLabel}
        </Link>
      )}
    </div>
  );
}
