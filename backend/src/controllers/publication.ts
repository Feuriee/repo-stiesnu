import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as multerImport from 'multer';
const multer: any = (multerImport as any).default || multerImport;
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    const dir = 'public/uploads/';
    if (!fs.existsSync(dir)) {
       fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req: Request, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
export const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req: Request, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  }
});

// Get all publications (public/approved ones vs all for admins)
export const getPublications = async (req: Request, res: Response): Promise<void> => {
   try {
     const { search, type, programStudy, author, isApproved, uploaderId, dashboard } = req.query;
     const user = (req as any).user;
     
     const filters: any = {};
     
     // 1. Determine base uploader filtering
     // If fetched from standard user's dashboard, ONLY show their own works
     if (dashboard === 'true' && user && user.role !== 'ADMIN') {
        filters.uploaderId = user.id;
     } else if (uploaderId) {
        filters.uploaderId = String(uploaderId);
     }
     
     // 2. Determine approval visibility
     // Only Admins can see ALL non-approved publications.
     // Non-admins can only see non-approved publications if they are querying their own works specifically
     if (!user || user.role !== 'ADMIN') {
        // If the query is scoped to this exact user's publications, they can see unapproved ones
        if (filters.uploaderId !== user?.id) {
           filters.isApproved = true;
        }
     }
     
     if (isApproved !== undefined) {
        filters.isApproved = isApproved === 'true';
     }
     
     if (search) {
       filters.OR = [
         { title: { contains: String(search) } },
         { abstract: { contains: String(search) } },
         { author: { name: { contains: String(search) } } }
       ];
     }
     if (type) filters.type = String(type);
     if (programStudy) filters.programStudy = String(programStudy);
     if (author) filters.author = { name: { contains: String(author) } };
     
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
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch publications' });
   }
};

// Get single publication
export const getPublicationById = async (req: Request, res: Response): Promise<void> => {
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
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch publication' });
   }
};

// Create publication (requires login)
export const createPublication = async (req: Request, res: Response): Promise<void> => {
   try {
     const { title, abstract, year, programStudy, type, scholarUrl, authorName, authorAffiliation, keywords } = req.body;
     const user = (req as any).user;
     
     if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
     }

     const file = req.file;
     const pdfUrl = file ? `/uploads/${file.filename}` : (req.body.pdfUrl || null);
     
     // Handle Author
     let authorRecord = await prisma.author.findFirst({ where: { name: authorName }});
     if (!authorRecord) {
        authorRecord = await prisma.author.create({
          data: { name: authorName, affiliation: authorAffiliation }
        });
     }
     
     // Handle Keywords
     let keywordArray: string[] = [];
     if (typeof keywords === 'string') {
        try {
           keywordArray = JSON.parse(keywords);
        } catch {
           keywordArray = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
        }
     } else if (Array.isArray(keywords)) {
        keywordArray = keywords;
     }
     
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
          pdfUrl, scholarUrl,
          isApproved: user.role === 'ADMIN', // Auto approve if admin
          author: { connect: { id: authorRecord.id } },
          uploader: { connect: { id: user.id } },
          keywords: { create: keywordConnections }
       },
       include: { author: true, keywords: true }
     });
     
     res.status(201).json(publication);
   } catch (error) {
     console.error('Create publication error:', error);
     res.status(500).json({ error: 'Failed to create publication' });
   }
};

// Update approval status (Admin only)
export const approvePublication = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     const { isApproved } = req.body;
     
     const publication = await prisma.publication.update({
       where: { id: String(id) },
       data: { isApproved },
       include: { author: true }
     });
     
     res.status(200).json(publication);
   } catch (error) {
     res.status(500).json({ error: 'Failed to update approval status' });
   }
};

// Update publication (Admin or Uploader)
export const updatePublication = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     const { title, abstract, year, programStudy, type, scholarUrl, authorName, authorAffiliation, keywords } = req.body;
     const user = (req as any).user;
     
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
         authorRecord = await prisma.author.findFirst({ where: { name: authorName }});
         if (!authorRecord) {
            authorRecord = await prisma.author.create({
              data: { name: authorName, affiliation: authorAffiliation || '' }
            });
         }
     }
     
     // Handle Keywords
     let keywordConnections: any = { set: [] }; // By default, clear old if keywords provided
     if (keywords) {
         let keywordArray: string[] = [];
         if (typeof keywords === 'string') {
            try {
               keywordArray = JSON.parse(keywords);
            } catch {
               keywordArray = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
            }
         } else if (Array.isArray(keywords)) {
            keywordArray = keywords;
         }
         
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
     } else {
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
          ...(scholarUrl && { scholarUrl }),
          ...(authorRecord && { author: { connect: { id: authorRecord.id } } }),
          ...(keywordConnections && { keywords: keywordConnections })
       },
       include: { author: true, keywords: true }
     });
     
     res.status(200).json(publication);
   } catch (error) {
     console.error('Update publication error:', error);
     res.status(500).json({ error: 'Failed to update publication' });
   }
};

// Delete publication
export const deletePublication = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     const user = (req as any).user;
     
     const pub = await prisma.publication.findUnique({ where: { id: String(id) }});
     if (!pub) {
        res.status(404).json({ error: 'Not found' });
        return;
     }
     
     // Only Admin or the original Uploader can delete
     if (user.role !== 'ADMIN' && pub.uploaderId !== user.id) {
        res.status(403).json({ error: 'Forbidden' });
        return;
     }
     
     await prisma.publication.delete({ where: { id: String(id) }});
     res.status(200).json({ message: 'Deleted successfully' });
   } catch (error) {
     res.status(500).json({ error: 'Failed to delete publication' });
   }
};
