export class User {
    email: string;
    firstName: string | null;
    lastName: string | null;
    password: string | null;
    token: string | null;

    constructor () {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.password = '';
        this.token = '';
    }
}

export const MOCK_USER = {
    email: 'rich@davisfamily.eu',
    firstName: 'Richard',
    lastName: 'Davis',
    password: 'test',
    token: ''
};
