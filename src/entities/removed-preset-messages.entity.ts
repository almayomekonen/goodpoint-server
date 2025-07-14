import { PresetMessages, School, Staff } from 'src/entities';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('removed_preset_messages')
export class RemovedPresetMessages {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true })
    created: Date;

    @ManyToOne(() => PresetMessages, (presetMessage) => presetMessage.removedPresetMessages)
    @JoinColumn({ name: 'preset_message_id' })
    presetMessage: PresetMessages;

    @Column({ name: 'preset_message_id', nullable: true })
    presetMessageId: number;

    @ManyToOne(() => Staff, (teacher) => teacher.removedPresetMessages, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'teacher_id' })
    teacher: Staff;

    @Column({ name: 'teacher_id', type: 'varchar', length: 36, nullable: true })
    teacherId: string;

    @ManyToOne(() => School, (school) => school.removedPresetMessages, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;
}
