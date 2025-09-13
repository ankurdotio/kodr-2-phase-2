const { body, validationResult } = require('express-validator');


function validateResults(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

const registerUserValidation = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),

    body("email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("fullName.firstName")
        .isString()
        .withMessage("First name must be a string")
        .notEmpty()
        .withMessage("First name is required"),

    body("fullName.lastName")
        .isString()
        .withMessage("Last name must be a string")
        .notEmpty()
        .withMessage("Last name is required"),

    validateResults
]

const loginUserValidation = [
    body("email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validateResults
]

const createChatValidation = [

    body("title")
        .isString()
        .withMessage("Title must be a string")
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Title must be between 3 and 50 characters"),
    validateResults


]

module.exports = {
    registerUserValidation,
    loginUserValidation,
    createChatValidation
}