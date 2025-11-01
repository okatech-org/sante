// Page de test pour le Ministère
export default function MinistryTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          ✅ Page du Ministère de la Santé
        </h1>
        <p className="text-xl mb-4">
          Cette page fonctionne correctement !
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">URL actuelle:</h2>
          <code className="bg-gray-100 p-2 rounded block">
            {window.location.href}
          </code>
        </div>
      </div>
    </div>
  );
}
