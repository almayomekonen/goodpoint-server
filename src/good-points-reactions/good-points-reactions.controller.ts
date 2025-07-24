import { Body, Controller, Post } from '@nestjs/common';
import { GoodPointsReactionsService } from './good-points-reactions.service';
import { SendReactionDto } from 'src/common/dtos/send-reactiom.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Good Points Reactions')
@Controller('api/good-points-reactions')
export class GoodPointsReactionsController {
    constructor(private gpReactionService: GoodPointsReactionsService) {}

    @ApiOperation({ summary: 'sending Good Points Reactions' })
    @Post('send-reaction')
    async sendReaction(@Body() body: SendReactionDto) {
        return await this.gpReactionService.upsertReaction(body.sender, body.reaction, body.gpId);
    }
}
