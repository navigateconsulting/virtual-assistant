import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { SideDrawerService } from '../services/side-drawer.service';
import { AgentService } from '../services/agent.service';
import { Agent } from '../models/agent';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  setDrawerIcon: string;
  panelOpenState = false;
  agents: Agent[];
  agent: Agent;
  agent_id: number;
  role: string;
  agent_no: string;

  constructor(private sideDrawerService: SideDrawerService,
              private agentService: AgentService,
              private route: ActivatedRoute,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
    this.getAgents();
    this.route.params.subscribe(params => {
      this.agent_id = +this.route.snapshot.paramMap.get('id');
      if (this.agent_id !== 0) {
        this.getAgent(this.agent_id);
        this.agent_no = 'EVA' + this.agent_id;
        this.role = 'Agent';
      } else {
        this.role = 'Admin';
      }
    });
  }

  openSideDrawer() {
    this.setDrawerIcon = 'close';
    this.sideDrawerService.open();
    this.sideDrawerService.setDrawerValue('close');
  }

  setOpenDrawerValue(state: string) {
    this.setDrawerIcon = state;
  }

  getAgents(): void {
    this.agentService.getAgents()
        .subscribe(agents => this.agents = agents);
  }

  setAgentId(agent_id: number) {
    this.agent_id = agent_id;
    this.router.navigate(['agent/' + agent_id]);
  }

  getAgent(agent_id: number) {
    this.agentService.getAgent(agent_id)
      .subscribe(agent => this.agent = agent);
  }

}
