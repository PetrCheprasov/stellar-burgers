import { TIngredient } from '@utils-types';

export type IngredientDetailsUIProps = {
  ingredientData: TIngredient;
  onAddClick?: () => void;
};
