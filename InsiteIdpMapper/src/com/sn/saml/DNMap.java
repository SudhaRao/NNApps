package com.sn.saml;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DNMap {
	private static final String SC = DNMap.class.getName();
	private static final Logger LOG = Logger.getLogger(SC);
	private static final DNMap instance = new DNMap();
	private static final Map<String,InsiteInfo> insiteInfoMap = new HashMap<String,InsiteInfo>();
	
	private DNMap() {
		if (LOG.isLoggable(Level.FINE)){
			LOG.entering(SC, "Constructor");
		}
	}
	
	public static DNMap getInstance() {
		instance.cleanup();
		return instance;
	}
	
	/**
	 * maintain the insiteInfoMap
	 * 
	 * entries in insiteInfoMap should not get old but if they do we want to remove them
	 */
	private void cleanup() {
		synchronized (DNMap.class) {
			if (insiteInfoMap.isEmpty()) return;
			Set<String> keys = insiteInfoMap.keySet();
			for (String k : keys) {
				InsiteInfo info = insiteInfoMap.get(k);
				if (info.isOld()) {
					LOG.warning("SAML information (employeeid & insite DN) for " + k + " expired unexpectedly"); 
					insiteInfoMap.remove(k);
				}
			}
		}
	}
	
	public void add(String employeeId, String insiteDn) {
		if (LOG.isLoggable(Level.FINE)){
			String[] parms = {employeeId,insiteDn};
			LOG.entering(SC, "add", parms);
		}
		InsiteInfo ii = new InsiteInfo(employeeId, insiteDn);
		synchronized (DNMap.class) {
			insiteInfoMap.put(employeeId, ii);
		}
		if (LOG.isLoggable(Level.FINE)){
			LOG.exiting(SC, "add", ii.toString());
		}
	}
	
	public String getInsiteDN(String employeeId) {
		if (LOG.isLoggable(Level.FINE)) {
			LOG.entering(SC, "getInsiteDN");
		}
		if (employeeId==null) {
			LOG.warning("getInsiteDN called with null employeeId");
			return null;
		}
		if (!insiteInfoMap.containsKey(employeeId)) {
			LOG.warning("getInsiteDN unable to find entry for employeeId: " + employeeId);
			return null;
		}
		InsiteInfo result = insiteInfoMap.get(employeeId);
		// this is happy path... entry is removed before it gets old
		insiteInfoMap.remove(employeeId);
		if (LOG.isLoggable(Level.FINE)){
			LOG.exiting(SC, "getInsiteDN", result.getDN());
		}
		return result.getDN();
	}
	
	private class InsiteInfo {
		private String _employeeId = null;
		private String _dn = null;
		private Date _expires = null;
		
		public InsiteInfo(String empId, String dn) {
			this._employeeId = empId;
			this._dn = dn;
			Calendar tmpCal = new GregorianCalendar();
			tmpCal.add(Calendar.MINUTE, 5);
			this._expires = tmpCal.getTime();
		}
		
		@SuppressWarnings("unused")
		public String getEmployeeId() {
			return this._employeeId;
		}
		
		public String getDN() {
			return this._dn;
		}
		
		public boolean isOld() {
			return new Date().after(this._expires);
		}

		@Override
		public String toString() {
			StringBuffer result = new StringBuffer();
			result.append("InsiteInfo:[employeeId="+this._employeeId);
			result.append(";DN="+this._dn);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd G 'at' HH:mm:ss z");
			result.append(";Expires at "+ sdf.format(this._expires));
			return super.toString();
		}
		
	}
}
