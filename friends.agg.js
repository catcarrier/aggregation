db.friends.aggregate([
    { $unwind: { path: "$hobbies" } },
    {
        $group:
        {
            _id: { age: "$age" },
            hobbies: { $addToSet: "$hobbies" }
        }
    }
]).pretty()


// project out first value of examscores array
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            examScores: { $slice: ["$examScores", 1] }
        }
    }
]).pretty()


// How many exams has each person taken?
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            numExams: { $size: "$examScores" },
            numHobbies: { $size: "$hobbies" }
        }
    }
]).pretty()

// filter the examscores array to those elements having score > 80
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            examScores: { $filter: { input: "$examScores", cond: { $gt: ["$$this.score", 80] } } }
        }
    },
    {
        $match: { "examScores.0": { $exists: true } }

    }
]).pretty()

// output the highest exam score per person - version 1 using $max
// The high scores are not ordered
db.friends.aggregate([
    {
        $project: {
            _id: 0,
            name: 1,
            maxScore: { $max: "$examScores.score" }
        }
    }
]).pretty()

// output the highest exam score per person - version 2 using unwind and group.
// The high scores are ordered desc
db.friends.aggregate([
    { $unwind: "$examScores" },
    {
        $project: {
            _id: 1,
            name: 1,
            score: "$examScores.score"
        }
    },
    { $group: { _id: "$_id", name: { $first: "$name" }, highScore: { $max: "$score" } } },
    { $sort: {highScore: -1} },
    { $project: {_id:0} }
]).pretty()







