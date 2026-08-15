import { Card, Typography, Button, Tag, Popover } from "antd";
// import { useState } from "react";
import { FileText, Award } from "lucide-react";

const { Text, Title } = Typography;

interface ProfileDocumentsCardProps {
  resumeUrl?: string | null;
  certificateUrls?: string[] | null;
  isOwner?: boolean;
  onManage?: () => void;
}

export default function ProfileDocumentsCard({
  resumeUrl,
  certificateUrls = [],
  isOwner,
  onManage,
}: ProfileDocumentsCardProps) {
  //   const [showAll, setShowAll] = useState(false);

  const maxVisible = 2;
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="mb-0!">
          Documents
        </Title>
        {isOwner && (
          <Button size="small" onClick={onManage}>
            Manage
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-racing-red-500" />
            <div>
              <Text className="font-medium">Resume</Text>
              <div>
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-racing-red-600 hover:underline"
                  >
                    View resume
                  </a>
                ) : (
                  <Text type="secondary" className="text-sm">
                    No resume uploaded
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award size={20} className="text-racing-red-500" />
            <div>
              <Text className="font-medium">Certificates</Text>
              <div className="mt-1 flex items-center gap-1 flex-wrap">
                {certificateUrls && certificateUrls.length > 0 ? (
                  <>
                    {certificateUrls.slice(0, maxVisible).map((url, idx) => (
                      <Tag key={idx}>
                        <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                          Certificate {idx + 1}
                        </a>
                      </Tag>
                    ))}
                    {certificateUrls.length > maxVisible && (
                      <Popover
                        content={
                          <div className="flex flex-col gap-2">
                            {certificateUrls.slice(maxVisible).map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm hover:underline"
                              >
                                Certificate {maxVisible + idx + 1}
                              </a>
                            ))}
                          </div>
                        }
                        trigger="click"
                        placement="bottom"
                        className="cursor-pointer text-xs text-racing-red-600"
                      >
                        <Text
                          className="cursor-pointer text-xs"
                          style={{ color: "var(--color-racing-red-500)", fontSize: "0.75rem" }}
                        >
                          +{certificateUrls.length - maxVisible} more
                        </Text>
                      </Popover>
                    )}
                  </>
                ) : (
                  <Text type="secondary" className="text-sm">
                    No certificates uploaded
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
