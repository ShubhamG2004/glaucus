export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const fullBase64 = reader.result; // ✅ includes "data:image/jpeg;base64,..."
      const rawBase64 = fullBase64.split(",")[1]; // ✅ just base64 data for Gemini
      resolve({ fullBase64, rawBase64 });
    };
    reader.onerror = (error) => reject(error);
  });
