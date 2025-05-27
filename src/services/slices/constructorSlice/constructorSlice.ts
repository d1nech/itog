import { orderBurgerApi } from '../../../utils/burger-api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface ConstructorState {
  loading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

export const initialState: ConstructorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

const createIngredientWithId = (
  ingredient: TIngredient
): TConstructorIngredient => ({
  ...ingredient,
  id: nanoid()
});

export const orderBurger = createAsyncThunk(
  'constructorBurger/order',
  async (ingredients: string[]) => orderBurgerApi(ingredients)
);

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  selectors: {
    getConstructorState: (state) => state
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const { type } = action.payload;
        if (type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: createIngredientWithId(ingredient)
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const { ingredients } = state.constructorItems;
      state.constructorItems.ingredients = ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const currentIndex = action.payload;
      const previousIndex = currentIndex - 1;
      if (previousIndex >= 0) {
        const [movedItem] = ingredients.splice(currentIndex, 1);
        ingredients.splice(previousIndex, 0, movedItem);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const currentIndex = action.payload;
      const nextIndex = currentIndex + 1;
      if (nextIndex < ingredients.length) {
        const [movedItem] = ingredients.splice(currentIndex, 1);
        ingredients.splice(nextIndex, 0, movedItem);
      }
    },
    setRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    resetModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message as string;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = null;
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  setRequest,
  resetModal
} = constructorSlice.actions;

export const { getConstructorState } = constructorSlice.selectors;
export default constructorSlice.reducer;
