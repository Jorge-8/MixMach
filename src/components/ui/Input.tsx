// components/ui/Input.tsx
export default function Input({
  placeholder,
  type = "text",
}: {
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border rounded-lg px-3 py-2"
    />
  );
}
