function validarBody(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            convert: true
        });

        if (error) {
            return res.status(400).json({
                erro: error.details.map((detail) => detail.message).join("; ")
            });
        }

        req.body = value;
        next();
    };
}

module.exports = {validarBody};