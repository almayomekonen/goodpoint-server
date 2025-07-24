import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {
    Classes,
    GoodPoint,
    ArchivedGoodPoint,
    UserSchool,
    Sms,
    Student,
    PresetMessages,
    StudyGroup,
    RemovedPresetMessages,
} from 'src/entities';

@Entity('school')
export class School {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    code: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @OneToMany(() => Classes, (classes) => classes.school)
    classes: Classes[];

    @OneToMany(() => StudyGroup, (studyGroup) => studyGroup.school)
    studyGroups: StudyGroup[];

    @OneToMany(() => UserSchool, (userSchool) => userSchool.school)
    userSchool: UserSchool[];

    @OneToMany(() => GoodPoint, (goodPoints) => goodPoints.school)
    goodPoints: GoodPoint[];

    @OneToMany(() => PresetMessages, (presetMessages) => presetMessages.school)
    presetMessages: PresetMessages[];

    // @OneToMany(
    //   () => GoodPointsPreset,
    //   (presetMessagesGoodPoints) => presetMessagesGoodPoints.school,
    // )
    // presetMessagesGoodPoints: GoodPointsPreset[];

    @OneToMany(() => ArchivedGoodPoint, (archivedGoodPoints) => archivedGoodPoints.school)
    archivedGoodPoints: ArchivedGoodPoint[];

    @OneToMany(() => Sms, (sms) => sms.school)
    sms: Sms[];

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @OneToOne(() => Student, (student) => student.school)
    students: Student[];

    @OneToMany(() => RemovedPresetMessages, (removedPresetMessages) => removedPresetMessages.school)
    removedPresetMessages: RemovedPresetMessages[];

    //counting gpt api token for each school

    @Column({ default: 0, name: 'gpt_token_count' })
    gptTokenCount: number;

    //soft delete column
    @DeleteDateColumn()
    deletedAt?: Date;
}
