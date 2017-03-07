
package offline;



import org.bson.Document;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MapReduceIterable;
import com.mongodb.client.MongoDatabase;

import db.DBUtil;

public class AverageRating {
    private static final String COLLECTION_NAME = "ratings";
    private static final String item = "0634029363";
    
    public static void main(String [] args) {
        // Init
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase(DBUtil.DB_NAME);


                               /**
        var map = function() 
            { if (this.item == "0634029363" && this.rating == 2) 
            { emit(this.user, 1); }
            if (this.item == "B000TZTPQ6" && this.rating == 5)
            { emit(this.user, 1); }
            if (this.item == "B001QE994M" && this.rating == 4)
            { emit(this.user, 1); }
            if (this.item == ¡°B001QE997E" && this.rating == 5) 
            { emit(this.user, 1); }}
         */
        // Construct mapper function
        StringBuilder sb = new StringBuilder();
        sb.append("function() {");
  //     sb.append("{ emit(this.item, this.rating); } }");
        sb.append("if (this.item == \"");
        sb.append(item);
        sb.append("\" ){ emit(this.item, this.rating); } }");

        String map = sb.toString();
        // Construct a reducer function
        String reduce = "function(key, values) {return Array.avg(values)} ";
        
        // MapReduce
        MapReduceIterable<Document> results = db.getCollection(COLLECTION_NAME)
                .mapReduce(map, reduce);  

        results.forEach(new Block<Document>() {
            @Override
            public void apply(final Document document) {
                String id = document.getString("_id");
                Double value = document.getDouble("value");
                System.out.println(id + " has an avg rating: " + value);
            }
        });
        mongoClient.close();  
    }
}