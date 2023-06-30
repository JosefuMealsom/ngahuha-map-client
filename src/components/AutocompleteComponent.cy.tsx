import AutocompleteComponent from './AutocompleteComponent';

describe('<AutocompleteComponent />', () => {
  it('renders a list of autocomplete suggestions', () => {
    cy.mount(
      <AutocompleteComponent items={['hello', 'joe']} placeholder="Yo" />,
    );

    cy.get('input').type('hel');
    cy.contains('hello');

    cy.get('input').clear();

    cy.get('input').type('jo');
    cy.contains('joe');
  });

  it('sets the value to the suggestion you click on', () => {
    cy.mount(
      <AutocompleteComponent items={['hello', 'joe']} placeholder="Yo" />,
    );

    cy.get('input').type('hell');
    cy.get('ul').first().click();
    cy.get('input').should('have.value', 'hello');

    cy.contains('hello').should('not.be.visible');
  });

  it('clears the content when you click on the x', () => {
    cy.mount(
      <AutocompleteComponent items={['hello', 'joe']} placeholder="Yo" />,
    );

    cy.get('input').type('hell');
    cy.get('img').click();

    cy.get('input').should('have.value', '');
  });

  it('adds a flavour header to describe the suggestions if set', () => {
    cy.mount(
      <AutocompleteComponent
        items={['hello', 'joe']}
        placeholder="Yo"
        suggestionText="These are the best!"
      />,
    );

    cy.get('input').type('hell');
    cy.contains('These are the best!');
  });
});