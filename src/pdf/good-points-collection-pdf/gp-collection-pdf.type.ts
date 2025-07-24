import { Language } from 'src/common/enums';

export type Note = { text: string; sender: string };

export type NoteVariants = 'top_sticker_title' | 'inline_title' | 'left_sticker_title';

export interface GoodPointsCollectionDocumentProps {
    studentName: string;
    classroom: string;
    homeTeacher: string;
    school: string;
    notes: Note[];
    lang: Language;
}
