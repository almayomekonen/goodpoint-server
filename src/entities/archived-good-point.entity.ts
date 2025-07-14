import { School, Staff, Student } from 'src/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'archived_good_points' })
export class ArchivedGoodPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ type: 'varchar', length: 255, name: 'text', nullable: false })
    gpText: string;

    @ManyToOne(() => Staff, (teacher) => teacher.archivedGoodPoints, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'teacher_id' })
    teacher: Staff;

    @Column({ name: 'teacher_id', type: 'varchar', length: 36, nullable: true })
    teacherId: string;

    @ManyToOne(() => Student, (student) => student.archivedGoodPoints)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'student_id', nullable: true })
    studentId: number;

    @Column({ type: 'datetime', nullable: true, name: 'date_sent' })
    dateSent: Date;

    @ManyToOne(() => School, (school) => school.archivedGoodPoints, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @Column({ name: 'view_count', nullable: true, type: 'tinyint', unsigned: true, default: 0 })
    viewCount: number;
}
