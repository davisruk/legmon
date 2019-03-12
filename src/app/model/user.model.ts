import { v4 as uuid } from 'uuid';
export class User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  token: string | null;

  constructor() {
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.password = '';
    this.token = '';
  }
}

export const MOCK_USER = {
  id: uuid(),
  email: 'a',
  firstName: 'Richard',
  lastName: 'Davis',
  password: 'a',
  token: ''
};
