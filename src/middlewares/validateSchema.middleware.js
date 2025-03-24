export const validateSchema = (schema) => {
    return (req, res, next) => {

        const errors = [];

        if (schema.body) {
            const result = schema.body.safeParse(req.body);

            if (!result.success) {
                errors.push(
                    ...result.error.errors.map(err => ({
                        field: `body.${err.path.join(".")}`,
                        message: err.message
                    }))
                )

            }
        }
        if (schema.params) {
            const result = schema.params.safeParse(req.params);

            if (!result.success) {
                errors.push(
                    ...result.error.errors.map((err) => ({
                        field: `params.${err.path.join(".")}`,
                        message: err.message
                    }))
                )

            }
        }
        if (schema.query) {
            const result = schema.query.safeParse(req.query);

            if (!result.success) {
                errors.push(
                    ...result.error.errors.map((err) => ({
                        field: `query.${err.path.join(".")}`,
                        message: err.message
                    }))
                )

            }
        }
        if (errors.length > 0) return res.status(400).json({ errors })


        next()
    }
}