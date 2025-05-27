import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '@store';
import { useNavigate } from 'react-router-dom';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice/constructorSlice';
import { getUserState } from '../../services/slices/userSlice/userSlice';

const calculateTotalPrice = (
  bun: TIngredient | null,
  ingredients: TConstructorIngredient[]
) => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (sum, item) => sum + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};

const BurgerConstructorComponent: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { constructorItems, orderModalData, orderRequest } =
    useSelector(getConstructorState);
  const { isAuthenticated } = useSelector(getUserState);

  const handleOrderClick = useCallback(() => {
    if (!constructorItems.bun) {
      return;
    }
    if (isAuthenticated) {
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((i) => i._id),
        constructorItems.bun._id
      ];
      dispatch(setRequest(true));
      dispatch(orderBurger(ingredientIds));
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, constructorItems, dispatch, navigate]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  }, [dispatch]);

  const totalPrice = useMemo(
    () =>
      calculateTotalPrice(constructorItems.bun, constructorItems.ingredients),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};

export const BurgerConstructor = BurgerConstructorComponent;
