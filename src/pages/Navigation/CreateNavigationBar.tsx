import { ActiveFilterLinkComponent } from '../../components/ActiveFilterLinkComponent';

export function CreateNavigationBar(props: {
  activePage: 'New plant site' | 'Create plant' | 'Create feature';
}) {
  return (
    <div className="flex pt-4 ml-6">
      <div className="mr-1" data-cy="open-plant-form">
        <ActiveFilterLinkComponent
          text="New plant site"
          link="/plant-site/new"
          active={props.activePage === 'New plant site'}
          replace={true}
        />
      </div>
      <div className="mr-1" data-cy="new-plant-form">
        <ActiveFilterLinkComponent
          text="New plant"
          link="/plants/new"
          active={props.activePage === 'Create plant'}
          replace={true}
        />
      </div>
      <div className="mr-1" data-cy="new-feature-form">
        <ActiveFilterLinkComponent
          text="New feature"
          link="/feature/new"
          active={props.activePage === 'Create feature'}
          replace={true}
        />
      </div>
    </div>
  );
}
<div className="flex pt-4 ml-6"></div>;
