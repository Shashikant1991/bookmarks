import {PasswordsModule} from './passwords.module';

describe(PasswordsModule.name, () => {
    let passwordsModule: PasswordsModule;

    beforeEach(() => {
        passwordsModule = new PasswordsModule();
    });

    it('should create an instance', () => {
        expect(passwordsModule).toBeTruthy();
    });
});
