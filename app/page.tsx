export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🗳️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          VotaCondôminos
        </h1>
        <p className="text-gray-600 mb-6">
          Sistema de votação para condomínios
        </p>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Acessar Sistema
          </button>
          <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Saiba Mais
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6">
          🚀 Sistema implantado com sucesso
        </p>
      </div>
    </div>
  );
}