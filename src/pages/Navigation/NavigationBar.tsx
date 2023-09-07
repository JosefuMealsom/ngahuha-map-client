import { ReactNode } from 'react';
import { ActiveFilterLinkComponent } from '../../components/ActiveFilterLinkComponent';
import { ProtectedLayout } from '../ProtectedLayout';

export function NavigationBar(props: {
  activePage: 'Map' | 'All Plants' | 'Closest Plants' | 'All plant sites';
  children?: ReactNode;
}) {
  function renderChildren() {
    if (!props.children) return;

    return <div className="inline-block mr-1">{props.children}</div>;
  }
  return (
    <div className="mb-2 overflow-x-scroll hide-scrollbar">
      <div className="w-max">
        <div className="mr-1 inline-block">
          <ActiveFilterLinkComponent
            text="Map"
            link="/"
            active={props.activePage === 'Map'}
            replace={true}
          />
        </div>
        <div className="mr-1 inline-block" data-cy="open-plant-list">
          <ActiveFilterLinkComponent
            text="All"
            link="/plants"
            active={props.activePage === 'All Plants'}
            replace={true}
          />
        </div>
        <div className="mr-1 inline-block">
          <ActiveFilterLinkComponent
            text="Closest"
            link="/plants/closest"
            active={props.activePage === 'Closest Plants'}
            replace={true}
          />
        </div>
        {renderChildren()}
        <ProtectedLayout>
          <div className="mr-1 inline-block">
            <ActiveFilterLinkComponent
              text="All plant sites"
              link="/plant-sites"
              active={props.activePage === 'All plant sites'}
              replace={true}
            />
          </div>
        </ProtectedLayout>
      </div>
    </div>
  );
}
