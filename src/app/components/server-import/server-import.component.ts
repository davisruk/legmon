import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import {
  UploadServersFile,
  UploadServersFilePayload
} from '../../state/actions/servers-actions';

@Component({
  selector: 'app-server-import',
  templateUrl: './server-import.component.html',
  styleUrls: ['./server-import.component.scss']
})
export class ServerImportComponent implements OnInit {
  fileName = '';
  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  getFile() {
    console.log('getting file ' + this.fileName);
    const payload: UploadServersFilePayload = {
      fileName: this.fileName
    };
    this.store.dispatch(new UploadServersFile(payload));
  }
}
