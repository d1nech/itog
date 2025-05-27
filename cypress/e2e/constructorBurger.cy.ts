import Cypress from 'cypress';

const API_URL = 'https://norma.nomoreparties.space/api';
const BUN_ID = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ALT_BUN_ID = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const FILLING_ID = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;

beforeEach(() => {
  cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${API_URL}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${API_URL}/orders`, { fixture: 'orderResponse.json' });
  
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modal');
});

describe('Конструктор бургера', () => {
  describe('Добавление ингредиентов', () => {
    it('Счетчик ингредиента увеличивается при добавлении', () => {
      cy.get(FILLING_ID).children('button').click();
      cy.get(FILLING_ID).find('.counter__num').should('contain', '1');
    });

    it('Можно добавить булку и начинку', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(FILLING_ID).children('button').click();
    });

    it('Можно добавить булку после начинки', () => {
      cy.get(FILLING_ID).children('button').click();
      cy.get(BUN_ID).children('button').click();
    });
  });

  describe('Замена булок', () => {
    it('Можно заменить булку при пустом конструкторе', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(ALT_BUN_ID).children('button').click();
    });

    it('Можно заменить булку при наличии начинок', () => {
      cy.get(BUN_ID).children('button').click();
      cy.get(FILLING_ID).children('button').click();
      cy.get(ALT_BUN_ID).children('button').click();
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MjNjMzQ0OTdlZGUwMDAxZDA2NmM0YiIsImlhdCI6MTcxMzYzMjU4MCwiZXhwIjoxNzEzNjM2MTgwfQ';
    window.localStorage.setItem('refreshToken', token);
    cy.setCookie('accessToken', token);
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('not.be.empty');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('Заказ успешно оформляется', () => {
    cy.get(BUN_ID).children('button').click();
    cy.get(FILLING_ID).children('button').click();
    cy.get("[data-cy='order-button']").click();
    cy.get('@modal').find('h2').should('contain', '12345');
  });
});

describe('Модальные окна', () => {
  it('Открывается модальное окно с деталями ингредиента', () => {
    cy.get('@modal').should('be.empty');
    cy.get(FILLING_ID).children('a').click();
    cy.get('@modal').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });

  it('Закрывается по клику на крестик', () => {
    cy.get('@modal').should('be.empty');
    cy.get(FILLING_ID).children('a').click();
    cy.get('@modal').should('not.be.empty');
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });

  it('Закрывается по клику на оверлей', () => {
    cy.get('@modal').should('be.empty');
    cy.get(FILLING_ID).children('a').click();
    cy.get('@modal').should('not.be.empty');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });

  it('Закрывается по нажатию Escape', () => {
    cy.get('@modal').should('be.empty');
    cy.get(FILLING_ID).children('a').click();
    cy.get('@modal').should('not.be.empty');
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modal').should('be.empty');
  });
});
