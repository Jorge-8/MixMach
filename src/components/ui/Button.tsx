// components/ui/Button.tsx
export default function Button({ label }: { label: string }) {
  return (
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
      {label}
    </button>
  );
}
