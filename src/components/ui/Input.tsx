import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightElement?: React.ReactNode;
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = "text",
  placeholder,
  rightElement,
  error = false,
  ...rest
}, ref) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...rest}
        className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-white/55"
        style={{
          height: "46px",
          padding: "14px",
          paddingRight: rightElement ? "48px" : "14px",
          border: error
            ? "1px solid var(--color-brand-error)"
            : "1px solid rgba(255, 255, 255, 0.55)",
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
});

Input.displayName = "Input";

export default Input;
