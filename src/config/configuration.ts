import { AuthConfig } from '@hilma/auth-nest';

export default (): AuthConfig => ({
    auth: {
        accessToken_cookie: process.env.ACCESS_TOKEN_NAME,
        twoFactorToken_cookie: process.env.TWO_FACTOR_TOKEN_COOKIE,
        secretOrKey: process.env.SECRET_OR_KEY,
        allow_accessToken_query: true,
        ttl: { staff: 15552000 },
        access_logger: {
            enable: true,
            tries: 5,
            minutes: 5,
        },
        reset_password_email: {},
    },
    app_name: 'Nekuda Tova',
    app_name_he: 'נקודה טובה',
    roleAccess: {
        TEACHER: {
            components: [
                'SendAGoodPointPage',
                'ChatPage',
                'OpeningSentencePage',
                'SentPage',
                'MonthlySummaryPage',
                'ClassMonthlySummaryPage',
                'Navbar',
                'smsLandingPage',
                'UrlNotFound',
                'GoToPhone',
                'ProblemReportPage',
                'ChangePasswordPage',
                'MoreOptionsPage',
                'ExplanationPage',
                //space between old and new pages
                'PresetMessagesBank',
                'PersonalizedArea',
                'SendingGoodPointList',
                'TeachersList',
                'StudentsListByClass',
                'SendGpChat',
                'TeacherActivity',
                'ExportReport',
                'SendGPTeachers',
                'StudentsListByStudyGroup',
                'TeacherActivity',
                'ReceivedGoodPoints',
                'SendGroupGP',
                'DesktopContainer',
                'GoodpointSent',
            ],
            defaultHomePage: 'MyClasses',
        },
        ADMIN: {
            components: [
                'DashboardMain',
                'Admin',
                'SendAGoodPointPage',
                'ChatPage',
                'OpeningSentencePage',
                'SentPage',
                'MonthlySummaryPage',
                'ClassMonthlySummaryPage',
                'Navbar',
                'smsLandingPage',
                'UrlNotFound',
                'GoToPhone',
                'ChangePasswordPage',
                'MoreOptionsPage',
                'ExplanationPage',
                'PersonalizedArea',
                //space between old and new pages
                'PresetMessagesBank',
                'SendingGoodPointList',
                'TeachersList',
                'StudentsListByClass',
                'StudentsListByStudyGroup',
                'TeacherActivity',
                'ReceivedGoodPoints',
                'SendGpChat',
                'TeacherActivity',
                'ExportReport',
                'SendGPTeachers',
                'SendGroupGP',
                'DesktopContainer',
                'GoodpointSent',
                'AdminRoutes',
            ],
            defaultHomePage: 'MyClasses',
        },
        SUPERADMIN: {
            components: [
                'ChangePasswordPage',
                'SuperAdmin',
                'SchoolsList',
                'SendingGoodPointList',
                'TeachersList',
                'StudentsListByClass',
                'TeacherActivity',
                'SuperAdminRoutes',
            ],
            defaultHomePage: 'SuperAdminHome',
        },
    },
});
