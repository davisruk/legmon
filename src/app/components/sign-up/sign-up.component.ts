import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import {
  RegisterUser,
  RegisterUserPayload
} from '../../state/actions/register-actions';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: User;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    if (this.user == null || this.user === undefined) {
      this.user = new User();
    }
  }

  onSubmit() {
    console.log(this.user);
    const payloadUser: User = Object.assign({}, this.user);
    payloadUser.id = uuid();
    const payload: RegisterUserPayload = {
      user: payloadUser
    };

    this.store.dispatch(new RegisterUser(payloadUser));
  }
}
