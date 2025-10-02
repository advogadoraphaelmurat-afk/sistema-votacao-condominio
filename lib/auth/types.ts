export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  SINDICO = 'sindico',
  MORADOR = 'morador'
}

export enum ApprovalStatus {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  REJEITADO = 'rejeitado',
  BLOQUEADO = 'bloqueado'
}

export interface AuthUser {
  id: string;
  email: string;
  nome_completo: string;
  role: UserRole;
  cpf?: string;
  telefone?: string;
  ativo: boolean;
  email_verificado: boolean;
}

export interface TenantAccess {
  condominio_id: string;
  condominio_nome: string;
  unidade_id?: string;
  unidade_identificador?: string;
  status: ApprovalStatus;
  data_aprovacao?: string;
}

export interface SessionContext {
  user: AuthUser;
  currentTenant?: TenantAccess;
  allTenants: TenantAccess[];
}