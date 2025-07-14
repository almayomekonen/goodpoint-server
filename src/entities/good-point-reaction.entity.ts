import { Emojis } from 'src/common/enums/emojis-enum.enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { GoodPoint } from './good-point.entity';

@Entity('good_point_reaction')
@Unique(['sender', 'goodPointId'])
export class GoodPointReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => GoodPoint, (gp) => gp.reactions)
    @JoinColumn({ name: 'good_point_id' })
    goodPoint: GoodPoint;

    @Column({ name: 'good_point_id', type: 'int' })
    goodPointId: number;

    @Column({ name: 'reaction', type: 'enum', enum: Emojis })
    reaction: Emojis;

    @Column({ name: 'sender' })
    sender: string;

    @CreateDateColumn({ nullable: true, type: 'datetime' })
    created: Date;
}
