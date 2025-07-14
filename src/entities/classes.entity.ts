import { SchoolGrades } from 'src/common/enums';
import { School, Staff, Student } from 'src/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { StarredUserClasses } from './starred-user-class.entity';

@Entity('classes')
@Unique(['classIndex', 'grade', 'schoolId'])
export class Classes {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ nullable: false, type: 'enum', enum: SchoolGrades })
    grade: SchoolGrades;

    @Column({ nullable: false, type: 'tinyint', name: 'class_index' })
    classIndex: number;

    @ManyToOne(() => Staff, (teacher) => teacher.classes, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'teacher_id' })
    teacher: Staff;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'teacher_id' })
    teacherId: string;

    @Column({ type: 'varchar', length: 14, nullable: true, name: 'school_code' })
    schoolCode: string;

    @ManyToOne(() => School, (school) => school.classes)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @OneToMany(() => Student, (students) => students.class)
    students: Student[];

    @OneToMany(() => StarredUserClasses, (userClasses) => userClasses.classroom)
    starredUserClasses: StarredUserClasses[];
}
