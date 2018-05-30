import { Component, OnInit, Input } from '@angular/core';
import { Server } from '../../model/server.model';

@Component({
  selector: 'app-server-detail',
  templateUrl: './server-detail.component.html',
  styleUrls: ['./server-detail.component.scss']
})
export class ServerDetailComponent implements OnInit {
  @Input() server: Server;

  constructor() {}

  ngOnInit() {}
}
