import {
    AfterLoad,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Classes, School, Staff, Student } from '.';
import { StudyGroupGrades } from './study-groups-grades.entity';
import { SchoolGrades } from 'src/common/enums';

@Entity('study_group')
export class StudyGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @ManyToOne(() => School, (school) => school.studyGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @ManyToOne(() => Staff, (teacher) => teacher.studyGroups)
    @JoinColumn({ name: 'teacher_id' })
    teacher: Staff; // "home teacher" of the study group

    @Column({ name: 'teacher_id', nullable: true })
    teacherId: string;

    @ManyToMany(() => Student, (student) => student.studyGroups)
    @JoinTable({ name: 'student_in_study_group' })
    students: Student[];

    @ManyToMany(() => Staff, (teacher) => teacher.starredStudyGroups)
    starredBy: Staff[]; // teachers who starred this study-group

    classes: Classes[]; //virtual column to ease inserting query data

    @OneToMany(() => StudyGroupGrades, (studyGroupGrades) => studyGroupGrades.studyGroup, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    studyGroupGrades: StudyGroupGrades[];

    grades: SchoolGrades[];

    @AfterLoad()
    populateGrades() {
        if (this.studyGroupGrades) {
            this.grades = this.studyGroupGrades.map((studyGroupGrade) => studyGroupGrade.grade); // Assign the grade to the grades property
        }
    }
}
