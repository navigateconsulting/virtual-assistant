import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { load, safeLoad } from 'js-yaml';
import { stringify } from 'json2yaml';
import { constant } from '../../../../environments/constants';

@Component({
  selector: 'app-app-prop',
  templateUrl: './app-prop.component.html',
  styleUrls: ['./app-prop.component.scss']
})
export class AppPropComponent implements OnInit {

  configurationForm: FormGroup;
  show_yaml_error: boolean;
  yaml_error: string;

  constructor(public dialogRef: MatDialogRef<AppPropComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.show_yaml_error = false;
    this.configurationForm = new FormGroup({
      configDescription: new FormControl(stringify(this.data.projectConfiguration), Validators.required)
    });
  }

  setDefaultConfig() {
    this.dialogRef.close({
      object_id: this.data.projectObjectId,
      config_description: constant.DEFAULT_RASA_CONFIG
    });
  }

  closeDialog() {
    if (this.configurationForm.valid) {
      try {
        this.dialogRef.close({
          object_id: this.data.projectObjectId,
          config_description: safeLoad(this.configurationForm.value.configDescription)
        });
      } catch (e) {
        this.yaml_error = e;
        this.show_yaml_error = true;
      }
    }
  }

}
