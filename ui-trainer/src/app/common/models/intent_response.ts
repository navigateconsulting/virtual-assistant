import { Entity } from './entity';

export class IntentResponse {
    id: number;
    key: string;
    value: string;
    type: string;
    entities: Entity[];
}
