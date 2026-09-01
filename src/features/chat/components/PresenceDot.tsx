interface PresenceDotProps {
  online: boolean;
}

export default function PresenceDot({ online }: PresenceDotProps) {
  if (!online) return null;
  return (
    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-neutral-900" />
  );
}
