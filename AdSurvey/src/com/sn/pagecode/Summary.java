package com.sn.pagecode;

import java.util.ArrayList;
import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.faces.event.ValueChangeEvent;
import javax.faces.model.SelectItem;

@ManagedBean(name="pc_summary")
@SessionScoped
public class Summary {
	private String selectedStore = "";
	private ArrayList<SelectItem> storeList = null;
	private String userId = "";
	private String bookingNum = "";
	private String department = "";
	
	public String enterPage() {
		FacesContext fc = FacesContext.getCurrentInstance();
		getParameters(fc);
		bookingNum = "65617";
		department = "All";
		storeList = getStoreListForUser(userId);		
		
		return "adSurveySummary?faces-redirect=true";
	}
	
	// get values from "f:param" tags
	public void getParameters(FacesContext fc) {
		Map<String,String> params = fc.getExternalContext().getRequestParameterMap();
/*		String tempString = params.get("selectedStoreParam");
		if (tempString == null) {
			System.out.println("Cannot find selectedStoreParam.  Use current selectedStore.");
		} else {
			selectedStore = tempString;
		}
*/		
		return;		
	}
	
	private ArrayList<SelectItem> getStoreListForUser(String userIdString) {
		ArrayList<SelectItem> resultingStoreList = new ArrayList <SelectItem> ();
		resultingStoreList.add(new SelectItem("","--SELECT ONE--"));
		
		String defaultStores = "";		
		if (userIdString.equals("sh")) {
			defaultStores = "111,222,333,444";
		} else if (userIdString.equals("ew")){
			defaultStores = "222,444,666";
		}		
		
		System.out.println("STORES FOR USER " + userIdString + " = " + defaultStores);
		
		if (defaultStores.length() > 0) {
			String [] storeNumberArray = defaultStores.split(",");
			for (int i=0; i < storeNumberArray.length; ++i) {
				resultingStoreList.add(new SelectItem(storeNumberArray[i], "Store " + storeNumberArray[i]));
			}
		}		
		
		return resultingStoreList;
	}
	
	private ArrayList<SelectItem> createStoreList() {
		ArrayList <SelectItem> result = new ArrayList <SelectItem> ();			
			
		System.out.println("Initializing getStoreList");
		result.add(new SelectItem("", "-- SELECT ONE --"));
		
		result.add(new SelectItem("111", "Store 111")); // Value, Label
		result.add(new SelectItem("333", "Store 333"));
		result.add(new SelectItem("222", "Store 222"));	
		
		return result;
	}
	
	public void storeChanged(ValueChangeEvent e) {		
		if (e.getNewValue() != null) {
			selectedStore = e.getNewValue().toString();
			System.out.println("Store changed to: " + selectedStore);
		} else {
			selectedStore = "";
		}
	}
	
	/*public void userChanged(ValueChangeEvent e) {
		userId = e.getNewValue().toString();
		System.out.println("User id changed to: " + userId);
	}*/

	public String getSelectedStore() {
		return selectedStore;
	}

	public void setSelectedStore(String selectedStore) {
		this.selectedStore = selectedStore;
	}
	public ArrayList<SelectItem> getStoreList() {
		return storeList;
	}

	public void setStoreList(ArrayList<SelectItem> storeList) {
		this.storeList = storeList;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getBookingNum() {
		return bookingNum;
	}

	public void setBookingNum(String bookingNum) {
		this.bookingNum = bookingNum;
	}
	
	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

}
