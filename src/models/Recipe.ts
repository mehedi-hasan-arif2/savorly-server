import { Schema, model, Types } from "mongoose";

export interface IReview {
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IRecipe {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  cookTimeMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  images: string[];
  rating: number;
  reviews: IReview[];
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const RecipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  cookTimeMinutes: { type: Number, required: true },
  servings: { type: Number, default: 2 },
  ingredients: { type: [String], default: [] },
  steps: { type: [String], default: [] },
  nutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  images: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  reviews: { type: [ReviewSchema], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IRecipe>("Recipe", RecipeSchema);
