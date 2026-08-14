// import { useState } from "react";
// import { Typography, Button } from "antd";

// const { Title, Paragraph } = Typography;

// interface AboutCardProps {
//   about?: string;
//   isOwner: boolean;
// }

// export default function AboutCard({ about, isOwner }: AboutCardProps) {
//   const [expanded, setExpanded] = useState(false);

//   if (!about && !isOwner) return null;

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
//       <Title level={5} className="mb-2!">
//         About
//       </Title>

//       <div>
//         <Paragraph
//           className={`mb-0! whitespace-pre-line text-gray-600 dark:text-gray-300 ${
//             expanded ? "" : "line-clamp-4"
//           }`}
//         >
//           {about || "No details added yet."}
//         </Paragraph>

//         {about && about.length > 200 && (
//           <Button type="link" className="mt-1! px-0!" onClick={() => setExpanded((prev) => !prev)}>
//             {expanded ? "See less" : "See more"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

interface AboutCardProps {
  about?: string;
  isOwner: boolean;
}

export default function AboutCard({ about, isOwner }: AboutCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!about && !isOwner) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <Title level={5} className="mb-2!">
        About
      </Title>

      <div className="relative">
        <Paragraph
          className={`mb-0! whitespace-pre-line text-gray-600 dark:text-gray-300 ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {about || "No details added yet."}
        </Paragraph>

        {about && about.length > 150 && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-racing-red-500 dark:text-racing-red-300 text-sm cursor-pointer"
          >
            {expanded ? "see less" : "see more"}
          </button>
        )}
      </div>
    </div>
  );
}
