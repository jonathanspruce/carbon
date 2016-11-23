import React from 'react';

// Demo Site
import PageHeaderSmall from '../page-sections/page-header-small';
import SubPageNavigation from '../page-sections/sub-page-navigation';

/**
 * wraps the sub-pages in some further chrome items
 *
 * @param {object} props.children immediately rendered
 * @param {object} props.previousPage page object with a name and URL for the scroller
 * @param {object} props.nextPage see `previousPage` above
 * @return {SubPageChrome}
 */
export default props => (
  <div className='sub-page-chrome'>
    <PageHeaderSmall
      title='Colors'
      subtitle='Carbon can color all the things'
    />
    { props.children }
    <SubPageNavigation
      previousPage={ props.previousPage }
      nextPage={ props.nextPage }
    />
  </div>
);