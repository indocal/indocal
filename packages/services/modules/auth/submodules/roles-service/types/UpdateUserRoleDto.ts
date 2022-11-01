export type UpdateUserRoleDto = Partial<{
  type: string;
  name: string;
  description: string;
}>;

export default UpdateUserRoleDto;
