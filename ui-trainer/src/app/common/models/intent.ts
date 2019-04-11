import { Entity } from './entity';
import { Response } from './response';

export class Intent {
    intent_id: number;
    intent: string;
    intent_text: string;
    entities: Entity[];
    responses: Response[];
}
