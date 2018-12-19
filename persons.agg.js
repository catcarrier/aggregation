db.persons.aggregate([
    {$match: {gender:"female", "dob.age": {$gt:50}}},
    {$project: {
        _id: 0,
        age: "$dob.age",
        email:1,
        dob: {$convert: {input:"$dob.date", to:"date"}},
        fullName: {$concat:[
            {$toUpper: {$substrCP: ["$name.first", 0, 1] }},
            {$substrCP: ["$name.first", 1, {$subtract:[{$strLenCP:"$name.first"}, 1]}] },
            " ",
            {$toUpper: {$substrCP: ["$name.last", 0, 1] }},
            {$substrCP: ["$name.last", 1, {$subtract:[{$strLenCP:"$name.last"}, 1]}] },
        ]}
    }},
    {$group: {_id: {birthYear: { $year: "$dob" }}, numPersons: {$sum:1}}},
    {$sort: {numPersons: -1}}
]).pretty()