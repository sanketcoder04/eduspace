import { Empty, Button } from "antd";
import { SearchX } from "lucide-react";
import type { AppEmptyProps } from "./types";

export default function AppEmpty({
  title = "Nothing Here",
  description = "There is no data available.",
  buttonText,
  onButtonClick,
}: AppEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Empty
        image={<SearchX size={72} className="mx-auto text-racing-red-500" />}
        description={
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>

            <p className="text-gray-500">{description}</p>
          </div>
        }
      />

      {buttonText && (
        <Button type="primary" className="mt-4 h-11 rounded-xl" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
