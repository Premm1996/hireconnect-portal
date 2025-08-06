const db = require('../db');
const emailService = require('../utils/emailService');
const ValidationService = require('../utils/validation');

class CandidateController {
  // Get all candidates with pagination and filtering
  async getCandidates(req, res) {
    try {
      const { page = 1, limit = 10, search, status, position } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT c.*, 
               COUNT(d.id) as document_count,
               MAX(a.created_at) as last_activity
        FROM candidates c
        LEFT JOIN documents d ON c.id = d.candidate_id
        LEFT JOIN activities a ON c.id = a.candidate_id
        WHERE 1=1
      `;
      
      const params = [];

      if (search) {
        query += ` AND (c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (status) {
        query += ` AND c.status = ?`;
        params.push(status);
      }

      if (position) {
        query += ` AND c.position = ?`;
        params.push(position);
      }

      query += ` GROUP BY c.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), parseInt(offset));

      const [candidates] = await db.query(query, params);
      
      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) as total FROM candidates WHERE 1=1`;
      const countParams = [];
      
      if (search) {
        countQuery += ` AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      if (status) {
        countQuery += ` AND status = ?`;
        countParams.push(status);
      }

      if (position) {
        countQuery += ` AND position = ?`;
        countParams.push(position);
      }

      const [totalResult] = await db.query(countQuery, countParams);
      const total = totalResult[0].total;

      res.json({
        candidates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      res.status(500).json({ error: 'Failed to fetch candidates' });
    }
  }

  // Get single candidate with details
  async getCandidateById(req, res) {
    try {
      const { id } = req.params;
      
      const [candidate] = await db.query(`
        SELECT c.*, 
               COUNT(d.id) as document_count,
               JSON_ARRAYAGG(
                 JSON_OBJECT(
                   'id', d.id,
                   'filename', d.filename,
                   'type', d.type,
                   'uploaded_at', d.uploaded_at
                 )
               ) as documents
        FROM candidates c
        LEFT JOIN documents d ON c.id = d.candidate_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [id]);

      if (candidate.length === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      // Get activity history
      const [activities] = await db.query(`
        SELECT * FROM activities 
        WHERE candidate_id = ? 
        ORDER BY created_at DESC
      `, [id]);

      res.json({
        ...candidate[0],
        activities
      });
    } catch (error) {
      console.error('Error fetching candidate:', error);
      res.status(500).json({ error: 'Failed to fetch candidate' });
    }
  }

  // Create new candidate
  async createCandidate(req, res) {
    try {
      const validation = ValidationService.validateCandidateData(req.body);
      
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        position,
        experience,
        skills,
        education
      } = req.body;

      // Check if email already exists
      const [existing] = await db.query(
        'SELECT id FROM candidates WHERE email = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const [result] = await db.query(`
        INSERT INTO candidates (first_name, last_name, email, phone, position, experience, skills, education, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [firstName, lastName, email, phone, position, experience, skills, education]);

      const candidateId = result.insertId;

      // Send welcome email
      await emailService.sendWelcomeEmail(email, `${firstName} ${lastName}`);

      // Log activity
      await db.query(
        'INSERT INTO activities (candidate_id, type, description) VALUES (?, ?, ?)',
        [candidateId, 'created', 'Candidate profile created']
      );

      res.status(201).json({
        id: candidateId,
        message: 'Candidate created successfully'
      });
    } catch (error) {
      console.error('Error creating candidate:', error);
      res.status(500).json({ error: 'Failed to create candidate' });
    }
  }

  // Update candidate status
  async updateCandidateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const validStatuses = ['pending', 'reviewing', 'interviewed', 'selected', 'rejected'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const [result] = await db.query(
        'UPDATE candidates SET status = ?, notes = ? WHERE id = ?',
        [status, notes, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      // Get candidate details for email
      const [candidate] = await db.query(
        'SELECT email, first_name, last_name FROM candidates WHERE id = ?',
        [id]
      );

      if (candidate.length > 0) {
        await emailService.sendCandidateStatusUpdate(
          candidate[0].email,
          `${candidate[0].first_name} ${candidate[0].last_name}`,
          status
        );
      }

      // Log activity
      await db.query(
        'INSERT INTO activities (candidate_id, type, description) VALUES (?, ?, ?)',
        [id, 'status_update', `Status updated to ${status}`]
      );

      res.json({ message: 'Candidate status updated successfully' });
    } catch (error) {
      console.error('Error updating candidate status:', error);
      res.status(500).json({ error: 'Failed to update candidate status' });
    }
  }

  // Delete candidate
  async deleteCandidate(req, res) {
    try {
      const { id } = req.params;

      const [result] = await db.query('DELETE FROM candidates WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ error: 'Failed to delete candidate' });
    }
  }

  // Get candidate statistics
  async getCandidateStats(req, res) {
    try {
      const [stats] = await db.query(`
        SELECT 
          COUNT(*) as total_candidates,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
          SUM(CASE WHEN status = 'interviewed' THEN 1 ELSE 0 END) as interviewed,
          SUM(CASE WHEN status = 'selected' THEN 1 ELSE 0 END) as selected,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
          COUNT(DISTINCT position) as total_positions
        FROM candidates
      `);

      res.json(stats[0]);
    } catch (error) {
      console.error('Error fetching candidate stats:', error);
      res.status(500).json({ error: 'Failed to fetch candidate statistics' });
    }
  }
}

module.exports = new CandidateController();
