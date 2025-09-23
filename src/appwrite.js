import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
    .setEndpoint('https://sfo.cloud.appwrite.io/v1') 
    .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movieId) => {
    //1. Use Appwrite SDK to check if a record for the searchTerm exists
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [Query.equal("searchTerm", searchTerm)]);
        //2. If it exists, update the count field by incrementing it by 1
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: doc.count + 1
            });
        //3. If it doesn't exist, create a new document with the search term and count set to 1
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: parseInt(movieId.id, 10), 
                poster_url: `https://image.tmdb.org/t/p/w500${movieId.poster_path}`, 
            });
        }
    } catch (error) {
        console.log("Error fetching document:", error);
    }
}