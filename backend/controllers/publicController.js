const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Transaction = require('../models/Transaction');
const apiResponse = require('../utils/apiResponse');

// GET /api/public/projects
const getPublicProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, department } = req.query;
    const query = { publicVisibility: true, status: { $nin: ['draft', 'cancelled'] } };
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query)
        .select('projectName department projectId totalBudget releasedAmount remainingAmount status projectCreationDateTime contractorId officialLocation allowedRadiusMeters')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('contractorId', 'companyName')
        .lean(),
      Project.countDocuments(query),
    ]);

    const enriched = await Promise.all(
      projects.map(async (p) => {
        const milestones = await Milestone.find({ projectId: p._id })
          .select('phaseNumber title status')
          .lean();
        const releasedCount = milestones.filter((m) => m.status === 'released').length;
        return {
          ...p,
          contractorName: p.contractorId?.companyName || 'N/A',
          milestoneSummary: milestones,
          progress: milestones.length ? Math.round((releasedCount / milestones.length) * 100) : 0,
        };
      })
    );

    return apiResponse.paginated(res, 'Public projects', enriched, {
      total, page: parseInt(page), limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) { next(err); }
};

// GET /api/public/projects/:projectId
const getPublicProjectDetail = async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .select('-createdBy -lastUpdatedBy -expectedSupplierIRNMin -expectedSupplierIRNMax')
      .populate('contractorId', 'companyName vendorName')
      .lean();
    if (!project) return apiResponse.error(res, 'Project not found', [], 404);

    const milestones = await Milestone.find({ projectId: project._id })
      .select('phaseNumber title description amount status estimatedDeadline actualReleaseDate')
      .sort({ phaseNumber: 1 }).lean();

    return apiResponse.success(res, 'Project details', { project, milestones });
  } catch (err) { next(err); }
};

// GET /api/public/transactions
const getPublicTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { status: 'success', type: { $in: ['fund_lock', 'fund_release'] } };

    const [txns, total] = await Promise.all([
      Transaction.find(query)
        .select('txnId projectNameSnapshot type amount status onChainTxnHash createdAt')
        .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Transaction.countDocuments(query),
    ]);

    return apiResponse.paginated(res, 'Public transactions', txns, {
      total, page: parseInt(page), limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) { next(err); }
};

// GET /api/public/milestones/:milestoneId/proof
const getPublicMilestoneProof = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.milestoneId).lean();
    if (!milestone) return apiResponse.error(res, 'Milestone not found', [], 404);

    if (!milestone.proofSubmissionId) {
      return apiResponse.success(res, 'No proof submitted yet', { proof: null });
    }

    const ProofSubmission = require('../models/ProofSubmission');
    const proof = await ProofSubmission.findById(milestone.proofSubmissionId)
      .select('ipfsPhotoUrl ipfsPhotoCid gpsLatitude gpsLongitude submittedAt distanceFromOfficialPinMeters uploadedProofs')
      .lean();

    return apiResponse.success(res, 'Proof details retrieved', { proof });
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getPublicProjects, 
  getPublicProjectDetail, 
  getPublicTransactions,
  getPublicMilestoneProof
};
