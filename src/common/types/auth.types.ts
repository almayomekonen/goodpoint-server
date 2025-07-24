import { UserPassword } from 'src/entities/user-password.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// AccessLogger entity for compatibility
@Entity('access_logger')
export class AccessLogger {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 36 })
    userId: string;

    @Column({ type: 'varchar', length: 45 })
    ip: string;

    @Column({ type: 'text' })
    userAgent: string;

    @Column({ type: 'boolean' })
    success: boolean;

    @CreateDateColumn()
    createdAt: Date;
}

export class AccessLoggerService {
    async log(data: Partial<AccessLogger>): Promise<void> {
        console.log('Access logged:', data);
    }
}

export const VERIFICATION_TOKEN = 'verification_token';

export { UserPassword };
