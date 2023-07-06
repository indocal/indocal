export enum CertificateTemplateLayoutOrientation {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
}

export type CertificateTemplateLayout = {
  orientation: CertificateTemplateLayoutOrientation;
};

export default CertificateTemplateLayout;
