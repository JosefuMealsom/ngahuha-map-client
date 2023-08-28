import { ReactNode } from 'react';
import { ActiveFilterLinkComponent } from '../../components/ActiveFilterLinkComponent';

export function NavigationBar(props: {
  activePage: 'Map' | 'All Plants' | 'Closest Plants';
  children?: ReactNode;
}) {
  return (
    <div className="flex mb-2">
      <div className="mr-1">
        <ActiveFilterLinkComponent
          text="Map"
          link="/"
          active={props.activePage === 'Map'}
          replace={true}
        />
      </div>
      <div className="mr-1" data-cy="open-plant-list">
        <ActiveFilterLinkComponent
          text="All"
          link="/plants"
          active={props.activePage === 'All Plants'}
          replace={true}
        />
      </div>
      <div className="mr-1">
        <ActiveFilterLinkComponent
          text="Closest"
          link="/plants/closest"
          active={props.activePage === 'Closest Plants'}
          replace={true}
        />
      </div>
      {props.children}
    </div>
  );
}
