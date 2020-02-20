declare var global: any;
declare var document: any;
export const prepareToTestQuill = () => {
  if (global.document) {
    document.createRange = () => ({
      setStart: () => {
        return;
      },
      setEnd: () => {
        return;
      },
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    document.getSelection = () => {
      return {
        removeAllRanges: () => {
          return;
        },
        getRangeAt: () => {
          return;
        },
      };
    };
  }
};
