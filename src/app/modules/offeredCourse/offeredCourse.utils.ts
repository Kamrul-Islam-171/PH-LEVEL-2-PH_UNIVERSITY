import AppError from "../../errors/AppError";
import { TSchedule } from "./offeredCourse.interfact";

const hasTimeConflict = (
  assighSchedules: TSchedule[],
  newSchedule: TSchedule
) => {
  for (const schedule of assighSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    // console.log(existingStartTime, existingEndTime, newStartTime, newEndTime)

    //10.30-12.30
    //9.30-11.30
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};

export default hasTimeConflict;
