import { TerrorSourse, TGenericErrorResponse } from "../interface/error";

const HandleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;

  const msg = err?.message.match(/"([^"]*)"/);

//   console.log(msg[0])
  const errorSources: TerrorSourse = [
    {
      path: "",
      message: `${msg[0]} is already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate info",
    errorSources,
  };
};

export default HandleDuplicateError;
