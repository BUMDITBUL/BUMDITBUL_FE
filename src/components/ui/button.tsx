import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = true,
  className = "",
  disabled = false,
}: ButtonProps) {
  if (variant === "outline") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={twMerge(
          fullWidth ? "w-full" : "flex-1",
          "flex items-center justify-center gap-2 text-white/55 text-sm transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        style={{
          height: "46px",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: "14px",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        fullWidth ? "w-full" : "flex-1",
        "text-white text-sm font-medium transition-colors hover:opacity-90 bg-brand-green-400 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      style={{
        height: "46px",
        borderRadius: "14px",
      }}
    >
      {children}
    </button>
  );
}
