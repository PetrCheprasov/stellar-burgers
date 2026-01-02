import { FC } from 'react';
import { BurgerIngredientUI } from '../ui/burger-ingredient/burger-ingredient';
import { TIngredient } from '@utils-types';

export type TBurgerIngredientProps = {
  ingredient: TIngredient;
  count?: number;
  onIngredientClick?: (ingredient: TIngredient) => void;
  onAddIngredient?: (ingredient: TIngredient) => void;
};

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count,
  onIngredientClick,
  onAddIngredient
}) => {
  const handleAdd = () => {
    if (onAddIngredient) {
      onAddIngredient(ingredient);
    }
  };

  const handleClick = () => {
    if (onIngredientClick) {
      onIngredientClick(ingredient);
    }
  };

  const locationState = { modal: true };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      handleAdd={handleAdd}
      locationState={locationState}
      onClick={handleClick}
    />
  );
};
