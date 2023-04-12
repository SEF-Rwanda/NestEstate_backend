import Message from "../models/MessageModel";
import User from "../models/UserModel";
import Chat from "../models/ChatModel";

class MessageService {
  /**
   * @description retrieve all messages
   * @param {request} req
   * @param {*response} res
   * @return json object all all messages
   */

  static allMessages = async (req, res) => {
    let messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName pic email")
      .populate("chat");

    messages = await User.populate(messages, {
      path: "chat.users",
      select: "firstName lastName pic email",
    });

    return messages;
  };

  /**
   * @description send a message
   * @param {request} req
   * @param {*response} res
   * @return json object of created message
   */

  static sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res
        .status(400)
        .send({ message: "Invalid data passed into request" });
    }

    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    const message = await Message.create(newMessage);

    let fullMessage = await Message.findOne({ _id: message._id })
      .populate("sender", "firstName lastName pic")
      .populate("chat");

    fullMessage = await User.populate(fullMessage, {
      path: "chat.users",
      select: "firstName lastName pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });
    return fullMessage;
  };
}

export default MessageService;
