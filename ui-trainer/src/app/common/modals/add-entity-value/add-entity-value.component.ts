import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-entity-value',
  templateUrl: './add-entity-value.component.html',
  styleUrls: ['./add-entity-value.component.scss']
})
export class AddEntityValueComponent implements OnInit {

  entity_value: string;

  constructor(public dialogRef: MatDialogRef<AddEntityValueComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    if (this.entity_value !== '') {
      this.dialogRef.close(this.entity_value);
    }
  }

}
