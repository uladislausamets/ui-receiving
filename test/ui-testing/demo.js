/* global Nightmare, describe, it, before, after */

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-receiving:', function() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > navigate to app > verify message > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app and see stripes-new-app-greeting', (done) => {
        nightmare
          .wait('#clickable-receiving-module')
          .click('#clickable-receiving-module')
          .wait('#receiving-module-display')
          .wait('#stripes-new-app-greeting')
          .then(result => { done(); })
          .catch(done);
      });
    });

    describe('Login > navigate to app settings > verify message > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });
      after((done) => {
        logout(nightmare, config, done);
      });
      it('should open app settings and see stripes-new-app-settings-message', (done) => {
        nightmare
          .wait(config.select.settings)
          .click(config.select.settings)
          .wait('a[href="/settings/receiving"]')
          .click('a[href="/settings/receiving"]')
          .wait('a[href="/settings/receiving/general"]')
          .click('a[href="/settings/receiving/general"]')
          .wait('#stripes-new-app-settings-message')
          .then(result => { done(); })
          .catch(done);
      });
    });
  });
};
