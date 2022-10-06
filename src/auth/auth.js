import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import core from '../api/core/auth';

passport.use('oidc', new BearerStrategy({
	passReqToCallback: true
}, core.coreOIDC ));

passport.use('cc', new BearerStrategy({
	passReqToCallback: true
}, core.coreCC ));

passport.use('oidc-plat', new BearerStrategy({
	passReqToCallback: true
}, core.corePlatform ));

export default {
	isAuthenticated: passport.authenticate(['oidc'], { session: false }),
	isPlatformAuthenticated: passport.authenticate(['oidc-plat'], { session: false }),
	isOAuthSecured: passport.authenticate(['cc'], { session: false }),
	isAnyAuth: passport.authenticate(['cc', 'oidc-plat', 'oidc'], { session: false }),
	isCCorPlatform: passport.authenticate(['cc', 'oidc-plat'], { session: false }),
};