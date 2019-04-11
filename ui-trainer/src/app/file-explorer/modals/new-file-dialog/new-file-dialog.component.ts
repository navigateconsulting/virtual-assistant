import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {

  fileName: string;

  constructor() { }

  ngOnInit() {
  }

}
