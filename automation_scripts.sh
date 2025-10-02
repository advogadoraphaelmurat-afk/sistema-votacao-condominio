#!/bin/bash

# =====================================================
# SCRIPTS DE AUTOMAÇÃO - VOTACONDÔMINOS
# =====================================================

# =====================================================
# 1. SETUP INICIAL DO PROJETO
# =====================================================

setup_project() {
  echo "🚀 Configurando VotaCondôminos..."
  
  # Clonar repositório
  git clone https://github.com/seu-usuario/vota-condominios.git
  cd vota-condominios
  
  # Instalar dependências
  npm install
  
  # Copiar env de exemplo
  cp .env.example .env.local
  
  echo "✅ Projeto configurado!"
  echo "⚠️  Configure as variáveis em .env.local antes de continuar"
}

# =====================================================
# 2. DEPLOY RÁPIDO
# =====================================================

deploy_production() {
  echo "🚀 Deploy para produção..."
  
  # Verificar testes
  npm run test
  if [ $? -ne 0 ]; then
    echo "❌ Testes falharam. Deploy abortado."
    exit 1
  fi
  
  # Build local
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Build falhou. Deploy abortado."
    exit 1
  fi
  
  # Deploy Vercel
  vercel --prod
  
  # Migrar banco
  supabase db push --linked
  
  echo "✅ Deploy concluído!"
}

# =====================================================
# 3. BACKUP DO BANCO DE DADOS
# =====================================================

backup_database() {
  DATE=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="backup_${DATE}.sql"
  
  echo "💾 Criando backup do banco..."
  
  pg_dump \
    -h db.xxx.supabase.co \
    -U postgres \
    -d postgres \
    -F c \
    -f "backups/${BACKUP_FILE}"
  
  # Comprimir
  gzip "backups/${BACKUP_FILE}"
  
  # Upload para S3 (opcional)
  # aws s3 cp "backups/${BACKUP_FILE}.gz" s3://backups-vota/
  
  echo "✅ Backup criado: ${BACKUP_FILE}.gz"
}

# =====================================================
# 4. RESTAURAR BACKUP
# =====================================================

restore_database() {
  BACKUP_FILE=$1
  
  if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Especifique o arquivo de backup"
    echo "Uso: ./scripts.sh restore_database backups/backup.sql.gz"
    exit 1
  fi
  
  echo "⚠️  ATENÇÃO: Isso irá sobrescrever o banco atual!"
  read -p "Tem certeza? (yes/no): " confirm
  
  if [ "$confirm" != "yes" ]; then
    echo "Operação cancelada"
    exit 0
  fi
  
  # Descomprimir
  gunzip -c "$BACKUP_FILE" > temp_restore.sql
  
  # Restaurar
  psql \
    -h db.xxx.supabase.co \
    -U postgres \
    -d postgres \
    -f temp_restore.sql
  
  # Limpar
  rm temp_restore.sql
  
  echo "✅ Banco restaurado!"
}

# =====================================================
# 5. CRIAR NOVO CONDOMÍNIO (VIA CLI)
# =====================================================

create_condominio() {
  echo "🏢 Criar novo condomínio"
  
  read -p "Nome do condomínio: " nome
  read -p "CNPJ: " cnpj
  read -p "Cidade: " cidade
  read -p "Estado (UF): " estado
  read -p "Email do síndico: " email
  read -p "Plano (basico/premium/enterprise): " plano
  
  # Inserir no banco
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
BEGIN;

-- Criar condomínio
INSERT INTO condominios (nome, cnpj, cidade, estado, plano, ativo)
VALUES ('$nome', '$cnpj', '$cidade', '$estado', '$plano', true)
RETURNING id;

-- Criar usuário síndico (exemplo - ajustar conforme necessário)
-- INSERT INTO usuarios (email, role, ...) VALUES (...);

COMMIT;
EOF
  
  echo "✅ Condomínio criado!"
}

# =====================================================
# 6. LIMPEZA DE DADOS ANTIGOS
# =====================================================

cleanup_old_data() {
  echo "🧹 Limpando dados antigos..."
  
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
-- Deletar votações antigas (>2 anos)
DELETE FROM votacoes 
WHERE data_fim < NOW() - INTERVAL '2 years';

-- Deletar logs antigos (>6 meses)
DELETE FROM logs_auditoria 
WHERE created_at < NOW() - INTERVAL '6 months';

-- Vacuum
VACUUM ANALYZE;

-- Relatório
SELECT 
  'votacoes' as tabela,
  COUNT(*) as registros
FROM votacoes
UNION ALL
SELECT 
  'logs_auditoria',
  COUNT(*)
FROM logs_auditoria;
EOF
  
  echo "✅ Limpeza concluída!"
}

# =====================================================
# 7. MONITORAR SAÚDE DO SISTEMA
# =====================================================

health_check() {
  echo "🏥 Verificando saúde do sistema..."
  
  # Verificar API
  response=$(curl -s -o /dev/null -w "%{http_code}" https://seu-dominio.com/api/health)
  if [ "$response" = "200" ]; then
    echo "✅ API funcionando"
  else
    echo "❌ API com problemas (HTTP $response)"
  fi
  
  # Verificar banco
  psql -h db.xxx.supabase.co -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "✅ Banco de dados funcionando"
  else
    echo "❌ Banco de dados com problemas"
  fi
  
  # Verificar Vercel
  vercel_status=$(curl -s https://www.vercel-status.com/api/v2/status.json | jq -r '.status.indicator')
  echo "📊 Status Vercel: $vercel_status"
  
  # Métricas do banco
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
EOF
}

# =====================================================
# 8. GERAR RELATÓRIO DE USO
# =====================================================

usage_report() {
  DATE=$(date +%Y-%m-%d)
  REPORT_FILE="relatorios/uso_${DATE}.txt"
  
  echo "📊 Gerando relatório de uso..."
  
  psql -h db.xxx.supabase.co -U postgres -d postgres > "$REPORT_FILE" <<EOF
-- Relatório de Uso - ${DATE}

-- Total de condomínios ativos
SELECT 'Total de Condomínios Ativos' as metrica, COUNT(*) as valor
FROM condominios WHERE ativo = true;

-- Total de moradores
SELECT 'Total de Moradores' as metrica, COUNT(*) as valor
FROM usuarios WHERE role = 'morador';

-- Votações criadas (último mês)
SELECT 'Votações (30 dias)' as metrica, COUNT(*) as valor
FROM votacoes 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Taxa média de participação
SELECT 
  'Taxa Média de Participação' as metrica,
  ROUND(AVG(
    (SELECT COUNT(*) FROM votos WHERE votacao_id = v.id)::decimal / 
    NULLIF((SELECT COUNT(*) FROM usuarios_condominios uc WHERE uc.condominio_id = v.condominio_id AND status = 'aprovado'), 0) * 100
  ), 2) as valor
FROM votacoes v
WHERE status = 'finalizada';

-- Top 5 condomínios mais ativos
SELECT 
  c.nome,
  COUNT(v.id) as total_votacoes
FROM condominios c
LEFT JOIN votacoes v ON v.condominio_id = c.id
WHERE v.created_at > NOW() - INTERVAL '30 days'
GROUP BY c.id, c.nome
ORDER BY total_votacoes DESC
LIMIT 5;
EOF
  
  echo "✅ Relatório gerado: $REPORT_FILE"
  cat "$REPORT_FILE"
}

# =====================================================
# 9. ENVIAR EMAIL DE TESTE
# =====================================================

test_email() {
  EMAIL=$1
  
  if [ -z "$EMAIL" ]; then
    read -p "Email de destino: " EMAIL
  fi
  
  echo "📧 Enviando email de teste para $EMAIL..."
  
  curl -X POST https://api.resend.com/emails \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"from\": \"noreply@votacondominios.com\",
      \"to\": \"$EMAIL\",
      \"subject\": \"Teste de Email - VotaCondôminos\",
      \"html\": \"<h1>Email de Teste</h1><p>Se você recebeu este email, o sistema está funcionando corretamente!</p>\"
    }"
  
  echo ""
  echo "✅ Email enviado! Verifique a caixa de entrada de $EMAIL"
}

# =====================================================
# 10. RESETAR SENHA DE USUÁRIO
# =====================================================

reset_user_password() {
  EMAIL=$1
  
  if [ -z "$EMAIL" ]; then
    read -p "Email do usuário: " EMAIL
  fi
  
  echo "🔑 Resetando senha para $EMAIL..."
  
  # Gerar token de reset
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
-- Buscar usuário
SELECT id, email, nome_completo 
FROM usuarios 
WHERE email = '$EMAIL';

-- Gerar link de reset (ajustar conforme implementação)
-- UPDATE usuarios SET reset_token = gen_random_uuid() WHERE email = '$EMAIL';
EOF
  
  echo "✅ Envie o link de reset para o usuário"
}

# =====================================================
# 11. ANÁLISE DE PERFORMANCE
# =====================================================

performance_analysis() {
  echo "⚡ Análise de Performance..."
  
  # Queries mais lentas
  echo "📊 Top 10 queries mais lentas:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  LEFT(query, 60) as query_snippet,
  calls,
  ROUND(total_time::numeric, 2) as total_time_ms,
  ROUND(mean_time::numeric, 2) as mean_time_ms,
  ROUND((100 * total_time / SUM(total_time) OVER ())::numeric, 2) AS percentage
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
EOF

  # Tamanho das tabelas
  echo ""
  echo "💾 Tamanho das tabelas:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size,
  pg_total_relation_size('public.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC
LIMIT 10;
EOF

  # Índices não utilizados
  echo ""
  echo "🔍 Índices subutilizados:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan < 10
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
EOF
}

# =====================================================
# 12. VERIFICAR SEGURANÇA
# =====================================================

security_audit() {
  echo "🔒 Auditoria de Segurança..."
  
  # Verificar RLS ativado
  echo "Verificando Row Level Security:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('votacoes', 'votos', 'usuarios', 'condominios')
ORDER BY tablename;
EOF

  # Listar políticas RLS
  echo ""
  echo "Políticas RLS ativas:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
EOF

  # Verificar usuários com privilégios elevados
  echo ""
  echo "Usuários administradores:"
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
SELECT 
  email,
  role,
  ativo,
  email_verificado,
  created_at
FROM usuarios
WHERE role IN ('super_admin', 'admin')
ORDER BY created_at;
EOF
}

# =====================================================
# 13. POPULAR DADOS DE DEMONSTRAÇÃO
# =====================================================

seed_demo_data() {
  echo "🌱 Populando dados de demonstração..."
  
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
BEGIN;

-- Criar condomínio demo
INSERT INTO condominios (nome, cnpj, cidade, estado, ativo)
VALUES ('Condomínio Demo', '00.000.000/0001-00', 'São Paulo', 'SP', true)
ON CONFLICT DO NOTHING
RETURNING id;

-- Criar unidades
INSERT INTO unidades (condominio_id, identificador, bloco, andar)
SELECT 
  (SELECT id FROM condominios WHERE nome = 'Condomínio Demo'),
  'Apto ' || num,
  CASE WHEN num <= 110 THEN 'A' ELSE 'B' END,
  ((num - 100) / 4) + 1
FROM generate_series(101, 120) num
ON CONFLICT DO NOTHING;

-- Criar síndico demo
INSERT INTO usuarios (email, senha_hash, nome_completo, cpf, role, ativo, email_verificado)
VALUES (
  'sindico.demo@votacondominios.com',
  crypt('demo123', gen_salt('bf')),
  'João Silva - Síndico Demo',
  '123.456.789-00',
  'sindico',
  true,
  true
)
ON CONFLICT DO NOTHING;

-- Criar moradores demo
INSERT INTO usuarios (email, senha_hash, nome_completo, cpf, role, ativo, email_verificado)
SELECT 
  'morador' || num || '@demo.com',
  crypt('demo123', gen_salt('bf')),
  'Morador Demo ' || num,
  LPAD(num::text, 11, '0'),
  'morador',
  true,
  true
FROM generate_series(1, 10) num
ON CONFLICT DO NOTHING;

-- Associar moradores ao condomínio
INSERT INTO usuarios_condominios (usuario_id, condominio_id, unidade_id, status)
SELECT 
  u.id,
  (SELECT id FROM condominios WHERE nome = 'Condomínio Demo'),
  (SELECT id FROM unidades WHERE identificador = 'Apto ' || (100 + row_number) LIMIT 1),
  'aprovado'
FROM (
  SELECT id, ROW_NUMBER() OVER () as row_number
  FROM usuarios 
  WHERE email LIKE '%@demo.com'
  LIMIT 10
) u
ON CONFLICT DO NOTHING;

-- Criar votação demo
INSERT INTO votacoes (
  condominio_id,
  criado_por,
  titulo,
  descricao,
  tipo,
  quorum_minimo,
  data_inicio,
  data_fim,
  status
)
VALUES (
  (SELECT id FROM condominios WHERE nome = 'Condomínio Demo'),
  (SELECT id FROM usuarios WHERE email = 'sindico.demo@votacondominios.com'),
  'Votação de Demonstração',
  'Esta é uma votação de exemplo para testar o sistema.',
  'simples',
  50,
  NOW(),
  NOW() + INTERVAL '7 days',
  'aberta'
)
ON CONFLICT DO NOTHING;

COMMIT;
EOF
  
  echo "✅ Dados de demonstração criados!"
  echo ""
  echo "📧 Credenciais de acesso:"
  echo "Síndico: sindico.demo@votacondominios.com / demo123"
  echo "Moradores: morador1@demo.com até morador10@demo.com / demo123"
}

# =====================================================
# 14. LIMPAR DADOS DE DEMONSTRAÇÃO
# =====================================================

clean_demo_data() {
  echo "🧹 Removendo dados de demonstração..."
  
  read -p "Tem certeza? (yes/no): " confirm
  if [ "$confirm" != "yes" ]; then
    echo "Operação cancelada"
    exit 0
  fi
  
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
DELETE FROM condominios WHERE nome = 'Condomínio Demo';
DELETE FROM usuarios WHERE email LIKE '%@demo.com' OR email = 'sindico.demo@votacondominios.com';
EOF
  
  echo "✅ Dados de demonstração removidos!"
}

# =====================================================
# 15. EXPORTAR DADOS PARA CSV
# =====================================================

export_to_csv() {
  DATE=$(date +%Y%m%d)
  EXPORT_DIR="exports/${DATE}"
  
  echo "📊 Exportando dados para CSV..."
  mkdir -p "$EXPORT_DIR"
  
  # Exportar condomínios
  psql -h db.xxx.supabase.co -U postgres -d postgres \
    -c "COPY (SELECT * FROM condominios) TO STDOUT CSV HEADER" \
    > "${EXPORT_DIR}/condominios.csv"
  
  # Exportar votações
  psql -h db.xxx.supabase.co -U postgres -d postgres \
    -c "COPY (SELECT * FROM votacoes) TO STDOUT CSV HEADER" \
    > "${EXPORT_DIR}/votacoes.csv"
  
  # Exportar usuários (sem senhas)
  psql -h db.xxx.supabase.co -U postgres -d postgres \
    -c "COPY (SELECT id, email, nome_completo, role, ativo FROM usuarios) TO STDOUT CSV HEADER" \
    > "${EXPORT_DIR}/usuarios.csv"
  
  echo "✅ Dados exportados para: $EXPORT_DIR"
  ls -lh "$EXPORT_DIR"
}

# =====================================================
# 16. TESTE DE CARGA (STRESS TEST)
# =====================================================

load_test() {
  URL=${1:-"http://localhost:3000"}
  REQUESTS=${2:-100}
  CONCURRENCY=${3:-10}
  
  echo "⚡ Teste de carga..."
  echo "URL: $URL"
  echo "Requisições: $REQUESTS"
  echo "Concorrência: $CONCURRENCY"
  
  # Usar Apache Bench (instalar se necessário)
  ab -n $REQUESTS -c $CONCURRENCY "$URL/" > load_test_results.txt
  
  echo ""
  echo "Resultados:"
  grep "Requests per second" load_test_results.txt
  grep "Time per request" load_test_results.txt
  grep "Failed requests" load_test_results.txt
}

# =====================================================
# 17. ATUALIZAR DEPENDÊNCIAS
# =====================================================

update_dependencies() {
  echo "📦 Atualizando dependências..."
  
  # Backup package.json
  cp package.json package.json.backup
  
  # Verificar updates
  npm outdated
  
  read -p "Atualizar todos os patches? (yes/no): " confirm
  if [ "$confirm" = "yes" ]; then
    npm update
  fi
  
  read -p "Atualizar majors também? (yes/no): " confirm_major
  if [ "$confirm_major" = "yes" ]; then
    npm install next@latest react@latest react-dom@latest
  fi
  
  # Testar
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Build falhou! Restaurando package.json anterior..."
    cp package.json.backup package.json
    npm install
    exit 1
  fi
  
  echo "✅ Dependências atualizadas com sucesso!"
}

# =====================================================
# 18. VERIFICAR CONFORMIDADE LGPD
# =====================================================

lgpd_compliance_check() {
  echo "📜 Verificando conformidade LGPD..."
  
  # Verificar dados sensíveis
  psql -h db.xxx.supabase.co -U postgres -d postgres <<EOF
-- Verificar criptografia de senhas
SELECT 
  'Senhas criptografadas' as verificacao,
  CASE WHEN senha_hash LIKE 'crypt%' OR senha_hash LIKE '\$2%'
    THEN '✅ OK'
    ELSE '❌ FALHA'
  END as status
FROM usuarios
LIMIT 1;

-- CPFs armazenados
SELECT 
  'Total de CPFs cadastrados' as info,
  COUNT(*) as quantidade
FROM usuarios
WHERE cpf IS NOT NULL;

-- Logs de acesso (últimos 90 dias)
SELECT 
  'Logs dos últimos 90 dias' as info,
  COUNT(*) as quantidade
FROM logs_auditoria
WHERE created_at > NOW() - INTERVAL '90 days';
EOF

  echo ""
  echo "📋 Checklist LGPD:"
  echo "[ ] Política de privacidade publicada"
  echo "[ ] Termos de uso aceitos por usuários"
  echo "[ ] Consentimento para uso de dados"
  echo "[ ] Processo de exclusão de dados implementado"
  echo "[ ] Logs de acesso mantidos por período adequado"
  echo "[ ] Criptografia de dados sensíveis"
  echo "[ ] Backup com retenção definida"
}

# =====================================================
# MENU PRINCIPAL
# =====================================================

show_menu() {
  echo ""
  echo "🗳️  VotaCondôminos - Scripts de Automação"
  echo "=========================================="
  echo "1)  Setup inicial do projeto"
  echo "2)  Deploy para produção"
  echo "3)  Backup do banco de dados"
  echo "4)  Restaurar backup"
  echo "5)  Criar novo condomínio"
  echo "6)  Limpeza de dados antigos"
  echo "7)  Health check do sistema"
  echo "8)  Gerar relatório de uso"
  echo "9)  Enviar email de teste"
  echo "10) Resetar senha de usuário"
  echo "11) Análise de performance"
  echo "12) Auditoria de segurança"
  echo "13) Popular dados de demonstração"
  echo "14) Limpar dados de demonstração"
  echo "15) Exportar dados para CSV"
  echo "16) Teste de carga"
  echo "17) Atualizar dependências"
  echo "18) Verificar conformidade LGPD"
  echo "0)  Sair"
  echo ""
}

# =====================================================
# EXECUÇÃO
# =====================================================

if [ "$1" != "" ]; then
  # Executar função diretamente
  $@
else
  # Menu interativo
  while true; do
    show_menu
    read -p "Escolha uma opção: " option
    
    case $option in
      1) setup_project ;;
      2) deploy_production ;;
      3) backup_database ;;
      4) 
        read -p "Caminho do arquivo de backup: " backup_file
        restore_database "$backup_file"
        ;;
      5) create_condominio ;;
      6) cleanup_old_data ;;
      7) health_check ;;
      8) usage_report ;;
      9) 
        read -p "Email de destino: " email
        test_email "$email"
        ;;
      10)
        read -p "Email do usuário: " email
        reset_user_password "$email"
        ;;
      11) performance_analysis ;;
      12) security_audit ;;
      13) seed_demo_data ;;
      14) clean_demo_data ;;
      15) export_to_csv ;;
      16)
        read -p "URL (default: http://localhost:3000): " url
        read -p "Número de requisições (default: 100): " requests
        read -p "Concorrência (default: 10): " concurrency
        load_test "${url:-http://localhost:3000}" "${requests:-100}" "${concurrency:-10}"
        ;;
      17) update_dependencies ;;
      18) lgpd_compliance_check ;;
      0) 
        echo "👋 Até logo!"
        exit 0
        ;;
      *)
        echo "❌ Opção inválida"
        ;;
    esac
    
    echo ""
    read -p "Pressione ENTER para continuar..."
  done
fi

# =====================================================
# COMO USAR
# =====================================================

# Dar permissão de execução:
# chmod +x scripts.sh

# Executar menu interativo:
# ./scripts.sh

# Executar função específica:
# ./scripts.sh backup_database
# ./scripts.sh deploy_production
# ./scripts.sh health_check

# Agendar backup diário (crontab):
# 0 2 * * * /caminho/para/scripts.sh backup_database

# Monitoramento contínuo:
# watch -n 300 /caminho/para/scripts.sh health_check