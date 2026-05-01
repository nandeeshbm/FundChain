const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Transaction = require('../models/Transaction');
const Vendor = require('../models/Vendor');
const projectService = require('../services/projectService');
const apiResponse = require('../utils/apiResponse');

// POST /api/admin/projects — Create a new project
const createProject = async (req, res, next) => {
  try {
    const result = await projectService.createProject(req.body, req.user, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return apiResponse.success(res, 'Project created successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/projects — List all projects
const getAllProjects = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, department, search } = req.query;
    const query = {};

    if (status) query.status = status;
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
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('contractorId', 'vendorName companyName registryId walletAddress')
        .lean(),
      Project.countDocuments(query),
    ]);

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (p) => {
        const milestones = await Milestone.find({ projectId: p._id }).lean();
        const releasedCount = milestones.filter((m) => m.status === 'released').length;
        const progress = milestones.length > 0 ? Math.round((releasedCount / milestones.length) * 100) : 0;
        return { ...p, progress, milestoneCount: milestones.length };
      })
    );

    return apiResponse.paginated(res, 'Projects retrieved', projectsWithProgress, {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/projects/:projectId — Get single project
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .populate('contractorId', 'vendorName companyName registryId walletAddress email phone')
      .populate('createdBy', 'name email')
      .lean();

    if (!project) {
      return apiResponse.error(res, 'Project not found', [], 404);
    }

    const milestones = await Milestone.find({ projectId: project._id })
      .sort({ phaseNumber: 1 })
      .lean();

    const transactions = await Transaction.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return apiResponse.success(res, 'Project retrieved', { project, milestones, transactions });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/dashboard-stats — Dashboard summary
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      activeProjects,
      budgetAgg,
      vendorCount,
      recentProjects,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: { $in: ['active', 'in_progress'] } }),
      Project.aggregate([
        {
          $group: {
            _id: null,
            totalBudget: { $sum: '$totalBudget' },
            totalReleased: { $sum: '$releasedAmount' },
            totalRemaining: { $sum: '$remainingAmount' },
          },
        },
      ]),
      Vendor.countDocuments({ isWhitelisted: true }),
      Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('contractorId', 'vendorName companyName')
        .lean(),
    ]);

    const budget = budgetAgg[0] || { totalBudget: 0, totalReleased: 0, totalRemaining: 0 };

    // Calculate progress for recent projects
    const recentWithProgress = await Promise.all(
      recentProjects.map(async (p) => {
        const milestones = await Milestone.find({ projectId: p._id }).lean();
        const releasedCount = milestones.filter((m) => m.status === 'released').length;
        const progress = milestones.length > 0 ? Math.round((releasedCount / milestones.length) * 100) : 0;
        return { ...p, progress };
      })
    );

    return apiResponse.success(res, 'Dashboard stats retrieved', {
      stats: {
        totalProjects,
        activeProjects,
        totalBudget: budget.totalBudget,
        totalReleased: budget.totalReleased,
        totalRemaining: budget.totalRemaining,
        vendorCount,
      },
      recentProjects: recentWithProgress,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProject, getAllProjects, getProjectById, getDashboardStats };
