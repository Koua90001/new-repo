cat > middlewares/errors.js <<'EOF'
class AppError extends Error { constructor(status, message) { super(message); this.status = status; } }
class BadRequestError extends AppError { constructor(m) { super(400, m); } }
class UnauthorizedError extends AppError { constructor(m) { super(401, m); } }
class ForbiddenError extends AppError { constructor(m) { super(403, m); } }
class NotFoundError extends AppError { constructor(m) { super(404, m); } }
class ConflictError extends AppError { constructor(m) { super(409, m); } }

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = {
  AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, errorHandler,
};
EOF
