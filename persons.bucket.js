// bucket based on age
db.persons.aggregate([
   {$bucket: {
       groupBy: "$dob.age",
       boundaries: [0, 18, 30, 50, 70, 90, 120],
       default:"unknown",
       output: {
        numPersons: { $sum: 1 },
        aveAge: {$avg: "$dob.age"}
       }
   }} 
]).pretty()

// auto-bucket into six buckets
db.persons.aggregate([
    {$bucketAuto: {
        groupBy: "$dob.age",
        buckets: 6,
        output: {
            aveAge: {$avg: "$dob.age"},
            numPersons: {$sum: 1}
        }
    }},
    {$project: {
        _id:0,
        from: "$_id.min",
        to: "$_id.max",
        aveAge: {$toInt: "$aveAge"},
        numPersons: 1
    }}
]).pretty()