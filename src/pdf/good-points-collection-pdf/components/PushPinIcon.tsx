import { View } from '@react-pdf/renderer';
import { FC } from 'react'
import { PushPinStyle } from '../gps-collection.stylesheet';
import { randomBgPushPinTop } from '../functions/GpNote.functions';


export const PushPinIcon: FC = () => {

    const inFrontTopStyle = randomBgPushPinTop();

    return (
        <View>
            <View style={[PushPinStyle.both, PushPinStyle.behind]} />
            <View style={[PushPinStyle.both, PushPinStyle.in_front, { top: `${inFrontTopStyle}px` }]} />
        </View>
    );
};
