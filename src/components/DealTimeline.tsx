'use client';

const stages = ['LOI', 'DOCS', 'PREEMPTIVE_RIGHT', 'NOTARY_OR_REGISTRAR', 'ESCROW_PAYMENT', 'CLOSED', 'CANCELLED'];

export function DealTimeline({ current, dealId, canAdvance }: { current: string; dealId: string; canAdvance: boolean }) {
  async function advance(stage: string) {
    await fetch(`/api/deals/${dealId}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: stage }) });
    location.reload();
  }

  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div key={s} className={`flex items-center justify-between rounded border p-2 ${s === current ? 'border-green-600 bg-green-50' : ''}`}>
          <span>{s}</span>
          {canAdvance && s !== current && <button className="rounded bg-slate-900 px-2 py-1 text-xs text-white" onClick={() => advance(s)}>Set stage</button>}
        </div>
      ))}
    </div>
  );
}
