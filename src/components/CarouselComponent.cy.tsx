import { CarouselComponent } from './CarouselComponent';

describe('<CarouselComponent />', () => {
  it('shows the next and previous items on click', () => {
    cy.mount(
      <CarouselComponent
        elements={[<div>G'day mate!</div>, <div>Guten Tag meine freunde!</div>]}
      />,
    );
    cy.contains("G'day mate!");

    cy.get('[data-cy=next-item]').click();
    cy.contains('Guten Tag meine freunde!');

    cy.get('[data-cy=previous-item]').click();
    cy.contains("G'day mate!");
  });

  it('cycles through the items', () => {
    cy.mount(
      <CarouselComponent
        elements={[<div>G'day mate!</div>, <div>Guten Tag meine freunde!</div>]}
      />,
    );

    cy.get('[data-cy=next-item]').click();
    cy.get('[data-cy=next-item]').click();
    cy.contains("G'day mate!");

    cy.get('[data-cy=previous-item]').click();
    cy.get('[data-cy=previous-item]').click();
    cy.contains("G'day mate!");
  });
});
