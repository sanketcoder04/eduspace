import { Select, Alert } from "antd";
import { Link } from "react-router-dom";
import { useMyTeacherProfile } from "@/features/profile/hooks/useMyTeacherProfile";
import { ROUTES } from "@/router/routes";

interface TeacherSubjectSelectProps {
  value: string[];
  onChange: (subjects: string[]) => void;
  error?: string;
}

/**
 * Unlike the student's free-tagging subject select (Part 3), a teacher can
 * only pick from subjects already declared in their profile's
 * subjectOfferings — this mirrors the backend's validateSubjectsAgainstOfferings
 * check, so the teacher hits a clear "add it to your profile first" message
 * instead of a rejected form submission.
 */
export default function TeacherSubjectSelect({
  value,
  onChange,
  error,
}: TeacherSubjectSelectProps) {
  const { data: profile, isLoading } = useMyTeacherProfile();

  const offeredSubjects = profile?.subjectOfferings.map((offering) => offering.subjectName) ?? [];
  const hasNoOfferings = !isLoading && offeredSubjects.length === 0;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Subjects
      </label>

      {hasNoOfferings ? (
        <Alert
          type="warning"
          showIcon
          message="No subjects on your profile yet"
          description={
            <span>
              You need to add at least one subject to your profile's Subjects Offered before posting
              a teaching opening.{" "}
              <Link
                to={ROUTES.PROFILE}
                className="font-semibold text-racing-red-600 hover:underline"
              >
                Add subjects to your profile
              </Link>
              .
            </span>
          }
          className="rounded-xl"
        />
      ) : (
        <>
          <Select
            mode="multiple"
            allowClear
            loading={isLoading}
            placeholder="Select from your subjects offered"
            className="w-full"
            value={value}
            onChange={onChange}
            options={offeredSubjects.map((subject) => ({ label: subject, value: subject }))}
            status={error ? "error" : undefined}
            notFoundContent={null} // no free typing — options are exhaustive, so an empty list means "none match"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

          <p className="mt-1.5 text-xs text-gray-400">
            Don't see a subject you want to add?{" "}
            <Link to={ROUTES.PROFILE} className="text-racing-red-600 hover:underline">
              Add it to your profile
            </Link>{" "}
            first.
          </p>
        </>
      )}
    </div>
  );
}
