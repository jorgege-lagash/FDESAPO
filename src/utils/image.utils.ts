import domtoimage from 'dom-to-image';

export const downloadBase64Image = (base64image: string, filename: string) => {
  const lnk = document.createElement('a');
  /// the key here is to set the download attribute of the a tag
  lnk.download = filename;
  /// convert canvas content to data-uri for link. When download
  /// attribute is set the content pointed to by link will be
  /// pushed as "download" in HTML5 capable browsers
  lnk.href = base64image;
  let e;
  /// create a "fake" click-event to trigger the download
  if (document.createEvent) {
    e = document.createEvent('MouseEvents');
    e.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );

    lnk.dispatchEvent(e);
  }
};

export const elementToBase64Image = (element: HTMLElement) =>
  domtoimage.toPng(element);

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) =>
  downloadBase64Image(canvas.toDataURL('image/png;base64'), filename);

export const domToImageDownload = (element: HTMLElement, filename: string) =>
  elementToBase64Image(element)
    .then((image) => downloadBase64Image(image || '', `${filename}.png`))
    .catch((e) => {
      return;
    });

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => new File([buf], filename, { type: mimeType }));
};
