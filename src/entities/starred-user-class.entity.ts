import { Classes, Staff } from 'src/entities';
import { DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('starred_user_class')
export class StarredUserClasses {
    @ManyToOne(() => Staff, (user) => user.classes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Staff;

    @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 36 })
    userId: string;

    @ManyToOne(() => Classes, (classroom) => classroom.starredUserClasses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'class_id' })
    classroom: Classes;

    @PrimaryColumn({ name: 'class_id', type: 'int' })
    classId: number;

    //soft delete column ???
    @DeleteDateColumn()
    deletedAt?: Date;
}
