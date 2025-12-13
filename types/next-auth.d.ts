import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            userId: string;
            email: string;
            name: string;
        };
    }

    interface User {
        id: string;
        userId: string;
        email: string;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        userId: string;
        email: string;
        name: string;
    }
}


