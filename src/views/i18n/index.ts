// Player-phone translations for the role library (English lives in ../roleLibrary.ts).
import zh from './roles.zh';
import ko from './roles.ko';
import ja from './roles.ja';
import fr from './roles.fr';
import th from './roles.th';
import es from './roles.es';

export type LibText = { roles: Record<string, [string, string, string]>; ui: { goalLoner: string; reconnecting: string } };

export const LIB_I18N: Record<string, LibText> = { zh, ko, ja, fr, th, es };
