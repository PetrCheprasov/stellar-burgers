import { FC, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector, useDispatch } from '../../services/store';
import {
  addBun,
  addIngredient
} from '../../services/slices/burger-constructor-slice';
import { fetchIngredients } from '../../services/ingredients/ingredients-slice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients = useSelector((store) => store.ingredients.items);
  const isLoading = useSelector((store) => store.ingredients.loading);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);

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

    if (location.state?.background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      onAddClick={handleAddToConstructor}
    />
  );
};
