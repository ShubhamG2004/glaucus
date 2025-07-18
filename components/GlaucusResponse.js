// components/GlaucusResponse.js

export default function GlaucusResponse({ message }) {
  if (!message) return null;

  return (
    <div className="bg-white p-6 mt-6 rounded-2xl shadow-lg border max-w-3xl w-full mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700">
        🐟 Glaucus says:
      </h2>
      <p className="whitespace-pre-wrap text-gray-800 text-base sm:text-lg leading-relaxed">
        {message}
      </p>
    </div>
  );
}
