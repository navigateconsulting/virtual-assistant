import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rename-file-dialog',
  templateUrl: './rename-file-dialog.component.html',
  styleUrls: ['./rename-file-dialog.component.scss']
})
export class RenameFileDialogComponent implements OnInit {

  fileName: string;

  constructor() { }

  ngOnInit() {
  }

}
