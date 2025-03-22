import { Cylinder, notificationSetting, User, Circle } from '../types';

export const cylinders: Cylinder[] =
    [
        {
            id: 1,
            name: 'Pro gas home',
            currentWeight: 2,
            initialWeight: 3,
            active: true,
            provider: 'PRO GAS',
            sensorId: 'ar3f92PdDKd',
            lastRefill: '2021-01-01',
            circle: 10,
        },
        {
            id: 2,
            name: 'Pro gas office',
            currentWeight: 5,
            initialWeight: 6,
            active: true,
            provider: 'PRO GAS',
            sensorId: 'ar39o0PdDKd',
            lastRefill: '2021-01-01',
            circle: 8,
        },
        {
            id: 3,
            name: 'Pro gas factory',
            currentWeight: 7,
            initialWeight: 10,
            active: true,
            provider: 'PRO GAS',
            sensorId: 'ar39p1PdDKd',
            lastRefill: '2021-01-01',
            circle: 5,
        },
        {
            id: 4,
            name: 'K gas home',
            currentWeight: 1.8,
            initialWeight: 3,
            active: true,
            provider: 'PRO GAS',
            sensorId: 'p9r392PdDKd',
            lastRefill: '2021-01-01',
            circle: 1,
        },
        {
            id: 5,
            name: 'K gas School',
            currentWeight: 1.5,
            initialWeight: 3,
            active: true,
            provider: 'PRO GAS',
            sensorId: 'p9r392PdDKd',
            lastRefill: '2021-01-01',
            circle: 1,
        },
    ];

export const notificationSettings: notificationSetting[] = [
    {
        userId: 1,
        refillReminder: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        newCircleCylinderAlert: true,
        newCircleMemberAlert: true,
        promotions: true,
        alertThreshold: 20,
    },
    {
        userId: 2,
        refillReminder: false,
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        newCircleCylinderAlert: true,
        newCircleMemberAlert: true,
        promotions: false,
        alertThreshold: 35,
    },
    {
        userId: 3,
        refillReminder: true,
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: true,
        newCircleCylinderAlert: true,
        newCircleMemberAlert: true,
        promotions: true,
        alertThreshold: 15,
    },
];

export const circles: Circle[] = [];

export const users: User[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'password',
        circles: [],
    },
];
