interface FirebaseConfig {
    firebase: {
        projectId: string;
        privateKey: string;
        clientEmail: string;
        serviceAccountPath?: string;
    };
    authentication: {
        tokenExpiration: number;
        refreshTokenExpiration: number;
        enableTokenCaching: boolean;
        cacheExpiration: number;
        rateLimitWindow: number;
        rateLimitMax: number;
    };
    app_name: string;
    app_name_he: string;
    roleAccess: {
        [role: string]: {
            components: string[];
            defaultHomePage: string;
        };
    };
}

export default (): FirebaseConfig => ({
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID || 'goodpoint-37525',
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json',
    },
    authentication: {
        tokenExpiration: parseInt(process.env.TOKEN_EXPIRATION) || 3600,
        refreshTokenExpiration: parseInt(process.env.REFRESH_TOKEN_EXPIRATION) || 604800,
        enableTokenCaching: process.env.ENABLE_TOKEN_CACHING === 'true',
        cacheExpiration: parseInt(process.env.CACHE_EXPIRATION) || 300,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
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
