import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'access_token' })
export class AccessToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 600, name: 'token' })
    token: string;

    @Column({ type: 'varchar', length: 36, nullable: true, name: 'user_id' })
    userId: string;

    @Column({ name: 'school_id', nullable: true, default: null, type: 'int' })
    schoolId: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    // expiration date for the access token
    @Column({ type: 'datetime' })
    expirationDate: Date;
}
