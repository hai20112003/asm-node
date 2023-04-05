import joi from "joi"

export const categorySchema = joi.object({
  _id: joi.string(),
    name: joi.string().required().messages({
      "String.empty": "Tên không được để trống",
    }),
})