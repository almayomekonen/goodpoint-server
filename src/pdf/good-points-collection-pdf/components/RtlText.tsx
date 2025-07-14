import { Text, View } from '@react-pdf/renderer';
import { FC } from 'react';


interface RtlTextProps {
    containerStyle?: any | any[];
    textAlign?: "center";
    children: string;
}

/**
 * handles "\n" in text
 */
const _RtlSentenceHandler: FC<RtlTextProps> = ({ children: text, ...props }) => {

    const sentences = text.split("\n");
    if (sentences.length > 1) {
        // each "sentence" doesn't have "\n"s in it
        return <>{sentences.map((sentence, i) =>
            <_RtlText key={i} {...props} >{sentence}</_RtlText>
        )}</>
    }

    return <_RtlText {...props}>{text}</_RtlText>
};

/**
 * @returns rtl text block in the correct order (reverses words order)
 */
const _RtlText: FC<RtlTextProps> = ({ children: text, containerStyle: containerStyleProp, textAlign }) => {

    const words = text.split(" ");

    //? 5px or 4pt?
    const TextStyle: Record<string, any> = { marginLeft: "5px" }; //! couldn't get the `style` interface! https://github.com/diegomura/react-pdf/issues/2291

    const ContainerStyle = Array.isArray(containerStyleProp) ? containerStyleProp : [containerStyleProp]
    ContainerStyle.push({ flexWrap: "wrap", flexDirection: "row-reverse" });

    if (textAlign === "center") {
        ContainerStyle.push({ justifyContent: "center" });
    }

    return (
        <View style={ContainerStyle}>
            {
                words.map((word, index) => <Text style={TextStyle} key={index}>{word}</Text>)
            }
        </View>
    );
};


/**
 * When using the <Text> component and the text is longer than 1 line, 
 * the hebrew text (and arabic I THINK) is rendered wrong.
 * This component fixes that.
 */
export const RtlText = _RtlSentenceHandler;
