'use client';
import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  MoreVertical, 
  Eye, 
  Edit, 
  Archive,
  XCircle 
} from 'lucide-react';

const SuperAdminPanel = () => {
  const [abaSelecionada, setAbaSelecionada] = useState('condominios');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroPlano, setFiltroPlano] = useState('todos');
  const [showModal, setShowModal] = useState(null);
  const [condominioSelecionado, setCondominioSelecionado] = useState(null);

  // Dados mockados
  const condominios = [
    {
      id: 1,
      nome: 'Residencial Jardim das Flores',
      cnpj: '12.345.678/0001-90',
      cidade: 'São Paulo',
      estado: 'SP',
      unidades: 120,
      moradores: 115,
      sindico: 'João Silva',
      votacoesAtivas: 3,
      votacoesTotal: 15,
      ultimaAtividade: '2025-10-01',
      ativo: true,
      plano: 'premium',
      statusPagamento: 'pago',
      proximoVencimento: '2025-10-15',
      valorMensal: 299.90
    },
    {
      id: 2,
      nome: 'Condomínio Vista Verde',
      cnpj: '98.765.432/0001-10',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      unidades: 45,
      moradores: 42,
      sindico: 'Maria Santos',
      votacoesAtivas: 1,
      votacoesTotal: 8,
      ultimaAtividade: '2025-09-28',
      ativo: true,
      plano: 'basico',
      statusPagamento: 'pago',
      proximoVencimento: '2025-10-20',
      valorMensal: 99.90
    },
    {
      id: 3,
      nome: 'Edifício Torre Central',
      cnpj: '55.444.333/0001-22',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      unidades: 250,
      moradores: 238,
      sindico: 'Carlos Oliveira',
      votacoesAtivas: 2,
      votacoesTotal: 28,
      ultimaAtividade: '2025-09-15',
      ativo: false,
      plano: 'enterprise',
      statusPagamento: 'inadimplente',
      proximoVencimento: '2025-09-30',
      valorMensal: 599.90
    },
    {
      id: 4,
      nome: 'Residencial Pôr do Sol',
      cnpj: '11.222.333/0001-44',
      cidade: 'Curitiba',
      estado: 'PR',
      unidades: 80,
      moradores: 75,
      sindico: 'Ana Paula Costa',
      votacoesAtivas: 0,
      votacoesTotal: 5,
      ultimaAtividade: '2025-09-30',
      ativo: true,
      plano: 'basico',
      statusPagamento: 'pendente',
      proximoVencimento: '2025-10-05',
      valorMensal: 99.90
    }
  ];

  const logs = [
    { id: 1, acao: 'LOGIN', usuario: 'João Silva (Síndico)', condominio: 'Residencial Jardim das Flores', data: '2025-10-01 14:23:45', ip: '192.168.1.100' },
    { id: 2, acao: 'CRIAR_VOTACAO', usuario: 'Maria Santos (Síndico)', condominio: 'Condomínio Vista Verde', data: '2025-10-01 10:15:30', ip: '192.168.1.101' },
    { id: 3, acao: 'APROVAR_MORADOR', usuario: 'João Silva (Síndico)', condominio: 'Residencial Jardim das Flores', data: '2025-10-01 09:45:12', ip: '192.168.1.100' },
    { id: 4, acao: 'VOTO_REGISTRADO', usuario: 'Pedro Lima (Morador)', condominio: 'Residencial Jardim das Flores', data: '2025-09-30 18:30:22', ip: '192.168.1.105' },
    { id: 5, acao: 'ATUALIZAR_PLANO', usuario: 'Admin Sistema', condominio: 'Edifício Torre Central', data: '2025-09-30 11:20:00', ip: '10.0.0.1' }
  ];

  const planos = {
    basico: { nome: 'Básico', unidades: 50, cor: 'bg-blue-100 text-blue-700' },
    premium: { nome: 'Premium', unidades: 200, cor: 'bg-purple-100 text-purple-700' },
    enterprise: { nome: 'Enterprise', unidades: 'Ilimitado', cor: 'bg-amber-100 text-amber-700' }
  };

  const metricas = {
    totalCondominios: condominios.length,
    condominiosAtivos: condominios.filter(c => c.ativo).length,
    totalMoradores: condominios.reduce((acc, c) => acc + c.moradores, 0),
    receitaMensal: condominios.filter(c => c.statusPagamento === 'pago').reduce((acc, c) => acc + c.valorMensal, 0),
    inadimplentes: condominios.filter(c => c.statusPagamento === 'inadimplente').length
  };

  const getStatusPagamentoBadge = (status: 'pago' | 'pendente' | 'inadimplente') => {
  const badges = {
    pago: { 
      texto: 'Em dia', 
      cor: 'bg-green-100 text-green-700', 
      icon: CheckCircle 
    },
    pendente: { 
      texto: 'Pagamento Pendente', 
      cor: 'bg-amber-100 text-amber-700', 
      icon: AlertTriangle 
    },
    inadimplente: { 
      texto: 'Inadimplente', 
      cor: 'bg-red-100 text-red-700', 
      icon: XCircle 
    }
  };
  
  const badge = badges[status];
  const Icon = badge.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.cor}`}>
      <Icon size={14} />
      {badge.texto}
    </span>
  );
};

  const condominiosFiltrados = condominios.filter(c => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       c.cidade.toLowerCase().includes(busca.toLowerCase()) ||
                       c.sindico.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || 
                        (filtroStatus === 'ativo' && c.ativo) ||
                        (filtroStatus === 'inativo' && !c.ativo);
    
    const matchPlano = filtroPlano === 'todos' || c.plano === filtroPlano;

    return matchBusca && matchStatus && matchPlano;
  });

  const MetricCard = ({ icon: Icon, titulo, valor, subtitulo, cor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{titulo}</p>
          <p className={`text-3xl font-bold ${cor} mb-1`}>{valor}</p>
          {subtitulo && <p className="text-gray-500 text-sm">{subtitulo}</p>}
        </div>
        <div className={`${cor.replace('text', 'bg').replace('600', '100')} p-3 rounded-lg`}>
          <Icon className={cor} size={24} />
        </div>
      </div>
    </div>
  );

  const ModalNovoCondominio = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Novo Condomínio</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Condomínio *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ex: Residencial..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="00.000.000/0001-00" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Unidades *</label>
              <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ex: 120" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ex: São Paulo" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>SP</option>
                <option>RJ</option>
                <option>MG</option>
                <option>PR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plano *</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="basico">Básico (até 50 unidades) - R$ 99,90/mês</option>
                <option value="premium">Premium (até 200 unidades) - R$ 299,90/mês</option>
                <option value="enterprise">Enterprise (ilimitado) - R$ 599,90/mês</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Síndico *</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="sindico@email.com" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowModal(null)} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
            Cancelar
          </button>
          <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Criar Condomínio
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Super Admin</h1>
              <p className="text-blue-100 mt-1">Gerenciamento de todos os condomínios</p>
            </div>
            <button 
              onClick={() => setShowModal('novo')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 shadow-md"
            >
              <Plus size={20} />
              Novo Condomínio
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            icon={Building2}
            titulo="Total de Condomínios"
            valor={metricas.totalCondominios}
            subtitulo={`${metricas.condominiosAtivos} ativos`}
            cor="text-blue-600"
          />
          <MetricCard
            icon={Users}
            titulo="Total de Moradores"
            valor={metricas.totalMoradores}
            subtitulo="Cadastrados"
            cor="text-green-600"
          />
          <MetricCard
            icon={DollarSign}
            titulo="Receita Mensal"
            valor={`R$ ${metricas.receitaMensal.toFixed(2)}`}
            subtitulo="Pagamentos ativos"
            cor="text-purple-600"
          />
          <MetricCard
            icon={CheckCircle}
            titulo="Adimplentes"
            valor={condominios.filter(c => c.statusPagamento === 'pago').length}
            subtitulo="Em dia"
            cor="text-green-600"
          />
          <MetricCard
            icon={AlertCircle}
            titulo="Inadimplentes"
            valor={metricas.inadimplentes}
            subtitulo="Requer atenção"
            cor="text-red-600"
          />
        </div>

        {/* Abas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setAbaSelecionada('condominios')}
              className={`px-6 py-4 font-semibold transition-colors ${
                abaSelecionada === 'condominios'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Condomínios
            </button>
            <button
              onClick={() => setAbaSelecionada('logs')}
              className={`px-6 py-4 font-semibold transition-colors ${
                abaSelecionada === 'logs'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Logs de Atividade
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {abaSelecionada === 'condominios' && (
              <>
                {/* Filtros e Busca */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar por nome, cidade ou síndico..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os status</option>
                    <option value="ativo">Apenas ativos</option>
                    <option value="inativo">Apenas inativos</option>
                  </select>

                  <select
                    value={filtroPlano}
                    onChange={(e) => setFiltroPlano(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os planos</option>
                    <option value="basico">Básico</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Tabela de Condomínios */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Condomínio</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Localização</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Síndico</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Unidades</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Moradores</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Votações</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plano</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pagamento</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {condominiosFiltrados.map((cond) => (
                        <tr key={cond.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{cond.nome}</p>
                              <p className="text-sm text-gray-500">{cond.cnpj}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{cond.cidade}/{cond.estado}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm text-gray-900">{cond.sindico}</p>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-medium text-gray-900">{cond.unidades}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="text-sm font-medium text-gray-900">{cond.moradores}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-medium text-blue-600">{cond.votacoesAtivas} ativas</span>
                              <span className="text-xs text-gray-500">{cond.votacoesTotal} total</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${planos[cond.plano].cor}`}>
                              {planos[cond.plano].nome}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              {getStatusPagamentoBadge(cond.statusPagamento)}
                              <span className="text-xs text-gray-500">Venc: {new Date(cond.proximoVencimento).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              cond.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {cond.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Ver detalhes">
                                <Eye size={18} className="text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                                <Edit size={18} className="text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Mais opções">
                                <MoreVertical size={18} className="text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {condominiosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Nenhum condomínio encontrado</p>
                    <p className="text-gray-500 text-sm">Tente ajustar os filtros</p>
                  </div>
                )}
              </>
            )}

            {abaSelecionada === 'logs' && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Atividades Recentes do Sistema</h3>
                  <p className="text-gray-600 text-sm">Últimas 50 ações registradas</p>
                </div>

                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{log.acao.replace('_', ' ')}</p>
                            <p className="text-sm text-gray-600">{log.usuario} - {log.condominio}</p>
                            <p className="text-xs text-gray-500 mt-1">IP: {log.ip}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-gray-600 whitespace-nowrap">{log.data}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal === 'novo' && <ModalNovoCondominio />}
    </div>
  );
};

export default SuperAdminPanel;