import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { constant } from '../../../../environments/constants';

@Component({
  selector: 'app-model-error',
  templateUrl: './model-error.component.html',
  styleUrls: ['./model-error.component.scss']
})
export class ModelErrorComponent implements OnInit {

  showErrorText: string;

  constructor(public sharedDataService: SharedDataService) { }

  ngOnInit() {
    this.showErrorText = this.sharedDataService.getSharedData('showErrorText', constant.MODULE_MODEL);
  }

}
