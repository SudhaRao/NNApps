package com.sn.pagecode;

import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

@ManagedBean(name="pc_confcancel")
@SessionScoped
public class ConfCancel {
	private String selectedStore = null;
	private String bookingNum = "";
	private String department = "";
	private String userId = "";
	
	public String enterPage() {
		FacesContext fc = FacesContext.getCurrentInstance();
		getParameters(fc);
		
		return "adSurveyConfCancel";
	}
	
	// get value from "f:param"
	public void getParameters(FacesContext fc) {
		Map<String,String> params = fc.getExternalContext().getRequestParameterMap();
		selectedStore = params.get("selectedStoreParam");
		System.out.println("selectedStore in ConfCancel = " + selectedStore);
		bookingNum = params.get("bookingNumParam");
		System.out.println("bookingNum in ConfCancel = " + bookingNum);
		department = params.get("departmentParam");
		System.out.println("department in ConfCancel = " + department);
		userId = params.get("userIdParam");
		System.out.println("userId in ConfCancel = " + userId);
		
		return;		
	}

	public String getSelectedStore() {
		return selectedStore;
	}

	public void setSelectedStore(String selectedStore) {
		this.selectedStore = selectedStore;
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

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

}
