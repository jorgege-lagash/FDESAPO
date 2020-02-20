import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

interface OwnProps {
  images: string[];
}

interface OwnState {
  photoIndex: number;
  isOpen: boolean;
  showButton: boolean;
}

export default class ImageLightbox extends Component<OwnProps, OwnState> {
  public state = {
    photoIndex: 0,
    isOpen: false,
    showButton: false,
  };

  public toggleOpenState = () => this.setState({ isOpen: !this.state.isOpen });

  public handleMovePrevRequest = () => {
    const { images } = this.props;
    const { photoIndex } = this.state;
    this.setState({
      photoIndex: (photoIndex + images.length - 1) % images.length,
    });
  };

  public handleMoveNextRequest = () => {
    const { images } = this.props;
    const { photoIndex } = this.state;
    this.setState({
      photoIndex: (photoIndex + 1) % images.length,
    });
  };

  public render() {
    const { images } = this.props;
    const { photoIndex, isOpen, showButton } = this.state;
    const currentImage = images[photoIndex];
    return (
      <div>
        <img
          src={currentImage}
          style={{
            width: '128px',
            height: '128px',
            padding: '5px',
            objectFit: 'contain',
            boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.2)',
          }}
          onClick={this.toggleOpenState}
        />
        {showButton && (
          <button type="button" onClick={this.toggleOpenState}>
            Open Lightbox
          </button>
        )}

        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={this.toggleOpenState}
            onMovePrevRequest={this.handleMovePrevRequest}
            onMoveNextRequest={this.handleMoveNextRequest}
          />
        )}
      </div>
    );
  }
}
