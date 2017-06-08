import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Carbon
import { Row } from './../row';

const Label = (props) => {
  if (!props.label) { return null; }
  return (
    <label htmlFor={ props.htmlFor } className='carbon-inline-inputs__label'>
      { props.label }
    </label>
  );
};

Label.propTypes = {
  /**
   * The id of the corresponding input control for the label
   *
   * @property label
   * @type {String}
   */
  htmlFor: PropTypes.string,

  /**
   * Defines the label text for the heading.
   *
   * @property label
   * @type {String}
   */
  label: PropTypes.string
};

const InlineInputs = props =>
  <div className={ classNames('carbon-inline-inputs', props.className) }>
    { Label(props) }
    <Row gutter='none' className='carbon-inline-inputs__inputs'>
      { props.children }
    </Row>
  </div>
;

InlineInputs.propTypes = {
  /**
   * Children elements
   *
   * @property children
   * @type {Node}
   */
  children: PropTypes.node,

  /**
   * A custom class name for the component.
   *
   * @property className
   * @type {String}
   */
  className: PropTypes.string
};

export default InlineInputs;
