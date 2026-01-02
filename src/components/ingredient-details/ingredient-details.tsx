import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import {
  addBun,
  addIngredient
} from '../../services/slices/burger-constructor-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ingredients = useSelector((store) => store.ingredients.items);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  const handleAddToConstructor = () => {
    if (!ingredientData) return;

    if (ingredientData.type === 'bun') {
      dispatch(addBun(ingredientData));
    } else {
      dispatch(addIngredient(ingredientData));
    }

    navigate(-1);
  };

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      onAddClick={handleAddToConstructor}
    />
  );
};
