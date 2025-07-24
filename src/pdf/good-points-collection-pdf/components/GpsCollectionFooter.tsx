import { Text, View } from '@react-pdf/renderer';
import { FC } from 'react';
import { MainContentStyle } from '../gps-collection.stylesheet';
import { LogoSVG } from './LogoSVG';


export const GpsCollectionFooter: FC = () => (
    <View style={MainContentStyle.footer}>
        <View style={MainContentStyle.footer__line} />
        <LogoSVG />
    </View>
);
