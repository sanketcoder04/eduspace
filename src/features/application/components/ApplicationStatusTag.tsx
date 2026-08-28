import { Tag } from "antd";
import {
  APPLICATION_STATUS_LABEL,
  APPLICATION_STATUS_TAG_COLOR,
} from "../constants/applicationOptions";
import type { ApplicationStatus } from "../types/application.types";

export default function ApplicationStatusTag({ status }: { status: ApplicationStatus }) {
  return (
    <Tag color={APPLICATION_STATUS_TAG_COLOR[status]} className="rounded-full">
      {APPLICATION_STATUS_LABEL[status]}
    </Tag>
  );
}
