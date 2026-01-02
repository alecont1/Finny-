import { Button } from '../ui';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Animated icon */}
      <div className="text-8xl mb-8 animate-bounce">
        💰
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        <span className="text-gradient">Finny</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-text-muted mb-2">
        Seu controle financeiro pessoal
      </p>
      <p className="text-text-muted mb-12 max-w-sm">
        Simples, visual e direto ao ponto. Vamos configurar suas finanças em poucos passos.
      </p>

      {/* CTA Button */}
      <Button size="lg" onClick={onNext} className="min-w-[200px]">
        Começar
      </Button>

      {/* Features */}
      <div className="mt-16 grid grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-text-muted">Controle<br />visual</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm text-text-muted">Metas<br />mensais</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🔒</div>
          <p className="text-sm text-text-muted">Dados<br />privados</p>
        </div>
      </div>
    </div>
  );
}
