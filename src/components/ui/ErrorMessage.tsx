import Image from "next/image";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-1">
      <Image src="/images/icon/error.svg" alt="에러" width={16} height={16} />
      <p className="text-xs text-brand-error">{message}</p>
    </div>
  );
}
