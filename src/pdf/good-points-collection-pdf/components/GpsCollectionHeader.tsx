import { Text, View } from '@react-pdf/renderer';
import { FC } from 'react'
import { Texts } from '../gp-collection-pdf.text';
import { Style } from '../gps-collection.stylesheet';
import { GoodPointsCollectionDocumentProps } from '../gp-collection-pdf.type';


export const GpsCollectionHeader: FC<Omit<GoodPointsCollectionDocumentProps, "notes">> = (
    { studentName, classroom, homeTeacher, school, lang }
) => (
    <View>
        <Text style={Style.bh}>{Texts[lang].bh}</Text>
        <Text>{Texts[lang].gps_of}</Text>
        <Text style={Style.studentName}>{studentName}</Text>

        <View style={Style.all_info_container}>
            <View style={Style.info_container}>
                <Text style={Style.info_bold}>{Texts[lang].class}</Text>
                <Text>{classroom}</Text>
            </View>

            <View style={Style.info_container}>
                <Text style={Style.info_bold}>{Texts[lang].home_teacher_IDK}</Text>
                <Text>{homeTeacher}</Text>
            </View>

            <View style={Style.info_container}>
                <Text style={Style.info_bold}>{Texts[lang].school}</Text>
                <Text>{school}</Text>
            </View>

        </View>
    </View>
);
