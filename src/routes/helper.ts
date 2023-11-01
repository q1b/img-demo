const roundIfNumeric = (value: string | number) => {
  if (!value) {
    return value;
  }
  const num = Number(value);
  return isNaN(num) ? value : Math.round(num);
};

const toUrl = (url: string | URL, base?: string | URL | undefined) => {
  return typeof url === "string" ? new URL(url, base ?? "http://n/") : url;
};

// eslint-disable-next-line no-useless-escape
const cloudinaryRegex = /https?:\/\/(?<host>[^\/]+)\/(?<cloudName>[^\/]+)\/(?<assetType>image|video|raw)\/(?<deliveryType>upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/?(?<signature>s\-\-[a-zA-Z0-9]+\-\-)?\/?(?<transformations>(?:[^_\/]+_[^,\/]+,?)*)?\/(?:(?<version>v\d+)\/)?(?<idAndFormat>[^\s]+)$/g;

const parseTransforms = (transformations: string) => {
  return transformations
    ? Object.fromEntries(transformations.split(",").map((t) => t.split("_")))
    : {};
};

const formatUrl = (
  {
    host,
    cloudName,
    assetType,
    deliveryType,
    signature,
    transformations = {},
    version,
    id,
    format,
  }: CloudinaryParams,
): string => {
  if (format) {
    transformations.f = format;
  }
  const transformString = Object.entries(transformations).map(
    ([key, value]) => `${key}_${value}`,
  ).join(",");

  const pathSegments = [
    host,
    cloudName,
    assetType,
    deliveryType,
    signature,
    transformString,
    version,
    id,
  ].filter(Boolean).join("/");
  return `https://${pathSegments}`;
};

export interface CloudinaryParams {
  host?: string;
  cloudName?: string;
  assetType?: string;
  deliveryType?: string;
  signature?: string;
  transformations: Record<string, string>;
  version?: string;
  id?: string;
  format?: string;
}
export const parse = (
  imageUrl:string,
) => {
  const url = toUrl(imageUrl);
  const matches = [...url.toString().matchAll(cloudinaryRegex)];
  if (!matches.length) {
    throw new Error("Invalid Cloudinary URL");
  }

  const group = matches[0].groups || {};
  const {
    transformations: transformString = "",
    idAndFormat,
    ...baseParams
  } = group;
  delete group.idAndFormat;
  const lastDotIndex = idAndFormat.lastIndexOf(".");
  const id = lastDotIndex < 0
    ? idAndFormat
    : idAndFormat.slice(0, lastDotIndex);
  const originalFormat = lastDotIndex < 0
    ? undefined
    : idAndFormat.slice(lastDotIndex + 1);

  const { w, h, f, ...transformations } = parseTransforms(
    transformString,
  );

  const format = (f && f !== "auto") ? f : originalFormat;

  const base = formatUrl({ ...baseParams, id, transformations });
  return {
    base,
    width: Number(w) || undefined,
    height: Number(h) || undefined,
    format,
    cdn: "cloudinary",
    params: {
      assetType: 'image',
      ...group,
      id: group.deliveryType === "fetch" ? idAndFormat : id,
      format,
      transformations,
    },
  };
};

export const generate = (
  { base, width, height, format, transformations }: { base:string;width:number;height:number;format:string; transformations: Record<string, string>; },
) => {
  const parsed = parse(base.toString());

  const props  = {
    ...parsed.params,
    format: format || "auto",
  };
  props.transformations = {
    ...props.transformations,
    ...transformations,
  }
  if (width) {
    props.transformations.w = roundIfNumeric(width).toString();
  }
  if (height) {
    props.transformations.h = roundIfNumeric(height).toString();
  }

  // Default crop to fill without upscaling
  props.transformations.c ||= "lfill";
  return formatUrl(props);
};