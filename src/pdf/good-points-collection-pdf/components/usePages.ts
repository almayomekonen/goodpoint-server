import { Note } from '../gp-collection-pdf.type';
import { FooterHeights, HeaderHeight, PageHeight, Spaces } from '../gps-collection.stylesheet';

const LOG = false; //!

export const usePages = (unsortedNotes: Note[]) => {
    const sortedNotes = unsortedNotes.sort((note1, note2) => note2.text.length - note1.text.length); // we want the long-notes to be one-next-to-the-other as much as possible!
    LOG && console.log('sortedNotes: ', sortedNotes);

    const pages: { notes: Note[]; spaceForSvg: number; isLongNote?: boolean; lastRowHeight?: number }[] = [];
    let rowsHeightCounter = 0;
    let prevRowI = 0;
    let rowI = 0;
    while (rowI < sortedNotes.length) {
        LOG && console.log('row num: rowI: ', rowI);
        const note1 = sortedNotes[rowI];
        const rowHeight = calcNoteHeight(note1.text); // array is sorted -> note1 is the max
        LOG && console.log('rowHeight: ', rowHeight);

        const willBeRowsHeight = rowsHeightCounter + rowHeight;
        const maxNotesHeight = getNotesViewHeight(pages.length);
        LOG && console.log('willBeRowsHeight:', willBeRowsHeight, 'maxNotesHeight:', maxNotesHeight);

        if (willBeRowsHeight < maxNotesHeight) {
            // curr rowI can fit on curr page
            rowsHeightCounter += rowHeight; // i.e willBeRowsHeight
            rowI += 2;
            continue;
        }
        // else: curr rowI is too long => cut page without rowI
        let pageEndNoteI = rowI - 1; // odd -> svg will be added as the last => even number of notes
        let isLongNote = false;
        if (prevRowI === rowI) {
            // single note `note1` doesn't fit the page!
            LOG && console.log("note1 doesn't fit the page! ...");
            isLongNote = true;
            // take row! even though it's longer than the page...
            pageEndNoteI = rowI + 2;
            rowsHeightCounter += rowHeight;
        }
        const notesForPage = sortedNotes.slice(prevRowI, pageEndNoteI); // exclusive of pageEndNoteI (we don't want willBeRowsHeight to be)
        LOG && console.log(`too long :). notes to be on page are ${prevRowI} - ${pageEndNoteI}: `, notesForPage);
        pages.push({
            spaceForSvg: maxNotesHeight - rowsHeightCounter,
            notes: notesForPage,
            isLongNote,
            lastRowHeight: rowHeight,
        });

        if (prevRowI === rowI) {
            // current note1 didn't fit the page but we took it anyway
            rowI += 2;
        } else rowI -= 1;
        rowsHeightCounter = 0;
        prevRowI = pageEndNoteI;
    }
    const lastPageNotesViewHeight = getNotesViewHeight(pages.length);
    const lastPageNotes = sortedNotes.slice(prevRowI, sortedNotes.length);
    pages.push({
        spaceForSvg: lastPageNotesViewHeight - rowsHeightCounter,
        notes: lastPageNotes,
        isLongNote: lastPageNotesViewHeight <= rowsHeightCounter,
        lastRowHeight: calcNoteHeight(lastPageNotes[lastPageNotes.length - 1].text),
    });

    LOG && console.log('pages:', pages);
    return pages;
};

const LineHeight = 20;
function calcNoteHeight(text: string) {
    const sentences = text.split('\n');
    LOG && console.log('gp sentences: ', sentences);
    const lines = sentences.reduce((linesSum, text) => linesSum + countTextLines(text), 0);
    LOG && console.log('lines: ', lines);
    return lines * LineHeight + 30 + 20 + 20; // 30=marginTop on note; 20=title height; 20=padding on note.
    //? const lines = calcTextLines(text);
    //? return (lines * LineHeight) + 30 + 20 + 21;
}

const LetterWidth = 9.5;
const LetterSpacing = 5;
const NoteWidth = 200;
function countTextLines(text: string) {
    let lines = 1;
    let lineWidthCounter = 0;
    for (const word of text.split(' ')) {
        const numOfLetters = word.length;
        const wordWidth = numOfLetters * LetterWidth + LetterSpacing;
        lineWidthCounter += wordWidth;
        if (lineWidthCounter === NoteWidth) {
            lines++;
            lineWidthCounter = 0;
        } else if (lineWidthCounter > NoteWidth) {
            lines++;
            lineWidthCounter = wordWidth;
        }
    }
    return lines;
}

const FooterHeight = FooterHeights.logo + FooterHeights.line + FooterHeights.space + FooterHeights.spaceAbove; // =64

const NotesViewHeight = PageHeight - (Spaces.AboveHeader + Spaces.UnderFooter + FooterHeight); // =757.89

const FirstPageNotesViewHeight = NotesViewHeight - (HeaderHeight + Spaces.UnderHeader);

function getNotesViewHeight(currPageI: number) {
    return currPageI === 0 ? FirstPageNotesViewHeight : NotesViewHeight;
}
