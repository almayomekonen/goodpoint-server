import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Emojis } from 'src/common/enums/emojis-enum.enum';
import { GoodPointReaction } from 'src/entities/good-point-reaction.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class GoodPointsReactionsService {
    constructor(@InjectRepository(GoodPointReaction) private reactionsRepository: Repository<GoodPointReaction>) {}

    /**
     * @param sender - the person who sent the reaction
     * @param reaction - the reaction emoji
     * @param gpId - the id of the good point
     * @returns the reaction that was created or updated
     */
    async upsertReaction(sender: string, reaction: Emojis, gpId: number) {
        return this.reactionsRepository
            .upsert(
                { sender: sender, goodPointId: gpId, reaction: reaction },
                { conflictPaths: ['sender', 'goodPointId'] },
            )
            .catch((err: QueryFailedError) => {
                if (err.message == 'Cannot update entity because entity id is not set in the entity.') {
                    //an error occurs whenever the reaction inserted is exactly the same as the one that already exists
                    //then do nothing...
                    return null;
                } else {
                    //some other non related error
                    throw err;
                }
            });
    }
}
