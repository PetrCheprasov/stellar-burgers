import { TIngredient } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  handleAdd: (e: React.MouseEvent) => void;
  locationState: any;
  onClick?: (e: React.MouseEvent) => void;
};
