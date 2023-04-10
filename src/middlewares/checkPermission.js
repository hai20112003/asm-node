// check quền admin
import jwt from "jsonwebtoken";
import User from "../models/user";
export const checkPermission = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            return res.status(400).json({
                message: "Bạn chưa đăng nhâp",
            })
        }

        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, "banhai", async(error, payload)=>{
            if(error){
                if(error.name == 'TokenExpiredError'){
                    return res.status(401).json({
                        message: "Token hết hạn",
                    })
                }
                if(error.name == 'JsonWebTokenError'){
                    return res.status(401).json({
                        message: "Token không hợp lệ",
                    })
                }
            }
            const user = await User.findById(payload._id);
            if(user.role !== "admin"){
                return res.status(401).json({
                    message: "Bạn không có quyền truy cập nội dung này",
                })
            }
            next();
        });
    } catch (error) {
        
    }
}




// B1: Kiểm tra trong header.authorization có token không? Nếu không có thì trả về lỗi
// B2: Kiểm tra token có hợp lệ không? Nếu hợp lệ thì decode
// B3: Dựa vào ID ở token sau khi decode để tìm user trong db
// B4: Check quyền (role), nếu user không phải admin thì thông báo lỗi
// B5: Cho đi bước tiếp theo
