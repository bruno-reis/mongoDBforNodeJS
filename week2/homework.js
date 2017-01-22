//2.1
db.movieDetails.find({ rated: "PG-13" , "awards.wins": 0, year: 2013}).pretty()

//2.2
db.movieDetails.find({}, {title: 1, _id: 0})

db.movieDetails.find({year: 1964}, {title: 1, _id: 0})

//2.3
db.movieDetails.find({"countries.1": "Sweden"}).count()

//2.4
db.movieDetails.find( { genres: ["Comedy", "Crime"]}).count()
//or
db.movieDetails.find( {$and: [ {genres: {$all: ["Comedy", "Crime"]}}, { genres: {$size: 2}}]}).pretty()

//2.5
db.movieDetails.find({ genres: {$all:  ["Comedy", "Crime"] } }).count()

//2.6
$set
