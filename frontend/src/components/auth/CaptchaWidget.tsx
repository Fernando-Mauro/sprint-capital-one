'use client';

import HCaptchaRaw from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HCaptcha = HCaptchaRaw as any;

interface CaptchaWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const SITE_KEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001';

export default function CaptchaWidget({ onSuccess, onError, onExpire }: CaptchaWidgetProps) {
  const captchaRef = useRef<HCaptchaRaw>(null);

  return (
    <div className="flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={SITE_KEY}
        theme="dark"
        onVerify={onSuccess}
        onError={onError}
        onExpire={onExpire}
      />
    </div>
  );
}
