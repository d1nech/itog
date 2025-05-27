import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '@store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';

type IngredientType = 'bun' | 'main' | 'sauce';

const useIngredientsByType = (type: IngredientType) => {
  const { ingredients } = useSelector(getIngredientState);
  return ingredients.filter((i) => i.type === type);
};

const useScrollObserver = (type: IngredientType) => {
  const [ref, inView] = useInView({ threshold: 0 });
  return { ref, inView, type };
};

const useTabNavigation = () => {
  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const bunRef = useRef<HTMLHeadingElement>(null);
  const mainRef = useRef<HTMLHeadingElement>(null);
  const sauceRef = useRef<HTMLHeadingElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLHeadingElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab as TTabMode);
    switch (tab) {
      case 'bun':
        scrollToSection(bunRef);
        break;
      case 'main':
        scrollToSection(mainRef);
        break;
      case 'sauce':
        scrollToSection(sauceRef);
        break;
    }
  };

  return {
    activeTab,
    setActiveTab,
    bunRef,
    mainRef,
    sauceRef,
    handleTabClick
  };
};

const BurgerIngredientsComponent: FC = () => {
  const buns = useIngredientsByType('bun');
  const mains = useIngredientsByType('main');
  const sauces = useIngredientsByType('sauce');

  const { activeTab, setActiveTab, bunRef, mainRef, sauceRef, handleTabClick } =
    useTabNavigation();

  const { ref: bunsRef, inView: inViewBuns } = useScrollObserver('bun');
  const { ref: mainsRef, inView: inViewFilling } = useScrollObserver('main');
  const { ref: saucesRef, inView: inViewSauces } = useScrollObserver('sauce');

  useEffect(() => {
    if (inViewBuns) setActiveTab('bun');
    else if (inViewSauces) setActiveTab('sauce');
    else if (inViewFilling) setActiveTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces, setActiveTab]);

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={bunRef}
      titleMainRef={mainRef}
      titleSaucesRef={sauceRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};

export const BurgerIngredients = BurgerIngredientsComponent;
