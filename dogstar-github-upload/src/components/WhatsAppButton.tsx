import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../utils/whatsapp';

export function WhatsAppButton({ text, label = 'Falar com a DogStar', className = '', variant = 'primary' }: { text: string; label?: string; className?: string; variant?: 'primary' | 'dark' | 'ghost' }) {
  return (
    <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className={`btn btn-${variant} ${className}`}>
      <MessageCircle className="size-5" aria-hidden />
      {label}
      <span className="sr-only"> (abre o WhatsApp)</span>
    </a>
  );
}
