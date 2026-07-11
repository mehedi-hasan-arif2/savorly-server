import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import User from "../models/User";
import Recipe from "../models/Recipe";

const SAMPLE_RECIPES = [
  {
    title: "Garlic Butter Shrimp Pasta",
    shortDescription: "A 20-minute weeknight pasta with garlicky shrimp and a light butter sauce.",
    fullDescription: "This is the pasta I make when I want something that feels special but takes barely any effort. The shrimp cook fast, so have everything else ready before you start the sauce. A squeeze of lemon at the end cuts through the richness perfectly.",
    category: "Dinner",
    difficulty: "Easy",
    cookTimeMinutes: 20,
    servings: 2,
    ingredients: ["200g linguine", "300g shrimp, peeled", "4 cloves garlic, minced", "3 tbsp butter", "1/2 cup pasta water", "Juice of 1 lemon", "Fresh parsley, chopped"],
    steps: ["Cook pasta in salted water until al dente, reserving a cup of pasta water", "Melt butter in a pan and cook garlic until fragrant, about 1 minute", "Add shrimp and cook until pink, about 3 minutes per side", "Toss in cooked pasta with a splash of pasta water", "Finish with lemon juice and parsley"],
    nutrition: { calories: 520, protein: 34, carbs: 58, fat: 16 },
    images: ["https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800"],
    rating: 4.7,
  },
  {
    title: "Overnight Oats with Berries",
    shortDescription: "No-cook breakfast you prep the night before — ready when you wake up.",
    fullDescription: "I started making these when mornings got too rushed for a real breakfast. Mix everything the night before, and you have a filling, no-fuss breakfast waiting for you. Swap the berries for whatever fruit you have on hand.",
    category: "Breakfast",
    difficulty: "Easy",
    cookTimeMinutes: 5,
    servings: 1,
    ingredients: ["1/2 cup rolled oats", "1/2 cup milk", "1/4 cup yogurt", "1 tbsp honey", "1/2 cup mixed berries", "1 tbsp chia seeds"],
    steps: ["Combine oats, milk, yogurt, honey and chia seeds in a jar", "Stir well and cover", "Refrigerate overnight", "Top with berries before eating"],
    nutrition: { calories: 310, protein: 12, carbs: 48, fat: 8 },
    images: ["https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800"],
    rating: 4.5,
  },
  {
    title: "Classic Beef Chili",
    shortDescription: "A rich, slow-simmered chili that tastes even better the next day.",
    fullDescription: "This is my go-to for cold evenings and game nights. It freezes well, so I usually double the batch. The longer it simmers, the deeper the flavor gets — don't rush it if you can help it.",
    category: "Dinner",
    difficulty: "Medium",
    cookTimeMinutes: 75,
    servings: 6,
    ingredients: ["1 kg ground beef", "1 onion, diced", "3 cloves garlic", "2 cans kidney beans", "1 can crushed tomatoes", "2 tbsp chili powder", "1 tsp cumin", "Salt to taste"],
    steps: ["Brown the beef in a large pot, then set aside", "Sauté onion and garlic until soft", "Return beef to the pot with tomatoes, beans and spices", "Simmer uncovered for 60 minutes, stirring occasionally", "Adjust seasoning before serving"],
    nutrition: { calories: 410, protein: 32, carbs: 26, fat: 18 },
    images: ["https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=800"],
    rating: 4.8,
  },
  {
    title: "Lemon Ricotta Pancakes",
    shortDescription: "Fluffy weekend pancakes with a bright citrus edge.",
    fullDescription: "These came from a Sunday experiment with leftover ricotta, and they've been in permanent rotation since. The ricotta keeps them impossibly soft inside while the edges get slightly crisp.",
    category: "Breakfast",
    difficulty: "Easy",
    cookTimeMinutes: 25,
    servings: 3,
    ingredients: ["1 cup flour", "1 cup ricotta", "2 eggs", "3/4 cup milk", "Zest of 1 lemon", "2 tbsp sugar", "1 tsp baking powder"],
    steps: ["Whisk dry ingredients together", "In a separate bowl, mix ricotta, eggs, milk and lemon zest", "Combine wet and dry ingredients until just mixed", "Cook on a greased griddle until bubbles form, then flip", "Serve warm with syrup"],
    nutrition: { calories: 290, protein: 13, carbs: 34, fat: 10 },
    images: ["https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800"],
    rating: 4.6,
  },
  {
    title: "Thai Basil Chicken",
    shortDescription: "A fiery, fast stir-fry that's better than takeout.",
    fullDescription: "Pad kra pao was the first stir-fry that made me realize how fast good food can come together. High heat and quick cooking are key here — have every ingredient prepped before the pan gets hot.",
    category: "Dinner",
    difficulty: "Medium",
    cookTimeMinutes: 15,
    servings: 2,
    ingredients: ["300g ground chicken", "4 Thai chilies, minced", "4 cloves garlic", "2 tbsp fish sauce", "1 tbsp soy sauce", "1 cup Thai basil leaves", "2 fried eggs, to serve"],
    steps: ["Heat oil in a wok until very hot", "Stir-fry garlic and chilies for 30 seconds", "Add chicken and cook until browned", "Season with fish sauce and soy sauce", "Toss in basil leaves until wilted", "Serve over rice with a fried egg"],
    nutrition: { calories: 380, protein: 29, carbs: 12, fat: 22 },
    images: ["https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800"],
    rating: 4.9,
  },
  {
    title: "No-Bake Chocolate Tart",
    shortDescription: "A rich chocolate dessert that needs no oven at all.",
    fullDescription: "For when you want something impressive without turning on the oven. The filling sets in the fridge, so this is entirely make-ahead friendly for dinner parties.",
    category: "Dessert",
    difficulty: "Easy",
    cookTimeMinutes: 20,
    servings: 8,
    ingredients: ["200g digestive biscuits, crushed", "100g butter, melted", "300g dark chocolate", "300ml heavy cream", "1 tsp vanilla extract"],
    steps: ["Mix crushed biscuits with melted butter and press into a tart tin", "Chill the crust for 20 minutes", "Heat cream until just simmering, then pour over chopped chocolate", "Stir until smooth, add vanilla", "Pour into crust and chill for at least 3 hours"],
    nutrition: { calories: 410, protein: 5, carbs: 32, fat: 29 },
    images: ["https://images.unsplash.com/photo-1541599468348-e96984315921?w=800"],
    rating: 4.7,
  },
  {
    title: "Mango Lassi",
    shortDescription: "A cooling, three-ingredient yogurt drink perfect for hot days.",
    fullDescription: "This is the drink I make on repeat every summer. Ripe mango is non-negotiable here — it's what makes or breaks the final flavor.",
    category: "Drinks",
    difficulty: "Easy",
    cookTimeMinutes: 5,
    servings: 2,
    ingredients: ["2 ripe mangoes, cubed", "1 cup yogurt", "1/2 cup milk", "2 tbsp honey", "A pinch of cardamom"],
    steps: ["Add all ingredients to a blender", "Blend until completely smooth", "Adjust sweetness to taste", "Serve chilled over ice"],
    nutrition: { calories: 180, protein: 6, carbs: 34, fat: 3 },
    images: ["https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800"],
    rating: 4.4,
  },
  {
    title: "Crispy Baked Falafel",
    shortDescription: "A lighter, oven-baked take on the classic street food.",
    fullDescription: "I wanted the crunch of fried falafel without standing over a pot of hot oil. Baking on a well-oiled tray gets you most of the way there, and they crisp up beautifully.",
    category: "Lunch",
    difficulty: "Medium",
    cookTimeMinutes: 40,
    servings: 4,
    ingredients: ["2 cups dried chickpeas, soaked overnight", "1 onion, chopped", "4 cloves garlic", "1 cup parsley", "1 tsp cumin", "1 tsp coriander", "3 tbsp flour"],
    steps: ["Pulse soaked chickpeas with onion, garlic and herbs in a food processor", "Mix in spices and flour until combined", "Shape into small patties", "Bake at 200C for 25-30 minutes, flipping halfway", "Serve with tahini sauce"],
    nutrition: { calories: 240, protein: 11, carbs: 36, fat: 6 },
    images: ["https://images.unsplash.com/photo-1593001874117-c99c800e3eb1?w=800"],
    rating: 4.5,
  },
];

async function seed() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB for seeding");

  await User.deleteMany({});
  await Recipe.deleteMany({});

  const adminPassword = await bcrypt.hash("12345", 10);
  const admin = await User.create({
    name: "Arif Hasan",
    email: "arif12hasan14@gmail.com",
    password: adminPassword,
    role: "admin",
  });

  const userPassword = await bcrypt.hash("User@123", 10);
  const demoUser = await User.create({
    name: "Demo User",
    email: "user@savorly.com",
    password: userPassword,
    role: "user",
  });

  const recipesWithOwner = SAMPLE_RECIPES.map((recipe, i) => ({
    ...recipe,
    createdBy: i % 2 === 0 ? admin._id : demoUser._id,
  }));

  await Recipe.insertMany(recipesWithOwner);

  console.log("Seed complete:");
  console.log("Admin login -> arif12hasan14@gmail.com / 12345");
  console.log("Demo user login -> user@savorly.com / User@123");
  console.log(`${recipesWithOwner.length} recipes created`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
