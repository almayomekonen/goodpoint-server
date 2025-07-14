import { Role } from '@hilma/auth-nest';
import { School, Staff } from 'src/entities';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('user_school')
export class UserSchool {
    @ManyToOne(() => Staff, (user) => user.schools, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Staff;

    @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 36 })
    userId: string;

    @ManyToOne(() => School, (school) => school.userSchool, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @PrimaryColumn({ name: 'school_id', type: 'int' })
    schoolId: number;

    @ManyToOne(() => Role, (role) => role.id)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'int', nullable: false, name: 'role_id' })
    roleId: number;

    //soft delete column
    @DeleteDateColumn()
    deletedAt?: Date;
}
