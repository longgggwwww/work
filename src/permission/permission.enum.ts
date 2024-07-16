export enum Permission {
  ModifySetting = 'MODIFY_SETTING',

  GetUser = 'GET_USER',
  CreateAndModifyUser = 'CREATE_AND_MODIFY_USER',
  DeleteUser = 'DELETE_USER',

  GetUserRegistrationRequest = 'GET_USER_REGISTRATION_REQUEST',
  ApproveUserRegistrationRequest = 'APPROVE_USER_REGISTRATION_REQUEST',
  DeleteUserRegistrationRequest = 'DELETE_USER_REGISTRATION_REQUEST',

  GetRole = 'GET_ROLE',
  CreateAndModifyRole = 'CREATE_AND_MODIFY_ROLE',
  GrantRoleToUser = 'GRANT_ROLE_TO_USER',
  DeleteRole = 'DELETE_ROLE',

  RegisterCompany = 'REGISTER_COMPANY',
  GetCompany = 'GET_COMPANY',
  CreateAndModifyCompany = 'CREATE_AND_MODIFY_COMPANY',

  GetCompanyRegistrationRequest = 'GET_COMPANY_REGISTRATION_REQUEST',
  ApproveCompanyRegistrationRequest = 'APPROVE_COMPANY_REGISTRATION_REQUEST',
  DeleteCompany = 'DELETE_COMPANY',

  GetPosition = 'GET_POSITION',
  CreateAndModifyPosition = 'CREATE_AND_MODIFY_POSITION',
  DeletePosition = 'DELETE_POSITION',

  GetEmployee = 'GET_EMPLOYEE',
  AddEmployee = 'ADD_EMPLOYEE',
  FireEmployee = 'FIRE_EMPLOYEE',
}
