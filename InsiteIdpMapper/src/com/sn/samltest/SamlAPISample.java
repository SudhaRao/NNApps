package com.sn.samltest;

import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;
import javax.security.auth.Subject;

// Import methods from the SAML token library
import com.ibm.wsspi.wssecurity.saml.data.SAMLAttribute;
import com.ibm.websphere.wssecurity.wssapi.token.SAMLToken;
import com.ibm.wsspi.wssecurity.saml.config.ProviderConfig;
import com.ibm.wsspi.wssecurity.saml.config.RequesterConfig;
import com.ibm.wsspi.wssecurity.saml.config.CredentialConfig;
import com.ibm.websphere.wssecurity.wssapi.token.SAMLTokenFactory;
import com.ibm.websphere.wssecurity.wssapi.token.SecurityToken;
import com.ibm.wsspi.wssecurity.core.token.config.RequesterConfiguration;

public class SamlAPISample {
	
	public void testSAMLTokenLibrary() throws Exception {
	
		try 
		{
		  // Get an instance of the SAML v2.0 token factory
		  SAMLTokenFactory samlFactory = SAMLTokenFactory.getInstance(SAMLTokenFactory.WssSamlV20Token11);
		
		  // Generate default requester data for a subject confirmation of 
		  // type holder-of-key (secret key).
		  RequesterConfig requesterData =
		       samlFactory.newSymmetricHolderOfKeyTokenGenerateConfig();
		        
		  // Set the recipient's key alias, so that the issuer can encrypt
		  // the secret key for recipient as part of the subject confirmation. 
		  requesterData.setKeyAliasForAppliesTo("SOAPRecipient");
		        
		  // Set the authentication method that took place. 
		  requesterData.setAuthenticationMethod("Password"); 
		
		  System.out.println("default holder of key confirmation key type is: "+ 
		  requesterData.getRSTTProperties().get(RequesterConfiguration.RSTT.KEYTYPE));
		  requesterData.getRSTTProperties().put(RequesterConfiguration.RSTT.KEYTYPE, 
		      "http://docs.oasis-open.org/ws-sx/ws-trust/200512/SymmetricKey");
		
		  requesterData.getRSTTProperties().put(
		                     RequesterConfiguration.RSTT.APPLIESTO_ADDRESS,
						                                
		                     "http://localhost:9080");
		
		  requesterData.setConfirmationMethod("holder-of-key");
		
		  // Set the recipient's key alias so that token infomation such as 
		  // the secret HoK can be encrypted by the issuer and decrypted by the 
		  // recipient.
		  requesterData.setKeyAliasForAppliesTo("SOAPRecipient"); 
		  requesterData.setAuthenticationMethod("Password");
		  requesterData.getRSTTProperties().put(
		  RequesterConfiguration.RSTT.ENCRYPTIONALGORITHM, 			                               
		                      "http://www.w3.org/2001/04/xmlenc#aes128-cbc");
		  requesterData.getRSTTProperties().put(RequesterConfiguration.RSTT.TOKENTYPE,"http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV1.1");
		  requesterData.setRequesterIPAddress("9.53.52.65");
		
		  // Print requester configuration items
		  System.out.println("authentication method for requester is: "+
			            requesterData.getAuthenticationMethod());
		  System.out.println("confirmation method for requester is: "+
		                    requesterData.getConfirmationMethod());
		  System.out.println("key alias for requester is: "+
		            requesterData.getKeyAliasForRequester());
		  System.out.println("key alias for recipient as set in requester config is "+
		          requesterData.getKeyAliasForAppliesTo());
		  System.out.println("holder of key confirmation key type is: "+ requesterData.getRSTTProperties().get(RequesterConfiguration.RSTT.KEYTYPE));
		
		  // Get an instance of the Credential config object		
		  CredentialConfig cred = samlFactory.newCredentialConfig();
		  cred.setRequesterNameID("Alice");
		
		  // Set some user attributes
		  ArrayList<SAMLAttribute> userAttrs = new ArrayList<SAMLAttribute>();
		  SAMLAttribute anAttribute = new SAMLAttribute("EmployeeInfo", 
				    new String[] {"GreenRoofing","JohnDoe", "19XY981245"},
		                null, "WebSphere Namespace", null, "JohnDoeInfo " );
		  userAttrs.add(anAttribute);
		  cred.setSAMLAttributes(userAttrs);
				
		  // Get default provider configuration
		  ProviderConfig samlIssuerCfg = 
		    samlFactory.newDefaultProviderConfig("WebSphereSelfIssuer");
		  System.out.println("time to live from the default provider config: "+
		        		  samlIssuerCfg.getTimeToLive()); 
		  System.out.println("keyStore path from default provider config: "+
		                    samlIssuerCfg.getKeyStoreConfig().getPath()); 
		  System.out.println("keyStore type from default provider config: "+
		                   samlIssuerCfg.getKeyStoreConfig().getType()); 
		  System.out.println("key alias from default provider config: "+
		     	             samlIssuerCfg.getKeyInformationConfig().getAlias());
		        
		  // Generate the SAML token
		  SecurityToken samlToken = 
		         samlFactory.newSAMLToken(cred, requesterData, samlIssuerCfg);
		  System.out.println("token's creation Date is:  "+((SAMLToken)samlToken).getSamlCreated().toString());
		  System.out.println("token's expiration Date is: "+((SAMLToken)samlToken).getSamlExpires().toString());
		  System.out.println("token's subject confirmation method is: "+((SAMLToken)samlToken).getConfirmationMethod());
		
		       
		  // Create a Subject, mapping the name identifier in the token to a user 
		  // in the user registry to obtain the Principal name
		  Subject subject = samlFactory.newSubject((SAMLToken)samlToken);
		
		  // Retrieve attributes from the token
		  List<SAMLAttribute> allAttributes =         
		                        ((SAMLToken)samlToken).getSAMLAttributes();
		
		  // Iterate through the attributes and process accordingly
		  Iterator<SAMLAttribute> iter = allAttributes.iterator();
		  while (iter.hasNext()) {
			   SAMLAttribute attribute = iter.next();
			   String attributeName = attribute.getName();
			   String[] attributeValues = attribute.getStringAttributeValue();
			   System.out.println("attribute name = "+ attributeName + 
			                       "  attribute value = ["+
			                       attributeValues[0]+ ", "+attributeValues[1]+ ", "+
			                       attributeValues[2]+"]");
		  	}
		  } catch(Exception e) {
		     e.printStackTrace();
		  } 
	 }

}