import { parseMenuHtml, type ParsedMenuLink } from "./parser";
import { parseNutritionHtml, type ParsedNutrition } from "./parser";

const BASE_URL = "https://www.hoyaeats.com";
const LOCATION_PATH = "/locations/fresh-food-company";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: `${BASE_URL}${LOCATION_PATH}/`,
};

export interface MenuItemWithNutrition extends ParsedMenuLink, ParsedNutrition {}

/**
 * Fetch menu page HTML for a given date
 */
export async function fetchMenuPage(date: string): Promise<string> {
  const url = `${BASE_URL}${LOCATION_PATH}/?date=${date}`;
  const res = await fetch(url, {
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
  return res.text();
}

/**
 * Fetch recipe nutrition for a given recipe ID
 */
export async function fetchRecipe(recipeId: number): Promise<ParsedNutrition | null> {
  const url = `${BASE_URL}${LOCATION_PATH}/recipe.php?recipe=${recipeId}&hide_allergens=0`;
  try {
    const res = await fetch(url, {
      headers: {
        ...DEFAULT_HEADERS,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const json = (await res.json()) as { success?: boolean; html?: string };
    if (!json.success || !json.html) return null;

    return parseNutritionHtml(json.html);
  } catch {
    return null;
  }
}

/**
 * Fetch full menu with nutrition for a date
 * Fetches menu page, extracts recipe IDs, then fetches each recipe's nutrition
 */
export async function fetchMenuWithNutrition(
  date: string,
  options?: { maxRecipes?: number; delayMs?: number }
): Promise<MenuItemWithNutrition[]> {
  const { maxRecipes = 50, delayMs = 200 } = options ?? {};

  const html = await fetchMenuPage(date);
  const links = parseMenuHtml(html);

  const results: MenuItemWithNutrition[] = [];
  const toFetch = links.slice(0, maxRecipes);

  for (const link of toFetch) {
    const nutrition = await fetchRecipe(link.recipeId);

    results.push({
      ...link,
      name: nutrition?.name || link.name,
      calories: nutrition?.calories ?? null,
      protein: nutrition?.protein ?? null,
      carbs: nutrition?.carbs ?? null,
      fat: nutrition?.fat ?? null,
      servingSize: nutrition?.servingSize ?? null,
      ingredients: nutrition?.ingredients ?? null,
    });

    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}
