import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  selectBuns,
  selectMains,
  selectSauces,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/ingredients/ingredients-slice';
import {
  addBun,
  addIngredient
} from '../../services/slices/burger-constructor-slice';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const buns = useSelector(selectBuns);
  const mains = useSelector(selectMains);
  const sauces = useSelector(selectSauces);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    const refs = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };
    const ref = refs[tab as keyof typeof refs];
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIngredientClick = (ingredient: TIngredient) => {
    console.log('Opening ingredient modal for:', ingredient.name);
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: window.location.pathname }
    });
  };

  const handleAddIngredient = (ingredient: TIngredient) => {
    if (ingredient.type === 'bun') {
      dispatch(addBun(ingredient));
    } else {
      dispatch(addIngredient(ingredient));
    }
  };

  if (loading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки: {error}</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
      onIngredientClick={handleIngredientClick}
      onAddIngredient={handleAddIngredient}
    />
  );
};
