import joi from "joi"

const categorySchema = joi.object({
    name: joi.string().required().messages({
      "String.empty": "Tên không được để trống",
    }),
})