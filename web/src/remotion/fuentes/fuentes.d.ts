/** Remotion empaqueta los .woff2 como archivos: el import da su URL. */
declare module "*.woff2" {
  const src: string;
  export default src;
}
