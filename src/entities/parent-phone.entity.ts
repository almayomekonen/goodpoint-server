import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Student } from './student.entity';

@Entity()
export class ParentPhone {
    @ManyToOne(() => Student, (s) => s.relativesPhoneNumbers, { orphanedRowAction: 'delete', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @PrimaryColumn({ name: 'student_id' })
    studentId: Student['id'];

    @PrimaryColumn({ type: 'varchar', length: 14 })
    phone: string;
}
