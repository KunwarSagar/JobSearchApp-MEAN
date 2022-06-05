const Job = require("mongoose").model(process.env.JOB_MODEL);

const getAll = function(req, res){
    let count = parseInt(process.env.COUNT, process.env.RADIX);
    let offset = parseInt(process.env.OFFSET, process.env.RADIX);
    let max_count = parseInt(process.env.MAX_COUNT, process.env.RADIX);

    if(req.query && req.query.count){
        count = parseInt(req.query.count, process.env.RADIX);
    }
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, process.env.RADIX)
    }

    const response = {status: 204, message:{}};

    if(isNaN(count) || isNaN(offset)){
        response.status = 400;
        response.message = {message:"Query strings count and offset should be nummbers."};
    }

    if(count > max_count){
        response.status = 400;
        response.message = {message:"Max count cannot exceed " + max_count};
    }

    if(response.status != 204){
        res.status(response.status).json(response.message);
        return;
    }

    Job.find().skip(offset).limit(count).exec().then((jobs) => {
        if(jobs == null){
            response.status = 404;
            response.message = {message:"Jobs not found."};
        }else{
            response.status = 200;
            response.message = jobs;
        }
    }).catch(err =>{
        response.status = 500;
        response.message = {message:"Internal server error"};
    }).finally(()=>{
        res.status(response.status).json(response.message);
    });
}


const getOne = function(req, res){
    const jobId = req.params.jobId;
    const response = { status: 204, message:{}};

    Job.findById(jobId).exec().then(job =>{
        if(job == null){
            response.status = 404;
            response.message = {message:"Job not found."}
        }else{
            response.status = 200;
            response.message = job;
        }
    }).catch(err =>{
        response.status = 500;
        response.message = {message:"Internal server error."};
    }).finally(()=>{
        res.status(response.status).json(response.message);
    })
}
const addOne = function(req, res){
    const requestBody = req.body;

    const job = {
        title: requestBody.title,
        salary: requestBody.salary,
        location:requestBody.location,
        description: requestBody. description,
        experience: requestBody.experience,
        skills: requestBody.skills,
        postDate: requestBody.postDate ? new Date(requestBody.postDate): new Date()
    }

    const response = {status: 204, message:{}};

    Job.create(job)
        .then(addedJob => {
            response.status = 201;
            response.message = addedJob
        }).catch(err => {
            response.status = 500;
            response.message = {message:"Internal server error"};
            console.log(err);
        }).finally(()=>{
            res.status(response.status).json(response.message);
        });
}
const _updateJob = function(req, res, updateJob){
    const jobId = req.params.jobId;
    const response = {status: 204, message:{}}; 
    Job.findById(jobId).exec()
        .then(job => {
            if(job == null){
                response.status = 404;
                response.message = {message:"Job not found with id "+jobId};
            }else{
                response.status = 200;
                response.message = job;
            }
        }).catch(err=>{
            response.status = 500;
            response.message = {message:"Internal server error"};
        }).finally(()=>{
            if(response.status != 200){
                res.status(response.status).json(response.message);
            }else{
                updateJob(req, res, response.message)
            }
        })
}

const partialUpdate = function(req, res){
    _updateJob(req, res, _partialUpdate);
}

const _partialUpdate =  function(req,res, job){
    job.title = req.body.title ? req.body.title : job.title;
    job.salary = req.body.salary ? req.body.salary : job.salary;

    if(job.location){
        if(req.body.location){
            job.location.latitude = req.body.location.latitude ? parseFloat(req.body.location.latitude, process.env.RADIX): job.location.latitude;
            job.location.longitude = req.body.location.longitude ? parseFloat(req.body.location.longitude, process.env.RADIX):job.location.longitude;
        }
    }

    job.description = req.body.description ? req.body.description : job.description;
    job.experience = req.body.experience ? req.body.experience : job.experience;
    job.skills = req.body.skills ? [...req.body.skills] : job.skills;
    job.postDate = req.body.postDate ? new Date(req.body.postDate) : job.postDate;

    _saveAndReturn(job, res);
}

const fullUpdate = function(req, res){
    _updateJob(req, res, _fullUpdate);
}

const _fullUpdate = function(req, res, job){
    job.title = req.body.title;
    job.salary = req.body.salary;
    job.location = req.body.location;
    job.description = req.body.description;
    job.experience = req.body.experience;
    job.skills = req.body.skills;
    job.postDate = new Date(req.body.postDate);
    
    _saveAndReturn(job, res);
}

const _saveAndReturn = function(job,res){
    const response = {status: 204, message:{}};
    job.save()
        .then(updatedJob => {
            response.status = 202,
            response.message = updatedJob
        }).catch(err => {
            response.status = 500;
            response.message = {message:"Internal server error."}
        }).finally(()=>{
            res.status(response.status).json(response.message);
        })
}

const deleteOne = function(req, res){
    const jobId = req.params.jobId;
    const response = {status: 204, message:{}};

    Job.findByIdAndDelete(jobId).exec()
        .then(()=>{
            response.status = 204;
            response.message = {}
        }).catch(err =>{
            response.status = 500;
            response.message = {message:"Internal server error."}
        }).finally(()=>{
            res.status(response.status).json(response.message);
        });
}

module.exports = {
    getAll,
    getOne,
    addOne,
    fullUpdate,
    partialUpdate,
    deleteOne
}