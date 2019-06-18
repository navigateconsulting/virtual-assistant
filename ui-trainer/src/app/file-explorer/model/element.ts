export class FileElement {
    id?: string;
    oid?: string;
    project_id?: number;
    domain_id?: number;
    intent_id?: number;
    story_id?: number;
    response_id?: number;
    isFolder: boolean;
    name: string;
    description?: string;
    parent: string;
    type: string;
}
