const router = require("express").Router();
const jobsController = require("./../controllers/jobs.controller");

router.route('/jobs')
    .get(jobsController.getAll)
    .post(jobsController.addOne);

router.route('/jobs/:jobId')
    .get(jobsController.getOne)
    .put(jobsController.fullUpdate)
    .patch(jobsController.partialUpdate)
    .delete(jobsController.deleteOne);

module.exports = router;