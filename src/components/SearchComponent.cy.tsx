import SearchComponent from './SearchComponent';

describe('<SearchComponent />', () => {
  it('takes a callback function when the text matches change', () => {
    const onMatchChange = cy.spy();
    const searchFilter = {
      search: (text: string) => [
        { description: 'lovely text', data: { someNiceData: 123 } },
      ],
    };

    type NiceDataType = { someNiceData: number };

    cy.mount(
      <SearchComponent<NiceDataType>
        searchFilter={searchFilter}
        placeholder="Yo"
        onMatchesChange={onMatchChange}
      />,
    );

    // need to wait due to the debounced function
    cy.get('input')
      .type('meh')
      .wait(1000)
      .then(() => {
        expect(onMatchChange).to.have.been.calledWith([
          { description: 'lovely text', data: { someNiceData: 123 } },
        ]);
      });
  });
});
