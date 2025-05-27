import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

const MAX_VISIBLE_INGREDIENTS = 6;

type ProcessedOrderInfo = {
  ingredientsInfo: TIngredient[];
  ingredientsToShow: TIngredient[];
  remains: number;
  total: number;
  date: Date;
};

const useOrderProcessing = (order: OrderCardProps['order']) => {
  const { ingredients } = useSelector(getIngredientState);

  return useMemo(() => {
    if (!ingredients.length) return null;

    const findIngredientById = (id: string) =>
      ingredients.find((ing) => ing._id === id);

    const ingredientsInfo = order.ingredients
      .map(findIngredientById)
      .filter((ing): ing is TIngredient => ing !== undefined);

    const total = ingredientsInfo.reduce((sum, item) => sum + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_VISIBLE_INGREDIENTS);
    const remains = Math.max(
      0,
      ingredientsInfo.length - MAX_VISIBLE_INGREDIENTS
    );

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);
};

const OrderCardComponent: FC<OrderCardProps> = ({ order }) => {
  const location = useLocation();
  const processedOrder = useOrderProcessing(order);

  if (!processedOrder) return null;

  return (
    <OrderCardUI
      orderInfo={processedOrder}
      maxIngredients={MAX_VISIBLE_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
};

export const OrderCard = memo(OrderCardComponent);
