import { TIngredient } from '@utils-types';

export type LocationState = {
  background?: Location;
  modal?: boolean;
};

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
  onIngredientClick?: (ingredient: TIngredient) => void;
  onAddIngredient?: (ingredient: TIngredient) => void;
};
