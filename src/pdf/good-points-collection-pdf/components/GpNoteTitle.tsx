import { View } from '@react-pdf/renderer';
import { FC } from 'react';
import { NOTE_TITLE_STYLES } from '../functions/GpNote.functions';
import { NoteVariants } from '../gp-collection-pdf.type';
import { NoteStyle } from '../gps-collection.stylesheet';
import { PushPinIcon } from './PushPinIcon';
import { RtlText } from './RtlText';

interface NoteTitleProps {
    title?: string;
    variant?: NoteVariants;
}

export const GpNoteTitle: FC<NoteTitleProps> = ({ title, variant }) => {
    const styles = NOTE_TITLE_STYLES[variant];

    return (
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {variant === 'inline_title' && <PushPinIcon />}
            <RtlText containerStyle={[styles.sender, NoteStyle.sender]} textAlign={'center'}>
                {title}
            </RtlText>
            {variant === 'left_sticker_title' && <View style={styles.right_sticker as any} />}
            {variant === 'inline_title' && <PushPinIcon />}
        </View>
    );
};
