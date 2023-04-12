import httpStatus from "http-status";
import MessageService from "../services/MessageService";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";

class MessageController {
  static sendMessage = catchAsyncError(async (req, res, next) => {
    const message = await MessageService.sendMessage(req, res);

    Response.successMessage(
      res,
      "New message sent successfully",
      message,
      httpStatus.CREATED
    );
  });

  static getMessages = catchAsyncError(async (req, res, next) => {
    const messages = await MessageService.allMessages(req, res);
    if (messages !== null || messages.length !== 0) {
      Response.successMessage(
        res,
        "All message retrieved successfully",
        messages,
        httpStatus.OK
      );
    }
  });
}

export default MessageController;
