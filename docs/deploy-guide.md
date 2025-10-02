# 🚀 Guia Completo de Deploy e Manutenção - VotaCondôminos

## 📋 Índice
1. [Deploy Passo a Passo](#deploy)
2. [Configuração de Domínio](#dominio)
3. [Monitoramento e Logs](#monitoramento)
4. [Troubleshooting Comum](#troubleshooting)
5. [Manutenção e Updates](#manutencao)
6. [Backup e Recuperação](#backup)
7. [Otimizações de Performance](#performance)
8. [FAQ Técnico](#faq)

---

## 1. 🚀 Deploy Passo a Passo

### Pré-requisitos

```bash
# Verificar versões
node --version  # v18.x ou superior
npm --version   # v9.x ou superior
git --version   # v2.x ou superior
```

### Passo 1: Preparar Supabase

```bash
# 1. Criar conta em supabase.com
# 2. Criar novo projeto
# 3. Copiar credenciais

# 4. Instalar CLI do Supabase
npm install -g supabase

# 5. Login
supabase login

# 6. Link com projeto
supabase link --project-ref seu-project-ref

# 7. Executar migrations
supabase db push

# 8. Popular dados iniciais (seed)
psql -h db.xxx.supabase.co -U postgres -d postgres -f seed.sql
```

**seed.sql - Dados Iniciais:**
```sql
-- Criar Super Admin
INSERT INTO usuarios (id, email, senha_hash, nome_completo, role, ativo, email_verificado)
VALUES (
  gen_random_uuid(),
  'admin@votacondominios.com',
  crypt('SenhaSegura123!', gen_salt('bf')),
  'Administrador do Sistema',
  'super_admin',
  true,
  true
);

-- Criar condomínio de demonstração
INSERT INTO condominios (nome, cnpj, cidade, estado, ativo)
VALUES (
  'Condomínio Demonstração',
  '00.000.000/0001-00',
  'São Paulo',
  'SP',
  true
)
RETURNING id;

-- Criar unidades de exemplo
INSERT INTO unidades (condominio_id, identificador, bloco, andar)
SELECT 
  (SELECT id FROM condominios WHERE nome = 'Condomínio Demonstração'),
  'Apto ' || num,
  'Bloco A',
  FLOOR((num - 1) / 4) + 1
FROM generate_series(101, 120) num;
```

### Passo 2: Configurar Resend (Email)

```bash
# 1. Criar conta em resend.com
# 2. Verificar domínio
# 3. Adicionar registros DNS:

# Tipo: TXT
# Nome: @ (ou seu domínio)
# Valor: [copiar do Resend]

# Tipo: CNAME
# Nome: resend._domainkey
# Valor: [copiar do Resend]

# 4. Copiar API Key
```

### Passo 3: Deploy no Vercel

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Fazer build local (teste)
npm run build

# 4. Deploy preview
vercel

# 5. Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add CRON_SECRET

# 6. Deploy production
vercel --prod

# 7. Anotar URL do deploy
# https://vota-condominios.vercel.app
```

### Passo 4: Configurar Webhooks e Cron Jobs

**vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/notifications",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/close-votacoes",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/check-payments",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Proteger Cron Jobs:**
```typescript
// app/api/cron/[job]/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Execute job...
}
```

### Passo 5: Configurar Storage (Anexos)

```sql
-- No Supabase Dashboard > Storage

-- 1. Criar bucket "anexos"
-- 2. Configurar políticas:

CREATE POLICY "anexos_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'anexos' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "anexos_download" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'anexos' AND
    auth.role() = 'authenticated'
  );
```

---

## 2. 🌐 Configuração de Domínio

### Domínio Customizado na Vercel

```bash
# 1. No Vercel Dashboard > Settings > Domains
# 2. Adicionar domínio: votacondominios.com

# 3. Configurar DNS (no seu provedor):
# Tipo: A
# Nome: @
# Valor: 76.76.21.21

# Tipo: CNAME
# Nome: www
# Valor: cname.vercel-dns.com

# 4. Aguardar propagação (até 48h)
```

### SSL/TLS Automático

Vercel automaticamente provisiona certificado SSL via Let's Encrypt. Sem configuração adicional necessária.

### Subdomínios

```bash
# Para diferentes ambientes:
# - app.votacondominios.com (produção)
# - staging.votacondominios.com (staging)
# - dev.votacondominios.com (desenvolvimento)

# Criar branch environments na Vercel:
vercel --prod --scope production --alias app.votacondominios.com
```

---

## 3. 📊 Monitoramento e Logs

### Configurar Sentry (Erro Tracking)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

### Configurar Google Analytics

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
```

### Logs Personalizados

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Enviar para serviço externo se produção
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Enviar para Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error);
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};
```

### Dashboard de Métricas

**Métricas para Monitorar:**
- ✅ Uptime (usar UptimeRobot.com)
- ✅ Response time (médio < 500ms)
- ✅ Taxa de erro (< 1%)
- ✅ Usuários ativos
- ✅ Votações criadas/dia
- ✅ Taxa de conversão de cadastros
- ✅ Emails enviados/bounce rate

---

## 4. 🔧 Troubleshooting Comum

### Problema: "Supabase connection failed"

**Solução:**
```bash
# 1. Verificar variáveis de ambiente
vercel env pull

# 2. Testar conexão
curl https://xxx.supabase.co/rest/v1/

# 3. Verificar IP allowlist no Supabase
# Dashboard > Settings > API > IP Allowlist
```

### Problema: "RLS policy violation"

**Solução:**
```sql
-- Desabilitar temporariamente RLS para debug
ALTER TABLE votacoes DISABLE ROW LEVEL SECURITY;

-- Testar query
SELECT * FROM votacoes;

-- Reabilitar
ALTER TABLE votacoes ENABLE ROW LEVEL SECURITY;

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'votacoes';
```

### Problema: "Emails não estão sendo enviados"

**Solução:**
```typescript
// Testar API do Resend
const testEmail = async () => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'test@votacondominios.com',
      to: 'seu-email@gmail.com',
      subject: 'Teste',
      html: '<p>Teste</p>'
    })
  });
  
  console.log(await response.json());
};
```

### Problema: "Build failing na Vercel"

**Solução:**
```bash
# 1. Limpar cache
vercel --force

# 2. Verificar logs
vercel logs

# 3. Build local
npm run build

# 4. Verificar TypeScript
npm run type-check

# 5. Verificar lint
npm run lint
```

### Problema: "Cron jobs não executam"

**Solução:**
```bash
# 1. Verificar vercel.json está commitado
git add vercel.json
git commit -m "Add cron config"
git push

# 2. Verificar logs no Vercel Dashboard
# Deployments > [seu deploy] > Functions > Cron Logs

# 3. Testar manualmente
curl -X GET https://seu-dominio.com/api/cron/notifications \
  -H "Authorization: Bearer seu-cron-secret"
```

---

## 5. 🔄 Manutenção e Updates

### Update Semanal de Dependências

```bash
# Verificar updates disponíveis
npm outdated

# Update de patches (seguro)
npm update

# Update de majors (cuidado)
npm install next@latest react@latest

# Testar após update
npm run test
npm run build
```

### Migrations do Banco de Dados

```bash
# 1. Criar nova migration
supabase migration new add_new_feature

# 2. Editar arquivo em supabase/migrations/
# 3. Testar localmente
supabase db reset

# 4. Aplicar em produção
supabase db push --linked
```

### Rollback em Caso de Erro

```bash
# Vercel - Rollback para deploy anterior
vercel rollback

# Supabase - Reverter migration
supabase migration repair --version <migration-version>
```

### Limpeza de Dados Antigos

```sql
-- Executar mensalmente
-- Deletar votações antigas (>2 anos)
DELETE FROM votacoes 
WHERE data_fim < NOW() - INTERVAL '2 years';

-- Deletar logs antigos (>6 meses)
DELETE FROM logs_auditoria 
WHERE created_at < NOW() - INTERVAL '6 months';

-- Vacuum para recuperar espaço
VACUUM ANALYZE;
```

---

## 6. 💾 Backup e Recuperação

### Backup Automático do Supabase

Supabase faz backup automático diário. Para backups adicionais:

```bash
# Backup manual
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restaurar backup
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Backup de Código

```bash
# Git tags para releases
git tag -a v1.0.0 -m "Versão 1.0.0 - Lançamento"
git push origin v1.0.0

# Backup em múltiplos remotes
git remote add backup https://github.com/backup/repo.git
git push backup main
```

### Plano de Recuperação de Desastres (DRP)

**Cenário 1: Database corrompida**
1. Restaurar do backup automático do Supabase
2. Aplicar migrations faltantes
3. Validar integridade dos dados

**Cenário 2: Vercel indisponível**
1. Deploy alternativo na Netlify
2. Atualizar DNS
3. Notificar usuários

**Cenário 3: Ataque ou vazamento**
1. Revogar todas as API keys
2. Forçar logout de todos os usuários
3. Resetar senhas
4. Análise forense
5. Notificar usuários afetados

---

## 7. ⚡ Otimizações de Performance

### Next.js Optimizations

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['xxx.supabase.co'],
    formats: ['image/avif', 'image/webp']
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true
};
```

### Database Indexing

```sql
-- Adicionar índices para queries lentas
CREATE INDEX CONCURRENTLY idx_votos_votacao_usuario 
ON votos(votacao_id, usuario_id);

CREATE INDEX CONCURRENTLY idx_votacoes_condominio_status 
ON votacoes(condominio_id, status) 
WHERE status = 'aberta';

-- Analisar queries lentas
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### Caching Strategy

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return cached as T;
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

### CDN para Assets Estáticos

Vercel automaticamente serve assets via CDN. Para otimizar:

```typescript
// Usar next/image para otimização automática
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // Para imagens above the fold
/>
```

---

## 8. ❓ FAQ Técnico

### Q: Como adicionar um novo papel (role)?

```sql
-- 1. Adicionar ao enum (se existir)
ALTER TYPE user_role ADD VALUE 'gestor';

-- 2. Atualizar políticas RLS
CREATE POLICY "gestor_access" ON votacoes
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() 
      AND role IN ('gestor', 'super_admin')
    )
  );

-- 3. Atualizar código TypeScript
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SINDICO = 'sindico',
  GESTOR = 'gestor',
  MORADOR = 'morador'
}
```

### Q: Como implementar rate limiting?

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s')
});

// Usar em API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip!);
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  // Continue...
}
```

### Q: Como fazer feature flags?

```typescript
// lib/features.ts
export const features = {
  newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
  whatsappIntegration: process.env.FEATURE_WHATSAPP === 'true',
  aiSuggestions: false // Hardcoded off
};

// Usar no código
if (features.newDashboard) {
  return <NewDashboard />;
}
return <OldDashboard />;
```

### Q: Como adicionar multi-idioma?

```typescript
// lib/i18n.ts
import { useRouter } from 'next/router';

export const translations = {
  'pt-BR': {
    'welcome': 'Bem-vindo',
    'vote': 'Votar'
  },
  'en-US': {
    'welcome': 'Welcome',
    'vote': 'Vote'
  }
};

export function useTranslation() {
  const router = useRouter();
  const locale = router.locale || 'pt-BR';
  
  return (key: string) => translations[locale][key] || key;
}
```

---

## 📞 Suporte e Recursos

### Documentação Oficial
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Resend**: https://resend.com/docs

### Comunidade
- **Discord VotaCondôminos**: [link]
- **Stack Overflow**: Tag `vota-condominios`
- **GitHub Issues**: Reportar bugs

### Contato Técnico
- **Email**: dev@votacondominios.com
- **Slack**: [workspace]
- **Horário**: Seg-Sex, 9h-18h BRT

---

## ✅ Checklist de Go-Live

- [ ] Todos os testes passam
- [ ] Build de produção funciona
- [ ] Variáveis de ambiente configuradas
- [ ] SSL configurado
- [ ] Domínio apontando corretamente
- [ ] Emails sendo enviados
- [ ] Backup automático ativo
- [ ] Monitoramento configurado (Sentry)
- [ ] Analytics configurado (GA)
- [ ] Cron jobs funcionando
- [ ] RLS testado e validado
- [ ] Performance testada (Lighthouse > 90)
- [ ] Documentação atualizada
- [ ] Plano de suporte definido
- [ ] DRP (Disaster Recovery Plan) pronto

---

**🎉 Sistema pronto para produção!**

Última atualização: Outubro 2025
Versão: 1.0.0