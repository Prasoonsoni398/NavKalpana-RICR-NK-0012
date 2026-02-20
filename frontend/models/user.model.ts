export interface Changepasswordrequest {
oldpassword:string;
  newpassword: string;
  confirmpassword: string;
}

export interface ChangepasswordResponse {
  message: string;
}