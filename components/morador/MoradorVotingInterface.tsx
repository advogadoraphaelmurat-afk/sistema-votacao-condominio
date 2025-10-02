'use client';
import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const MoradorVotingInterface = () => {
  // ... o resto do seu código permanece IGUAL
import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const MoradorVotingInterface = () => {
  // Dados mockados das votações
  const [votacoes, setVotacoes] = useState([
    {
      id: 1,
      titulo: 'Aprovação da nova pintura das áreas comuns',
      descricao: 'Proposta de pintura completa do hall de entrada, corredores e salão de festas com as cores: paredes em branco gelo e detalhes em azul petróleo. O orçamento aprovado é de R$ 15.000,00.',
      tipo: 'simples',
      dataFim: '2025-10-05T18:00:00',
      opcoes: [
        { id: 'sim', texto: 'Sim, aprovo' },
        { id: 'nao', texto: 'Não aprovo' }
      ],
      meuVoto: null,
      totalVotos: 45,
      totalMoradores: 120,
      anexos: ['orcamento_pintura.pdf', 'paleta_cores.jpg']
    },
    {
      id: 2,
      titulo: 'Escolha do novo síndico',
      descricao: 'Eleição para síndico do condomínio para o mandato 2025-2027. Conheça as propostas de cada candidato nos documentos anexos.',
      tipo: 'multipla',
      dataFim: '2025-10-08T20:00:00',
      opcoes: [
        { id: 'candidato1', texto: 'João Silva - Apto 302' },
        { id: 'candidato2', texto: 'Maria Santos - Apto 105' },
        { id: 'candidato3', texto: 'Pedro Costa - Apto 201' }
      ],
      meuVoto: 'candidato2',
      totalVotos: 67,
      totalMoradores: 120,
      anexos: ['propostas_candidatos.pdf']
    },
    {
      id: 3,
      titulo: 'Instalação de câmeras de segurança adicionais',
      descricao: 'Proposta para instalar 4 câmeras adicionais: 2 na garagem, 1 no playground e 1 na entrada de serviço. Investimento total de R$ 8.500,00.',
      tipo: 'simples',
      dataFim: '2025-10-03T23:59:59',
      opcoes: [
        { id: 'sim', texto: 'Sim, aprovo' },
        { id: 'nao', texto: 'Não aprovo' }
      ],
      meuVoto: 'sim',
      totalVotos: 89,
      totalMoradores: 120,
      anexos: []
    }
  ]);

  const [votacaoExpandida, setVotacaoExpandida] = useState(null);
  const [showConfirmacao, setShowConfirmacao] = useState(null);
  const [votoSelecionado, setVotoSelecionado] = useState({});

  // Calcular tempo restante
  const estaProximoDoFim = (dataFim: string | Date) => {
  const agora = new Date();
  const fim = new Date(dataFim);
  const diff = fim.getTime() - agora.getTime();
  return diff <= 24 * 60 * 60 * 1000; // 24 horas em milissegundos
};

  // Verificar se está próximo do fim (últimas 24h)
  const estaProximoDoFim = (dataFim: string | Date): boolean => {
  const agora = new Date();
  const fim = new Date(dataFim);
  const diff = fim.getTime() - agora.getTime();
  const vinteQuatroHoras = 24 * 60 * 60 * 1000; // 24h em milissegundos
  
  return diff <= vinteQuatroHoras && diff > 0;
};

  // Registrar voto
  const registrarVoto = (votacaoId, opcaoId) => {
    setVotacoes(prev => prev.map(v => {
      if (v.id === votacaoId) {
        const jaVotou = v.meuVoto !== null;
        return {
          ...v,
          meuVoto: opcaoId,
          totalVotos: jaVotou ? v.totalVotos : v.totalVotos + 1
        };
      }
      return v;
    }));

    setShowConfirmacao(votacaoId);
    setTimeout(() => setShowConfirmacao(null), 3000);
    setVotoSelecionado(prev => ({ ...prev, [votacaoId]: null }));
  };

  // Confirmar mudança de voto
  const confirmarVoto = (votacaoId) => {
    const opcaoId = votoSelecionado[votacaoId];
    if (opcaoId) {
      registrarVoto(votacaoId, opcaoId);
    }
  };

  const CardVotacao = ({ votacao }) => {
    const tempoRestante = calcularTempoRestante(votacao.dataFim);
    const proximoFim = estaProximoDoFim(votacao.dataFim);
    const jaVotou = votacao.meuVoto !== null;
    const expandida = votacaoExpandida === votacao.id;
    const participacao = Math.round((votacao.totalVotos / votacao.totalMoradores) * 100);
    const opcaoSelecionadaTemp = votoSelecionado[votacao.id];
    const mostrarBotaoConfirmar = jaVotou && opcaoSelecionadaTemp && opcaoSelecionadaTemp !== votacao.meuVoto;

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-gray-100 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1">
              {votacao.titulo}
            </h3>
            {jaVotou && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <CheckCircle size={16} />
                  Você votou
                </span>
              </div>
            )}
          </div>

          {/* Prazo */}
          <div className={`flex items-center gap-2 text-sm font-medium mb-4 ${
            proximoFim ? 'text-red-600' : 'text-gray-600'
          }`}>
            <Clock size={16} />
            <span>{tempoRestante}</span>
          </div>

          {/* Barra de Participação */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Participação</span>
              <span className="font-medium">{votacao.totalVotos} de {votacao.totalMoradores} moradores</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${participacao}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{participacao}% de participação</p>
          </div>

          {/* Botão Expandir/Recolher Descrição */}
          <button
            onClick={() => setVotacaoExpandida(expandida ? null : votacao.id)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {expandida ? (
              <>
                <ChevronUp size={18} />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                Ver detalhes
              </>
            )}
          </button>
        </div>

        {/* Descrição Expandida */}
        {expandida && (
          <div className="px-6 pb-4 border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed mb-4">
              {votacao.descricao}
            </p>
            
            {votacao.anexos.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Documentos anexos
                </h4>
                <div className="space-y-2">
                  {votacao.anexos.map((anexo, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      📎 {anexo}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Opções de Voto */}
        <div className="p-6 pt-0 space-y-3">
          {votacao.opcoes.map((opcao) => {
            const estaSelecionado = jaVotou && votacao.meuVoto === opcao.id;
            const selecionadoTemp = opcaoSelecionadaTemp === opcao.id;
            
            return (
              <button
                key={opcao.id}
                onClick={() => {
                  if (jaVotou) {
                    setVotoSelecionado(prev => ({ ...prev, [votacao.id]: opcao.id }));
                  } else {
                    registrarVoto(votacao.id, opcao.id);
                  }
                }}
                className={`w-full p-4 rounded-xl font-semibold text-lg transition-all border-2 ${
                  estaSelecionado && !selecionadoTemp
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : selecionadoTemp
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opcao.texto}</span>
                  {estaSelecionado && !selecionadoTemp && (
                    <CheckCircle className="text-green-600" size={24} />
                  )}
                  {selecionadoTemp && (
                    <div className="w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão Confirmar Mudança de Voto */}
        {mostrarBotaoConfirmar && (
          <div className="px-6 pb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <AlertCircle size={16} />
                Você está alterando seu voto
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setVotoSelecionado(prev => ({ ...prev, [votacao.id]: null }))}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => confirmarVoto(votacao.id)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                Confirmar Alteração
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de Confirmação */}
        {showConfirmacao === votacao.id && (
          <div className="px-6 pb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-pulse">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-green-800 font-semibold">Voto registrado com sucesso!</p>
                <p className="text-green-700 text-sm">Obrigado pela sua participação.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Votações Ativas</h1>
          <p className="text-gray-600 mt-1">Condomínio Residencial Exemplo</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Aviso de Participação */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Sua participação é importante!</h3>
              <p className="text-blue-800 text-sm">
                Vote nas pautas abaixo. Você pode alterar seu voto enquanto a votação estiver ativa.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Votações */}
        <div className="space-y-6">
          {votacoes.map(votacao => (
            <CardVotacao key={votacao.id} votacao={votacao} />
          ))}
        </div>

        {/* Empty State (quando não há votações) */}
        {votacoes.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma votação ativa no momento
            </h3>
            <p className="text-gray-600">
              Quando houver novas votações, elas aparecerão aqui.
            </p>
          </div>
        )}
      </div>

      {/* Footer Informativo */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">💡 Dicas</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Você pode alterar seu voto enquanto a votação estiver ativa</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Clique em "Ver detalhes" para ler a descrição completa e documentos</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600">•</span>
              <span>Fique atento ao prazo limite de cada votação</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MoradorVotingInterface;