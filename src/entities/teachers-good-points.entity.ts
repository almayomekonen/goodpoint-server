import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { School } from './school.entity';
import { Staff } from './staff.entity';
import { TeachersGoodPointsReaction } from './teachers-good-points-reaction.entity';

@Entity('teachers_good_points')
export class TeachersGoodPoints {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;
    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ type: 'varchar', length: 255, nullable: false, name: 'text' })
    gpText: string;

    @Column({
        type: 'varchar',
        length: 100,
        name: 'gp_link_hash',
        nullable: true,
    })
    gpLinkHash: string;

    @Index()
    @Column({ name: 'is_read', type: 'tinyint', unsigned: true, default: 0 })
    isRead: number;

    @ManyToOne(() => School, (school) => school.goodPoints, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    @ManyToOne(() => Staff, (teacher) => teacher.sentTeacherGoodPoints, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'sender_id' })
    sender: Staff;

    @Column({ name: 'sender_id', type: 'varchar', length: 36, nullable: true })
    senderId: string;

    @ManyToOne(() => Staff, (teacher) => teacher.receivedTeacherGoodPoints, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'receiver_id' })
    receiver: Staff;

    @Column({ name: 'receiver_id', nullable: true, type: 'varchar', length: 36 })
    receiverId: string;

    //the reaction of the receiver to the gp
    @OneToOne(() => TeachersGoodPointsReaction, (reaction) => reaction.teachersGoodPoint, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'reaction_id' })
    reaction: TeachersGoodPointsReaction;
}
