//VALIDATION
const Joi = require('@hapi/joi');

//register validation

const registerValidation = (data: object) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data, { abortEarly: false })
};

const loginValidation = (data: object) => {
    const schema = Joi.object({
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data, { abortEarly: false })
};

const createPostValidation = (data: object) => {
    const schema = Joi.object({
        title: Joi.string().min(6).max(255).required(),
        text: Joi.string().min(6).required(),
        userId: Joi.number().required()
    });
    return schema.validate(data, { abortEarly: false })
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.createPostValidation = createPostValidation;
