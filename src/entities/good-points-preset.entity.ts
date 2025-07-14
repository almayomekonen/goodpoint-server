import { Entity, PrimaryColumn } from 'typeorm';

/**
 * An informational/statistical table that tells us for each gp, what preset message was used.
 */
@Entity('goodpoint_preset')
export class GoodPointsPreset {
    @PrimaryColumn({ name: 'goodpoint_id', type: 'int' })
    goodpointId: number;

    @PrimaryColumn({ name: 'preset_message_id', type: 'int' })
    presetMessageId: number;

    @PrimaryColumn({ name: 'school_id', type: 'int' })
    schoolId: number;
}
