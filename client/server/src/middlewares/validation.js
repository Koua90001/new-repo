cat > middlewares/validation.js <<'EOF'
const { celebrate, Joi, Segments } = require('celebrate');

const signupSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(6).required(),
  }),
});

const signinSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const createItemSchema = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().max(120).required(),
    data: Joi.string().allow(''),
  }),
});

const itemIdParamSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = { signupSchema, signinSchema, createItemSchema, itemIdParamSchema };
EOF
