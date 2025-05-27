import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Params, useParams } from 'react-router-dom';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';
import { TIngredient } from '@utils-types';

const useIngredientById = (id: string | undefined): TIngredient | undefined => {
  const { ingredients } = useSelector(getIngredientState);
  return useMemo(
    () => ingredients.find((item) => item._id === id),
    [ingredients, id]
  );
};

const IngredientDetailsComponent: FC = () => {
  const { id } = useParams<Params>();
  const ingredient = useIngredientById(id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};

export const IngredientDetails = IngredientDetailsComponent;
