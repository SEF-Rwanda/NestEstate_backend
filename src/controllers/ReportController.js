import ReportService from "../services/ReportService";

class ReportController {

    static countRecords = async (req, res, next) => {
        const data = await ReportService.countRecords(req);
        return res.status(200).json({
            status: 200,
            message: "All records",
            data
        });
    };
    

}

export default ReportController;