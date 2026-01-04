-- =============================================
-- FINNY SaaS - Database Schema
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- =============================================
-- TABELA: profiles
-- Informações do usuário e configurações
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Configurações financeiras
  salary DECIMAL(10,2) DEFAULT 0,
  other_income DECIMAL(10,2) DEFAULT 0,
  pay_day INTEGER DEFAULT 5 CHECK (pay_day >= 1 AND pay_day <= 31),
  has_advance BOOLEAN DEFAULT FALSE,
  advance_day INTEGER CHECK (advance_day IS NULL OR (advance_day >= 1 AND advance_day <= 31)),
  savings_goal DECIMAL(10,2) DEFAULT 0,
  leisure_budget DECIMAL(10,2) DEFAULT 0,

  -- Plano e assinatura
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'trial')),
  plan_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Trial
  trial_ends_at TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'none' CHECK (subscription_status IN ('none', 'trialing', 'active', 'canceled', 'past_due')),

  -- Status
  has_completed_onboarding BOOLEAN DEFAULT FALSE
);

-- =============================================
-- TABELA: fixed_expenses
-- Despesas fixas mensais
-- =============================================
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: temporary_expenses
-- Despesas temporárias (parceladas, etc)
-- =============================================
CREATE TABLE IF NOT EXISTS temporary_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  start_month INTEGER NOT NULL CHECK (start_month >= 1 AND start_month <= 12),
  start_year INTEGER NOT NULL CHECK (start_year >= 2020),
  end_month INTEGER NOT NULL CHECK (end_month >= 1 AND end_month <= 12),
  end_year INTEGER NOT NULL CHECK (end_year >= 2020),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: transactions
-- Transações/gastos diários
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  date DATE NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_user ON fixed_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_active ON fixed_expenses(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_temporary_expenses_user ON temporary_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_month ON transactions(user_id, year, month);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Cada usuário só vê seus próprios dados
-- =============================================

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE temporary_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policies para fixed_expenses
CREATE POLICY "Users can view own fixed expenses" ON fixed_expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fixed expenses" ON fixed_expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fixed expenses" ON fixed_expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fixed expenses" ON fixed_expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para temporary_expenses
CREATE POLICY "Users can view own temporary expenses" ON temporary_expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own temporary expenses" ON temporary_expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own temporary expenses" ON temporary_expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own temporary expenses" ON temporary_expenses
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TRIGGER: Criar profile automaticamente
-- Quando um novo usuário se registra
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger se existir e criar novamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNÇÃO: Verificar limites do plano
-- =============================================
CREATE OR REPLACE FUNCTION check_transaction_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_plan TEXT;
  transaction_count INTEGER;
BEGIN
  -- Buscar plano do usuário
  SELECT plan INTO user_plan FROM profiles WHERE id = NEW.user_id;

  -- Se for premium, permitir
  IF user_plan = 'premium' THEN
    RETURN NEW;
  END IF;

  -- Contar transações do mês atual
  SELECT COUNT(*) INTO transaction_count
  FROM transactions
  WHERE user_id = NEW.user_id
    AND month = NEW.month
    AND year = NEW.year;

  -- Limite de 30 para free
  IF transaction_count >= 30 THEN
    RAISE EXCEPTION 'Transaction limit reached for free plan';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para verificar limite
DROP TRIGGER IF EXISTS check_transaction_limit_trigger ON transactions;
CREATE TRIGGER check_transaction_limit_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION check_transaction_limit();

-- =============================================
-- GRANT: Permissões para authenticated users
-- =============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
