package wordcount;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;

import db.DBUtil;

public class input {
    public static void main(String[] args) {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase(DBUtil.DB_NAME);
        // The name of the file to open.
        // Windows is different : C:\\Documents\\ratings_Musical_Instruments.csv
        File folder = new File("C:\\Users\\Yishen\\Documents\\2017 Project\\wordCount");
        File[] listOfFiles = folder.listFiles();
        String[] fileNames = new String[listOfFiles.length];
        for(int i =0; i <listOfFiles.length; i++){
        	fileNames[i] = folder.getAbsolutePath()+"\\"+listOfFiles[i].getName();
        }
        String line = null;
        for(String fileName: fileNames){
        	try {
        		FileReader fileReader = new FileReader(fileName);

        		BufferedReader bufferedReader = new BufferedReader(fileReader);
        		while ((line = bufferedReader.readLine()) != null) {
        			String[] values = line.split(" ");
        			for(String value: values){
        				db.getCollection("wordC")
                        	.insertOne(
                        			new Document()
                                        .append("word", value)
                                        .append("count", 1));
        			}
        		}
        		System.out.println(fileName + " Import Done!");
        		bufferedReader.close();
        	} catch (Exception e) {
        		e.printStackTrace();
        	}
        }
		mongoClient.close();
    }
}