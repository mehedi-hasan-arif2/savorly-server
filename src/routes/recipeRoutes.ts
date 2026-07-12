import { Router } from "express";
import { getRecipes, getRecipeById, createRecipe, deleteRecipe } from "../controllers/recipeController";
import { requireAuth, attachUserIfPresent } from "../middleware/auth";

const router = Router();

router.get("/", attachUserIfPresent, getRecipes);
router.get("/:id", getRecipeById);
router.post("/", requireAuth, createRecipe);
router.delete("/:id", requireAuth, deleteRecipe);

export default router;
