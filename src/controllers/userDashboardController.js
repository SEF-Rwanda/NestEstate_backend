import userDashboardService from "../services/UserDashboardService";

class userDashboardController {

    static userRecords = async (req, res, next) => {
        const data = await userDashboardService.userRecords(req);
        return res.status(200).json({
            status: 200,
            message: "All user records",
            data
        });
    };
    

}

export default userDashboardController;