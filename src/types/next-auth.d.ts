import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      profession: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    profession: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    profession: string;
  }
}
