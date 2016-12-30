import Link from './';
import DemoHelper from '../../utils/helpers/demo-helper';
import OptionsHelper from '../../utils/helpers/options-helper';

let definition = {
  component: Link,
  key: 'link',
  text: {
    bemClass: 'carbon-link',
    details: '[content needed] Basic designs description for the component',
    description: '[content needed] Basic example of the component',
    name: 'Link',
    type: 'action'
  },
  defaultProps: Link.defaultProps,
  props: Link.propTypes,
  propOptions: {
    icon: OptionsHelper.icons(),
    iconAlign: OptionsHelper.alignBinary(),
    tooltipAlign: OptionsHelper.alignFull(),
    tooltipPosition: OptionsHelper.positions()
  }
};

definition.demoProps = DemoHelper.prepareDemoProps(definition, {
  children: 'Click me',
  icon: 'download',
  iconAlign: 'left',
  tooltipAlign: 'left',
  tooltipMessage: 'Link tooltip',
  tooltipPosition: 'top'
});

export default definition;
