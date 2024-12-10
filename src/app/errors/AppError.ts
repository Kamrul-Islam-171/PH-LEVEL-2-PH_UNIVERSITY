//amra to error throw korar time e only msg pathaite pari. but status code pathanor jonno error class k extend kora lagbe
class AppError extends Error{
    public statusCode : number;
  
    constructor(statusCode: number, message: string, stack = '') {
      super(message); // message hocche error class er property(parent class)
      this.statusCode = statusCode;
  
      if(stack) {
        this.stack = stack
      }
      else {
        Error.captureStackTrace(this, this.constructor)
      }
    }
  }

  export default AppError;