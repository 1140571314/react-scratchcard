import React, { PureComponent } from 'react';
import './index.css';
export default class ScratchCard extends PureComponent {
  constructor(props) {
    super(props);
    this.isDrawing = false;
    this.lastMouseCoordinate = null;
    this.canvas = null;
    this.state = {
      loaded: false
    }
  }
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    const img = new Image();
    img.src = this.props.maskImageSrc || 'https://github.com/1140571314/react-scratchcard/blob/master/src/default.jpg';
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      this.ctx.globalCompositeOperation = 'destination-out';
      this.setState({ loaded: true });
    }
  }
  getFilledInPixels() {
    const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const total = pixels.data.length;
    let count = 0;
    for (let i = 0; i < total; i += 4) {
      if (pixels.data[i] < 128) {
        count++;
      }
    }
    return count / (total / 4);
  }
  distanceBetween(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    ) | 0;
  }

  angleBetween(point1, point2) {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  }
  getMouseCoordinate(e, canvas) {
    const { top, left } = canvas.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    return {
      x: (e.pageX || e.touches[0].clientX) - left - scrollLeft,
      y: (e.pageY || e.touches[0].clientY) - top - scrollTop
    }
  }
  handlePercentage(filledInPixels = 0) {
    let {percent=.8, fadeout=0} = this.props;
    if (filledInPixels > percent) {
      if(fadeout){
        this.canvas.style.transition = `all ${fadeout/1000}s linear`;
        this.canvas.style.opacity = '0';
        setTimeout(this.clearNode,fadeout,this);
      } else {
        this.clearNode();
      }
      this.setState({ finished: true });
      if (this.props.onFinish) {
        this.props.onFinish();
      }
      this.handleMouseMove=()=>{}
    }
  }
  clearNode(that = this){
    const parent = that.canvas.parentNode;
    if(parent){
      parent.removeChild(that.canvas);
    };
  }
  handleMouseDown(e) {
    e.preventDefault();
    this.isDrawing = true;
    this.lastMouseCoordinate = this.getMouseCoordinate(e, this.canvas);
  }
  handleMouseMove(e) {
    const { radius = 10 } = this.props;
    if (!this.isDrawing) return;
    e.preventDefault();
    const currentMouseCoordinate = this.getMouseCoordinate(e, this.canvas);
    const distance = this.distanceBetween(this.lastMouseCoordinate, currentMouseCoordinate);
    const angle = this.angleBetween(this.lastMouseCoordinate, currentMouseCoordinate);
    let x, y;
    for (let i = 0; i < distance; i++) {
      x = this.lastMouseCoordinate.x + (Math.sin(angle) * i);
      y = this.lastMouseCoordinate.y + (Math.cos(angle) * i);
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
    this.lastMouseCoordinate = currentMouseCoordinate;
    this.handlePercentage(this.getFilledInPixels());
  }
  handleMouseUp() {
    this.isDrawing = false;
  }
  render() {
    const style = {
      width: this.props.width + 'px',
      height: this.props.height + 'px'
    }
    const resultStyle = {
      visibility: this.state.loaded ? 'visible' : 'hidden'
    }
    return (
      <div
        className="scratchcard_container_0926"
        style={style}
      >
        <canvas
          ref={ref => this.canvas = ref}
          className='scratchcard_canvas_0926'
          width={this.props.width}
          height={this.props.height}
          onMouseDown={this.handleMouseDown.bind(this)}
          onTouchStart={this.handleMouseDown.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onTouchMove={this.handleMouseMove.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onTouchEnd={this.handleMouseUp.bind(this)}
        ></canvas>
        <div
          className="scratchcard_result_0926"
          style={resultStyle}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}