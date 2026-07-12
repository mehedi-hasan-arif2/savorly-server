import { Request, Response } from "express";
import Recipe from "../models/Recipe";

export async function getStats(req: Request, res: Response) {
  const categoryCounts = await Recipe.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const totalRecipes = await Recipe.countDocuments();
  const avgRatingResult = await Recipe.aggregate([{ $group: { _id: null, avg: { $avg: "$rating" } } }]);

  res.json({
    categoryCounts: categoryCounts.map((c) => ({ category: c._id, count: c.count })),
    totalRecipes,
    avgRating: avgRatingResult[0]?.avg?.toFixed(1) || "0",
  });
}
