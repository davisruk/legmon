import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  user: User;

  constructor() {
  }

  ngOnInit() {
    if (this.user == null || this.user === undefined) {
      this.user = new User();
    }
  }

  onSubmit() {
    console.log(this.user);
  }
}
