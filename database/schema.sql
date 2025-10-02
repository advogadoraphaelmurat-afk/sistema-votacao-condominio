-- =====================================================
-- SCHEMA POSTGRESQL - SAAS MULTI-TENANT DE VOTAÇÃO
-- Sistema de votação para condomínios com isolamento total
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: condominios
-- Representa cada condomínio (tenant principal)
-- =====================================================
CREATE TABLE condominios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    endereco TEXT,
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(9),
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_condominios_ativo ON condominios(ativo);
CREATE INDEX idx_condominios_cnpj ON condominios(cnpj) WHERE cnpj IS NOT NULL;

-- =====================================================
-- TABELA: unidades
-- Apartamentos/casas dentro de cada condomínio
-- =====================================================
CREATE TABLE unidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condominio_id UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
    identificador VARCHAR(50) NOT NULL, -- Ex: "Apto 101", "Bloco A - 203"
    bloco VARCHAR(50),
    andar INTEGER,
    fracao_ideal DECIMAL(10, 6) DEFAULT 1.0, -- Para votações ponderadas
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(condominio_id, identificador)
);

CREATE INDEX idx_unidades_condominio ON unidades(condominio_id);
CREATE INDEX idx_unidades_ativo ON unidades(condominio_id, ativo);

-- =====================================================
-- TABELA: usuarios
-- Todos os usuários do sistema (admin, síndicos, moradores)
-- =====================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'sindico', 'morador')),
    ativo BOOLEAN DEFAULT true,
    email_verificado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- =====================================================
-- TABELA: usuarios_condominios
-- Relacionamento entre usuários e condomínios (multi-tenancy)
-- Controla acesso e aprovação de moradores
-- =====================================================
CREATE TABLE usuarios_condominios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    condominio_id UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
    unidade_id UUID REFERENCES unidades(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'bloqueado')),
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_aprovacao TIMESTAMP,
    aprovado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, condominio_id)
);

CREATE INDEX idx_usuarios_condominios_usuario ON usuarios_condominios(usuario_id);
CREATE INDEX idx_usuarios_condominios_condominio ON usuarios_condominios(condominio_id);
CREATE INDEX idx_usuarios_condominios_status ON usuarios_condominios(condominio_id, status);
CREATE INDEX idx_usuarios_condominios_unidade ON usuarios_condominios(unidade_id);

-- =====================================================
-- TABELA: votacoes
-- Pautas/votações criadas pelos síndicos
-- =====================================================
CREATE TABLE votacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condominio_id UUID NOT NULL REFERENCES condominios(id) ON DELETE CASCADE,
    criado_por UUID NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) NOT NULL DEFAULT 'simples' 
        CHECK (tipo IN ('simples', 'multipla_escolha', 'ponderada')),
    quorum_minimo DECIMAL(5, 2) DEFAULT 50.0, -- Percentual necessário
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'rascunho'
        CHECK (status IN ('rascunho', 'aberta', 'encerrada', 'cancelada')),
    permite_abstencao BOOLEAN DEFAULT true,
    resultado_visivel_antes_fim BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_datas_votacao CHECK (data_fim > data_inicio)
);

CREATE INDEX idx_votacoes_condominio ON votacoes(condominio_id);
CREATE INDEX idx_votacoes_status ON votacoes(condominio_id, status);
CREATE INDEX idx_votacoes_datas ON votacoes(data_inicio, data_fim);
CREATE INDEX idx_votacoes_criador ON votacoes(criado_por);

-- =====================================================
-- TABELA: opcoes_votacao
-- Opções de resposta para cada votação
-- =====================================================
CREATE TABLE opcoes_votacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    votacao_id UUID NOT NULL REFERENCES votacoes(id) ON DELETE CASCADE,
    texto VARCHAR(500) NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_opcoes_votacao_votacao ON opcoes_votacao(votacao_id);
CREATE INDEX idx_opcoes_votacao_ordem ON opcoes_votacao(votacao_id, ordem);

-- =====================================================
-- TABELA: votos
-- Registro dos votos realizados
-- =====================================================
CREATE TABLE votos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    votacao_id UUID NOT NULL REFERENCES votacoes(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    unidade_id UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
    opcao_id UUID REFERENCES opcoes_votacao(id) ON DELETE CASCADE,
    abstencao BOOLEAN DEFAULT false,
    peso DECIMAL(10, 6) DEFAULT 1.0, -- Baseado na fração ideal
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(votacao_id, usuario_id),
    CONSTRAINT chk_voto_valido CHECK (
        (opcao_id IS NOT NULL AND abstencao = false) OR
        (opcao_id IS NULL AND abstencao = true)
    )
);

CREATE INDEX idx_votos_votacao ON votos(votacao_id);
CREATE INDEX idx_votos_usuario ON votos(usuario_id);
CREATE INDEX idx_votos_opcao ON votos(opcao_id);
CREATE INDEX idx_votos_unidade ON votos(unidade_id);

-- =====================================================
-- TABELA: logs_auditoria
-- Registro de ações importantes para auditoria
-- =====================================================
CREATE TABLE logs_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    condominio_id UUID REFERENCES condominios(id) ON DELETE SET NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(50) NOT NULL,
    entidade_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_condominio ON logs_auditoria(condominio_id);
CREATE INDEX idx_logs_usuario ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_acao ON logs_auditoria(acao);
CREATE INDEX idx_logs_entidade ON logs_auditoria(entidade, entidade_id);
CREATE INDEX idx_logs_data ON logs_auditoria(created_at);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para votações ativas com contagem de votos
CREATE VIEW v_votacoes_resumo AS
SELECT 
    v.id,
    v.condominio_id,
    v.titulo,
    v.descricao,
    v.tipo,
    v.data_inicio,
    v.data_fim,
    v.status,
    COUNT(DISTINCT vo.id) as total_votos,
    COUNT(DISTINCT CASE WHEN vo.abstencao = false THEN vo.id END) as votos_validos,
    COUNT(DISTINCT CASE WHEN vo.abstencao = true THEN vo.id END) as abstencoes,
    u.nome_completo as criado_por_nome
FROM votacoes v
LEFT JOIN votos vo ON v.id = vo.votacao_id
LEFT JOIN usuarios u ON v.criado_por = u.id
GROUP BY v.id, u.nome_completo;

-- View para moradores aprovados por condomínio
CREATE VIEW v_moradores_aprovados AS
SELECT 
    u.id as usuario_id,
    u.nome_completo,
    u.email,
    u.telefone,
    c.id as condominio_id,
    c.nome as condominio_nome,
    un.identificador as unidade,
    uc.data_aprovacao,
    uc.status
FROM usuarios u
INNER JOIN usuarios_condominios uc ON u.id = uc.usuario_id
INNER JOIN condominios c ON uc.condominio_id = c.id
LEFT JOIN unidades un ON uc.unidade_id = un.id
WHERE u.role = 'morador' 
  AND uc.status = 'aprovado'
  AND u.ativo = true
  AND c.ativo = true;

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_condominios_updated_at BEFORE UPDATE ON condominios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unidades_updated_at BEFORE UPDATE ON unidades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_condominios_updated_at BEFORE UPDATE ON usuarios_condominios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_votacoes_updated_at BEFORE UPDATE ON votacoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para registrar aprovação de morador
CREATE OR REPLACE FUNCTION registrar_aprovacao_morador()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'aprovado' AND OLD.status != 'aprovado' THEN
        NEW.data_aprovacao = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_aprovacao_morador BEFORE UPDATE ON usuarios_condominios
    FOR EACH ROW EXECUTE FUNCTION registrar_aprovacao_morador();

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - Exemplo básico
-- =====================================================

-- Habilitar RLS nas tabelas principais
ALTER TABLE condominios ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE votacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos ENABLE ROW LEVEL SECURITY;

-- Exemplo de política: usuários só veem dados do seu condomínio
-- (Implementação completa depende do sistema de autenticação)
CREATE POLICY condominio_isolation_policy ON votacoes
    USING (condominio_id IN (
        SELECT condominio_id 
        FROM usuarios_condominios 
        WHERE usuario_id = current_setting('app.current_user_id')::UUID
        AND status = 'aprovado'
    ));

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir usuário administrador do sistema
INSERT INTO usuarios (email, senha_hash, nome_completo, role, ativo, email_verificado)
VALUES (
    'admin@sistema.com',
    crypt('senha_inicial_123', gen_salt('bf')), -- Usar bcrypt na produção
    'Administrador do Sistema',
    'admin',
    true,
    true
);

-- =====================================================
-- COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE condominios IS 'Cadastro de condomínios (tenants principais do sistema)';
COMMENT ON TABLE unidades IS 'Unidades (apartamentos/casas) dentro de cada condomínio';
COMMENT ON TABLE usuarios IS 'Todos os usuários do sistema com diferentes níveis de acesso';
COMMENT ON TABLE usuarios_condominios IS 'Relacionamento multi-tenant com controle de aprovação';
COMMENT ON TABLE votacoes IS 'Pautas e votações criadas pelos síndicos';
COMMENT ON TABLE opcoes_votacao IS 'Opções de resposta para cada votação';
COMMENT ON TABLE votos IS 'Registro dos votos realizados pelos moradores';
COMMENT ON TABLE logs_auditoria IS 'Log de auditoria para rastreabilidade de ações';

COMMENT ON COLUMN usuarios_condominios.status IS 'Status: pendente (aguardando aprovação), aprovado, rejeitado, bloqueado';
COMMENT ON COLUMN unidades.fracao_ideal IS 'Fração ideal para votações ponderadas (default 1.0 = 1 voto)';
COMMENT ON COLUMN votacoes.tipo IS 'Tipo: simples (sim/não), multipla_escolha, ponderada (por fração ideal)';
COMMENT ON COLUMN votacoes.quorum_minimo IS 'Percentual mínimo de participação para validar a votação';