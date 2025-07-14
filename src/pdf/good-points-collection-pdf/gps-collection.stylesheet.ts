import { StyleSheet } from '@react-pdf/renderer';
import { Fonts } from './gp-collection-pdf.text';

const COLORS = {
    light_orange: '#F9DA99',
    dark_orange: '#E3A48D',
    light_red: '#F7BBA1',
    light_blue: '#E7F6F9',
    white: '#FCFDF5',
};

export const PageHeight = 841.89;
export const PageWeight = 595.28;

export const Spaces = {
    AboveHeader: 10,
    InHeader: 5,
    UnderHeader: 15,
    UnderFooter: 10, // =AboveHeader
};

export const HeaderHeight = 93;

export const FooterHeights = {
    line: 2,
    logo: 32,
    space: 10 * 2,
    spaceAbove: 10,
};

export const NotesBgColorStyle = StyleSheet.create({
    bg_orange: {
        backgroundColor: COLORS.light_orange,
    },
    bg_blue: {
        backgroundColor: COLORS.light_blue,
    },
});

export const Style = StyleSheet.create({
    bgColor: {
        backgroundColor: COLORS.light_red,
    },
    he: {
        fontFamily: Fonts['he'].family,
    },
    ar: {
        fontFamily: Fonts['ar'].family,
    },
    document: {
        color: '#081D5A',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    container: {
        marginHorizontal: '10px',
        marginVertical: `${Spaces.AboveHeader}px`,
        display: 'flex',
        flexGrow: 1,
    },
    bh: {
        textAlign: 'right',
        fontSize: '16px',
    },
    studentName: {
        fontWeight: 'bold',
        fontSize: '24px',
    },
    all_info_container: {
        display: 'flex',
        flexDirection: 'row-reverse',

        marginHorizontal: 'auto',
        marginTop: `${Spaces.InHeader}px`,
        fontSize: '16px',
    },
    info_container: {
        marginLeft: '10px',
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    info_bold: {
        fontWeight: 'bold',
        marginLeft: '5px',
    },
});

const BorderRadiusPx = '8px';
export const MainContentStyle = StyleSheet.create({
    white_box: {
        borderRadius: BorderRadiusPx,
        backgroundColor: 'white',

        flexGrow: 1,
        display: 'flex',

        paddingTop: '10px', // more space between: top-of-white-box and first-row-of-notes
    },
    white_box__first_page: {
        marginTop: `${Spaces.UnderHeader}px`, // space between: info and white-box
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '10px', // for the footer__line
    },
    footer__line: {
        height: FooterHeights.line,
        width: '100%',
        backgroundColor: COLORS.light_blue,
    },
    footer__logo: {
        height: `${FooterHeights.logo}px`,
        marginVertical: `${FooterHeights.space / 2}px`,
    },
});

const TitleFontSize = 18;
export const NoteMarginTop = 30;
export const NoteStyle = StyleSheet.create({
    notes_view_container: {
        flexGrow: 1,
        display: 'flex',
        marginBottom: `${FooterHeights.spaceAbove}px`,
    },
    notes_view_container__even: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    notes_view: {
        flexDirection: 'row-reverse', // notes will be ordered rtl
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: '50px',
    },
    note_view: {
        marginTop: `${NoteMarginTop}px`, // on note itself in case it's the first note of a new page
        width: '44%',
        padding: '10px 15px',
    },
    dancing_svg: {
        maxWidth: '70%',
        objectFit: 'scale-down',
        maxHeight: '400px',
    },
    dancing_svg__as_note: {
        marginTop: `${NoteMarginTop}px`, // on "note" itself in case it's the first note of a new page
        width: '200px', // width of note (from `debug` prop)
    },
    dancing_svg__single: {
        alignSelf: 'center',
    },
    sender: {
        fontSize: `${TitleFontSize}px`,
        fontWeight: 'bold',
    },
    sender__inline_title: {
        width: '100%',
    },
    sender__top_sticker_title: {
        backgroundColor: COLORS.light_red,

        position: 'relative',
        top: `${-10 - TitleFontSize / 2}px`,

        marginHorizontal: 'auto', // center horizontally
        paddingHorizontal: '20px',
    },
    sender__left_sticker_title: {
        backgroundColor: COLORS.light_blue,
        position: 'relative',
        top: `${-10}px`,
        left: `${25 + 5 - TitleFontSize / 2}%`,

        transform: 'rotate(-10deg)',

        paddingHorizontal: '20px',
    },
    sender__left_sticker_title__right_sticker: {
        backgroundColor: COLORS.light_blue,
        position: 'absolute',
        width: '50px',
        height: '20px',
        top: `${-9}px`,
        right: `${-(50 / 2)}px`,

        transform: 'rotate(30deg)',
    },
    gp: {
        fontSize: '16px',
    },
});

export const PushPinStyle = StyleSheet.create({
    both: {
        borderRadius: '50%',
    },
    in_front: {
        backgroundColor: COLORS.light_red,

        height: '14px',
        width: '14px',
        position: 'absolute',
        right: '3px',
    },
    behind: {
        backgroundColor: COLORS.dark_orange,

        height: '16px',
        width: '16px',
    },
});
