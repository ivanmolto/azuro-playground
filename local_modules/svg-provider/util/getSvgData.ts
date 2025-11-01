import replaceSvgIds from "./replaceSvgIds";

export type SvgData = {
  body: string;
  attributes: Record<string, string>;
};

const getSvgData = (html: string): SvgData | undefined => {
  try {
    const svgText = html.replace(/<\?xml(.*?)\?>/, "");
    const svgTag =
      svgText.match(/<(svg|symbol)[^>]+>/)?.[0].replace(/[\n\t]/g, " ") || "";

    let body = svgText
      .replace("</svg>", "")
      .replace(/<svg[^>]+>/, "")
      .trim();

    body = replaceSvgIds(body);

    const attributes =
      svgTag.match(/\w+=["'][\w\s.]+["']/g)?.reduce((obj, item) => {
        const [key, value] = item.split("=");

        return {
          ...obj,
          [key.trim()]: value.replace(/["']/g, "").trim(),
        };
      }, {}) || {};

    return {
      body,
      attributes,
    };
  } catch (error: unknown) {
    console.warn(error);

    return undefined;
  }
};

export default getSvgData;
