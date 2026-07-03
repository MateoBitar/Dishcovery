// utils/nutrition.helper.ts
import * as https from 'https';
import * as querystring from 'querystring';

// Interfaces used in the nutrition analysis
interface Ingredient {
  quantity: number;
  unit: string;
  name: string;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Nutrient {
  name: string;
  amount: number;
}

interface NutritionResponse {
  nutrition?: {
    nutrients: Nutrient[];
  };
}

/**
 * Analyzes nutrition data for a list of ingredients using Spoonacular API
 * @param ingredients - Array of ingredients with quantity, unit, and name
 * @returns Object with total calories, protein, carbs, and fat
 */
export async function analyzeNutrition(
  ingredients: Ingredient[],
): Promise<NutritionData | null> {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return null;
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    console.warn('SPOONACULAR_API_KEY not configured');
    return null;
  }

  const ingredientList = ingredients
    .map((i) => `${i.quantity} ${i.unit} ${i.name}`)
    .join('\n');

  const postData = querystring.stringify({ ingredientList });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.spoonacular.com',
      path: `/recipes/parseIngredients?apiKey=${apiKey}&includeNutrition=true`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            throw new Error(
              `Spoonacular error ${res.statusCode}: ${res.statusMessage}`,
            );
          }

          const responseData: NutritionResponse[] = JSON.parse(data);

          // Compute totals
          const totals = responseData.reduce(
            (acc, item) => {
              const nutrients = item.nutrition?.nutrients || [];
              for (const n of nutrients) {
                if (n.name === 'Calories') acc.calories += n.amount;
                if (n.name === 'Protein') acc.protein += n.amount;
                if (n.name === 'Carbohydrates') acc.carbs += n.amount;
                if (n.name === 'Fat') acc.fat += n.amount;
              }
              return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 },
          );

          resolve(totals);
        } catch (err) {
          console.error(
            'Error fetching nutrition:',
            err instanceof Error ? err.message : String(err),
          );
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Error fetching nutrition:', err.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}
