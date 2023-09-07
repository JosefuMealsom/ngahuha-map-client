import { useNavigate } from 'react-router-dom';
import { ActiveFilterLinkComponent } from '../../components/ActiveFilterLinkComponent';
import { BackButton } from './BackButton';

export function CreateNavigationBar(props: {
  activePage:
    | 'New plant site'
    | 'Create plant'
    | 'Create feature'
    | 'Path tracer';
}) {
  return (
    <div className="overflow-x-scroll hide-scrollbar">
      <div className="flex pt-4 pl-6 w-max pr-6 items-center">
        <div className="mr-1">
          <BackButton />
        </div>
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
        <div className="mr-1" data-cy="new-path">
          <ActiveFilterLinkComponent
            text="New path"
            link="/path-tracer"
            active={props.activePage === 'Path tracer'}
            replace={true}
          />
        </div>
      </div>
    </div>
  );
}
<div className="flex pt-4 ml-6"></div>;
