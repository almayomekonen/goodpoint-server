import { NoteVariants } from '../gp-collection-pdf.type';
import { NotesBgColorStyle, NoteStyle } from '../gps-collection.stylesheet';

const DEBUG = false; //! for TESTING

export const NOTE_TITLE_STYLES: Partial<Record<NoteVariants, { sender: object; right_sticker?: object }>> = {
    top_sticker_title: {
        sender: NoteStyle.sender__top_sticker_title,
    },
    inline_title: {
        sender: NoteStyle.sender__inline_title,
    },
    left_sticker_title: {
        sender: NoteStyle.sender__left_sticker_title,
        right_sticker: NoteStyle.sender__left_sticker_title__right_sticker,
    },
};

export function randomNoteVariant(): NoteVariants {
    if (DEBUG) return 'left_sticker_title';
    const stylesKeys = Object.keys(NOTE_TITLE_STYLES) as (keyof typeof NOTE_TITLE_STYLES)[];
    return stylesKeys[Math.floor(Math.random() * stylesKeys.length)];
}

/**
 * @returns a random number between negative MAX_DEG and positive MAX_DEG
 */
export function randomDeg(): number {
    if (DEBUG) return 0;
    const MAX_DEG = 5;
    return Math.floor(Math.random() * MAX_DEG * 2) - MAX_DEG;
}

/**
 * @returns a random bg color style.
 * unless variant === "left_sticker_title" in which bg-color mush be bg_orange
 */
export function bgColorStyle(variant?: NoteVariants) {
    const BG_COLORS = [NotesBgColorStyle.bg_blue, NotesBgColorStyle.bg_orange];
    if (variant === 'left_sticker_title') return NotesBgColorStyle.bg_orange;
    return BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
}

export function randomBgPushPinTop(): number {
    const PUSH_PIN_TOP = [0, 2];
    return PUSH_PIN_TOP[Math.floor(Math.random() * PUSH_PIN_TOP.length)];
}
