import { View } from '@react-pdf/renderer';
import { FC } from 'react';
import { bgColorStyle, randomDeg, randomNoteVariant } from '../functions/GpNote.functions';
import { NoteStyle } from '../gps-collection.stylesheet';
import { GpNoteTitle } from './GpNoteTitle';
import { RtlText } from './RtlText';


interface GPNoteProps {
    text: string;
    sender: string;
    isLongNote?: boolean;
}

export const GpNote: FC<GPNoteProps> = ({ sender, text, isLongNote }) => {

    const variant = randomNoteVariant();

    return (
        <View
            style={[NoteStyle.note_view, bgColorStyle(variant), { transform: `rotate(${randomDeg()}deg)` }]}
            wrap={isLongNote || false} // prevents the notes from being split in the middle as a result of page wrapping.
        >
            <View style={{ display: "flex", flexDirection: "column", width: "100%" }}>

                <GpNoteTitle title={sender} variant={variant} />

                <RtlText containerStyle={NoteStyle.gp} textAlign={"center"} >
                    {text}
                </RtlText>

            </View>
        </View>
    );
};
