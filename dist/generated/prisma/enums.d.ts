export declare const Role: {
    readonly STUDENT: 'STUDENT';
    readonly INSTRUCTOR: 'INSTRUCTOR';
    readonly ADMIN: 'ADMIN';
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const Level: {
    readonly BEGINNER: 'BEGINNER';
    readonly INTERMEDIATE: 'INTERMEDIATE';
    readonly ADVANCED: 'ADVANCED';
};
export type Level = (typeof Level)[keyof typeof Level];
export declare const PaymentStatus: {
    readonly PENDING: 'PENDING';
    readonly COMPLETED: 'COMPLETED';
    readonly FAILED: 'FAILED';
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map