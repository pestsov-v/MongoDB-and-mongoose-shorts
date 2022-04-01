//find
// find all documents
await MyModel.find({});

// find all documents named john and at least 18
await MyModel.find({ name: 'john', age: { $gte: 18 } }).exec();

// executes, passing results to callback
MyModel.find({ name: 'john', age: { $gte: 18 } }, function (err, docs) { });

// executes, name LIKE john and only selecting the "name" and "friends" fields
await MyModel.find({ name: /john/i }, 'name friends').exec();

// passing options
await MyModel.find({ name: /john/i }, null, { skip: 10 }).exec();

// ----------------------------------------------------------------------------- //
//findById
// Find the adventure with the given `id`, or `null` if not found
await Adventure.findById(id).exec();

// using callback
Adventure.findById(id, function (err, adventure) { });

// select only the adventures name and length
await Adventure.findById(id, 'name length').exec();

// ----------------------------------------------------------------------------- //
// Model.findByIdAndDelete()
findOneAndDelete({ _id: id })


// ----------------------------------------------------------------------------- //
// Model.findByIdAndRemove()
A.findByIdAndRemove(id, options, callback) // executes
A.findByIdAndRemove(id, options)  // return Query
A.findByIdAndRemove(id, callback) // executes
A.findByIdAndRemove(id) // returns Query
A.findByIdAndRemove() // returns Query

// ----------------------------------------------------------------------------- //
// Model.findByIdAndUpdate()
A.findByIdAndUpdate(id, update, options, callback) // executes
A.findByIdAndUpdate(id, update, options)  // returns Query
A.findByIdAndUpdate(id, update, callback) // executes
A.findByIdAndUpdate(id, update) // returns Query
A.findByIdAndUpdate()

// ----------------------------------------------------------------------------- //
// Model.findOne()
// Find one adventure whose `country` is 'Croatia', otherwise `null`
await Adventure.findOne({ country: 'Croatia' }).exec();

// using callback
Adventure.findOne({ country: 'Croatia' }, function (err, adventure) { });

// select only the adventures name and length
await Adventure.findOne({ country: 'Croatia' }, 'name length').exec()

// ----------------------------------------------------------------------------- //
// Model.findOneAndDelete()
A.findOneAndDelete(conditions, options, callback) // executes
A.findOneAndDelete(conditions, options)  // return Query
A.findOneAndDelete(conditions, callback) // executes
A.findOneAndDelete(conditions) // returns Query
A.findOneAndDelete() // returns Query

// ----------------------------------------------------------------------------- //
// Model.findOneAndRemove()

A.findOneAndRemove(conditions, options, callback) // executes
A.findOneAndRemove(conditions, options)  // return Query
A.findOneAndRemove(conditions, callback) // executes
A.findOneAndRemove(conditions) // returns Query
A.findOneAndRemove() // returns Query

// ----------------------------------------------------------------------------- //
// Model.findOneAndReplace()

A.findOneAndReplace(filter, replacement, options, callback) // executes
A.findOneAndReplace(filter, replacement, options)  // return Query
A.findOneAndReplace(filter, replacement, callback) // executes
A.findOneAndReplace(filter, replacement) // returns Query
A.findOneAndReplace() // returns Query

// ----------------------------------------------------------------------------- //
// Model.findOneAndUpdate()

A.findOneAndUpdate(conditions, update, options, callback) // executes
A.findOneAndUpdate(conditions, update, options)  // returns Query
A.findOneAndUpdate(conditions, update, callback) // executes
A.findOneAndUpdate(conditions, update)           // returns Query
A.findOneAndUpdate() // returns Query

const query = { name: 'borne' };
Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

// is sent as
Model.findOneAndUpdate(query, { $set: { name: 'jason bourne' } }, options, callback)

// ----------------------------------------------------------------------------- //
// Model.update()
MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);

const res = await MyModel.update({ name: 'Tobi' }, { ferret: true });
res.n; // Number of documents that matched `{ name: 'Tobi' }`
// Number of documents that were changed. If every doc matched already
// had `ferret` set to `true`, `nModified` will be 0.
res.nModified;
