/// <reference types="react" />
/// <reference types="react-dom" />

// Déclaration des modules pour les composants UI
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Déclaration pour les imports de fichiers
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';

// Déclaration pour les modules CSS
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Déclaration pour les alias de chemins
declare module '@/*';
declare module '@shared/*';
declare module '@assets/*';

// Déclaration pour les variables d'environnement Vite
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
