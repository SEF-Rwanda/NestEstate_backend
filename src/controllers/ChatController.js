import httpStatus from "http-status";
import ChatService from "../services/ChatService";
import catchAsyncError from "../utils/catchAsyncError";
import Response from "../utils/Response";

class ChatController {
  static createChat = catchAsyncError(async (req, res, next) => {
    const chat = await ChatService.createChats(req, res);
    return Response.successMessage(
      res,
      "New chat created successfully",
      chat,
      httpStatus.CREATED
    );
  });
  static getChats = catchAsyncError(async (req, res, next) => {
    await ChatService.getAllChats(req, res);
  });
}

export default ChatController;
