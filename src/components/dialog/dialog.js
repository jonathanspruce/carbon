import React from 'react';
import Bowser from 'bowser';
import classNames from 'classnames';
import { assign } from 'lodash';
import PropTypes from 'prop-types';
import Browser from './../../utils/helpers/browser';
import Icon from './../icon';
import Modal from './../modal';
import Heading from './../heading';

/**
 * A Dialog widget.
 *
 * == How to use a Dialog in a component:
 *
 * In your file
 *
 *   import Dialog from 'carbon/lib/components/dialog';
 *
 * To render a Dialog:
 *
 *   <Dialog onCancel={ customEventHandler } />
 *
 * The component rendering the Dialog must pass down a prop of 'open' in order to open the dialog.
 *
 * You need to provide a custom cancel event handler to handle a close event.
 *
 * @class Dialog
 * @constructor
 */
class Dialog extends Modal {

  static propTypes = assign({}, Modal.propTypes, {
    /**
     * Title displayed at top of dialog
     *
     * @property title
     * @type {Object}
     */
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),

    /**
     * Subtitle displayed at top of dialog
     *
     * @property subtitle
     * @type {String}
     */
    subtitle: PropTypes.string,

    /**
     * Size of dialog, default size is 750px
     *
     * @property size
     * @type {String}
     * @default med
     */
    size: PropTypes.string,

    /**
     * Determines if the close icon is shown
     *
     * @property showCloseIcon
     * @type {Boolean}
     * @default true
     */
    showCloseIcon: PropTypes.bool,

    /**
     * If true then the dialog receives focus
     * when it opens
     *
     * @property autoFocus
     * @type {Boolean}
     * @default false
     */
    autoFocus: PropTypes.bool
  })

  static defaultProps = {
    autoFocus: true,
    size: 'medium',
    showCloseIcon: true,
    ariaRole: 'dialog'
  }

  constructor(args) {
    super(args);
    this.componentTags = this.componentTags.bind(this);
    this.onDialogBlur = this.onDialogBlur.bind(this);
    this.onCloseIconBlur = this.onCloseIconBlur.bind(this);
  }

  /**
   * A lifecycle method to update the component on initialize
   *
   * @method componentDidMount
   * @return {void}
   */
  componentDidMount() {
    if (this.props.open) {
      this.centerDialog();
      if (this.props.autoFocus) {
        this.focusDialog();
      }
    }
  }

  /**
   * Event handler to handle keyboard
   * focus leaving the dialog element.
   */
  onDialogBlur(ev) { } // eslint-disable-line no-unused-vars

  /**
   * Event handler for when the close icon
   * loses keyboard focus.
   *
   * As the close icon is the last element in the dialog
   * source, when the keyboard focus leaves the close
   * icon return the focus to the dialog itself.
   *
   * @return {Void}
   */
  onCloseIconBlur(ev) {
    ev.preventDefault();
    this.focusDialog();
  }

  /**
   * Called by ComponentDidUpdate when
   * Dialog is opened
   * @override
   *
   * @method onOpening
   * @return {Void}
   */
  get onOpening() {
    this.centerDialog();
    if (this.props.autoFocus) {
      this.focusDialog();
    }
    this.window().addEventListener('resize', this.centerDialog);
  }

  /**
   * Called by ComponentDidUpdate when
   * Dialog is closed
   * @override
   *
   * @method onClosing
   * @return {Void}
   */
  get onClosing() {
    this.window().removeEventListener('resize', this.centerDialog);
  }

  /**
   * Returns the current window
   *
   * @method window
   * @return {Object}
   */
  window = () => {
    return Browser.getWindow();
  }

  /**
   * Centers dialog relative to window
   *
   * @method centerDialog
   * @return {void}
   */
  centerDialog = () => {
    const height = this._dialog.offsetHeight / 2,
        width = this._dialog.offsetWidth / 2;

    const win = this.window();

    let midPointY = (win.innerHeight / 2) + win.pageYOffset,
        midPointX = (win.innerWidth / 2) + win.pageXOffset;

    midPointY -= height;
    midPointX -= width;

    if (midPointY < 20) {
      midPointY = 20;
    } else if (Bowser.ios) {
      midPointY -= win.pageYOffset;
    }

    if (midPointX < 20) {
      midPointX = 20;
    }

    this._dialog.style.top = `${midPointY}px`;
    this._dialog.style.left = `${midPointX}px`;
  }

  focusDialog() {
    this._dialog.focus();
  }

  /**
   * Returns HTML and text for the dialog title.
   *
   * @method dialogTitle
   * @return {String} title to display
   */
  get dialogTitle() {
    if (!this.props.title) { return null; }

    let title = this.props.title;

    if (typeof title === 'string') {
      title = (
        <Heading
          title={ title }
          titleId='carbon-dialog-title'
          subheader={ this.props.subtitle }
          subtitleId='carbon-dialog-subtitle'
        />
      );
    }

    return (
      <div className='carbon-dialog__title'>{ title }</div>
    );
  }

  /**
   * Returns classes for the component.
   * @override
   *
   * @method mainClasses
   * @return {String} Main className
   */
  get mainClasses() {
    return classNames(
      'carbon-dialog',
      this.props.className
    );
  }

  /**
   * Returns classes for the dialog.
   * @override
   *
   * @method dialogClasses
   * @return {String} dialog className
   */
  get dialogClasses() {
    return classNames(
      'carbon-dialog__dialog',
      {
        [`carbon-dialog__dialog--${this.props.size}`]: typeof this.props.size !== 'undefined'
      }
    );
  }

  get closeIcon() {
    if (this.props.showCloseIcon) {
      return (
        <Icon
          className='carbon-dialog__close'
          data-element='close'
          onClick={ this.props.onCancel }
          type='close'
          tabIndex='0'
          onBlur={ this.onCloseIconBlur }
        />
      );
    }
    return null;
  }

  componentTags(props) {
    return {
      'data-component': 'dialog',
      'data-element': props['data-element'],
      'data-role': props['data-role']
    };
  }

  /**
   * Returns the computed HTML for the dialog.
   *
   * @method dialogHTML
   * @return {Object} JSX for dialog
   */
  get modalHTML() {
    const dialogProps = {
      className: this.dialogClasses,
      tabIndex: 0
    };

    if (this.props.ariaRole) {
      dialogProps.role = this.props.ariaRole;
    }

    if (this.props.title) {
      dialogProps['aria-labelledby'] = 'carbon-dialog-title';
    }

    if (this.props.subtitle) {
      dialogProps['aria-describedby'] = 'carbon-dialog-subtitle';
    }

    return (
      <div
        ref={ (d) => { this._dialog = d; } }
        { ...dialogProps }
        { ...this.componentTags(this.props) }
        onBlur={ this.onDialogBlur }
      >
        { this.dialogTitle }

        <div className='carbon-dialog__content'>
          { this.props.children }
        </div>
        { this.closeIcon }
      </div>
    );
  }
}

export default Dialog;
