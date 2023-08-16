import AutocompleteComponent from './AutocompleteComponent';

type TestType = { id: string; value: string };

describe('<AutocompleteComponent />', () => {
  let searchFilter = {
    search: () => [
      {
        description: 'hellos id or description',
        data: { id: '123', value: 'Some important value' },
      },
    ],
  };

  it('renders a list of autocomplete suggestions', () => {
    cy.mount(
      <AutocompleteComponent<TestType>
        searchFilter={searchFilter}
        placeholder="Yo"
      />,
    );

    cy.get('input').type('hel');
    cy.contains('hellos id or description');
  });

  it('sets the value to the suggestion you click on', () => {
    const itemSelectCallback = cy.spy();

    cy.mount(
      <AutocompleteComponent<TestType>
        searchFilter={searchFilter}
        placeholder="Yo"
        onItemSelectHandler={itemSelectCallback}
      />,
    );

    cy.get('input').type('hell');
    cy.get('li').first().click();
    cy.get('input').should('have.value', 'hellos id or description');

    cy.contains('hello').should('not.be.visible');
  });

  it('clears the content when you click on the x', () => {
    cy.mount(
      <AutocompleteComponent searchFilter={searchFilter} placeholder="Yo" />,
    );

    cy.get('input').type('hell');
    cy.get('img').click();

    cy.get('input').should('have.value', '');
  });

  it('adds a flavour header to describe the suggestions if set', () => {
    cy.mount(
      <AutocompleteComponent
        searchFilter={searchFilter}
        placeholder="Yo"
        suggestionText="These are the best!"
      />,
    );

    cy.get('input').type('hell');
    cy.contains('These are the best!');
  });

  it('triggers a callback function when an item is clicked', () => {
    const itemSelectCallback = cy.spy();

    cy.mount(
      <AutocompleteComponent
        searchFilter={searchFilter}
        placeholder="Yo"
        onItemSelectHandler={itemSelectCallback}
      />,
    );

    cy.get('input').type('hell');
    cy.get('li')
      .first()
      .click()
      .then(() =>
        expect(itemSelectCallback).to.have.been.calledOnceWith({
          description: 'hellos id or description',
          data: { id: '123', value: 'Some important value' },
        }),
      );
  });

  it('triggers a callback function when the clear button is clicked', () => {
    const clearAutocompleteCallback = cy.spy();

    cy.mount(
      <AutocompleteComponent
        searchFilter={searchFilter}
        placeholder="Yo"
        onClearHandler={clearAutocompleteCallback}
      />,
    );

    cy.get('input').type('hell');
    cy.get('[data-cy="autocomplete-clear-button"')
      .click()
      .then(() => expect(clearAutocompleteCallback).to.have.been.calledOnce);
  });

  it('can control selecting the autocomplete options with the keyboard', () => {
    searchFilter = {
      search: () => [
        {
          description: 'hellos id or description',
          data: { id: '123', value: 'Some important value' },
        },
        {
          description: 'hey heys id or description',
          data: { id: 'abc', value: 'Another value' },
        },
      ],
    };

    cy.mount(
      <AutocompleteComponent searchFilter={searchFilter} placeholder="Yo" />,
    );

    // Navigation down
    cy.get('input').type('he');
    cy.get('input').type('{downArrow}{enter}');
    cy.get('input').should('have.value', 'hellos id or description');
    cy.get('input').clear();

    // Navigation up
    cy.get('input').type('he');
    cy.get('input').type('{upArrow}{enter}');
    cy.get('input').should('have.value', 'hey heys id or description');
    cy.get('input').clear();

    // Closing autocomplete with escape
    cy.get('input').type('he');
    cy.get('input').type('{esc}');
    cy.get('ul').should('not.be.visible');
  });
});
