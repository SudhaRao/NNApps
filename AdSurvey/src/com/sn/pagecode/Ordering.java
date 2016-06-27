package com.sn.pagecode;

import java.util.Map;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

@ManagedBean(name="pc_ordering")
@SessionScoped
public class Ordering {
	private String selectedStore = null;
	private String bookingNum = "";
	private String department = "";
	
	public String enterPage() {
		FacesContext fc = FacesContext.getCurrentInstance();
		getParameters(fc);
		
		return "adSurveyOrdering";
	}
	
	// get value from "f:param"
	public void getParameters(FacesContext fc) {
		Map<String,String> params = fc.getExternalContext().getRequestParameterMap();
		selectedStore = params.get("selectedStoreParam");
		System.out.println("selectedStore in Ordering = " + selectedStore);
		bookingNum = params.get("bookingNumParam");
		System.out.println("bookingNum in Ordering = " + bookingNum);
		department = params.get("departmentParam");
		System.out.println("department in Ordering = " + department);
		
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


}
