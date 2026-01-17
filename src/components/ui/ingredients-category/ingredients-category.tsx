import React, { forwardRef } from 'react';
import styles from './ingredients-category.module.css';
import { IngredientsCategoryUIProps } from './type';
import { BurgerIngredient } from '@components';

export const IngredientsCategoryUI = forwardRef<
  HTMLUListElement,
  IngredientsCategoryUIProps
>(
  (
    {
      title,
      titleRef,
      ingredients,
      ingredientsCounters,
      onIngredientClick,
      onAddIngredient
    },
    ref
  ) => (
    <>
      <h2 className='text text_type_main-medium mt-10 mb-6' ref={titleRef}>
        {title}
      </h2>
      <ul className={styles.items} ref={ref}>
        {ingredients.map((ingredient) => (
          <BurgerIngredient
            key={ingredient._id}
            ingredient={ingredient}
            count={ingredientsCounters[ingredient._id]}
            onIngredientClick={onIngredientClick}
            onAddIngredient={onAddIngredient}
          />
        ))}
      </ul>
    </>
  )
);
