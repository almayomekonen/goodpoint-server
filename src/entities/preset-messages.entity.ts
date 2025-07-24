import { Gender, PresetCategory, Language } from 'src/common/enums';
import { School, Staff, RemovedPresetMessages } from 'src/entities/';
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

@Entity('preset_messages')
export class PresetMessages {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;

    @UpdateDateColumn({ nullable: true, type: 'datetime' })
    modified: Date;

    @Column({ type: 'varchar', length: 100 })
    text: string;

    @Column({
        name: 'preset_category',
        type: 'enum',
        enum: PresetCategory,
        nullable: false,
    })
    presetCategory: PresetCategory;

    @ManyToOne(() => Staff, (creator) => creator.presetMessages, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'creator_id' })
    creator: Staff;

    @Column({ name: 'creator_id', nullable: true, type: 'varchar', length: 36 })
    creatorId: string;

    @Column({ type: 'enum', enum: Gender })
    gender: Gender;

    @Column({ type: 'enum', enum: Language })
    lang: Language;

    @ManyToOne(() => School, (school) => school.presetMessages)
    @JoinColumn({ name: 'school_id' })
    school: School;

    @Column({ name: 'school_id', nullable: true })
    schoolId: number;

    // @OneToMany(
    //   () => GoodPointsPreset,
    //   (presetMessagesGoodPoints) => presetMessagesGoodPoints.presetMessage,
    // )
    // presetMessagesGoodPoints: GoodPointsPreset[];

    @OneToMany(() => RemovedPresetMessages, (removedPresetMessage) => removedPresetMessage.presetMessage)
    removedPresetMessages: RemovedPresetMessages[];
}
