import type { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => void;
export declare const getSession: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map