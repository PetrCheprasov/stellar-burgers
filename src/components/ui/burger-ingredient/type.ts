import { TIngredient } from '@utils-types';
import { Location } from 'react-router-dom';

export type LocationState = {
  background?: Location;
  modal?: boolean;
};

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  handleAdd?: () => void;
  locationState: LocationState;
  onClick?: () => void;
};
