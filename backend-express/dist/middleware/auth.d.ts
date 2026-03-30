import type { Request, Response, NextFunction } from 'express';
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const nonGuestMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map