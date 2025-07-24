import { SchoolGrades } from 'src/common/enums';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { StudyGroup } from './study-group.entity';

@Entity('study_group_grades')
export class StudyGroupGrades {
    @PrimaryColumn({ type: 'enum', enum: SchoolGrades })
    grade: SchoolGrades;

    @ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.studyGroupGrades, {
        orphanedRowAction: 'delete',
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'study_group_id' })
    studyGroup: StudyGroup;

    @PrimaryColumn({ name: 'study_group_id' })
    studyGroupId: string;
}
