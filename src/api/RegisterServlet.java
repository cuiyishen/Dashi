package api;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import db.DBConnection;
import db.MySQLDBConnection;

/**
 * Servlet implementation class RegisterServlet
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final DBConnection connection = new MySQLDBConnection();

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    try {
        JSONObject msg = new JSONObject();
        String user = request.getParameter("user_id");
        if (connection.getFirstLastName(user)=="") {
            msg.put("status", "OK");
        RpcParser.writeOutput(response, msg);
        }else {
            msg.put("user_id", user);
            response.setStatus(401);
        }
    }catch (JSONException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            // get request parameters for userID and password
            String user = request.getParameter("user_id");
            String pwd = request.getParameter("password");
            String firstName = request.getParameter("fn");
            String lastName = request.getParameter("ln");
            connection.setUser(user, pwd, firstName, lastName);
            RpcParser.writeOutput(response,
                    new JSONObject().put("status", "OK"));
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
	}

}
