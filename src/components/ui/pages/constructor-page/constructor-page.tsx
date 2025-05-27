import { FC } from 'react';

import styles from './constructor-page.module.css';

import { ConstructorPageUIProps } from './type';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerConstructor } from '@components';

const PageTitle: FC = () => (
  <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
    Соберите бургер
  </h1>
);

const ConstructorContent: FC = () => (
  <div className={`${styles.main} pl-5 pr-5`}>
    <BurgerIngredients />
    <BurgerConstructor />
  </div>
);

const ConstructorPageContent: FC = () => (
  <main className={styles.containerMain}>
    <PageTitle />
    <ConstructorContent />
  </main>
);

const ConstructorPageUI: FC<ConstructorPageUIProps> = ({
  isIngredientsLoading
}) => {
  if (isIngredientsLoading) {
    return <Preloader />;
  }

  return <ConstructorPageContent />;
};

export { ConstructorPageUI };
