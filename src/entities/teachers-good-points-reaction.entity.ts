import { Emojis } from 'src/common/enums/emojis-enum.enum';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TeachersGoodPoints } from './teachers-good-points.entity';

@Entity('teachers_good_points_reaction')
export class TeachersGoodPointsReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'reaction', type: 'enum', enum: Emojis })
    emoji: Emojis;

    @OneToOne(() => TeachersGoodPoints, (teachersGoodPoints) => teachersGoodPoints.reaction)
    teachersGoodPoint: TeachersGoodPoints;

    @CreateDateColumn({ name: 'created', type: 'datetime', nullable: true })
    created: Date;
}
