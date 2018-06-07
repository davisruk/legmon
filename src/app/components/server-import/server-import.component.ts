import { selectServerArray } from './../../state/app.state';
import { Server } from 'src/app/model/server.model';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import {
  UploadServersFile,
  UploadServersFilePayload,
  LoadServers
} from '../../state/actions/servers-actions';
import { List as ImmutableList } from 'immutable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-server-import',
  templateUrl: './server-import.component.html',
  styleUrls: ['./server-import.component.scss']
})
export class ServerImportComponent implements OnInit {
  fileName = '';
  fullServerListSubscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new LoadServers({}));
  }

  ngOnInit() {}

  getFile() {
    console.log('getting file ' + this.fileName);

    this.store
      .select(selectServerArray)
      .subscribe((servers: ImmutableList<Server>) => {
        const payload: UploadServersFilePayload = {
          fileName: this.fileName,
          currentServerFileContents: servers.toArray()
        };
        this.store.dispatch(new UploadServersFile(payload));
      })
      .unsubscribe();
  }
}
