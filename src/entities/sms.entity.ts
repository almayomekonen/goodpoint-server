import { School } from 'src/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms')
export class Sms {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => School, (school) => school.sms, { nullable: true, onDelete: 'CASCADE' })
    // @JoinColumn()
    school: School;

    @Column({ type: 'varchar', length: 255 })
    text: string;

    @Column({ type: 'tinyint', unsigned: true })
    parts: number;

    @Column({ type: 'tinyint' })
    status: number;
}
