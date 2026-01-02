import { TIngredient } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  handleAdd?: () => void; // Упрощаем - без event
  locationState: any;
  onClick?: () => void; // Упрощаем - без event
};
