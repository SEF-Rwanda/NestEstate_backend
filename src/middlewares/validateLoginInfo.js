import User from "../models/UserModel";
import HttpStatus from "http-status";
import Response from "../utils/Response";
import Joi from "joi";

class ValidateLoginInfo {
    static validateEmailPassword = (req) => {
        const schema = Joi.object({
            email: Joi.string().min(5).max(50).email().required(),
            password: Joi.string().min(8).max(50).required()
        })
        return schema.validate(req)
    }
}

export default ValidateLoginInfo;
