import { Router } from 'express';
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from '../controllers/item.controller';

const router = Router();

router.route('/').post(createItem).get(getItems);
router.route('/:id').get(getItemById).put(updateItem).delete(deleteItem);

export default router;
