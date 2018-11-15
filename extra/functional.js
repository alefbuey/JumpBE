// > zip([1,2],[11,22],[111,222,333])
// [[1,11,111],[2,22,222]]]

// > zip()
// []

//Mas info ver https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function

function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}


zipWith = function() {
	var args = Array.prototype.slice.call(arguments)
		, ls = _.initial(args)
		, ls_
		, f  = _.last(args)

	ls_ = _.zip.apply(this, ls)
	ls_ = _.map(ls_, function(x) {
		return f.apply(this, x)
	})
	return ls_
}

function concat(job,user) {
    block ={
        nameEmployer: user.name + " " + user.lastname,
        imageEmployer : user.image,
        idemployer: job.idemployer,    //Para cargar el perfil del empleado una vez de click
        idjob: job.idjob,        //Para cargar la info del trabajo una vez de click
        jobmode: job.jobmode,
        imageJob: job.imageJob,
        title:  job.title,
        jobcost:    job.jobcost,
        dateposted: job.dateposted,
        dateend: job.dateend,
        numbervacancies: job.numbervacancies
    }
    return block
}

module.exports = {
    zip: zip,
    zipWith: zipWith,
    concat: concat
}
