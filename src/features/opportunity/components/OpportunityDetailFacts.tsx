import {
  MapPin,
  Video,
  Building2,
  Users,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  Languages,
  Landmark,
  GraduationCap,
} from "lucide-react";
import { FEE_UNIT_LABEL } from "../constants/opportunityOptions";
import { formatDate } from "@/utils/formatDate";
import type { OpportunityResponse } from "../types/opportunity.types";

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-racing-red-500">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );
}

export default function OpportunityDetailFacts({
  opportunity,
}: {
  opportunity: OpportunityResponse;
}) {
  const {
    mode,
    classFormat,
    location,
    tuitionLocationType,
    gradeLevel,
    board,
    sessionDurationHours,
    sessionsPerWeek,
    preferredStartDate,
    feeRange,
    teachingOpeningDetails,
    tuitionRequirementDetails,
  } = opportunity;

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <Fact
          icon={mode === "ONLINE" ? <Video size={16} /> : <Building2 size={16} />}
          label="Mode"
          value={mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "Offline" : "Hybrid"}
        />

        <Fact
          icon={<Users size={16} />}
          label="Class Format"
          value={classFormat === "BATCH" ? "Batch" : "Personalized"}
        />

        {gradeLevel && (
          <Fact icon={<BookOpen size={16} />} label="Grade Level" value={gradeLevel} />
        )}

        {board && <Fact icon={<Landmark size={16} />} label="Board" value={board} />}

        {location?.city && (
          <Fact
            icon={<MapPin size={16} />}
            label="Location"
            value={`${location.city}, ${location.state}${
              tuitionLocationType
                ? ` · ${tuitionLocationType === "HOME_TUITION" ? "Home Tuition" : "Center-Based"}`
                : ""
            }`}
          />
        )}

        <Fact
          icon={<span className="text-base font-bold">₹</span>}
          label="Fees"
          value={`₹${feeRange.min}${feeRange.max !== feeRange.min ? `–${feeRange.max}` : ""} ${
            FEE_UNIT_LABEL[feeRange.unit]
          }`}
        />

        {sessionDurationHours && (
          <Fact
            icon={<Clock size={16} />}
            label="Session Duration"
            value={`${sessionDurationHours} hrs`}
          />
        )}

        {sessionsPerWeek && (
          <Fact
            icon={<Calendar size={16} />}
            label="Frequency"
            value={`${sessionsPerWeek}x / week`}
          />
        )}

        {preferredStartDate && (
          <Fact
            icon={<Calendar size={16} />}
            label="Preferred Start"
            value={formatDate(preferredStartDate)}
          />
        )}

        {teachingOpeningDetails?.languageOfInstruction && (
          <Fact
            icon={<Languages size={16} />}
            label="Language of Instruction"
            value={teachingOpeningDetails.languageOfInstruction}
          />
        )}

        {teachingOpeningDetails?.yearsOfExperienceInSubject !== undefined && (
          <Fact
            icon={<GraduationCap size={16} />}
            label="Teacher's Experience"
            value={`${teachingOpeningDetails.yearsOfExperienceInSubject} years`}
          />
        )}

        {teachingOpeningDetails?.batchCapacity && (
          <Fact
            icon={<Users size={16} />}
            label="Seats"
            value={`${Math.max(
              0,
              teachingOpeningDetails.batchCapacity - teachingOpeningDetails.seatsFilled
            )} of ${teachingOpeningDetails.batchCapacity} left`}
          />
        )}

        {teachingOpeningDetails?.freeDemoAvailable && (
          <Fact icon={<Sparkles size={16} />} label="Free Demo Class" value="Available" />
        )}

        {tuitionRequirementDetails?.preferredTutorGender &&
          tuitionRequirementDetails.preferredTutorGender !== "NO_PREFERENCE" && (
            <Fact
              icon={<Users size={16} />}
              label="Preferred Gender"
              value={tuitionRequirementDetails.preferredTutorGender === "MALE" ? "Male" : "Female"}
            />
          )}

        {tuitionRequirementDetails?.preferredTutorExperienceLevel &&
          tuitionRequirementDetails.preferredTutorExperienceLevel !== "NO_PREFERENCE" && (
            <Fact
              icon={<BookOpen size={16} />}
              label="Tutor Experience"
              value={
                tuitionRequirementDetails.preferredTutorExperienceLevel === "PROFESSIONAL_TUTOR"
                  ? "Professional"
                  : "Part-Time"
              }
            />
          )}

        {tuitionRequirementDetails?.numberOfStudents &&
          tuitionRequirementDetails.numberOfStudents > 1 && (
            <Fact
              icon={<Users size={16} />}
              label="Number of Students"
              value={tuitionRequirementDetails.numberOfStudents}
            />
          )}
      </div>
    </div>
  );
}
