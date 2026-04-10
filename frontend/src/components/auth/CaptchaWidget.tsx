'use client';

import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TurnstileComponent = Turnstile as any;

export default function CaptchaWidget({ onSuccess, onError, onExpire }: CaptchaWidgetProps) {
  return (
    <div className="flex justify-center">
      <TurnstileComponent
        siteKey={SITE_KEY}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'dark',
          size: 'flexible',
        }}
      />
    </div>
  );
}
