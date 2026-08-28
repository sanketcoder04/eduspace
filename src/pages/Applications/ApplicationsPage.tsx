import { useState } from "react";
import { Segmented, Pagination, Empty, Skeleton } from "antd";
import { useSentApplications } from "@/features/application/hooks/useSentApplications";
import { useReceivedApplications } from "@/features/application/hooks/useReceivedApplications";
import SentApplicationCard from "@/features/application/components/SentApplicationCard";
import ReceivedApplicationCard from "@/features/application/components/ReceivedApplicationCard";

type Tab = "SENT" | "RECEIVED";

export default function ApplicationsPage() {
  const [tab, setTab] = useState<Tab>("RECEIVED");
  const [page, setPage] = useState(0);

  const sentQuery = useSentApplications({ page, size: 10 });
  const receivedQuery = useReceivedApplications({ page, size: 10 });

  const activeQuery = tab === "SENT" ? sentQuery : receivedQuery;
  const { data, isLoading, isFetching } = activeQuery;

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Applications</h1>
        <Segmented
          value={tab}
          onChange={(v) => handleTabChange(v as Tab)}
          options={[
            { label: "Received", value: "RECEIVED" },
            { label: "Sent", value: "SENT" },
          ]}
          className="rounded-xl"
        />
      </div>

      {isLoading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 dark:border-neutral-800">
          <Empty
            description={
              tab === "SENT"
                ? "You haven't applied to anything yet."
                : "No applications received yet."
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {tab === "SENT"
            ? data.content.map((application) => (
                <SentApplicationCard key={application.id} application={application} />
              ))
            : data.content.map((application) => (
                <ReceivedApplicationCard key={application.id} application={application} />
              ))}

          {data.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={page + 1}
                total={data.totalElements}
                pageSize={data.size}
                onChange={(nextPage) => setPage(nextPage - 1)}
                showSizeChanger={false}
                disabled={isFetching}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
