class APIfeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      /*
            Regarding filtering requests coming into the database, for specific fields, there are several different request object parameters that could be accounted for and we may not need to use all of them at once. These include:
            page - for pagination of results, limit - limiting the number of results per page, sort - sorting the results based on some criteria, fields - form field input, and queries - key:value pairs that inform the database about the results to be returned. 
        
            We may not need to use all of them at once, and as such we should discard the parts of the parameters on the request object that we aren't interested in. 
        
            Since there's at present no direct way to to do this, we'll use a feature of JS - ES6: Object desctructuring. 
        
            We dismantle the object, and separate the the query key:value pairs from the rest of the parameters collected from a pontential response.
            In this case by using: const queryObj = {...req.query}
        
            then make an array of the parameters to be excluded. 
        
            */
      //1 - desctruct the request object to isolate the query parameters
      const queryObj = { ...this.queryString };
      //2 - Identify all the fields to be excluded: PSLF
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      //3 - remove the unwanted fields from the request object;
      excludedFields.forEach((el) => delete queryObj[el]);
  
      //1B ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      //2 SORTING
  
      // sort(price ratingsAverage) - mongoDb way for writing the query
      //sort=price, ratingsAverage - how it would be contructed in the  query string for the client device.
      // We do it this way because mongoose requires a string separated by spaces. for the query.
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      //3 LimitFields:
      /*
            Rationale: for a client device its always best to limit the amount of data it needs to transmit over bandwith, per request, limiting fields returned from the database helps with that. This is especially true for large data sets being stored.
            */
  
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        // We do it this way because mongoose requires a string separated by spaces. for the query: In mongo db the query would be: find({}, {limit: [{name duration difficulty price}]}) - find everything and limit the fields of the returned documents to {limit: [{name duration difficulty price}]}
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
        //set up a default limit, so that if no client device request provides a limit then we do a deafult limiting of some metadata coming from the server, in this case the __v field that mongo db creates on each document.
      }
  
      return this;
    }
  
    paginate() {
      /*Implementing pagination helps to create a subset of documents to view for a client device in the event that a data set is large, for example a datbase containing 1000 documents in it, pagaination of 1000 displaying say 10 documents per page would mean 100 pagaination sets. 
        
         Pagination is down to naturally break up a large amount of data into smaller chunks that are easier to transfer to the client device and also make it easier to read for users of the client device. It uses a combination of page and limit.
         */
      //defining default pagination:
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      // converting the strings to numbers as they come in from the query. Just multiple the input by 1 so that Javascript parses it correctly as a number.
  
      const skip = (page - 1) * limit;
      //How to calculate the skip value:
      //page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3, 31-40, page 4
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }
  
  module.exports = APIfeatures;