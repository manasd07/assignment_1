import Joi from "joi";
export const validateEmail = (email) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(email);
};
