import Decimal from './';
import Definition from './../../../demo2/utils/definition';
import OptionsHelper from './../../utils/helpers/options-helper';

let definition = new Definition('decimal', Decimal, {
  description: '[content needed] Basic example of the component',
  designerNotes: '[content needed] Basic designs description for the component',
  type: 'form',
  propTypes: {
    align: "String",
    precision: "String || Number"
  },
  propDescriptions: {
    align: "Sets the alignment of the text within the decimal component",
    precision: "Sets the precision of the decimal"
  },
  propOptions: {
    align: OptionsHelper.alignBinary
  }
});

definition.isAnInput();

export default definition;