import { Gender } from 'src/common/enums';
import { ArchivedGoodPoint, Classes, GoodPoint, ParentPhone, School, StudyGroup } from 'src/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
@Entity('students')
@Index(['firstName', 'lastName'], { fulltext: true })
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @ManyToOne(() => Classes, (studentClass) => studentClass.students, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'class_id' })
    class: Classes;

    @Column({ name: 'class_id', nullable: true })
    classId: number;

    @Column({ type: 'tinyint', name: 'gp_count', default: 0, nullable: true, unsigned: true })
    gpCount: number;
    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    // backward compatibility admin table old phone number fetching
    @Column({ type: 'varchar', length: 14, name: 'phone_number_1', nullable: true })
    phoneNumber1: string;

    @Column({ type: 'varchar', length: 14, name: 'phone_number_2', nullable: true })
    phoneNumber2: string;

    @Column({ type: 'varchar', length: 14, name: 'phone_number_3', nullable: true })
    phoneNumber3: string;

    @Column({ type: 'varchar', length: 14, name: 'phone_number_4', nullable: true })
    phoneNumber4: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'first_name' })
    firstName: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_name' })
    lastName: string;

    @OneToMany(() => GoodPoint, (teachersGoodPoints) => teachersGoodPoints.student)
    goodPoint: GoodPoint[];

    @OneToMany(() => ArchivedGoodPoint, (archivedGoodPoints) => archivedGoodPoints.student)
    archivedGoodPoints: ArchivedGoodPoint[];

    @ManyToOne(() => School, (school) => school.students)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @ManyToMany(() => StudyGroup, (studyGroup) => studyGroup.students, { onDelete: 'CASCADE' })
    studyGroups: StudyGroup[];

    @OneToMany(() => ParentPhone, (parent) => parent.student, { cascade: true })
    relativesPhoneNumbers: ParentPhone[];

    @Column({ type: 'varchar', length: 14, name: 'phone_number', nullable: true })
    phoneNumber: string;
}
