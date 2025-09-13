cat > routes/items.js <<'EOF'
const express = require('express');
const { listItems, createItem, deleteItem } = require('../controllers/itemController');
const { createItemSchema, itemIdParamSchema } = require('../middlewares/validation');

const router = express.Router();
router.get('/', listItems);
router.post('/', createItemSchema, createItem);
router.delete('/:id', itemIdParamSchema, deleteItem);

module.exports = router;
EOF
