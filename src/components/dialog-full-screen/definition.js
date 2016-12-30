import DialogFullScreen from './';
import DemoHelper from '../../utils/helpers/demo-helper';

let definition = {
  component: DialogFullScreen,
  key: 'dialog-full-screen',
  text: {
    bemClass: 'carbon-dialog-full-screen',
    details: '[content needed] Basic designs description for the component',
    description: '[content needed] Basic example of the component',
    name: 'DialogFullScreen',
    type: 'modal'
  },
  defaultProps: DialogFullScreen.defaultProps,
  props: DialogFullScreen.propTypes
};

definition.demoProps = DemoHelper.prepareDemoProps(definition, {
  children: 'test',
  disableEscKey: false
});

export default definition;
