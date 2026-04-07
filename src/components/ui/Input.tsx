interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}

export default function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  rightElement,
}: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-white/55"
        style={{
          height: "46px",
          padding: "14px",
          paddingRight: rightElement ? "48px" : "14px",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: "14px",
        }}
      />
      {rightElement && (
        <div className="absolute right-4 inset-y-0 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}
