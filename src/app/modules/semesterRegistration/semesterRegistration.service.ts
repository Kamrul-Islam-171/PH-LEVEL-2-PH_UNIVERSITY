import AppError from "../../errors/AppError";
import { academicSemesterModel } from "../academicSemester/academicSemester.model";
import { TSemesterRegistration } from "./semesterRegistration.interface";
import httpStatus from "http-status";
import { SemesterRegistration } from "./semesterRegistration.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { RegistrationStatus } from "./semesterRegistration.constant";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration
) => {
  // kono akta semester jodi upcoming or ongoing thake taile admin k semester Registration korte dibo na

  /**
   * Step1: Check if there any registered semester that is already 'UPCOMING'|'ONGOING'
   * Step2: Check if the semester is exist
   * Step3: Check if the semester is already registered!
   * Step4: Create the semester registration
   */

  //check if there any semester registered that is already "UPCOMIN" or "ONGOING"
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is aready an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester !`
    );
  }

  //check if the academic semister id is exist in db
  const academicSemester = payload?.academicSemester;
  const isExist = await academicSemesterModel.findById(academicSemester);

  if (!isExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This academic semester not found !"
    );
  }

  // check if the semester is already registered!
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This semester is already registered!"
    );
  }

  const res = await SemesterRegistration.create(payload);
  return res;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();

  const res = await semesterRegistrationQuery.modelQuery;
  return res;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>
) => {
  /**
   * Step1: Check if the semester is exist
   * Step2: Check if the requested registered semester is exists
   * Step3: If the requested semester registration is ended, we will not update anything
   * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
   * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
   * Step6: If the requested semester registration is 'ENDED' , we will not update anything
   *
   * UPCOMING --> ONGOING --> ENDED
   *
   */

  // check if the requested registered semester is exists
  // check if the semester is already registered!

  // check if the requested registered semester is exists
  const requestedSemester = await SemesterRegistration.findById(id);
  if (!requestedSemester) {
    throw new AppError(httpStatus.NOT_FOUND, "This Semester is not Found");
  }
  //if the registered semester is ended then we will not update anything
  const currentSemesterStatus = requestedSemester?.status;
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Semester is already ENDED"
    );
  }

  // UPCOMING --> ONGOING --> ENDED
  // upcoming thakle ongoing korte dibo, ongoing thakle end korte dibo status
  // upcoming theke end korte dibo na
  const requestedSemesterStatus = payload?.status;
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedSemesterStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` you can not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedSemesterStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` you can not directly change status from ${currentSemesterStatus} to ${requestedSemesterStatus}`
    );
  }

  const res = await SemesterRegistration.findByIdAndUpdate(id, payload, {new: true, runValidators: true});
  return res;
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
};
