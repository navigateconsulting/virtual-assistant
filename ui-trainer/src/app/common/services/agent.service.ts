import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Agent } from '../models/agent';
import { AGENTS } from '../mock-data/mock-agents';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor() { }

  getAgents(): Observable<Agent[]> {
    return of(AGENTS);
  }

  getAgent(id: number): Observable<Agent> {
    return of(AGENTS.find(agent => agent.agent_id === id));
  }
}
