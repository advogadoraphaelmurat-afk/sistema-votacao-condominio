'use client';
import React from 'react';

const SuperAdminDashboard = () => {
  const metricas = {
    totalCondominios: 45,
    condominiosAtivos: 38,
    receitaMensal: 28750,
    crescimento: 12.5
  };

  const MetricCard = ({ 
    titulo, 
    valor, 
    subtitulo, 
    cor 
  }: { 
    titulo: string; 
    valor: string | number; 
    subtitulo?: string; 
    cor: string; 
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{titulo}</p>
          <p className={`text-3xl font-bold ${cor} mb-1`}>{valor}</p>
          {subtitulo && <p className="text-gray-500 text-sm">{subtitulo}</p>}
        </div>
        <div className={`${cor.replace('text', 'bg').replace('600', '100')} p-3 rounded-lg`}>
          <span className="text-2xl">📊</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
          <p className="text-gray-600">Visão geral do sistema VotaCondôminos</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            titulo="Total de Condomínios"
            valor={metricas.totalCondominios}
            subtitulo={`${metricas.condominiosAtivos} ativos`}
            cor="text-blue-600"
          />
          <MetricCard
            titulo="Condomínios Ativos"
            valor={metricas.condominiosAtivos}
            subtitulo="Em operação"
            cor="text-green-600"
          />
          <MetricCard
            titulo="Receita Mensal"
            valor={`R$ ${metricas.receitaMensal.toLocaleString()}`}
            subtitulo="Faturamento"
            cor="text-purple-600"
          />
          <MetricCard
            titulo="Crescimento"
            valor={`${metricas.crescimento}%`}
            subtitulo="Último mês"
            cor="text-amber-600"
          />
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-blue-200 rounded-lg text-left hover:bg-blue-50 transition-colors">
              <h3 className="font-semibold text-blue-900">🏢 Gerenciar Condomínios</h3>
              <p className="text-sm text-blue-700">Ver todos os condomínios cadastrados</p>
            </button>
            <button className="p-4 border border-green-200 rounded-lg text-left hover:bg-green-50 transition-colors">
              <h3 className="font-semibold text-green-900">💳 Relatórios Financeiros</h3>
              <p className="text-sm text-green-700">Acompanhar receitas e pagamentos</p>
            </button>
            <button className="p-4 border border-purple-200 rounded-lg text-left hover:bg-purple-50 transition-colors">
              <h3 className="font-semibold text-purple-900">📊 Estatísticas</h3>
              <p className="text-sm text-purple-700">Métricas de uso do sistema</p>
            </button>
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900">Sistema Operacional</h3>
              <p className="text-green-700">Todos os serviços estão funcionando normalmente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;