const db = require('../db');

exports.getJobs = async (req, res) => {
    try {

        const userId = req.user.id;
        let { title, company, status, releaseDateFrom, releaseDateTo, appliedDateFrom, appliedDateTo, salary, interviewDateFrom, interviewDateto, skill, search, limit = 10, page = 1, sort = 'appliedDate:desc' } = req.query;
        const param = [userId];
        let jobid = [];

        if (skill) skill = skill.split(',');
        if (!skill) skill = [];
        if (skill.length > 0) {
            let minSql = "SELECT DISTINCT job_id FROM job_skill WHERE skill IN ( ?"
            const minPar = [skill[0]]

            for (let i = 1; i < skill.length; i++) {
                minSql += ', ?'
                minPar.push(skill[i])
            }
            minSql += " )"
            let joblist = await db.promise().query(minSql, minPar);
            jobid = joblist[0].map(obj => obj.job_id);
        }

        let sql = 'SELECT * FROM jobs j WHERE j.user_id = ?';

        if (jobid.length > 0) {
            sql += ' AND j.id IN ( ?'
            param.push(jobid[0])
            for (let i = 1; i < jobid.length; i++) {
                sql += ', ?'
                param.push(jobid[i])
            }
            sql += ' ) '
        }

        if (title) {
            sql += ' AND j.title = ? ';
            param.push(title);
        }

        if (status) {
            sql += ' AND j.status = ? ';
            param.push(status);
        }

        if (company) {
            sql += ' AND j.company = ? ';
            param.push(`%${company}%`);
        }

        if (salary) {
            sql += ' AND j.salary = ? ';
            param.push(salary);
        }

        if (releaseDateFrom && releaseDateTo) {
            sql += ' AND j.release_date BETWEEN ? AND ? ';
            param.push(releaseDateFrom, releaseDateTo);
        } else if (releaseDateFrom) {
            sql += ' AND j.release_date >= ? ';
            param.push(releaseDateFrom);
        } else if (releaseDateTo) {
            sql += ' AND j.release_date <=? ';
            param.push(releaseDateTo);
        }

        if (appliedDateFrom && appliedDateTo) {
            sql += ' AND j.applied_date BETWEEN ? AND ? ';
            param.push(appliedDateFrom, appliedDateTo);
        } else if (appliedDateFrom) {
            sql += ' AND j.applied_date >= ? ';
            param.push(appliedDateFrom);
        } else if (appliedDateTo) {
            sql += ' AND j.applied_date <= ? ';
            param.push(appliedDateTo);
        }

        if (interviewDateFrom && interviewDateto) {
            sql += ' AND j.interview_date BETWEEN ? AND ? ';
            param.push(interviewDateFrom, interviewDateto);
        } else if (interviewDateFrom) {
            sql += ' AND j.interview_date >= ? ';
            param.push(interviewDateFrom);
        } else if (interviewDateto) {
            sql += ' AND j.interview_date <= ? ';
            param.push(interviewDateto);
        }

        if (search) {
            sql += `
              AND (
                j.title LIKE ? OR
                j.company LIKE ? OR
                j.note LIKE ? OR
                j.status LIKE ? OR
                EXISTS (
                  SELECT 1 FROM job_skill js
                  WHERE js.job_id = j.id AND js.skill LIKE ?
                )
              )`;
            const likePattern = `%${search}%`;
            param.push(likePattern, likePattern, likePattern, likePattern, likePattern);
        }


        let [jobs] = await db.promise().query(sql, param);

        let pageNum = Math.max(parseInt(page, 10) || 1, 1);
        let limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
        const maxPage = Math.ceil((jobs.length) / limitNum);
        pageNum = Math.max(Math.min(pageNum, maxPage), 1);
        let offset = (pageNum - 1) * limit;

        let [criteria, order] = sort.split(':');
        const allowedCriteria = ['company', 'title', 'status', 'applied_date', 'release_date', 'salary'];
        if (!allowedCriteria.includes(criteria)) criteria = 'applied_date';
        order = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

        sql += ` ORDER BY ${criteria} ${order} LIMIT ? OFFSET ?`;
        param.push(limitNum, offset);

        [jobs] = await db.promise().query(sql, param);

        for (let job of jobs) {
            const [skills] = await db.promise().query(
                'SELECT skill FROM job_skill WHERE job_id = ?', [job.id]
            );

            job.skills = skills.map(s => s.skill)
        }

        res.json({jobs, page:pageNum, limit:limitNum, TotalPage:maxPage, rows:(jobs.length), sort:`${criteria}:${order}`});

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'Failed to fetch jobs' });

    }
}

exports.getJobSummary = async (req, res) => {
    try{
        const userId = req.user.id;
        const [statusList] = await db.promise().query("Select status, count(*) as total From jobs Where user_id = ? Group by status", [userId]);
        const [topThree] = await db.promise().query("Select company, title, status, id from jobs where user_id = ? limit 3", [userId])
        const [upcomingInterview] = await db.promise().query("Select company, status, title, interview_date, id from jobs where user_id = ? AND interview_date > curdate()", [userId])

        res.json({statusList, topThree, upcomingInterview});

        

    }catch(err){
        console.error(err)
        res.status(500).json({error: 'Failed to fetch Summary'})

    }
}

exports.getJobById = async (req, res) => {

    try {
        const userId = req.user.id;
        const jobId = req.params.id;

        const [jobs] = await db.promise().query(
            'SELECT * FROM jobs WHERE id = ? AND user_id = ?',
            [jobId, userId]
        );

        if (jobs.length === 0) {
            return res.status(401).json({ error: 'job does not exist' })
        }

        const job = jobs[0];
        const [skills] = await db.promise().query(
            ' SELECT skill FROM job_skill WHERE job_id = ?', [jobId]
        );

        job.skills = skills.map(s => s.skill);

        res.json(job);


    } catch (err) {
        console.error("the error ", err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }


}

exports.createJob = async (req, res) => {
    const { company = null, title = null, status = null, appliedDate = new Date(), releaseDate = new Date(), note = null, coverLetter = null, salary = null, skills = null } = req.body;
    const userId = req.user.id;

    try {

        const [result] = await db.promise().execute(
            `INSERT INTO jobs (company, title, status, applied_date, release_date, note, cover_letter, salary, user_id)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [company, title, status, appliedDate, releaseDate, note, coverLetter, salary, userId]
        );

        const jobID = result.insertId;

        if (Array.isArray(skills) && skills.length > 0) {
            for (let skill of skills) {
                await db.promise().execute(
                    `INSERT INTO job_skill (skill, job_id) VALUES (?, ?)`, [skill, jobID]
                );
            }
        }
        res.status(201).json({ id: jobID, company, title, status, appliedDate, releaseDate, note, coverLetter, salary, skills })


    } catch (err) {
        console.error("the error is ", err);
        res.status(500).json({ error: 'cannot add the job' });
    }
}

exports.updateJobs = async (req, res) => {
    const { company, title, status, appliedDate, releaseDate, note, coverLetter, salary, skills } = req.body;
    const userId = req.user.id;
    const jobID = req.params.id;


    try {
        const [checkJob] = await db.promise().query(
            `SELECT * FROM jobs WHERE id = ? AND user_id = ?`, [jobID, userId]
        )

        if (checkJob.length === 0) {
            return res.status(404).json({ error: 'the job does not exist' });
        }

        await db.promise().execute(
            `UPDATE jobs 
            SET 
            company = COALESCE(?, company), 
            title = COALESCE(?, title), 
            status = COALESCE(?, status), 
            applied_date = COALESCE(?, applied_date), 
            release_date = COALESCE(?, release_date), 
            note = COALESCE(?, note), 
            cover_letter = COALESCE(?, cover_letter), 
            salary = COALESCE(?, salary)
            WHERE id = ?`,
            [company, title, status, appliedDate, releaseDate, note, coverLetter, salary, jobID]
        );


        if (Array.isArray(skills) && skills.length > 0) {
            await db.promise().execute(
                `DELETE FROM job_skill WHERE job_id = ?`, [jobID]
            )
            for (let skill of skills) {
                await db.promise().execute(
                    `INSERT INTO job_skill (skill, job_id) VALUES (?, ?)`, [skill, jobID]
                );
            }
        }
        res.json({ message: 'job updated' })


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'cannot update the job' });
    }
}

exports.deleteJob = async (req, res) => {
    const jobID = req.params.id;
    const userId = req.user.id;

    try {
        const [checkJob] = await db.promise().query(
            `SELECT * FROM jobs WHERE id = ? AND user_id = ?`, [jobID, userId]
        )

        if (checkJob.length === 0) {
            return res.status(404).json({ error: 'the job does not exist' });
        }

        await db.promise().execute(
            `DELETE FROM jobs WHERE id = ? AND user_id = ?`, [jobID, userId]
        );

        res.json({ message: 'job deleted' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'cannot delete job' });
    }
}