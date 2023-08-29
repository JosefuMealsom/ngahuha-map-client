import { MarkDownEditorComponent } from './MarkdownEditorComponent';

describe('<MarkdownEditorComponent />', () => {
  it('displays the passed in value in the content', () => {
    cy.mount(
      <MarkDownEditorComponent
        onChangeHandler={() => {}}
        value="Wow!! Really interesting."
      />,
    );

    cy.contains('Wow!! Really interesting.');
  });

  it('can edit and on save triggers a passed in callback', () => {
    const onSave = cy.spy();

    cy.mount(<MarkDownEditorComponent onChangeHandler={onSave} />);

    cy.get('[data-cy="markdown-toggle-edit"]').click();

    cy.get('[data-cy="markdown-content-input"]')
      .type('hello')
      .then(() => {
        expect(onSave).to.have.been.calledWith('hello');
      });
  });
});
