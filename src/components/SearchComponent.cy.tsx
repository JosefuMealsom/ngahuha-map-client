import SearchComponent from './SearchComponent';

describe('<SearchComponent />', () => {
  it('triggers a callback function when the text matches change', () => {
    const onTextMatchChange = cy.spy();

    cy.mount(
      <SearchComponent
        items={['hello', 'joe']}
        placeholder="Yo"
        onTextMatchesChange={onTextMatchChange}
      />,
    );

    cy.get('input')
      .type('hell')
      .then(() => {
        expect(onTextMatchChange).to.have.been.called;
      });
  });
});
