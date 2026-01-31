import * as cheerio from "cheerio";

export interface ParsedNutrition {
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  servingSize: string | null;
  ingredients: string | null;
}

/**
 * Parse nutrition HTML from recipe.php response
 */
export function parseNutritionHtml(html: string): ParsedNutrition {
  const $ = cheerio.load(html);

  const name =
    $("h2").first().text().trim() || $("h1").first().text().trim() || "";

  let calories: number | null = null;
  let protein: number | null = null;
  let carbs: number | null = null;
  let fat: number | null = null;
  let servingSize: string | null = null;
  let ingredients: string | null = null;

  // Extract serving size from "Amount Per Serving X"
  const servingText = $("thead .main-line th")
    .first()
    .text()
    .replace(/Amount Per Serving/i, "")
    .trim();
  if (servingText) servingSize = servingText;

  // Parse nutrition table - each row has label + value (e.g. "Calories 110", "Total Fat 4 g")
  $(".nutrition-facts-table tr").each((_i, row) => {
    const text = $(row).text().trim();
    const lower = text.toLowerCase();
    // Extract first number (grams/mg for nutrients)
    const numMatch = text.match(/(\d+\.?\d*)\s*(?:g|mg|mcg)?/);
    const value = numMatch ? parseFloat(numMatch[1]) : null;

    if (lower.includes("calories") && !lower.includes("from"))
      calories = calories ?? value;
    if (
      lower.includes("total fat") &&
      !lower.includes("saturated") &&
      !lower.includes("trans")
    )
      fat = fat ?? value;
    if (lower.includes("total carbohydrate")) carbs = carbs ?? value;
    if (lower.includes("protein")) protein = protein ?? value;
  });

  // Extract ingredients
  const ingredientsMatch = $("p")
    .filter((_, el) => $(el).html()?.includes("Ingredients"))
    .first()
    .text()
    .replace(/Ingredients:?/i, "")
    .trim();
  if (ingredientsMatch) ingredients = ingredientsMatch;

  return {
    name,
    calories,
    protein,
    carbs,
    fat,
    servingSize,
    ingredients,
  };
}

export interface ParsedMenuLink {
  recipeId: number;
  name: string;
  dietaryTags: string[];
}

/**
 * Parse menu page HTML to extract recipe links
 * Pattern: <a href="#" class="show-nutrition prop-X prop-Y" data-recipe="5893">Diced Ham</a>
 */
export function parseMenuHtml(html: string): ParsedMenuLink[] {
  const $ = cheerio.load(html);
  const links: ParsedMenuLink[] = [];
  const seen = new Set<number>();

  $('a.show-nutrition[data-recipe]').each((_i, el) => {
    const recipeId = parseInt($(el).attr("data-recipe") || "0", 10);
    if (isNaN(recipeId) || seen.has(recipeId)) return;
    seen.add(recipeId);

    const name = $(el).text().trim();
    const classList = ($(el).attr("class") || "").split(/\s+/);

    // Extract dietary tags from prop-* classes
    // prop-made_without_gluten -> Made Without Gluten
    // prop-pork -> Pork, prop-vegetarian -> Vegetarian, prop-vegan -> Vegan
    const dietaryTags = classList
      .filter((c) => c.startsWith("prop-") && c !== "prop-show_nutrition")
      .map((c) => {
        const tag = c.replace("prop-", "").replace(/_/g, " ");
        return tag.charAt(0).toUpperCase() + tag.slice(1);
      });

    links.push({ recipeId, name, dietaryTags });
  });

  return links;
}
