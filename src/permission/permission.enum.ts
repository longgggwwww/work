export enum Permission {
  GetRole = 'GET_ROLE',
  CreateAndModifyRole = 'CREATE_AND_MODIFY_ROLE',
  GrantRoleToUser = 'GRANT_ROLE_TO_USER',
  DeleteRole = 'DELETE_ROLE',

  GetUserRegistrationRequest = 'GET_USER_REGISTRATION_REQUEST',
  ApproveUserRegistrationRequest = 'APPROVE_USER_REGISTRATION_REQUEST',
  DeleteUserRegistrationRequest = 'DELETE_USER_REGISTRATION_REQUEST',

  CreateAndModifyCompany = 'CREATE_AND_MODIFY_COMPANY',
  RegisterCompany = 'REGISTER_COMPANY',
  GetCompany = 'GET_COMPANY',
  UpdateCompany = 'UDPATE_COMPANY',

  GetCompanyRegistrationRequest = 'GET_COMPANY_REGISTRATION_REQUEST',
  ApproveCompanyRegistrationRequest = 'APPROVE_COMPANY_REGISTRATION_REQUEST',
  DeleteCompany = 'DELETE_COMPANY',

  ModifySetting = 'MODIFY_SETTING',

  CreateAndModifyUser = 'CREATE_AND_MODIFY_USER',
  GetUser = 'GET_USER',
  DeleteUser = 'DELETE_USER',

  GetPosition = 'GET_POSITION',
  CreateAndModifyPosition = 'CREATE_AND_MODIFY_POSITION',
  DeletePosition = 'DELETE_POSITION',

  GetEmployee = 'GET_EMPLOYEE',
  AddEmployee = 'ADD_EMPLOYEE',
  FireEmployee = 'FIRE_EMPLOYEE',
}
