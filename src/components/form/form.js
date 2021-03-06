import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Serialize from 'form-serialize';

import CancelButton from './cancel-button';
import FormSummary from './form-summary';
import SaveButton from './save-button';

import { validProps } from '../../utils/ether';
import tagComponent from '../../utils/helpers/tags';

/**
 * A Form widget.
 *
 * == How to use a Form in a component:
 *
 * In your file
 *
 *   import Form from 'carbon/lib/components/form';
 *
 * To render a Form:
 *
 *   <Form>
 *     <Textbox />
 *     <Textbox />
 *     <Date />
 *   </Form>
 *
 * Form provides the ability to hook into the form handle submission method.
 * By passing afterFormValidation or beforeFormValidation you can add custom
 * validation logic and prevent the form submission using ev.preventDefault()
 *
 * @class Form
 * @constructor
 */
class Form extends React.Component {
  static propTypes = {

    /**
     * Cancel button is shown if true
     *
     * @property cancel
     * @type {Boolean}
     * @default true
     */
    cancel: PropTypes.bool,

    /**
     * Custom function that is called immediately
     * after the form validates
     *
     * @property afterFormValidation
     * @type {Function}
     */
    afterFormValidation: PropTypes.func,

    /**
     * Custom function that is called immediately
     * before the form validates
     *
     * @property beforeFormValidation
     * @type {Function}
     */
    beforeFormValidation: PropTypes.func,

    /**
     * Alignment of submit button
     *
     * @ property
     * @type {String}
     */
    buttonAlign: PropTypes.string,

    /**
     * Determines if the form is in a saving state
     *
     * @property saving
     * @type {Boolean}
     * @default false
     */
    saving: PropTypes.bool,

    /**
     * If true, will validate the form on mount
     *
     * @property validateOnMount
     * @type {Boolean}
     * @default false
     */
    validateOnMount: PropTypes.bool,

    /**
     * Text for the cancel button
     *
     * @property cancelText
     * @type {String}
     * @default "Cancel"
     */
    cancelText: PropTypes.string,

    /**
     * Properties for the cancel button
     *
     * @property cancelButtonProps
     * @type {Object}
     */
    cancelButtonProps: PropTypes.object,

    /**
     * Text for the save button
     *
     * @property saveText
     * @type {String}
     * @default "Save"
     */
    saveText: PropTypes.string,

    /**
     * Properties for the save button
     *
     * @property saveButtonProps
     * @type {Object}
     */
    saveButtonProps: PropTypes.object,

    /**
     * Custom function for Cancel button onClick
     *
     * @property onCancel
     * @type {Function}
     */
    onCancel: PropTypes.func,

    /**
     * Hide or show the save button
     *
     * @property saveFalse
     * @type {Boolean}
     */
    save: PropTypes.bool,

    /**
     * Additional actions rendered next to the save and cancel buttons
     *
     * @property additionalActions
     * @type {String|JSX}
     */
    additionalActions: PropTypes.node,

    /**
     * Custom callback for when form will submit
     *
     * @property onSubmit
     * @type {Function}
     */
    onSubmit: PropTypes.func,

    /**
     * Override Save Button
     *
     * @property customSaveButton
     * @type {Node}
     */
    customSaveButton: PropTypes.node,

    /**
     * A custom class name for the component.
     *
     * @property className
     * @type {String}
     */
    className: PropTypes.string,

    /**
     * Children elements
     *
     * @property children
     * @type {Node}
     */
    children: PropTypes.node,

    /**
     * Hide or show the summary
     *
     * @property showSummary
     * @type {Boolean}
     */
    showSummary: PropTypes.bool
  }

  static defaultProps = {
    activeInput: null,
    buttonAlign: 'right',
    cancel: true,
    save: true,
    saving: false,
    validateOnMount: false,
    customSaveButton: null,
    showSummary: true
  }

  static childContextTypes = {
    /**
     * Defines a context object for child components of the form component.
     * https://facebook.github.io/react/docs/context.html
     *
     * @property form
     * @type {Object}
     */
    form: PropTypes.object
  }

  static contextTypes = {
    modal: PropTypes.object
  }

  state = {
    /**
     * Tracks the number of errors in the form
     *
     * @property errorCount
     * @type {Number}
     */
    errorCount: 0,

    /**
     * Tracks the number of warnings in the form
     *
     * @property warningCount
     * @type {Number}
     */
    warningCount: 0
  }

  /**
   * Returns form object to child components.
   *
   * @method getChildContext
   * @return {void}
   */
  getChildContext = () => {
    return {
      form: {
        attachToForm: this.attachToForm,
        detachFromForm: this.detachFromForm,
        getActiveInput: this.getActiveInput,
        incrementErrorCount: this.incrementErrorCount,
        decrementErrorCount: this.decrementErrorCount,
        incrementWarningCount: this.incrementWarningCount,
        decrementWarningCount: this.decrementWarningCount,
        inputs: this.inputs,
        setActiveInput: this.setActiveInput,
        validate: this.validate
      }
    };
  }

  /**
   * Runs once the component has mounted.
   *
   * @method componentDidMount
   * @return {void}
   */
  componentDidMount() {
    if (this.props.validateOnMount) {
      this.validate();
    }
  }

  /**
   * Gets the current active input.
   *
   * @method getActiveInput
   * @return {Object} the currently active component
   */
  getActiveInput = () => {
    return this.activeInput;
  }

  /**
   * Sets the active input, calling the hide method if the input is
   * different from the last (so as to instantly) switch.
   *
   * @method setActiveInput
   * @param {Input} input sends itself through
   * @return {void}
   */
  setActiveInput = (input) => {
    if (input !== this.activeInput && this.activeInputExistsAndHasValidation()) {
      this.activeInput.immediatelyHideMessage();
    }
    this.activeInput = input;
  }

  /**
   * stores the document - allows us to override it different contexts, such as
   * when running tests.
   *
   * @property _document
   * @type {document}
   */
  _document = document;

  /**
   * stores the window - allows us to override it different contexts, such as
   * when running tests.
   *
   * @property _window
   * @type {window}
   */
  _window = window;

  /**
   * @method activeInputHasValidation
   * @param {}
   * @return {Boolean} active input exists and is decorated with validation
   */
  activeInputExistsAndHasValidation = () => {
    return this.activeInput && this.activeInput.immediatelyHideMessage;
  }

  /**
   * Stores references to the inputs in the form
   *
   * @property inputs
   * @type {Object}
   */
  inputs = {};

  /**
   * Tracks current errorCount
   * Need to track separately from state due to async nature of setState
   *
   * @property errorCount
   * @type {Number}
   */
  errorCount = 0;

  /**
   * Tracks current warningCount
   * Need to track separately from state due to async nature of setState
   *
   * @property errorCount
   * @type {Number}
   */
  warningCount = 0;

  /**
   * Increase current error count in state by 1.
   *
   * @method incrementErrorCount
   * @return {void}
   */
  incrementErrorCount = () => {
    this.errorCount += 1;
    this.setState({ errorCount: this.errorCount });
  }

  /**
   * Decreases the current error count in state by 1.
   *
   * @method decrementErrorCount
   * @return {void}
   */
  decrementErrorCount = () => {
    this.errorCount -= 1;
    this.setState({ errorCount: this.errorCount });
  }

  /**
   * Increase current warning count in state by 1.
   *
   * @method incrementWarningCount
   * @return {void}
   */
  incrementWarningCount = () => {
    this.warningCount += 1;
    this.setState({ warningCount: this.warningCount });
  }

  /**
   * Decreases the current warning count in state by 1.
   *
   * @method decrementWarningCount
   * @return {void}
   */
  decrementWarningCount = () => {
    this.warningCount -= 1;
    this.setState({ warningCount: this.warningCount });
  }

  /**
   * Attaches child component to form.
   *
   * @method attachToForm
   * @param {Object} component Component to attach
   * @return {void}
   */
  attachToForm = (component) => {
    this.inputs[component._guid] = component;
  }

  /**
   * Detaches child component from form.
   *
   * @method detachFromFormToForm
   * @param {Object} component Component to detach
   * @return {void}
   */
  detachFromForm = (component) => {
    delete this.inputs[component._guid];
  }

  /**
   * Handles submit and runs validation.
   *
   * @method handleOnSubmit
   * @param {Object} ev event
   * @return {void}
   */
  handleOnSubmit = (ev) => {
    if (this.props.beforeFormValidation) {
      this.props.beforeFormValidation(ev);
    }

    const valid = this.validate();

    if (!valid) { ev.preventDefault(); }

    if (this.props.afterFormValidation) {
      this.props.afterFormValidation(ev, valid);
    }

    if (valid && this.props.onSubmit) {
      this.props.onSubmit(ev);
    }
  }

  /**
   * Validates any inputs in the form which have validations.
   *
   * @method validate
   * @return {Boolean} valid status
   */
  validate = () => {
    let valid = true,
        errors = 0;

    for (const key in this.inputs) {
      const input = this.inputs[key];

      if (!input.props.disabled && !input.validate()) {
        valid = false;
        errors += 1;
      }
    }

    if (!valid) { this.setState({ errorCount: errors }); }

    return valid;
  }

  /**
   * Serializes the inputs in the form ready for submission via AJAX
   * https://www.npmjs.com/package/form-serialize
   *
   * @method serialize
   * @param {Object} opts options to pass to serialize
   * @return {Object} Serialized object of fields
   */
  serialize = (opts) => {
    return Serialize(this._form, opts);
  }

  /**
   * Separates and returns HTML specific props
   *
   * @method htmlProps
   * @return {Object} props for form element
   */
  htmlProps = () => {
    const { ...props } = validProps(this);
    delete props.activeInput;
    delete props.onSubmit;
    props.className = this.mainClasses;
    return props;
  }

  /**
   * Redirects to the previous page; uses React Router history, or uses modalcancel handler.
   *
   * @method cancelForm
   * @return {void}
   */
  cancelForm = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    } else if (this.context.modal) {
      this.context.modal.onCancel();
    } else {
      // history comes from react router
      if (!this._window.history) {
        throw new Error('History is not defined. This is normally configured by the react router');
      }
      this._window.history.back();
    }
  }

  /**
   * Gets the cancel button for the form
   *
   * @method cancelButton
   * @return {Object} JSX cancel button
   */
  cancelButton = () => {
    if (!this.props.cancel) { return null; }

    const cancelProps = {
      cancelText: this.props.cancelText,
      cancelClick: this.cancelForm,
      ...this.props.cancelButtonProps
    };

    return (
      <CancelButton
        data-element='cancel'
        { ...cancelProps }
      />
    );
  }

  /**
   * Gets any additional actions passed into the form
   *
   * @method additionalActions
   * @return {Object} JSX
   */
  get additionalActions() {
    if (!this.props.additionalActions) { return null; }

    return (
      <div className='carbon-form__additional-actions' >
        { this.props.additionalActions }
      </div>
    );
  }

  /**
   * The default Save button for the form
   *
   * @method defaultSaveButton
   * @return {Object} JSX
   */
  defaultSaveButton = () => {
    return (
      <SaveButton
        saveButtonProps={ this.props.saveButtonProps }
        saveText={ this.props.saveText }
        saving={ this.props.saving }
      />
    );
  }

  /**
   * Returns a custom save button if passed in
   * the default if not
   *
   * @method saveButton
   * @return {Object} JSX
   */
  saveButton = () => {
    if (!this.props.save) { return null; }

    return this.props.customSaveButton ? this.props.customSaveButton : this.defaultSaveButton();
  }

  /**
   * Returns a form summary
   *
   * @method saveButtonWithSummary
   * @return {Object} JSX
   */
  saveButtonWithSummary = () => {
    return (
      <FormSummary
        className='carbon-form__summary'
        errors={ this.state.errorCount }
        warnings={ this.state.warningCount }
      >
        { this.saveButton() }
      </FormSummary>
    );
  }

  /**
   * Returns the footer for the form
   *
   * @method footer
   * @return {Object} JSX
   */
  formFooter = () => {
    const save = this.props.showSummary ? this.saveButtonWithSummary() : this.saveButton();
    return (
      <div className={ this.footerClasses }>
        { save }
        { this.cancelButton() }
        { this.additionalActions }
      </div>
    );
  }

  /**
   * Main class getter
   *
   * @method mainClasses
   * @return {String} Main className
   */
  get mainClasses() {
    return classNames(
      'carbon-form',
      this.props.className
    );
  }

  /**
   * Button class getter
   *
   * @method buttonClasses
   * @return {String} Main className
   */
  get footerClasses() {
    return classNames(
      'carbon-form__buttons',
      `carbon-form__buttons--${this.props.buttonAlign}`
    );
  }

  /**
   * Renders the component.
   *
   * @method render
   * @return {Object} JSX form
   */
  render() {
    return (
      <form
        onSubmit={ this.handleOnSubmit }
        { ...this.htmlProps() }
        ref={ (form) => { this._form = form; } }
        { ...tagComponent('form', this.props) }
      >
        { generateCSRFToken(this._document) }

        { this.props.children }

        { this.formFooter() }
      </form>
    );
  }
}

/**
 * Creates and returns CSRF token for input field
 *
 * @private
 * @method generateCSRFToken
 * @param {Object} doc DOM object
 * @return {Object} JSX hidden CSRF token
 */
function generateCSRFToken(doc) {
  const meta = doc.getElementsByTagName('meta');
  let csrfAttr, csrfValue;

  for (let i = 0; i < meta.length; i++) {
    const item = meta[i];

    if (item.getAttribute('name') === 'csrf-param') {
      csrfAttr = item.getAttribute('content');
    } else if (item.getAttribute('name') === 'csrf-token') {
      csrfValue = item.getAttribute('content');
    }
  }

  return <input type='hidden' name={ csrfAttr } value={ csrfValue } readOnly='true' />;
}

export default Form;
