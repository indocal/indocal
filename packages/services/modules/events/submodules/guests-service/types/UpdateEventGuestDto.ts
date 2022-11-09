export type UpdateEventGuestDto = Partial<{
  dni: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  position: string;
}>;

export default UpdateEventGuestDto;
