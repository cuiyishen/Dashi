package wordcount;

import org.bson.Document;

import com.mongodb.Block;
import com.mongodb.MongoClient;
import com.mongodb.client.MapReduceIterable;
import com.mongodb.client.MongoDatabase;

import db.DBUtil;
;

public class WordCount {
    
    public static void main(String [] args) {
        // Init
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase(DBUtil.DB_NAME);
        
        // Construct mapper function
        StringBuilder sb = new StringBuilder();
        sb.append("function() { emit(this.word, 1); }");
        String map = sb.toString();
        // Construct a reducer function
        String reduce = "function(key, values) {return Array.sum(values)} ";
        
        // MapReduce
        MapReduceIterable<Document> results = db.getCollection("wordC")
                .mapReduce(map, reduce);    
        // Need a sorting here
        results.forEach(new Block<Document>() {
            @Override
            public void apply(final Document document) {
                System.out.println(document.getString("_id") + ": " +document.getDouble("value"));
            }
        });
        mongoClient.close(); 
    }
}
