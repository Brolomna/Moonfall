// Player-phone translations for the role library (English lives in ../roleLibrary.ts).
import zh from './roles.zh';
import ko from './roles.ko';
import ja from './roles.ja';
import fr from './roles.fr';
import th from './roles.th';
import es from './roles.es';
import tzh from './tips.zh';
import tko from './tips.ko';
import tja from './tips.ja';
import tfr from './tips.fr';
import tth from './tips.th';
import tes from './tips.es';

export type LibText = { roles: Record<string, [string, string, string]>; ui: Record<string, string> & { goalLoner: string; reconnecting: string } };

export const LIB_I18N: Record<string, LibText> = { zh, ko, ja, fr, th, es };

export type TipText = { team: Record<string, string[]>; roles: Record<string, string[]> };

/** Strategy tips per language (English lives in ../roleTips.ts). */
export const TIPS_I18N: Record<string, TipText> = { zh: tzh, ko: tko, ja: tja, fr: tfr, th: tth, es: tes };
