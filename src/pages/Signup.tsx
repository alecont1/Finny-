import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button, Input } from '../components/ui'

export function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    const { error } = await signUp(email, password, name)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogleSignup = async () => {
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-white mb-4">Verifique seu email</h1>
          <p className="text-text-muted mb-6">
            Enviamos um link de confirmação para <span className="text-white">{email}</span>.
            Clique no link para ativar sua conta.
          </p>
          <Link to="/login">
            <Button variant="secondary">Ir para Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-white">Criar conta</h1>
          <p className="text-text-muted mt-2">Comece a controlar suas finanças</p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-white/10">
          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Cadastrar com Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-muted">ou</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nome"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Confirmar senha"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta grátis'}
            </Button>
          </form>

          <p className="text-xs text-text-muted text-center mt-4">
            Ao criar uma conta, você concorda com nossos{' '}
            <a href="#" className="text-primary hover:underline">Termos de Uso</a> e{' '}
            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
          </p>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entrar
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link to="/" className="text-text-muted hover:text-white text-sm">
            ← Voltar para o início
          </Link>
        </p>
      </div>
    </div>
  )
}
