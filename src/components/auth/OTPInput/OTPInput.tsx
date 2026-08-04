import { useEffect, useRef } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function OTPInput({ length = 6, value, onChange, disabled = false }: OTPInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otp = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const updateOtp = (newOtp: string[]) => {
    onChange(newOtp.join(""));
  };

  const handleChange = (inputValue: string, index: number) => {
    if (!/^\d?$/.test(inputValue)) return;

    const newOtp = [...otp];
    newOtp[index] = inputValue;

    updateOtp(newOtp);

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

    if (!pasted) return;

    const newOtp = [...otp];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    updateOtp(newOtp);

    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex w-full justify-center gap-2 px-1 sm:gap-3 sm:px-2 md:gap-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          value={digit}
          onPaste={handlePaste}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onChange={(event) => handleChange(event.target.value, index)}
          onFocus={(event) => event.target.select()}
          className="
            h-12
            w-10
            flex-1
            max-w-12
            rounded-xl
            border
            border-gray-300
            bg-white
            text-center
            text-lg
            font-bold
            shadow-sm
            transition-all
            duration-200
            outline-none
            focus:border-racing-red-500
            focus:ring-2
            focus:ring-racing-red-200
            disabled:bg-gray-100
            disabled:text-gray-400
            sm:h-13
            sm:max-w-12
            sm:text-xl
            md:h-14
            md:max-w-14
          "
        />
      ))}
    </div>
  );
}
