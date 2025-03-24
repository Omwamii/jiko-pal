export type Cylinder = {
    id: number;
    creatorId: number;
    name: string;
    currentWeight: number;
    initialWeight: number;
    active: boolean;
    provider: string;
    sensorId: string;
    lastRefill: string;
    circle: number;
}

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    // circles: Circle[];
}

export type Circle = {
    id: number;
    name: string;
    cylinders: Cylinder[];
    members: User[];
    creator: User;
    joiningCode: string;
}

export type notificationSetting = {
    userId: number;
    refillReminder: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    newCircleCylinderAlert: boolean;
    newCircleMemberAlert: boolean;
    promotions: boolean;
    alertThreshold: number;
}
