import { School, Staff, Student } from 'src/entities';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { GoodPointReaction } from './good-point-reaction.entity';

@Entity('good_points')
export class GoodPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ type: 'varchar', length: 500, nullable: false, name: 'text' })
    gpText: string;

    @Column({ type: 'varchar', length: 100, name: 'gp_link_hash', nullable: true, unique: true })
    gpLinkHash: string;

    @Column({ name: 'view_count', nullable: true, type: 'tinyint', unsigned: true, default: 0 })
    viewCount: number;

    @ManyToOne(() => School, (school) => school.goodPoints, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @ManyToOne(() => Staff, (teacher) => teacher.studentsGoodPoints, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'teacher_id' })
    teacher: Staff;

    @Column({ name: 'teacher_id', type: 'varchar', length: 36, nullable: true })
    teacherId: string;

    @ManyToOne(() => Student, (student) => student.goodPoint, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'student_id', nullable: true })
    studentId: number;

    @OneToMany(() => GoodPointReaction, (gpReaction) => gpReaction.goodPoint)
    reactions: GoodPointReaction[];
}
