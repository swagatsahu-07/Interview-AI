const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @desc Generate an interview report based on candidate information
 * @access Private
 */
interviewRouter.post('/', authMiddleware.authUser, upload.single('resume'), interviewController.generateInterviewController);


/**
 * @route POST /api/interview/report/:interviewId
 * @desc Get interview report by interviewId
 * @access Private
 */
interviewRouter.get('/report/:interviewId', authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route POST /api/interview
 * @desc Get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get('/', authMiddleware.authUser, interviewController.getAllInterviewReportController)

/**
 * @route DELETE /api/interview/:id
 * @desc Delete an interview report by id
 * @access Private
 */
interviewRouter.delete('/:id', authMiddleware.authUser, interviewController.deleteInterviewReportController)




module.exports = interviewRouter