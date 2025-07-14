import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { ReactElement } from 'react';
import { Language } from 'src/common/enums';
import { getTranslations } from 'src/common/translations/getTranslations';

interface CreateEmailProps {

  content: ReactElement | string[] | string;
  headline: string;
  emailForSpam: string;
  imageDomain: string;
  lang: Language
}


export const CreateEmail = ({ content, headline, emailForSpam = "", imageDomain, lang }: CreateEmailProps) => {

  const translation = getTranslations(lang)


  return (
    <Html>
      <Head />
      <Preview>{headline}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container style={{ backgroundColor: "#ebf2f2", paddingInline: "8rem", direction: "rtl", maxWidth: "50rem" }} className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[50rem]">
            <Section className="mt-[32px]">
              <Img
                src={`cid:${imageDomain}/logo-text.png`}
                height="40"
                alt=""
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              {headline}
            </Heading>

            {Array.isArray(content) ?
              content
                .map((item, index) => item ? <Text key={index} className="text-black text-[18px] leading-[24px] text-center">{item}</Text> : <br />)
              :
              content}

            <Text style={{ marginTop: "4rem" }} className="text-black text-[16px] leading-[10px] text-center">{translation.mails.bestRegards}</Text>
            <Text className="text-black text-[16px] leading-[10px] text-center">{translation.mails.goodPointSystem}</Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            {emailForSpam ?

              <Text className="text-[#666666] text-[12px] leading-[24px] text-center">

                {translation.mails.spam}
                <Link
                  href={`${imageDomain}/api/add-email-to-spam?email=${emailForSpam}`}
                  className="text-blue-600 no-underline"
                >
                  {` ${translation.mails.clickHere}`}
                </Link>


              </Text>
              : ""}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CreateEmail;