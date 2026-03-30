"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePublication = exports.updatePublication = exports.approvePublication = exports.createPublication = exports.getPublicationById = exports.getPublications = exports.upload = void 0;
const client_1 = require("@prisma/client");
const multerImport = __importStar(require("multer"));
const multer = multerImport.default || multerImport;
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});
// Get all publications (public/approved ones vs all for admins)
const getPublications = async (req, res) => {
    try {
        const { search, type, programStudy, author, isApproved, uploaderId } = req.query;
        const user = req.user;
        const filters = {};
        // Only Admins can see non-approved by default, unless explicitly requested by the uploader
        if (!user || user.role !== 'ADMIN') {
            filters.isApproved = true;
        }
        if (isApproved !== undefined) {
            filters.isApproved = isApproved === 'true';
        }
        if (uploaderId) {
            filters.uploaderId = String(uploaderId);
        }
        if (search) {
            filters.OR = [
                { title: { contains: String(search) } },
                { abstract: { contains: String(search) } },
                { author: { name: { contains: String(search) } } }
            ];
        }
        if (type)
            filters.type = String(type);
        if (programStudy)
            filters.programStudy = String(programStudy);
        if (author)
            filters.author = { name: { contains: String(author) } };
        const publications = await prisma.publication.findMany({
            where: filters,
            include: {
                author: true,
                uploader: { select: { id: true, name: true, email: true } },
                keywords: { include: { keyword: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(publications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch publications' });
    }
};
exports.getPublications = getPublications;
// Get single publication
const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await prisma.publication.findUnique({
            where: { id: String(id) },
            include: {
                author: true,
                uploader: { select: { id: true, name: true, email: true } },
                keywords: { include: { keyword: true } }
            }
        });
        if (!publication) {
            res.status(404).json({ error: 'Publication not found' });
            return;
        }
        res.status(200).json(publication);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch publication' });
    }
};
exports.getPublicationById = getPublicationById;
// Create publication (requires login)
const createPublication = async (req, res) => {
    try {
        const { title, abstract, year, programStudy, type, authorName, authorAffiliation, keywords } = req.body;
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const file = req.file;
        const pdfUrl = file ? `/uploads/${file.filename}` : (req.body.pdfUrl || null);
        // Handle Author
        let authorRecord = await prisma.author.findFirst({ where: { name: authorName } });
        if (!authorRecord) {
            authorRecord = await prisma.author.create({
                data: { name: authorName, affiliation: authorAffiliation }
            });
        }
        // Handle Keywords
        const keywordArray = keywords ? JSON.parse(keywords) : [];
        const keywordConnections = [];
        for (const kw of keywordArray) {
            let kwRecord = await prisma.keyword.findUnique({ where: { name: kw } });
            if (!kwRecord) {
                kwRecord = await prisma.keyword.create({ data: { name: kw } });
            }
            keywordConnections.push({ keyword: { connect: { id: kwRecord.id } } });
        }
        const publication = await prisma.publication.create({
            data: {
                title, abstract, year: Number(year), programStudy, type,
                pdfUrl,
                isApproved: user.role === 'ADMIN', // Auto approve if admin
                author: { connect: { id: authorRecord.id } },
                uploader: { connect: { id: user.id } },
                keywords: { create: keywordConnections }
            },
            include: { author: true, keywords: true }
        });
        res.status(201).json(publication);
    }
    catch (error) {
        console.error('Create publication error:', error);
        res.status(500).json({ error: 'Failed to create publication' });
    }
};
exports.createPublication = createPublication;
// Update approval status (Admin only)
const approvePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        const publication = await prisma.publication.update({
            where: { id: String(id) },
            data: { isApproved },
            include: { author: true }
        });
        res.status(200).json(publication);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update approval status' });
    }
};
exports.approvePublication = approvePublication;
// Update publication (Admin or Uploader)
const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, abstract, year, programStudy, type, authorName, authorAffiliation, keywords } = req.body;
        const user = req.user;
        const existingPub = await prisma.publication.findUnique({ where: { id: String(id) } });
        if (!existingPub) {
            res.status(404).json({ error: 'Publication not found' });
            return;
        }
        // Only Admin or the original Uploader can edit
        if (user.role !== 'ADMIN' && existingPub.uploaderId !== user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const file = req.file;
        const pdfUrl = file ? `/uploads/${file.filename}` : (req.body.pdfUrl || existingPub.pdfUrl);
        // Handle Author
        let authorRecord = undefined;
        if (authorName) {
            authorRecord = await prisma.author.findFirst({ where: { name: authorName } });
            if (!authorRecord) {
                authorRecord = await prisma.author.create({
                    data: { name: authorName, affiliation: authorAffiliation || '' }
                });
            }
        }
        // Handle Keywords
        let keywordConnections = { set: [] }; // By default, clear old if keywords provided
        if (keywords) {
            const keywordArray = JSON.parse(keywords);
            const newConnections = [];
            for (const kw of keywordArray) {
                let kwRecord = await prisma.keyword.findUnique({ where: { name: kw } });
                if (!kwRecord) {
                    kwRecord = await prisma.keyword.create({ data: { name: kw } });
                }
                newConnections.push({ keyword: { connect: { id: kwRecord.id } } });
            }
            // In Prisma, intermediate explicit m-n requires deleting old connections and creating new ones.
            // A simpler approach is just to deleteMany on the join table and create anew:
            await prisma.publicationKeyword.deleteMany({ where: { publicationId: String(id) } });
            keywordConnections = { create: newConnections };
        }
        else {
            keywordConnections = undefined; // Don't touch keywords if not provided
        }
        const publication = await prisma.publication.update({
            where: { id: String(id) },
            data: {
                ...(title && { title }),
                ...(abstract && { abstract }),
                ...(year && { year: Number(year) }),
                ...(programStudy && { programStudy }),
                ...(type && { type }),
                pdfUrl,
                ...(authorRecord && { author: { connect: { id: authorRecord.id } } }),
                ...(keywordConnections && { keywords: keywordConnections })
            },
            include: { author: true, keywords: true }
        });
        res.status(200).json(publication);
    }
    catch (error) {
        console.error('Update publication error:', error);
        res.status(500).json({ error: 'Failed to update publication' });
    }
};
exports.updatePublication = updatePublication;
// Delete publication
const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const pub = await prisma.publication.findUnique({ where: { id: String(id) } });
        if (!pub) {
            res.status(404).json({ error: 'Not found' });
            return;
        }
        // Only Admin or the original Uploader can delete
        if (user.role !== 'ADMIN' && pub.uploaderId !== user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await prisma.publication.delete({ where: { id: String(id) } });
        res.status(200).json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete publication' });
    }
};
exports.deletePublication = deletePublication;
//# sourceMappingURL=publication.js.map