import { SuperAdminActions } from 'src/common/enums/super-admin-actions.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from './staff.entity';

/**
 * This entity holds superadmin dangerous actions history.
 */
@Entity()
export class AdminActions {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'datetime', default: null })
    created: Date;

    @Column({ type: 'enum', enum: SuperAdminActions, name: 'action_type' })
    actionType: SuperAdminActions;

    @ManyToOne(() => Staff, (staff) => staff.superAdminActions)
    @JoinColumn({ name: 'operating_admin_id' })
    operatingAdmin: Staff;

    @Column({ name: 'operating_admin_id' })
    operatingAdminId: Staff['id'];
}
