'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScratchCard = function (_PureComponent) {
  _inherits(ScratchCard, _PureComponent);

  function ScratchCard(props) {
    _classCallCheck(this, ScratchCard);

    var _this = _possibleConstructorReturn(this, (ScratchCard.__proto__ || Object.getPrototypeOf(ScratchCard)).call(this, props));

    _this.isDrawing = false;
    _this.lastMouseCoordinate = null;
    _this.canvas = null;
    _this.state = {
      loaded: false
    };
    return _this;
  }

  _createClass(ScratchCard, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.ctx = this.canvas.getContext('2d');
      var img = new Image();
      img.src = this.props.maskImageSrc || 'http://localhost:3000/scratch-2x.jpg';
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        _this2.ctx.drawImage(img, 0, 0);
        _this2.ctx.globalCompositeOperation = 'destination-out';
        _this2.setState({ loaded: true });
      };
    }
  }, {
    key: 'getFilledInPixels',
    value: function getFilledInPixels() {
      var pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var total = pixels.data.length;
      var count = 0;
      for (var i = 0; i < total; i += 4) {
        if (pixels.data[i] < 128) {
          count++;
        }
      }
      return count / (total / 4);
    }
  }, {
    key: 'distanceBetween',
    value: function distanceBetween(point1, point2) {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)) | 0;
    }
  }, {
    key: 'angleBetween',
    value: function angleBetween(point1, point2) {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }
  }, {
    key: 'getMouseCoordinate',
    value: function getMouseCoordinate(e, canvas) {
      var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
          top = _canvas$getBoundingCl.top,
          left = _canvas$getBoundingCl.left;

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      return {
        x: (e.pageX || e.touches[0].clientX) - left - scrollLeft,
        y: (e.pageY || e.touches[0].clientY) - top - scrollTop
      };
    }
  }, {
    key: 'handlePercentage',
    value: function handlePercentage() {
      var filledInPixels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var _props = this.props,
          _props$percent = _props.percent,
          percent = _props$percent === undefined ? .8 : _props$percent,
          _props$fadeout = _props.fadeout,
          fadeout = _props$fadeout === undefined ? 0 : _props$fadeout;

      if (filledInPixels > percent) {
        if (fadeout) {
          this.canvas.style.transition = 'all ' + fadeout / 1000 + 's linear';
          this.canvas.style.opacity = '0';
          setTimeout(this.clearNode, fadeout, this);
        } else {
          this.clearNode();
        }
        this.setState({ finished: true });
        if (this.props.onFinish) {
          this.props.onFinish();
        }
        this.handleMouseMove = function () {};
      }
    }
  }, {
    key: 'clearNode',
    value: function clearNode() {
      var that = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      var parent = that.canvas.parentNode;
      if (parent) {
        parent.removeChild(that.canvas);
      };
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(e) {
      e.preventDefault();
      this.isDrawing = true;
      this.lastMouseCoordinate = this.getMouseCoordinate(e, this.canvas);
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(e) {
      var _props$radius = this.props.radius,
          radius = _props$radius === undefined ? 10 : _props$radius;

      if (!this.isDrawing) return;
      e.preventDefault();
      var currentMouseCoordinate = this.getMouseCoordinate(e, this.canvas);
      var distance = this.distanceBetween(this.lastMouseCoordinate, currentMouseCoordinate);
      var angle = this.angleBetween(this.lastMouseCoordinate, currentMouseCoordinate);
      var x = void 0,
          y = void 0;
      for (var i = 0; i < distance; i++) {
        x = this.lastMouseCoordinate.x + Math.sin(angle) * i;
        y = this.lastMouseCoordinate.y + Math.cos(angle) * i;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();
      }
      this.lastMouseCoordinate = currentMouseCoordinate;
      this.handlePercentage(this.getFilledInPixels());
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      this.isDrawing = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var style = {
        width: this.props.width + 'px',
        height: this.props.height + 'px'
      };
      var resultStyle = {
        visibility: this.state.loaded ? 'visible' : 'hidden'
      };
      return _react2.default.createElement(
        'div',
        {
          className: 'scratchcard_container_0926',
          style: style
        },
        _react2.default.createElement('canvas', {
          ref: function ref(_ref) {
            return _this3.canvas = _ref;
          },
          className: 'scratchcard_canvas_0926',
          width: this.props.width,
          height: this.props.height,
          onMouseDown: this.handleMouseDown.bind(this),
          onTouchStart: this.handleMouseDown.bind(this),
          onMouseMove: this.handleMouseMove.bind(this),
          onTouchMove: this.handleMouseMove.bind(this),
          onMouseUp: this.handleMouseUp.bind(this),
          onTouchEnd: this.handleMouseUp.bind(this)
        }),
        _react2.default.createElement(
          'div',
          {
            className: 'scratchcard_result_0926',
            style: resultStyle
          },
          this.props.children
        )
      );
    }
  }]);

  return ScratchCard;
}(_react.PureComponent);

var _default = ScratchCard;
exports.default = _default;
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }

  __REACT_HOT_LOADER__.register(ScratchCard, 'ScratchCard', 'src/index.js');

  __REACT_HOT_LOADER__.register(_default, 'default', 'src/index.js');
}();

;