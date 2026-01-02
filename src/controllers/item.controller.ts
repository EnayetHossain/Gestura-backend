import { NextFunction, Request, Response } from 'express';
import { items, Item } from '../models/item.model';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

export const createItem = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { name } = req.body;
    const newItem: Item = { id: Date.now(), name };
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const getItems = (_: Request, res: Response, next: NextFunction): void => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = items.find((i) => i.id === id);
    if (!item) {
      throw new ApiError(404, 'Item not found');
    }
    res.status(200).json(new ApiResponse('success', item));
  } catch (error) {
    next(error);
  }
};

export const updateItem = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
    const itemIndex = items.findIndex((i) => i.id === id);

    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }

    items[itemIndex].name = name;
    res.status(200).json(new ApiResponse('success', items[itemIndex]));
  } catch (error) {
    next(error);
  }
};

export const deleteItem = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex((i) => i.id === id);
    if (itemIndex === -1) {
      throw new ApiError(404, 'Item not found');
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    res.status(200).json(new ApiResponse('deleted', deletedItem));
  } catch (error) {
    next(error);
  }
};
