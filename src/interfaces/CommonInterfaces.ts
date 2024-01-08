export interface JwtPayload {
    exp: number;
    iat: number;
    sub: string;
    user_id: number;
  }

  export interface ProjectData {
    name: string;
    projectPictureUrl: string;
    description: string;
    moneyGoal: number;
    deadline: string;
    userID: number;
  }

  export interface userProjectTypes {
    id: number;
    name: string;
    description: string;
    backers: number;
    deadline: Date;
    moneyAcquired: number;
    moneyGoal: number;
    projectPictureUrl: string;
    userID: number;
  }

  export interface loginTypes {
    email: string;
    password: string;
  }
  
  export interface userDataTypes {
    name: string;
    email: string;
    role: number;
    profilePictureUrl: string;
    phoneNumber: string;
    password: string;
  }
  export interface userProfileDataTypes {
    id:number;
    name: string;
    email: string;
    role: number;
    profilePictureUrl: string;
    phoneNumber: string;
    password: string;
    projects:[];
    favouriteProjects:[];
  }
  
  export interface UserContextType {
    user: number | undefined; 
    setUser: (userId: number) => void;
  }