import { useEffect, useState } from "react";

interface UseCountdownOptions {
  initialSeconds: number;
}

export default function useCountdown({ initialSeconds }: UseCountdownOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const reset = () => {
    setSeconds(initialSeconds);
  };

  return {
    seconds,
    reset,
    isRunning: seconds > 0,
  };
}
