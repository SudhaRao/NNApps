package com.sn.saml;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.ibm.websphere.security.NotImplementedException;
import com.ibm.websphere.security.UserMappingException;
import com.ibm.websphere.wssecurity.wssapi.token.SAMLToken;
import com.ibm.wsspi.security.web.saml.UserMapping;
import com.ibm.wsspi.wssecurity.saml.data.SAMLAttribute;
import com.ibm.wsspi.wssecurity.saml.data.SAMLNameID;
/**
 * @author 170160
 *
 * Used in conjunction with /WebContent/themes/html/dynamicSpots/insite_salutation.jsp
 * Called from the SAML ACS Servlet to add the assertions from the SAMLResponse token to com.sn.saml.DNMap
 */
public class IdpMappingImpl implements UserMapping {
	private static final String SC = IdpMappingImpl.class.getName();
	private static final Logger LOG = Logger.getLogger(SC);
	private static final String SAML_ATTR_DN = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
	private static final String INSITEUSEREMPID = "Insite User EmployeeId:";
	private static final String INSITEUSERDN = ", DN:";
	
		
	public IdpMappingImpl() {
		if (LOG.isLoggable(Level.FINE)){
			LOG.entering(SC, "Constructor");
		}
	}

	public String mapSAMLAssertionToName(SAMLToken samlToken) throws UserMappingException, NotImplementedException {
		if (LOG.isLoggable(Level.FINE)){
			LOG.entering(SC, "mapSAMLAssertionToName");
			logToken(samlToken);
		}
		String result = null;
		SAMLNameID nameid = samlToken.getSAMLNameID();
		if (nameid!=null) {
			result = nameid.getValue();
			String dn = getAttrValue(samlToken,SAML_ATTR_DN);
			if (result!=null && dn!=null) {
				//adding the results to the DNMap
				DNMap.getInstance().add(result, dn);
				if (LOG.isLoggable(Level.FINE)){
					LOG.fine(INSITEUSEREMPID + result + INSITEUSERDN + dn);
					LOG.exiting(SC, "mapSAMLAssertionToName");
				}
			}
		}
		return result;
	}
	
	
	

	private String getAttrValue(SAMLToken token, String attrName) throws UserMappingException {
		if (LOG.isLoggable(Level.FINE)){
			Object[] parms = {token,attrName};
			LOG.entering(SC, "getAttrValue", parms);
		}
		String result = null;
		if (token != null) {
			List<SAMLAttribute> attrList =  token.getSAMLAttributes();
			if (attrList != null  && attrList.size() > 0 && !attrList.isEmpty()) {
				for (SAMLAttribute attr : attrList) {
					Logger.getLogger(attr.getName());
					if (attr.getName().equals(attrName)) {
						if (attr.getStringAttributeValue().length > 0) {
							/*
							 Test and add this piece of code when needed as this class initially this code did not exist.*/
							/* for (int i = 0; i < attr.getStringAttributeValue().length; i++) {
								 Logger.getLogger(attr.getStringAttributeValue()[i]);
                             } 
							  */
							
							result = attr.getStringAttributeValue()[0];
							LOG.fine("User Mapping found DN: " + result);
							break;
						}
					}
				}
			}
		}
		if (LOG.isLoggable(Level.FINE)){
			Object[] parms = {token,attrName,result};
			LOG.exiting(SC, "getAttrValue", parms);
		}
		return result;
	}
	
	
	
	private void logToken(SAMLToken token) {
		if (token == null) {
			LOG.fine("SAMLToken is null");
		} else {
			SAMLNameID nameid = token.getSAMLNameID();
			LOG.info("SAMLNameId.getFormat="+nameid.getFormat());
			LOG.info("SAMLNameId.getNameQualifier="+nameid.getNameQualifier());
			LOG.info("SAMLNameId.getSPNameQualifier="+nameid.getSPNameQualifier());
			LOG.info("SAMLNameId.getSPProvidedID="+nameid.getSPProvidedID());
			LOG.info("SAMLNameId.getValue="+nameid.getValue());
			LOG.info("SAMLNameId.toString="+nameid.toString());
			List<SAMLAttribute> attrList = token.getSAMLAttributes();
			if (attrList==null) {
				LOG.fine("SAMLToken does not contain any attributes");
			} else if (attrList.size()==0) {
				LOG.fine("SAMLToken contains zero attributes");
			} else {
				for (SAMLAttribute attr : attrList) {
					LOG.fine("SAML Attribute:" + attr.getName() + "=" + attr.getStringAttributeValue()[0]);					
				}
			}
		}
	}
	
}
