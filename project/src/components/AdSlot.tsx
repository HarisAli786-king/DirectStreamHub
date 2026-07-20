import type { AdSlotId } from '../types';

interface AdSlotProps {
  id: AdSlotId;
  label: string;
  className?: string;
  height?: string;
}

/**
 * GOOGLE ADSENSE PLACEHOLDER
 * -------------------------
 * Replace the inner content of this component with your Google AdSense
 * ad unit code. Each slot has a unique id for targeting.
 *
 * Example replacement:
 * <ins className="adsbygoogle"
 *   style={{ display: 'block' }}
 *   data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *   data-ad-slot="XXXXXXXXXX"
 *   data-ad-format="auto"
 *   data-full-width-responsive="true" />
 */
export default function AdSlot({ id, label, className = '', height = 'h-24' }: AdSlotProps) {
  return (
    <div
      data-ad-slot-id={id}
      className={`relative w-full ${height} rounded-xl border border-dashed border-cinema-fog/50 bg-cinema-coal/60 flex items-center justify-center overflow-hidden group ${className}`}
    >
      {/* GOOGLE ADSENSE: Replace this placeholder with your ad code for slot: {id} */}
      <div className="flex flex-col items-center gap-1 text-cinema-fog/70 select-none">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">{label}</span>
        <span className="text-xs font-mono opacity-50">Ad Slot · {id}</span>
        <span className="text-[10px] opacity-40 group-hover:opacity-70 transition-opacity">
          Paste Google AdSense code here
        </span>
      </div>
      <div className="absolute top-2 right-2 text-[9px] text-cinema-fog/40 font-mono">Ad</div>
    </div>
  );
}
