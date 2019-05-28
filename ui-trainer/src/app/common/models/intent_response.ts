import { Entity } from './entity';

export class IntentResponse {
    key: string;
    value: string;
    type: string;
    entities: Entity[];
}
