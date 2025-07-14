import { Document, Font, Page, View, renderToBuffer } from '@react-pdf/renderer';
import { join } from 'path';
import { FC } from 'react';
import { Fonts } from '../gp-collection-pdf.text';
import { GoodPointsCollectionDocumentProps } from '../gp-collection-pdf.type';
import { MainContentStyle, Style } from '../gps-collection.stylesheet';
import { GpNotes } from './GpNotes';
import { GpsCollectionFooter as Footer } from './GpsCollectionFooter';
import { GpsCollectionHeader as Header } from './GpsCollectionHeader';
import { usePages } from './usePages';

const GoodPointsCollectionDocument: FC<GoodPointsCollectionDocumentProps> = ({ notes, ...rest }) => {
    console.log('dir name is ', __dirname);
    Font.register({
        family: Fonts[rest.lang].family,
        src: join(__dirname, '../../../../static/fonts', Fonts[rest.lang].filename),
    });
    Font.register({
        family: Fonts[rest.lang].family,
        src: join(__dirname, '../../../../static/fonts', Fonts[rest.lang].filenameBold),
    });
    Font.registerEmojiSource({
        format: 'png',
        url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/',
    });

    const pages = usePages(notes);

    return (
        <Document creator="Hilma - Good Point" style={Style.document}>
            {pages.map(({ notes, spaceForSvg, isLongNote, lastRowHeight }, i) => (
                <Page key={i} style={[Style.bgColor, Style[rest.lang]]}>
                    <View style={Style.container}>
                        {i === 0 && <Header {...rest} />}

                        <View style={[MainContentStyle.white_box, i === 0 && MainContentStyle.white_box__first_page]}>
                            <GpNotes
                                notes={notes}
                                spaceForSvg={spaceForSvg}
                                isLongNote={isLongNote}
                                lastRowHeight={lastRowHeight}
                            />

                            <Footer />
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export const createPdfBuffer = (data: GoodPointsCollectionDocumentProps) =>
    renderToBuffer(<GoodPointsCollectionDocument {...data} />);
