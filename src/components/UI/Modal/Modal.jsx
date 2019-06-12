import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { fromEvent } from 'rxjs';
import {
  map, takeUntil, concatAll, withLatestFrom, merge,
} from 'rxjs/operators';
import classNames from 'classnames';
import withStyles from 'react-jss';

const styles = theme => ({
  modalDialog: {
    margin: 0,
    minWidth: 260,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: theme.shadows[5],
    '&.hidden': {
      display: 'none',
    },
  },
  modalContent: {
    height: '100%',
  },
  modalHeader: {
    padding: 0,
    '& .close': {
      padding: '0.5rem',
      margin: 0,
    },
  },
  modalTitle: {
    width: '100%',
    paddingTop: '0.5rem',
    paddingLeft: '1rem',
    paddingBottom: '0.5rem',
    paddingRight: '1rem',
    cursor: 'all-scroll',
    userSelect: 'none',
  },
  modalBody: {
    maxHeight: 599,
    overflowY: 'auto',
  },
  // modalResizeTop
  modalResizeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    width: '100%',
  },
  modalResizeTopLeft: {
    cursor: 'nwse-resize',
    width: 5,
    height: 5,
    userSelect: 'none',
  },
  modalResizeTopCenter: {
    cursor: 'ns-resize',
    height: 5,
    flexGrow: 1,
    userSelect: 'none',
  },
  modalResizeTopRight: {
    cursor: 'nesw-resize',
    width: 5,
    height: 5,
    userSelect: 'none',
  },
  // modalResizeCenter
  modalResizeCenterLeft: {
    position: 'absolute',
    top: '5px',
    left: 0,
    cursor: 'ew-resize',
    width: 5,
    height: 'calc(100% - 10px)',
    userSelect: 'none',
  },
  modalResizeCenterRight: {
    position: 'absolute',
    top: '5px',
    right: 0,
    cursor: 'ew-resize',
    width: 5,
    height: 'calc(100% - 10px)',
    userSelect: 'none',
  },
  // modalResizeBottom
  modalResizeBottom: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    display: 'flex',
    width: '100%',
  },
  modalResizeBottomLeft: {
    cursor: 'nesw-resize',
    width: 5,
    height: 5,
    userSelect: 'none',
  },
  modalResizeBottomCenter: {
    cursor: 'ns-resize',
    height: 5,
    flexGrow: 1,
    userSelect: 'none',
  },
  modalResizeBottomRight: {
    cursor: 'nwse-resize',
    width: 5,
    height: 5,
    userSelect: 'none',
  },
});

class NewsButton extends React.Component {
  constructor(props) {
    super(props);
    this.modalDialogRef = React.createRef();
    this.modalTitleRef = React.createRef();
    this.modalResizeTopLeft = React.createRef();
    this.modalResizeTopCenter = React.createRef();
    this.modalResizeTopRight = React.createRef();
    this.modalResizeCenterLeft = React.createRef();
    this.modalResizeCenterRight = React.createRef();
    this.modalResizeBottomLeft = React.createRef();
    this.modalResizeBottomCenter = React.createRef();
    this.modalResizeBottomRight = React.createRef();
  }

  componentDidMount() {
    const modalDialog = this.modalDialogRef.current;

    const validValue = (value, max, min) => Math.min(Math.max(value, min), max);

    const mouseDown = fromEvent(this.modalTitleRef.current, 'mousedown');
    const mouseUp = fromEvent(document.body, 'mouseup');
    const mouseLeave = fromEvent(document.body, 'mouseleave');
    const mouseMove = fromEvent(document.body, 'mousemove');

    mouseDown
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseDown, (move, down) => ({
          x: validValue(
            move.clientX - down.offsetX, window.innerWidth - modalDialog.clientWidth,
            0,
          ),
          y: validValue(
            move.clientY - down.offsetY, window.innerHeight - modalDialog.clientHeight,
            0,
          ),
        })),
      )
      .subscribe((pos) => {
        Object.assign(modalDialog.style, { left: `${pos.x + modalDialog.clientWidth / 2}px` });
        Object.assign(modalDialog.style, { top: `${pos.y + modalDialog.clientHeight / 2}px` });
      });

    const mouseDownTopLeft = fromEvent(this.modalResizeTopLeft.current, 'mousedown');

    mouseDownTopLeft
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: modalDialog.getBoundingClientRect().x - move.clientX,
          h: modalDialog.getBoundingClientRect().y - move.clientY,
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });

    const mouseDownTopCenter = fromEvent(this.modalResizeTopCenter.current, 'mousedown');

    mouseDownTopCenter
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          h: modalDialog.getBoundingClientRect().y - move.clientY,
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });

    const mouseDownTopRight = fromEvent(this.modalResizeTopRight.current, 'mousedown');

    mouseDownTopRight
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: -(modalDialog.getBoundingClientRect().x
            + modalDialog.getBoundingClientRect().width
            - move.clientX),
          h: modalDialog.getBoundingClientRect().y - move.clientY,
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });

    const mouseDownCenterLeft = fromEvent(this.modalResizeCenterLeft.current, 'mousedown');

    mouseDownCenterLeft
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: modalDialog.getBoundingClientRect().x - move.clientX,
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
      });

    const mouseDownCenterRight = fromEvent(this.modalResizeCenterRight.current, 'mousedown');

    mouseDownCenterRight
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: -(modalDialog.getBoundingClientRect().x
            + modalDialog.getBoundingClientRect().width
            - move.clientX),
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
      });

    const mouseDownBottomLeft = fromEvent(this.modalResizeBottomLeft.current, 'mousedown');

    mouseDownBottomLeft
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: modalDialog.getBoundingClientRect().x - move.clientX,
          h: -(modalDialog.getBoundingClientRect().y
            + modalDialog.getBoundingClientRect().height
            - move.clientY),
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });

    const mouseDownBottomCenter = fromEvent(this.modalResizeBottomCenter.current, 'mousedown');

    mouseDownBottomCenter
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          h: -(modalDialog.getBoundingClientRect().y
            + modalDialog.getBoundingClientRect().height
            - move.clientY),
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });

    const mouseDownBottomRight = fromEvent(this.modalResizeBottomRight.current, 'mousedown');

    mouseDownBottomRight
      .pipe(
        map(() => mouseMove
          .pipe(
            takeUntil(mouseUp.pipe(
              merge(mouseLeave),
            )),
          )),
        concatAll(),
        withLatestFrom(mouseMove, move => ({
          w: -(modalDialog.getBoundingClientRect().x
            + modalDialog.getBoundingClientRect().width
            - move.clientX),
          h: -(modalDialog.getBoundingClientRect().y
            + modalDialog.getBoundingClientRect().height
            - move.clientY),
        })),
      )
      .subscribe((boxSize) => {
        Object.assign(this.modalDialogRef.current.style, {
          width: `${validValue(boxSize.w + modalDialog.getBoundingClientRect().width, window.innerWidth, 150)}px`,
        });
        Object.assign(this.modalDialogRef.current.style, {
          height: `${validValue(boxSize.h + modalDialog.getBoundingClientRect().height, window.innerHeight, 150)}px`,
        });
      });
  }

  render() {
    const { classes } = this.props;

    let dialogPosition = {};
    if (this.props.position) {
      dialogPosition = this.props.position;
    }

    return ReactDOM.createPortal(
      <div
        ref={this.modalDialogRef}
        className={classNames('modal-dialog', classes.modalDialog, { hidden: !this.props.open })}
        style={{ zIndex: this.props.zIndex, ...dialogPosition }}
      >
        <div className={classNames('modal-content', classes.modalContent)}>
          <div className={classNames('modal-header', classes.modalHeader)}>
            <div
              ref={this.modalTitleRef}
              className={classNames('modal-title', 'h5', classes.modalTitle)}
              onMouseDown={() => { this.props.changeModalVisible(true); }}
            >
              {this.props.title}
            </div>
            <button
              className={'close'}
              onClick={() => { this.props.changeModalVisible(false); }}
            >
              <span aria-hidden="true">×</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className={classNames('modal-body', classes.modalBody)}>
            {this.props.content}
          </div>

          <div className={classes.modalResizeTop}>
            <div className={classes.modalResizeTopLeft} ref={this.modalResizeTopLeft} />
            <div className={classes.modalResizeTopCenter} ref={this.modalResizeTopCenter} />
            <div className={classes.modalResizeTopRight} ref={this.modalResizeTopRight} />
          </div>

          <div className={classes.modalResizeCenterLeft} ref={this.modalResizeCenterLeft} />
          <div className={classes.modalResizeCenterRight} ref={this.modalResizeCenterRight} />

          <div className={classes.modalResizeBottom}>
            <div className={classes.modalResizeBottomLeft} ref={this.modalResizeBottomLeft} />
            <div className={classes.modalResizeBottomCenter} ref={this.modalResizeBottomCenter} />
            <div className={classes.modalResizeBottomRight} ref={this.modalResizeBottomRight} />
          </div>
        </div>
      </div>,
      document.body,
    );
  }
}

NewsButton.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  zIndex: PropTypes.number.isRequired,
  changeModalVisible: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  position: PropTypes.shape({
    top: PropTypes.string.isRequired,
    left: PropTypes.string.isRequired,
  }),
};

export default withStyles(styles)(NewsButton);
