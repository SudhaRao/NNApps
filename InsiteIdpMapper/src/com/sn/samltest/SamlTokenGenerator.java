package com.sn.samltest;

import java.util.ArrayList;

import javax.security.auth.Subject;
import javax.servlet.ServletException;

import com.ibm.websphere.security.auth.WSSubject;
import com.ibm.websphere.security.cred.WSCredential;
import com.ibm.websphere.wssecurity.wssapi.token.SAMLTokenFactory;
import com.ibm.websphere.wssecurity.wssapi.token.SecurityToken;
import com.ibm.wsspi.wssecurity.saml.config.CredentialConfig;
import com.ibm.wsspi.wssecurity.saml.config.ProviderConfig;
import com.ibm.wsspi.wssecurity.saml.config.RequesterConfig;
import com.ibm.wsspi.wssecurity.saml.data.SAMLAttribute;
import com.ibm.wsspi.wssecurity.saml.data.SAMLNameID;

public class SamlTokenGenerator {

	public static SecurityToken getSamlToken() throws ServletException {
		SecurityToken samlToken = null;
		String name = getPrincipal();
		String[] groups = getGroups();
		String localRealm = getRealm();

		System.out.println("SAML principal name: " + name);
		try {

			SAMLTokenFactory samlFactory = SAMLTokenFactory
					.getInstance("http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0");

			RequesterConfig reqData = samlFactory
					.newBearerTokenGenerateConfig();

			CredentialConfig cred = samlFactory.newCredentialConfig();
			reqData.setAuthenticationMethod("Password");
			// Password is the authentication method

			// create SAML NameID or NameIdentifer using principal
			// in Caller Subject
			SAMLNameID nameID = null;
			nameID = new SAMLNameID(name, null, localRealm, null, null);
			cred.setSAMLNameID(nameID);

			// Create SAML Attributes using group memberships
			// in Caller Subject
			if (groups != null && groups.length > 0) {
				ArrayList<SAMLAttribute> al = new ArrayList<SAMLAttribute>();
				SAMLAttribute sattribute = new SAMLAttribute("Membership",
						groups, null, null /* format */, null, null);
				al.add(sattribute);
				cred.setSAMLAttributes(al);
			}
			ProviderConfig samlIssuerCfg = samlFactory
					.newDefaultProviderConfig("acme.com");
			// acme.com is issuer name
			samlToken = samlFactory.newSAMLToken(cred, reqData, samlIssuerCfg);
		} catch (Throwable e) {
			System.out
					.println("testNewSecurityTokenV1Bearer:caught exception: "
							+ e.getMessage() + "\n");
			e.printStackTrace(System.out);
		}
		return samlToken;
	}

	private static String getPrincipal() {
		String name = null;
		String realm = null;
		try {
			Subject subject = WSSubject.getRunAsSubject();
			WSCredential credential = null;

			if (subject != null) {
				java.util.Set<Object> publicCreds = subject
						.getPublicCredentials();
				if (publicCreds != null && publicCreds.size() > 0) {
					java.util.Iterator<Object> publicCredIterator = publicCreds
							.iterator();
					while (publicCredIterator.hasNext()) {
						Object cred = publicCredIterator.next();
						if (cred != null && cred instanceof WSCredential) {
							credential = (WSCredential) cred;
							name = credential.getSecurityName();
							realm = credential.getRealmName();
							break;
						}
					}
				}
			}

			if (name != null && (name.contains(realm))) {
				name = name.substring(name.indexOf(realm) + realm.length() + 1);
			}
		} catch (Exception e) {
			name = "UNAUTHENTICATED";
		}
		return name;
	}

	private static String[] getGroups() throws ServletException {
		String[] grps = null;
		try {
			WSCredential credential = null;
			Subject subject = null;
			ArrayList groups = new ArrayList();
			try {
				subject = WSSubject.getRunAsSubject();
			} catch (Exception ex) {
				System.out
						.println("Exception caught upon invoking WSSubject.getCallerSubject():"
								+ ex.getMessage());
				ex.printStackTrace(System.out);
				throw new ServletException(ex.getCause());
			}
			if (subject != null) {
				java.util.Set<Object> publicCreds = subject
						.getPublicCredentials();
				if (publicCreds != null && publicCreds.size() > 0) {
					java.util.Iterator<Object> publicCredIterator = publicCreds
							.iterator();
					while (publicCredIterator.hasNext()) {
						Object cred = publicCredIterator.next();
						if (cred != null && cred instanceof WSCredential) {
							credential = (WSCredential) cred;
							break;
						}
					}
				}
			}
			if (credential != null) {
				groups = credential.getGroupIds();
			}

			if (groups != null && groups.size() > 0) {
				String realm = credential.getRealmName();
				grps = new String[groups.size()];
				groups.toArray(grps);
				for (int i = 0; i < groups.size();) {
					String name = grps[i];
					if (name != null && name.contains(realm)) {
						name = name.substring(name.indexOf(realm)
								+ realm.length() + 1);
						grps[i] = name;
					}
					i++;
				}
			}
		} catch (Exception e) {
			System.out.println("Exception caught populating groups:"
					+ e.getMessage());
			e.printStackTrace(System.out);
			throw new ServletException(e.getCause());
		}
		return grps;
	}

	private static String getRealm() throws ServletException {

		String realm = null;
		try {
			Subject subject = WSSubject.getRunAsSubject();
			WSCredential credential = null;

			if (subject != null) {
				java.util.Set<Object> publicCreds = subject
						.getPublicCredentials();
				if (publicCreds != null && publicCreds.size() > 0) {
					java.util.Iterator<Object> publicCredIterator = publicCreds
							.iterator();
					while (publicCredIterator.hasNext()) {
						Object cred = publicCredIterator.next();
						if (cred != null && cred instanceof WSCredential) {
							credential = (WSCredential) cred;
							realm = credential.getRealmName();
							break;
						}
					}
				}
			}
		} catch (Exception e) {
			System.out.println("Exception caught retrieving realm:"
					+ e.getMessage());
			e.printStackTrace(System.out);
			throw new ServletException(e.getCause());
		}
		return realm;
	}
}
