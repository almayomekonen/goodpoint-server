import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';
import { Role } from './role.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
    constructor(basicUser: Partial<User> = {}) {
        Object.assign(this, basicUser);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    username: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password?: string;

    @Column({ type: 'varchar', length: 255, default: 'user' })
    type: string;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_role',
        joinColumn: { name: 'user_id' },
        inverseJoinColumn: { name: 'role_id' },
    })
    roles: Role[];

    @CreateDateColumn({ name: 'created_at' })
    created: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated: Date;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'firebase_uid' })
    firebaseUid?: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }
}
