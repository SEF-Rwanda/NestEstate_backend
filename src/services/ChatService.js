import httpStatus from "http-status";
import Chat from "../models/ChatModel";
import User from "../models/UserModel";
import Response from "../utils/Response";

class ChatService {
  /**
   * @description function to create chats
   * @param {*request} req
   * @param {*response} res
   * @returns chat object
   */

  static createChats = async (req, res) => {
    const { userId } = req.body;
    let isChat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "firstName lastName pic email",
    });

    if (isChat?.length > 0) {
      return isChat[0];
    } else {
      const newChat = new Chat({
        chatName: "sender",
        users: [req.user._id, userId],
      });

      const savedChat = await Chat.create(newChat);

      const fullChat = await Chat.findOne({ _id: savedChat._id }).populate(
        "users",
        "-password"
      );

      return fullChat;
    }
  };

  /**
   * @description Function to get all chats
   * @param {*request} req
   * @param {*response} res
   */
  static getAllChats = async (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName pic email",
        });
        return Response.successMessage(
          res,
          "All chat retrieved successfully",
          results,
          httpStatus.OK
        );
      });
  };
}

export default ChatService;
