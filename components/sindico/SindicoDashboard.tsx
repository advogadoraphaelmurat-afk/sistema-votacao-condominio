import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, TrendingUp, CheckCircle, Clock, Plus, Filter, ChevronDown, AlertCircle, Award } from 'lucide-react';

const SindicoDashboard = () => {
  const [filtroAtivo, setFiltroAtivo] = useState('ativas');
  const [votacaoSelecionada, setVotacaoSelecionada] = useState(null);

  // Dados mockados
  const metricas = {
    votacoesAtivas: 3,
    votacoesFinalizadas: 8,
    participacaoMedia: 72,
    moradoresCadastrados: 120,
    moradoresAprovados: 115
  };

  const votacoes = [
    {
      id: 1,
      titulo: 'Aprovação da nova pintura das áreas comuns',
      status: 'ativa',
      tipo: 'simples',
      dataInicio: '2025-10-01',
      dataFim: '2025-10-05',
      quorumNecessario: 50,
      participacaoAtual: 68,
      totalVotos: 82,
      totalElegiveis: 120,
      resultados: [
        { opcao: 'Sim, aprovo', votos: 65, percentual: 79 },
        { opcao: 'Não aprovo', votos: 17, percentual: 21 }
      ]
    },
    {
      id: 2,
      titulo: 'Escolha do novo síndico',
      status: 'ativa',
      tipo: 'multipla',
      dataInicio: '2025-10-02',
      dataFim: '2025-10-08',
      quorumNecessario: 60,
      participacaoAtual: 56,
      totalVotos: 67,
      totalElegiveis: 120,
      resultados: [
        { opcao: 'João Silva', votos: 28, percentual: 42 },
        { opcao: 'Maria Santos', votos: 25, percentual: 37 },
        { opcao: 'Pedro Costa', votos: 14, percentual: 21 }
      ]
    },
    {
      id: 3,
      titulo: 'Instalação de câmeras de segurança adicionais',
      status: 'ativa',
      tipo: 'simples',
      dataInicio: '2025-09-28',
      dataFim: '2025-10-03',
      quorumNecessario: 50,
      participacaoAtual: 74,
      totalVotos: 89,
      totalElegiveis: 120,
      resultados: [
        { opcao: 'Sim, aprovo', votos: 78, percentual: 88 },
        { opcao: 'Não aprovo', votos: 11, percentual: 12 }
      ]
    },
    {
      id: 4,
      titulo: 'Reforma da piscina - Aprovação do orçamento',
      status: 'finalizada',
      tipo: 'simples',
      dataInicio: '2025-09-15',
      dataFim: '2025-09-22',
      quorumNecessario: 50,
      participacaoAtual: 85,
      totalVotos: 102,
      totalElegiveis: 120,
      resultado: 'aprovada',
      resultados: [
        { opcao: 'Sim, aprovo', votos: 89, percentual: 87 },
        { opcao: 'Não aprovo', votos: 13, percentual: 13 }
      ]
    },
    {
      id: 5,
      titulo: 'Mudança de horário da academia',
      status: 'finalizada',
      tipo: 'simples',
      dataInicio: '2025-09-10',
      dataFim: '2025-09-17',
      quorumNecessario: 50,
      participacaoAtual: 42,
      totalVotos: 50,
      totalElegiveis: 120,
      resultado: 'quorum_nao_atingido',
      resultados: [
        { opcao: 'Sim, aprovo', votos: 35, percentual: 70 },
        { opcao: 'Não aprovo', votos: 15, percentual: 30 }
      ]
    },
    {
      id: 6,
      titulo: 'Proposta de novo regimento interno',
      status: 'rascunho',
      tipo: 'simples',
      dataInicio: '',
      dataFim: '',
      quorumNecessario: 60,
      participacaoAtual: 0,
      totalVotos: 0,
      totalElegiveis: 120,
      resultados: []
    }
  ];

  const votacoesFiltradas = votacoes.filter(v => {
    if (filtroAtivo === 'ativas') return v.status === 'ativa';
    if (filtroAtivo === 'finalizadas') return v.status === 'finalizada';
    if (filtroAtivo === 'rascunho') return v.status === 'rascunho';
    return true;
  });

  const getStatusInfo = (votacao) => {
    if (votacao.status === 'rascunho') {
      return { texto: 'Rascunho', cor: 'text-gray-600', bg: 'bg-gray-100' };
    }
    
    if (votacao.status === 'ativa') {
      const atingiuQuorum = votacao.participacaoAtual >= votacao.quorumNecessario;
      return {
        texto: atingiuQuorum ? 'Em andamento (Quórum atingido)' : 'Aguardando quórum',
        cor: atingiuQuorum ? 'text-blue-700' : 'text-amber-700',
        bg: atingiuQuorum ? 'bg-blue-100' : 'bg-amber-100'
      };
    }

    if (votacao.resultado === 'aprovada') {
      return { texto: 'Aprovada', cor: 'text-green-700', bg: 'bg-green-100' };
    }
    
    if (votacao.resultado === 'reprovada') {
      return { texto: 'Reprovada', cor: 'text-red-700', bg: 'bg-red-100' };
    }
    
    if (votacao.resultado === 'quorum_nao_atingido') {
      return { texto: 'Quórum não atingido', cor: 'text-gray-700', bg: 'bg-gray-100' };
    }

    return { texto: 'Finalizada', cor: 'text-gray-700', bg: 'bg-gray-100' };
  };

  const MetricCard = ({ icon: Icon, titulo, valor, subtitulo, cor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

  const VotacaoCard = ({ votacao }) => {
    const statusInfo = getStatusInfo(votacao);
    const atingiuQuorum = votacao.participacaoAtual >= votacao.quorumNecessario;
    const isExpandida = votacaoSelecionada === votacao.id;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{votacao.titulo}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.cor}`}>
                  {statusInfo.texto}
                </span>
                {votacao.status !== 'rascunho' && (
                  <span className="text-sm text-gray-600">
                    {votacao.dataInicio} até {votacao.dataFim}
                  </span>
                )}
              </div>
            </div>
            {votacao.status === 'rascunho' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Publicar
              </button>
            )}
          </div>

          {votacao.status !== 'rascunho' && (
            <>
              {/* Participação */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Participação</span>
                  <span className="text-sm font-bold text-gray-900">
                    {votacao.totalVotos} de {votacao.totalElegiveis} moradores ({votacao.participacaoAtual}%)
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      atingiuQuorum ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(votacao.participacaoAtual, 100)}%` }}
                  ></div>
                  {/* Linha do Quórum */}
                  <div 
                    className="absolute top-0 h-3 w-0.5 bg-red-500"
                    style={{ left: `${votacao.quorumNecessario}%` }}
                  >
                    <div className="absolute -top-6 -left-8 text-xs text-red-600 font-semibold whitespace-nowrap">
                      Quórum {votacao.quorumNecessario}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultados Resumidos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {votacao.resultados.slice(0, 3).map((resultado, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 truncate">{resultado.opcao}</p>
                    <p className="text-xl font-bold text-gray-900">{resultado.votos}</p>
                    <p className="text-xs text-gray-500">{resultado.percentual}%</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Botão Ver Detalhes */}
          <button
            onClick={() => setVotacaoSelecionada(isExpandida ? null : votacao.id)}
            className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm border-t border-gray-200 pt-4"
          >
            {isExpandida ? 'Ocultar detalhes' : 'Ver detalhes completos'}
            <ChevronDown className={`transform transition-transform ${isExpandida ? 'rotate-180' : ''}`} size={18} />
          </button>
        </div>

        {/* Detalhes Expandidos */}
        {isExpandida && votacao.status !== 'rascunho' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <h4 className="font-semibold text-gray-900 mb-4">Distribuição de Votos</h4>
            
            {/* Gráfico de Barras */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={votacao.resultados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="opcao" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votos" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>

            {/* Lista Detalhada */}
            <div className="mt-6 space-y-3">
              {votacao.resultados.map((resultado, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{resultado.opcao}</span>
                    <span className="text-lg font-bold text-gray-900">{resultado.votos} votos</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${resultado.percentual}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{resultado.percentual}% dos votos</p>
                </div>
              ))}
            </div>

            {/* Ações */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Exportar Relatório
              </button>
              {votacao.status === 'ativa' && (
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
                  Encerrar Votação
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Dados para gráfico de pizza
  const participacaoData = [
    { name: 'Participaram', value: metricas.participacaoMedia },
    { name: 'Não participaram', value: 100 - metricas.participacaoMedia }
  ];
  const COLORS = ['#3B82F6', '#E5E7EB'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard do Síndico</h1>
              <p className="text-gray-600 mt-1">Condomínio Residencial Exemplo</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm">
              <Plus size={20} />
              Nova Votação
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Clock}
            titulo="Votações Ativas"
            valor={metricas.votacoesAtivas}
            subtitulo="Em andamento"
            cor="text-blue-600"
          />
          <MetricCard
            icon={CheckCircle}
            titulo="Finalizadas (30 dias)"
            valor={metricas.votacoesFinalizadas}
            subtitulo="Último mês"
            cor="text-green-600"
          />
          <MetricCard
            icon={TrendingUp}
            titulo="Participação Média"
            valor={`${metricas.participacaoMedia}%`}
            subtitulo="Últimas votações"
            cor="text-purple-600"
          />
          <MetricCard
            icon={Users}
            titulo="Moradores"
            valor={metricas.moradoresAprovados}
            subtitulo={`${metricas.moradoresCadastrados} cadastrados`}
            cor="text-amber-600"
          />
        </div>

        {/* Gráfico de Participação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Taxa de Participação Geral</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={participacaoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {participacaoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Moradores participantes</p>
                    <p className="text-sm text-gray-600">Média de {metricas.participacaoMedia}% de participação</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Não participaram</p>
                    <p className="text-sm text-gray-600">{100 - metricas.participacaoMedia}% não votaram</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Award className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Excelente engajamento!</p>
                    <p className="text-blue-800 text-sm mt-1">
                      A participação está acima da média nacional de 60%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter size={18} />
            <span>Filtrar por:</span>
          </div>
          {['ativas', 'finalizadas', 'rascunho', 'todas'].map((filtro) => (
            <button
              key={filtro}
              onClick={() => setFiltroAtivo(filtro)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filtroAtivo === filtro
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
            </button>
          ))}
        </div>

        {/* Lista de Votações */}
        <div className="space-y-6">
          {votacoesFiltradas.length > 0 ? (
            votacoesFiltradas.map(votacao => (
              <VotacaoCard key={votacao.id} votacao={votacao} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma votação encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Não há votações com o filtro selecionado
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                Criar primeira votação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SindicoDashboard;