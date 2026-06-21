type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[#356C4C] text-white hover:bg-[#2B563D]",

    secondary:
      "bg-black/5 text-black hover:bg-black/10",

    outline:
      "border border-black/10 hover:bg-black/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-full
        transition-all
        duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}