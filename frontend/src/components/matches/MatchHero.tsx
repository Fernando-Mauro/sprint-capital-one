import { getSportImage } from '@/lib/sport-images';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Reta } from '@/types';

interface MatchHeroProps {
  reta: Reta;
}

export default function MatchHero({ reta }: MatchHeroProps) {
  return (
    <section className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
      <Image
        className="w-full h-full object-cover grayscale-[0.3] brightness-75"
        src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?q=80&w=2000&auto=format&fit=crop"
        alt="Match"
        fill
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute top-4 left-4">
        <Link
          href="/dashboard"
          className="text-white hover:bg-surface-container/50 transition-colors p-2 inline-block"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 space-y-2">
        <div className="inline-block bg-primary-container text-on-primary-container px-4 py-1 font-headline font-black uppercase italic tracking-tighter skew-tag">
          <span className="block skew-tag-content">{reta.sports?.name ?? 'DEPORTE'}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter leading-none">
          {reta.title}
        </h2>
        <div className="flex flex-wrap items-center gap-6 text-on-surface-variant font-bold uppercase tracking-widest text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary w-5 h-5" />
            <span>{reta.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-primary w-5 h-5" />
            <span>
              {reta.start_time}
              {reta.end_time ? ` - ${reta.end_time}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-primary w-5 h-5" />
            <span>{reta.location_name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
