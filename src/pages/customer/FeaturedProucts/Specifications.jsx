export default function Specifications({ specs, images }) {
  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Specifications</h2>
      <div className="bg-gray-50 rounded-xl p-6">
        <table className="w-full text-sm">
          <tbody>
            {specs.map((spec, idx) => (
              <tr key={idx} className="border-b border-gray-200 last:border-0">
                <td className="py-2 font-semibold w-1/3">{spec.label}</td>
                <td className="py-2 text-gray-600">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {images && images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <img key={i} src={img.url || img} alt={`spec-${i}`} className="rounded-lg w-full" />
          ))}
        </div>
      )}
    </div>
  );
}