const express = require('express');
const { body, query } = require('express-validator');
const jobsController = require('../controllers/jobsController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate,
    [
        query("company").optional().isString(),
        query("status").optional().isIn(['applied', 'hired', 'rejected', 'fired', 'resigned']),
        query("appliedDateFrom").optional().isISO8601(),
        query("appliedDateTo").optional().isISO8601(),
        query("releaseDateFrom").optional().isISO8601(),
        query("releaseDateTo").optional().isISO8601(),
        query("interviewDateFrom").optional().isISO8601(),
        query("interviewDateTo").optional().isISO8601(),
        query("salary").optional().isInt(),
        query("title").optional().isString(),
        query('page').optional().isInt({ min: 1 }),
        query('limit').optional().isInt({ min: 1, max: 100 }),
        query('sort').optional().matches(/^[a-z_]+:(asc|desc)$/i),
        query("skill").optional().isString(),
        query("search").optional().isString().trim().escape()
    ],
    validate,
     jobsController.getJobs);

router.get('/:id', authenticate, jobsController.getJobById);

router.post('/', authenticate,
    [
        body('company').notEmpty().withMessage('Company required'),
        body('title').notEmpty().withMessage('Title required'),
        body('status').isIn(['applied', 'hired', 'rejected', 'fired', 'resigned']).withMessage('Invalid status'),
        body('skills').isArray().withMessage('Skill needs to be an array of strings')
    ],
    validate, jobsController.createJob
);

router.put('/:id', authenticate,
    [
        body('company').optional().notEmpty(),
        body('title').optional().notEmpty(),
        body('status').isIn(['applied', 'hired', 'rejected', 'fired', 'resigned']),
        body('skills').optional().isArray(),
    ],
    validate, jobsController.updateJobs
);

router.delete('/:id', authenticate, jobsController.deleteJob);

module.exports = router;