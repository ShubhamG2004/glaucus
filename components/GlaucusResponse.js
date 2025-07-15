export default function GlaucusResponse({ message }) {
  if (!message) return null;

  return (
    <div className="bg-white p-6 mt-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-semibold mb-2 text-blue-600">🐟 Glaucus says:</h2>
      <p className="whitespace-pre-wrap text-gray-800">{message}</p>
    </div>
  );
}
