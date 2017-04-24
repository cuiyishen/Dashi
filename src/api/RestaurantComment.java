package api;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import db.DBConnection;
import db.MySQLDBConnection;
import model.Comment;

/**
 * Servlet implementation class RestaurantComment
 */
@WebServlet("/comment")
public class RestaurantComment extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static DBConnection connection = new MySQLDBConnection();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RestaurantComment() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONArray array = new JSONArray();
		if (request.getParameterMap().containsKey("business_id")) {
			String businessId = (String) request.getParameter("business_id");
			array = connection.getComments(businessId);
		}
		RpcParser.writeOutput(response, array);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            JSONObject input = RpcParser.parseInput(request);
            if (input.has("user_id") && input.has("business_id")&&input.has("user")&&input.has("comment")) {
                String userId = (String) input.get("user_id");
                String businessId = (String) input.get("business_id");
                String user = (String) input.get("user");
                String comment= (String) input.get("comment");
                connection.setComments(userId, businessId, user, comment);
                RpcParser.writeOutput(response,
                        new JSONObject().put("status", "OK"));
            } else {
                RpcParser.writeOutput(response,
                        new JSONObject().put("status", "InvalidParameter"));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
	}

}
