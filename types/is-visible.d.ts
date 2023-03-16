declare module "is-visible" {
    export function isVisible<El extends Element>(element?: El | null): boolean;
    export default isVisible;
}
