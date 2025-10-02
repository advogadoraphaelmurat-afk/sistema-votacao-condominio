import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Loader, Printer } from 'lucide-react';

const AtaPDFGenerator = () => {
  const [gerando, setGerando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);

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
    quorumNecessario: 50,
    quorumAtingido: 85,
    totalElegiveis: 120,
    totalVotos: 102,
    resultado: 'aprovada',
    resultados: [
      { opcao: 'Sim, aprovo', votos: 89, percentual: 87.3 },
      { opcao: 'Não aprovo', votos: 13, percentual: 12.7 }
    ]
  };

  const condominio = {
    nome: 'Condomínio Residencial Exemplo',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123 - Jardim Primavera',
    cidade: 'São Paulo',
    estado: 'SP'
  };

  const sindico = {
    nome: 'João Silva',
    cpf: '123.456.789-00',
    unidade: 'Apto 302'
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatarDataHora = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const gerarPDF = () => {
    setGerando(true);
    
    setTimeout(() => {
      setMostrarPreview(true);
      setGerando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    }, 1000);
  };

  const imprimirPDF = () => {
    window.print();
  };

  const dataGeracao = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const hash = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {!mostrarPreview ? (
          /* Interface de Geração */
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FileText size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Gerar Ata de Votação</h1>
                  <p className="text-blue-100">Documento oficial em PDF</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Votação</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Título:</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">{votacao.titulo}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      votacao.resultado === 'aprovada' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {votacao.resultado === 'aprovada' ? 'Aprovada' : 'Reprovada'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Participação:</span>
                    <span className="font-medium text-gray-900">{votacao.totalVotos} de {votacao.totalElegiveis} ({votacao.quorumAtingido}%)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium text-gray-900 text-right text-sm">
                      {formatarData(votacao.dataInicio)} a {formatarData(votacao.dataFim)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={20} />
                  O que será incluído na ata:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Cabeçalho oficial com dados do condomínio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Título e descrição completa da votação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Quórum necessário e atingido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Resultado detalhado com percentuais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Assinatura digital do síndico com timestamp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Hash de verificação para autenticidade</span>
                  </li>
                </ul>
              </div>

              {sucesso && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                  <CheckCircle className="text-green-600" size={24} />
                  <div>
                    <p className="font-semibold text-green-900">Ata gerada com sucesso!</p>
                    <p className="text-sm text-green-700">Use o botão imprimir para salvar em PDF.</p>
                  </div>
                </div>
              )}

              <button
                onClick={gerarPDF}
                disabled={gerando}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  gerando
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
              >
                {gerando ? (
                  <>
                    <Loader className="animate-spin" size={24} />
                    Gerando documento...
                  </>
                ) : (
                  <>
                    <FileText size={24} />
                    Gerar Ata
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-amber-900">
                    <strong>Importante:</strong> Este documento tem validade legal e deve ser arquivado 
                    junto aos documentos oficiais do condomínio. Após gerar, use Ctrl+P ou o botão Imprimir para salvar como PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview e Impressão */
          <div>
            <div className="no-print mb-4 flex gap-3">
              <button
                onClick={() => setMostrarPreview(false)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 flex items-center gap-2"
              >
                Voltar
              </button>
              <button
                onClick={imprimirPDF}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                Imprimir / Salvar PDF
              </button>
            </div>

            {/* Documento da Ata */}
            <div className="print-content bg-white shadow-2xl" style={{ minHeight: '297mm' }}>
              {/* Cabeçalho */}
              <div className="bg-blue-600 h-16 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                </div>
              </div>

              <div className="p-12">
                {/* Informações do Condomínio */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-blue-600 mb-2">{condominio.nome.toUpperCase()}</h1>
                  <p className="text-sm text-gray-600">CNPJ: {condominio.cnpj}</p>
                  <p className="text-sm text-gray-600">{condominio.endereco}</p>
                  <p className="text-sm text-gray-600">{condominio.cidade} - {condominio.estado}</p>
                </div>

                <div className="border-t-2 border-gray-300 mb-8"></div>

                {/* Título da Ata */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">ATA DE ASSEMBLEIA - VOTAÇÃO</h2>
                  <p className="text-sm text-gray-600">Ata nº {votacao.id.toString().padStart(4, '0')}/2025</p>
                </div>

                {/* Informações da Assembleia */}
                <div className="bg-gray-100 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold">DATA E HORA DA ASSEMBLEIA:</span>
                      <p className="text-gray-700">{formatarDataHora(votacao.dataInicio)}</p>
                    </div>
                    <div>
                      <span className="font-bold">ENCERRAMENTO:</span>
                      <p className="text-gray-700">{formatarDataHora(votacao.dataFim)}</p>
                    </div>
                    <div>
                      <span className="font-bold">TIPO DE VOTAÇÃO:</span>
                      <p className="text-gray-700">{votacao.tipo === 'simples' ? 'Votação Simples (Sim/Não)' : 'Múltipla Escolha'}</p>
                    </div>
                  </div>
                </div>

                {/* Pauta */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-blue-600 mb-3">PAUTA:</h3>
                  <h4 className="text-base font-bold text-gray-900 mb-3">{votacao.titulo}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{votacao.descricao}</p>
                </div>

                {/* Quórum */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-blue-600 mb-3">QUÓRUM:</h3>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2">
                      <div className="p-4 border-r border-gray-300">
                        <p className="text-xs font-bold text-gray-600 mb-2">QUÓRUM NECESSÁRIO</p>
                        <p className="text-3xl font-bold text-gray-900">{votacao.quorumNecessario}%</p>
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-bold text-gray-600 mb-2">QUÓRUM ATINGIDO</p>
                        <p className={`text-3xl font-bold ${votacao.quorumAtingido >= votacao.quorumNecessario ? 'text-green-600' : 'text-red-600'}`}>
                          {votacao.quorumAtingido}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Total de votantes: {votacao.totalVotos} de {votacao.totalElegiveis} moradores elegíveis</p>
                </div>

                {/* Resultado */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-blue-600 mb-3">RESULTADO DA VOTAÇÃO:</h3>
                  <div className="space-y-3">
                    {votacao.resultados.map((resultado, index) => (
                      <div key={index} className={`p-4 rounded-lg ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900">{resultado.opcao}</span>
                          <span className="text-xl font-bold text-blue-600">{resultado.percentual.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                          <div 
                            className="bg-blue-500 h-3 rounded-full"
                            style={{ width: `${resultado.percentual}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">{resultado.votos} votos</p>
                      </div>
                    ))}
                  </div>

                  {/* Status Final */}
                  <div className="mt-6 flex justify-center">
                    <div className={`px-8 py-3 rounded-lg border-4 ${
                      votacao.resultado === 'aprovada' 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-red-50 border-red-500'
                    }`}>
                      <p className={`text-xl font-bold text-center ${
                        votacao.resultado === 'aprovada' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {votacao.resultado === 'aprovada' ? '✓ APROVADA' : '✗ REPROVADA'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conclusão */}
                <div className="mb-8">
                  <p className="text-sm text-gray-700 leading-relaxed text-justify">
                    Nada mais havendo a tratar, foi encerrada a presente assembleia, da qual se lavrou a presente ata, 
                    que vai assinada digitalmente pelo síndico do condomínio.
                  </p>
                </div>

                {/* Assinatura */}
                <div className="mt-12 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="border-t-2 border-gray-400 w-64 mb-4"></div>
                    <p className="font-bold text-gray-900">{sindico.nome}</p>
                    <p className="text-sm text-gray-600">Síndico</p>
                    <p className="text-sm text-gray-600">CPF: {sindico.cpf}</p>
                    <p className="text-sm text-gray-600">Unidade: {sindico.unidade}</p>
                  </div>
                </div>

                {/* Rodapé */}
                <div className="mt-12 pt-6 border-t border-gray-300 text-center">
                  <p className="text-xs text-gray-500 italic mb-1">
                    Documento gerado digitalmente em {dataGeracao}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    Hash de verificação: {hash}
                  </p>
                </div>
              </div>

              {/* Rodapé Decorativo */}
              <div className="bg-blue-600 h-8"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtaPDFGenerator;