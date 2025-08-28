export function History({ items, onSelect }: { items: { subject: string; preview: string }[]; onSelect: (item: { subject: string; preview: string }) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="font-semibold mb-2 text-indigo-700">History</h3>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx}>
            <button
              className="text-left text-sm text-indigo-600 hover:underline"
              onClick={() => onSelect(item)}
              aria-label={`Reuse subject: ${item.subject}`}
            >
              {item.subject}
              {item.preview && <span className="text-gray-400"> — {item.preview.slice(0, 20)}...</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}