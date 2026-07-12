import { Request, Response } from "express";
import Recipe from "../models/Recipe";

export async function getRecipes(req: Request, res: Response) {
  const search = (req.query.search as string) || "";
  const category = (req.query.category as string) || "";
  const difficulty = (req.query.difficulty as string) || "";
  const sort = (req.query.sort as string) || "newest";
  const page = parseInt((req.query.page as string) || "1");
  const limit = parseInt((req.query.limit as string) || "8");
  const mine = req.query.mine === "true";

  const query: Record<string, unknown> = {};
  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  if (mine) {
    if (!req.user) {
      return res.status(401).json({ error: "You must be logged in" });
    }
    query.createdBy = req.user.userId;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    rating: { rating: -1 },
    cookTime: { cookTimeMinutes: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const total = await Recipe.countDocuments(query);
  const recipes = await Recipe.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ recipes, total, page, totalPages: Math.ceil(total / limit) });
}

export async function getRecipeById(req: Request, res: Response) {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const related = await Recipe.find({ category: recipe.category, _id: { $ne: recipe._id } }).limit(4);
  res.json({ recipe, related });
}

export async function createRecipe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const { title, shortDescription, fullDescription, category, difficulty, cookTimeMinutes, servings, ingredients, steps, images } = req.body;

  if (!title || !shortDescription || !fullDescription || !category || !difficulty || !cookTimeMinutes) {
    return res.status(400).json({ error: "Please fill in all required fields" });
  }

  const recipe = await Recipe.create({
    title,
    shortDescription,
    fullDescription,
    category,
    difficulty,
    cookTimeMinutes,
    servings: servings || 2,
    ingredients: ingredients || [],
    steps: steps || [],
    images: images && images.length ? images : [],
    createdBy: req.user.userId,
  });

  res.json({ recipe });
}

export async function deleteRecipe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  const isOwner = recipe.createdBy.toString() === req.user.userId;
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: "You can only delete your own recipes" });
  }

  await Recipe.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}
