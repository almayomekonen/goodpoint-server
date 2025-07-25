import { Gender, Language, PresetCategory, SchoolGrades } from '../enums';

export type StudentHeaders = keyof (typeof translations)['he']['studentsHeaders'];
export type PM_HEADERS = keyof (typeof translations)['he']['presetMessagesHeaders'];
export type ClassesHeaders = keyof (typeof translations)['he']['classesHeaders'];
export type TeachersHeaders = keyof (typeof translations)['he']['teachersHeaders'];

export const translations = {
    [Language.HEBREW]: {
        adminTeachersReport: {
            fullName: 'שם מלא',
            gpCount: 'מספר נקודות טובות ששלח',
        },
        errors: {
            spcify_gender: 'אנא בחר מגדר',
            choose_again: 'אנא בחר שנית',
            genders_can_be: 'יכול להיות זכר, נקבה או אחר',
            enter_fname: 'אנא הכנס שם פרטי',
            enter_lname: 'אנא הכנס שם משפחה',
            more_than: 'חייב להכיל שני תווים לפחות',
            less_than: 'חייב להכיל פחות מ20 תווים',
            letter_number: 'חייב להכיל רק אותיות ומספרים',
            enter_mail: 'אנא הכנס כתובת מייל',
            err_mail: 'כתובת מייל שגויה',
            enter_pass: 'אנא הכנס סיסמה',
            pass_8: 'הסיסמה חייבת להכיל לפחות 8 תווים',
            no_teachers_in_file: 'לא נמצאו מורים בקובץ',
            enter_very_new_pass: 'אנא הכנס סיסמה חדשה השונה מהנוכחית',
            wrong_pass: 'הסיסמה שגויה',
            valid_p: 'הסיסמה צריכה להיות באורך 8 תווים לפחות ולהכיל אות קטנה, אות גדולה ומספר',
            names_err_msg: 'יכול להכיל אותיות באנגלית ובעברית, מקפים וגרשיים בלבד',
            grade_err_msg: 'יכול להיות א, ב, ג, ד, ה, ו, ז או ח',
            class_err_msg: 'יכול להיות בין 1 ל15',
            phone1_err_msg:
                'יכול להכיל 10 ספרות (אפס בהתחלה) או 9 ספרות (בלי אפס בהתחלה) עם אפשרות למקפים במקומות הרלונטים',
            phone2_err_msg:
                'יכול להכיל 10 ספרות (אפס בהתחלה) או 9 ספרות (בלי אפס בהתחלה) עם אפשרות למקפים במקומות הרלונטים (שדה רשות)',
            no_pass_match: 'הסיסמה אינה תואמת',
            only_digits: 'יש להכיל ספרות בלבד',
            length_6: 'יש להכיל בדיוק שש ספרות',
            email_in_use: 'כתובת מייל זו בשימוש',
            the_email: 'האימייל',
            exists_in_system_for_teacher: 'קיים במערכת עבור המורה',
            exists_in_system: 'כבר קיים במערכת',
            enter_pass_again: 'הכנס סיסמה שנית',
        },
        genders: {
            [Gender.MALE]: ['זכר', 'ז'],
            [Gender.FEMALE]: ['נקבה', 'נ'],
            [Gender.OTHER]: 'אחר',
        },
        grades: {
            [SchoolGrades.FIRST]: 'א',
            [SchoolGrades.SECOND]: 'ב',
            [SchoolGrades.THIRD]: 'ג',
            [SchoolGrades.FOURTH]: 'ד',
            [SchoolGrades.FIFTH]: 'ה',
            [SchoolGrades.SIXTH]: 'ו',
            [SchoolGrades.SEVENTH]: 'ז',
            [SchoolGrades.EIGHTH]: 'ח',
            [SchoolGrades.NINTH]: 'ט',
            [SchoolGrades.TENTH]: 'י',
            [SchoolGrades.ELEVENTH]: 'יא',
            [SchoolGrades.TWELFTH]: 'יב',
        },
        categories: {
            [PresetCategory.social]: 'חברתי',
            [PresetCategory.educational]: 'לימודי',
            [PresetCategory.emotional]: 'רגשי',
            [PresetCategory.other]: 'אחר',
        },
        // ----- excel headers
        presetMessagesHeaders: {
            text: 'טקסט',
            category: 'קטגוריה',
            gender: ['מגדר', 'מין'],
        },
        classesHeaders: {
            classNumber: 'מספר כיתה',
            grade: ['שכבה', 'כיתה'],
            lastName: ['שם משפחה', 'שם משפחה של המורה'],
            firstName: ['שם פרטי', 'שם פרטי של המורה'],
            fullName: ['מורה', 'שם מלא'],
            username: ['דואר אלקטרוני', 'אימייל'],
        },
        teachersHeaders: {
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
            username: ['דואר אלקטרוני', 'אימייל'],
            fullName: 'שם מלא',
            classNumber: 'מספר כיתה',
            grade: ['שכבה', 'כיתה'],
            gender: ['מגדר', 'מין'],
            phone: ['טלפון', 'פלאפון'],
        },
        studentsHeaders: {
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
            fullName: 'שם מלא',
            classNumber: 'מספר כיתה',
            grade: ['שכבה', 'כיתה'],
            phone_p1: 'טלפון הורה 1',
            phone_p2: 'טלפון הורה 2',
            studentPhone: 'טלפון תלמיד',
            gender: ['מגדר', 'מין'],
        },
        // ----- End of excel headers

        letters: '[טיאבגדהוזח]+',
        file_name: 'סיכום-נקודות-בית-ספר',
        mail_title: 'סיכום נקודות טובות',
        hello: 'שלום וברכה',

        password_reset: {
            mail_password_title: 'היי, כאן משנים את הסיסמה',
            password_reset: 'איפוס סיסמה באתר נקודה טובה!',
            headline_rest_password: 'היי, ביקשתם לשנות את הסיסמה',
            click_on_link: 'לחצו על הקישור',
            here: 'כאן',
            reset_password: 'כדי לשנות את הסיסמה שלכם במערכת',
        },

        ExportReportTableTranslation: {
            name: 'שם התלמיד/ה',
            sender: 'שם המורה השולח/ת',
            created: 'נשלח בתאריך',
            class: 'כיתה',
            text: 'הנקודה הטובה',
        },
        ExcelTeachersTranslation: {
            password: 'סיסמה',
        },
        EXPORT_REPORT_EMAIL_TEXT: ['דוח נקודות טובות תלמידים'],
        EXPORT_REPORT_EMAIL_HEADLINE: 'נקודה טובה',
        mails: {
            from: 'מ',
            teduda_file: 'טופס-תלמידים-לתעודה',
            desc: 'סיכום נקודות טובות של בית הספר בclassesHeadersחלוקה לתלמידים',
            middle_year: 'אמצע שנה',
            start: 'סיכום הנקודות הטובות של בית הספר',
            end: 'בחלוקה לפי תלמיד עבור תעודות',
            title_month: 'תלמידים שלא קיבלו נקודה טובה החודש',
            hello: 'שלום',
            for_your_info: 'לידיעתך, התלמידים הללו מכיתתך לא קיבלו נקודה טובה החודש:',
            name: 'שם',
            date: 'תאריך',
            t_name: 'שם-המורה',
            gp: 'נקודה-טובה',
            student_name: 'שם-התלמיד',
            class: 'כיתה',
            got_m: 'קיבל',
            got_f: 'קיבלה',
            addedSuccessfully: 'נוספת בהצלחה למערכת נקודה טובה',
            yourPassword: 'הסיסמה שלך היא להלן:',
            changePass: ' ניתן לשנות את סיסמתך באתר',
            resetPassword: 'סיסמתך אופסה',
            yourNewPassword: 'הסיסמה החדשה שלך היא:',
            resetPasswordTitle: 'מערכת נקודה טובה - סיסמתך אופסה',
            part: 'חלק',
            outOf: 'מתוך',
            adminNotice: `
            לידיעתך, ניתנה לך גישה למערכת הניהול של נקודה טובה בבית ספרך.
            תוכל לגשת למערכת הניהול דרך האתר, בכתובת`,
            spam: 'אם ברצונך להפסיק לקבל מיילים מנקודה טובה,',
            clickHere: 'לחץ כאן',
            bestRegards: 'בברכה,',
            goodPointSystem: 'מערכת נקודה טובה',
        },
        welcome: {
            female: 'ברוכה הבאה',
            male: 'ברוך הבא',
            to_gp: 'לנקודה טובה',
            p1: 'מנהל המערכת של בית ספרך יצר עבורך משתמש באתר נקודה טובה!',
            p2: 'סיסמתך הזמנית למערכת היא',
            p3: 'על מנת להכנס למערכת יש ללחוץ',
            p4: 'ולהזין את כתובת המייל שלך ואת הסיסמה שניתנה לך כעת',
            p5: 'בברכה',
            p6: 'אם בית ספרכם לא נרשם למערכת, ראו הודעה זו כלא רלוונטית אליכם',
            here: 'כאן',
            gp_system: 'מערכת נקודה טובה',
            link: 'קישור לאתר',
        },
        new_password_by_admin_email: {
            title: 'שלום! סיסמתך לנקודה טובה שונתה ע"י מנהל בית הספר',
            body1: 'סיסמתך לנקודה טובה שונתה ע"י מנהל בית הספר',
            new_p_is: 'סיסמתך החדשה היא',
        },

        smsMessage: {
            hello: 'שלום',
            female: 'קיבלה',
            male: 'קיבל',
            gp: 'נקודה טובה',
            from: 'מ',
            watch_desgin: 'לצפייה בהודעה המלאה',
            addToSpam: 'אם ברצונך להפסיק לקבל SMS מנקודה טובה, לחץ על הקישור:',
        },
        smsMessageTeachers: {
            message: `היי! ממתינות לך נקודות טובות שטרם צפית בהן. לצפייה יש להכנס לאתר: {{link}} \nלתשומת לבך, אם ברצונך להפסיק לקבל התראות עליך להכנס להגדרות באתר.`,
        },
    },
    [Language.ARABIC]: {
        adminTeachersReport: {
            fullName: 'שם מלא',
            gpCount: 'מספר נקודות טובות ששלח',
        },
        errors: {
            spcify_gender: 'يرجى تحديد الجنس',
            choose_again: 'الرجاء التحديد مرة أخرى',
            genders_can_be: 'يمكن أن يكون ذكرًا أو أنثى أو غير ذلك',
            enter_fname: 'الرجاء إدخال الاسم الأول',
            enter_lname: 'الرجاء إدخال اسم العائلة',
            more_than: 'يجب أن يحتوي على حرفين على الأقل',
            less_than: 'يجب أن يكون طوله أقل من 20 حرفًا',
            letter_number: 'يجب أن يحتوي على أحرف وأرقام فقط',
            enter_mail: 'الرجاء إدخال عنوان البريد الإلكتروني',
            err_mail: 'عنوان البريد الألكتروني غير صحيح',
            enter_pass: 'ادخل كلمة المرور',
            pass_8: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
            no_teachers_in_file: 'لم يتم العثور على معلمين في الملف',
            enter_very_new_pass: 'الرجاء إدخال كلمة مرور جديدة مختلفة عن الحالية',
            wrong_pass: 'كلمة المرور غير صحيحة',
            valid_p: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف إنجليزي صغير وحرف إنجليزي كبير ورقم',
            names_err_msg: 'يمكن أن تحتوي على أحرف باللغتين الإنجليزية والعبرية ، والواصلات والاقتباسات فقط',
            grade_err_msg: 'יכול להיות א, ב, ג, ד, ה, ו, ז או ח',
            class_err_msg: 'يمكن أن يكون بين 1 و 15',
            phone1_err_msg:
                'يمكن أن تحتوي على 10 أرقام (صفر في البداية) أو 9 أرقام (لا يوجد صفر في البداية) مع خيار الواصلات في الأماكن ذات الصلة',
            phone2_err_msg:
                'يمكن أن تحتوي على 10 أرقام (صفر في البداية) أو 9 أرقام (لا يوجد صفر في البداية) مع خيار الواصلات في الأماكن ذات الصلة (حقل الإذن)',
            no_pass_match: 'كلمة المرور غير متطابقة',
            only_digits: 'يجب احتواء الأرقام فقط',
            length_6: 'يجب أن يحتوي على ستة أرقام بالضبط',
            email_in_use: 'عنوان البريد الإلكتروني هذا قيد الاستخدام',
            the_email: 'البريد الإلكتروني',
            exists_in_system_for_teacher: 'تستخدم للمعلم',
            exists_in_system: 'تستخدم',
            enter_pass_again: 'الرجاء إدخال كلمة المرور مرة أخرى',
        },
        gender: 'جنس',
        genders: {
            [Gender.MALE]: 'ذكر',
            [Gender.FEMALE]: 'انثى',
            [Gender.OTHER]: 'اخر',
        },
        grades: {
            [SchoolGrades.FIRST]: 'أول',
            [SchoolGrades.SECOND]: 'ثاني',
            [SchoolGrades.THIRD]: 'ثالث',
            [SchoolGrades.FOURTH]: 'رابع',
            [SchoolGrades.FIFTH]: 'خامس',
            [SchoolGrades.SIXTH]: 'سادس',
        },
        categories: {
            [PresetCategory.social]: 'اجتماعي',
            [PresetCategory.emotional]: 'عاطفي',
            [PresetCategory.educational]: 'تعليمي',
            [PresetCategory.other]: 'اخر',
        },

        // ----- excel headers
        presetMessagesHeaders: {
            text: '',
            category: '',
            gender: 'جنس',
        },
        classesHeaders: {
            classNumber: ' رقم صف',
            grade: 'طبقة',
            lastName: 'الاسم الأخير للمعلم',
            firstName: 'الاسم الأول للمربي',
            fullName: ['מורה', 'שם מלא'],
            username: ['דואר אלקטרוני', 'אימייל'],
        },
        studentsHeaders: {
            firstName: ' الاسم الشخصي',
            lastName: ' اسم العائلة',
            fullName: 'שם מלא',
            classNumber: 'رقم الطالة ',
            grade: 'الجنة',
            phone_p1: 'رقم هاتف الوالد 1',
            phone_p2: 'رقم هاتف الوالد 2',
            studentPhone: 'هاتف الطالب',
            gender: ['جنس', ' الجنس'],
        },
        teachersHeaders: {
            firstName: ' الاسم الشخصي',
            lastName: ' اسم العائلة',
            username: 'דואר אלקטרוני',
            fullName: 'שם מלא',
            classNumber: 'رقم الطالة',
            grade: ['שכבה', 'صف'],
            gender: ['جنس', ' الجنس'],
            phone: 'رقم الهاتف',
        },
        // ------ End of headers

        password_reset: {
            mail_password_title: 'היי, כאן משנים את הסיסמה',
            password_reset: 'איפוס סיסמה באתר נקודה טובה!',
            headline_rest_password: 'היי, ביקשתם לשנות את הסיסמה',
            click_on_link: 'לחצו על הקישור',
            here: 'כאן',
            reset_password: 'כדי לשנות את הסיסמה שלכם במערכת',
        },
        letters: '[سادسخامسثالثأولثانيرابع]',
        file_name: 'ملخص نقاط المدرسة',
        mail_title: 'ملخص النقاط الجيدة',
        hello: 'سلام',
        ExportReportTableTranslation: {
            name: 'اسم',
            sender: 'مرسل',
            created: 'مخلوق',
            class: 'صف',
            text: 'نص',
        },
        ExcelTeachersTranslation: {
            password: 'סיסמה',
        },
        EXPORT_REPORT_EMAIL_TEXT: ['تقرير نقاط الطالب الجيدة'],
        EXPORT_REPORT_EMAIL_HEADLINE: 'نقطة جيدة',
        mails: {
            from: 'من عند ',
            teduda_file: 'شهادة - نموذج الطالب',
            desc: 'ملخص النقاط الجيدة للمدرسة مقسمة إلى طلاب',
            middle_year: 'منتصف السنة',
            start: 'ملخص نقاط المدرسة الجيدة',
            end: 'مقسوما طالب',
            title_month: 'الطلاب الذين لم يحصلوا على نقطة جيدة هذا الشهر',
            hello: 'سلام',
            for_your_info: 'يرجى ملاحظة أن الطلاب في فصلك أدناه لم يحصلوا على درجة جيدة هذا الشهر:',
            name: 'اسم',
            date: 'تاريخ',
            t_name: 'اسم المعلم',
            gp: 'نقطة جيدة',
            student_name: 'اسم الطالب',
            class: 'صف',
            got_m: 'الواردة',
            got_f: 'الواردة',
            addedSuccessfully: 'נוספת בהצלחה למערכת נקודה טובה',
            yourPassword: 'הסיסמה שלך היא להלן:',
            changePass: ' ניתן לשנות את סיסמתך באתר',
            resetPassword: 'סיסמתך אופסה',
            yourNewPassword: 'הסיסמה החדשה שלך היא:',
            resetPasswordTitle: 'מערכת נקודה טובה - סיסמתך אופסה',
            part: 'חלק',
            outOf: 'מתוך',
            adminNotice: `
            לידיעתך, ניתנה לך גישה למערכת הניהול של נקודה טובה בבית ספרך.
            תוכל לגשת למערכת הניהול דרך האתר, בכתובת`,
            spam: 'אם ברצונך להפסיק לקבל מיילים מנקודה טובה,',
            clickHere: 'לחץ כאן',
            bestRegards: 'בברכה,',
            goodPointSystem: 'מערכת נקודה טובה',
        },
        welcome: {
            female: 'أهلا وسهلا',
            male: 'اهلا و سهلا',
            to_gp: 'إلى نقطة جيدة',
            p1: 'أنشأ مسؤول نظام مدرستك نقطة جيدة لك كمستخدم للموقع!',
            p2: 'كلمة المرور المؤقتة للنظام هي',
            p3: 'للدخول إلى النظام ، انقر فوق',
            p4: 'وأدخل عنوان بريدك الإلكتروني وكلمة المرور الممنوحة لك الآن',
            p5: 'يعتبر',
            p6: 'إذا لم تكن مدرستك مسجلة في النظام ، فراجع هذه الرسالة على أنها غير ذات صلة بك',
            here: 'هنا',
            gp_system: 'نظام النقاط الجيد',
            link: 'الارتباط بموقع ويب',
        },
        new_password_by_admin_email: {
            title: 'שלום! סיסמתך לנקודה טובה שונתה ע"י מנהל בית הספר',
            body1: 'סיסמתך לנקודה טובה שונתה ע"י מנהל בית הספר',
            new_p_is: 'סיסמתך החדשה היא',
        },
        smsMessage: {
            hello: 'שלום',
            female: 'קיבלה',
            male: 'קיבל',
            gp: 'نقطة جيدة',
            from: 'מ',
            watch_desgin: 'لعرض المنشور كاملا',
            addToSpam: 'אם ברצונך להפסיק לקבל הודעות מנקודה טובה, לחץ על הקישור:',
        },
        smsMessageTeachers: {
            message:
                ' ערבית!! היי! ממתינות לך נקודות טובות שטרם צפית בהן. לצפייה יש להכנס לאתר : {{link}} \nלתשומת לבך, אם ברצונך להפסיק לקבל התראות עליך להכנס להגדרות באתר.',
        },
    },
};
