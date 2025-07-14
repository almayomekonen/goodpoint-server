import { User } from '@hilma/auth-nest';
import { Gender, Language } from 'src/common/enums';
import {
    AdminActions,
    ArchivedGoodPoint,
    Classes,
    GoodPoint,
    PresetMessages,
    RemovedPresetMessages,
    UserSchool,
} from 'src/entities';
import { ChildEntity, Column, DeleteDateColumn, Index, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { StarredUserClasses } from './starred-user-class.entity';
import { StudyGroup } from './study-group.entity';
import { TeachersGoodPoints } from './teachers-good-points.entity';

@ChildEntity('staff')
export class Staff extends User {
    constructor(basicUser: Partial<User> = {}) {
        super(basicUser);
    }

    @Column({ nullable: true, name: 'first_name', type: 'varchar', length: 50 })
    firstName: string;
    @Column({ nullable: true, name: 'last_name', type: 'varchar', length: 50 })
    lastName: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    @Column({ type: 'varchar', length: 14, name: 'phone_number', nullable: false, default: '' })
    phoneNumber: string;

    /**
     * Good points that are sent from a teacher to a teacher are not sent in sms -
     * they are visible to the receiver-teacher in the app.
     * We save `isRead` for each teacher-good-point, and with a Cron service
     * (3 times a day: server/src/teachers-good-points/teachers-good-points.service.ts:85),
     * if a teacher hasn't read a gp that was sent to him - we send an sms notifying about the gp he didn't yet read.
     *
     * But to prevent spamming the teacher with tons of reminders *every* cron job, we remember the previous reminder date
     */
    @Index()
    @Column({ name: 'notify_date', nullable: true, type: 'datetime', default: null })
    notifyDate: Date;

    @Column({ type: 'varchar', length: 255, nullable: true, default: '{}' })
    preferences: string;

    @Column({ type: 'enum', enum: Language, default: Language.HEBREW })
    preferredLanguage: Language;

    @Column({ name: 'system_notifications', type: 'boolean', default: true })
    systemNotifications: boolean;

    @Column({ default: 1, type: 'tinyint' })
    emailVerified: number;

    @Column({ nullable: true, length: 150 })
    verificationToken: string;

    // user_school table
    @OneToMany(() => UserSchool, (userSchool) => userSchool.user, { cascade: true })
    schools: UserSchool[];

    @OneToMany(() => GoodPoint, (studentGoodPoints) => studentGoodPoints.teacher)
    studentsGoodPoints: GoodPoint[];

    @OneToMany(() => PresetMessages, (presetMessages) => presetMessages.creator)
    presetMessages: PresetMessages[];

    @OneToMany(() => Classes, (classes) => classes.teacher)
    classes: Classes[];

    // @OneToMany(() => File, (files) => files.owner)
    // files: File[];

    @OneToMany(() => ArchivedGoodPoint, (archivedGoodPoints) => archivedGoodPoints.teacher)
    archivedGoodPoints: ArchivedGoodPoint[];

    @OneToMany(() => RemovedPresetMessages, (removedPresetMessages) => removedPresetMessages.teacher)
    removedPresetMessages: RemovedPresetMessages[];

    // @ManyToMany(() => Classes, classes => classes.id)
    // @JoinTable({ name: "teacher_classes" })
    // classesId: Classes[]

    @OneToMany(() => StarredUserClasses, (classes) => classes.user, { onUpdate: 'CASCADE' })
    starredUserClasses: StarredUserClasses[];

    @OneToMany(() => TeachersGoodPoints, (gp) => gp.receiver)
    receivedTeacherGoodPoints: TeachersGoodPoints[];

    @OneToMany(() => TeachersGoodPoints, (gp) => gp.sender)
    sentTeacherGoodPoints: TeachersGoodPoints[];

    @OneToMany(() => StudyGroup, (sg) => sg.teacher)
    studyGroups: StudyGroup[]; // study-groups the teacher is their "home teacher"

    @ManyToMany(() => StudyGroup, (studyGroup) => studyGroup.starredBy)
    @JoinTable({ name: 'teacher_starred_study_group' })
    starredStudyGroups: StudyGroup[]; // study-groups the teacher starred (bookmarked)

    @OneToMany(() => AdminActions, (as) => as.operatingAdmin)
    superAdminActions: AdminActions[];

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @Column({ type: 'varchar', length: '10', nullable: true })
    zehut: string;
}
