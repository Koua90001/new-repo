cat > controllers/itemController.js <<'EOF'
const Item = require('../models/Item');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../middlewares/errors');

exports.listItems = async (req, res, next) => {
  try {
    const items = await Item.find({ owner: req.user._id });
    res.json(items);
  } catch (e) { next(e); }
};

exports.createItem = async (req, res, next) => {
  try {
    const { title, data } = req.body;
    const item = await Item.create({ owner: req.user._id, title, data });
    res.status(201).json(item);
  } catch (e) {
    if (e.name === 'ValidationError') return next(new BadRequestError('Invalid item data'));
    next(e);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) throw new NotFoundError('Item not found');
    if (String(item.owner) !== String(req.user._id)) throw new ForbiddenError('Not allowed');
    await item.deleteOne();
    res.json({ message: 'Deleted', _id: id });
  } catch (e) { next(e); }
};
EOF
