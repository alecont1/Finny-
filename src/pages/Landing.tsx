import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-bold text-white">Finny</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-text-muted hover:text-white transition px-4 py-2"
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            7 dias grátis para testar
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Controle financeiro
            <br />
            <span className="text-primary">que funciona de verdade</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Pare de viver no vermelho. Comece a guardar dinheiro todo mês com um sistema simples, visual e sem planilhas complicadas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              Testar 7 Dias Grátis
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-text-muted text-sm">
              Cancele quando quiser • Setup em 2 minutos
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-text-muted text-sm">Usuários ativos</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div>
              <p className="text-3xl font-bold text-primary">R$ 2M+</p>
              <p className="text-text-muted text-sm">Economizados</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div>
              <p className="text-3xl font-bold text-primary">4.9</p>
              <p className="text-text-muted text-sm">Avaliação média</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo que você precisa para organizar seu dinheiro
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Simples de usar, poderoso nos resultados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Metas Claras</h3>
              <p className="text-text-muted">
                Defina quanto quer economizar por mês e acompanhe seu progresso visualmente. Sem complicação.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Registro Rápido</h3>
              <p className="text-text-muted">
                Registre seus gastos em menos de 10 segundos. Interface pensada para o dia a dia corrido.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-white mb-3">Alertas Inteligentes</h3>
              <p className="text-text-muted">
                Saiba quando está chegando no limite do orçamento de lazer antes de estourar.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Visão Anual</h3>
              <p className="text-text-muted">
                Veja sua projeção de economia para o ano inteiro. Planeje compras grandes com antecedência.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-white mb-3">Sincronização</h3>
              <p className="text-text-muted">
                Seus dados seguros na nuvem. Acesse de qualquer dispositivo, a qualquer hora.
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-8 border border-white/5 hover:border-primary/30 transition">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-3">PWA Nativo</h3>
              <p className="text-text-muted">
                Instale no celular como um app. Funciona offline e abre instantaneamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Como funciona
            </h2>
            <p className="text-text-muted text-lg">
              3 passos para começar a economizar
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Configure sua renda</h3>
                <p className="text-text-muted">
                  Informe seu salário, dia de pagamento e despesas fixas. Fazemos o resto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Defina sua meta</h3>
                <p className="text-text-muted">
                  Quanto quer guardar por mês? E o orçamento de lazer? Você decide.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Registre e acompanhe</h3>
                <p className="text-text-muted">
                  Registre seus gastos diários e veja em tempo real como está seu progresso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="container mx-auto max-w-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Preço simples e transparente
            </h2>
            <p className="text-text-muted text-lg">
              Teste grátis por 7 dias, cancele quando quiser
            </p>
          </div>

          {/* Single Plan */}
          <div className="bg-gradient-to-br from-primary/20 to-surface rounded-2xl p-8 border border-primary/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full">
              7 DIAS GRÁTIS
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Finny Premium</h3>
              <p className="text-text-muted">Acesso completo a todas as funcionalidades</p>
            </div>

            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-white mb-2">R$ 12,90</div>
              <span className="text-text-muted">/mês após o trial</span>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6 text-center">
              <p className="text-white font-medium">Hoje você paga: <span className="text-primary text-xl font-bold">R$ 0</span></p>
              <p className="text-text-muted text-sm">Cobrança apenas após 7 dias</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Transações ilimitadas
              </li>
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Despesas fixas ilimitadas
              </li>
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Histórico completo de gastos
              </li>
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exportar para CSV e PDF
              </li>
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sincronização na nuvem
              </li>
              <li className="flex items-center gap-3 text-white">
                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancele quando quiser
              </li>
            </ul>

            <Link
              to="/signup"
              className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition font-semibold text-lg"
            >
              Começar 7 Dias Grátis
            </Link>

            <p className="text-center text-text-muted text-xs mt-4">
              🔒 Pagamento seguro via Stripe
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-br from-primary/20 to-surface rounded-3xl p-12 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para organizar seu dinheiro?
            </h2>
            <p className="text-text-muted text-lg mb-8">
              Comece seu trial de 7 dias e veja a diferença no final do mês.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-xl transition"
            >
              Começar Trial Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-bold text-white">Finny</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-text-muted">
              <a href="#" className="hover:text-white transition">Termos de Uso</a>
              <a href="#" className="hover:text-white transition">Privacidade</a>
              <a href="#" className="hover:text-white transition">Contato</a>
            </div>

            <p className="text-sm text-text-muted">
              © 2026 Finny. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
