import { Request, Response } from "express";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem";

export async function getMenu(
  req: Request,
  res: Response
) {
  const { category } = req.query;

  const filter: any = {
    available: true,
  };

  if (category) {
    filter.category = category;
  }

  const items = await MenuItem.find(filter)
    .sort({ createdAt: -1 });

  res.json({
    items,
  });
}

export async function getMenuItem(
  req: Request,
  res: Response
) {
  const id =
    typeof req.params.id === "string"
      ? req.params.id
      : req.params.id?.[0];

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid menu item ID",
    });
  }

  const item = await MenuItem.findOne({
    _id: id,
    available: true,
  });

  if (!item) {
    return res.status(404).json({
      message: "Menu item not found",
    });
  }

  res.json({
    item,
  });
}