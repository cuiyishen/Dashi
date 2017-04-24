package model;

public class Comment {
    private String businessId;
    private String userId;
    private String user;
    private String comment;
    public Comment(String businessId, String userId, String user, String comment){
    	this.businessId = businessId;
    	this.userId = userId;
    	this.user = user;
    	this.comment = comment;
    }
	public String getBusinessId() {
		return businessId;
	}
	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
    
}
