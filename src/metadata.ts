/* eslint-disable */
export default async () => {
    const t = {
        ['./entities/classes.entity']: await import('./entities/classes.entity'),
        ['./entities/study-group.entity']: await import('./entities/study-group.entity'),
        ['./entities/user-school.entity']: await import('./entities/user-school.entity'),
        ['./entities/good-point.entity']: await import('./entities/good-point.entity'),
        ['./entities/preset-messages.entity']: await import('./entities/preset-messages.entity'),
        ['./entities/archived-good-point.entity']: await import('./entities/archived-good-point.entity'),
        ['./entities/sms.entity']: await import('./entities/sms.entity'),
        ['./entities/student.entity']: await import('./entities/student.entity'),
        ['./entities/removed-preset-messages.entity']: await import('./entities/removed-preset-messages.entity'),
        ['./common/enums/emojis-enum.enum']: await import('./common/enums/emojis-enum.enum'),
        ['./entities/teachers-good-points.entity']: await import('./entities/teachers-good-points.entity'),
        ['./entities/school.entity']: await import('./entities/school.entity'),
        ['./entities/staff.entity']: await import('./entities/staff.entity'),
        ['./entities/teachers-good-points-reaction.entity']: await import(
            './entities/teachers-good-points-reaction.entity'
        ),
        ['./common/enums/school-grades.enum']: await import('./common/enums/school-grades.enum'),
        ['./entities/study-groups-grades.entity']: await import('./entities/study-groups-grades.entity'),
        ['./common/enums/gender.enum']: await import('./common/enums/gender.enum'),
        ['./common/enums/language.enum']: await import('./common/enums/language.enum'),
        ['./entities/starred-user-class.entity']: await import('./entities/starred-user-class.entity'),
        ['./entities/admin-actions.entity']: await import('./entities/admin-actions.entity'),
        ['./common/enums/super-admin-actions.enum']: await import('./common/enums/super-admin-actions.enum'),
        ['./entities/good-point-reaction.entity']: await import('./entities/good-point-reaction.entity'),
        ['./entities/parent-phone.entity']: await import('./entities/parent-phone.entity'),
        ['./common/enums/preset-category.enum']: await import('./common/enums/preset-category.enum'),
        ['@hilma/auth-nest/dist/role/role.entity']: await import('@hilma/auth-nest/dist/role/role.entity'),
        ['./common/enums/admin-gps-fetch-order']: await import('./common/enums/admin-gps-fetch-order'),
        ['./common/dtos/add-a-pm-dto.dto']: await import('./common/dtos/add-a-pm-dto.dto'),
        ['./common/dtos/date-for-report-dto.dto']: await import('./common/dtos/date-for-report-dto.dto'),
    };
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./entities/access-token.entity'),
                    {
                        AccessToken: {
                            id: { required: true, type: () => Number },
                            token: { required: true, type: () => String },
                            userId: { required: true, type: () => String },
                            schoolId: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            expirationDate: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/school.entity'),
                    {
                        School: {
                            id: { required: true, type: () => Number },
                            code: { required: true, type: () => Number },
                            name: { required: true, type: () => String },
                            classes: { required: true, type: () => [t['./entities/classes.entity'].Classes] },
                            studyGroups: {
                                required: true,
                                type: () => [t['./entities/study-group.entity'].StudyGroup],
                            },
                            userSchool: { required: true, type: () => [t['./entities/user-school.entity'].UserSchool] },
                            goodPoints: { required: true, type: () => [t['./entities/good-point.entity'].GoodPoint] },
                            presetMessages: {
                                required: true,
                                type: () => [t['./entities/preset-messages.entity'].PresetMessages],
                            },
                            archivedGoodPoints: {
                                required: true,
                                type: () => [t['./entities/archived-good-point.entity'].ArchivedGoodPoint],
                            },
                            sms: { required: true, type: () => [t['./entities/sms.entity'].Sms] },
                            created: { required: true, type: () => Date },
                            students: { required: true, type: () => [t['./entities/student.entity'].Student] },
                            removedPresetMessages: {
                                required: true,
                                type: () => [t['./entities/removed-preset-messages.entity'].RemovedPresetMessages],
                            },
                            gptTokenCount: { required: true, type: () => Number },
                            deletedAt: { required: false, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/teachers-good-points-reaction.entity'),
                    {
                        TeachersGoodPointsReaction: {
                            id: { required: true, type: () => Number },
                            emoji: { required: true, enum: t['./common/enums/emojis-enum.enum'].Emojis },
                            teachersGoodPoint: {
                                required: true,
                                type: () => t['./entities/teachers-good-points.entity'].TeachersGoodPoints,
                            },
                            created: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/teachers-good-points.entity'),
                    {
                        TeachersGoodPoints: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            gpText: { required: true, type: () => String },
                            gpLinkHash: { required: true, type: () => String },
                            isRead: { required: true, type: () => Number },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            sender: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            senderId: { required: true, type: () => String },
                            receiver: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            receiverId: { required: true, type: () => String },
                            reaction: {
                                required: true,
                                type: () =>
                                    t['./entities/teachers-good-points-reaction.entity'].TeachersGoodPointsReaction,
                            },
                        },
                    },
                ],
                [
                    import('./entities/study-groups-grades.entity'),
                    {
                        StudyGroupGrades: {
                            grade: { required: true, enum: t['./common/enums/school-grades.enum'].SchoolGrades },
                            studyGroup: { required: true, type: () => t['./entities/study-group.entity'].StudyGroup },
                            studyGroupId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./entities/study-group.entity'),
                    {
                        StudyGroup: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            name: { required: true, type: () => String },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            teacher: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            teacherId: { required: true, type: () => String },
                            students: { required: true, type: () => [t['./entities/student.entity'].Student] },
                            starredBy: { required: true, type: () => [t['./entities/staff.entity'].Staff] },
                            classes: { required: true, type: () => [t['./entities/classes.entity'].Classes] },
                            studyGroupGrades: {
                                required: true,
                                type: () => [t['./entities/study-groups-grades.entity'].StudyGroupGrades],
                            },
                            grades: {
                                required: true,
                                enum: t['./common/enums/school-grades.enum'].SchoolGrades,
                                isArray: true,
                            },
                        },
                    },
                ],
                [
                    import('./entities/starred-user-class.entity'),
                    {
                        StarredUserClasses: {
                            user: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            userId: { required: true, type: () => String },
                            classroom: { required: true, type: () => t['./entities/classes.entity'].Classes },
                            classId: { required: true, type: () => Number },
                            deletedAt: { required: false, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/staff.entity'),
                    {
                        Staff: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                            phoneNumber: { required: true, type: () => String },
                            notifyDate: { required: true, type: () => Date },
                            preferences: { required: true, type: () => String },
                            preferredLanguage: { required: true, enum: t['./common/enums/language.enum'].Language },
                            systemNotifications: { required: true, type: () => Boolean },
                            emailVerified: { required: true, type: () => Number },
                            verificationToken: { required: true, type: () => String },
                            schools: { required: true, type: () => [t['./entities/user-school.entity'].UserSchool] },
                            studentsGoodPoints: {
                                required: true,
                                type: () => [t['./entities/good-point.entity'].GoodPoint],
                            },
                            presetMessages: {
                                required: true,
                                type: () => [t['./entities/preset-messages.entity'].PresetMessages],
                            },
                            classes: { required: true, type: () => [t['./entities/classes.entity'].Classes] },
                            archivedGoodPoints: {
                                required: true,
                                type: () => [t['./entities/archived-good-point.entity'].ArchivedGoodPoint],
                            },
                            removedPresetMessages: {
                                required: true,
                                type: () => [t['./entities/removed-preset-messages.entity'].RemovedPresetMessages],
                            },
                            starredUserClasses: {
                                required: true,
                                type: () => [t['./entities/starred-user-class.entity'].StarredUserClasses],
                            },
                            receivedTeacherGoodPoints: {
                                required: true,
                                type: () => [t['./entities/teachers-good-points.entity'].TeachersGoodPoints],
                            },
                            sentTeacherGoodPoints: {
                                required: true,
                                type: () => [t['./entities/teachers-good-points.entity'].TeachersGoodPoints],
                            },
                            studyGroups: {
                                required: true,
                                type: () => [t['./entities/study-group.entity'].StudyGroup],
                            },
                            starredStudyGroups: {
                                required: true,
                                type: () => [t['./entities/study-group.entity'].StudyGroup],
                            },
                            superAdminActions: {
                                required: true,
                                type: () => [t['./entities/admin-actions.entity'].AdminActions],
                            },
                            deletedAt: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/admin-actions.entity'),
                    {
                        AdminActions: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            actionType: {
                                required: true,
                                type: () => String,
                                enum: t['./common/enums/super-admin-actions.enum'].SuperAdminActions,
                            },
                            operatingAdmin: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            operatingAdminId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./entities/archived-good-point.entity'),
                    {
                        ArchivedGoodPoint: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            gpText: { required: true, type: () => String },
                            teacher: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            teacherId: { required: true, type: () => String },
                            student: { required: true, type: () => t['./entities/student.entity'].Student },
                            studentId: { required: true, type: () => Number },
                            dateSent: { required: true, type: () => Date },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            viewCount: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./entities/classes.entity'),
                    {
                        Classes: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            grade: { required: true, enum: t['./common/enums/school-grades.enum'].SchoolGrades },
                            classIndex: { required: true, type: () => Number },
                            teacher: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            teacherId: { required: true, type: () => String },
                            schoolCode: { required: true, type: () => String },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            students: { required: true, type: () => [t['./entities/student.entity'].Student] },
                            starredUserClasses: {
                                required: true,
                                type: () => [t['./entities/starred-user-class.entity'].StarredUserClasses],
                            },
                        },
                    },
                ],
                [
                    import('./entities/good-point.entity'),
                    {
                        GoodPoint: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            gpText: { required: true, type: () => String },
                            gpLinkHash: { required: true, type: () => String },
                            viewCount: { required: true, type: () => Number },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            teacher: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            teacherId: { required: true, type: () => String },
                            student: { required: true, type: () => t['./entities/student.entity'].Student },
                            studentId: { required: true, type: () => Number },
                            reactions: {
                                required: true,
                                type: () => [t['./entities/good-point-reaction.entity'].GoodPointReaction],
                            },
                        },
                    },
                ],
                [
                    import('./entities/good-point-reaction.entity'),
                    {
                        GoodPointReaction: {
                            id: { required: true, type: () => Number },
                            goodPoint: { required: true, type: () => t['./entities/good-point.entity'].GoodPoint },
                            goodPointId: { required: true, type: () => Number },
                            reaction: { required: true, enum: t['./common/enums/emojis-enum.enum'].Emojis },
                            sender: { required: true, type: () => String },
                            created: { required: true, type: () => Date },
                        },
                    },
                ],
                [
                    import('./entities/good-points-preset.entity'),
                    {
                        GoodPointsPreset: {
                            goodpointId: { required: true, type: () => Number },
                            presetMessageId: { required: true, type: () => Number },
                            schoolId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./entities/student.entity'),
                    {
                        Student: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            class: { required: true, type: () => t['./entities/classes.entity'].Classes },
                            classId: { required: true, type: () => Number },
                            gpCount: { required: true, type: () => Number },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                            phoneNumber1: { required: true, type: () => String },
                            phoneNumber2: { required: true, type: () => String },
                            phoneNumber3: { required: true, type: () => String },
                            phoneNumber4: { required: true, type: () => String },
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            goodPoint: { required: true, type: () => [t['./entities/good-point.entity'].GoodPoint] },
                            archivedGoodPoints: {
                                required: true,
                                type: () => [t['./entities/archived-good-point.entity'].ArchivedGoodPoint],
                            },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            studyGroups: {
                                required: true,
                                type: () => [t['./entities/study-group.entity'].StudyGroup],
                            },
                            relativesPhoneNumbers: {
                                required: true,
                                type: () => [t['./entities/parent-phone.entity'].ParentPhone],
                            },
                            phoneNumber: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./entities/parent-phone.entity'),
                    {
                        ParentPhone: {
                            student: { required: true, type: () => t['./entities/student.entity'].Student },
                            studentId: { required: true, type: () => Number },
                            phone: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./entities/preset-messages.entity'),
                    {
                        PresetMessages: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            modified: { required: true, type: () => Date },
                            text: { required: true, type: () => String },
                            presetCategory: {
                                required: true,
                                enum: t['./common/enums/preset-category.enum'].PresetCategory,
                            },
                            creator: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            creatorId: { required: true, type: () => String },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                            lang: { required: true, enum: t['./common/enums/language.enum'].Language },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            removedPresetMessages: {
                                required: true,
                                type: () => [t['./entities/removed-preset-messages.entity'].RemovedPresetMessages],
                            },
                        },
                    },
                ],
                [
                    import('./entities/removed-preset-messages.entity'),
                    {
                        RemovedPresetMessages: {
                            id: { required: true, type: () => Number },
                            created: { required: true, type: () => Date },
                            presetMessage: {
                                required: true,
                                type: () => t['./entities/preset-messages.entity'].PresetMessages,
                            },
                            presetMessageId: { required: true, type: () => Number },
                            teacher: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            teacherId: { required: true, type: () => String },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./entities/sms.entity'),
                    {
                        Sms: {
                            id: { required: true, type: () => Number },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            text: { required: true, type: () => String },
                            parts: { required: true, type: () => Number },
                            status: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./entities/user-school.entity'),
                    {
                        UserSchool: {
                            user: { required: true, type: () => t['./entities/staff.entity'].Staff },
                            userId: { required: true, type: () => String },
                            school: { required: true, type: () => t['./entities/school.entity'].School },
                            schoolId: { required: true, type: () => Number },
                            role: { required: true, type: () => t['@hilma/auth-nest/dist/role/role.entity'].Role },
                            roleId: { required: true, type: () => Number },
                            deletedAt: { required: false, type: () => Date },
                        },
                    },
                ],
                [
                    import('./common/dtos/add-a-pm-dto.dto'),
                    {
                        AddAPMDTO: {
                            presetCategory: {
                                required: true,
                                enum: t['./common/enums/preset-category.enum'].PresetCategory,
                            },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                        },
                    },
                ],
                [
                    import('./common/dtos/admin-fetch-classes-query.dto'),
                    {
                        AdminFetchClassesQuery: {
                            grade: { required: true, type: () => Object },
                            cIndex: { required: true, type: () => String },
                            tName: { required: true, type: () => String },
                            fetchedClasses: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/admin-gp-fetch-dto.dto'),
                    { AdminGPsFetchDTO: { gpIds: { required: true, type: () => [String], nullable: true } } },
                ],
                [
                    import('./common/dtos/admin-gp-fetch-order-dto.dto'),
                    {
                        AdminGpsFetchQueryDto: {
                            order: {
                                required: true,
                                enum: t['./common/enums/admin-gps-fetch-order'].AdminGPsFetchEnum,
                            },
                            gpIds: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/admin-add-or-edit-class-form-dto.dto'),
                    {
                        AdminAddOrEditClassFormDto: {
                            grade: { required: true, enum: t['./common/enums/school-grades.enum'].SchoolGrades },
                            classIndex: { required: true, type: () => Number, minimum: 1, maximum: 15 },
                            teacherId: { required: false, type: () => String },
                            id: { required: false, type: () => Number },
                        },
                    },
                ],
                [
                    import('./common/dtos/delete-personal-preset-message-dto.dto'),
                    { DeletePMDDTO: { pmId: { required: true, type: () => Number } } },
                ],
                [
                    import('./common/dtos/delete-teacher-dto.dto'),
                    { DeleteTeacherDto: { teacherId: { required: true, type: () => String } } },
                ],
                [import('./common/dtos/home-teacher-dto.dto'), { HomeTeacherDto: {} }],
                [
                    import('./common/dtos/upload-pm-excel-dto.dto'),
                    {
                        UploadPMExcelDto: {
                            sheets: { required: true, type: () => [t['./common/dtos/add-a-pm-dto.dto'].AddAPMDTO] },
                        },
                    },
                ],
                [
                    import('./common/dtos/save-gp-dto.dto'),
                    {
                        SaveGpDto: {
                            studentId: { required: true, type: () => Number },
                            gpText: { required: true, type: () => String, minLength: 0, maxLength: 1024 },
                            openSentenceId: { required: false, type: () => Number },
                        },
                    },
                ],
                [
                    import('./common/dtos/get-students-by-class-dto.dto'),
                    {
                        StudentByClassParams: {
                            classIndex: { required: true, type: () => Number },
                            grade: { required: true, enum: t['./common/enums/school-grades.enum'].SchoolGrades },
                        },
                    },
                ],
                [
                    import('./common/dtos/date-for-report-dto.dto'),
                    {
                        DateForReportDto: {
                            from: { required: true, type: () => String },
                            to: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/create-students-report-dto.dto'),
                    {
                        CreateStudentsReportDto: {
                            email: { required: true, type: () => String },
                            classId: { required: true, type: () => Number },
                            studentsIds: { required: true, type: () => [Number] },
                            dates: {
                                required: true,
                                type: () => t['./common/dtos/date-for-report-dto.dto'].DateForReportDto,
                            },
                            allStudents: { required: true, type: () => Boolean },
                        },
                    },
                ],
                [
                    import('./common/dtos/admin-table.dto'),
                    {
                        AdminTableDto: {
                            selected: { required: true, type: () => [String] },
                            params: { required: true },
                        },
                    },
                ],
                [
                    import('./common/dtos/save-student-dto.dto'),
                    {
                        SaveStudentDto: {
                            id: { required: true, type: () => Number },
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            grade: { required: false, type: () => Object },
                            classIndex: { required: false, type: () => String },
                            gender: { required: false, enum: t['./common/enums/gender.enum'].Gender },
                            phoneNumber: {
                                required: false,
                                type: () => String,
                                pattern: '/^(\\+\\d{1,3}[- ]?)?\\d{10}$/',
                            },
                            relativesPhoneNumbers: { required: true, type: () => [String] },
                        },
                    },
                ],
                [
                    import('./common/dtos/save-gp-taechers-dto.dto'),
                    {
                        SaveGpTeachersDto: {
                            receiverId: { required: true, type: () => String },
                            gpText: { required: true, type: () => String, minLength: 0, maxLength: 1024 },
                        },
                    },
                ],
                [
                    import('./common/dtos/admin-add-or-edit-study-groups.dto'),
                    {
                        AdminAddOrEditStudyGroupDto: {
                            id: { required: false, type: () => Number },
                            teacherId: { required: false, type: () => String },
                            name: { required: true, type: () => String },
                            studyGroupGrades: {
                                required: true,
                                type: () => [t['./entities/study-groups-grades.entity'].StudyGroupGrades],
                            },
                        },
                    },
                ],
                [
                    import('./common/dtos/add-admin.dto'),
                    {
                        AddAdminDto: {
                            username: { required: true, type: () => String },
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                            schoolId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./common/dtos/teachers-details-dto.dto'),
                    {
                        TeacherDetailsDto: {
                            firstName: { required: true, type: () => String, minLength: 2, maxLength: 50 },
                            lastName: { required: true, type: () => String, minLength: 2, maxLength: 50 },
                            phoneNumber: { required: true, type: () => String, minLength: 0, maxLength: 10 },
                            username: { required: true, type: () => String },
                            systemNotifications: { required: true, type: () => Boolean },
                            languagesToggle: { required: true, enum: t['./common/enums/language.enum'].Language },
                        },
                    },
                ],
                [
                    import('./common/dtos/change-password-dto.dto'),
                    {
                        ChangePasswordDto: {
                            currentPassword: { required: true, type: () => String },
                            password: {
                                required: true,
                                type: () => String,
                                minLength: 8,
                                pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])',
                            },
                        },
                    },
                ],
                [
                    import('./common/dtos/connect-class-to-user.dto'),
                    {
                        ConnectClassToUserDto: {
                            classId: { required: true, type: () => Number },
                            action: { required: true, type: () => Object },
                        },
                    },
                ],
                [
                    import('./common/dtos/get-student-teachers-query-dto.dto'),
                    {
                        PaginationQueryDto: {
                            pageNumber: { required: true, type: () => Number },
                            perPage: { required: true, type: () => Number },
                            filterName: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/new-password-dto.dto'),
                    {
                        NewPasswordDto: {
                            email: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            token: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/create-class-report.dto'),
                    {
                        CreateClassReportDto: {
                            classId: { required: true, type: () => Number },
                            dates: {
                                required: true,
                                type: () => t['./common/dtos/date-for-report-dto.dto'].DateForReportDto,
                            },
                        },
                    },
                ],
                [
                    import('./common/dtos/edit-pm.dto'),
                    {
                        EditPmDto: {
                            id: { required: true, type: () => Number },
                            presetCategory: {
                                required: true,
                                enum: t['./common/enums/preset-category.enum'].PresetCategory,
                            },
                            gender: { required: true, enum: t['./common/enums/gender.enum'].Gender },
                        },
                    },
                ],
                [
                    import('./common/dtos/send-reactiom.dto'),
                    {
                        AddTeacherReactionDto: {
                            gpId: { required: true, type: () => Number },
                            reaction: { required: true, enum: t['./common/enums/emojis-enum.enum'].Emojis },
                        },
                        SendReactionDto: { sender: { required: true, type: () => String } },
                    },
                ],
                [
                    import('./common/dtos/get-student-teachers-admin-tabledto.dto'),
                    {
                        PaginationAdminTableDto: {
                            pageNumber: { required: true, type: () => Number },
                            perPage: { required: true, type: () => Number },
                            q: { required: true, type: () => String },
                            grade: { required: false, type: () => [String] },
                        },
                    },
                ],
                [
                    import('./school/utils/dtos/create-school-dto.dto'),
                    {
                        CreateSchoolDto: {
                            code: { required: true, type: () => String, pattern: '/^[0-9]{6}$/' },
                            name: { required: true, type: () => String, pattern: '/^[\u05D0-\u05EA 0-9 "\']{0,30}$/' },
                        },
                    },
                ],
                [
                    import('./school/utils/dtos/update-school-dto.dto'),
                    { UpdateSchoolDto: { id: { required: true, type: () => Number } } },
                ],
                [
                    import('./common/dtos/delete-good-point.dto'),
                    {
                        DeleteGoodPointsDto: {
                            all: { required: true, type: () => Boolean },
                            selected: { required: true, type: () => [String] },
                            studentId: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/save-group-gp-dto.dto'),
                    {
                        SaveGroupGpDto: {
                            studentIds: { required: true, type: () => [Number] },
                            gpText: { required: true, type: () => String, minLength: 0, maxLength: 1024 },
                        },
                    },
                ],
                [
                    import('./admin/utils/dtos/createAdminDto.dto'),
                    {
                        CreateAdminDto: {
                            username: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                            schoolId: { required: true, type: () => Number },
                        },
                    },
                ],
                [
                    import('./super-admin/utils/dtos/createSuperAdminDto.dto'),
                    {
                        CreateSuperAdminDto: {
                            username: { required: true, type: () => String },
                            password: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./common/dtos/student-dto.dto'),
                    {
                        StudentDto: {
                            firstName: { required: true, type: () => String },
                            lastName: { required: true, type: () => String },
                            ageGroup: { required: true, type: () => String },
                            classId: { required: false, type: () => Number },
                            gender: { required: false, enum: t['./common/enums/gender.enum'].Gender },
                            phoneNumber1: {
                                required: false,
                                type: () => String,
                                pattern: '/^(\\+\\d{1,3}[- ]?)?\\d{10}$/',
                            },
                            phoneNumber2: {
                                required: true,
                                type: () => String,
                                pattern: '/^(\\+\\d{1,3}[- ]?)?\\d{10}$/',
                            },
                            phoneNumber3: {
                                required: false,
                                type: () => String,
                                pattern: '/^(\\+\\d{1,3}[- ]?)?\\d{10}$/',
                            },
                        },
                    },
                ],
            ],
            controllers: [
                [import('./app.controller'), { AppController: { addEmailToSpam: {}, addSmsToSpam: {} } }],
                [
                    import('./staff/staff.controller'),
                    {
                        StaffController: {
                            login: {},
                            loginToDifferentSchool: {},
                            logout: {},
                            getFullName: {},
                            isFirstLogin: { type: Object },
                            isFirstAdminLogin: { type: Object },
                            adminGetTeachers: { type: [Object] },
                            getTeachersOfSchool: { type: [t['./entities/staff.entity'].Staff] },
                            getTeacherById: { type: t['./entities/staff.entity'].Staff },
                            deleteTeacher: {},
                            DeleteStudentsById: {},
                            getTeachers: { type: [t['./entities/staff.entity'].Staff] },
                            getAdminTeachers: {},
                            getUserDataForContext: {},
                            connectClassToUser: { type: Boolean },
                            removeStudyGroupFromUser: { type: Boolean },
                            updateSystemNotifications: {},
                            updateDetails: {},
                            updatePreferredLanguage: {},
                            getTeacherActivity: { type: [t['./entities/good-point.entity'].GoodPoint] },
                            getTeacherActivityTeachers: {
                                type: [t['./entities/teachers-good-points.entity'].TeachersGoodPoints],
                            },
                            passwordReset: { type: t['./entities/staff.entity'].Staff },
                            saveNewPassword: { type: Object },
                            changePassword: {},
                            addTeacher: {},
                            addAdmin: {},
                            deleteAdmin: { type: String },
                            addTeachersExcel: {},
                            resetPasswordByAdmin: {},
                            editTeacherByAdmin: {},
                            createTeacherReportXlsx: {},
                        },
                    },
                ],
                [
                    import('./classes/classes.controller'),
                    {
                        ClassesController: {
                            getClassesOfSchool: { type: [t['./entities/classes.entity'].Classes] },
                            getClassesOfSchoolAdmin: {},
                            getClassDetails: {},
                            adminAddClasses: {},
                            adminAddClassForm: { type: Object },
                            createStudentsReportXlsx: {},
                            assignHomeTeacher: {},
                            getAllSchoolClasses: {},
                            getPopulatedSchoolClasses: { type: [t['./entities/classes.entity'].Classes] },
                            deleteAdminClasses: {},
                            addClassesExcel: {},
                        },
                    },
                ],
                [
                    import('./student/student.controller'),
                    {
                        StudentController: {
                            getStudentById: { type: t['./entities/student.entity'].Student },
                            getStudentsByClass: { type: [t['./entities/student.entity'].Student] },
                            getStudentsByStudyGroup: { type: [t['./entities/student.entity'].Student] },
                            getStudentsByGrades: {},
                            getStudentsIdsOfStudyGroup: { type: [Number] },
                            getAdminStudentsByStudyGroup: {},
                            getAdminStudentByClass: {},
                            addStudents: {},
                            editStudents: { type: t['./entities/student.entity'].Student },
                            DeleteStudentsById: { type: Object },
                            moveStudentsById: { type: Object },
                            studentsByClassId: { type: [t['./entities/student.entity'].Student] },
                            createStudentsReportXlsx: {},
                            createStudentsReportPdf: {},
                            addStudentsExcel: {},
                        },
                    },
                ],
                [
                    import('./preset-messages/preset-messages.controller'),
                    {
                        PresetMessagesController: {
                            getMyPresetMessages: { type: [t['./entities/preset-messages.entity'].PresetMessages] },
                            getAdminPresetMessages: { type: [Object] },
                            getSystemPresetMessagesList: {
                                type: [t['./entities/preset-messages.entity'].PresetMessages],
                            },
                            addPresetMessage: { type: Object },
                            addSchoolPM: { type: Object },
                            addSystemPresetMessage: { type: t['./entities/preset-messages.entity'].PresetMessages },
                            addAdminPM: { type: t['./entities/preset-messages.entity'].PresetMessages },
                            getSchoolPM: { type: [Object] },
                            deletePersonalPresetMessage: { type: Object },
                            deleteSystemPM: {},
                            deleteSchoolPM: {},
                            deleteAdminPms: {},
                            editSchoolPM: { type: Object },
                            editAdminPM: { type: Object },
                            addPMExcel: {},
                        },
                    },
                ],
                [
                    import('./teachers-good-points/teachers-good-points.controller'),
                    {
                        TeachersGoodPointsController: {
                            getGPByteacherId: { type: [Object] },
                            getCountGpNotViewByteacherId: { type: Number },
                            saveGpTeachers: { type: Object },
                            getReceivedGPs: { type: [t['./entities/teachers-good-points.entity'].TeachersGoodPoints] },
                            addReaction: { type: Object },
                        },
                    },
                ],
                [
                    import('./school/school.controller'),
                    {
                        SchoolController: {
                            addSchool: { type: t['./entities/school.entity'].School },
                            getAllSchools: { type: [Object] },
                            updateSchool: { type: Object },
                            getStudentsOfSchool: {},
                            getAdminStudentPaginated: {},
                            deleteSchool: { type: Number },
                            getSchoolInfo: {},
                            getSchoolsAdminTable: { type: [Object] },
                        },
                    },
                ],
                [
                    import('./study-group/study-group.controller'),
                    {
                        StudyGroupController: {
                            getAllSchoolClasses: { type: [t['./entities/study-group.entity'].StudyGroup] },
                            getAdminStudyGroups: {},
                            getStudyGroupDetails: {},
                            addOrEditStudyGroup: { type: Object },
                            addStudentsToStudyGroup: { type: t['./entities/study-group.entity'].StudyGroup },
                            getAllStudyGroupsGrades: {},
                            deleteAdminStudyGroups: {},
                        },
                    },
                ],
                [
                    import('./good-point/good-point.controller'),
                    {
                        GoodPointController: {
                            adminGPsFetch: { type: [Object] },
                            getGPByStudentId: { type: [Object] },
                            saveGp: { type: Object },
                            saveGroupGp: { type: [Object] },
                            getGpByLink: { type: t['./entities/good-point.entity'].GoodPoint },
                            getStudentGps: { type: [t['./entities/good-point.entity'].GoodPoint] },
                            getTeachersGps: { type: [t['./entities/good-point.entity'].GoodPoint] },
                            DeleteGoodPintsById: { type: Object },
                            getTeacherSentGps: { type: [t['./entities/good-point.entity'].GoodPoint] },
                        },
                    },
                ],
                [
                    import('./good-points-reactions/good-points-reactions.controller'),
                    { GoodPointsReactionsController: { sendReaction: { type: Object } } },
                ],
                [import('./admin/admin.controller'), { AdminController: { moveYear: {} } }],
            ],
        },
    };
};
