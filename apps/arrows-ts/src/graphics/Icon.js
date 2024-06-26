import { isImageInfoLoaded } from './utils/ImageCache';
import { getCachedImage } from './utils/ImageCache';

export class Icon {
  constructor(imageKey, style, imageCache) {
    this.iconImage = style(imageKey);
    const iconSize = style('icon-size');
    this.imageInfo = getCachedImage(imageCache, this.iconImage);
    if (this.imageInfo.width === 0 || this.imageInfo.height === 0) {
      this.width = this.height = iconSize;
    } else {
      const largestDimension =
        this.imageInfo.width > this.imageInfo.height ? 'width' : 'height';
      this.width =
        largestDimension === 'width'
          ? iconSize
          : (iconSize * this.imageInfo.width) / this.imageInfo.height;
      this.height =
        largestDimension === 'height'
          ? iconSize
          : (iconSize * this.imageInfo.height) / this.imageInfo.width;
    }
  }

  draw(ctx, x, y) {
    if (isImageInfoLoaded(this.imageInfo)) {
      ctx.image(this.imageInfo, x, y, this.width, this.height);
    }
  }
}
