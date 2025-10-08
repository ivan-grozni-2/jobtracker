const express = require('express');
const { body, query } = require('express-validator');
const jobsController = require('../controllers/jobsController');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate,
    [
        query("company").optional().isString().withMessage('company error'),
        query("status").optional().isIn(['applied', 'hired', 'rejected', 'fired', 'resigned', '']).withMessage('status error'),
        query("appliedDateFrom").optional({ checkFalsy: true }).isISO8601().withMessage('Applied Date error'),
        query("appliedDateTo").optional({ checkFalsy: true }).isISO8601().withMessage('Applied Date error'),
        query("releaseDateFrom").optional({ checkFalsy: true }).isISO8601().withMessage('Released Date error'),
        query("releaseDateTo").optional({ checkFalsy: true }).isISO8601().withMessage('Released Date error'),
        query("interviewDateFrom").optional({ checkFalsy: true }).isISO8601().withMessage('Interview Date error'),
        query("interviewDateTo").optional({ checkFalsy: true }).isISO8601().withMessage('Interview Date error'),
        query("salary").optional({ checkFalsy: true }).isInt().withMessage('Monthly pay error'),
        query("title").optional().isString().withMessage('Position error'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page error'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit error'),
        query('sort').optional().matches(/^[a-z_]+:(asc|desc)$/i).withMessage('Sort error'),
        query("skill").optional().isString().withMessage('SKl error'),
        query("search").optional().isString().trim().escape().withMessage('Search error')
    ],
    validate,
    jobsController.getJobs
);

router.get('/summary', authenticate, jobsController.getJobSummary)

router.get('/:id', authenticate, jobsController.getJobById);

router.post('/', authenticate,
    [
        body('company').notEmpty().withMessage('Company required'),
        body('title').notEmpty().withMessage('Title required'),
        body('status').isIn(['applied', 'hired', 'rejected', 'fired', 'resigned']).withMessage('Invalid status'),
        body('skill').isArray().withMessage('Skill needs to be an array of strings')
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