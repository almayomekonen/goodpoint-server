import { Page, View } from '@react-pdf/renderer';
import { FC, useEffect, useRef } from 'react';
import { Note } from '../gp-collection-pdf.type';
import { NoteMarginTop, NoteStyle } from '../gps-collection.stylesheet';
import { GpNote } from './GpNote';
import { HappyDancingSVG } from './HappyDancingSVG';


interface NotesProps {
    notes: Note[];
    spaceForSvg: number;
    isLongNote?: boolean;
    lastRowHeight?: number;
}

const isOdd = (num: number) => num % 2 !== 0;

export const GpNotes: FC<NotesProps> = ({ notes, spaceForSvg, isLongNote, lastRowHeight }) => {


    const notesJSX = notes.map((note, i) =>
        <GpNote key={i} sender={note.sender} text={note.text} isLongNote={isLongNote} />
    );

    /**
     * if there's an even number of nots, svg will NOT be inline.
     * if there's enough space under notes for svg to be NOT inline, it will be NOT inline
     * i.e if there's an odd number of notes and there's not too much space under notes, it WILL be inline
     */
    const isSvgInline = isOdd(notes.length) && Math.floor(spaceForSvg) < 250;

    let SvgHeight = spaceForSvg - 20; // 20 just in case
    let SvgMarginBottom = 0;

    if (isSvgInline) {
        SvgHeight += lastRowHeight - NoteMarginTop; // note margin top is also on svg
    }
    const renderSvgFlag = SvgHeight > 110;

    if (!isSvgInline && renderSvgFlag && SvgHeight - 20 > 110) { // is there room for theoretical 20px marginBottom, when svg is under notes
        // when svg is under notes and there's room for 20px marginBottom, add. (bcos looks better)
        SvgMarginBottom = 20;
        SvgHeight -= 20;
    }


    if (isSvgInline) {
        // svg inline - as a note
        return (
            <View style={[NoteStyle.notes_view_container, NoteStyle.notes_view]}>
                {notesJSX}
                {renderSvgFlag &&
                    <HappyDancingSVG
                        style={[
                            NoteStyle.dancing_svg,
                            NoteStyle.dancing_svg__as_note,
                            {
                                maxHeight: `${SvgHeight}px`
                            }
                        ]}
                    />
                }
            </View>
        );
    }
    // svg under notes
    return (
        <View style={[NoteStyle.notes_view_container, NoteStyle.notes_view_container__even]}>
            <View style={NoteStyle.notes_view}>
                {notesJSX}
            </View>
            {renderSvgFlag &&
                <HappyDancingSVG
                    style={[
                        NoteStyle.dancing_svg,
                        NoteStyle.dancing_svg__single,
                        {
                            height: `${SvgHeight}px`,
                            marginBottom: `${SvgMarginBottom}px`
                        }
                    ]}
                />
            }
        </View>
    );
};
