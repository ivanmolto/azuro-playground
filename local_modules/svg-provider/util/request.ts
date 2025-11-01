import getSvgData, { type SvgData } from "./getSvgData";

const pendingRequests: Record<string, Promise<SvgData>> = {};

const request = (src: string): Promise<SvgData> => {
  if (src in pendingRequests) {
    return pendingRequests[src];
  }

  pendingRequests[src] = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject(`InlineSvg: Request failed: ${src}, status: ${xhr.status}`);
      } else if (xhr.response === null) {
        reject(`InlineSvg: Empty response: ${src}`);
      } else {
        const svgData = getSvgData(xhr.response);
        if (!svgData) {
          reject(`InlineSvg: Failed to parse SVG: ${src}`);
        } else {
          resolve(svgData);
        }
      }

      delete pendingRequests[src];
    };

    xhr.onerror = () => {
      reject(`InlineSvg: Request failed: ${src}`);
      delete pendingRequests[src];
    };

    xhr.open("GET", src, true);
    xhr.responseType = "text";
    xhr.send();
  });

  return pendingRequests[src];
};

export default request;
