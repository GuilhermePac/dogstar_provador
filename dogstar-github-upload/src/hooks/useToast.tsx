import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CircleAlert, Check, Info } from 'lucide-react';

type Tone = 'ok' | 'error' | 'info';
interface Toast { id: number; text: string; tone: Tone }
const Ctx = createContext<(text: string, tone?: Tone) => void>(() => undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Tone = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === 'error' ? 6000 : 3200);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-8">
        {toasts.map((t) => {
          const Icon = t.tone === 'ok' ? Check : t.tone === 'error' ? CircleAlert : Info;
          return (
            <div key={t.id} role={t.tone === 'error' ? 'alert' : 'status'} className="animate-drop-in pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-[var(--shadow-pop)]">
              <Icon className={`mt-0.5 size-4 shrink-0 ${t.tone === 'error' ? 'text-[#ff8f86]' : 'text-star'}`} aria-hidden />
              <span>{t.text}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
