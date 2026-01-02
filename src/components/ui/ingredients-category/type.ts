import { TIngredient } from '@utils-types';

export type IngredientsCategoryUIProps = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement>;
  ingredients: TIngredient[];
  ingredientsCounters: { [key: string]: number };
  onIngredientClick?: (ingredient: TIngredient) => void;
  onAddIngredient?: (ingredient: TIngredient) => void;
};
