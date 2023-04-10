// Làm đăng ký đăng nhập
import User from "../models/user";
import { signinSchema, signupSchema } from './../Schemas/auth';
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => err.message);
            // ['Trường tên là bắt buộc', 'Email không đúng định dạng']
            return res.status(400).json({
                messages: errors,
            });
        }
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.status(400).json({
                message: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const accessToken = jwt.sign({ _id: user._id }, "banhai", { expiresIn: "1d" });

        return res.status(201).json({
            message: "Đăng ký tk thành công",
            accessToken,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};

export const signin = async (req, res) =>  {
    try {
        const {password, email} = req.body;
        const {error} = signinSchema.validate(req.body, {abortEarly: false});
    
        if(error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            })
        }
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.status(400).json({
                message: "Bạn chưa đăng ký tài khoản",
        })
        }
        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch){
            return res.status(400).json({
                message: "Mật khẩu không đúng",
            })
        }
        const accessToken = jwt.sign({ _id: user._id }, "banhai", { expiresIn: "1d" });
    
        return res.status(201).json({
            message: "Đăng nhập thành công",
            accessToken,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

// b1: láy giấ trị email password từ clien
// b2: validate giá trị từ clien gửi lên,
// b3: kiểm tra maill có tồn tại
// b4: So sánh giá trị (pass) từ client cnos giống với pass ở db ko
// b4: tạo token
// b5: trả về token và user