import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-train-error',
  templateUrl: './show-train-error.component.html',
  styleUrls: ['./show-train-error.component.scss']
})
export class ShowTrainErrorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ShowTrainErrorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.data = this.data['errorMessage'].replace(/\\n\\t/g, '\n\t');
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
