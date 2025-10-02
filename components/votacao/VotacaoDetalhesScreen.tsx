import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, FileText, Download, ShieldCheck, ArrowLeft, TrendingUp, Award } from 'lucide-react';

const VotacaoDetalhes = () => {
  const [tipoGrafico, setTipoGrafico] = useState('pizza'); // 'pizza' ou 'barras'
  const [showConfirmAuditoria, setShowConfirmAuditoria] = useState(false);
  const [auditada, setAuditada] = useState(false);

  // Dados mockados da votação
  const votacao = {
    id: 1,
    titulo: 'Aprovação da reforma completa da piscina',
    descricao: 'Proposta de reforma completa da piscina do condomínio, incluindo: revestimento de azulejos, sistema de filtragem moderno, iluminação LED, deck de madeira e paisagismo ao redor. O projeto foi orçado em R$ 85.000,00 e será executado pela empresa XYZ Construtora, com prazo de conclusão de 60 dias. Os custos serão divididos proporcionalmente entre todos os condôminos.',
    tipo: 'simples',
    status: 'finalizada',
    dataInicio: '2025-09-15T00:00:00',
    dataFim: '2025-09-22T23:59:59',
    dataCriacao: '2025-09-10',
    criadoPor: 'João Silva - Síndico',
    quorumNecessario: 50,
    quorumAtingido: 85,
    totalElegiveis: 120,
    totalVotos: 102,
    resultado: 'aprovada',
    resultados: [
      { opcao: 'Sim, aprovo', votos: 89, percentual: 87.3, cor: '#10B981' },
      { opcao: 'Não aprovo', votos: 13, percentual: 12.7, cor: '#EF4444' }
    ],
    anexos: [
      { nome: 'orcamento_detalhado.pdf', tamanho: '2.3 MB' },
      { nome: 'projeto_piscina.pdf', tamanho: '5.1 MB' },
      { nome: 'contrato_empresa.pdf', tamanho: '1.8 MB' }
    ]
  };

  // Listas de moradores
  const moradoresVotaram = [
    { id: 1, nome: 'Maria Silva', unidade: 'Apto 101', dataVoto: '2025-09-15 14:23' },
    { id: 2, nome: 'João Santos', unidade: 'Apto 102', dataVoto: '2025-09-15 18:45' },
    { id: 3, nome: 'Ana Costa', unidade: 'Apto 201', dataVoto: '2025-09-16 09:12' },
    { id: 4, nome: 'Pedro Lima', unidade: 'Apto 202', dataVoto: '2025-09-16 11:30' },
    { id: 5, nome: 'Carla Souza', unidade: 'Apto 301', dataVoto: '2025-09-17 15:50' },
    { id: 6, nome: 'Roberto Alves', unidade: 'Apto 302', dataVoto: '2025-09-17 20:15' },
    { id: 7, nome: 'Julia Fernandes', unidade: 'Apto 401', dataVoto: '2025-09-18 08:30' },
    { id: 8, nome: 'Marcos Pereira', unidade: 'Apto 402', dataVoto: '2025-09-18 19:45' }
  ];

  const moradoresNaoVotaram = [
    { id: 9, nome: 'Lucas Oliveira', unidade: 'Apto 103', status: 'Não votou' },
    { id: 10, nome: 'Beatriz Rocha', unidade: 'Apto 203', status: 'Não votou' },
    { id: 11, nome: 'Fernando Dias', unidade: 'Apto 303', status: 'Não votou' },
    { id: 12, nome: 'Patricia Gomes', unidade: 'Apto 403', status: 'Não votou' }
  ];

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const gerarAta = () => {
    alert('Gerando ata em PDF...');
    console.log('Ata gerada para votação:', votacao.titulo);
  };

  const confirmarAuditoria = () => {
    setAuditada(true);
    setShowConfirmAuditoria(false);
    console.log('Votação marcada como auditada');
  };

  const getStatusBadge = () => {
    if (votacao.status === 'ativa') {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          <Clock size={16} />
          Em Andamento
        </span>
      );
    }

    if (votacao.resultado === 'aprovada') {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
          <CheckCircle size={16} />
          Aprovada
        </span>
      );
    }

    if (votacao.resultado === 'reprovada') {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
          <XCircle size={16} />
          Reprovada
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
        <AlertCircle size={16} />
        Finalizada
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{votacao.titulo}</h1>
              <p className="text-gray-600 mt-1">Criada em {new Date(votacao.dataCriacao).toLocaleDateString('pt-BR')} por {votacao.criadoPor}</p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Status de Auditoria */}
          {votacao.status === 'finalizada' && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              auditada ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
            }`}>
              <ShieldCheck className={auditada ? 'text-green-600' : 'text-amber-600'} size={24} />
              <div className="flex-1">
                <p className={`font-semibold ${auditada ? 'text-green-900' : 'text-amber-900'}`}>
                  {auditada ? 'Votação Auditada e Confirmada' : 'Aguardando Auditoria'}
                </p>
                <p className={`text-sm ${auditada ? 'text-green-700' : 'text-amber-700'}`}>
                  {auditada 
                    ? 'Esta votação foi auditada e os resultados foram confirmados'
                    : 'Revise os resultados e confirme a auditoria para finalizar o processo'
                  }
                </p>
              </div>
              {!auditada && (
                <button
                  onClick={() => setShowConfirmAuditoria(true)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
                >
                  Auditar Agora
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-700 leading-relaxed">{votacao.descricao}</p>
              
              {votacao.anexos.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={20} />
                    Documentos Anexos
                  </h3>
                  <div className="space-y-2">
                    {votacao.anexos.map((anexo, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-600" size={20} />
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600">
                              {anexo.nome}
                            </p>
                            <p className="text-sm text-gray-500">{anexo.tamanho}</p>
                          </div>
                        </div>
                        <Download className="text-gray-400 group-hover:text-blue-600" size={20} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {votacao.status === 'ativa' ? 'Resultados Parciais' : 'Resultados Finais'}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTipoGrafico('pizza')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      tipoGrafico === 'pizza'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pizza
                  </button>
                  <button
                    onClick={() => setTipoGrafico('barras')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      tipoGrafico === 'barras'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Barras
                  </button>
                </div>
              </div>

              {/* Gráficos */}
              <div className="mb-6">
                {tipoGrafico === 'pizza' ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={votacao.resultados}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ opcao, percentual }) => `${opcao}: ${percentual.toFixed(1)}%`}
                        outerRadius={100}
                        dataKey="votos"
                      >
                        {votacao.resultados.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={votacao.resultados}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="opcao" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="votos" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Lista de Resultados */}
              <div className="space-y-4">
                {votacao.resultados.map((resultado, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{resultado.opcao}</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">{resultado.votos}</span>
                        <span className="text-sm text-gray-600 ml-2">votos</span>
                      </div>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${resultado.percentual}%`,
                          backgroundColor: resultado.cor
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{resultado.percentual.toFixed(1)}% dos votos</p>
                  </div>
                ))}
              </div>

              {/* Análise */}
              {votacao.status === 'finalizada' && votacao.resultado === 'aprovada' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Award className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-green-900">Proposta Aprovada com Sucesso</p>
                      <p className="text-green-800 text-sm mt-1">
                        A votação atingiu {votacao.quorumAtingido}% de participação, superando o quórum mínimo de {votacao.quorumNecessario}%. 
                        A proposta foi aprovada por {votacao.resultados[0].percentual.toFixed(1)}% dos votantes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Participação */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Participação</h2>
              
              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button className="pb-3 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold">
                  Votaram ({moradoresVotaram.length})
                </button>
                <button className="pb-3 px-1 text-gray-600 hover:text-gray-900">
                  Não Votaram ({moradoresNaoVotaram.length})
                </button>
              </div>

              {/* Lista de quem votou */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {moradoresVotaram.map((morador) => (
                  <div key={morador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{morador.nome}</p>
                        <p className="text-sm text-gray-600">{morador.unidade}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(morador.dataVoto).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Informações</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Período</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {formatarData(votacao.dataInicio)}
                  </p>
                  <p className="text-sm text-gray-900 ml-6">
                    até {formatarData(votacao.dataFim)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-sm font-medium">Quórum</span>
                  </div>
                  <div className="ml-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Necessário:</span>
                      <span className="font-semibold text-gray-900">{votacao.quorumNecessario}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Atingido:</span>
                      <span className={`font-semibold ${
                        votacao.quorumAtingido >= votacao.quorumNecessario ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {votacao.quorumAtingido}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          votacao.quorumAtingido >= votacao.quorumNecessario ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(votacao.quorumAtingido, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users size={16} />
                    <span className="text-sm font-medium">Participação</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {votacao.totalVotos} de {votacao.totalElegiveis} moradores
                  </p>
                  <div className="ml-6 mt-2">
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        {moradoresVotaram.length} votaram
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {moradoresNaoVotaram.length} faltam
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            {votacao.status === 'finalizada' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Ações</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={gerarAta}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Download size={20} />
                    Gerar Ata (PDF)
                  </button>

                  {!auditada && (
                    <button
                      onClick={() => setShowConfirmAuditoria(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <ShieldCheck size={20} />
                      Confirmar Auditoria
                    </button>
                  )}

                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    <FileText size={20} />
                    Exportar Relatório
                  </button>
                </div>
              </div>
            )}

            {/* Moradores que não votaram */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Não Votaram</h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {moradoresNaoVotaram.map((morador) => (
                  <div key={morador.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XCircle className="text-red-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{morador.nome}</p>
                      <p className="text-xs text-gray-600">{morador.unidade}</p>
                    </div>
                  </div>
                ))}
              </div>

              {moradoresNaoVotaram.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Todos votaram!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Auditoria */}
      {showConfirmAuditoria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirmar Auditoria</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Ao confirmar a auditoria, você está validando que os resultados desta votação foram revisados 
              e estão corretos. Esta ação não pode ser desfeita.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900">
                <strong>Atenção:</strong> Certifique-se de que todos os votos foram contabilizados corretamente 
                antes de confirmar a auditoria.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmAuditoria(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAuditoria}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotacaoDetalhes;